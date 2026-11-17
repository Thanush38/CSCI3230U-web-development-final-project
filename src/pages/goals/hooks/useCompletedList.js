import { useEffect, useState } from "react"


export default function useCompletedList() {
  const [completedList, setCompletedList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const completedWorkouts = ['EIeI8Vf']
    
  useEffect(() => { // AI modified code to prevent load bugs (copilot)
    const controller = new AbortController()

    async function loadCompletedList() {
      try {
        const results = await Promise.all(
          completedWorkouts.map(async () => {
            const response = await fetch('./dummydb.json', {
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