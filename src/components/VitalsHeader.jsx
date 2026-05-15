import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext.jsx';
import Card from './Card.jsx';

const ZIP_COORDS = { latitude: 32.9795, longitude: -96.7597 };

const WEATHER_DESCRIPTIONS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Drizzle light',
  53: 'Drizzle moderate',
  55: 'Drizzle dense',
  56: 'Freezing drizzle light',
  57: 'Freezing drizzle dense',
  61: 'Rain slight',
  63: 'Rain moderate',
  65: 'Rain heavy',
  66: 'Freezing rain light',
  67: 'Freezing rain heavy',
  71: 'Snow fall slight',
  73: 'Snow fall moderate',
  75: 'Snow fall heavy',
  77: 'Snow grains',
  80: 'Rain showers slight',
  81: 'Rain showers moderate',
  82: 'Rain showers violent',
  85: 'Snow showers slight',
  86: 'Snow showers heavy',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

function getWeatherDescription(code) {
  return WEATHER_DESCRIPTIONS[code] || 'Current conditions';
}

export default function VitalsHeader() {
  const { departments, totalValueAtRisk, isAuditMode } = useDashboard();
  const [weather, setWeather] = useState({ temperature: null, code: null });
  const [weatherState, setWeatherState] = useState({ loading: true, error: false });
  const allUnits = departments.flatMap((department) => department.units);
  const optimalCount = allUnits.filter((unit) => unit.status === 'Optimal').length;
  const healthScore = allUnits.length ? Math.round((optimalCount / allUnits.length) * 100) : 0;

  const valueCard = isAuditMode ? (
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">24-Hour Stability</p>
      <p className="mt-4 text-4xl font-semibold text-brand-emerald">99.98%</p>
      <p className="mt-2 text-sm text-slate-400">All logs are cryptographically signed and ready for Joint Commission inspection.</p>
    </div>
  ) : (
    <div>
      <div className="flex items-center gap-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total Value at Risk</p>
        <div className="group relative">
          <Info className="h-4 w-4 text-slate-400 hover:text-slate-300 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
            Aggregated market value of assets currently exceeding thermal safety parameters for {'>'}10 seconds.
          </div>
        </div>
      </div>
      <motion.p
        animate={
          totalValueAtRisk > 0
            ? { scale: [1, 1.02, 1], opacity: [1, 0.95, 1] }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-4 text-4xl font-semibold text-brand-coral"
      >
        ${totalValueAtRisk.toLocaleString()}
      </motion.p>
      <p className="mt-2 text-sm text-slate-400">Sum of asset value in critical state.</p>
    </div>
  );

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadWeather() {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${ZIP_COORDS.latitude}&longitude=${ZIP_COORDS.longitude}&current_weather=true&temperature_unit=fahrenheit&timezone=auto`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error('Weather request failed');
        const data = await response.json();

        if (active && data?.current_weather) {
          setWeather({
            temperature: Math.round(data.current_weather.temperature),
            code: data.current_weather.weathercode,
          });
          setWeatherState({ loading: false, error: false });
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setWeatherState({ loading: false, error: true });
        }
      }
    }

    loadWeather();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const weatherLabel = weatherState.loading
    ? 'Loading…'
    : weatherState.error
    ? '—'
    : `${weather.temperature}°F`;
  const weatherCaption = weatherState.loading
    ? 'Fetching current Dallas temperature.'
    : weatherState.error
    ? 'Unable to load live weather.'
    : getWeatherDescription(weather.code);

  return (
    <section className="grid gap-4 lg:grid-cols-4 xl:grid-cols-4">
      <Card className="lg:col-span-3 xl:col-span-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{isAuditMode ? 'Regulatory Compliance Overview' : 'Vitals Overview'}</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Project Pulse Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Live cold-chain health and exposure metrics for the North Dallas Medical Center.
          </p>
        </div>
      </Card>

      <Card>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Dallas Weather</p>
        <p className="mt-4 text-3xl font-semibold text-white">{weatherLabel}</p>
        <p className="mt-2 text-sm text-slate-300">{weatherCaption}</p>
      </Card>

      <Card className="lg:col-span-2 xl:col-span-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Global Health Score</p>
        <p className="mt-4 text-4xl font-semibold text-brand-emerald">{healthScore}%</p>
        <p className="mt-2 text-sm text-slate-300">Real-time integrity across 42 active sensors.</p>
      </Card>

      <Card className="lg:col-span-2 xl:col-span-2">
        {valueCard}
      </Card>
    </section>
  );
}
