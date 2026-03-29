import { useState, useMemo } from 'react'
import { useTasks } from '../../hooks/useTasks'
import TaskCard from './TaskCard'
import TaskFilters from './TaskFilters'
import LoadingScreen from '../layout/LoadingScreen'
import EmptyState from '../ui/EmptyState'
import { getTaskTechs } from '../../lib/utils'

export default function TaskBoard({ project = 'backend' }) {
  const { tasks, loading, updateStatus } = useTasks(project)
  const [filters, setFilters] = useState({})

  const filtered = useMemo(() => {
    return tasks.filter(task => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!task.name?.toLowerCase().includes(q) && !task.id?.toLowerCase().includes(q)) return false
      }
      if (filters.statuses?.length && !filters.statuses.includes(task.status)) return false
      if (filters.types?.length && !filters.types.includes(task.type)) return false
      if (filters.techs?.length && !filters.techs.some(t => getTaskTechs(task).includes(t))) return false
      return true
    })
  }, [tasks, filters])

  if (loading) return <LoadingScreen />

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Tasks</h1>
        <span className="text-sm text-slate-400">{filtered.length} de {tasks.length}</span>
      </div>

      <div className="mb-6">
        <TaskFilters tasks={tasks} filters={filters} onChange={setFilters} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma task encontrada"
          description={tasks.length === 0
            ? `Ainda não há tasks para este projeto. Crie um arquivo T-001.md em tasks/${project}/ para começar.`
            : 'Nenhuma task corresponde aos filtros aplicados.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(task => (
            <TaskCard key={task.id} task={task} onStatusChange={updateStatus} />
          ))}
        </div>
      )}
    </div>
  )
}
