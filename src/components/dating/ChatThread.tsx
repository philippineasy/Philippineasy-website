'use client';

// ---------------------------------------------------------------------------
// ChatThread — LE composant de conversation dating (unifié 2026-07-09).
// Remplace ConversationPanel + ChatClientPage qui divergeaient (réactions et
// typing d'un côté, accusés de lecture de l'autre, bugs realtime des deux).
//
// - Envoi optimiste + erreurs quota/blocage affichées (CTA Premium)
// - Réactions emoji (RPC add/remove_reaction, propagation postgres_changes)
// - « est en train d'écrire… » via broadcast sur LE canal souscrit
// - Accusés ✓ / ✓✓ (is_read, mis à jour en realtime)
// - Traduction FR/EN/Tagalog (hook partagé)
// - Menu ⋯ : Signaler (profil ou message précis) / Bloquer / Supprimer le match
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';
import { Message, Profile } from '@/types';
import {
  Send, Check, CheckCheck, Languages, SmilePlus, Flag, MoreVertical, Ban, UserX,
} from 'lucide-react';
import {
  useMessageTranslation, useDraftTranslation, getLanguageLabel,
} from '@/hooks/useMessageTranslation';
import { blockUserAction, unmatchUserAction, reportUserAction } from '@/app/rencontre-philippines/messages/actions';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
const TYPING_THROTTLE_MS = 1500;
const TYPING_IDLE_STOP_MS = 2500;

type SendErrorType = 'quota' | 'blocked' | 'nomatch' | 'generic';

interface ChatThreadProps {
  currentUserId: string;
  otherUser: Profile;
  /** 'standalone' = page /messages/[id] (hauteur fixe, redirection après bloc/unmatch) */
  variant?: 'embedded' | 'standalone';
  /** Appelé après blocage/unmatch en mode embedded (fermer le panneau + rafraîchir la liste) */
  onConversationEnd?: () => void;
}

interface ReportTarget {
  messageId?: number;
  preview?: string;
}

