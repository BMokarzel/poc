import TopicNode from './TopicNode'

export default function StudyTimeline({ plan }) {
  const topics = [...(plan.topics || [])].sort(
    (a, b) => (a.timeline?.startWeek || 0) - (b.timeline?.startWeek || 0)
  )

  const totalWeeks = plan.meta?.totalDurationWeeks || 0

  return (
    <div>
      {/* Plan header */}
      {plan.meta && (
        <div className="card mb-8 bg-gradient-to-r from-primary/10 to-secondary-dark/10 border-primary/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg text-navy dark:text-white">
                {plan.id || 'Plano de Estudos'}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{plan.diagnosis?.description || ''}</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="font-display text-2xl text-primary">{totalWeeks}</p>
                <p className="text-xs text-slate-400">semanas</p>
              </div>
              <div>
                <p className="font-display text-2xl text-primary">{topics.length}</p>
                <p className="text-xs text-slate-400">tópicos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly overview chips */}
      {plan.weeklyOverview?.length > 0 && (
        <div className="mb-8 flex gap-2 flex-wrap">
          {plan.weeklyOverview.map(week => (
            <div
              key={week.week}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-navy-mid border border-slate-100 dark:border-navy-light"
            >
              <p className="text-xs font-medium text-navy dark:text-white">Semana {week.week}</p>
              <p className="text-xs text-slate-400 mt-0.5">{week.focus}</p>
            </div>
          ))}
        </div>
      )}

      {/* Topic timeline */}
      <div>
        {topics.map((topic, i) => (
          <TopicNode
            key={topic.id}
            topic={topic}
            isLast={i === topics.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
