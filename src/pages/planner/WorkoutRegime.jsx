import React from 'react';
import './WorkoutRegime.css';

function WorkoutRegime() {
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
                    <tbody></tbody>
                </table>
                <div className="regime-actions">
                    <button type="button" id="backBtn">Back</button>
                    <button type="button" id="startTimerBtn">Start Timer</button>
                    <div className="save-build-group">
                        <button type="button" id="saveBuildBtn">Save Build</button>
                        <input 
                            type="text" 
                            id="buildNameInput" 
                            placeholder="Enter custom build name..." 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WorkoutRegime;