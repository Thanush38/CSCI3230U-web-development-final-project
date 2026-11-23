import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom'

import ExerciseList from './ExerciseList.jsx';
import Planner from './pages/planner/Planner.jsx';
import Recommended from './pages/recommended/Recommended.jsx';
import Timer from './pages/timer/Timer.jsx';
import Goals from './pages/goals/Goals.jsx';
import ExerciseLoader from './ExerciseLoader.jsx';

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
        <Route element={<ExerciseLoader />}>
          <Route path="/" element={<ExerciseList />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/recommended" element={<Recommended />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/goals" element={<Goals />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
