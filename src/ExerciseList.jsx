import { useState, useEffect } from 'react';

import ExerciseCard from './ExerciseCard.jsx';
import { API, toExercise } from './exercises.js';
import './pages/home/Home.css'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function ExerciseList() {
    const [exercises, setExercises] = useState([]);
    const [loadStatus, setLoadStatus] = useState('loading');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect( () => {
        const controller = new AbortController();

        async function fetchExercises() {
            setLoadStatus('loading');

            try {
                let allExercises = [];
                let cursor = null;
                let hasNextPage = true;

                while (hasNextPage) {
                    let url = `${API}?limit=25`;

                    if (cursor) {
                        url += `&after=${encodeURIComponent(cursor)}`;
                    }

                    const response = await fetch(url, {
                        signal: controller.signal
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP Response: ${response.status}`);
                    }

                    const data = await response.json();

                    allExercises = [
                        ...allExercises,
                        ...(data.data ?? []).map(toExercise)
                    ];

                    setLoadedCount(allExercises.length);
                    hasNextPage = data.meta.hasNextPage;
                    cursor = data.meta.nextCursor;

                    if (hasNextPage){
                        await delay(1100);
                    }
                }

                setExercises(allExercises);
                setLoadStatus('ok');
            }
            catch (error) {
                if (error.name === 'AbortError') return;

                console.error(error);
                setLoadStatus('error');
            }
        }

        fetchExercises();

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

    {loadStatus === 'loading' && <p>Loading exercises... {(loadedCount / 1500) * 100}% Loaded.</p>}
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