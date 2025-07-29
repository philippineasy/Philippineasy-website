'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Message, Profile, Reaction } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCheckDouble, faSmile } from '@fortawesome/free-solid-svg-icons';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ConversationPanelProps {
  otherUser: Profile;
}

const ConversationPanel = ({ otherUser }: ConversationPanelProps) => {
  const supabase = createClient();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!otherUser) return;
      const { data, error } = await supabase.rpc('get_conversation_messages', {
        other_user_id: otherUser.id,
      });

      if (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } else {
        setMessages(data as Message[] || []);
        await supabase.rpc('mark_conversation_as_read', {
          p_other_user_id: otherUser.id,
        });
      }
    };

    fetchMessages();
  }, [otherUser, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user || !otherUser?.id) return;

    const channelName = `conversation-${[user.id, otherUser.id].sort().join('-')}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: {
          self: false,
        },
      },
    });

    const handleNewMessage = (payload: any) => {
      if (payload.new.from_user_id === otherUser.id) {
        setMessages((prev) => [...prev, payload.new as Message]);
        supabase.rpc('mark_conversation_as_read', { p_other_user_id: otherUser.id });
      }
    };

    const handleTypingEvent = (payload: any) => {
      setIsTyping(payload.payload.isTyping);
    };

    const handleReactionUpdate = (payload: any) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === payload.payload.message_id
            ? { ...msg, reactions: payload.payload.reactions }
            : msg
        )
      );
    };

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handleNewMessage)
      .on('broadcast', { event: 'typing' }, handleTypingEvent)
      .on('broadcast', { event: 'reaction_update' }, handleReactionUpdate)
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id, otherUser?.id, supabase]);

  const handleTyping = () => {
    const channelName = `conversation-${[user?.id, otherUser.id].sort().join('-')}`;
    const channel = supabase.channel(channelName);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { isTyping: true },
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { isTyping: false },
      });
    }, 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const channelName = `conversation-${[user.id, otherUser.id].sort().join('-')}`;
    const channel = supabase.channel(channelName);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { isTyping: false },
    });

    const { data, error } = await supabase
      .from('messages')
      .insert({
        from_user_id: user.id,
        to_user_id: otherUser.id,
        content: newMessage.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setMessages(prevMessages => [...prevMessages, data as Message]);
      setNewMessage('');
    } else {
      console.error('Error sending message:', error);
    }
  };

  const handleReaction = async (messageId: number, emoji: string) => {
    if (!user) return;
    const existingReaction = messages.find((m: Message) => m.id === messageId)?.reactions?.find(r => r.user_id === user.id);
    if (existingReaction && existingReaction.emoji === emoji) {
      await supabase.rpc('remove_reaction', { p_message_id: messageId });
    } else {
      await supabase.rpc('add_reaction', { p_message_id: messageId, p_emoji: emoji });
    }

    const { data, error } = await supabase.rpc('get_conversation_messages', { other_user_id: otherUser.id });
    if (!error) {
      const updatedMessages = data as Message[] || [];
      setMessages(updatedMessages);
      const channelName = `conversation-${[user.id, otherUser.id].sort().join('-')}`;
      const channel = supabase.channel(channelName);
      channel.send({
        type: 'broadcast',
        event: 'reaction_update',
        payload: {
          message_id: messageId,
          reactions: updatedMessages.find((m: Message) => m.id === messageId)?.reactions || [],
        }
      });
    }
    setShowEmojiPicker(null);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b flex items-center flex-shrink-0">
        <Image
          src={otherUser.avatar_url || '/default-avatar.webp'}
          alt={otherUser.username}
          width={40}
          height={40}
          className="rounded-full object-cover mr-3"
        />
        <h2 className="text-lg font-semibold">{otherUser.username}</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => {
          const isMyMessage = message.from_user_id === user?.id;
          return (
            <div key={message.id} className={`group flex items-center gap-2 mb-4 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative flex items-center ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`relative rounded-lg px-3 py-2 max-w-xs lg:max-w-md ${isMyMessage ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-800'}`}>
                  <p>{message.content}</p>
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="absolute -bottom-3.5 bg-white px-1.5 py-0.5 rounded-full shadow flex items-center space-x-1">
                      {message.reactions.slice(0, 3).map(r => <span key={r.user_id} className="text-xs">{r.emoji}</span>)}
                      {message.reactions.length > 3 && <span className="text-xs">...</span>}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)} className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FontAwesomeIcon icon={faSmile} />
                  </button>
                  {showEmojiPicker === message.id && (
                    <div className={`absolute bottom-full mb-1 bg-white shadow-lg rounded-full px-2 py-1 flex space-x-2 z-20 ${isMyMessage ? 'right-0' : 'left-0'}`}>
                      {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                        <button key={emoji} onClick={() => handleReaction(message.id, emoji)} className="text-lg hover:scale-125 transition-transform">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
              <p className="italic text-sm">est en train d'écrire...</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="ml-3 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationPanel;
