// The ideas of these variable names were ai-assisted
export const SAVED_WORKOUTS_STORAGE_KEY = 'savedPreBuiltWorkouts';
export const TIMER_HANDOFF_STORAGE_KEY = 'activeTimerDetails';
export const TIMER_EVENT_TICK = 'workout-timer:tick';
export const TIMER_EVENT_AUTO_COMPLETE = 'workout-timer:auto-complete';
export const TIMER_EVENT_SYNC_WORKOUT = 'workout-timer:sync-workout';

export const SECONDS_PER_MINUTE = 60;
export const AUTO_COMPLETE_MODE = 'elapsed-threshold'; // 'elapsed-threshold' | 'remaining-threshold'

// Defaults used whenever an exercise has no explicit sets / time.
// An exercise's `time` is its total WORK minutes (all sets), so the timer
// gives each set time / sets minutes. Rest is added on top, between sets.
export const DEFAULT_SETS = 3;
export const DEFAULT_SET_MINUTES = 2;
export const DEFAULT_REST_SECONDS = 2 * SECONDS_PER_MINUTE;
export const INCLUDE_REST_STORAGE_KEY = 'plannerIncludeRest';

function positiveNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : null;
}

export function resolveSets(sets) {
    return positiveNumber(sets) ?? DEFAULT_SETS;
}

// Default work time for an exercise: 2 minutes per set
export function defaultExerciseMinutes(sets) {
    return resolveSets(sets) * DEFAULT_SET_MINUTES;
}

// The exercise's own time when it has one, otherwise the per-set default
export function resolveExerciseMinutes(item) {
    return positiveNumber(item?.time) ?? defaultExerciseMinutes(item?.sets);
}

export function restSecondsFor(includeRest) {
    return includeRest ? DEFAULT_REST_SECONDS : 0;
}

// Rest is on unless the planner toggle saved false
export function loadIncludeRest() {
    try {
        return JSON.parse(window.localStorage.getItem(INCLUDE_REST_STORAGE_KEY)) !== false;
    } catch {
        return true;
    }
}

export function getActiveTimerItems(items = []) {
    return items.filter((item) => !Boolean(item?.completed));
}

// Work time of every exercise plus one rest between each pair of consecutive
// sets (the timer skips the rest after the very last set).
export function calculateTotalWorkoutDuration(items = [], restSeconds = 0) {
    const activeItems = getActiveTimerItems(items);
    const workSeconds = activeItems.reduce(
        (sum, item) => sum + resolveExerciseMinutes(item) * SECONDS_PER_MINUTE,
        0
    );
    const totalSets = activeItems.reduce((sum, item) => sum + resolveSets(item?.sets), 0);
    const totalSeconds = workSeconds + Math.max(0, totalSets - 1) * restSeconds;

    return {
        totalMinutes: Math.ceil(totalSeconds / SECONDS_PER_MINUTE),
        totalSeconds,
    };
}

export function buildTimerDetails(items = [], workoutTitle = 'Current Regime', restSeconds = DEFAULT_REST_SECONDS) {
    const activeItems = getActiveTimerItems(items);
    const { totalMinutes, totalSeconds } = calculateTotalWorkoutDuration(activeItems, restSeconds);

    const exercises = activeItems.map((item, idx) => {
        const mins = resolveExerciseMinutes(item);
        const sets = resolveSets(item?.sets);
        const durationSeconds = mins * SECONDS_PER_MINUTE;

        return {
            id: item.id ?? `regime-item-${idx}`,
            name: item.name,
            gif: item.gif ?? null,
            exerciseId: item.exerciseId ?? null,
             sets,
            time: mins,
            durationSeconds,
            thresholdSeconds: durationSeconds,
            completed: false,
        };
    });

    const firstExercise = exercises[0] || null;

    return {
        workoutName: workoutTitle,
        totalMinutes,
        totalSeconds,
        restSeconds,
        skippedCount: items.length - activeItems.length,
        targetExerciseId: firstExercise?.id ?? null,
        targetExerciseName: firstExercise?.name ?? null,
        targetThresholdSeconds: firstExercise?.thresholdSeconds ?? 0,
        autoCompleteMode: AUTO_COMPLETE_MODE,
        exercises,
        updatedAt: Date.now(),
    };
}

export function saveTimerDetails(details) {
    try {
        window.localStorage.setItem(TIMER_HANDOFF_STORAGE_KEY, JSON.stringify(details));
    } catch {
    }
}

export function loadTimerDetails() {
    try {
        const raw = window.localStorage.getItem(TIMER_HANDOFF_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function applyThresholdAutoComplete({
    items = [],
    elapsedSeconds = 0,
    remainingSeconds = null,
    exerciseName = null,
    exerciseId = null,
    isWorkoutDone = false,
    mode = AUTO_COMPLETE_MODE,
}) {
    let changed = false;

    const nextItems = items.map((item) => {
        if (item.completed) return item;

        const itemThresholdSeconds = resolveExerciseMinutes(item) * SECONDS_PER_MINUTE;

        const matchesExercise =
            (exerciseId && String(item.id) === String(exerciseId)) ||
            (exerciseName &&
                String(item.name).trim().toLowerCase() ===
                    String(exerciseName).trim().toLowerCase());

        const thresholdReached =
            isWorkoutDone ||
            (mode === 'remaining-threshold'
                ? typeof remainingSeconds === 'number' && remainingSeconds <= 0
                : elapsedSeconds >= itemThresholdSeconds);

        if (isWorkoutDone || (matchesExercise && thresholdReached)) {
            changed = true;
            return { ...item, completed: true };
        }

        return item;
    });

    return {
        items: nextItems,
        changed,
    };
}