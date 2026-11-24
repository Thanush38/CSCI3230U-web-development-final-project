import './GoalForm.css'

import { buildGoal } from '../builders'

import { useCallback, useState } from "react"



export default function GoalForm({addGoal}) {
    const [goalName, setGoalName] = useState('')
    const [goalInfo, setGoalInfo] = useState('')
    const [start, setStart] = useState('0')
    const [end, setEnd] = useState('100')
    const [current, setCurrent] = useState('')

    const add = useCallback((e) => {
        e.preventDefault()

        const goal = buildGoal(
            goalName,
            goalInfo,
            start,
            end,
            current
        )
        
        setGoalName('')
        setGoalInfo('')
        setStart('0')
        setEnd('100')
        setCurrent('')

        if (goal)
            addGoal(goal)
        else
            alert("Invalid data entered")
        
    }, [addGoal, goalName, goalInfo, start, end, current]
    )

    return <section id='goal-form'>
        <h3>Create A Goal</h3>
        <form onSubmit={add}>
            <div id='main-content'>
                <label htmlFor="name">Goal Name:</label>
                <input name="name" id="name" type="text" required
                value={goalName} onChange={(e) => {e.preventDefault(); setGoalName(e.target.value) }} />

                <button>Add Goal</button>
            </div>
            <div id='info-content'>
                <label htmlFor="info">Goal Details:</label>
                <textarea name='info' id="info" type="text" 
                value={goalInfo} onChange={(e) => {e.preventDefault(); setGoalInfo(e.target.value) }} />
            </div>
            <div id='data-content'>
                <div className='value-field'>
                    <label htmlFor="min">Starting Value</label>
                    <input name='min' id="min" type="number" step='any' required 
                    value={start} onChange={(e) => {e.preventDefault(); setStart(e.target.value) }} />
                </div>
                <div className='value-field'>
                    <label htmlFor="max">Goal Value</label>
                    <input name='max' id="max" type="number" step='any' required 
                    value={end} onChange={(e) => {e.preventDefault(); setEnd(e.target.value) }} />
                </div>
                <div className='value-field'>
                    <label htmlFor="current">Current Value (Optional)</label>
                    <input name='current' id="current" step='any' type="number" 
                    value={current} onChange={(e) => {e.preventDefault(); setCurrent(e.target.value) }} />
                </div>
            </div>
        </form>
    </section>
}