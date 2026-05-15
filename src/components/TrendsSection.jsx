import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../context/DashboardContext.jsx';
import Card from './Card.jsx';

// Generate mock trend data for last 24 hours
const generateTrendData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    // Simulate temperature variance from median (around 0, with some fluctuations)
    const variance = (Math.sin(hour / 4) * 0.5) + (Math.random() - 0.5) * 0.3;
    data.push({
      time: `${hour}:00`,
      variance: Number(variance.toFixed(2)),
    });
  }
  return data;
};

export default function TrendsSection() {
  const { isAuditMode, theme } = useDashboard();
  const trendData = generateTrendData();

  if (isAuditMode) {
    return (
      <Card>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Compliance Trends</p>
        <p className="mt-4 text-xl font-semibold text-white">Historical Stability Analysis</p>
        <p className="mt-2 text-sm text-slate-300">Audit mode displays resolved compliance events only.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Thermal Stability Trend</p>
          <p className="mt-2 text-sm text-slate-300">Temperature variance from median over last 24 hours</p>
        </div>
        <div className="rounded-full bg-brand-blue/15 px-3 py-1 text-xs font-semibold text-brand-blue">
          AI Insight
        </div>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e2e8f0' : '#334155'} />
            <XAxis
              dataKey="time"
              stroke={theme === 'light' ? '#64748b' : '#94a3b8'}
              fontSize={12}
              tick={{ fill: theme === 'light' ? '#64748b' : '#94a3b8' }}
            />
            <YAxis
              stroke={theme === 'light' ? '#64748b' : '#94a3b8'}
              fontSize={12}
              tick={{ fill: theme === 'light' ? '#64748b' : '#94a3b8' }}
              label={{ value: 'Variance (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: theme === 'light' ? '#64748b' : '#94a3b8' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'light' ? '#ffffff' : '#0f172a',
                border: theme === 'light' ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: theme === 'light' ? '#0f172a' : '#f8fafc',
              }}
              labelStyle={{ color: theme === 'light' ? '#0f172a' : '#f8fafc' }}
            />
            <Line
              type="monotone"
              dataKey="variance"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 rounded-3xl bg-slate-900/70 p-4">
        <p className="text-sm font-semibold text-white">Predictive Analysis</p>
        <p className="mt-1 text-sm text-slate-300">
          Unit P-12 shows 4% efficiency drop over 7 days. Recommend preventative maintenance.
        </p>
      </div>
    </Card>
  );
}