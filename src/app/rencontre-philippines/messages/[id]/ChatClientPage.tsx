'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { Profile } from '@/types';
import { Send, Check, CheckCheck } from 'lucide-react';

interface ChatClientPageProps {
  currentUser: Profile;
  otherUser: Profile;
}

interface Message {
  id: number;
  from_user_id: string;
  to_user_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

const ChatClientPage = ({ currentUser, otherUser }: ChatClientPageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(from_user_id.eq.${currentUser.id},to_user_id.eq.${otherUser.id}),and(from_user_id.eq.${otherUser.id},to_user_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data as any);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:${currentUser.id}:${otherUser.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as Message;
        if (
          (newMessage.from_user_id === currentUser.id && newMessage.to_user_id === otherUser.id) ||
          (newMessage.from_user_id === otherUser.id && newMessage.to_user_id === currentUser.id)
        ) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.id, otherUser.id, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const { error } = await supabase.from('messages').insert({
      from_user_id: currentUser.id,
      to_user_id: otherUser.id,
      content: newMessage,
    });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-[60vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="sticky top-0 z-10 flex items-center gap-3.5 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <Image
          src={otherUser.avatar_url || '/default-avatar.webp'}
          alt={otherUser.username}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
        />
        <h1 className="text-[17px] font-bold tracking-[-0.01em] text-foreground">{otherUser.username}</h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-muted/30 px-4 py-4">
        <div className="space-y-2.5">
          {messages.map((message) => {
            const isMine = message.from_user_id === currentUser.id;
            const time = new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-3.5 py-2.5 text-[15px] leading-snug shadow-sm lg:max-w-md ${
                    isMine
                      ? 'rounded-2xl rounded-br-md bg-primary text-primary-foreground'
                      : 'rounded-2xl rounded-bl-md bg-card text-foreground ring-1 ring-border'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  <span
                    className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
                      isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {time}
                    {isMine &&
                      (message.is_read ? (
                        <CheckCheck className="h-3.5 w-3.5" aria-label="Lu" />
                      ) : (
                        <Check className="h-3.5 w-3.5" aria-label="Envoyé" />
                      ))}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-card px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message…"
            className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={newMessage.trim() === ''}
            aria-label="Envoyer le message"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatClientPage;
