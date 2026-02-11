'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/utils/supabase/client';
import { getAvailableSlots, bookSlot } from '@/services/callService';
import type { CallSlot } from '@/types/services';

interface SlotPickerProps {
  bookingId: string;
  onBooked: () => void;
}

export default function SlotPicker({ bookingId, onBooked }: SlotPickerProps) {
  const [slots, setSlots] = useState<CallSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    const from = new Date().toISOString();
    const { data } = await getAvailableSlots(supabase, from);
    setSlots(data || []);
    setLoading(false);
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    const { error } = await bookSlot(supabase, bookingId, selectedSlot);
    setBooking(false);
    if (!error) {
      onBooked();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Aucun créneau disponible pour le moment. Nous vous contacterons prochainement.
      </p>
    );
  }

  // Group slots by day
  const slotsByDay: Record<string, CallSlot[]> = {};
  slots.forEach((slot) => {
    const day = new Date(slot.starts_at).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    if (!slotsByDay[day]) slotsByDay[day] = [];
    slotsByDay[day].push(slot);
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Choisissez un créneau</h4>

      {Object.entries(slotsByDay).map(([day, daySlots]) => (
        <div key={day}>
          <p className="text-xs font-medium text-muted-foreground mb-2 capitalize">{day}</p>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  selectedSlot === slot.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                {new Date(slot.starts_at).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedSlot && (
        <button
          onClick={handleBook}
          disabled={booking}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {booking ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            <><FontAwesomeIcon icon={faCheck} /> Confirmer ce créneau</>
          )}
        </button>
      )}
    </div>
  );
}
