import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { API, toExercise } from './exercises.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function ExerciseLoader(){
    const [exercises, setExercises] = useState([]);
    const [loadStatus, setLoadStatus] = useState('loading');
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

    return (
        <Outlet context={{
            exercises,
            loadStatus,
            loadedCount
        }} />
    )
}