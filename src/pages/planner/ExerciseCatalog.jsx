import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useExerciseSearch from '../../hooks/useExerciseSearch';
import { mapApiExercise } from '../../services/exerciseApi';
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

// Planner section -> category name used by useExerciseSearch (home page)
const SEARCH_CATEGORY = {
    all: 'all',
    chest: 'chest',
    back: 'back',
    leg: 'legs',
    shoulder: 'shoulders',
    arm: 'arms',
    core: 'core',
};

const PAGE_SIZE = 12;

const normalizeName = (name) => String(name ?? '').trim().toLowerCase();

function ExerciseCatalog({ catalog = [], isLoading = false, regimeItems = [], onQuickAdd }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [sortBy, setSortBy] = useState('name-asc');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Searches all of ExerciseDB server-side. With no search text and no
    // group selected it stays idle, and we show the preloaded catalog instead.
    const { results, status } = useExerciseSearch(
        searchQuery,
        SEARCH_CATEGORY[selectedGroup]
    );
    const isIdle = status === 'idle';
    const isSearching = isIdle ? isLoading : status === 'loading';

    const sortedExercises = useMemo(() => {
        const source = isIdle
            ? catalog
            : results.map((exercise, index) => mapApiExercise(exercise, index));

        return [...source].sort((a, b) => {
            const groupA = String(a?.muscleGroup ?? '');
            const groupB = String(b?.muscleGroup ?? '');

            switch (sortBy) {
                case 'name-desc':
                    return String(b?.name ?? '').localeCompare(String(a?.name ?? ''));
                case 'group-asc':
                    return (
                        groupA.localeCompare(groupB) ||
                        String(a?.name ?? '').localeCompare(String(b?.name ?? ''))
                    );
                case 'time-asc':
                    return (Number(a?.time) || 0) - (Number(b?.time) || 0);
                case 'name-asc':
                default:
                    return String(a?.name ?? '').localeCompare(String(b?.name ?? ''));
            }
        });
    }, [isIdle, catalog, results, sortBy]);

    const visibleExercises = sortedExercises.slice(0, visibleCount);

    // Match by name: regime entries get their own ids, and loaded builds
    // only store names.
    const regimeNames = useMemo(
        () => new Set(regimeItems.map((item) => normalizeName(item.name))),
        [regimeItems]
    );

    return (
        <section className="workout-input exercise-catalog" aria-labelledby="catalog-heading">
            <h2 id="catalog-heading">Exercise Library</h2>

            <div className="catalog-controls">
                <div className="control-group">
                    <label htmlFor="exercise-search">Search</label>
                    <input
                        id="exercise-search"
                        type="search"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setVisibleCount(PAGE_SIZE);
                        }}
                    />
                </div>

                <div className="control-group">
                    <label htmlFor="exercise-group-filter">Muscle Group</label>
                    <select
                        id="exercise-group-filter"
                        value={selectedGroup}
                        onChange={(e) => {
                            setSelectedGroup(e.target.value);
                            setVisibleCount(PAGE_SIZE);
                        }}
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

            {status === 'error' ? (
                <p role="alert" className="form-error">
                    Could not search exercises right now. Please try again.
                </p>
            ) : isSearching && sortedExercises.length === 0 ? (
                <p role="status" className="empty-state">Searching exercises...</p>
            ) : sortedExercises.length === 0 ? (
                <p className="empty-state">No exercises match your search and filter criteria.</p>
            ) : (
                <>
                    <p role="status" className="catalog-meta">
                        Showing {visibleExercises.length} of {sortedExercises.length} exercises
                    </p>
                    <ul className="catalog-list">
                        {visibleExercises.map((exercise) => {
                            const isAdded = regimeNames.has(normalizeName(exercise.name));
                            return (
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
                                        className={isAdded ? 'is-added' : undefined}
                                        onClick={() =>
                                            onQuickAdd?.({
                                                muscleGroup: exercise.muscleGroup,
                                                name: exercise.name,
                                                sets: exercise.sets,
                                                time: exercise.time,
                                                gif: exercise.gif,
                                                exerciseId: exercise.id,
                                            })
                                        }
                                    >
                                        {isAdded ? 'Added ✓' : 'Add to Regime'}
                                    </button>
                                </div>
                            </li>
                            );
                        })}
                    </ul>
                    {visibleCount < sortedExercises.length && (
                        <div className="catalog-actions">
                            <button
                                type="button"
                                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                            >
                                Show more
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default ExerciseCatalog;
