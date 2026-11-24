import React, {useState} from 'react';
import './WorkoutRegime.css';

function WorkoutRegime({
    items=[],
    canUndo=false,
    onToggleComplete,
    onUndo,
    onStartTimer,
    onSaveBuild,
}) {
    const [buildName, setBuildName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const handleSaveSubmit = (e) => {
        e.preventDefault();
        const trimmedName=buildName.trim();
        if(!trimmedName){
            setErrorMessage('Workout build name');
            return;
        }
        if(items.length===0){
            setErrorMessage('Currently emptry, please add workouts first');
            return;
        }
        setErrorMessage('');
        onSaveBuild?.(trimmedName);
        setBuildName('');
    };
    
    return (
        <section className="workout-input">
            <h2 id="workout-regime">Workout Regime</h2>
            <div>
                <table id="regime-table" className="workout-regime">
                    <thead>
                        <tr>
                            <th colSpan="4">Full Workout Regime</th>
                        </tr>
                        <tr>
                            <th>Workout</th>
                            <th>Total Work Outs</th>
                            <th>Time?</th>
                            <th>Complete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item)=>(
                            <tr key={items.id}>
                                <td>{items.name}</td>
                                <td>{items.sets} sets</td>
                                <td>{items.time} minutes</td>
                                <td>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="complete"
                                            className="regime-checkbox"
                                            checked={Boolean(item.completed)}
                                            onChange={()=>onToggleComplete?.(item.id)}
                                        />{' '} 
                                        Complete?
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {errorMessage && (
                    <p role="alert" className="form-error">
                        {errorMessage}
                    </p>
                )}
                <form onSubmit={handleSaveSubmit} noValidate>
                    <div className="regime-actions">
                        <button
                            type="button"
                            id="backBtn"
                            onClick={onUndo}
                            disabled={!canUndo}
                        > 
                        Back 
                        </button>
                        <button
                            type="button"
                            id="startTimerBtn"
                            onClick={onStartTimer}
                        > Start Timer
                        </button>
                        <div className="save-build-group">
                            <button type="submit" id = "saveBuildBtn">
                                Save Build
                            </button>
                            <label htmlFor="buildNameInput" className="sr-only">
                                Custom build name
                            </label>
                            <input
                                type="text"
                                id="buildNameInput"
                                placeholder="Enter custom build name..."
                                value={buildName}
                                onChange={(e)=>setBuildName(e.target.value)}
                                />
                        </div>
                    </div>
                </form>
                </div>
        </section>
    );
}

export default WorkoutRegime;