import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    loadTimerDetails,
    TIMER_EVENT_TICK,
    TIMER_EVENT_AUTO_COMPLETE,
    TIMER_EVENT_SYNC_WORKOUT,
    AUTO_COMPLETE_MODE,
    SECONDS_PER_MINUTE,
    loadIncludeRest,
    restSecondsFor,
    resolveSets,
    resolveExerciseMinutes,
} from '../../utils/timerAutoComplete'
import { LOCAL_EXERCISE_IDS, resolveExerciseGif, resolveExerciseDbId } from '../../utils/exerciseImages'
import ExerciseImage from '../../ExerciseImage'
import './Timer.css'

// Demo workouts, shown only when nothing has been saved in the planner yet.
const DEMO_WORKOUTS = [
    {
        id: 'push',
        name: 'Push Day',
        exercises: [
            { id: 'pushup', name: 'Push-Up', sets: 3, work: 45, rest: 30 },
            { id: 'benchpress', name: 'Bench Press', sets: 3, work: 40, rest: 45 },
            { id: 'overheadpress', name: 'Overhead Press', sets: 3, work: 40, rest: 45 },
            { id: 'tricepdips', name: 'Tricep Dips', sets: 3, work: 30, rest: 30 },
            { id: 'plank', name: 'Plank', sets: 2, work: 60, rest: 30 },
        ],
    },
    {
        id: 'full',
        name: 'Full Body Day',
        exercises: [
            { id: 'bodyweightsquat', name: 'Bodyweight Squat', sets: 3, work: 45, rest: 30 },
            { id: 'deadlift', name: 'Deadlift', sets: 3, work: 40, rest: 60 },
            { id: 'pullup', name: 'Pull-Up', sets: 3, work: 30, rest: 45 },
            { id: 'bentoverrow', name: 'Bent-Over Row', sets: 3, work: 40, rest: 45 },
            { id: 'bicepcurl', name: 'Bicep Curl', sets: 3, work: 30, rest: 30 },
        ],
    },
]

// The planner saves builds here as { [buildName]: [{ name, sets, time }] }
const STORAGE_KEY = 'savedPreBuiltWorkouts'
const REGIME_STORAGE_KEY = 'plannerRegimeItems'
const SECTIONS_STORAGE_KEY = 'plannerSectionEntries'

// Rest between sets for planner workouts, following the planner's rest toggle
function plannerRestSeconds() {
    return restSecondsFor(loadIncludeRest())
}

// planner exercise names -> ids used for the local gif files and exercise routes
const EXERCISE_IDS = LOCAL_EXERCISE_IDS

// Demo workouts only have ids matching the files in public/exercises; planner
// exercises carry a resolved gif (null when there is none -> placeholder).
function exerciseGif(exercise) {
    return 'gif' in exercise ? exercise.gif : `/exercises/${exercise.id}.gif`
}

// Real ExerciseDB id for the detail page link and the completed history.
// Planner exercises carry it; demo exercises are looked up by their local id.
function exerciseDbId(exercise) {
    return exercise.exerciseId ?? resolveExerciseDbId({ localId: exercise.id })
}

const EXERCISE_TO_GROUP = {
    'Push-up': 'chest',
    'Bench Press': 'chest',
    'Pull-up': 'back',
    'Bent-Over Row': 'back',
    'Bodyweight Squat': 'leg',
    Deadlift: 'leg',
    'Overhead Press': 'shoulder',
    'Bicep Curl': 'arm',
    'Tricep Dip': 'arm',
    Plank: 'core',
}

function normalizeName(name) {
    return String(name || '').trim().toLowerCase()
}

function areAllRegimeItemsCompleted() {
    try {
        const raw = localStorage.getItem(REGIME_STORAGE_KEY)
        const items = raw ? JSON.parse(raw) : []
        return Array.isArray(items) && items.length > 0 && items.every(item => Boolean(item.completed))
    } catch {
        return false
    }
}

