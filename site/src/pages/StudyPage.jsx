import { useStudyPlan } from '../hooks/useStudyPlan'
import StudyTimeline from '../components/study/StudyTimeline'
import EmptyState from '../components/ui/EmptyState'

export default function StudyPage() {
  const { plan, loading } = useStudyPlan()

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8 animate-pulse space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-navy-mid rounded-2xl" />
        ))}
      </div>
    )
  }

  const hasTopics = plan?.topics?.length > 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="section-title mb-2">Study Plan</h1>
      <p className="text-sm text-slate-400 mb-8">Plano de estudos gerado com base nas avaliações</p>

      {!hasTopics ? (
        <EmptyState
          title="Nenhum plano de estudos ainda"
          description="Complete tasks e receba avaliações para que um plano personalizado seja gerado automaticamente."
        />
      ) : (
        <StudyTimeline plan={plan} />
      )}
    </div>
  )
}
