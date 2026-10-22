import { Link, Outlet } from 'react-router-dom';

import './App.css'

function App() {

  return (
    <body>
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

      <main>
        <Outlet />
      </main>
    </body>
  )
}

export default App
