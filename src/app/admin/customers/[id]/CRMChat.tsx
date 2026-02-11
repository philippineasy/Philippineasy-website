'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/utils/supabase/client';
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '@/services/crmService';
import type { CRMConversation, CRMMessage } from '@/types/services';

interface CRMChatProps {
  customerId: string;
  adminId: string;
}

export default function CRMChat({ customerId, adminId }: CRMChatProps) {
  const [conversations, setConversations] = useState<CRMConversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [customerId]);

  useEffect(() => {
    if (selectedConvo) {
      fetchMessages(selectedConvo);
      markMessagesAsRead(supabase, selectedConvo, adminId);

      // Realtime subscription
      const channel = supabase
        .channel(`crm-messages-${selectedConvo}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'crm_messages', filter: `conversation_id=eq.${selectedConvo}` },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
            scrollToBottom();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConvo]);

  const fetchConversations = async () => {
    setLoading(true);
    const { data } = await getConversations(supabase, { customerId });
    setConversations(data || []);
    if (data && data.length > 0) {
      setSelectedConvo(data[0].id);
    }
    setLoading(false);
  };

  const fetchMessages = async (convoId: string) => {
    const { data } = await getMessages(supabase, convoId);
    setMessages(data || []);
    setTimeout(scrollToBottom, 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConvo) return;

    setSending(true);
    await sendMessage(supabase, selectedConvo, adminId, newMessage.trim(), true, customerId);
    setNewMessage('');
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        Aucune conversation avec ce client
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[500px]">
      {/* Conversation list */}
      <div className="w-64 border border-border rounded-lg overflow-auto flex-shrink-0">
        {conversations.map((convo) => (
          <button
            key={convo.id}
            onClick={() => setSelectedConvo(convo.id)}
            className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors ${
              selectedConvo === convo.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
            }`}
          >
            <p className="font-medium text-sm truncate">{convo.subject}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(convo.last_message_at).toLocaleDateString('fr-FR')}
            </p>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 border border-border rounded-lg flex flex-col">
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${msg.is_admin_message ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2.5 text-sm ${
                  msg.is_admin_message
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${
                  msg.is_admin_message ? 'text-primary-foreground/60' : 'text-muted-foreground'
                }`}>
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
    </div>
  );
}
