import { useCallback, useState } from "react"
import { buildLog } from "../builders"


export default function LogForm({goal, updateGoal}) {
  const [current, setCurrent] = useState('')
  const [message, setMessage] = useState('')

  const update = useCallback(
    (e) => {
      e.preventDefault()

      const log = buildLog(goal, current, message)

      setCurrent('')
      setMessage('')

      if (log)
        updateGoal(goal.id, log)
      else
        alert('Invalid Log Data')
    }
  )

  return <form onSubmit={update}>
      <div className='current'>
          <label htmlFor="current">New Value</label>
          <input name='current' type='number' step='any'
          value={current} onChange={(e) => {e.preventDefault(); setCurrent(e.target.value)}} />
      </div>
      <div className='message'>
          <label htmlFor="message">Log Message</label>
          <textarea name='message' 
          value={message} onChange={(e) => {e.preventDefault(); setMessage(e.target.value)}} />
      </div>
      <button>Submit</button>
  </form>
}