import { useState, useEffect } from 'react';

import { API, toExercise, categoryToBodyParts } from '../exercises.js';

const DEBOUNCE_MS = 400;
const PAGE_DELAY_MS = 1100; // stay under the API's rate limit

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function buildUrl(query, category, cursor) {
    const params = new URLSearchParams({ limit: 25 });
    if (query) params.set('name', query);
    if (category !== 'all') params.set('bodyParts', categoryToBodyParts[category].join(','));
    if (cursor) params.set('after', cursor);
    return `${API}?${params}`;
}

// The API's name filter is fuzzy; put exact substring matches first.
function rank(list, query) {
    if (!query) return list;
    const q = query.toLowerCase();
    return [...list].sort((a, b) =>
        Number(!a.name.toLowerCase().includes(q)) - Number(!b.name.toLowerCase().includes(q)));
}

/**
 * Searches ExerciseDB server-side for the given text / muscle group.
 * Returns status 'idle' (no request made) when both are empty, so the
 * caller can show highlights instead. The first page shows immediately;
 * remaining pages are fetched in the background and appended.
 */
export default function useExerciseSearch(query, category) {
    const [debouncedQuery, setDebouncedQuery] = useState(query.trim());
    // Results are tagged with the request they belong to, so idle/loading are
    // derived during render rather than set synchronously inside effects.
    const [page, setPage] = useState({ key: null, results: [], error: false });

    const idle = !debouncedQuery && category === 'all';
    const key = `${debouncedQuery}|${category}`;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (idle) return;

        const controller = new AbortController();

        async function fetchAll() {
            let results = [];
            let cursor = null;

            try {
                do {
                    if (cursor) await delay(PAGE_DELAY_MS);
                    if (controller.signal.aborted) return;

                    const response = await fetch(buildUrl(debouncedQuery, category, cursor), {
                        signal: controller.signal
                    });
                    if (!response.ok) throw new Error(`HTTP Response: ${response.status}`);

                    const data = await response.json();
                    results = [...results, ...(data.data ?? []).map(toExercise)];
                    setPage({ key, results: rank(results, debouncedQuery), error: false });

                    cursor = data.meta?.hasNextPage ? data.meta.nextCursor : null;
                } while (cursor);
            }
            catch (error) {
                if (error.name === 'AbortError') return;
                console.error(error);
                // Keep whatever pages already loaded; only error if we have nothing.
                setPage({ key, results: rank(results, debouncedQuery), error: results.length === 0 });
            }
        }

        fetchAll();

        return () => controller.abort();
    }, [idle, key, debouncedQuery, category]);

    const current = page.key === key;
    let status = 'ok';
    if (idle) status = 'idle';
    else if (!current) status = 'loading';
    else if (page.error) status = 'error';

    return { results: current ? page.results : [], status };
}
