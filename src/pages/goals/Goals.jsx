
import Achievements from './components/Achievements'
import GoalForm from './components/GoalForm'
import GoalList from './components/GoalList'
import './Goals.css'
import { useState } from 'react'

function Goals(props) {
    

    const [goals, setGoals] = useState([
        {
            id: 0,
            name: 'Example',
            info: 'This is an example',
            type: 'numerical',
            min: 0,
            max: 100,
            current: 33,
            logs: [{
                id: 1,
                date: "Tue October 27 2026",
                current: 33,
                message: "Goal Started"
            }]
        }
    ])

    const workoutCompleted = () => {} // function to be used to update goal info

    return <div id='goals'>
        <h2>Goals</h2>
        <Achievements />
        <GoalForm goals={goals} setGoals={setGoals} />
        <GoalList goals={goals} setGoals={setGoals} />
    </div>
}

export default Goals