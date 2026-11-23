import { useState, useEffect } from 'react';

import ExerciseCard from './ExerciseCard.jsx';
import { API, toExercise } from './exercises.js';
import './pages/home/Home.css'

export default function ExerciseList() {
    const [exercises, setExercises] = useState([]);
    const [loadStatus, setLoadStatus] = useState('loading');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    useEffect( () => {
        setLoadStatus('loading');

        const controller = new AbortController();

        fetch(API, { signal: controller.signal })
        .then( (response) => {
            if (!response.ok) throw new Error(`HTTP Response: ${response.status}`);

            return response.json();
        })
        .then((data) => {
            setExercises((data.data ?? []).map(toExercise));
            setLoadStatus('ok');
        })
        .catch((error) => {
            if (error.name === 'AbortError') return;

            console.error(error);
            setLoadStatus('error');
        });
        return () => controller.abort();
    }, []);

    const visible = exercises
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => category === 'all' || e.category === category)

  return (
    <>
    <header>
        <h1>Exercises</h1>
      
        <section id="search-section">
        <input value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercises..." />
        <select value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="shoulders">Shoulders</option>
            <option value="arms">Arms</option>
            <option value="core" >Core</option>
        </select>
        </section>
    </header>

    {loadStatus === 'loading' && <p>Loading exercises...</p>}
    {loadStatus === 'error' && <p>Could not load exercises.</p>}

    <section id="browse-group" className="exercise-grid">
        {loadStatus === 'ok' && (
            visible.length === 0
                ? <p className="empty">No matches</p>
                : visible.map((e) => (
                <ExerciseCard key={e.id} exercise={e} />
            ))
        )}
    </section>
    </>
  );
}