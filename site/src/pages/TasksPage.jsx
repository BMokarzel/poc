import { useParams, useNavigate } from 'react-router-dom'
import TaskBoard from '../components/tasks/TaskBoard'

const PROJECTS = [
  { id: 'backend',      label: 'Backend' },
  { id: 'ios',          label: 'iOS' },
  { id: 'android',      label: 'Android' },
  { id: 'react',        label: 'React' },
  { id: 'react-native', label: 'React Native' },
]

export default function TasksPage() {
  const { project = 'backend' } = useParams()
  const navigate = useNavigate()

  return (
    <div>
      {/* Project tabs */}
      <div className="border-b border-slate-200 dark:border-navy-light bg-white dark:bg-[#0A0A1A] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto" aria-label="Projetos">
            {PROJECTS.map(p => (
              <button
                key={p.id}
                onClick={() => navigate(`/tasks/${p.id}`)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  project === p.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <TaskBoard project={project} />
    </div>
  )
}
