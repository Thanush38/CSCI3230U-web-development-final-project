import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ExerciseCatalog.css';

const MUSCLE_GROUPS = [
    { value: 'all', label: 'All Muscle Groups' },
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'leg', label: 'Leg' },
    { value: 'shoulder', label: 'Shoulder' },
    { value: 'arm', label: 'Arm' },
    { value: 'core', label: 'Core' },
];

function ExerciseCatalog({ catalog = [], isLoading = false, onQuickAdd }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [sortBy, setSortBy] = useState('name-asc');

    const filteredExercises = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        const filtered = catalog.filter((exercise) => {
            const matchesGroup =
                selectedGroup === 'all' || exercise.muscleGroup === selectedGroup;

            const matchesSearch =
                !normalizedQuery ||
                exercise.name.toLowerCase().includes(normalizedQuery) ||
                exercise.equipment.toLowerCase().includes(normalizedQuery) ||
                exercise.muscleGroup.toLowerCase().includes(normalizedQuery);

            return matchesGroup && matchesSearch;
        });

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'group-asc':
                    return (
                        a.muscleGroup.localeCompare(b.muscleGroup) ||
                        a.name.localeCompare(b.name)
                    );
                case 'time-asc':
                    return a.time - b.time;
                case 'name-asc':
                default:
                    return a.name.localeCompare(b.name);
            }
        });
    }, [catalog, searchQuery, selectedGroup, sortBy]);

    return (
        <section className="workout-input exercise-catalog" aria-labelledby="catalog-heading">
            <h2 id="catalog-heading">Exercise Library</h2>

            <div className="catalog-controls">
                <div className="control-group">
                    <label htmlFor="exercise-search">Search</label>
                    <input
                        id="exercise-search"
                        type="search"
                        placeholder="Search by name or equipment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="control-group">
                    <label htmlFor="exercise-group-filter">Muscle Group</label>
                    <select
                        id="exercise-group-filter"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                        {MUSCLE_GROUPS.map((group) => (
                            <option key={group.value} value={group.value}>
                                {group.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label htmlFor="exercise-sort">Sort By</label>
                    <select
                        id="exercise-sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="group-asc">Muscle Group</option>
                        <option value="time-asc">Duration (Shortest)</option>
                    </select>
                </div>
            </div>

            {!isLoading && filteredExercises.length === 0 ? (
                <p className="empty-state">No exercises match your search and filter criteria.</p>
            ) : (
                <ul className="catalog-list">
                    {filteredExercises.slice(0, 12).map((exercise) => (
                        <li key={exercise.id} className="catalog-card">
                            <div className="catalog-info">
                                <strong>{exercise.name}</strong>
                                <span className="catalog-meta">
                                    {' '}
                                    ({exercise.muscleGroup} · {exercise.equipment} · {exercise.sets} sets, {exercise.time} min)
                                </span>
                            </div>
                            <div className="catalog-actions">
                                <Link to={`/exercises/${exercise.id}`}>Details</Link>
                                <button
                                    type="button"
                                    onClick={() =>
                                        onQuickAdd?.({
                                            muscleGroup: exercise.muscleGroup,
                                            name: exercise.name,
                                            sets: exercise.sets,
                                            time: exercise.time,
                                        })
                                    }
                                >
                                    Add to Regime
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default ExerciseCatalog;