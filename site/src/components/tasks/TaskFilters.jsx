import { useMemo } from 'react'
import { TYPE_CONFIG, STATUS_CONFIG, TECH_COLORS, getTaskTechs, getTechBadgeStyle } from '../../lib/utils'

export default function TaskFilters({ tasks, filters, onChange }) {
  const technologies = useMemo(() => {
    const set = new Set()
    tasks.forEach(t => getTaskTechs(t).forEach(s => set.add(s)))
    return [...set]
  }, [tasks])

  function toggle(key, value) {
    const prev = filters[key] || []
    const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    onChange({ ...filters, [key]: next })
  }

  const inactiveChip = 'bg-slate-100 dark:bg-navy-mid text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-light'
  const activeChip = 'bg-primary text-white'

  function FilterChipGroup({ filterKey, config }) {
    return (
      <div className="flex gap-1">
        {Object.entries(config).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => toggle(filterKey, key)}
            className={`badge cursor-pointer transition-all ${(filters[filterKey] || []).includes(key) ? activeChip : inactiveChip}`}
          >
            {cfg.label}
          </button>
        ))}
      </div>
    )
  }

  const hasFilters = filters.search || filters.statuses?.length || filters.types?.length || filters.techs?.length

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="search"
        placeholder="Buscar task..."
        value={filters.search || ''}
        onChange={e => onChange({ ...filters, search: e.target.value })}
        className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-navy-light
                   bg-white dark:bg-navy-mid text-navy dark:text-white placeholder:text-slate-400
                   focus:outline-none focus:ring-2 focus:ring-primary/40 w-44"
      />

      <FilterChipGroup filterKey="statuses" config={STATUS_CONFIG} />
      <FilterChipGroup filterKey="types" config={TYPE_CONFIG} />

      {technologies.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {technologies.map(tech => (
            <button
              key={tech}
              onClick={() => toggle('techs', tech)}
              className="badge cursor-pointer transition-all"
              style={getTechBadgeStyle(tech, (filters.techs || []).includes(tech))}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      {hasFilters && (
        <button
          onClick={() => onChange({})}
          className="text-xs text-slate-400 hover:text-primary transition-colors"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
