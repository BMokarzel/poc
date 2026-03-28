import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.tasks.list()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = useCallback(async (id, status) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    try {
      await api.tasks.updateStatus(id, status)
    } catch {
      // Revert on failure
      load()
    }
  }, [load])

  return { tasks, loading, error, updateStatus, reload: load }
}
