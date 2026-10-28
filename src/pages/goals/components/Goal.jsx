import { useCallback, useState } from 'react'
import './Goal.css'
import { buildLog, buildLogManual } from '../builders'

export default function Goal({goal, index, goals, setGoals}) {    

    const name = goal.name
    const info = goal.info
    const min = goal.min
    const max = goal.max
    const current = goal.current

    const [showLogs, setShowlogs] = useState(false)

    const [editing, setEditing] = useState(false)

    const updateGoal = useCallback((e) => {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)

        const newGoal = {...goal}

        newGoal.current = Number(formData.get('current'))
        const log = buildLog(goal, formData)
        newGoal.logs = [...newGoal.logs, log]

        setGoals(goals.with(index, newGoal))

    }, [goal, goals, setGoals, index]
    )

    const completeGoal = useCallback(() => {
        const newGoal = {...goal}
        const newLog = buildLogManual(newGoal.max, "Goal Completed")
        newGoal.current = newGoal.max
        newGoal.logs = [...newGoal.logs, newLog]
        setGoals(goals.with(index, newGoal))
    }, [goal, goals, setGoals, index]
    )

    const removeGoal = useCallback(() => {
        setGoals(goals.filter(a => a !== goal))
    }, [goal, goals, setGoals]
    )

    return <article className='goal'>
        <h3>{name}</h3>
        <p>{info}</p>
        <div className='progress-track'>
            <div className='markers'>
                <p>{min}</p>
                <p>{current}</p>
                <p>{max}</p>
            </div>
            <meter min={min} max={max} value={current} />
        </div>
        <div className='buttons'>
            <button className='update' onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Update Goal'}</button>
            <button className='complete' onClick={completeGoal} disabled={editing}>Mark As Complete</button>
            <button className='delete' onClick={removeGoal} disabled={editing}>Delete Goal</button>
        </div>
        <div className='log-form' hidden={!editing}>
            <form onSubmit={updateGoal}>
                <div className='current'>
                    <label htmlFor="current">New Value</label>
                    <input name='current' type='number' defaultValue={current} />
                </div>
                <div className='message'>
                    <label htmlFor="message">Log Message</label>
                    <textarea name='message' />
                </div>
                <button>Submit</button>
            </form>
        </div>
        <button className='log-button' onClick={() => setShowlogs(!showLogs)}>Logs</button>
        <div className='logs' hidden={!showLogs} >
            {
            goal.logs.map((log, id) => <Log
            key={id}
            log={log}
            />)
            }
        </div>
    </article>
}

function Log({log}) {


    return <article className='log'>
        <h4>Date: {log.date} - New Progress: {log.current}</h4>
        <p>{log.message}</p>
    </article>
}