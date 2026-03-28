import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function useStudyPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    api.study.getPlan()
      .then(data => { if (!controller.signal.aborted) setPlan(data) })
      .catch(err => {
        if (controller.signal.aborted) return
        console.error('useStudyPlan: failed to load plan', err)
        setPlan({ topics: [], planStatus: 'draft' })
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  return { plan, loading }
}
