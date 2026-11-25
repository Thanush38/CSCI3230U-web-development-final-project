import { useState } from 'react';

import ExerciseCard from './ExerciseCard.jsx';
import useExerciseSearch from './hooks/useExerciseSearch.js';
import { highlights } from './highlights.js';
import { useFavouriteStore } from '../stores/favourites.js';
import './pages/home/Home.css'

const MUSCLE_GROUPS = [
    { value: 'all', label: 'All' },
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'legs', label: 'Legs' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'arms', label: 'Arms' },
    { value: 'core', label: 'Core' },
    { value: 'favourites', label: 'Favourites'}
];

export default function ExerciseList() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const { results, status } = useExerciseSearch(search, category);

    const favourites = useFavouriteStore((state) => state.saved);
    const loadStatus = status === 'idle' ? 'ok' : status;

    const visible = category === 'favourites' ? favourites.filter((e) => e.name.toLowerCase().includes(search.toLowerCase())) : status === 'idle' ? highlights : results;

  return (
    <>
    <header className="exercise-header">
        <h1>All Exercises</h1>

        <section id="search-section" role="search">
            <label htmlFor="search" className="visually-hidden">Search exercises</label>
            <div className="search-box">
                <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
                <input
                    type='search'
                    id='search'
                    name='search'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search exercises..." />
                {search && (
                    <button
                        type="button"
                        className="search-clear"
                        aria-label="Clear search"
                        onClick={() => setSearch('')}>
                        ✕
                    </button>
                )}
            </div>

            <div className="chip-row" role="group" aria-label="Muscle group">
                {MUSCLE_GROUPS.map(({ value, label }) => (
                    <button
                        key={value}
                        type="button"
                        className="chip"
                        aria-pressed={category === value}
                        onClick={() => setCategory(value)}>
                        {label}
                    </button>
                ))}
            </div>
        </section>
    </header>

    {category !== 'favourites' && loadStatus === 'loading' && <p>Loading exercises...</p>}
    {category !== 'favourites' && loadStatus === 'error' && <p>Could not load exercises.</p>}

    <section id="browse-group" className="exercise-grid">
        {(category === 'favourites' || loadStatus === 'ok') && (
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