export default function ExerciseCard({ exercise }) {
  return (
    <article className='card'>
        <img src={exercise.gif} alt="workout-placeholder.svg"></img>
        <h3>{exercise.name}</h3>
        <p>Muscle Group: {exercise.muscle}</p>
        <p>{exercise.description}</p>
    </article>
  );
}