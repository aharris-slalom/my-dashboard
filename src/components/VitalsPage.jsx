import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext.jsx';
import Card from './Card.jsx';

const BRAND_COLORS = ['#10b981', '#3b82f6', '#fb7185'];

function CustomTooltip({ active, payload, label, theme }) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0];
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm shadow-xl ${
      theme === 'light'
        ? 'border-slate-300 bg-white text-slate-900'
        : 'border-white/10 bg-slate-950/95 text-white'
    }`}>
      <p className="font-semibold">{label}</p>
      <p className={`mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>{point.name || point.payload.name}</p>
      <p className={`mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{point.value.toLocaleString()}</p>
    </div>
  );
}

export default function VitalsPage() {
  const { departments, excursionCounter, theme } = useDashboard();

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const point = payload[0];
    return (
      <div className={`rounded-2xl border px-4 py-3 text-sm shadow-xl ${
        theme === 'light'
          ? 'border-slate-300 bg-white text-slate-900'
          : 'border-white/10 bg-slate-950/95 text-white'
      }`}>
        <p className="font-semibold">{label}</p>
        <p className={`mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>{point.name || point.payload.name}</p>
        <p className={`mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{point.value.toLocaleString()}</p>
      </div>
    );
  };

  const analytics = useMemo(() => {
    const departmentTotals = departments.map((department) => {
      const totalValue = department.units.reduce((sum, unit) => sum + unit.assetValue, 0);
      const criticalValue = department.units.reduce((sum, unit) => sum + (unit.status === 'Critical' ? unit.assetValue : 0), 0);
      const criticalUnits = department.units.filter((unit) => unit.status === 'Critical').length;
      return {
        name: department.name,
        totalValue,
        criticalValue,
        criticalUnits,
      };
    });

    const exposureTotal = departmentTotals.reduce((sum, dept) => sum + dept.criticalValue, 0);
    const totalPortfolio = departmentTotals.reduce((sum, dept) => sum + dept.totalValue, 0);
    const totalCriticalUnits = departmentTotals.reduce((sum, dept) => sum + dept.criticalUnits, 0);
    const optimalUnits = departments.reduce(
      (sum, department) => sum + department.units.filter((unit) => unit.status === 'Optimal').length,
      0,
    );
    const totalUnits = departments.reduce((sum, department) => sum + department.units.length, 0);
    const integrityScore = totalUnits ? Math.round((optimalUnits / totalUnits) * 100) : 100;

    const donutData = departmentTotals.map((dept) => ({
      name: dept.name,
      value: dept.totalValue,
      criticalValue: dept.criticalValue,
    }));

    const varianceBins = Array.from({ length: 24 }, (_, index) => ({ hour: `${index}:00`, variance: 0, count: 0 }));

    departments.forEach((department) => {
      department.units.forEach((unit) => {
        const logs = unit.logs || [];
        logs.forEach((log) => {
          const timestamp = new Date(log.timestamp);
          const hour = timestamp.getHours();
          if (!Number.isNaN(hour)) {
            const temp = Number(log.temperature);
            if (!Number.isNaN(temp)) {
              varianceBins[hour].variance += temp;
              varianceBins[hour].count += 1;
            }
          }
        });
      });
    });

    const varianceData = varianceBins.map((bin) => ({
      hour: bin.hour,
      variance: bin.count ? Number((bin.variance / bin.count).toFixed(1)) : 0,
    }));

    return {
      donutData,
      varianceData,
      exposureTotal,
      totalPortfolio,
      totalCriticalUnits,
      integrityScore,
      excursionData: excursionCounter.length
        ? excursionCounter
        : Array.from({ length: 24 }, (_, index) => ({ hour: `${index}:00`, excursions: 0 })),
    };
  }, [departments]);

  const donutTotal = analytics.donutData.reduce((sum, item) => sum + item.value, 0);
  const excursionData = excursionCounter.length
    ? excursionCounter
    : Array.from({ length: 24 }, (_, index) => ({ hour: `${index}:00`, excursions: 0 }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Vitals Analytics</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Advanced Analytics</h1>
            <p className="mt-2 text-sm text-slate-300">
              Live financial exposure and asset monitoring for cold-chain operations.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Integrity Score</p>
              <p className="mt-4 text-4xl font-semibold text-brand-emerald">{analytics.integrityScore}%</p>
              <p className="mt-2 text-sm text-slate-300">Real-time percentage of units currently in optimal condition.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Critical Exposure</p>
              <p className="mt-4 text-4xl font-semibold text-brand-coral">${analytics.exposureTotal.toLocaleString()}</p>
              <p className="mt-2 text-sm text-slate-300">Total asset value currently flagged as critical risk.</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Operational Pulse</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">System Exposure Summary</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Active Critical Units</p>
              <p className="mt-4 text-4xl font-semibold text-white">{analytics.totalCriticalUnits}</p>
              <p className="mt-2 text-sm text-slate-300">Units currently in critical excursion state.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Total Cold-Chain Value</p>
              <p className="mt-4 text-4xl font-semibold text-white">${analytics.totalPortfolio.toLocaleString()}</p>
              <p className="mt-2 text-sm text-slate-300">Portfolio value under active cold-chain monitoring.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2">
        <motion.div
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ stiffness: 100, damping: 20 }}
          className="rounded-2xl bg-slate-900/40 p-5 backdrop-blur-md xl:col-span-3"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Financial Exposure</p>
              <p className="mt-2 text-sm text-slate-300">Live asset-value distribution across departments with risk overlays.</p>
            </div>
            <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
              {analytics.exposureTotal > 0 ? 'Value at Risk' : 'Portfolio Allocation'}
            </span>
          </div>

          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="86%"
                  paddingAngle={3}
                  startAngle={120}
                  endAngle={-240}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={900}
                >
                  {analytics.donutData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {analytics.donutData.map((segment, index) => (
              <div key={segment.name} className="rounded-3xl border border-white/10 bg-slate-950/75 p-3">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{segment.name}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{((segment.value / donutTotal) * 100).toFixed(1)}%</p>
                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-coral-500" style={{ width: `${((segment.value / donutTotal) * 100).toFixed(1)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ stiffness: 100, damping: 20 }}
          className="rounded-2xl bg-slate-900/40 p-5 backdrop-blur-md xl:col-span-3 lg:col-span-2"
        >
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Risk Snapshot</p>
            <p className="mt-2 text-sm text-slate-300">Live department risk share and critical asset concentrations.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {analytics.donutData.map((segment, index) => (
              <div key={segment.name} className="rounded-3xl border border-white/10 bg-slate-950/75 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{segment.name}</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{((segment.value / donutTotal) * 100).toFixed(1)}%</span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">${segment.value.toLocaleString()}</p>
                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-brand-emerald" style={{ width: `${((segment.value / donutTotal) * 100).toFixed(1)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
