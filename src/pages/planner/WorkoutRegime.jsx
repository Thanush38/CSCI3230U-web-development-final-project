import React, { useState } from 'react';
import './WorkoutRegime.css';

function WorkoutRegime({
    items = [],
    canUndo = false,
    onToggleComplete,
    onUndo,
    onStartTimer,
    onSaveBuild,
}) {
    const [buildName, setBuildName] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        const trimmed = buildName.trim();
        if (!trimmed || !onSaveBuild) return;
        onSaveBuild(trimmed);
        setBuildName('');
    };

    return (
        <section id="workout-regime-section" className="workout-input" aria-labelledby="regime-heading">
            <h2 id="regime-heading">Workout Regime</h2>
            <p className="regime-subtitle">Full Workout Regime</p>

            <table className="workout-regime">
                <thead>
                    <tr>
                        <th>Workout</th>
                        <th>Total Work Outs</th>
                        <th>Time?</th>
                        <th>Complete</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="4">No exercises in your regime yet.</td>
                        </tr>
                    ) : (
                        items.map((item) => {
                            const workoutName = item.name || item.workout || item.exercise || 'Untitled Exercise';
                            const setsValue = item.sets ?? item.totalWorkouts ?? 0;
                            const timeValue = item.time ?? item.minutes ?? item.duration ?? 0;

                            return (
                                <tr key={item.id}>
                                    <td>{workoutName}</td>
                                    <td>{setsValue} sets</td>
                                    <td>{timeValue} minutes</td>
                                    <td>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(item.completed)}
                                                onChange={() => onToggleComplete?.(item.id)}
                                            />{' '}
                                            Complete?
                                        </label>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            <div className="regime-actions">
                <button
                    type="button"
                    onClick={onUndo}
                    disabled={!canUndo}
                >
                    Undo
                </button>

                <button
                    type="button"
                    id="startTimerBtn"
                    onClick={onStartTimer}
                >
                    Start Timer
                </button>

                <form className="save-build-group" onSubmit={handleSave}>
                    <label htmlFor="regime-build-name" className="visually-hidden">
                        Build name
                    </label>
                    <input
                        id="regime-build-name"
                        type="text"
                        placeholder="Custom build name"
                        value={buildName}
                        onChange={(e) => setBuildName(e.target.value)}
                    />
                    <button type="submit" id="saveBuildBtn">
                        Save Build
                    </button>
                </form>
            </div>
        </section>
    );
}

export default WorkoutRegime;