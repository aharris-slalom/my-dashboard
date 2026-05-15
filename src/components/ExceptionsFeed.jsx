import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext.jsx';
import Card from './Card.jsx';
import UnitCard from './UnitCard.jsx';
import UnitDrawer from './UnitDrawer.jsx';

const PRIORITY = { Critical: 0, Warning: 1, Optimal: 2 };

export default function ExceptionsFeed() {
  const { departments } = useDashboard();
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const exceptions = departments
    .flatMap((department) => department.units.map((unit) => ({ ...unit, department: department.name })))
    .filter((unit) => unit.status === 'Warning' || unit.status === 'Critical')
    .sort((a, b) => PRIORITY[a.status] - PRIORITY[b.status]);

  const handleDetails = (unit) => {
    setSelectedUnit(unit);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedUnit(null), 300);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Exceptions Feed</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Active Warnings & Critical Units</h2>
          </div>
          <p className="rounded-3xl bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
            Showing {exceptions.length} units requiring escalation
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <AnimatePresence>
            {exceptions.length > 0 ? (
              exceptions.map((unit) => (
                <motion.div key={unit.id} layout>
                  <UnitCard unit={unit} onDetails={handleDetails} showHistory={false} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-8 text-center text-slate-400">
                  No active warnings or critical units. All systems are stable.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Feed Priority</p>
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-4">
              <span className="inline-flex h-3.5 w-3.5 rounded-full bg-brand-coral" />
              <p className="text-sm text-white">Critical units are escalated first</p>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-4">
              <span className="inline-flex h-3.5 w-3.5 rounded-full bg-amber-300" />
              <p className="text-sm text-white">Warning units are monitored until resolved</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Unit Status</p>
          <div className="mt-5 space-y-4">
            {exceptions.slice(0, 3).map((unit) => (
              <div key={unit.id} className="rounded-3xl bg-slate-900/70 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">{unit.unitName}</p>
                <p>{unit.status} • {unit.department}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <UnitDrawer unit={selectedUnit} open={drawerOpen} onClose={handleClose} />
    </div>
  );
}
