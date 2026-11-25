import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchExercises } from './services/exerciseApi';

function ExerciseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exercise, setExercise] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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