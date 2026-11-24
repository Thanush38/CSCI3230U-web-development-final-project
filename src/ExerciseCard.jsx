import { Link } from 'react-router-dom';

import ExerciseImage from './ExerciseImage.jsx';
import { useFavouriteStore, useIsFavourite } from '../stores/favourites.js';

export default function ExerciseCard({ exercise }) {
  const isFavourite = useIsFavourite(exercise.id);
  const toggle = useFavouriteStore((state) => state.toggle);
  
  return (
    <article className='card'>
      <Link to={`/exercises/${exercise.id}`} className='exercise-link'>
        <ExerciseImage src={exercise.gif} alt={exercise.name} />
        <h3>{exercise.name}</h3>
        <p>Muscle Group: {exercise.muscle}</p>
      </Link>

      <button
        className={isFavourite ? 'active' : ''}
        onClick={() => toggle(exercise)}
      >
        {isFavourite ? '♥' : '♡'}
      </button>

    </article>
  );
}