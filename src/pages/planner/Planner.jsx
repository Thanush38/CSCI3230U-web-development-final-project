import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PreBuildControls from './PreBuildControls';
import WorkoutSection from './WorkoutSection';
import WorkoutRegime from './WorkoutRegime';
import PlannerResults from './PlannerResults';
import './Planner.css';

const LEGACY_DEFAULTS = ['Full Body Begineer', 'Push/ Pull/ Legs', 'Upper/ Lower Split'];
const STORAGE_KEY = 'savedPreBuiltWorkouts';

const INITIAL_SECTION_ENTRIES={
    chest:[],
    back: [],
    leg: [],
    shoulder: [],
    arm: [],
    core: []
};

const WORKOUT_BUILDS ={
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

function createUniqueId(prefix='item'){
    if(typeof crypto !=="undefined" && crypto.randomUUID){
        return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
}

function cloneSectionEntries(entries){
    return Object.fromEntries(
        Object.entries(entries).map(([group, list])=>[
            group,
            list.map((entry)=>({...entry})),
        ])
    );
}

function loadInitialSavedBuilds(){
    try{
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))|| {};
        const cleaned = {...parsed};
        LEGACY_DEFAULTS.forEach((name)=>{
            delete cleaned[name];
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        return cleaned;
    }
    catch {
        return {};
    }
}

function Planner() {
    const navigate = useNavigate();
    const [savedBuilds, setSavedBuilds]=useState(loadInitialSavedBuilds);
    const [sectionEntries, setSectionEntries]=useState(INITIAL_SECTION_ENTRIES);
    const [regimeItems, setRegimeItems] = useState([]);
    const [undoHistory, setUndoHistory] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        try{
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBuilds));
        }
        catch{

        }
    }, [savedBuilds]);

    const pushUndoSnapshot = () => {
        setUndoHistory((prev) => [
            ...prev,
            {
                sectionEntries: cloneSectionEntries(sectionEntries),
                regimeItems: regimeItems.map((item)=>({...item})),
            },
        ]);
    };

    const handleAddExercise = ({muscleGroup, name, sets, time}) => {
        pushUndoSnapshot();
        const newEntry = {
            id:createUniqueId('ex'),
            muscleGroup,
            name,
            sets,
            time,
            completed: false,
        };
        setSectionEntries((prev)=> ({
            ...prev,
            [muscleGroup]: [...(prev[muscleGroup]||[]), newEntry],
        }));
            setRegimeItems((prev)=>[...prev,newEntry]);
            setStatusMessage(`Added ${name} to your workout regime.`);
        };
        const handleLoadBuild = (buildName, isPreBuilt = false) =>{
            const workouts = isPreBuilt? savedBuilds[buildName]:WORKOUT_BUILDS[buildName];
            if(!Array.isArray(workouts)|| workouts.length===0){
                setStatusMessage(`Selected build "${buildName}" could not be loaded.`);
                return
            }
            pushUndoSnapshot();
            const nextSection ={
                chest:[],
                back:[],
                leg:[],
                shoulder:[],
                arm:[],
                core:[],
            };
            const nextRegime = workouts.map((item)=>{
                const group = EXERCISE_TO_GROUP[item.name]||'chest';
                const parsedSets = Number(item.sets)||3;
                const parsedTime = Number(item.time) || 10;
                const entry = {
                    id: createUniqueId('build'),
                    muscleGroup: group,
                    name: item.name,
                    sets: parsedSets,
                    time: parsedTime,
                    completed: false,
                };
                nextSection[group].push(entry);
                return entry;
            });
            setSectionEntries(nextSection);
            setRegimeItems(nextRegime);
            setStatusMessage(`Loaded ${buildName} into your workout planner and regime.`);
        };
            const handleToggleComplete = (itemId) => {
                setRegimeItems((prev) =>
                    prev.map((item) =>
                        item.id === itemId ? {...item, completed: !item.completed} : item
                    )
                );
            };

            const handleUndo = () => {
                if (undoHistory.length ===0) return;
                const previous = undoHistory[undoHistory.length-1];
                setUndoHistory((prev)=>prev.slice(0,-1));
                setSectionEntries(previous.sectionEntries);
                setRegimeItems(previous.regimeItems);
                setStatusMessage('Undid last action.');
            };
            const handleSaveBuild=(buildName) =>{
                    const snapshotWorkouts = regimeItems.map((item)=>({
                        name: item.name,
                        sets: String(item.sets),
                        time: String(item.time),
                }));
                
                setSavedBuilds((prev)=>({
                    ...prev,
                    [buildName]: snapshotWorkouts,
                }));
                setStatusMessage(`Saved "${buildName}" to your pre-built workout.`);
            };

            const summary = useMemo(()=>{
                let completedCount = 0;
                let totalMinutes = 0;
                regimeItems.forEach((item)=>{
                    if(item.completed){
                        completedCount+=1;
                        const mins = Number(item.time);
                        totalMinutes+=Number.isNaN(mins)?10: mins;
                    }
            });
            return{
                completedCount,
                totalCount: regimeItems.length,
                totalMinutes,
                caloriesBurned:totalMinutes*8,
            };
        }, [regimeItems]);
        const savedBuildNames = useMemo(() => Object.keys(savedBuilds), [savedBuilds]);
        const recommendedBuildNames = useMemo(()=>Object.keys(WORKOUT_BUILDS), []);
        return(
            <>
                <header>
                    <a clasName="logo" href="homePage.html">
                        <img src="/dumbbell.png" alt="WorkOnSite logo"/>
                        WorkOnSite
                    </a>
                    <h1 id="Title"> Workout Planner</h1>
                    <nav>
                        <a href="homePage.html">Home</a>
                        <a href="workoutPlanner.html">Workout Planner</a>
                        <a href="recommendedBuilds.html">Recommended Builds</a>
                        <a href = "workoutTimer.html">Workout Timer</a>
                    </nav>
                </header>
                <main>
                {statusMessage&&(<p role="status" className="status-banner">{statusMessage}</p>)}
                
                <PreBuildControls
                savedBuildNames={savedBuildNames}
                recommendedBuildNames={recommendedBuildNames}
                onLoadBuild={handleLoadBuild}
                />
                <WorkoutSection
                    title="Chest"
                    id="chest-input"
                    options={['Push-ups', 'Bench Press']}
                    namePrefix = "chest"
                    addedEntries={sectionEntries.chest}
                    onAddExercise={handleAddExercise}
                />
                <WorkoutSection
                title="Back"
                id="back-input"
                options={['Pull-up', 'Bent-Over Row']}
                namePrefix="back"
                addedEntries={sectionEntries.back}
                onAddExercise={handleAddExercise}
                />
                <WorkoutSection
                title="Shoulder"
                id="shoulder-input"
                options={['Overhead Press']}
                namePrefix="shoulder"
                addedEntries={sectionEntries.shoulder}
                onAddExercise={handleAddExercise}
                />
                <WorkoutSection
                title="Arm"
                id="arm-input"
                options={['Bicep Curl', 'Tricep Dip']}
                namePrefix="core"
                addedEntries={sectionEntries.arm}
                onAddExercise={handleAddExercise}
                />
                <WorkoutSection
                    title="Core"
                    id="core-input"
                    options={['Plank']}
                    namePrefix="core"
                    addedEntries={sectionEntries.core}
                    onAddExercise={handleAddExercise}
                />
                <WorkoutRegime
                    items={regimeItems}
                    canUndo={undoHistory.length>0}
                    onToggleComplete={handleToggleComplete}
                    onUndo={handleUndo}
                    onStartTimer={()=>navigate('/timer')}
                    onSaveBuild={handleSaveBuild}
                />
                <PlannerResults
                    completedCount={summary.completedCount}
                    totalCount={summary.totalCount}
                    totalMinutes={summary.totalMinutes}
                    caloriesBurned={summary.caloriesBurned}
                />
                </main>
                <footer id="copyright">Copyright &copy; 2026</footer>
            }
        
    );
}

export default Planner;