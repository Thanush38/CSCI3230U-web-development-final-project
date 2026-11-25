import { DEFAULT_SETS, defaultExerciseMinutes } from '../utils/timerAutoComplete';

const DEFAULT_EXERCISES_URL = 'https://oss.exercisedb.dev/api/v1/exercises?limit=30';

// ExerciseDB body parts (and a few common muscle names) -> planner sections
const GROUP_ALIASES = {
    chest: 'chest',
    pectorals: 'chest',
    pecs: 'chest',

    back: 'back',
    lats: 'back',
    'upper back': 'back',
    'lower back': 'back',
    traps: 'back',

    legs: 'leg',
    leg: 'leg',
    'upper legs': 'leg',
    'lower legs': 'leg',
    quads: 'leg',
    quadriceps: 'leg',
    hamstrings: 'leg',
    glutes: 'leg',
    calves: 'leg',

    shoulders: 'shoulder',
    shoulder: 'shoulder',
    delts: 'shoulder',
    deltoids: 'shoulder',

    arms: 'arm',
    arm: 'arm',
    'upper arms': 'arm',
    'lower arms': 'arm',
    biceps: 'arm',
    triceps: 'arm',
    forearms: 'arm',

    core: 'core',
    abs: 'core',
    abdominals: 'core',
    waist: 'core',
};

// ExerciseDB returns arrays (bodyParts, equipments); older shapes used strings.
function firstString(value) {
    const list = Array.isArray(value) ? value : [value];
    const found = list.find((v) => typeof v === 'string' && v.trim());
    return found ? found.trim() : '';
}

function joinStrings(value) {
    const list = (Array.isArray(value) ? value : [value])
        .filter((v) => typeof v === 'string' && v.trim())
        .map((v) => v.trim());
    return list.length > 0 ? list.join(', ') : '';
}

// Returns one of the six planner sections when the name is recognised.
// Anything else (e.g. ExerciseDB's "cardio" or "neck") keeps its own name,
// so it can still be added to the regime instead of being mislabelled.
export function normalizeMuscleGroup(rawGroup) {
    const text = firstString(rawGroup).toLowerCase();
    if (!text) return 'other';

    if (GROUP_ALIASES[text]) return GROUP_ALIASES[text];

    if (text.includes('chest') || text.includes('pector')) return 'chest';
    if (text.includes('back') || text.includes('lat') || text.includes('trap')) return 'back';
    if (text.includes('leg') || text.includes('quad') || text.includes('hamstring') || text.includes('glute') || text.includes('calf')) return 'leg';
    if (text.includes('shoulder') || text.includes('delt')) return 'shoulder';
    if (text.includes('arm') || text.includes('bicep') || text.includes('tricep') || text.includes('forearm')) return 'arm';
    if (text.includes('core') || text.includes('waist') || text.includes('abs') || text.includes('abdom')) return 'core';

    return text;
}

export function mapApiExercise(raw, index = 0) {
    const rawName = firstString(raw?.name) || firstString(raw?.title) || `Exercise ${index + 1}`;
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

    const sets = Number.isInteger(Number(raw?.sets)) && Number(raw?.sets) > 0
        ? Number(raw?.sets)
        : DEFAULT_SETS;

    return {
        id: String(raw?.id ?? raw?.exerciseId ?? `api-ex-${index}`),
        name: rawName,
        muscleGroup: normalizeMuscleGroup(rawGroup),
        sets,
        // ExerciseDB has no duration, so default to 2 minutes of work per set
        time: Number.isFinite(Number(raw?.time)) && Number(raw?.time) > 0
            ? Number(raw?.time)
            : defaultExerciseMinutes(sets),
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