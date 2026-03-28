import { usePerson } from '../hooks/usePerson'
import { useTasks } from '../hooks/useTasks'
import RadarCard from '../components/dashboard/RadarCard'
import TaskProgressCard from '../components/dashboard/TaskProgressCard'
import QualityCard from '../components/dashboard/QualityCard'
import ErrorsCard from '../components/dashboard/ErrorsCard'

export default function DashboardPage() {
  const { person, loading: personLoading } = usePerson()
  const { tasks, loading: tasksLoading } = useTasks()

  if (personLoading || tasksLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-5 animate-pulse">
          <div className="col-span-2 h-72 bg-slate-100 dark:bg-navy-mid rounded-2xl" />
          <div className="h-72 bg-slate-100 dark:bg-navy-mid rounded-2xl" />
          <div className="h-72 bg-slate-100 dark:bg-navy-mid rounded-2xl" />
          <div className="col-span-2 h-72 bg-slate-100 dark:bg-navy-mid rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="section-title mb-6">Dashboard</h1>

      {/* 3-col grid: Card1 col-span-2 | Card2; Card3 | Card4 col-span-2 */}
      <div className="grid grid-cols-3 gap-5 items-start">
        <div className="col-span-2"><RadarCard person={person} /></div>
        <TaskProgressCard tasks={tasks} />
        <QualityCard person={person} />
        <div className="col-span-2"><ErrorsCard person={person} /></div>
      </div>
    </div>
  )
}
