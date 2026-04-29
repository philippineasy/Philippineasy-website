import Image from 'next/image';
import type { ItineraryDay } from '@/types/destinationItineraries';

interface ItineraryDayCardProps {
  day: ItineraryDay;
}

export function ItineraryDayCard({ day }: ItineraryDayCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-4 flex items-baseline gap-3">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          Jour {day.day}
        </span>
        <h3 className="text-2xl font-bold text-slate-900">{day.title}</h3>
      </header>

      {day.activities.length > 0 && (
        <div className="space-y-4">
          {day.activities.map((activity, idx) => (
            <div key={idx} className="flex gap-4 border-l-4 border-blue-500 pl-4">
              {activity.image && (
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={activity.image}
                    alt={activity.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{activity.name}</h4>
                <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                  {activity.duration && <span>⏱ {activity.duration}</span>}
                  {activity.cost && <span>💶 {activity.cost}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(day.transport || day.accommodation || day.meals) && (
        <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
          {day.transport && (
            <div>
              <dt className="font-semibold text-slate-700">🚗 Transport</dt>
              <dd className="mt-1 text-slate-600">{day.transport}</dd>
            </div>
          )}
          {day.accommodation && (
            <div>
              <dt className="font-semibold text-slate-700">🏨 Hébergement</dt>
              <dd className="mt-1 text-slate-600">{day.accommodation}</dd>
            </div>
          )}
          {day.meals && (
            <div>
              <dt className="font-semibold text-slate-700">🍽 Repas</dt>
              <dd className="mt-1 text-slate-600">{day.meals}</dd>
            </div>
          )}
        </dl>
      )}
    </article>
  );
}
