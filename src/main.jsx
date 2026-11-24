import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Planner from './pages/planner/Planner.jsx';
import Recommended from './pages/recommended/Recommended.jsx';
import Timer from './pages/timer/Timer.jsx';
import Goals from './pages/goals/Goals.jsx';
import ExerciseList from './ExerciseList.jsx';
import ExerciseDetail from './ExerciseDetail.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ExerciseList /> },
      { path: 'exercises/:id', element: <ExerciseDetail /> },
      { path: "planner", element: <Planner /> },
      { path: "recommended", element: <Recommended /> },
      { path: "timer", element: <Timer /> },
      { path: "goals", element: <Goals /> }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
