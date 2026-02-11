'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSpinner, faPhone, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getAvailableSlots, createSlot, deleteSlot, getUpcomingCalls } from '@/services/callService';
import StatusBadge from '@/components/crm/StatusBadge';
import WeeklyCalendar from './WeeklyCalendar';

export default function AdminCallsPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<any[]>([]);
  const [upcomingCalls, setUpcomingCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('14:00');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [slotsRes, callsRes] = await Promise.all([
      getAvailableSlots(supabase),
      getUpcomingCalls(supabase),
    ]);
    setSlots(slotsRes.data || []);
    setUpcomingCalls(callsRes.data || []);
    setLoading(false);
  };

  const handleCreateSlot = async () => {
    if (!newSlotDate || !user) return;
    setCreating(true);

    const startsAt = new Date(`${newSlotDate}T${newSlotTime}:00`).toISOString();
    const endsAt = new Date(new Date(`${newSlotDate}T${newSlotTime}:00`).getTime() + 30 * 60 * 1000).toISOString();

    await createSlot(supabase, user.id, startsAt, endsAt);
    setNewSlotDate('');
    setCreating(false);
    fetchData();
  };

  const handleDeleteSlot = async (slotId: string) => {
    await deleteSlot(supabase, slotId);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Planning Appels</h1>

      {/* Create slot */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="text-primary" />
          Créer un créneau
        </h2>
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Date</label>
            <input
              type="date"
              value={newSlotDate}
              onChange={(e) => setNewSlotDate(e.target.value)}
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Heure</label>
            <input
              type="time"
              value={newSlotTime}
              onChange={(e) => setNewSlotTime(e.target.value)}
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            onClick={handleCreateSlot}
            disabled={creating || !newSlotDate}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {creating ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : 'Créer'}
          </button>
        </div>
      </div>

      {/* Weekly calendar view */}
      <WeeklyCalendar slots={slots} calls={upcomingCalls} onDeleteSlot={handleDeleteSlot} />

      {/* Upcoming calls table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faPhone} className="text-primary" />
          Appels à venir ({upcomingCalls.length})
        </h2>
        {upcomingCalls.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucun appel planifié</p>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Client</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Call</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {upcomingCalls.map((call: any) => (
                  <tr key={call.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium">{call.profiles?.username || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {call.scheduled_at
                        ? new Date(call.scheduled_at).toLocaleDateString('fr-FR', {
                            weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                          })
                        : 'Non planifié'}
                    </td>
                    <td className="px-6 py-4 text-sm">{call.call_number}/{call.total_calls}</td>
                    <td className="px-6 py-4"><StatusBadge status={call.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
