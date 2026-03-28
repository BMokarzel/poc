import { useMemo } from 'react'
import Card from '../ui/Card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { TECH_COLORS, CHART_TOOLTIP_STYLE, inferTechFromPattern } from '../../lib/utils'

export default function ErrorsCard({ person }) {
  const data = useMemo(() => {
    const patterns = (person?.patterns || []).filter(p => p.type === 'negative' && p.status === 'active')
    const grouped = {}
    patterns.forEach(p => {
      const tech = inferTechFromPattern(p.pattern)
      grouped[tech] = (grouped[tech] || 0) + 1
    })
    return Object.entries(grouped)
      .map(([tech, count]) => ({ tech, count }))
      .sort((a, b) => b.count - a.count)
  }, [person?.patterns])

  return (
    <Card className="h-full">
      <h2 className="section-title mb-1">Padrões de erro</h2>
      <p className="text-xs text-slate-400 mb-6">Erros recorrentes por tecnologia</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-xs text-slate-400">Nenhum padrão negativo identificado ainda</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="tech" tick={{ fontSize: 11, fill: '#8CB3D9', fontFamily: 'DM Sans' }} />
            <YAxis tick={{ fontSize: 11, fill: '#8CB3D9' }} allowDecimals={false} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={v => [v, 'Ocorrências']} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={TECH_COLORS[entry.tech] || '#FA5A50'} />
              ))}
              <LabelList dataKey="count" position="top" style={{ fontSize: 11, fill: '#8CB3D9' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