function markExerciseCompletedInStorage({ exerciseId, exerciseName }) {
    try {
        const raw = localStorage.getItem(REGIME_STORAGE_KEY)
        const items = raw ? JSON.parse(raw) : []
        if (!Array.isArray(items) || items.length === 0) return

        const targetNorm = normalizeName(exerciseName)
        let changed = false

        const updated = items.map((item) => {
            const idMatch = exerciseId && String(item.id) === String(exerciseId)
            const nameMatch = targetNorm && normalizeName(item.name) === targetNorm
            if ((idMatch || nameMatch) && !item.completed) {
                changed = true
                return { ...item, completed: true }
            }
            return item
        })

        if (changed) {
            localStorage.setItem(REGIME_STORAGE_KEY, JSON.stringify(updated))
        }
    } catch {
        // Ignore storage errors
    }
}

function syncWorkoutToStorage(targetWorkout, completedNames = []) {
    if (!targetWorkout || !Array.isArray(targetWorkout.exercises)) return
    try {
        const completedSet = new Set(completedNames.map(normalizeName))
        const emptySections = {
            chest: [],
            back: [],
            leg: [],
            shoulder: [],
            arm: [],
            core: [],
        }

        const nextRegime = targetWorkout.exercises.map((ex, idx) => {
            const group = EXERCISE_TO_GROUP[ex.name] || 'chest'
            const minutes = Math.max(1, Math.round(((ex.work || 30) * (ex.sets || 1)) / SECONDS_PER_MINUTE))
            const entry = {
                id: ex.regimeItemId || ex.id || `timer-${idx}-${Date.now()}`,
                muscleGroup: group,
                name: ex.name,
                sets: Number(ex.sets) || 3,
                time: minutes,
                completed: completedSet.has(normalizeName(ex.name)),
            }
            emptySections[group].push(entry)
            return entry
        })

        localStorage.setItem(REGIME_STORAGE_KEY, JSON.stringify(nextRegime))
        localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(emptySections))
    } catch {
        // Ignore storage errors
    }
}

// planner stores time as total work minutes for the exercise, so split it across the sets
function toExercise(item, rest) {
    const sets = resolveSets(parseInt(item.sets, 10))
    const minutes = resolveExerciseMinutes({ sets, time: item.time })
    return {
        id: EXERCISE_IDS[item.name] ?? String(item.name).toLowerCase().replace(/[^a-z]/g, ''),
        regimeItemId: item.id ?? null,
        name: item.name,
        gif: resolveExerciseGif(item.name, item.gif),
        exerciseId: resolveExerciseDbId({ name: item.name, exerciseId: item.exerciseId }),
        sets,
        work: Math.max(1, Math.round((minutes * SECONDS_PER_MINUTE) / sets)),
        rest,
    }
}

function loadSavedWorkouts() {
    const rest = plannerRestSeconds()
    let saved
    try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch {
        return []
    }
    if (!saved || typeof saved !== 'object') return []

    return Object.entries(saved)
        .filter(([, items]) => Array.isArray(items) && items.length > 0)
        .map(([name, items]) => ({ id: `saved-${name}`, name, exercises: items.map(item => toExercise(item, rest)) }))
}

const RING_LENGTH = 2 * Math.PI * 90

