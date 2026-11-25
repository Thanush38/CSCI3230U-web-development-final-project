import React, { useState, useEffect } from 'react';
import ExerciseImage from '../../ExerciseImage';
import { DEFAULT_SET_MINUTES, defaultExerciseMinutes } from '../../utils/timerAutoComplete';
import './WorkoutSection.css';

function WorkoutSection({
    title,
    id,
    options = [],
    namePrefix,
    addedEntries,
    onAddExercise,
    exerciseGifMap = {},
}) {
    const [selectedExercise, setSelectedExercise] = useState(options[0] || '');
    const [sets, setSets] = useState('');
    const [time, setTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (options.length > 0 && !options.includes(selectedExercise)) {
            setSelectedExercise(options[0]);
        }
    }, [options, selectedExercise]);

    const getGifForName = (name) => exerciseGifMap?.[name] || ''; // Ai suggested this variable to be used

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedSets = Number(sets);
        // Blank minutes -> default of 2 minutes per set
        const parsedTime = time.trim() === '' ? defaultExerciseMinutes(parsedSets) : Number(time);

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
        // the idea of getgifforname was also an idea given by ai
        onAddExercise({
            muscleGroup: namePrefix,
            name: selectedExercise,
            sets: parsedSets,
            time: parsedTime,
            gif: getGifForName(selectedExercise),
        });
        setSets('');
        setTime('');
    };

    return (
        <section className="workout-input" aria-labelledby={id}>
            <h2 id={id}>{title}</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Workout</th>
                                <th scope="col">Total Work Outs</th>
                                <th scope="col">Time?</th>
                                <th scope="col"><span className="visually-hidden">Preview</span></th>
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
                                        <ExerciseImage
                                            className="imgPlaceholder" // The exercise image block was ai assited
                                            src={entry.gif || entry.gifUrl || getGifForName(entry.name)}
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
                                        placeholder={`Minutes (${DEFAULT_SET_MINUTES}/set)`}
                                        aria-label={`${title} time`}
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <ExerciseImage
                                        className="imgPlaceholder"
                                        src={getGifForName(selectedExercise)} // Ai assisted use for ExerciseImage tags
                                        alt={selectedExercise ? `${selectedExercise} demonstration` : 'Workout demonstration'}
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