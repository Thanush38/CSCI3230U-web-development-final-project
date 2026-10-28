import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const exercises = [
    {
        name: 'Push-Up',
        muscle: 'chest',
        description: 'A bodyweight press that works the chest, shoulders, and triceps.',
        path: '/pushup'
    },
    {
        name: 'Bench Press',
        muscle: 'chest',
        description: 'A barbell press performed lying on a bench to build chest strength.',
        path: '/benchpress'
    },
    {
        name: 'Pull-Up',
        muscle: 'back',
        description: 'Hang from a bar and pull your chin over it to target the lats.',
        path: '/pullup'
    },
    {
        name: 'Bent-Over Row',
        muscle: 'back',
        description: 'Hinge at the hips and row a barbell toward your torso.',
        path: '/bentoverrow'
    },
    {
        name: 'Bodyweight Squat',
        muscle: 'legs',
        description: 'A foundational lower-body move for quads, glutes, and hamstrings.',
        path: '/bodyweightsquat'
    },
    {
        name: 'Deadlift',
        muscle: 'legs',
        description: 'Lift a loaded barbell from the floor using your hips and legs.',
        path: '/deadlift'
    },
    {
        name: 'Overhead Press',
        muscle: 'shoulders',
        description: 'Press a barbell or dumbbells overhead to build strong shoulders.',
        path: '/overheadpress'
    },
    {
        name: 'Bicep Curl',
        muscle: 'arms',
        description: 'Curl a pair of dumbbells to isolate the biceps.',
        path: '/bicepcurl'
    },
    {
        name: 'Tricep Dips',
        muscle: 'arms',
        description: 'Lower and raise your body between parallel bars or a bench.',
        path: '/tricepdips'
    },
    {
        name: 'Plank',
        muscle: 'core',
        description: 'Hold a straight-body position to build core stability.',
        path: '/plank'
    }
]

function ExerciseCard(props) {
  return (
    <Link className='page-link' to={props.path}>
        <article className='card'>
            <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
            <h3>{props.name}</h3>
            <p>Muscle Group: {props.muscle}</p>
            <p>{props.description}</p>
        </article>
    </Link>
  );
}


function ExerciseList({ exercises }) {
  return (
    <>
      {exercises.map((exercise) => (
          <ExerciseCard
          key={exercise.path}
          name={exercise.name} 
          muscle={exercise.muscle} 
          description={exercise.description} 
          path = {exercise.path}
          />
      ))}
    </>
  );
}

function Home(props) {
    const [search, setSearch] = useState('');
    const [muscle, setMuscle] = useState('');

    const filteredExercises = exercises.filter((exercise) => {
        const matchesSearch = exercise.name
            .toLowerCase()
            .includes(search.toLowerCase())

        const matchesMuscle =
            muscle === '' || exercise.muscle === muscle

        return matchesSearch && matchesMuscle
    })

    return <>
        <section id="search-section">
            <h2>Find an Exercise</h2>
            <form onSubmit={(event) => event.preventDefault()}>
                <label htmlFor='search'>Search</label>
                <input 
                    type="search"
                    id="search"
                    name="search"
                    placeholder="Search exercises..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
                <label htmlFor='muscle'>Muscle Group</label>
                <select 
                    id="muscle"
                    name="muscle"
                    value={muscle}
                    onChange={(event) => setMuscle(event.target.value)}
                >
                    <option value="">All</option>
                    <option value="chest" >Chest</option>
                    <option value="back" >Back</option>
                    <option value="legs" >Legs</option>
                    <option value="shoulders" >Shoulders</option>
                    <option value="arms" >Arms</option>
                    <option value="core" >Core</option>
                </select>
            </form>
        </section>

        <section id="browse-group" className="exercise-grid">
            <h2>Browse by Group</h2>
            <ExerciseList exercises={filteredExercises}/>
        </section>

        <section id="popular-exercises" className="exercise-grid">
            <h2>Popular Exercises</h2>
            <ExerciseCard name="Deadlift" muscle="Legs" description="Lift a loaded barbell from the floor using your hips and legs." path = "/deadlift"/>
            <ExerciseCard name="Overhead Press" muscle="Shoulders" description="Press a barbell or dumbbells overhead to build strong shoulders." path = "/overheadpress"/>
            <ExerciseCard name="Bicep Curl" muscle="Arms" description="Curl a pair of dumbbells to isolate the biceps." path = "/bicepcurl"/>
            <ExerciseCard name="Tricep Dips" muscle="Arms" description="Lower and raise your body between parallel bars or a bench." path = "/tricepdips"/>
            <ExerciseCard name="Plank" muscle="Core" description="Hold a straight-body position to build core stability." path = "/plank"/>
        </section>
    </>
}

export default Home