// goes over the list of exercises and builds a list of steps, including work and rest periods
function buildSteps(exercises) {
    const sets = exercises.flatMap(exercise =>
        Array.from({ length: exercise.sets }, (_, i) => ({ exercise, set: i + 1 }))
    )

    return sets.flatMap(({ exercise, set }, i) => {
        const work = { id: `${exercise.id}-${set}-work`, type: 'Work', exercise, set, seconds: exercise.work }
        const next = sets[i + 1]
        // no rest after the last set, or when rest is turned off
        if (!next || !(exercise.rest > 0)) return [work]

        const rest = { id: `${exercise.id}-${set}-rest`, type: 'Rest', exercise: next.exercise, set: next.set, seconds: exercise.rest }
        return [work, rest]
    })
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

function describeNext(step, nextStep) {
    if (!nextStep) return 'Last set, finish strong!'
    if (nextStep.type === 'Rest') {
        const after = nextStep.exercise === step.exercise ? `set ${nextStep.set}` : nextStep.exercise.name
        return `Next: ${formatTime(nextStep.seconds)} rest, then ${after}`
    }
    return `Next: ${nextStep.exercise.name}, set ${nextStep.set} of ${nextStep.exercise.sets}`
}

function Timer(props) {
    const location = useLocation()
    const incomingDetails = location.state?.timerDetails || loadTimerDetails()
    const autoCompleteMode = incomingDetails?.autoCompleteMode || AUTO_COMPLETE_MODE

    const [savedWorkouts] = useState(loadSavedWorkouts)
    const baseWorkouts = savedWorkouts.length > 0 ? savedWorkouts : DEMO_WORKOUTS

    const workouts = useMemo(() => {
        if (!incomingDetails?.totalMinutes || !Array.isArray(incomingDetails.exercises) || incomingDetails.exercises.length === 0) {
            return baseWorkouts
        }

        const customWorkout = {
            id: 'planner-active-regime',
            name: incomingDetails.workoutName || 'Planner Regime',
            exercises: incomingDetails.exercises.map((ex, i) => {
                const sets = resolveSets(ex.sets)
                const totalExerciseSeconds = resolveExerciseMinutes({ sets, time: ex.time }) * SECONDS_PER_MINUTE
                return {
                    id: EXERCISE_IDS[ex.name] ?? ex.id ?? `regime-ex-${i}`,
                    regimeItemId: ex.id ?? null,
                    name: ex.name,
                    gif: resolveExerciseGif(ex.name, ex.gif),
                    exerciseId: resolveExerciseDbId({ name: ex.name, exerciseId: ex.exerciseId }),
                    sets,
                    work: Math.max(1, Math.round(totalExerciseSeconds / sets)),
                    rest: incomingDetails.restSeconds ?? plannerRestSeconds(),
                }
            }),
        }

        return [customWorkout, ...baseWorkouts.filter(w => w.id !== 'planner-active-regime')]
    }, [baseWorkouts, incomingDetails])

    const hasSaved = savedWorkouts.length > 0 || Boolean(incomingDetails?.exercises?.length)

    const [workoutId, setWorkoutId] = useState(workouts[0].id)
    const [position, setPosition] = useState({ index: 0, elapsed: 0 })
    const [isRunning, setIsRunning] = useState(false)

    const workout = workouts.find(w => w.id === workoutId) ?? workouts[0]
    const steps = useMemo(() => buildSteps(workout.exercises), [workout])
    const prevIndexRef = useRef(0)

    const isDone = position.index >= steps.length
    const isTicking = isRunning && !isDone

    useEffect(() => {
        if (!isTicking) return

        const interval = setInterval(() => {
            setPosition(p => p.elapsed + 1 < steps[p.index].seconds
                ? { ...p, elapsed: p.elapsed + 1 }
                : { index: p.index + 1, elapsed: 0 })
        }, 1000)

        return () => clearInterval(interval)
    }, [isTicking, steps])

    // add each finished workout (date + ExerciseDB ids and sets) to the history so other pages can use it.
    // The Goals page fetches each id from ExerciseDB, so exercises without a real id are left out.
    useEffect(() => {
        if (!isDone) return
        const history = JSON.parse(localStorage.getItem('completedWorkouts')) || []
        history.push({
            date: new Date().toISOString(),
            exercises: workout.exercises
                .map(e => ({ id: exerciseDbId(e), sets: e.sets }))
                .filter(e => e.id),
        })
        localStorage.setItem('completedWorkouts', JSON.stringify(history))
    }, [isDone, workout])

    // notify planner listener and persist completion as exercises finish or the full workout ends
    useEffect(() => {
        const previousStep = steps[prevIndexRef.current]
        const activeStep = steps[position.index]
        const activeExercise = activeStep?.exercise
        const currentSecondsLeft = isDone || !activeStep ? 0 : activeStep.seconds - position.elapsed

        const cumulativeExerciseElapsed = activeExercise
            ? steps
                .slice(0, position.index)
                .filter(s => s.type === 'Work' && s.exercise.name === activeExercise.name)
                .reduce((sum, s) => sum + s.seconds, 0) + (activeStep.type === 'Work' ? position.elapsed : 0)
            : 0

        const detail = {
            workoutName: workout.name,
            exerciseId: activeExercise?.regimeItemId ?? activeExercise?.id ?? null,
            exerciseName: activeExercise?.name ?? null,
            elapsedSeconds: cumulativeExerciseElapsed,
            secondsLeft: currentSecondsLeft,
            isDone,
            mode: autoCompleteMode,
        }

        window.dispatchEvent(new CustomEvent(TIMER_EVENT_TICK, { detail }))

        const completedWorkStep =
            previousStep?.type === 'Work' &&
            position.index > prevIndexRef.current &&
            previousStep.set === previousStep.exercise.sets

        if (isDone) {
            workout.exercises.forEach((ex) => {
                markExerciseCompletedInStorage({
                    exerciseId: ex.regimeItemId ?? ex.id ?? null,
                    exerciseName: ex.name,
                })
            })
            window.dispatchEvent(
                new CustomEvent(TIMER_EVENT_AUTO_COMPLETE, {
                    detail: { ...detail, isDone: true },
                })
            )
        } else if (completedWorkStep) {
            const completedExercise = previousStep.exercise
            const completedDetail = {
                ...detail,
                exerciseId: completedExercise?.regimeItemId ?? completedExercise?.id ?? null,
                exerciseName: completedExercise?.name ?? null,
                elapsedSeconds: Math.max(1, (completedExercise?.work ?? 30) * (completedExercise?.sets ?? 1)),
                secondsLeft: 0,
            }
            markExerciseCompletedInStorage({
                exerciseId: completedDetail.exerciseId,
                exerciseName: completedDetail.exerciseName,
            })
            window.dispatchEvent(new CustomEvent(TIMER_EVENT_AUTO_COMPLETE, { detail: completedDetail }))
        }

        prevIndexRef.current = position.index
    }, [position, isDone, steps, workout, autoCompleteMode])

    function dispatchWorkoutSync(targetWorkout, completedExerciseNames = []) {
        if (!targetWorkout) return
        syncWorkoutToStorage(targetWorkout, completedExerciseNames)
        window.dispatchEvent(
            new CustomEvent(TIMER_EVENT_SYNC_WORKOUT, {
                detail: {
                    workoutId: targetWorkout.id,
                    workoutName: targetWorkout.name,
                    completedExerciseNames,
                    exercises: targetWorkout.exercises.map((ex, idx) => ({
                        id: ex.regimeItemId ?? ex.id ?? `timer-ex-${idx}`,
                        name: ex.name,
                        sets: ex.sets,
                        time: Math.max(1, Math.round(((ex.work || 30) * (ex.sets || 1)) / SECONDS_PER_MINUTE)),
                        completed: completedExerciseNames.includes(ex.name),
                    })),
                },
            })
        )
    }

    function handleChooseWorkout(id) {
        const nextWorkout = workouts.find(w => w.id === id) ?? workouts[0]
        prevIndexRef.current = 0
        setWorkoutId(id)
        setPosition({ index: 0, elapsed: 0 })
        setIsRunning(false)
        dispatchWorkoutSync(nextWorkout, [])
    }

    function handleToggle() {
        setIsRunning(running => {
            if (!running && areAllRegimeItemsCompleted()) {
                prevIndexRef.current = 0
                setPosition({ index: 0, elapsed: 0 })
                dispatchWorkoutSync(workout, [])
                return true
            }
            return !running
        })
    }

    function handleSkip() {
        const currentStep = steps[position.index]
        const skippedExercise = currentStep?.type === 'Work' ? currentStep.exercise : null

        if (skippedExercise) {
            const skipDetail = {
                workoutName: workout.name,
                exerciseId: skippedExercise.regimeItemId ?? skippedExercise.id ?? null,
                exerciseName: skippedExercise.name,
                elapsedSeconds: Math.max(1, (skippedExercise.work || 30) * (skippedExercise.sets || 1)),
                secondsLeft: 0,
                isDone: false,
                skipped: true,
                mode: autoCompleteMode,
            }
            markExerciseCompletedInStorage({
                exerciseId: skipDetail.exerciseId,
                exerciseName: skipDetail.exerciseName,
            })
            window.dispatchEvent(new CustomEvent(TIMER_EVENT_AUTO_COMPLETE, { detail: skipDetail }))
        }

        setPosition(p => ({ index: p.index + 1, elapsed: 0 }))
    }

    function handleStop() {
        prevIndexRef.current = 0
        setPosition({ index: 0, elapsed: 0 })
        setIsRunning(false)
    }

    function handleRestart() {
    prevIndexRef.current = 0
    setPosition({ index: 0, elapsed: 0 })
    dispatchWorkoutSync(workout, [])
    setIsRunning(true)
}

    const step = steps[position.index]
    const secondsLeft = isDone ? 0 : step.seconds - position.elapsed
    const currentExercise = isDone ? workout.exercises.length : workout.exercises.indexOf(step.exercise)
    const hasStarted = position.index > 0 || position.elapsed > 0

    return <>
        <section id="choose-workout">
            <h2>Choose a Workout</h2>
            {!hasSaved && (
                <p className="timer-note">
                    No saved workouts yet. Save a build in the <Link to="/planner">Workout Planner</Link> to see it here. Showing demo workouts for now.
                </p>
            )}
            <div className="workout-choices">
                {workouts.map(w => (
                    <button
                        key={w.id}
                        type="button"
                        className={w.id === workoutId ? 'choice selected' : 'choice'}
                        aria-pressed={w.id === workoutId}
                        onClick={() => handleChooseWorkout(w.id)}
                    >
                        {w.name}
                    </button>
                ))}
            </div>
        </section>

        {isDone ? (
            <section id="timer" className="timer">
                <h2>Workout Complete</h2>
                <p className="timer-set">Nice work, you finished {workout.name}.</p>
                <div className="timer-controls">
                    <button type="button" onClick={handleRestart}>Start Again</button>
                </div>
            </section>
        ) : (
            <section id="timer" className="timer">
                <h2>{step.type === 'Work' ? step.exercise.name : 'Rest'}</h2>
                <p className="timer-set">
                    {step.type === 'Work'
                        ? `Set ${step.set} of ${step.exercise.sets} · Work`
                        : `Up next: ${step.exercise.name}, set ${step.set} of ${step.exercise.sets}`}
                </p>

                <div className="timer-body">
                    <ExerciseImage src={exerciseGif(step.exercise)} alt={`${step.exercise.name} demonstration`} />

                    <svg className="timer-ring" viewBox="0 0 200 200" role="img" aria-label={`${secondsLeft} seconds remaining`}>
                        <circle className="ring-track" cx="100" cy="100" r="90"></circle>
                        <circle
                            className={step.type === 'Rest' ? 'ring-progress resting' : 'ring-progress'}
                            cx="100" cy="100" r="90"
                            strokeDasharray={RING_LENGTH}
                            strokeDashoffset={RING_LENGTH * (1 - secondsLeft / step.seconds)}
                        ></circle>
                        <text x="100" y="112" textAnchor="middle">{formatTime(secondsLeft)}</text>
                    </svg>
                </div>

                <p className="timer-next">{describeNext(step, steps[position.index + 1])}</p>

                <div className="timer-controls">
                    <button type="button" onClick={handleToggle}>
                        {isRunning ? 'Pause' : hasStarted ? 'Resume' : 'Start'}
                    </button>
                    <button type="button" onClick={handleSkip}>Skip</button>
                    <button type="button" className="stop" onClick={handleStop}>Stop</button>
                </div>
            </section>
        )}

        <section id="workout-list" className="workout-list">
            <h2>{workout.name}</h2>
            <ol>
                {workout.exercises.map((exercise, i) => (
                    <li
                        key={`${exercise.id}-${i}`}
                        className={i === currentExercise ? 'current' : i < currentExercise ? 'finished' : ''}
                    >
                        {exerciseDbId(exercise)
                            ? <Link to={`/exercises/${exerciseDbId(exercise)}`}>{exercise.name}</Link>
                            : <span>{exercise.name}</span>}
                        <span>
                            {exercise.sets} × {formatTime(exercise.work)}
                            {exercise.rest > 0 ? `, ${formatTime(exercise.rest)} rest` : ', no rest'}
                        </span>
                    </li>
                ))}
            </ol>
        </section>
    </>
}

export default Timer