import { memo, useMemo, useState } from 'react'
import {
  STATUS_CONFIG, TYPE_CONFIG, DIFFICULTY_CONFIG,
  nextStatus, markdownSectionToHtml, getTaskTechs, getTechBadgeStyle,
} from '../../lib/utils'

function taskSections(task) {
  const sections = []

  if (task.context)
    sections.push({ label: 'Contexto', content: task.context })

  if (task.scope)
    sections.push({ label: 'Escopo', content: task.scope })

  if (task.tips?.length)
    sections.push({ label: 'Dicas', content: task.tips.map(t => `- ${t}`).join('\n') })

  if (task.out_of_scope?.length)
    sections.push({ label: 'Fora do escopo', content: task.out_of_scope.map(t => `- ${t}`).join('\n') })

  if (task.definition_of_done?.length)
    sections.push({ label: 'Definition of Done', content: task.definition_of_done.map(d => `- [ ] ${d.description}`).join('\n') })

  if (task.domain?.length)
    sections.push({ label: 'Domain', content: task.domain.map(d => `- \`${d}\``).join('\n') })

  return sections
}

const Chevron = ({ open }) => (
  <svg
    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const TaskCard = memo(function TaskCard({ task, onStatusChange }) {
  const [open, setOpen] = useState(false)

  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo
  const typeCfg = TYPE_CONFIG[task.type] || {}
  const diffCfg = DIFFICULTY_CONFIG[task.difficulty] || {}
  const techs = useMemo(() => getTaskTechs(task), [task.services, task.tags])

  function handleStatusClick(e) {
    e.stopPropagation()
    onStatusChange(task.id, nextStatus(task.status))
  }

  return (
    <div
      className={`card cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        ${open ? 'ring-2 ring-primary/40' : ''}`}
    >
      <div onClick={() => setOpen(o => !o)} className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-400">{task.id}</span>
            {typeCfg.label && <span className={`badge ${typeCfg.classes}`}>{typeCfg.label}</span>}
            {diffCfg.label && <span className={`badge ${diffCfg.classes}`}>{diffCfg.label}</span>}
            {techs.map(t => (
              <span key={t} className="badge" style={getTechBadgeStyle(t)}>{t}</span>
            ))}
          </div>
          <h3 className="mt-1.5 font-body font-medium text-navy dark:text-white text-sm leading-snug truncate">
            {task.name || '(sem título)'}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleStatusClick}
            className={`badge ${statusCfg.bg} ${statusCfg.text} hover:opacity-80 transition-opacity cursor-pointer select-none`}
            title="Clique para alterar status"
          >
            {statusCfg.label}
          </button>
          <Chevron open={open} />
        </div>
      </div>

      <div className={`task-detail ${open ? 'open' : ''}`}>
        <div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-navy-light space-y-4">
            {task.estimate && (
              <p className="text-xs text-slate-400">
                Estimativa: <span className="font-medium">{task.estimate}</span>
              </p>
            )}
            {taskSections(task).map(({ label, content }) => (
              <div key={label}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  {label}
                </h4>
                <div
                  className="text-sm text-navy dark:text-slate-200 leading-relaxed prose-sm"
                  dangerouslySetInnerHTML={{ __html: markdownSectionToHtml(content) }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

export default TaskCard
