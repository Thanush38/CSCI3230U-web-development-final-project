import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const STORAGE_KEY = 'savedPreBuiltWorkouts';
const LEGACY_DEFAULTS = ['Full Body Beginner', 'Push / Pull / Legs', 'Upper / Lower Split'];

function cleanSavedBuilds(parsed) {
    const base = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    const cleaned = { ...base };
    LEGACY_DEFAULTS.forEach((name) => {
        delete cleaned[name];
    });
    return cleaned;
}

const PlannerStateContext = createContext(null);

export function PlannerStateProvider({ children }) {
    const [savedBuilds, setSavedBuilds] = useLocalStorageState(
        STORAGE_KEY,
        {},
        cleanSavedBuilds
    );
    const [favouriteIds, setFavouriteIds] = useLocalStorageState(
        'favouriteExerciseIds',
        []
    );
    const [regimeItems, setRegimeItems] = useState([]);

    const toggleFavourite = (exerciseId) => {
        const key = String(exerciseId);
        setFavouriteIds((prev) =>
            prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
        );
    };

    const value = useMemo(
        () => ({
            savedBuilds,
            setSavedBuilds,
            favouriteIds,
            toggleFavourite,
            regimeItems,
            setRegimeItems,
        }),
        [savedBuilds, setSavedBuilds, favouriteIds, regimeItems]
    );

    return (
        <PlannerStateContext.Provider value={value}>
            {children}
        </PlannerStateContext.Provider>
    );
}

export function usePlannerState() {
    const ctx = useContext(PlannerStateContext);
    if (!ctx) {
        throw new Error('usePlannerState must be used inside PlannerStateProvider');
    }
    return ctx;
}