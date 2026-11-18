import { useCallback, useEffect, useState } from "react";


export default function useGoals() {

  const [goals, setGoals] = useState(() => {
    const goals = localStorage.getItem('goals');
    return goals ? JSON.parse(goals) : []
  })

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
  }, [goals])

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

  return [goals, addGoal, updateGoal, removeGoal]
}