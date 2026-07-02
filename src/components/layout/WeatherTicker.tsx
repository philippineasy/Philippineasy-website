import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { LiveManilaTime } from './LiveManilaTime';

// 4 villes phares (handoff). On garde les coords pour la précision API.
const featuredCities = [
  { displayName: 'Manille', lat: 14.5995, lon: 120.9842, metaKind: 'feels' as const },
  { displayName: 'Cebu', lat: 10.3157, lon: 123.8918, metaKind: 'humidity' as const },
  { displayName: 'Palawan', lat: 9.7386, lon: 118.7328, metaKind: 'feels' as const },
  { displayName: 'Siargao', lat: 9.7875, lon: 126.1586, metaKind: 'feels' as const },
];

interface WeatherData {
  city: string;
  temp: number;
  emoji: string;
  meta: string;
}

function getEmojiForCondition(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes('sunny') || c.includes('clear')) return '☀';
  if (c.includes('partly cloudy')) return '⛅';
  if (c.includes('cloudy') || c.includes('overcast')) return '☁';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return '🌧';
  if (c.includes('thunder')) return '⚡';
  return '🌤';
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
      const cur = data.current;
      const meta =
        city.metaKind === 'humidity'
          ? `humid. ${cur.humidity}%`
          : `ressenti ${Math.round(cur.feelslike_c)}°`;
      return {
        city: city.displayName,
        temp: Math.round(cur.temp_c),
        emoji: getEmojiForCondition(cur.condition.text),
        meta,
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
    <div
      className="bg-night text-white/80 text-[12px] border-t border-white/5"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-stretch justify-center flex-wrap">
        {/* Live badge */}
        <span className="inline-flex items-center gap-2 px-4 py-[9px] bg-red-500/10 uppercase tracking-wider text-[11px] font-medium text-white/85 border-r border-white/10 whitespace-nowrap">
          <span
            className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot motion-reduce:animate-none"
            style={{ boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)' }}
            aria-hidden="true"
          />
          En direct · Manille <LiveManilaTime />
        </span>

        {/* Cities */}
        {weatherData.map((w) => (
          <span
            key={w.city}
            className="inline-flex items-center gap-1.5 px-4 py-[9px] border-r border-white/10 whitespace-nowrap"
          >
            <span className="text-[13px] saturate-110" aria-hidden="true">
              {w.emoji}
            </span>
            <b className="text-white font-semibold tracking-tight">{w.city}</b>
            <span className="tabular-nums">{w.temp}°</span>
            <span className="text-white/75 text-[11px] font-normal hidden md:inline">
              {w.meta}
            </span>
          </span>
        ))}

        {/* FX */}
        {fxRate !== null && (
          <span className="inline-flex items-center gap-1.5 px-4 py-[9px] border-r border-white/10 whitespace-nowrap">
            <span>1 €</span>
            <b className="text-warm-yellow font-semibold tabular-nums">
              = {fxRate.toFixed(2)} ₱
            </b>
          </span>
        )}

        {/* Flight (TODO: brancher API tarifs en suivi) */}
        <span className="inline-flex items-center gap-1.5 px-4 py-[9px] whitespace-nowrap">
          <FontAwesomeIcon
            icon={faPlane}
            className="text-[12px] text-accent"
            aria-hidden="true"
          />
          <span>Paris → MNL</span>
          <b className="text-blue-300 font-semibold">dès 682 €</b>
        </span>
      </div>
    </div>
  );
}
