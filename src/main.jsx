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
import PushUp from './pages/Clickables/pushup.jsx';
import Benchpress from './pages/Clickables/benchpress.jsx';
import Bentoverrow from './pages/Clickables/bentoverrow.jsx';
import Bicepcurl from './pages/Clickables/bicepcurl.jsx';
import Bodyweightsquat from './pages/Clickables/bodyweightsquat.jsx';
import Deadlift from './pages/Clickables/deadlift.jsx';
import Overheadpress from './pages/Clickables/overheadpress.jsx';
import Plank from './pages/Clickables/plank.jsx';
import Pullup from './pages/Clickables/pullup.jsx';
import Tricepdips from './pages/Clickables/tricepdips.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "planner", element: <Planner /> },
      { path: "recommended", element: <Recommended /> },
      { path: "timer", element: <Timer /> },
      { path: "goals", element: <Goals /> },
      { path: "pushup", element: <PushUp/>},
      { path: "benchpress", element: <Benchpress />},
      { path: "bentoverrow", element: <Bentoverrow />},
      { path: "bicepcurl", element: <Bicepcurl />},
      { path: "bodyweightsquat", element: <Bodyweightsquat />},
      { path: "deadlift", element: <Deadlift />},
      { path: 'overheadpress', element: <Overheadpress />},
      { path: "plank", element: <Plank />},
      { path: "pullup", element: <Pullup />},
      { path: "tricepdips", element: <Tricepdips />}
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
