import Card from '../ui/Card'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART_TOOLTIP_STYLE } from '../../lib/utils'

const DEFAULT_SKILLS = {
  JavaScript: 0, 'Node.js': 0, NestJS: 0,
  OpenTelemetry: 0, Honeycomb: 0, Splunk: 0,
  MongoDB: 0, Redis: 0,
}

export default function RadarCard({ person }) {
  const scores = person?.skills?.scores || DEFAULT_SKILLS

  const data = Object.entries(scores).map(([subject, value]) => ({
    subject,
    value,
    fullMark: 10,
  }))

  const hasData = Object.values(scores).some(v => v > 0)

  return (
    <Card className="flex flex-col h-full">
      <h2 className="section-title mb-1">Skills</h2>
      <p className="text-xs text-slate-400 mb-4">Radar de competências por tecnologia</p>

      {!hasData && (
        <p className="text-xs text-slate-400 text-center py-4">
          Nenhuma avaliação registrada ainda
        </p>
      )}

      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#393973" strokeOpacity={0.4} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#8CB3D9', fontSize: 11, fontFamily: 'DM Sans' }}
            />
            <Radar
              dataKey="value"
              stroke="#FA5A50"
              fill="#FA5A50"
              fillOpacity={0.35}
              strokeWidth={2}
            />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={v => [`${v}/10`, 'Score']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
