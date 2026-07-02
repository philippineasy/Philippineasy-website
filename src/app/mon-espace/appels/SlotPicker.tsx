'use client';

import { useState, useEffect } from 'react';
import { Loader2, Check, Calendar, Clock } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { getAvailableSlots, bookSlot } from '@/services/callService';
import type { CallSlot } from '@/types/services';

interface SlotPickerProps {
  bookingId: string;
  onBooked: () => void;
}

const WEEKDAY_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function formatDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDayLabel(d: Date): { weekday: string; day: number; month: string } {
  return {
    weekday: WEEKDAY_SHORT[d.getDay()],
    day: d.getDate(),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }),
  };
}

export default function SlotPicker({ bookingId, onBooked }: SlotPickerProps) {
  const [slots, setSlots] = useState<CallSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      const from = new Date().toISOString();
      const { data } = await getAvailableSlots(supabase, from);
      const list = data || [];
      setSlots(list);
      // Pre-select first day with slots
      if (list.length > 0) {
        setActiveDay(formatDayKey(new Date(list[0].starts_at)));
      }
      setLoading(false);
    };
    fetchSlots();
  }, []);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    const { error } = await bookSlot(supabase, bookingId, selectedSlot);
    setBooking(false);
    if (!error) onBooked();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Chargement des créneaux…
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-5 py-6 text-center">
        <Calendar className="w-6 h-6 mx-auto text-muted-foreground/60 mb-2" aria-hidden="true" />
        <p className="text-[13.5px] text-muted-foreground">
          Aucun créneau disponible pour le moment.<br />
          Notre équipe vous contactera prochainement.
        </p>
      </div>
    );
  }

  // Group slots by day key (ISO date)
  const slotsByDay: Record<string, CallSlot[]> = {};
  slots.forEach((slot) => {
    const k = formatDayKey(new Date(slot.starts_at));
    if (!slotsByDay[k]) slotsByDay[k] = [];
    slotsByDay[k].push(slot);
  });
  const dayKeys = Object.keys(slotsByDay).sort();
  const activeSlots = activeDay && slotsByDay[activeDay] ? slotsByDay[activeDay] : [];
  const selectedSlotDetail = selectedSlot ? slots.find((s) => s.id === selectedSlot) : null;

  return (
    <div className="space-y-4">
      <div>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">
          Choisissez votre créneau
        </span>

        {/* Day picker — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {dayKeys.map((k) => {
            const d = new Date(slotsByDay[k][0].starts_at);
            const label = formatDayLabel(d);
            const isActive = activeDay === k;
            const count = slotsByDay[k].length;
            return (
              <button
                key={k}
                type="button"
                onClick={() => { setActiveDay(k); setSelectedSlot(null); }}
                aria-pressed={isActive}
                className={[
                  'shrink-0 flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2 transition-all w-16',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  isActive
                    ? 'border-accent bg-accent/10 text-accent ring-1 ring-accent'
                    : 'border-border bg-card text-foreground hover:border-accent/40',
                ].join(' ')}
              >
                <span className="text-[10px] uppercase tracking-[0.05em] font-semibold text-muted-foreground">
                  {label.weekday}
                </span>
                <span className="text-[18px] font-bold leading-none tabular-nums">{label.day}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{label.month}</span>
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.05em]">
                  {count} h
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot grid for active day */}
      <div>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2 inline-flex items-center gap-1">
          <Clock className="w-3 h-3" aria-hidden="true" />
          Heures disponibles ({activeSlots.length})
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {activeSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlot(slot.id)}
                aria-pressed={isSelected}
                className={[
                  'rounded-lg border px-3 py-2.5 text-[14px] font-semibold tabular-nums transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  isSelected
                    ? 'border-accent bg-accent text-accent-foreground ring-1 ring-accent shadow-cta'
                    : 'border-border bg-card text-foreground hover:border-accent/40 hover:bg-accent/5',
                ].join(' ')}
              >
                {new Date(slot.starts_at).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm */}
      {selectedSlot && selectedSlotDetail && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[13px]">
              <span className="block text-[11px] uppercase tracking-[0.05em] text-muted-foreground font-semibold">
                Créneau choisi
              </span>
              <strong className="text-ink">
                {new Date(selectedSlotDetail.starts_at).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })} · {new Date(selectedSlotDetail.starts_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </div>
            <button
              type="button"
              onClick={handleBook}
              disabled={booking}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-2 text-[13px] font-semibold shadow-cta hover:bg-accent/90 active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {booking ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Réservation…</>
              ) : (
                <><Check className="w-3.5 h-3.5" /> Confirmer le créneau</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
