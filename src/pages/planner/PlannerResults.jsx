import React from 'react';
import './PlannerResults.css';

function PlannerResults({
    completedCount=0,
    totalCount=0,
    totalMinutes=0,
    caloriesBurned=0,
}) {
    return (
        <section className="workout-input" aria-labelledby="results-heading">
            <h2 id="results-heading" className="Results">Results</h2>
            <p><strong>Workouts completed:</strong>{completedCount}/{totalCount}</p>
            <p><strong>Total Activie time</strong> {totalMinutes} minutes</p>
            <p><strong>Etimated calories burned:</strong>{caloriesBurned} kcal</p>
        </section>
    );
}
export default PlannerResults;