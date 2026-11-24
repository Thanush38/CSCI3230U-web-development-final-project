import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import {API, toExercise} from './exercises.js'
import './ExerciseDetail.css';

export default function ExerciseDetail() {
    const { id } = useParams();

    const [exercise, setExercise] = useState(null);
    const [loadStatus, setLoadStatus] = useState('loading');

    useEffect( () => {
        setLoadStatus('loading');

        const controller = new AbortController();

        fetch(`${API}/${id}`, { signal: controller.signal })
        .then( (response) => {
            if (!response.ok) throw new Error(`HTTP Response: ${response.status}`);

            return response.json();
        })
        .then((data) => {
            setExercise(toExercise(data.data));
            setLoadStatus('ok');
        })
        .catch( (error) => {
            if (error.name !== 'AbortError') {
                console.error(error);
                setLoadStatus('error');
            }
        });
        return () => controller.abort();
    }, [id]);

    if (loadStatus === 'loading') return <p>Loading exercise...</p>
    if (loadStatus === "error") return <p>Could not load exercise.</p>
    if (!exercise) return <p className="exercise-missing">No such exercise. <Link to="/">Back</Link></p>

    return (
        <main className='exercise-detail'>
            <Link to="/" className="back-link">
                ← Back to Exercises
            </Link>

            <header className='detail-header'>
                <h1>{exercise.name}</h1>
                <p>Exercise Details</p>
            </header>

            <section className='detail-main'>
                <div className='detail-image'>
                    <img src={exercise.gif} alt={exercise.name} />
                </div>

                <div className='detail-information'>
                    <h2>Exercise Information</h2>

                    <div className='info-card'>
                        <span className='info-label'>
                            Body Part
                        </span>
                        <span className='info-value'>
                            {exercise.bodyParts}
                        </span>
                    </div>

                    <div className='info-card'>
                        <span className='info-label'>Target Muscle</span>
                        <span className='info-value'>{exercise.muscle}</span>
                    </div>

                    <div className='info-card'>
                        <span className='info-label'>Secondary Muscles</span>
                        <span className='info-value'>{exercise.secondaryMuscle}</span>
                    </div>

                    <div className='info-card'>
                        <span className='info-label'>Equipment</span>
                        <span className='info-value'>{exercise.equipment}</span>
                    </div>
                </div>
            </section>

            <section className='instructions-section'>
                <h2>How to Perform</h2>
                <p>{exercise.instructions}</p>
            </section>
        
        </main>
    )
}