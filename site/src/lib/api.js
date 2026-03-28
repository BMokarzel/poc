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
  tasks: {
    list: () => request('/tasks'),
    get: id => request(`/tasks/${id}`),
    updateStatus: (id, status) =>
      request(`/tasks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
  person: {
    get: () => request('/person'),
  },
  study: {
    getPlan: () => request('/study/plan'),
  },
}
