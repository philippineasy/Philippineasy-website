'use client';

import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import StatusBadge from '@/components/crm/StatusBadge';

interface WeeklyCalendarProps {
  slots: any[];
  calls: any[];
  onDeleteSlot: (slotId: string) => void;
}

export default function WeeklyCalendar({ slots, calls, onDeleteSlot }: WeeklyCalendarProps) {
  const weekDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const getItemsForDay = (day: Date) => {
    const dayStr = day.toISOString().split('T')[0];

    const daySlots = slots.filter((s) => s.starts_at?.startsWith(dayStr));
    const dayCalls = calls.filter((c) => c.scheduled_at?.startsWith(dayStr));

    return { slots: daySlots, calls: dayCalls };
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day) => {
        const items = getItemsForDay(day);
        const isToday = day.toDateString() === new Date().toDateString();

        return (
          <div
            key={day.toISOString()}
            className={`bg-card border rounded-lg p-3 min-h-[120px] ${
              isToday ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <div className="text-center mb-2">
              <p className="text-xs text-muted-foreground">
                {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
              </p>
              <p className={`text-lg font-bold ${isToday ? 'text-primary' : ''}`}>
                {day.getDate()}
              </p>
            </div>

            <div className="space-y-1.5">
              {items.slots.map((slot: any) => (
                <div
                  key={slot.id}
                  className="group bg-emerald-500/10 text-emerald-600 rounded px-2 py-1 text-xs flex items-center justify-between"
                >
                  <span>
                    {new Date(slot.starts_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => onDeleteSlot(slot.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                  </button>
                </div>
              ))}

              {items.calls.map((call: any) => (
                <div
                  key={call.id}
                  className="bg-blue-500/10 text-blue-600 rounded px-2 py-1 text-xs"
                >
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faUser} className="text-[10px]" />
                    <span className="truncate">{call.profiles?.username || '?'}</span>
                  </div>
                  <span>
                    {new Date(call.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
