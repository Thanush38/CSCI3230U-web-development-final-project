import { useEffect, useState } from "react"


export default function useCompletedList() {
  const [completedList, setCompletedList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [completedWorkouts] = useState(() => {
    const completedWorkouts = localStorage.getItem('completedWorkouts')
    return completedWorkouts ? JSON.parse(completedWorkouts) : []
  })
    
  useEffect(() => { // AI modified code to prevent load bugs  see AI-USAGE.md #2
    const controller = new AbortController()

    async function loadCompletedList() {
      try {

        let exercises = []

        completedWorkouts.forEach(workout => {
          exercises = exercises.concat(workout.exercises)
        });

        const results = await Promise.all(
          exercises.map(async (item) => {
            console.log(item);
            
            const response = await fetch(`https://oss.exercisedb.dev/api/v1/exercises/${item.id}`, {
              signal: controller.signal,
            })

            if (!response.ok) {
              throw new Error(`Error, Status: ${response.status}`)
            }

            return response.json()
          })
        )

        setCompletedList(results)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message)
          console.log(error)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadCompletedList()

    return () => controller.abort()
  }, [])

  return [completedList, loading, error]
}