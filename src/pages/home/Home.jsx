import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

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
            <h2>Search Results:</h2>
            <ExerciseList exercises={filteredExercises}/>
        </section>

        <section id="popular-exercises" className="exercise-grid">
            <h2>Popular Exercises</h2>
            <ExerciseCard name="Deadlift" muscle="Legs" description="Lift a loaded barbell from the floor using your hips and legs." path = "/deadlift" img = "/exercises/deadlift.jpg"/>
            <ExerciseCard name="Overhead Press" muscle="Shoulders" description="Press a barbell or dumbbells overhead to build strong shoulders." path = "/overheadpress" img = "/exercises/overheadpress.jpg"/>
            <ExerciseCard name="Bicep Curl" muscle="Arms" description="Curl a pair of dumbbells to isolate the biceps." path = "/bicepcurl" img = "/exercises/bicepcurl.jpg"/>
            <ExerciseCard name="Tricep Dips" muscle="Arms" description="Lower and raise your body between parallel bars or a bench." path = "/tricepdips" img = "/exercises/tricepdips.jpg"/>
            <ExerciseCard name="Plank" muscle="Core" description="Hold a straight-body position to build core stability." path = "/plank" img = '/exercises/Plank.jpg'/>
        </section>
    </>
}

export default Home