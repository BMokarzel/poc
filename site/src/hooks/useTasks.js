import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

export function useTasks(project = 'backend') {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.tasks.list(project)
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [project])

  useEffect(() => { load() }, [load])

  const updateStatus = useCallback(async (id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    try {
      await api.tasks.updateStatus(id, status, project)
    } catch {
      load()
    }
  }, [load, project])

  return { tasks, loading, error, updateStatus, reload: load }
}
