'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/utils/supabase/client';
import { getMessages, sendMessage, markMessagesAsRead } from '@/services/crmService';

interface UserChatPanelProps {
  conversationId: string;
  userId: string;
}

export default function UserChatPanel({ conversationId, userId }: UserChatPanelProps) {
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
    <div className="flex-1 border border-border rounded-lg flex flex-col">
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${msg.is_admin_message ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] rounded-xl px-4 py-2.5 text-sm ${
                msg.is_admin_message
                  ? 'bg-muted text-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {msg.is_admin_message && (
                <p className="text-xs font-medium text-primary mb-1">Philippin&apos;Easy</p>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className={`text-[10px] mt-1 ${
                msg.is_admin_message ? 'text-muted-foreground' : 'text-primary-foreground/60'
              }`}>
                {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrire un message..."
            rows={1}
            className="flex-1 resize-none bg-muted rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {sending ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
