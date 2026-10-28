import React from 'react';
import './WorkoutSection.css';

function WorkoutSection({ title, id, options, namePrefix }) {
    return (
        <section className="workout-input">
            <h2 id={id}>{title}</h2>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Workout</th>
                            <th>Total Work Outs</th>
                            <th>Time?</th> 
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select name={`${namePrefix}Activity`} aria-label={`${title} Exercise`}>
                                    {options.map((opt, index) => (
                                        <option key={index} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </td>
                            <td><input type="text" name={`${namePrefix}Sets`} placeholder="Sets" aria-label={`${title} sets`} /></td>
                            <td><input type="text" name={`${namePrefix}Time`} placeholder="Minutes" aria-label={`${title} time`} /></td>
                            <td><img className="imgPlaceholder" src="/workout-placeholder.svg" alt="Workout demonstration" /></td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" className="add-btn">Add</button>
            </div>
        </section>
    );
}

export default WorkoutSection;