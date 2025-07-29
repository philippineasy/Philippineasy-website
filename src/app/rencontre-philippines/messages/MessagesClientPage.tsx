'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Message, Profile } from '@/types';
import ConversationPanel from '@/components/dating/ConversationPanel';
import ProfilePanel from '@/components/dating/ProfilePanel';

interface MatchWithLastMessage {
  id: number;
  user_id_1: string;
  user_id_2: string;
  user1: Profile;
  user2: Profile;
  last_message: Partial<Message> | null;
  unread_count: number;
}

const TimeDisplay = ({ date }: { date: string | null | undefined }) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    if (date) {
      setTimeString(new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [date]);

  return <p className="text-xs text-gray-400">{timeString}</p>;
};

const MessagesClientPage = ({ initialMatches, currentUserId }: { initialMatches: MatchWithLastMessage[], currentUserId: string }) => {
  const [matches, setMatches] = useState(initialMatches);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithLastMessage | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel(`messages_for_${currentUserId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `to_user_id=eq.${currentUserId}` },
        () => {
          router.refresh();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'matches', filter: `or(user_id_1.eq.${currentUserId},user_id_2.eq.${currentUserId})` },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, currentUserId, router]);

  const handleSelectMatch = (match: MatchWithLastMessage) => {
    setSelectedMatch(match);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-100px)]">
      <h1 className="text-3xl font-bold mb-4 flex-shrink-0">Mes Conversations</h1>
      <div className="flex-grow md:flex md:flex-row gap-8 min-h-0">
        {/* Conversation List */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md flex flex-col">
          {matches.length > 0 ? (
            <ul className="overflow-y-auto">
              {matches.map(match => {
                const otherUser = match.user_id_1 === currentUserId ? match.user2 : match.user1;
                const isUnread = match.unread_count > 0;
                return (
                  <li key={match.id} className="border-b last:border-b-0">
                    <button
                      onClick={() => handleSelectMatch(match)}
                      className={`flex items-center p-4 w-full text-left hover:bg-gray-50 border-l-4 ${selectedMatch?.id === match.id ? 'border-accent bg-accent/5' : 'border-transparent'}`}
                    >
                      <div className="relative w-12 h-12 rounded-full mr-4 flex-shrink-0">
                        <Image
                          src={otherUser.avatar_url || '/default-avatar.webp'}
                          alt={otherUser.username}
                          fill
                          className="rounded-full object-cover"
                        />
                        {isUnread && (
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-primary ring-2 ring-white" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between">
                          <h3 className="font-semibold truncate pr-2">{otherUser.username}</h3>
                          <TimeDisplay date={match.last_message?.created_at} />
                        </div>
                        <p className={`text-sm truncate ${isUnread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                          {match.last_message ? match.last_message.content : "Commencez la conversation !"}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="p-8 text-center text-gray-500">Vous n'avez pas encore de match. Continuez à swiper !</p>
            </div>
          )}
        </div>
        {/* Conversation Panel */}
        <div className={`w-full md:w-2/4 bg-white rounded-lg shadow-md flex-col ${selectedMatch ? 'flex' : 'hidden md:flex'}`}>
          {selectedMatch ? (
            <ConversationPanel
              otherUser={selectedMatch.user_id_1 === currentUserId ? selectedMatch.user2 : selectedMatch.user1}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Sélectionnez une conversation pour voir les messages.</p>
            </div>
          )}
        </div>
        {/* Profile Panel */}
        <div className="hidden lg:flex lg:w-1/4 bg-white rounded-lg shadow-md flex-col">
          {selectedMatch ? (
            <ProfilePanel
              userId={selectedMatch.user_id_1 === currentUserId ? selectedMatch.user_id_2 : selectedMatch.user_id_1}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Sélectionnez une conversation pour voir le profil.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesClientPage;
