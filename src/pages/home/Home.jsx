import { Link } from 'react-router-dom'
import './Home.css'

function Home(props) {
    return <>
        <section id="search-section">
            <h2>Find an Exercise</h2>
            <form>
                <label for="search">Search</label>
                <input type="search" id="search" name="search" placeholder="Search exercises..."></input>

                <label for="muscle">Muscle Group</label>
                <select id="muscle" name="muscle">
                    <option value="" selected >All</option>
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="legs">Legs</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="arms">Arms</option>
                    <option value="core">Core</option>
                </select>

                <button type="submit">Search</button>
            </form>
        </section>

        <section id="browse-group" class="exercise-grid">
            <h2>Browse by Group</h2>
            <Link className='page-link' to="/pushup">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Push-Up</h3>
                    <p>Muscle Group: Chest</p>
                    <p>A bodyweight press that works the chest, shoulders, and triceps.</p>
                </article>
            </Link>

            <Link className='page-link' to="/benchpress">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Bench Press</h3>
                    <p>Muscle Group: Chest</p>
                    <p>A barbell press performed lying on a bench to build chest strength.</p>
                </article>
            </Link>

            <Link className='page-link' to="/pullup">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Pull-Up</h3>
                    <p>Muscle Group: Back</p>
                    <p>Hang from a bar and pull your chin over it to target the lats.</p>
                </article>
            </Link>

            <Link className='page-link' to="/bentoverrow">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Bent-Over Row</h3>
                    <p>Muscle Group: Back</p>
                    <p>Hinge at the hips and row a barbell toward your torso.</p>
                </article>
            </Link>

            <Link className='page-link' to="/bodyweightsquat">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Bodyweight Squat</h3>
                    <p>Muscle Group: Legs</p>
                    <p>A foundational lower-body move for quads, glutes, and hamstrings.</p>
                </article>
            </Link>
        </section>

        <section id="popular-exercises" class="exercise-grid">
            <h2>Popular Exercises</h2>

            <Link className='page-link' to="/deadlift">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Deadlift</h3>
                    <p>Muscle Group: Legs</p>
                    <p>Lift a loaded barbell from the floor using your hips and legs.</p>
                </article>
            </Link>

            <Link className='page-link' to="/overheadpress">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Overhead Press</h3>
                    <p>Muscle Group: Shoulders</p>
                    <p>Press a barbell or dumbbells overhead to build strong shoulders.</p>
                </article>
            </Link>

            <Link className='page-link' to="/bicepcurl">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Bicep Curl</h3>
                    <p>Muscle Group: Arms</p>
                    <p>Curl a pair of dumbbells to isolate the biceps.</p>
                </article>
            </Link>

            <Link className='page-link' to="/tricepdips">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Tricep Dips</h3>
                    <p>Muscle Group: Arms</p>
                    <p>Lower and raise your body between parallel bars or a bench.</p>
                </article>
            </Link>

            <Link className='page-link' to="/plank">
                <article class="card">
                    <img src="workout-placeholder.svg" alt="Placeholder workout image"></img>
                    <h3>Plank</h3>
                    <p>Muscle Group: Core</p>
                    <p>Hold a straight-body position to build core stability.</p>
                </article>
            </Link>
        </section>
    </>
}

export default Home