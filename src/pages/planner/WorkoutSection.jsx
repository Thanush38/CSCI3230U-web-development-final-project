import React, { useState, useEffect } from 'react';
import './WorkoutSection.css';

function WorkoutSection({ title, id, options = [], namePrefix, addedEntries, onAddExercise }) {
    const [selectedExercise, setSelectedExercise] = useState(options[0] || '');
    const [sets, setSets] = useState('');
    const [time, setTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (options.length > 0 && !options.includes(selectedExercise)) {
            setSelectedExercise(options[0]);
        }
    }, [options, selectedExercise]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedSets = Number(sets);
        const parsedTime = Number(time);

        if (!selectedExercise) {
            setErrorMessage('Make sure to select an exercise.');
            return;
        }
        if (!Number.isInteger(parsedSets) || parsedSets <= 0) {
            setErrorMessage('Please enter positive sets.');
            return;
        }
        if (Number.isNaN(parsedTime) || parsedTime <= 0) {
            setErrorMessage('Please put positive time.');
            return;
        }

        setErrorMessage('');
        onAddExercise({
            muscleGroup: namePrefix,
            name: selectedExercise,
            sets: parsedSets,
            time: parsedTime,
        });
        setSets('');
        setTime('');
    };

    return (
        <section className="workout-input">
            <h2 id={id}>{title}</h2>
            <form onSubmit={handleSubmit} noValidate>
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
                            {addedEntries.map((entry) => (
                                <tr key={entry.id}>
                                    <td>{entry.name}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={entry.sets}
                                            readOnly
                                            aria-label={`${entry.name} sets`}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={entry.time}
                                            readOnly
                                            aria-label={`${entry.name} time`}
                                        />
                                    </td>
                                    <td>
                                        <img
                                            className="imgPlaceholder"
                                            src="/workout-placeholder.svg"
                                            alt={`${entry.name} demonstration`}
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <select
                                        name={`${namePrefix}Activity`}
                                        aria-label={`${title} Exercise`}
                                        value={selectedExercise}
                                        onChange={(e) => setSelectedExercise(e.target.value)}
                                    >
                                        {options.map((opt, index) => (
                                            <option key={index} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        name={`${namePrefix}Sets`}
                                        placeholder="Sets"
                                        aria-label={`${title} sets`}
                                        value={sets}
                                        onChange={(e) => setSets(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        name={`${namePrefix}Time`}
                                        placeholder="Minutes"
                                        aria-label={`${title} time`}
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <img
                                        className="imgPlaceholder"
                                        src="/workout-placeholder.svg"
                                        alt="Workout demonstration"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {errorMessage && (
                        <p role="alert" className="form-error">
                            {errorMessage}
                        </p>
                    )}
                    <button type="submit" className="add-btn">
                        Add
                    </button>
                </div>
            </form>
        </section>
    );
}

export default WorkoutSection;