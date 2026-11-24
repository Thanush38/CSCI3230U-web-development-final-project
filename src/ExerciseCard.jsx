import { Link } from 'react-router-dom';

export default function ExerciseCard({ exercise }) {
  return (
    <Link to={`/exercises/${exercise.id}`} className='exercise-link'>
      <article className='card'>
          <img src={exercise.gif} alt={exercise.name}></img>
          <h3>{exercise.name}</h3>
          <p>Muscle Group: {exercise.muscle}</p>
      </article>
    </Link>
  );
}