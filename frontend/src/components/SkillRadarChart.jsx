import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const LABELS = ['Coding', 'Projects', 'Networking', 'Communication', 'Knowledge'];

export default function SkillRadarChart({ skills = [80, 75, 60, 90, 85] }) {
  const data = LABELS.map((label, i) => ({
    skill: label,
    value: skills[i] || 0,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="80%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: 'transparent' }}
          axisLine={false}
        />
        <Radar
          name="Skills"
          dataKey="value"
          stroke="#6366F1"
          fill="url(#radarGrad)"
          fillOpacity={0.5}
          strokeWidth={2}
        />
        <defs>
          <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
      </RadarChart>
    </ResponsiveContainer>
  );
}
