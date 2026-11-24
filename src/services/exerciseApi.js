const DEFAULT_EXERCISES_URL = 'https://oss.exercisedb.dev/api/v1/exercises?limit=30';

const GROUP_ALIASES = {
    chest: 'chest',
    pectorals: 'chest',
    back: 'back',
    lats: 'back',
    'upper back': 'back',
    legs: 'leg',
    leg: 'leg',
    quads: 'leg',
    hamstrings: 'leg',
    calves: 'leg',
    shoulders: 'shoulder',
    shoulder: 'shoulder',
    delts: 'shoulder',
    arms: 'arm',
    arm: 'arm',
    biceps: 'arm',
    triceps: 'arm',
    forearms: 'arm',
    core: 'core',
    abs: 'core',
    waist: 'core',
};

export function normalizeMuscleGroup(rawGroup) {
    if (!rawGroup || typeof rawGroup !== 'string') return 'chest';
    const cleaned = rawGroup.trim().toLowerCase();
    return GROUP_ALIASES[cleaned] || 'chest';
}

export function mapApiExercise(raw, index = 0) {
    const rawName = raw?.name || raw?.title || `Exercise ${index + 1}`;
    const rawGroup =
        raw?.muscleGroup ||
        raw?.bodyPart ||
        raw?.target ||
        raw?.category ||
        'chest';

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
            : 3,
        time: Number.isFinite(Number(raw?.time)) && Number(raw?.time) > 0
            ? Number(raw?.time)
            : 10,
        equipment: raw?.equipment ? String(raw.equipment) : 'Bodyweight',
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