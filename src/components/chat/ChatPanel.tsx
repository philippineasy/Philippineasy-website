'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CHAT_CATEGORIES,
  type ChatCategory,
  type ChatMessage,
} from '@/lib/chat/types';
import { CHAT_STORAGE_KEYS, getVisitorKey } from './ChatLauncher';

const POLL_MS = 4000;

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
}

interface ConversationInfo {
  id: string;
  category: ChatCategory;
  status: 'open' | 'closed';
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPanel({ open, onClose }: ChatPanelProps) {
  const [view, setView] = useState<'loading' | 'categories' | 'thread'>('loading');
  const [conversation, setConversation] = useState<ConversationInfo | null>(null);
  const [pendingCategory, setPendingCategory] = useState<ChatCategory | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visitorKeyRef = useRef<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const markSeen = useCallback(() => {
    const last = messagesRef.current[messagesRef.current.length - 1];
    if (last) localStorage.setItem(CHAT_STORAGE_KEYS.lastSeenAt, last.created_at);
  }, []);

  const appendMessages = useCallback((incoming: ChatMessage[]) => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const known = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !known.has(m.id));
      return fresh.length ? [...prev, ...fresh] : prev;
    });
  }, []);

  // -------------------------------------------------------------------------
  // Chargement initial : reprise de la conversation (anonyme via clé locale,
  // ou via le compte si le visiteur est connecté — même depuis un autre appareil).
  // -------------------------------------------------------------------------
  useEffect(() => {
    visitorKeyRef.current = getVisitorKey();
    const stored = localStorage.getItem(CHAT_STORAGE_KEYS.conversationId);

    const load = async () => {
      try {
        const params = new URLSearchParams({ visitorKey: visitorKeyRef.current });
        if (stored) params.set('conversationId', stored);
        const res = await fetch(`/api/chat/messages?${params}`);
        if (res.status === 404) {
          localStorage.removeItem(CHAT_STORAGE_KEYS.conversationId);
          setView('categories');
          return;
        }
        const json = await res.json();
        if (json.conversation) {
          setConversation(json.conversation);
          setMessages(json.messages ?? []);
          localStorage.setItem(CHAT_STORAGE_KEYS.conversationId, json.conversation.id);
          setView('thread');
        } else {
          setView('categories');
        }
      } catch {
        setView('categories');
      }
    };
    load();
  }, []);

  // -------------------------------------------------------------------------
  // Polling léger tant que le panel est ouvert sur un fil (nouvelles réponses).
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!open || view !== 'thread' || !conversation) return;
    const interval = setInterval(async () => {
      if (document.visibilityState !== 'visible') return;
      const last = messagesRef.current[messagesRef.current.length - 1];
      try {
        const params = new URLSearchParams({
          visitorKey: visitorKeyRef.current,
          conversationId: conversation.id,
        });
        if (last) params.set('after', last.created_at);
        const res = await fetch(`/api/chat/messages?${params}`);
        if (!res.ok) return;
        const json = await res.json();
        appendMessages(json.messages ?? []);
        if (json.conversation?.status) {
          setConversation((prev) => (prev ? { ...prev, status: json.conversation.status } : prev));
        }
      } catch {
        // le prochain tick réessaiera
      }
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [open, view, conversation, appendMessages]);

  // Scroll bas + marquage "vu" à chaque nouveau message quand ouvert.
  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    markSeen();
  }, [messages.length, open, markSeen]);

  // Échap pour fermer + focus composer à l'ouverture du fil.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    if (view === 'thread' || pendingCategory) inputRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, view, pendingCategory, onClose]);

  // -------------------------------------------------------------------------
  // Envoi
  // -------------------------------------------------------------------------
  const send = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setError(null);

    const optimistic: ChatMessage = {
      id: `tmp-${Math.random().toString(36).slice(2)}`,
      conversation_id: conversation?.id ?? 'new',
      sender: 'visitor',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    if (!conversation && pendingCategory) setView('thread');

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorKey: visitorKeyRef.current,
          content,
          ...(conversation
            ? { conversationId: conversation.id }
            : { category: pendingCategory, email: email.trim() || undefined }),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur inconnue');

      if (!conversation && pendingCategory) {
        setConversation({ id: json.conversationId, category: pendingCategory, status: 'open' });
        localStorage.setItem(CHAT_STORAGE_KEYS.conversationId, json.conversationId);
        setPendingCategory(null);
      }
      // Remplace le message optimiste par les messages réels (visiteur + réponse auto).
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimistic.id),
        ...(json.messages ?? []),
      ]);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(content);
      setError(err instanceof Error ? err.message : 'Envoi impossible. Réessaie.');
    } finally {
      setSending(false);
    }
  };

  const startNewTopic = () => {
    localStorage.removeItem(CHAT_STORAGE_KEYS.conversationId);
    setConversation(null);
    setMessages([]);
    setPendingCategory(null);
    setView('categories');
  };

  if (!open) return null;

  const showComposer = view === 'thread' || pendingCategory !== null;
  const headerSubtitle =
    view === 'thread' && conversation
      ? `${CHAT_CATEGORIES[conversation.category]?.emoji ?? ''} ${CHAT_CATEGORIES[conversation.category]?.label ?? ''}`
      : pendingCategory
        ? `${CHAT_CATEGORIES[pendingCategory].emoji} ${CHAT_CATEGORIES[pendingCategory].label}`
        : 'Réponse rapide, Hugo est notifié en direct';

  return (
    <div
      role="dialog"
      aria-label="Chat Philippin'Easy"
      className="fixed z-[70] flex flex-col overflow-hidden border border-border bg-background shadow-2xl max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[88dvh] max-sm:rounded-t-2xl sm:bottom-24 sm:right-5 sm:h-[600px] sm:max-h-[calc(100dvh-7rem)] sm:w-[380px] sm:rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
        {(view === 'thread' || pendingCategory) && (
          <button
            type="button"
            onClick={startNewTopic}
            aria-label="Nouveau sujet"
            title="Nouveau sujet"
            className="-ml-1 rounded-full p-1.5 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">Philippin&apos;Easy</p>
          <p className="truncate text-xs text-primary-foreground/80">{headerSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le chat"
          className="rounded-full p-1.5 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Corps */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        {view === 'loading' && (
          <div className="flex h-full items-center justify-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Chargement" />
          </div>
        )}

        {view === 'categories' && !pendingCategory && (
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Salut 👋</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Dis-nous de quoi il s&apos;agit, on s&apos;occupe du reste.
            </p>
            <div className="space-y-2">
              {(Object.entries(CHAT_CATEGORIES) as [ChatCategory, (typeof CHAT_CATEGORIES)[ChatCategory]][]).map(
                ([key, cat]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPendingCategory(key)}
                    className="flex w-full items-start gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="text-lg leading-6" aria-hidden="true">{cat.emoji}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{cat.label}</span>
                      <span className="block text-xs text-muted-foreground">{cat.description}</span>
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {pendingCategory && messages.length === 0 && (
          <div className="rounded-xl bg-muted/60 px-3.5 py-3 text-sm text-muted-foreground">
            {CHAT_CATEGORIES[pendingCategory].ai
              ? 'Pose ta question — réponse immédiate, et Hugo garde un œil sur la conversation.'
              : 'Écris ton message — il part directement chez Hugo (email + Telegram), réponse ici même.'}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`mb-3 flex ${m.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${m.sender === 'visitor' ? 'text-right' : 'text-left'}`}>
              {m.sender !== 'visitor' && (
                <p className="mb-0.5 px-1 text-[11px] font-medium text-muted-foreground">
                  {m.sender === 'admin' ? 'Hugo · Philippin’Easy' : 'Assistant'}
                </p>
              )}
              <div
                className={`inline-block whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-left text-sm leading-relaxed ${
                  m.sender === 'visitor'
                    ? 'rounded-br-md bg-primary text-primary-foreground'
                    : m.sender === 'admin'
                      ? 'rounded-bl-md border border-primary/25 bg-primary/10 text-foreground'
                      : 'rounded-bl-md bg-muted text-foreground'
                }`}
              >
                {m.content}
              </div>
              <p className="mt-0.5 px-1 text-[10px] text-muted-foreground/70">{formatTime(m.created_at)}</p>
            </div>
          </div>
        ))}

        {sending && (
          <div className="mb-3 flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3" aria-label="Réponse en cours">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        {conversation?.status === 'closed' && (
          <div className="mb-3 text-center">
            <p className="mb-2 text-xs text-muted-foreground">Conversation clôturée</p>
            <button
              type="button"
              onClick={startNewTopic}
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Démarrer un nouveau sujet
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      {showComposer && (
        <div className="border-t border-border bg-card px-3 py-3">
          {error && <p className="mb-2 px-1 text-xs text-red-500">{error}</p>}
          {!conversation && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ton email (optionnel) — pour être prévenu de la réponse"
              autoComplete="email"
              className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
            />
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder="Écris ton message…"
              aria-label="Ton message"
              className="max-h-28 min-h-[42px] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={send}
              disabled={!input.trim() || sending}
              aria-label="Envoyer"
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.4 20.4 20.85 12.92a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91Z" />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 px-1 text-[10px] text-muted-foreground/60">
            Tes échanges restent visibles ici, même si tu quittes le site.
          </p>
        </div>
      )}
    </div>
  );
}
