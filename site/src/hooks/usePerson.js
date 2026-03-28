import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function usePerson() {
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    api.person.get()
      .then(data => { if (!controller.signal.aborted) setPerson(data) })
      .catch(err => {
        if (controller.signal.aborted) return
        console.error('usePerson: failed to load profile', err)
        setPerson({})
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  return { person, loading }
}
