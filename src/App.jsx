import { useEffect, useState } from 'react';
import { Home, Activity, ShieldCheck, BarChart3, ClipboardList, MapPin, Moon, Sun } from 'lucide-react';
import { DashboardProvider, useDashboard } from './context/DashboardContext.jsx';
import VitalsHeader from './components/VitalsHeader.jsx';
import VitalsPage from './components/VitalsPage.jsx';
import Card from './components/Card.jsx';
import ExceptionsFeed from './components/ExceptionsFeed.jsx';
import LogisticsMap from './components/LogisticsMap.jsx';
import TrendsSection from './components/TrendsSection.jsx';
import ReportsSection from './components/ReportsSection.jsx';

function Shell() {
  const { isAuditMode, setIsAuditMode, theme, setTheme } = useDashboard();
  const [currentView, setCurrentView] = useState('dashboard');

  const navItems = [
    { label: 'Dashboard', icon: Home, view: 'dashboard' },
    { label: 'Vitals', icon: Activity, view: 'vitals' },
    { label: 'Trends', icon: BarChart3, view: 'trends' },
    { label: 'Reports', icon: ClipboardList, view: 'reports' },
    { label: 'Logistics', icon: MapPin, view: 'logistics' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-20 flex-col justify-between border-r border-card bg-slate-950/95 p-4 shadow-glow backdrop-blur-xl lg:w-72">
        <div className="space-y-8">
          <div className="flex items-center justify-center rounded-3xl bg-white/5 px-3 py-4 text-sm font-semibold tracking-[0.2em] text-slate-200 shadow-inner shadow-white/5 lg:justify-start lg:px-6">
            <span className="hidden lg:inline">Project Pulse</span>
            <span className="lg:hidden">PP</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isClickable = item.view === 'dashboard' || item.view === 'vitals' || item.view === 'logistics' || item.view === 'trends' || item.view === 'reports';
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={isClickable ? () => setCurrentView(item.view) : undefined}
                  disabled={!isClickable}
                  className={`group flex w-full items-center gap-3 rounded-3xl px-3 py-3 text-sm transition lg:px-5 ${
                    currentView === item.view
                      ? 'bg-white/15 text-white'
                      : isClickable
                      ? 'text-slate-200 hover:bg-white/10 hover:text-white cursor-pointer'
                      : 'text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className="mt-3 flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 lg:px-5"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5 text-slate-600" />}
            <span className="hidden lg:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setIsAuditMode((prev) => !prev)}
            className="flex w-full items-center justify-center gap-2 rounded-3xl bg-brand-blue/15 px-4 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/25 lg:justify-start lg:px-5"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden lg:inline">{isAuditMode ? 'Exit Audit' : 'Audit Mode'}</span>
          </button>
          <div className="hidden lg:block rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-100">Audit mode</p>
            <p className="mt-2 text-slate-400">Toggle between live exposure metrics and compliance integrity.</p>
          </div>
        </div>
      </aside>

      <main className="ml-20 min-h-screen px-4 py-6 sm:px-6 lg:ml-72 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {currentView === 'dashboard' ? (
            <>
              <VitalsHeader />
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="xl:col-span-2">
                  <ExceptionsFeed />
                </div>
              </div>
            </>
          ) : currentView === 'vitals' ? (
            <VitalsPage />
          ) : currentView === 'trends' ? (
            <TrendsSection />
          ) : currentView === 'reports' ? (
            <ReportsSection />
          ) : (
            <LogisticsMap />
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <Shell />
    </DashboardProvider>
  );
}
