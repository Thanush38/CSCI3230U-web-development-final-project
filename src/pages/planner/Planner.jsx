import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PreBuildControls from './PreBuildControls';
import ExerciseCatalog from './ExerciseCatalog';
import WorkoutSection from './WorkoutSection';
import WorkoutRegime from './WorkoutRegime';
import PlannerResults from './PlannerResults';
import { fetchExercises } from '/src/services/exerciseApi';
import { useLocalStorageState } from '/src/hooks/useLocalStorageState';
import {
    TIMER_EVENT_TICK,
    TIMER_EVENT_AUTO_COMPLETE,
    TIMER_EVENT_SYNC_WORKOUT,
    buildTimerDetails,
    saveTimerDetails,
    applyThresholdAutoComplete, 
} from '../../utils/timerAutoComplete'; // AI assisted with this code and how to use it
import { resolveExerciseGif, resolveExerciseDbId } from '../../utils/exerciseImages';
import './Planner.css';

const LEGACY_DEFAULTS = ['Full Body Beginner', 'Push / Pull / Legs', 'Upper / Lower Split'];
const STORAGE_KEY = 'savedPreBuiltWorkouts';

const INITIAL_SECTION_ENTRIES = {
    chest: [],
    back: [],
    leg: [],
    shoulder: [],
    arm: [],
    core: [],
};

const DEFAULT_GROUP_OPTIONS = {
    chest: ['Push-up', 'Bench Press'],
    back: ['Pull-up', 'Bent-Over Row'],
    leg: ['Bodyweight Squat', 'Deadlift'],
    shoulder: ['Overhead Press'],
    arm: ['Bicep Curl', 'Tricep Dip'],
    core: ['Plank'],
};

const WORKOUT_BUILDS = {
    Calisthenics: [
        { name: 'Push-up', sets: 4, time: 15 },
        { name: 'Pull-up', sets: 3, time: 12 },
        { name: 'Plank', sets: 3, time: 10 },
    ],
    'Bigger Back': [
        { name: 'Pull-up', sets: 4, time: 15 },
        { name: 'Bent-Over Row', sets: 4, time: 15 },
    ],
    'Bigger Chest': [
        { name: 'Bench Press', sets: 4, time: 20 },
        { name: 'Push-up', sets: 3, time: 10 },
    ],
    'First Pull-Up': [
        { name: 'Pull-up', sets: 5, time: 10 },
        { name: 'Bicep Curl', sets: 3, time: 10 },
    ],
};

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
};

function normalizeName(name) {
    return String(name || '').trim().toLowerCase();
}

function createUniqueId(prefix = 'item') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneSectionEntries(entries) {
    return Object.fromEntries(
        Object.entries(entries).map(([group, list]) => [
            group,
            list.map((entry) => ({ ...entry })),
        ])
    );
}

function loadInitialSavedBuilds(parsedInput) {
    try {
        const parsed = parsedInput ?? (JSON.parse(localStorage.getItem(STORAGE_KEY)) || {});
        const cleaned = { ...parsed };
        LEGACY_DEFAULTS.forEach((name) => {
            delete cleaned[name];
        });
        return cleaned;
    } catch {
        return {};
    }
}

