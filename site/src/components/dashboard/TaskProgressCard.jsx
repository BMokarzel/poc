import Card from '../ui/Card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { STATUS_CONFIG, CHART_TOOLTIP_STYLE } from '../../lib/utils'

// Colors keyed by status — derived from STATUS_CONFIG.color to avoid diverging
const COLORS = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.color])
)

export default function TaskProgressCard({ tasks }) {
  const counts = { todo: 0, in_progress: 0, done: 0 }
  tasks.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1 })
  const total = tasks.length
  const donePct = total ? Math.round((counts.done / total) * 100) : 0

  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: STATUS_CONFIG[key].label, value, key }))

  return (
    <Card className="flex flex-col h-full">
      <h2 className="section-title mb-1">Progresso</h2>
      <p className="text-xs text-slate-400 mb-4">Conclusão de tasks</p>

      <div className="flex-1 relative min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.length ? data : [{ name: 'Sem tasks', value: 1, key: 'empty' }]}
              cx="50%" cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              dataKey="value"
            >
              {(data.length ? data : [{ key: 'empty' }]).map((entry, i) => (
                <Cell key={i} fill={COLORS[entry.key] || '#393973'} />
              ))}
            </Pie>
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="font-display text-2xl text-navy dark:text-white">{donePct}%</span>
            <p className="text-xs text-slate-400">concluído</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
