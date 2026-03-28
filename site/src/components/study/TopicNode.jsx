import { useState } from 'react'
import { PRIORITY_COLORS, STUDY_STATUS_ICONS, MILESTONE_TYPE_ICONS } from '../../lib/utils'

const STUDY_STATUS_LABELS = {
  not_started: 'not started',
  in_progress: 'in progress',
  done:        'done',
}

export default function TopicNode({ topic, isLast }) {
  const [open, setOpen] = useState(false)
  const color = PRIORITY_COLORS[topic.priority] || '#FA5A50'
  const weeks = (topic.timeline?.endWeek || 1) - (topic.timeline?.startWeek || 1) + 1

  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center w-8 shrink-0">
        <div
          className="w-4 h-4 rounded-full border-2 border-white dark:border-[#0A0A1A] shadow-sm shrink-0 z-10 mt-1"
          style={{ backgroundColor: color }}
        />
        {!isLast && (
          <div className="flex-1 w-0.5 mt-1" style={{ backgroundColor: `${color}44`, minHeight: '2rem' }} />
        )}
      </div>

      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-slate-400">
            Semana {topic.timeline?.startWeek}
            {weeks > 1 ? `–${topic.timeline?.endWeek}` : ''}
          </span>
          <span className="badge text-xs" style={{ backgroundColor: `${color}22`, color }}>
            {topic.timeline?.effort || 'moderate'}
          </span>
          <span className="badge text-xs" style={{ backgroundColor: `${color}22`, color }}>
            {topic.priority} priority
          </span>
        </div>

        <div
          className="card cursor-pointer transition-all duration-200 hover:shadow-md"
          style={{
            borderLeft: `3px solid ${color}`,
            ...(open ? { outline: `2px solid ${color}`, outlineOffset: '0px' } : {}),
          }}
          onClick={() => setOpen(o => !o)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-slate-400">{topic.id}</span>
                <span className="badge text-xs" style={{ backgroundColor: `${color}22`, color }}>
                  {topic.technology}
                </span>
              </div>
              <h3 className="font-body font-medium text-navy dark:text-white">{topic.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {topic.timeline?.durationDays} dias
                {' · '}
                {STUDY_STATUS_ICONS[topic.completionStatus]}
                {' '}
                {STUDY_STATUS_LABELS[topic.completionStatus] || topic.completionStatus}
              </p>
            </div>

            <svg
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 mt-1 ${open ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className={`task-detail ${open ? 'open' : ''}`}>
            <div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-navy-light space-y-4">
                {topic.rationale && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Por que este tópico</h4>
                    <p className="text-sm text-navy dark:text-slate-200">{topic.rationale}</p>
                  </div>
                )}

                {topic.objectives?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Objetivos</h4>
                    <ul className="space-y-1">
                      {topic.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-2 text-sm text-navy dark:text-slate-200">
                          <span style={{ color }}>→</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {topic.references?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Referências</h4>
                    <div className="space-y-2">
                      {topic.references.map((ref, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-xs mt-0.5 opacity-60">
                            {ref.type === 'video' ? '▶' : ref.type === 'course' ? '🎓' : '📄'}
                          </span>
                          <div className="min-w-0">
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-sm font-medium hover:underline"
                              style={{ color }}
                            >
                              {ref.title}
                            </a>
                            {ref.estimatedTime && (
                              <span className="ml-2 text-xs text-slate-400">{ref.estimatedTime}</span>
                            )}
                            {ref.note && (
                              <p className="text-xs text-slate-400 mt-0.5">{ref.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {topic.milestones?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Milestones</h4>
                    <div className="space-y-1">
                      {topic.milestones.map((ms, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-navy dark:text-slate-200">
                          <span>{MILESTONE_TYPE_ICONS[ms.type] || '•'}</span>
                          <span>{ms.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
