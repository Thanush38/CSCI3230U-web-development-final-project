import { useCallback, useState } from 'react'
import './Goal.css'
import { buildLog } from '../builders'
import LogForm from './LogForm'
import Log from './Log'

export default function Goal({goal, updateGoal, deleteGoal}) {    
    const id = goal.id
    const name = goal.name
    const info = goal.info
    const min = goal.min
    const max = goal.max
    const current = goal.current

    const [showLogs, setShowlogs] = useState(false)

    const [editing, setEditing] = useState(false)

    const complete = current === max

    const completeGoal = useCallback(() => {
        const log = buildLog(goal, max, "Goal Complete")
        updateGoal(id, log)
    }, [goal, updateGoal]
    )

    return <article className='goal'>
        <h3>{name}</h3>
        <p>{info}</p>
        <div className='progress-track'>
            <div className='markers' inert>
                <p>{min}</p>
                <p className='progress'>Progress: {current}</p>
                <p>{max}</p>
            </div>
            <meter min={min} max={max} value={current} aria-label='progress tracking' />
        </div>
        <div className='buttons'>
            <button className='update' onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Update Goal'}</button>
            <button className='complete' onClick={completeGoal} disabled={editing | complete}>{complete ? 'Completed' : 'Mark As Complete'}</button>
            <button className='delete' onClick={() => deleteGoal(id)} disabled={editing}>Delete Goal</button>
        </div>
        <div className='log-form' hidden={!editing}>
            <LogForm goal={goal} updateGoal={updateGoal} />
        </div>
        <button className='log-button' onClick={() => setShowlogs(!showLogs)}>Logs</button>
        <div className='logs' hidden={!showLogs} >
            {
            goal.logs.map((log) => <Log
            key={log.id}
            log={log}
            />)
            }
        </div>
    </article>
}
