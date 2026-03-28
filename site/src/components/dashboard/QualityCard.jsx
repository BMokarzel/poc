import Card from '../ui/Card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { LEVEL_CONFIG, CHART_TOOLTIP_STYLE } from '../../lib/utils'

export default function QualityCard({ person }) {
  const history = person?.evaluationHistory || []

  const counts = {}
  history.forEach(e => {
    counts[e.finalLevel] = (counts[e.finalLevel] || 0) + 1
  })

  const data = Object.entries(LEVEL_CONFIG)
    .filter(([key]) => counts[key])
    .map(([key, cfg]) => ({ name: cfg.label, value: counts[key], color: cfg.color }))

  const total = history.length
  const exceptionalPct = total ? Math.round(((counts.exceptional || 0) / total) * 100) : 0

  return (
    <Card className="flex flex-col h-full">
      <h2 className="section-title mb-1">Qualidade</h2>
      <p className="text-xs text-slate-400 mb-4">Níveis de avaliação</p>

      <div className="flex-1 relative min-h-[200px]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-slate-400">Nenhuma avaliação ainda</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {data.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="font-display text-2xl text-navy dark:text-white">{exceptionalPct}%</span>
              <p className="text-xs text-slate-400">excepcional</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
