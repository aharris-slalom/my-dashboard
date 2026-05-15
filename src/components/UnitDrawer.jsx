import { AnimatePresence, motion } from 'framer-motion';

export default function UnitDrawer({ unit, open, onClose }) {
  return (
    <AnimatePresence>
      {open && unit ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Unit Details</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{unit.unitName}</h2>
                <p className="mt-2 text-sm text-slate-400">{unit.location}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-slate-200 transition hover:bg-white/10"
              >
                ×
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">24-hour History</p>
                <div className="mt-4 flex h-56 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/70 text-sm text-slate-500">
                  Chart placeholder coming soon
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Current Metrics</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Temp</p>
                    <p className="mt-2 text-xl font-semibold text-white">{unit.currentTemp.toFixed(1)}°C</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Humidity</p>
                    <p className="mt-2 text-xl font-semibold text-white">{unit.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Battery</p>
                    <p className="mt-2 text-xl font-semibold text-white">{unit.sensorHealth.battery}%</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-3xl bg-brand-coral px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-coral/20 transition hover:bg-[#f86b8f]"
              >
                Initiate Emergency Transfer
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
