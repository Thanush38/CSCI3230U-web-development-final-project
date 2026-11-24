const DEFAULT_EXERCISES_URL = 'https://oss.exercisedb.dev/api/v1/exercises?limit=30';

export const DEFAULT_SETS = 3;
export const DEFAULT_MINUTES = 10;

// ExerciseDB body parts (and a few common muscle names) -> planner sections
const GROUP_ALIASES = {
    chest: 'chest',
    pectorals: 'chest',
    back: 'back',
    lats: 'back',
    'upper back': 'back',
    legs: 'leg',
    leg: 'leg',
    'upper legs': 'leg',
    'lower legs': 'leg',
    quads: 'leg',
    hamstrings: 'leg',
    calves: 'leg',
    shoulders: 'shoulder',
    shoulder: 'shoulder',
    delts: 'shoulder',
    arms: 'arm',
    arm: 'arm',
    'upper arms': 'arm',
    'lower arms': 'arm',
    biceps: 'arm',
    triceps: 'arm',
    forearms: 'arm',
    core: 'core',
    abs: 'core',
    waist: 'core',
};

// Returns one of the six planner sections when the name is recognised.
// Anything else (e.g. ExerciseDB's "cardio" or "neck") keeps its own name,
// so it can still be added to the regime instead of being mislabelled.
export function normalizeMuscleGroup(rawGroup) {
    if (!rawGroup || typeof rawGroup !== 'string') return 'other';
    const cleaned = rawGroup.trim().toLowerCase();
    return GROUP_ALIASES[cleaned] || cleaned || 'other';
}

// ExerciseDB returns arrays (bodyParts, equipments); older shapes used strings.
function firstString(value) {
    const list = Array.isArray(value) ? value : [value];
    return list.find((v) => typeof v === 'string' && v.trim()) ?? null;
}

function joinStrings(value) {
    const list = (Array.isArray(value) ? value : [value])
        .filter((v) => typeof v === 'string' && v.trim());
    return list.length > 0 ? list.join(', ') : null;
}

export function mapApiExercise(raw, index = 0) {
    const rawName = raw?.name || raw?.title || `Exercise ${index + 1}`;
    const rawGroup =
        firstString(raw?.muscleGroup) ||
        firstString(raw?.bodyParts) ||
        firstString(raw?.bodyPart) ||
        firstString(raw?.targetMuscles) ||
        firstString(raw?.target) ||
        firstString(raw?.category);
    const equipment =
        joinStrings(raw?.equipments) ||
        joinStrings(raw?.equipment) ||
        'bodyweight';

    const instructions = Array.isArray(raw?.instructions)
        ? raw.instructions.filter(Boolean)
        : typeof raw?.instructions === 'string' && raw.instructions.trim()
            ? [raw.instructions.trim()]
            : ['Perform with controlled form and steady breathing.'];

    return {
        id: String(raw?.id ?? raw?.exerciseId ?? `api-ex-${index}`),
        name: String(rawName).trim(),
        muscleGroup: normalizeMuscleGroup(rawGroup),
        sets: Number.isInteger(Number(raw?.sets)) && Number(raw?.sets) > 0
            ? Number(raw?.sets)
            : DEFAULT_SETS,
        time: Number.isFinite(Number(raw?.time)) && Number(raw?.time) > 0
            ? Number(raw?.time)
            : DEFAULT_MINUTES,
        equipment,
        // raw API uses gifUrl; useExerciseSearch's toExercise() renames it to gif
        gif: firstString(raw?.gifUrl) || firstString(raw?.gif),
        instructions,
    };
}

export async function fetchExercises({ signal, url = DEFAULT_EXERCISES_URL } = {}) {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Exercise service responded with status ${response.status}`);
    }

    const payload = await response.json();
    const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.exercises)
                ? payload.exercises
                : [];

    return list.map((item, idx) => mapApiExercise(item, idx));
}