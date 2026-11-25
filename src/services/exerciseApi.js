const DEFAULT_EXERCISES_URL = 'https://oss.exercisedb.dev/api/v1/exercises?limit=30';

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

function firstString(value) {
    if (Array.isArray(value)) {
        const found = value.find((v) => typeof v === 'string' && v.trim());
        return found ? found.trim() : '';
    }
    return typeof value === 'string' ? value.trim() : '';
}

export function normalizeMuscleGroup(rawGroup) {
    const text = firstString(rawGroup).toLowerCase();
    if (!text) return 'other';

    if (GROUP_ALIASES[text]) {
        return GROUP_ALIASES[text];
    }

    if (text.includes('chest') || text.includes('pector')) return 'chest';
    if (text.includes('back') || text.includes('lat') || text.includes('trap')) return 'back';
    if (text.includes('leg') || text.includes('quad') || text.includes('hamstring') || text.includes('glute') || text.includes('calf')) return 'leg';
    if (text.includes('shoulder') || text.includes('delt')) return 'shoulder';
    if (text.includes('arm') || text.includes('bicep') || text.includes('tricep') || text.includes('forearm')) return 'arm';
    if (text.includes('core') || text.includes('waist') || text.includes('ab')) return 'core';

    return 'other';
}

export function mapApiExercise(raw, index = 0) {
    const rawName = firstString(raw?.name) || firstString(raw?.title) || `Exercise ${index + 1}`;
    const rawGroup =
        firstString(raw?.muscleGroup) ||
        firstString(raw?.bodyPart) ||
        firstString(raw?.target) ||
        firstString(raw?.targetMuscles) ||
        firstString(raw?.bodyParts) ||
        firstString(raw?.category) ||
        'other';

    const equipment =
        firstString(raw?.equipment) ||
        firstString(raw?.equipments) ||
        'Bodyweight';

    const instructions = Array.isArray(raw?.instructions)
        ? raw.instructions.filter(Boolean)
        : typeof raw?.instructions === 'string' && raw.instructions.trim()
            ? [raw.instructions.trim()]
            : ['Perform with controlled form and steady breathing.'];

    return {
        id: String(raw?.id ?? raw?.exerciseId ?? `api-ex-${index}`),
        name: rawName,
        muscleGroup: normalizeMuscleGroup(rawGroup),
        sets: Number.isInteger(Number(raw?.sets)) && Number(raw?.sets) > 0
            ? Number(raw?.sets)
            : 3,
        time: Number.isFinite(Number(raw?.time)) && Number(raw?.time) > 0
            ? Number(raw?.time)
            : 10,
        equipment,
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