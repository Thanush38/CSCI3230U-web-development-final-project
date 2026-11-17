
import Achievements from './components/Achievements'
import GoalForm from './components/GoalForm'
import GoalList from './components/GoalList'
import './Goals.css'
import { useCallback, useState } from 'react'
import useGoals from './hooks/useGoals'

function Goals(props) {

    const [goals, addGoal, updateGoal, removeGoal] = useGoals()

    return <div id='goals'>
        <h2>Goals</h2>
        <Achievements />
        <GoalForm addGoal={addGoal} />
        <GoalList goals={goals} updateGoal={updateGoal} deleteGoal={removeGoal} />
    </div>
}

export default Goals