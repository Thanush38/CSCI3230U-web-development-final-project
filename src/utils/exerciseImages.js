// Planner exercise names -> local files in public/exercises (and the ids the
// timer uses for them). Only the original ten exercises have local GIFs.
export const LOCAL_EXERCISE_IDS = {
    'Push-up': 'pushup',
    'Bench Press': 'benchpress',
    'Pull-up': 'pullup',
    'Bent-Over Row': 'bentoverrow',
    'Bodyweight Squat': 'bodyweightsquat',
    'Deadlift': 'deadlift',
    'Overhead Press': 'overheadpress',
    'Bicep Curl': 'bicepcurl',
    'Tricep Dip': 'tricepdips',
    'Plank': 'plank',
};

// Local exercise id -> real ExerciseDB id (the same ones the home page
// highlights use), so these link to /exercises/:id and the Goals page can
// fetch them.
const EXERCISEDB_IDS = {
    pushup: 'I4hDWkc',
    benchpress: 'EIeI8Vf',
    pullup: 'lBDjFxJ',
    bentoverrow: 'eZyBC3j',
    bodyweightsquat: '6YUfHPL',
    deadlift: 'ila4NZS',
    overheadpress: 'Kyd9Rz5',
    bicepcurl: 'NbVPDMW',
    tricepdips: 'bZq4bwK',
    plank: 'CosupLu',
};

/**
 * Returns the ExerciseDB id for an exercise: the stored one if we have it,
 * otherwise the known id for one of the original ten (looked up by planner
 * name or by local id), otherwise null.
 */
export function resolveExerciseDbId({ name, exerciseId, localId } = {}) {
    if (typeof exerciseId === 'string' && exerciseId.trim()) return exerciseId;
    const local = localId ?? LOCAL_EXERCISE_IDS[name];
    return EXERCISEDB_IDS[local] ?? null;
}

/**
 * Picks the image for an exercise: the local GIF for the original ten,
 * otherwise the ExerciseDB gif URL we stored, otherwise null.
 * Render the result with <ExerciseImage>, which shows the placeholder for
 * null or for a URL that fails to load.
 */
export function resolveExerciseGif(name, gif) {
    const localId = LOCAL_EXERCISE_IDS[name];
    if (localId) return `/exercises/${localId}.gif`;
    return typeof gif === 'string' && gif.trim() ? gif : null;
}