function Planner() {
    const navigate = useNavigate();

    const [savedBuilds, setSavedBuilds] = useLocalStorageState(
        STORAGE_KEY,
        {},
        loadInitialSavedBuilds
    );
    const [sectionEntries, setSectionEntries] = useLocalStorageState(
        'plannerSectionEntries',
        INITIAL_SECTION_ENTRIES
    );
    const [regimeItems, setRegimeItems] = useLocalStorageState(
        'plannerRegimeItems',
        []
    );
    const [undoHistory, setUndoHistory] = useLocalStorageState(
        'plannerUndoHistory',
        []
    );
    const [statusMessage, setStatusMessage] = useState('');

    const [catalog, setCatalog] = useState([]);
    const [isLoadingExercises, setIsLoadingExercises] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const refreshFromStorage = useCallback(() => {
        try {
            const rawRegime = localStorage.getItem('plannerRegimeItems');
            if (rawRegime) {
                const parsedRegime = JSON.parse(rawRegime);
                if (Array.isArray(parsedRegime)) {
                    setRegimeItems(parsedRegime);
                }
            }

            const rawSections = localStorage.getItem('plannerSectionEntries');
            if (rawSections) {
                const parsedSections = JSON.parse(rawSections);
                if (parsedSections && typeof parsedSections === 'object') {
                    setSectionEntries({
                        ...INITIAL_SECTION_ENTRIES,
                        ...parsedSections,
                    });
                }
            }
        } catch {
            // Ignore malformed storage data
        }
    }, [setRegimeItems, setSectionEntries]);

    useEffect(() => {
        const handleVisibilityOrFocus = () => {
            if (document.visibilityState === 'visible') {
                refreshFromStorage();
            }
        };

        window.addEventListener('focus', refreshFromStorage);
        document.addEventListener('visibilitychange', handleVisibilityOrFocus);

        return () => {
            window.removeEventListener('focus', refreshFromStorage);
            document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
        };
    }, [refreshFromStorage]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadCatalog() {
            setIsLoadingExercises(true);
            setFetchError('');

            try {
                const mapped = await fetchExercises({ signal: controller.signal });
                if (!controller.signal.aborted) {
                    setCatalog(mapped);
                }
            } catch (err) {
                if (err?.name === 'AbortError') return;
                if (!controller.signal.aborted) {
                    setFetchError(
                        err?.message || 'Could not load live exercises; using local defaults.'
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingExercises(false);
                }
            }
        }

        loadCatalog();

        return () => {
            controller.abort();
        };
    }, []);

    const dynamicGroupMap = useMemo(() => {
        const map = { ...EXERCISE_TO_GROUP };
        catalog.forEach((ex) => {
            if (ex.name && ex.muscleGroup && !map[ex.name]) {
                map[ex.name] = ex.muscleGroup;
            }
        });
        return map;
    }, [catalog]);

    useEffect(() => {
        const handleTimerProgress = (event) => {
            const detail = event.detail || {};
            setRegimeItems((prevItems) => {
                const result = applyThresholdAutoComplete({
                    items: prevItems,
                    elapsedSeconds: detail.elapsedSeconds ?? 0,
                    remainingSeconds: detail.secondsLeft ?? null,
                    exerciseName: detail.exerciseName ?? null,
                    exerciseId: detail.exerciseId ?? null,
                    isWorkoutDone: Boolean(detail.isDone),
                    mode: detail.mode,
                });
                return result.changed ? result.items : prevItems;
            });
        };

        const handleWorkoutSync = (event) => {
            const detail = event.detail || {};
            const completedSet = new Set(
                (detail.completedExerciseNames || []).map(normalizeName)
            );

            if (Array.isArray(detail.exercises)) {
                const nextSections = {
                    chest: [],
                    back: [],
                    leg: [],
                    shoulder: [],
                    arm: [],
                    core: [],
                };

                const syncedItems = detail.exercises.map((ex, index) => {
                    const group = dynamicGroupMap[ex.name] || 'chest';
                    const isCompleted =
                        detail.completedExerciseNames !== undefined
                            ? completedSet.has(normalizeName(ex.name))
                            : Boolean(ex.completed);

                    const entry = {
                        id: ex.id || createUniqueId(`sync-${index}`),
                        muscleGroup: group,
                        name: ex.name,
                        sets: Number(ex.sets) || 3,
                        time: Number(ex.time) || 10,
                        completed: isCompleted,
                    };
                    if (nextSections[group]) {
                        nextSections[group].push(entry);
                    }
                    return entry;
                });

                setSectionEntries(nextSections);
                setRegimeItems(syncedItems);
            } else {
                setRegimeItems((prev) =>
                    prev.map((item) => ({
                        ...item,
                        completed: completedSet.has(normalizeName(item.name)),
                    }))
                );
                setSectionEntries((prev) => {
                    const next = { ...INITIAL_SECTION_ENTRIES };
                    for (const group of Object.keys(next)) {
                        const list = Array.isArray(prev?.[group]) ? prev[group] : [];
                        next[group] = list.map((entry) => ({
                            ...entry,
                            completed: completedSet.has(normalizeName(entry.name)),
                        }));
                    }
                    return next;
                });
            }

            if (detail.workoutName) {
                setStatusMessage(`Synced regime with "${detail.workoutName}".`);
            }
        };


        // Ai taught me how to use timer based event listeners
        window.addEventListener(TIMER_EVENT_TICK, handleTimerProgress);
        window.addEventListener(TIMER_EVENT_AUTO_COMPLETE, handleTimerProgress);
        window.addEventListener(TIMER_EVENT_SYNC_WORKOUT, handleWorkoutSync);

        return () => {
            window.removeEventListener(TIMER_EVENT_TICK, handleTimerProgress);
            window.removeEventListener(TIMER_EVENT_AUTO_COMPLETE, handleTimerProgress);
            window.removeEventListener(TIMER_EVENT_SYNC_WORKOUT, handleWorkoutSync);
        }; // upto here
    }, [dynamicGroupMap, setRegimeItems, setSectionEntries]);

    const catalogByName = useMemo(() => {
        const map = {};
        catalog.forEach((ex) => {
            if (ex.name && !map[ex.name]) {
                map[ex.name] = ex;
            }
        });
        return map;
    }, [catalog]);

    const gifByName = useMemo(() => {
        const map = {};

        Object.keys(EXERCISE_TO_GROUP).forEach((name) => {
            map[name] = resolveExerciseGif(name, '');
        });

        catalog.forEach((ex) => {
            if (ex.name) {
                map[ex.name] = resolveExerciseGif(ex.name, ex.gif ?? map[ex.name] ?? '');
            }
        });

        return map;
    }, [catalog]);

    const resolveExerciseMedia = ({ name, gif, exerciseId }) => {
        const match = catalogByName[name];
        return {
            gif: resolveExerciseGif(name, gif ?? match?.gif),
            exerciseId: resolveExerciseDbId({ name, exerciseId: exerciseId ?? match?.id }),
        };
    };

    const groupOptions = useMemo(() => {
        const grouped = {
            chest: new Set(DEFAULT_GROUP_OPTIONS.chest),
            back: new Set(DEFAULT_GROUP_OPTIONS.back),
            leg: new Set(DEFAULT_GROUP_OPTIONS.leg),
            shoulder: new Set(DEFAULT_GROUP_OPTIONS.shoulder),
            arm: new Set(DEFAULT_GROUP_OPTIONS.arm),
            core: new Set(DEFAULT_GROUP_OPTIONS.core),
        };

        catalog.forEach((ex) => {
            if (grouped[ex.muscleGroup] && ex.name) {
                grouped[ex.muscleGroup].add(ex.name);
            }
        });

        return Object.fromEntries(
            Object.entries(grouped).map(([group, set]) => [group, Array.from(set)])
        );
    }, [catalog]);

    const pushUndoSnapshot = () => {
        setUndoHistory((prev) => [
            ...prev,
            {
                sectionEntries: cloneSectionEntries(sectionEntries),
                regimeItems: regimeItems.map((item) => ({ ...item })),
            },
        ]);
    };

    const handleAddExercise = ({ muscleGroup, name, sets, time, gif, exerciseId }) => {
        pushUndoSnapshot();

        const newEntry = {
            id: createUniqueId('ex'),
            muscleGroup,
            name,
            sets,
            time,
            ...resolveExerciseMedia({ name, gif, exerciseId }),
            completed: false,
        };

        if (muscleGroup in INITIAL_SECTION_ENTRIES) {
            setSectionEntries((prev) => ({
                ...prev,
                [muscleGroup]: [...(prev[muscleGroup] || []), newEntry],
            }));
        }

        setRegimeItems((prev) => [...prev, newEntry]);
        setStatusMessage(`Added ${name} to your workout regime.`);
    };

    const handleLoadBuild = (buildName, isPreBuilt = false) => {
        const workouts = isPreBuilt ? savedBuilds[buildName] : WORKOUT_BUILDS[buildName];
        if (!Array.isArray(workouts) || workouts.length === 0) {
            setStatusMessage(`Selected build "${buildName}" could not be loaded.`);
            return;
        }

        pushUndoSnapshot();

        const nextSections = {
            chest: [],
            back: [],
            leg: [],
            shoulder: [],
            arm: [],
            core: [],
        };

        const nextRegime = workouts.map((item) => {
            const group = dynamicGroupMap[item.name] || 'chest';
            const parsedSets = Number(item.sets) || 3;
            const parsedTime = Number(item.time) || 10;
            const entry = {
                id: createUniqueId('build'),
                muscleGroup: group,
                name: item.name,
                sets: parsedSets,
                time: parsedTime,
                ...resolveExerciseMedia(item),
                completed: false,
            };
            nextSections[group]?.push(entry);
            return entry;
        });

        setSectionEntries(nextSections);
        setRegimeItems(nextRegime);
        setStatusMessage(`Loaded "${buildName}" into your workout planner and regime.`);
    };

    const handleToggleComplete = (itemId) => {
        setRegimeItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const handleUndo = () => {
        if (undoHistory.length === 0) return;

        const previous = undoHistory[undoHistory.length - 1];
        setUndoHistory((prev) => prev.slice(0, -1));
        setSectionEntries(previous.sectionEntries);
        setRegimeItems(previous.regimeItems);
        setStatusMessage('Undid last action.');
    };

    const handleSaveBuild = (buildName) => {
        const snapshotWorkouts = regimeItems.map((item) => ({
            name: item.name,
            sets: String(item.sets),
            time: String(item.time),
            gif: item.gif ?? null,
            exerciseId: item.exerciseId ?? null,
        }));

        setSavedBuilds((prev) => ({
            ...prev,
            [buildName]: snapshotWorkouts,
        }));
        setStatusMessage(`Saved "${buildName}" to your pre-built workouts.`);
    };

    const handleStartTimer = () => {
        const timerDetails = buildTimerDetails(regimeItems, 'Full Workout Regime');
        saveTimerDetails(timerDetails);
        navigate('/timer', { state: { timerDetails } });
    };

    const summary = useMemo(() => {
        let completedCount = 0;
        let totalMinutes = 0;

        regimeItems.forEach((item) => {
            if (item.completed) {
                completedCount += 1;
                const mins = Number(item.time);
                totalMinutes += Number.isNaN(mins) ? 10 : mins;
            }
        });

        return {
            completedCount,
            totalCount: regimeItems.length,
            totalMinutes,
            caloriesBurned: totalMinutes * 8,
        };
    }, [regimeItems]);

    const savedBuildNames = useMemo(() => Object.keys(savedBuilds), [savedBuilds]);
    const recommendedBuildNames = useMemo(() => Object.keys(WORKOUT_BUILDS), []);

    return (
        <div className="planner-page">
            {statusMessage && (
                <p role="status" className="status-banner">
                    {statusMessage}
                </p>
            )}

            {isLoadingExercises && (
                <p role="status" className="status-banner">
                    Loading exercises...
                </p>
            )}

            {fetchError && (
                <p role="alert" className="form-error">
                    {fetchError}
                </p>
            )}

            <PreBuildControls
                savedBuildNames={savedBuildNames}
                recommendedBuildNames={recommendedBuildNames}
                onLoadBuild={handleLoadBuild}
            />

            <ExerciseCatalog
                catalog={catalog}
                isLoading={isLoadingExercises}
                regimeItems={regimeItems}
                onQuickAdd={handleAddExercise}
            />

            <WorkoutSection
                title="Chest"
                id="chest-input"
                options={groupOptions.chest}
                namePrefix="chest"
                addedEntries={sectionEntries.chest}
                onAddExercise={handleAddExercise}
                exerciseGifMap={gifByName}
            />
            <WorkoutSection
                title="Back"
                id="back-input"
                options={groupOptions.back}
                namePrefix="back"
                addedEntries={sectionEntries.back}
                onAddExercise={handleAddExercise}
                exerciseGifMap={gifByName}
            />
            <WorkoutSection
                title="Leg"
                id="leg-input"
                options={groupOptions.leg}
                namePrefix="leg"
                addedEntries={sectionEntries.leg}
                onAddExercise={handleAddExercise}
                exerciseGifMap={gifByName}
            />
            <WorkoutSection
                title="Shoulder"
                id="shoulder-input"
                options={groupOptions.shoulder}
                namePrefix="shoulder"
                addedEntries={sectionEntries.shoulder}
                onAddExercise={handleAddExercise}
                exerciseGifMap={gifByName}
            />
            <WorkoutSection
                title="Arm"
                id="arm-input"
                options={groupOptions.arm}
                namePrefix="arm"
                addedEntries={sectionEntries.arm}
                onAddExercise={handleAddExercise}
                exerciseGifMap={gifByName}
            />
            <WorkoutSection
                title="Core"
                id="core-input"
                options={groupOptions.core}
                namePrefix="core"
                addedEntries={sectionEntries.core}
                onAddExercise={handleAddExercise}
                exerciseGifMap={gifByName}
            />

            <WorkoutRegime
                items={regimeItems}
                canUndo={undoHistory.length > 0}
                onToggleComplete={handleToggleComplete}
                onUndo={handleUndo}
                onStartTimer={handleStartTimer}
                onSaveBuild={handleSaveBuild}
            />

            <PlannerResults
                completedCount={summary.completedCount}
                totalCount={summary.totalCount}
                totalMinutes={summary.totalMinutes}
                caloriesBurned={summary.caloriesBurned}
            />

            <footer id="copyright">Copyright &copy; 2026</footer>
        </div>
    );
}

export default Planner;