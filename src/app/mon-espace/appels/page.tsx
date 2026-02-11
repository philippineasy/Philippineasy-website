'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCalendar, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { getCallsByUser } from '@/services/callService';
import StatusBadge from '@/components/crm/StatusBadge';
import SlotPicker from './SlotPicker';
import type { CallBookingWithSlot } from '@/types/services';

export default function MesAppelsPage() {
  const { user } = useAuth();
  const [calls, setCalls] = useState<CallBookingWithSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingCallId, setBookingCallId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchCalls();
  }, [user]);

  const fetchCalls = async () => {
    setLoading(true);
    const { data } = await getCallsByUser(supabase, user!.id);
    setCalls(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes Appels</h1>

      {calls.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Aucun appel prévu</p>
      ) : (
        <div className="space-y-3">
          {calls.map((call) => (
            <div key={call.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FontAwesomeIcon icon={faVideo} className="text-primary text-sm" />
                    <span className="font-medium text-sm">
                      Call {call.call_number}/{call.total_calls}
                    </span>
                    <StatusBadge status={call.status} />
                  </div>

                  {call.scheduled_at ? (
                    <p className="text-sm text-muted-foreground mt-1">
                      <FontAwesomeIcon icon={faCalendar} className="mr-1.5" />
                      {new Date(call.scheduled_at).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  ) : (
                    <p className="text-sm text-amber-600 mt-1">
                      Pas encore planifié — choisissez un créneau ci-dessous
                    </p>
                  )}

                  {call.call_summary && (
                    <p className="text-xs text-muted-foreground mt-2 italic bg-muted/50 rounded p-2">
                      {call.call_summary}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {call.meeting_url && call.status === 'confirmed' && (
                    <a
                      href={call.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                    >
                      Rejoindre
                    </a>
                  )}
                  {!call.scheduled_at && call.status === 'scheduled' && (
                    <button
                      onClick={() => setBookingCallId(bookingCallId === call.id ? null : call.id)}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20"
                    >
                      Choisir un créneau
                    </button>
                  )}
                </div>
              </div>

              {bookingCallId === call.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <SlotPicker
                    bookingId={call.id}
                    onBooked={() => {
                      setBookingCallId(null);
                      fetchCalls();
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
