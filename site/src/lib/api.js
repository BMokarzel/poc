const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res.json()
}

export const api = {
  projects: {
    list: () => request('/projects'),
  },
  tasks: {
    list: (project = 'backend') => request(`/tasks?project=${project}`),
    get: (id, project = 'backend') => request(`/tasks/${id}?project=${project}`),
    updateStatus: (id, status, project = 'backend') =>
      request(`/tasks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, project }),
      }),
  },
  person: {
    get: () => request('/person'),
  },
  study: {
    getPlan: () => request('/study/plan'),
  },
}
