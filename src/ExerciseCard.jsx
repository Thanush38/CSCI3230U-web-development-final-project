import { Link } from 'react-router-dom';

import ExerciseImage from './ExerciseImage.jsx';

export default function ExerciseCard({ exercise }) {
  return (
    <Link to={`/exercises/${exercise.id}`} className='exercise-link'>
      <article className='card'>
          <ExerciseImage src={exercise.gif} alt={exercise.name} />
          <h3>{exercise.name}</h3>
          <p>Muscle Group: {exercise.muscle}</p>
      </article>
    </Link>
  );
}