import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext.jsx';

const getStatusStyles = (theme) => ({
  Optimal: {
    label: 'Optimal',
    color: 'text-brand-emerald',
    ring: 'bg-brand-emerald/15',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.22)]',
  },
  Warning: {
    label: 'Warning',
    color: 'text-amber-300',
    ring: 'bg-amber-300/15',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.22)]',
  },
  Critical: {
    label: 'Critical',
    color: 'text-brand-coral',
    ring: 'bg-brand-coral/20',
    glow: theme === 'light' ? 'shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'shadow-[0_0_20px_rgba(251,113,133,0.24)]',
  },
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function UnitCard({ unit, onDetails, showHistory = true }) {
  const { isAuditMode, theme } = useDashboard();
  const statusStyles = getStatusStyles(theme);
  const status = statusStyles[unit.status] || statusStyles.Warning;
  const progress = unit.status === 'Critical' ? 1 - clamp((unit.timeOutOfRangeSeconds - 10) / 20, 0, 1) : 1;
  const progressLabel = unit.status === 'Critical' ? `${Math.round(progress * 100)}%` : 'Stable';
  const history = unit.history || [];
  const minHistory = history.length ? Math.min(...history) : 0;
  const maxHistory = history.length ? Math.max(...history) : 1;
  const range = maxHistory - minHistory || 1;
  const sparklinePoints = history
    .map((value, index) => {
      const x = history.length === 1 ? 50 : (index / (history.length - 1)) * 100;
      const y = 100 - ((value - minHistory) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className={`rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl ${status.glow} ${theme === 'light' && isAuditMode ? 'shadow-none' : 'shadow-glow'}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex h-4 w-4 rounded-full ${status.ring} items-center justify-center`}>
            <span className={`h-2.5 w-2.5 rounded-full ${status.color} bg-current`} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{unit.unitName}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{unit.assetType}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuditMode && unit.last_audit_passed && (
            <Check className="h-4 w-4 text-[#059669]" />
          )}
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${status.color} ${status.ring}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{isAuditMode ? 'Stability' : 'Temp'}</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {isAuditMode ? '100%' : `${unit.currentTemp.toFixed(1)}°C`}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{isAuditMode ? 'Status' : 'Humidity'}</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {isAuditMode ? 'Verified' : `${unit.humidity}%`}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Battery</p>
          <p className="mt-2 text-3xl font-semibold text-white">{unit.sensorHealth.battery}%</p>
        </div>
      </div>

      {showHistory && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Temperature history</span>
            <span>{history.length} readings</span>
          </div>
          <div className="rounded-2xl bg-slate-950/70 p-3">
            <svg viewBox="0 0 100 100" className="h-20 w-full">
              <defs>
                <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="url(#sparklineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints}
              />
            </svg>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Time to Spoilage</span>
          <span>{progressLabel}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-coral via-orange-400 to-amber-300 transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDetails(unit)}
        className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
      >
        Details
      </button>
    </motion.article>
  );
}
