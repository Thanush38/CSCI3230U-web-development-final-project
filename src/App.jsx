import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom'

import ExerciseList from './ExerciseList.jsx';
import './App.css'

function App() {

  return (
    <div className='body'>
      <header>
        <Link className='logo' to="/">
            <img src="/dumbbell.png" alt="WorkOnSite logo" />
            WorkOnSite
        </Link>
        <h1 id="Title">Workout Builder</h1>
        <nav>
          <Link className='page-link' to="/">Home</Link>
          <Link className='page-link' to="/planner">Workout Planner</Link>
          <Link className='page-link' to="/recommended">Recommended Builds</Link>
          <Link className='page-link' to="/timer">Workout Timer</Link>
          <Link className='page-link' to="/goals">Goals</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<ExerciseList />} />
      </Routes>
    </div>
  )
}

export default App
