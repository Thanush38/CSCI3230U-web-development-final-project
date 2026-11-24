import { useState, useEffect, useCallback } from 'react';

export function useLocalStorageState(key, initialValue, transformInitial) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const raw = window.localStorage.getItem(key);
            const parsed = raw !== null ? JSON.parse(raw) : initialValue;
            const normalized = typeof transformInitial === 'function'
                ? transformInitial(parsed)
                : parsed;

            if (raw === null && typeof transformInitial === 'function') {
                window.localStorage.setItem(key, JSON.stringify(normalized));
            }
            return normalized;
        } catch {
            return typeof initialValue === 'function' ? initialValue() : initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch {
        }
    }, [key, storedValue]);

    const resetValue = useCallback(() => {
        setStoredValue(typeof initialValue === 'function' ? initialValue() : initialValue);
    }, [initialValue]);

    return [storedValue, setStoredValue, resetValue];
}