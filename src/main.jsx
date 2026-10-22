import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Home from './pages/home/Home.jsx';
import Planner from './pages/planner/Planner.jsx';
import Recommended from './pages/recommended/Recommended.jsx';
import Timer from './pages/timer/Timer.jsx';
import Goals from './pages/goals/Goals.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
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
