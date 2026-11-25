// Extractable timer configuration variables
export const SAVED_WORKOUTS_STORAGE_KEY = 'savedPreBuiltWorkouts';
export const TIMER_HANDOFF_STORAGE_KEY = 'activeTimerDetails';
export const TIMER_EVENT_TICK = 'workout-timer:tick';
export const TIMER_EVENT_AUTO_COMPLETE = 'workout-timer:auto-complete';
export const TIMER_EVENT_SYNC_WORKOUT = 'workout-timer:sync-workout';

export const DEFAULT_EXERCISE_MINUTES = 5;
export const SECONDS_PER_MINUTE = 60;
export const DEFAULT_REST_SECONDS = 30;
export const AUTO_COMPLETE_MODE = 'elapsed-threshold'; // 'elapsed-threshold' | 'remaining-threshold'

export function getActiveTimerItems(items = []) {
    return items.filter((item) => !Boolean(item?.completed));
}

export function calculateTotalWorkoutDuration(items = []) {
    const activeItems = getActiveTimerItems(items);
    const totalMinutes = activeItems.reduce((sum, item) => {
        const mins = Number(item?.time);
        return sum + (Number.isFinite(mins) && mins > 0 ? mins : 0);
    }, 0);

    const safeMinutes = totalMinutes > 0 ? totalMinutes : DEFAULT_EXERCISE_MINUTES;
    return {
        totalMinutes: safeMinutes,
        totalSeconds: safeMinutes * SECONDS_PER_MINUTE,
    };
}

export function buildTimerDetails(items = [], workoutTitle = 'Current Regime') {
    const activeItems = getActiveTimerItems(items);
    const { totalMinutes, totalSeconds } = calculateTotalWorkoutDuration(activeItems);

    const exercises = activeItems.map((item, idx) => {
        const mins = Number(item?.time) > 0 ? Number(item.time) : DEFAULT_EXERCISE_MINUTES;
        const sets = Number(item?.sets) > 0 ? Number(item.sets) : 1;
        const durationSeconds = mins * SECONDS_PER_MINUTE;

        return {
            id: item.id ?? `regime-item-${idx}`,
            name: item.name,
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
        // Ignore storage errors
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

        const itemMinutes = Number(item?.time) > 0 ? Number(item.time) : DEFAULT_EXERCISE_MINUTES;
        const itemThresholdSeconds = itemMinutes * SECONDS_PER_MINUTE;

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