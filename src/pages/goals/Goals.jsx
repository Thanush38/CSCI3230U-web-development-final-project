
import Achievements from './components/Achievements'
import GoalForm from './components/GoalForm'
import GoalList from './components/GoalList'
import './Goals.css'
import { useCallback, useState } from 'react'

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

    const addGoal = useCallback(
        (goal) => {
            setGoals(
                [...goals, goal]
            )
        }, [goals, setGoals]
    )   

    const updateGoal = useCallback(
        (id, log) => {
            setGoals(
                goals.map((goal) => goal.id !== id ? goal : {
                    ...goal,
                    current: log.current,
                    logs: [...goal.logs, log]
                })
            )
        }, [goals, setGoals]
    )

    const removeGoal = useCallback(
        (id) => {
            setGoals(
                goals.filter((goal) => goal.id !== id)
            )
        }, [goals, setGoals]
    )

    const workoutCompleted = () => {} // function to be used to update goal info    

    return <div id='goals'>
        <h2>Goals</h2>
        <Achievements />
        <GoalForm addGoal={addGoal} />
        <GoalList goals={goals} updateGoal={updateGoal} deleteGoal={removeGoal} />
    </div>
}

export default Goals