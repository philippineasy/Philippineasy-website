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
    <div className="flex flex-col h-[60vh] border rounded-lg shadow-lg bg-white">
      <header className="bg-white shadow-md p-4 flex items-center sticky top-0 z-10 rounded-t-lg">
        <Image
          src={otherUser.avatar_url || '/default-avatar.webp'}
          alt={otherUser.username}
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-xl font-bold ml-4">{otherUser.username}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.from_user_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                  message.from_user_id === currentUser.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-75 mt-1 text-right">
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 sticky bottom-0 border-t border-gray-200 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-4 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="h-6 w-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatClientPage;