const ChatThread = ({ currentUserId, otherUser, variant = 'embedded', onConversationEnd }: ChatThreadProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<SendErrorType | null>(null);
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'block' | 'unmatch' | null>(null);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [actionBusy, setActionBusy] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastTypingSentRef = useRef(0);
  const typingStopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    translations, visibleTranslations, loadingMessageId, translationErrors, toggleTranslation,
  } = useMessageTranslation();
  const { translateDraft, translatingTo, draftError } = useDraftTranslation();
  const [showTranslateChips, setShowTranslateChips] = useState(false);

  // -------------------------------------------------------------------------
  // Chargement + marquage lu
  // -------------------------------------------------------------------------
  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase.rpc('get_conversation_messages', {
      other_user_id: otherUser.id,
    });
    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    setMessages((data as Message[]) || []);
  }, [otherUser.id]);

  useEffect(() => {
    fetchMessages().then(() => {
      supabase.rpc('mark_conversation_as_read', { p_other_user_id: otherUser.id });
    });
  }, [fetchMessages, otherUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherIsTyping]);

  // -------------------------------------------------------------------------
  // Realtime : UN canal souscrit — messages entrants, accusés de lecture,
  // réactions (postgres_changes) et typing (broadcast sur ce même canal).
  // -------------------------------------------------------------------------
  useEffect(() => {
    const channelName = `conv-${[currentUserId, otherUser.id].sort().join('-')}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `to_user_id=eq.${currentUserId}` },
        (payload) => {
          const incoming = payload.new as Message;
          if (incoming.from_user_id !== otherUser.id) return;
          setOtherIsTyping(false);
          setMessages((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [...prev, { ...incoming, reactions: [] }]
          );
          supabase.rpc('mark_conversation_as_read', { p_other_user_id: otherUser.id });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `from_user_id=eq.${currentUserId}` },
        (payload) => {
          const updated = payload.new as Message;
          if (updated.to_user_id !== otherUser.id) return;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? { ...m, is_read: updated.is_read } : m))
          );
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'message_reactions' },
        () => {
          // La policy SELECT limite déjà aux réactions de nos conversations ;
          // un refetch simple garde l'état exact (add/remove/update).
          fetchMessages();
        }
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        const isTyping = Boolean(payload.payload?.isTyping);
        setOtherIsTyping(isTyping);
        if (typingHideTimerRef.current) clearTimeout(typingHideTimerRef.current);
        if (isTyping) {
          // Filet de sécurité si l'événement "stop" se perd.
          typingHideTimerRef.current = setTimeout(() => setOtherIsTyping(false), 5000);
        }
      })
      .subscribe();

    return () => {
      channelRef.current = null;
      supabase.removeChannel(channel);
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      if (typingHideTimerRef.current) clearTimeout(typingHideTimerRef.current);
    };
  }, [currentUserId, otherUser.id, fetchMessages]);

  // -------------------------------------------------------------------------
  // Typing indicator (émission throttlée sur le canal SOUSCRIT)
  // -------------------------------------------------------------------------
  const sendTyping = (isTyping: boolean) => {
    channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { isTyping } });
  };

  const handleTyping = () => {
    const now = Date.now();
    if (now - lastTypingSentRef.current > TYPING_THROTTLE_MS) {
      lastTypingSentRef.current = now;
      sendTyping(true);
    }
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    typingStopTimerRef.current = setTimeout(() => sendTyping(false), TYPING_IDLE_STOP_MS);
  };

  // -------------------------------------------------------------------------
  // Envoi (optimiste) + gestion des refus du trigger can_send_message
  // -------------------------------------------------------------------------
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || sending) return;

    setSending(true);
    setSendError(null);
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    sendTyping(false);

    const optimistic: Message = {
      id: -Date.now(),
      from_user_id: currentUserId,
      to_user_id: otherUser.id,
      content,
      created_at: new Date().toISOString(),
      is_read: false,
      reactions: [],
    };
    setMessages((prev) => [...prev, optimistic]);
    setNewMessage('');

    const { data, error } = await supabase
      .from('messages')
      .insert({ from_user_id: currentUserId, to_user_id: otherUser.id, content })
      .select()
      .single();

    if (error || !data) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setNewMessage(content);
      const msg = error?.message || '';
      if (msg.includes('DAILY_LIMIT_REACHED') || msg.includes('Limite de 2 messages')) {
        setSendError('quota');
      } else if (msg.includes('BLOCKED_USER')) {
        setSendError('blocked');
      } else if (msg.includes('Aucun match actif')) {
        setSendError('nomatch');
      } else {
        console.error('Error sending message:', error);
        setSendError('generic');
      }
    } else {
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...(data as Message), reactions: [] } : m))
      );
    }
    setSending(false);
  };

  // -------------------------------------------------------------------------
  // Réactions
  // -------------------------------------------------------------------------
  const handleReaction = async (messageId: number, emoji: string) => {
    if (messageId < 0) return; // message optimiste pas encore confirmé
    const existing = messages
      .find((m) => m.id === messageId)
      ?.reactions?.find((r) => r.user_id === currentUserId);

    if (existing && existing.emoji === emoji) {
      await supabase.rpc('remove_reaction', { p_message_id: messageId });
    } else {
      await supabase.rpc('add_reaction', { p_message_id: messageId, p_emoji: emoji });
    }
    setShowEmojiPicker(null);
    // Le postgres_changes sur message_reactions rafraîchit aussi l'autre côté.
    fetchMessages();
  };

  // -------------------------------------------------------------------------
  // Bloquer / Unmatch / Signaler
  // -------------------------------------------------------------------------
  const endConversation = () => {
    if (variant === 'standalone') {
      router.push('/rencontre-philippines/messages');
      router.refresh();
    } else {
      onConversationEnd?.();
    }
  };

  const handleConfirmedAction = async () => {
    if (!confirmAction) return;
    setActionBusy(true);
    const result =
      confirmAction === 'block'
        ? await blockUserAction(otherUser.id)
        : await unmatchUserAction(otherUser.id);
    setActionBusy(false);
    setConfirmAction(null);
    if (result.error) {
      setActionDone(result.error);
      return;
    }
    endConversation();
  };

  const handleSubmitReport = async () => {
    if (!reportTarget) return;
    setActionBusy(true);
    const result = await reportUserAction(otherUser.id, reportReason, reportTarget.messageId);
    setActionBusy(false);
    if (result.error) {
      setActionDone(result.error);
      return;
    }
    setReportTarget(null);
    setReportReason('');
    setActionDone('Signalement transmis. Merci — notre équipe va examiner ce profil.');
  };

  const handleTranslateDraft = async (target: 'en' | 'tl') => {
    if (!newMessage.trim()) return;
    const translated = await translateDraft(newMessage.trim(), target);
    if (translated) {
      setNewMessage(translated);
      setShowTranslateChips(false);
    }
  };

  const containerClass =
    variant === 'standalone'
      ? 'flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm'
      : 'flex h-full flex-col bg-card';

  return (
    <div className={containerClass}>
      {/* ------------------------------------------------ Header */}
      <header className="flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3">
        <Link href={`/rencontre-philippines/profil/${otherUser.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          <Image
            src={otherUser.avatar_url || '/default-avatar.webp'}
            alt={otherUser.username}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
          />
          <div className="min-w-0">
            <h2 className="truncate text-[16px] font-bold tracking-[-0.01em] text-foreground">
              {otherUser.username}
            </h2>
            {otherIsTyping && (
              <p className="text-xs italic text-muted-foreground">est en train d&apos;écrire…</p>
            )}
          </div>
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Options de la conversation"
            aria-expanded={menuOpen}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setReportTarget({}); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                <Flag className="h-4 w-4" /> Signaler ce profil
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setConfirmAction('unmatch'); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                <UserX className="h-4 w-4" /> Supprimer le match
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setConfirmAction('block'); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <Ban className="h-4 w-4" /> Bloquer
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ------------------------------------------------ Fil */}
      <main className="flex-1 overflow-y-auto bg-muted/30 px-4 py-4">
        <div className="space-y-3">
          {messages.map((message) => {
            const isMine = message.from_user_id === currentUserId;
            const time = new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div key={message.id} className={`group flex items-end gap-1.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                {/* Actions au survol (réaction / signaler) — côté opposé à la bulle */}
                {isMine && (
                  <ReactionButton
                    show={showEmojiPicker === message.id}
                    onToggle={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                    onPick={(emoji) => handleReaction(message.id, emoji)}
                    align="right"
                  />
                )}
                <div
                  className={`relative max-w-xs px-3.5 py-2.5 text-[15px] leading-snug shadow-sm lg:max-w-md ${
                    isMine
                      ? 'rounded-2xl rounded-br-md bg-primary text-primary-foreground'
                      : 'rounded-2xl rounded-bl-md bg-card text-foreground ring-1 ring-border'
                  } ${message.reactions && message.reactions.length > 0 ? 'mb-3' : ''}`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>

                  {!isMine && visibleTranslations[message.id] && translations[message.id] && (
                    <div className="mt-2 border-t border-border/60 pt-2">
                      <p className="whitespace-pre-wrap break-words italic text-foreground/90">
                        {translations[message.id].translation}
                      </p>
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        Traduit du {getLanguageLabel(translations[message.id].detected)}
                      </span>
                    </div>
                  )}

                  {!isMine && translationErrors[message.id] && (
                    <div className="mt-2 border-t border-border/60 pt-2 text-[11px] leading-snug text-muted-foreground">
                      {translationErrors[message.id].type === 'quota' ? (
                        <>
                          Limite quotidienne atteinte —{' '}
                          <Link href="/rencontre-philippines/premium" className="font-medium underline underline-offset-2">
                            Premium
                          </Link>{' '}
                          pour traduire sans limite
                        </>
                      ) : (
                        'Traduction indisponible pour le moment.'
                      )}
                    </div>
                  )}

                  {!isMine && (
                    <button
                      type="button"
                      onClick={() => toggleTranslation(message.id, message.content)}
                      disabled={loadingMessageId === message.id}
                      className="-my-1 mt-1.5 inline-flex items-center gap-1 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-wait disabled:opacity-60"
                    >
                      <Languages className="h-3 w-3" aria-hidden="true" />
                      {loadingMessageId === message.id
                        ? 'Traduction…'
                        : visibleTranslations[message.id]
                          ? 'Masquer la traduction'
                          : 'Traduire'}
                    </button>
                  )}

                  <span
                    className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
                      isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {time}
                    {isMine &&
                      message.id > 0 &&
                      (message.is_read ? (
                        <CheckCheck className="h-3.5 w-3.5" aria-label="Lu" />
                      ) : (
                        <Check className="h-3.5 w-3.5" aria-label="Envoyé" />
                      ))}
                    {isMine && message.id < 0 && <span aria-label="Envoi en cours">…</span>}
                  </span>

                  {message.reactions && message.reactions.length > 0 && (
                    <div className={`absolute -bottom-3 flex items-center gap-0.5 rounded-full bg-card px-1.5 py-0.5 shadow ring-1 ring-border ${isMine ? 'right-2' : 'left-2'}`}>
                      {message.reactions.slice(0, 3).map((r) => (
                        <span key={r.user_id} className="text-xs">{r.emoji}</span>
                      ))}
                      {message.reactions.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{message.reactions.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
                {!isMine && (
                  <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <ReactionButton
                      show={showEmojiPicker === message.id}
                      onToggle={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                      onPick={(emoji) => handleReaction(message.id, emoji)}
                      align="left"
                    />
                    <button
                      type="button"
                      onClick={() => setReportTarget({ messageId: message.id, preview: message.content.slice(0, 80) })}
                      aria-label="Signaler ce message"
                      title="Signaler ce message"
                      className="p-1 text-muted-foreground/50 hover:text-destructive"
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {otherIsTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-card px-4 py-2.5 ring-1 ring-border">
                <span className="inline-flex gap-1" aria-label="est en train d'écrire">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ------------------------------------------------ Erreurs d'envoi */}
      {sendError && (
        <div className="border-t border-border bg-card px-4 pt-3">
          {sendError === 'quota' ? (
            <div className="rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground">
              Tu as utilisé tes <strong>2 messages gratuits du jour</strong>. Reviens demain, ou passe en{' '}
              <Link href="/rencontre-philippines/premium" className="font-semibold text-primary underline underline-offset-2">
                Premium
              </Link>{' '}
              pour discuter sans limite 💬
            </div>
          ) : sendError === 'blocked' ? (
            <div className="rounded-xl border border-border bg-muted/60 px-3.5 py-2.5 text-[13px] text-muted-foreground">
              Vous ne pouvez plus échanger avec ce membre.
            </div>
          ) : sendError === 'nomatch' ? (
            <div className="rounded-xl border border-border bg-muted/60 px-3.5 py-2.5 text-[13px] text-muted-foreground">
              Vous n&apos;êtes plus en match avec ce membre — le message n&apos;a pas été envoyé.
            </div>
          ) : (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-[13px] text-destructive">
              L&apos;envoi a échoué. Vérifie ta connexion et réessaie.
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------ Composer */}
      <footer className="border-t border-border bg-card px-4 py-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTranslateChips((v) => !v)}
            disabled={!newMessage.trim()}
            className="inline-flex min-h-[36px] items-center gap-1.5 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
            Traduire mon message
          </button>
          {showTranslateChips && newMessage.trim() !== '' && (
            <>
              <button
                type="button"
                onClick={() => handleTranslateDraft('en')}
                disabled={translatingTo !== null}
                className="inline-flex min-h-[36px] items-center rounded-full border border-border px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-50"
              >
                {translatingTo === 'en' ? '…' : 'Anglais'}
              </button>
              <button
                type="button"
                onClick={() => handleTranslateDraft('tl')}
                disabled={translatingTo !== null}
                className="inline-flex min-h-[36px] items-center rounded-full border border-border px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-50"
              >
                {translatingTo === 'tl' ? '…' : 'Tagalog'}
              </button>
            </>
          )}
        </div>
        {draftError && (
          <p className="mb-2 text-[11px] text-muted-foreground">
            {draftError.type === 'quota' ? (
              <>
                Limite quotidienne atteinte —{' '}
                <Link href="/rencontre-philippines/premium" className="font-medium underline underline-offset-2">
                  Premium
                </Link>{' '}
                pour traduire sans limite
              </>
            ) : (
              'Traduction indisponible pour le moment.'
            )}
          </p>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (sendError) setSendError(null);
              handleTyping();
            }}
            placeholder="Écrivez votre message…"
            className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            aria-label="Envoyer le message"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </footer>

      {/* ------------------------------------------------ Modales */}
      {confirmAction && (
        <Modal onClose={() => setConfirmAction(null)}>
          <h3 className="text-lg font-bold text-foreground">
            {confirmAction === 'block' ? `Bloquer ${otherUser.username} ?` : `Supprimer le match avec ${otherUser.username} ?`}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {confirmAction === 'block'
              ? 'Vous ne pourrez plus vous écrire ni vous voir dans les suggestions. Cette personne ne sera pas notifiée.'
              : 'La conversation disparaîtra de vos messages. Pour re-matcher, il faudra vous liker à nouveau mutuellement.'}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmAction(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmedAction}
              disabled={actionBusy}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            >
              {actionBusy ? '…' : confirmAction === 'block' ? 'Bloquer' : 'Supprimer'}
            </button>
          </div>
        </Modal>
      )}

      {reportTarget && (
        <Modal onClose={() => { setReportTarget(null); setReportReason(''); }}>
          <h3 className="text-lg font-bold text-foreground">
            {reportTarget.messageId ? 'Signaler ce message' : `Signaler ${otherUser.username}`}
          </h3>
          {reportTarget.preview && (
            <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-sm italic text-muted-foreground">
              «&nbsp;{reportTarget.preview}&nbsp;»
            </p>
          )}
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Explique ce qui ne va pas (comportement, contenu inapproprié…)"
            className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setReportTarget(null); setReportReason(''); }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmitReport}
              disabled={actionBusy || reportReason.trim().length < 5}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {actionBusy ? '…' : 'Envoyer le signalement'}
            </button>
          </div>
        </Modal>
      )}

      {actionDone && (
        <Modal onClose={() => setActionDone(null)}>
          <p className="text-sm leading-relaxed text-foreground">{actionDone}</p>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setActionDone(null)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              OK
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------
const ReactionButton = ({
  show, onToggle, onPick, align,
}: {
  show: boolean;
  onToggle: () => void;
  onPick: (emoji: string) => void;
  align: 'left' | 'right';
}) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      aria-label="Réagir au message"
      className="p-1 text-muted-foreground/50 opacity-0 transition-opacity hover:text-muted-foreground group-hover:opacity-100"
    >
      <SmilePlus className="h-4 w-4" />
    </button>
    {show && (
      <div className={`absolute bottom-full z-20 mb-1 flex gap-1.5 rounded-full bg-card px-2.5 py-1.5 shadow-lg ring-1 ring-border ${align === 'right' ? 'right-0' : 'left-0'}`}>
        {REACTION_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onPick(emoji)}
            className="text-lg transition-transform hover:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
    )}
  </div>
);

const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

export default ChatThread;
