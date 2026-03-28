import { useState } from 'react'
import { TECH_COLORS } from '../../lib/utils'

export default function TechCard({ tech }) {
  const [open, setOpen] = useState(false)
  const color = TECH_COLORS[tech.name] || '#FA5A50'

  return (
    <div
      className="card cursor-pointer transition-all duration-200 hover:shadow-md"
      style={open ? { outline: `2px solid ${color}`, outlineOffset: '0px' } : {}}
      onClick={() => setOpen(o => !o)}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: `${color}22` }}
        >
          {tech.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base text-navy dark:text-white">{tech.name}</h3>
          <p className="text-xs text-slate-400 truncate">{tech.tagline}</p>
        </div>
        <div
          className="shrink-0 w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Expandable */}
      <div className={`task-detail ${open ? 'open' : ''}`}>
        <div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-navy-light">
            <p className="text-sm text-navy dark:text-slate-200 leading-relaxed">
              {tech.description}
            </p>
            {tech.docsUrl && (
              <a
                href={tech.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 mt-3 text-xs font-medium"
                style={{ color }}
              >
                Documentação oficial
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
