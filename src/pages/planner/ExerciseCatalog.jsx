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

const GROUP_ALIASES = {
    chest: 'chest',
    pectorals: 'chest',
    pecs: 'chest',

    back: 'back',
    upperback: 'back',
    lowerback: 'back',
    lats: 'back',
    latissimusdorsi: 'back',
    traps: 'back',
    trapezius: 'back',
    rhomboids: 'back',

    leg: 'leg',
    legs: 'leg',
    upperlegs: 'leg',
    lowerlegs: 'leg',
    quads: 'leg',
    quadriceps: 'leg',
    hamstrings: 'leg',
    glutes: 'leg',
    gluteus: 'leg',
    calves: 'leg',

    shoulder: 'shoulder',
    shoulders: 'shoulder',
    delts: 'shoulder',
    deltoids: 'shoulder',

    arm: 'arm',
    arms: 'arm',
    upperarms: 'arm',
    lowerarms: 'arm',
    biceps: 'arm',
    triceps: 'arm',
    forearms: 'arm',

    core: 'core',
    waist: 'core',
    abs: 'core',
    abdominals: 'core',
    obliques: 'core',
};

function extractRawGroup(exercise) {
    if (!exercise || typeof exercise !== 'object') return '';
    return (
        exercise.muscleGroup ??
        exercise.muscle_group ??
        exercise.bodyPart ??
        exercise.body_part ??
        exercise.target ??
        exercise.muscle ??
        exercise.category ??
        ''
    );
}

function toFilterGroup(exercise) {
    const rawGroup = extractRawGroup(exercise);
    const compactGroup = String(rawGroup).toLowerCase().replace(/[^a-z]/g, '');

    if (compactGroup && GROUP_ALIASES[compactGroup]) {
        return GROUP_ALIASES[compactGroup];
    }

    const compactName = String(exercise?.name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

    if (compactName.includes('overheadpress') || compactName.includes('shoulderpress')) {
        return 'shoulder';
    }
    if (compactName.includes('benchpress') || compactName.includes('pushup') || compactName.includes('chest')) {
        return 'chest';
    }
    if (compactName.includes('pullup') || compactName.includes('chinup') || compactName.includes('row') || compactName.includes('lat')) {
        return 'back';
    }
    if (compactName.includes('squat') || compactName.includes('deadlift') || compactName.includes('lunge') || compactName.includes('calf')) {
        return 'leg';
    }
    if (compactName.includes('curl') || compactName.includes('tricep') || compactName.includes('bicep') || compactName.includes('dip')) {
        return 'arm';
    }
    if (compactName.includes('plank') || compactName.includes('crunch') || compactName.includes('situp') || compactName.includes('ab')) {
        return 'core';
    }

    return compactGroup || 'other';
}

function ExerciseCatalog({ catalog = [], isLoading = false, onQuickAdd }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [sortBy, setSortBy] = useState('name-asc');

    const filteredExercises = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        const filtered = catalog.filter((exercise) => {
            const resolvedGroup = toFilterGroup(exercise);
            const matchesGroup = selectedGroup === 'all' || resolvedGroup === selectedGroup;

            const nameText = String(exercise?.name ?? '').toLowerCase();
            const equipText = String(exercise?.equipment ?? '').toLowerCase();
            const matchesSearch =
                !normalizedQuery ||
                nameText.includes(normalizedQuery) ||
                equipText.includes(normalizedQuery) ||
                resolvedGroup.toLowerCase().includes(normalizedQuery);

            return matchesGroup && matchesSearch;
        });

        return [...filtered].sort((a, b) => {
            const groupA = toFilterGroup(a);
            const groupB = toFilterGroup(b);

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
                    {filteredExercises.slice(0, 12).map((exercise, idx) => {
                        const resolvedGroup = toFilterGroup(exercise);
                        const equipmentLabel = exercise?.equipment || 'Bodyweight';
                        const setsLabel = Number(exercise?.sets) || 3;
                        const timeLabel = Number(exercise?.time) || 5;

                        return (
                            <li key={exercise?.id ?? `${exercise?.name}-${idx}`} className="catalog-card">
                                <div className="catalog-info">
                                    <strong>{exercise?.name}</strong>
                                    <span className="catalog-meta">
                                        {' '}
                                        ({resolvedGroup} · {equipmentLabel} · {setsLabel} sets, {timeLabel} min)
                                    </span>
                                </div>
                                <div className="catalog-actions">
                                    <Link to={`/exercises/${exercise?.id}`}>Details</Link>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onQuickAdd?.({
                                                muscleGroup: resolvedGroup,
                                                name: exercise?.name,
                                                sets: setsLabel,
                                                time: timeLabel,
                                            })
                                        }
                                    >
                                        Add to Regime
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

export default ExerciseCatalog;