import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    loadTimerDetails,
    TIMER_EVENT_TICK,
    TIMER_EVENT_AUTO_COMPLETE,
    AUTO_COMPLETE_MODE,
    SECONDS_PER_MINUTE,
} from '../../utils/timerAutoComplete'
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
const DEFAULT_REST = 30

// planner exercise names -> ids used for the gif files and exercise routes
const EXERCISE_IDS = {
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
}

// planner stores time as total minutes for the exercise, so split it across the sets
function toExercise(item) {
    const sets = parseInt(item.sets, 10) || 1
    const minutes = parseInt(item.time, 10) || 1
    return {
        id: EXERCISE_IDS[item.name] ?? String(item.name).toLowerCase().replace(/[^a-z]/g, ''),
        name: item.name,
        sets,
        work: Math.max(1, Math.round((minutes * 60) / sets)),
        rest: DEFAULT_REST,
    }
}

function loadSavedWorkouts() {
    let saved
    try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch {
        return []
    }
    if (!saved || typeof saved !== 'object') return []

    return Object.entries(saved)
        .filter(([, items]) => Array.isArray(items) && items.length > 0)
        .map(([name, items]) => ({ id: `saved-${name}`, name, exercises: items.map(toExercise) }))
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
        if (!next) return [work]

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
        return `Next: ${nextStep.seconds} sec rest, then ${after}`
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
                const sets = Math.max(1, Number(ex.sets) || 1)
                const totalExerciseSeconds = Math.max(1, (Number(ex.time) || 1) * SECONDS_PER_MINUTE)
                return {
                    id: EXERCISE_IDS[ex.name] ?? ex.id ?? `regime-ex-${i}`,
                    name: ex.name,
                    sets,
                    work: Math.max(1, Math.round(totalExerciseSeconds / sets)),
                    rest: incomingDetails.restSeconds ?? DEFAULT_REST,
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

    // add each finished workout (date + exercise ids and sets) to the history so other pages can use it
    useEffect(() => {
        if (!isDone) return
        const history = JSON.parse(localStorage.getItem('completedWorkouts')) || []
        history.push({
            date: new Date().toISOString(),
            exercises: workout.exercises.map(e => ({ id: e.id, sets: e.sets })),
        })
        localStorage.setItem('completedWorkouts', JSON.stringify(history))
    }, [isDone, workout])

    // notify planner listener as time progresses or completes so matching table rows auto-check
    useEffect(() => {
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
            exerciseId: activeExercise?.id ?? null,
            exerciseName: activeExercise?.name ?? null,
            elapsedSeconds: cumulativeExerciseElapsed,
            secondsLeft: currentSecondsLeft,
            isDone,
            mode: autoCompleteMode,
        }

        window.dispatchEvent(new CustomEvent(TIMER_EVENT_TICK, { detail }))

        if (isDone || (activeExercise && currentSecondsLeft <= 0)) {
            window.dispatchEvent(new CustomEvent(TIMER_EVENT_AUTO_COMPLETE, { detail }))
        }
    }, [position, isDone, steps, workout.name, autoCompleteMode])

    function handleChooseWorkout(id) {
        setWorkoutId(id)
        setPosition({ index: 0, elapsed: 0 })
        setIsRunning(false)
    }

    function handleToggle() {
        setIsRunning(running => !running)
    }

    function handleSkip() {
        setPosition(p => ({ index: p.index + 1, elapsed: 0 }))
    }

    function handleStop() {
        setPosition({ index: 0, elapsed: 0 })
        setIsRunning(false)
    }

    function handleRestart() {
        setPosition({ index: 0, elapsed: 0 })
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
                    <img src={`/exercises/${step.exercise.id}.gif`} alt={`${step.exercise.name} demonstration`} />

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
                        <Link to={`/${exercise.id}`}>{exercise.name}</Link>
                        <span>{exercise.sets} × {exercise.work}s, {exercise.rest}s rest</span>
                    </li>
                ))}
            </ol>
        </section>
    </>
}

export default Timer