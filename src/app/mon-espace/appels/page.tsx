'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, CalendarDays, Video, Phone } from 'lucide-react';
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + breadcrumb */}
      <div className="space-y-4">
        <nav aria-label="Fil d'ariane" className="text-[12px] uppercase tracking-[0.12em]">
          <ol className="m-0 flex list-none items-center gap-2 p-0">
            <li>
              <Link
                href="/mon-espace"
                className="rounded font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Mon espace
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-foreground/50">/</li>
            <li>
              <span aria-current="page" className="font-semibold text-foreground">Appels</span>
            </li>
          </ol>
        </nav>

        <div>
          <h1 className="text-[clamp(1.625rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
            Mes <span className="text-accent-strong">appels</span>
          </h1>
          <p className="mt-2 max-w-[62ch] text-[14.5px] text-muted-foreground">
            Vos consultations planifiées avec notre équipe. Choisissez un créneau ou rejoignez votre prochain appel.
          </p>
        </div>
      </div>

      {calls.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card shadow-card-rest p-8 text-center lg:p-12">
          <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
            <Phone className="h-6 w-6" />
          </span>
          <h2 className="text-[18px] font-bold text-ink">Aucun appel prévu</h2>
          <p className="mx-auto mt-1 max-w-[42ch] text-[13.5px] leading-snug text-muted-foreground">
            Les appels inclus dans vos packs d&apos;accompagnement apparaîtront ici une fois disponibles.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {calls.map((call) => (
            <div key={call.id} className="rounded-2xl border border-border/60 bg-card shadow-card-rest p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
                      <Video className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[14px] font-semibold text-ink">
                      Appel {call.call_number}/{call.total_calls}
                    </span>
                    <StatusBadge status={call.status} />
                  </div>

                  {call.scheduled_at ? (
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="capitalize">
                        {new Date(call.scheduled_at).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[13px] font-medium text-accent-strong">
                      Pas encore planifié — choisissez un créneau ci-dessous
                    </p>
                  )}

                  {call.call_summary && (
                    <p className="mt-2 rounded-lg bg-muted/60 p-2 text-[12px] italic text-muted-foreground">
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
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <Video className="h-3.5 w-3.5" aria-hidden="true" />
                      Rejoindre
                    </a>
                  )}
                  {!call.scheduled_at && call.status === 'scheduled' && (
                    <button
                      onClick={() => setBookingCallId(bookingCallId === call.id ? null : call.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      Choisir un créneau
                    </button>
                  )}
                </div>
              </div>

              {bookingCallId === call.id && (
                <div className="mt-4 border-t border-border/60 pt-4">
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
