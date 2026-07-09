'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAT_CATEGORIES, type ChatCategory, type ChatMessage } from '@/lib/chat/types';

const LIST_POLL_MS = 10_000;
const THREAD_POLL_MS = 5_000;

interface ConversationRow {
  id: string;
  category: ChatCategory;
  visitor_name: string | null;
  visitor_email: string | null;
  user_id: string | null;
  status: 'open' | 'closed';
  admin_unread_count: number;
  last_message_at: string;
  last_message_preview: string | null;
  created_at: string;
}

type StatusFilter = 'open' | 'closed' | 'all';

function visitorLabel(c: ConversationRow): string {
  return c.visitor_name || c.visitor_email || 'Visiteur anonyme';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  return d.toDateString() === today.toDateString()
    ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function ChatInboxClient() {
  const [filter, setFilter] = useState<StatusFilter>('open');
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/chat/conversations?status=${filter}`);
      if (!res.ok) return;
      const json = await res.json();
      setConversations(json.conversations ?? []);
    } finally {
      setLoadingList(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoadingList(true);
    fetchList();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') fetchList();
    }, LIST_POLL_MS);
    return () => clearInterval(interval);
  }, [fetchList]);

  // Thread : chargement + polling
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;

    const loadFull = async () => {
      const res = await fetch(`/api/admin/chat/messages?conversationId=${selectedId}`);
      if (!res.ok || cancelled) return;
      const json = await res.json();
      setMessages(json.messages ?? []);
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, admin_unread_count: 0 } : c))
      );
    };
    setMessages([]);
    loadFull();

    const interval = setInterval(async () => {
      if (document.visibilityState !== 'visible') return;
      const last = messagesRef.current[messagesRef.current.length - 1];
      const params = new URLSearchParams({ conversationId: selectedId });
      if (last) params.set('after', last.created_at);
      const res = await fetch(`/api/admin/chat/messages?${params}`);
      if (!res.ok || cancelled) return;
      const json = await res.json();
      const incoming: ChatMessage[] = json.messages ?? [];
      if (incoming.length) {
        setMessages((prev) => {
          const known = new Set(prev.map((m) => m.id));
          return [...prev, ...incoming.filter((m) => !known.has(m.id))];
        });
      }
    }, THREAD_POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const sendReply = async () => {
    const content = reply.trim();
    if (!content || !selectedId || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/admin/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedId, content }),
      });
      const json = await res.json();
      if (res.ok && json.message) {
        setMessages((prev) => [...prev, json.message]);
        setReply('');
        fetchList();
      }
    } finally {
      setSending(false);
    }
  };

  const toggleStatus = async () => {
    if (!selected) return;
    const status = selected.status === 'open' ? 'closed' : 'open';
    await fetch('/api/admin/chat/conversations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: selected.id, status }),
    });
    fetchList();
  };

  return (
    <div className="flex h-[calc(100dvh-180px)] min-h-[480px] gap-4">
      {/* Liste */}
      <div className={`flex w-full flex-col rounded-xl border border-border bg-card sm:w-80 sm:shrink-0 ${selectedId ? 'max-sm:hidden' : ''}`}>
        <div className="flex gap-1 border-b border-border p-2">
          {(['open', 'closed', 'all'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {f === 'open' ? 'Ouvertes' : f === 'closed' ? 'Clôturées' : 'Toutes'}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingList && <p className="p-4 text-sm text-muted-foreground">Chargement…</p>}
          {!loadingList && conversations.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">Aucune conversation.</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`w-full border-b border-border px-3.5 py-3 text-left transition-colors hover:bg-muted/50 ${
                selectedId === c.id ? 'bg-primary/5' : ''
              }`}
            >
              <div className="mb-0.5 flex items-center gap-2">
                <span className="text-sm" aria-hidden="true">{CHAT_CATEGORIES[c.category]?.emoji}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {visitorLabel(c)}
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{formatDate(c.last_message_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                  {c.last_message_preview || CHAT_CATEGORIES[c.category]?.label}
                </p>
                {c.admin_unread_count > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {c.admin_unread_count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className={`flex min-w-0 flex-1 flex-col rounded-xl border border-border bg-card ${!selectedId ? 'max-sm:hidden' : ''}`}>
        {!selected ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Sélectionne une conversation
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted sm:hidden"
                aria-label="Retour à la liste"
              >
                ←
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {CHAT_CATEGORIES[selected.category]?.emoji} {visitorLabel(selected)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {CHAT_CATEGORIES[selected.category]?.label}
                  {selected.visitor_email ? ` · ${selected.visitor_email}` : ''}
                  {selected.user_id ? ' · compte site ✓' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleStatus}
                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                {selected.status === 'open' ? 'Clôturer' : 'Rouvrir'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={`mb-3 flex ${m.sender === 'visitor' ? 'justify-start' : 'justify-end'}`}>
                  <div className="max-w-[75%]">
                    <p className={`mb-0.5 px-1 text-[11px] text-muted-foreground ${m.sender === 'visitor' ? '' : 'text-right'}`}>
                      {m.sender === 'visitor' ? visitorLabel(selected) : m.sender === 'ai' ? 'IA' : 'Toi'}
                      {' · '}
                      {formatDate(m.created_at)}
                    </p>
                    <div
                      className={`whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                        m.sender === 'visitor'
                          ? 'rounded-bl-md bg-muted text-foreground'
                          : m.sender === 'ai'
                            ? 'rounded-br-md border border-border bg-background text-muted-foreground'
                            : 'rounded-br-md bg-primary text-primary-foreground'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  rows={2}
                  maxLength={4000}
                  placeholder="Ta réponse (apparaît instantanément chez le visiteur)…"
                  className="max-h-32 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={sendReply}
                  disabled={!reply.trim() || sending}
                  className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40"
                >
                  {sending ? '…' : 'Envoyer'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
