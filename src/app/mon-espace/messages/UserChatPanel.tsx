'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { getMessages, sendMessage, markMessagesAsRead } from '@/services/crmService';
import StatusBadge from '@/components/crm/StatusBadge';

interface UserChatPanelProps {
  conversationId: string;
  userId: string;
  subject?: string;
  status?: string;
  onBack?: () => void;
}

export default function UserChatPanel({ conversationId, userId, subject, status, onBack }: UserChatPanelProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    markMessagesAsRead(supabase, conversationId, userId);

    const channel = supabase
      .channel(`user-crm-${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'crm_messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
          // Auto-mark as read if admin message
          if (payload.new.is_admin_message) {
            markMessagesAsRead(supabase, conversationId, userId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const fetchMessages = async () => {
    const { data } = await getMessages(supabase, conversationId);
    setMessages(data || []);
    setTimeout(scrollToBottom, 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    await sendMessage(supabase, conversationId, userId, newMessage.trim(), false);
    setNewMessage('');
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-rest">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border/60 px-4 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="-ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
            aria-label="Retour à la liste des conversations"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-ink">{subject || 'Conversation'}</p>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-3 overflow-auto p-4">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${msg.is_admin_message ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                msg.is_admin_message
                  ? 'rounded-tl-sm bg-muted text-foreground'
                  : 'rounded-tr-sm bg-primary text-primary-foreground'
              }`}
            >
              {msg.is_admin_message && (
                <p className="mb-1 text-[11px] font-semibold text-primary">Philippin&apos;Easy</p>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p
                className={`mt-1 text-[10px] ${
                  msg.is_admin_message ? 'text-muted-foreground' : 'text-primary-foreground/60'
                }`}
              >
                {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-border/60 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrire un message…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-primary"
          />
          <button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50"
            aria-label="Envoyer le message"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
