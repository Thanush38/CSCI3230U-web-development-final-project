import './GoalForm.css'

import { buildGoal } from '../builders'

import { useCallback } from "react"



export default function GoalForm({goals, setGoals}) {

    const addGoal = useCallback((e) => {
        e.preventDefault()

        const form = e.currentTarget
        const formData = new FormData(form)

        const goal = buildGoal(formData)

        setGoals([...goals, goal])
        
    }, [goals, setGoals]
    )

    return <section id='goal-form'>
        <h3>Create A Goal</h3>
        <form onSubmit={addGoal}>
            <div id='main-content'>
                <label htmlFor="name">Goal Name:</label>
                <input name="name" id="name" type="text" required />

                <button>Add Goal</button>
            </div>
            <div id='info-content'>
                <label htmlFor="info">Goal Details:</label>
                <textarea name='info' id="info" type="text" />
            </div>
            <div id='data-content'>
                <div className='value-field'>
                    <label htmlFor="min">Starting Value</label>
                    <input name='min' id="min" type="number" step='any' required />
                </div>
                <div className='value-field'>
                    <label htmlFor="max">Goal Value</label>
                    <input name='max' id="max" type="number" step='any' required />
                </div>
                <div className='value-field'>
                    <label htmlFor="current">Current Value (Optional)</label>
                    <input name='current' id="min" step='any' type="number" />
                </div>
            </div>
        </form>
    </section>
}