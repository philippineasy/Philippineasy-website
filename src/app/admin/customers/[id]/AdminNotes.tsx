'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/utils/supabase/client';
import { getNotes, createNote, toggleNotePin } from '@/services/crmService';

interface AdminNotesProps {
  customerId: string;
  adminId: string;
}

export default function AdminNotes({ customerId, adminId }: AdminNotesProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [customerId]);

  const fetchNotes = async () => {
    setLoading(true);
    const { data } = await getNotes(supabase, customerId);
    setNotes(data || []);
    setLoading(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    await createNote(supabase, customerId, adminId, newNote.trim());
    setNewNote('');
    setSaving(false);
    fetchNotes();
  };

  const handleTogglePin = async (noteId: string, currentPinned: boolean) => {
    await toggleNotePin(supabase, noteId, !currentPinned);
    fetchNotes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add note */}
      <div className="flex gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Ajouter une note interne..."
          rows={2}
          className="flex-1 resize-none bg-card border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleAddNote}
          disabled={saving || !newNote.trim()}
          className="self-end px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {saving ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : (
            <><FontAwesomeIcon icon={faPlus} className="mr-1.5" />Ajouter</>
          )}
        </button>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">Aucune note</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note: any) => (
            <div
              key={note.id}
              className={`bg-card border rounded-lg p-4 ${
                note.is_pinned ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-900/10' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm whitespace-pre-wrap flex-1">{note.content}</p>
                <button
                  onClick={() => handleTogglePin(note.id, note.is_pinned)}
                  className={`flex-shrink-0 p-1 rounded hover:bg-muted transition-colors ${
                    note.is_pinned ? 'text-amber-500' : 'text-muted-foreground'
                  }`}
                  title={note.is_pinned ? 'Désépingler' : 'Épingler'}
                >
                  <FontAwesomeIcon icon={faThumbtack} className="text-xs" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{note.profiles?.username || 'Admin'}</span>
                <span>&middot;</span>
                <span>
                  {new Date(note.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
