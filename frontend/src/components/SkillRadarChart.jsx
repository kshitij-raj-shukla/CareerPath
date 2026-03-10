import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LABELS = ['GPA', 'Internships', 'Projects', 'Certifications', 'Soft Skills', 'Networking'];
const MAX_VALUES = [10, 4, 6, 5, 10, 10];

export default function SkillRadarChart({ profile }) {
  const raw = [
    profile.gpa,
    profile.internships,
    profile.projects,
    profile.certifications,
    profile.soft_skills_score,
    profile.networking_score,
  ];

  // Normalise each value to 0-10 scale for a balanced chart
  const normalised = raw.map((v, i) => (v / MAX_VALUES[i]) * 10);

  const data = {
    labels: LABELS,
    datasets: [
      {
        label: 'Your Profile',
        data: normalised,
        backgroundColor: 'rgba(92, 107, 192, 0.25)',
        borderColor: '#5c6bc0',
        borderWidth: 2,
        pointBackgroundColor: '#5c6bc0',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: { stepSize: 2, backdropColor: 'transparent' },
        pointLabels: { font: { size: 12 } },
      },
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: true,
  };

  return (
    <div className="radar-wrapper">
      <Radar data={data} options={options} />
    </div>
  );
}
