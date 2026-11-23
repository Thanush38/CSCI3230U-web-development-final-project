import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import ExerciseCard from './ExerciseCard.jsx';
import './pages/home/Home.css'

export default function ExerciseList() {
    const {
        exercises,
        loadStatus,
        loadedCount
    } = useOutletContext();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

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