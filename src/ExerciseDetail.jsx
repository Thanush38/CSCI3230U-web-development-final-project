import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchExercises } from './services/exerciseApi';

<<<<<<< HEAD
function ExerciseDetail() {
=======
import {API, toExercise} from './exercises.js'
import ExerciseImage from './ExerciseImage.jsx';
import './ExerciseDetail.css';

export default function ExerciseDetail() {
>>>>>>> 31d0c553d54c68f29b86455ace4fea9631a17acc
    const { id } = useParams();
    const navigate = useNavigate();

    const [exercise, setExercise] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

<<<<<<< HEAD
    useEffect(() => {
        const controller = new AbortController();

        async function loadExercise() {
            setIsLoading(true);
            setError('');

            try {
                const list = await fetchExercises({ signal: controller.signal });
                if (controller.signal.aborted) return;

                const matched = Array.isArray(list)
                    ? list.find((item) => String(item.id) === String(id))
                    : null;

                setExercise(matched || null);
            } catch (err) {
                if (err?.name === 'AbortError') return;
                if (!controller.signal.aborted) {
                    setError(err?.message || 'Unable to load exercise details.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadExercise();
        return () => controller.abort();
    }, [id]);

    if (isLoading) {
        return (
            <section className="exercise-detail" aria-busy="true">
                <p role="status">Loading exercise details...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="exercise-detail">
                <p role="alert">{error}</p>
                <Link to="/planner">Back to Planner</Link>
            </section>
        );
    }

    if (!exercise) {
        return (
            <section className="exercise-detail">
                <h2>Exercise Not Found</h2>
                <p>No exercise matched ID &ldquo;{id}&rdquo;.</p>
                <Link to="/planner">Back to Planner</Link>
            </section>
        );
    }

    const instructions = Array.isArray(exercise.instructions) && exercise.instructions.length > 0
        ? exercise.instructions
        : ['Perform with controlled form and steady breathing.'];

    return (
        <article className="exercise-detail">
            <div className="detail-nav">
                <button type="button" onClick={() => navigate(-1)}>
                    Back
                </button>
                <Link to="/planner">All Exercises</Link>
            </div>
=======
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
>>>>>>> 31d0c553d54c68f29b86455ace4fea9631a17acc

            <h2>{exercise.name}</h2>
            <p>
                <strong>Muscle Group:</strong> {exercise.muscleGroup}
            </p>
            <p>
                <strong>Equipment:</strong> {exercise.equipment}
            </p>
            <p>
                <strong>Recommended Sets &amp; Time:</strong> {exercise.sets} sets · {exercise.time} min
            </p>

<<<<<<< HEAD
            <h3>Instructions</h3>
            <ol>
                {instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </article>
    );
}

export default ExerciseDetail;
=======
            <section className='detail-main'>
                <div className='detail-image'>
                    <ExerciseImage src={exercise.gif} alt={exercise.name} />
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
>>>>>>> 31d0c553d54c68f29b86455ace4fea9631a17acc
