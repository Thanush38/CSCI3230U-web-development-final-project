// AI-assisted - see AI-USAGE.md
//shows real ExerciseDB exercises for the selected goal, linking to each detail page
import { useState } from "react";
import { Link } from "react-router-dom";
import useGoalExercises from "../useGoalExercises";

//Some API GIF links point to files that don't exist. If the image fails to load, show a placeholder box instead
function ExerciseThumb({ src, name }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="goal-exercise-placeholder"
        role="img"
        aria-label={`No preview available for ${name}`}
      >
        No preview
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} demonstration`}
      width="120"
      height="120"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function GoalExercises({ goalId, goalName }) {
  const { exercises, status } = useGoalExercises(goalId);

  return (
    <section className="goal-exercises" aria-labelledby="goal-exercises-heading">
      <h2 id="goal-exercises-heading">More exercises for {goalName}</h2>

      {status === "loading" && <p role="status">Loading exercises...</p>}
      {status === "error" && (
        <p role="alert">Couldn't load exercises right now. Please try again later.</p>
      )}
      {status === "empty" && <p>No exercises found for this goal.</p>}

      {status === "ok" && (
        <ul className="goal-exercise-list">
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <Link to={`/exercises/${exercise.id}`}>
                <ExerciseThumb src={exercise.gif} name={exercise.name} />
                <span>{exercise.name}</span>
              </Link>
              <span>Targets: {exercise.muscle}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default GoalExercises;