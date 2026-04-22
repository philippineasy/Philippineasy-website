import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faCloudSun,
  faCloud,
  faBolt,
  faCloudShowersHeavy,
  faQuestionCircle,
  faPlane,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// 4 villes phares (handoff). On garde les coords pour la précision API.
const featuredCities = [
  { displayName: 'Manille', lat: 14.5995, lon: 120.9842 },
  { displayName: 'Cebu', lat: 10.3157, lon: 123.8918 },
  { displayName: 'Palawan', lat: 9.7386, lon: 118.7328 },   // Puerto Princesa
  { displayName: 'Siargao', lat: 9.7875, lon: 126.1586 },
];

interface WeatherData {
  city: string;
  temp: number;
  icon: IconDefinition;
  colorClass: string;
}

function getIconAndColorForCondition(condition: string): {
  icon: IconDefinition;
  colorClass: string;
} {
  const c = condition.toLowerCase();
  if (c.includes('sunny') || c.includes('clear')) return { icon: faSun, colorClass: 'text-accent' };
  if (c.includes('partly cloudy')) return { icon: faCloudSun, colorClass: 'text-yellow-200' };
  if (c.includes('cloudy') || c.includes('overcast')) return { icon: faCloud, colorClass: 'text-slate-300' };
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return { icon: faCloudShowersHeavy, colorClass: 'text-cyan-300' };
  if (c.includes('thunder')) return { icon: faBolt, colorClass: 'text-yellow-300' };
  return { icon: faQuestionCircle, colorClass: 'text-slate-400' };
}

async function getWeatherData(): Promise<WeatherData[]> {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    console.warn('WeatherTicker: WEATHER_API_KEY manquante — ticker masqué.');
    return [];
  }

  const results = await Promise.allSettled(
    featuredCities.map(async (city) => {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city.lat},${city.lon}&aqi=no`,
        { next: { revalidate: 600 } }
      );
      if (!res.ok) throw new Error(`API ${city.displayName}: ${res.status}`);
      const data = await res.json();
      const { icon, colorClass } = getIconAndColorForCondition(data.current.condition.text);
      return {
        city: city.displayName,
        temp: Math.round(data.current.temp_c),
        icon,
        colorClass,
      };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<WeatherData> => r.status === 'fulfilled')
    .map((r) => r.value);
}

async function getEurPhpRate(): Promise<number | null> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=PHP', {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.rates?.PHP;
    return typeof rate === 'number' ? rate : null;
  } catch {
    return null;
  }
}

export default async function WeatherTicker() {
  const [weatherData, fxRate] = await Promise.all([getWeatherData(), getEurPhpRate()]);

  if (!weatherData || weatherData.length === 0) return null;

  return (
    <div className="w-full bg-ink text-white text-[13px]" role="status" aria-live="polite">
      <div className="container mx-auto px-4 py-2 flex items-center gap-x-5 gap-y-1 overflow-x-auto whitespace-nowrap md:flex-wrap md:overflow-visible md:whitespace-normal md:justify-center hide-scroll">
        <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-wider">
          <span
            className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot motion-reduce:animate-none"
            aria-hidden="true"
          />
          En direct
        </span>
        {weatherData.map((w) => (
          <span key={w.city} className="inline-flex items-center gap-1.5 text-white/85">
            <span className="font-medium">{w.city}</span>
            <FontAwesomeIcon
              icon={w.icon}
              className={`text-[11px] ${w.colorClass}`}
              aria-hidden="true"
            />
            <span className="tabular-nums">{w.temp}°C</span>
          </span>
        ))}
        {fxRate !== null && (
          <span className="inline-flex items-center gap-1.5 text-white/85">
            <span className="font-medium">1€</span>
            <span className="tabular-nums">= {fxRate.toFixed(2)} ₱</span>
          </span>
        )}
        {/* TODO: brancher sur API tarifs (Skyscanner / Kiwi) — hardcodé MVP */}
        <span className="inline-flex items-center gap-1.5 text-white/85">
          <FontAwesomeIcon icon={faPlane} className="text-[11px] text-accent" aria-hidden="true" />
          <span className="font-medium">Paris → Manille</span>
          <span className="text-white/65">dès 682 €</span>
        </span>
      </div>
    </div>
  );
}
