'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Message, Profile } from '@/types';
import ChatThread from '@/components/dating/ChatThread';
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

  return <p className="text-xs text-muted-foreground/60">{timeString}</p>;
};

const MessagesClientPage = ({ initialMatches, currentUserId }: { initialMatches: MatchWithLastMessage[], currentUserId: string }) => {
  const [matches, setMatches] = useState(initialMatches);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithLastMessage | null>(null);
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
      // Les filtres realtime ne supportent pas or() : un listener par colonne.
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'matches', filter: `user_id_1=eq.${currentUserId}` },
        () => {
          router.refresh();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'matches', filter: `user_id_2=eq.${currentUserId}` },
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
    <div className="container mx-auto flex h-[calc(100vh-100px)] flex-col px-4 py-4">
      <div className="mb-5 flex-shrink-0">
        <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Rencontre
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
          Mes conversations
        </h1>
      </div>
      <div className="min-h-0 flex-grow gap-6 md:flex md:flex-row">
        {/* Conversation List */}
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:w-1/4">
          {matches.length > 0 ? (
            <ul className="divide-y divide-border overflow-y-auto">
              {matches.map(match => {
                const otherUser = match.user_id_1 === currentUserId ? match.user2 : match.user1;
                const isUnread = match.unread_count > 0;
                const isSelected = selectedMatch?.id === match.id;
                return (
                  <li key={match.id}>
                    <button
                      onClick={() => handleSelectMatch(match)}
                      className={`flex w-full items-center gap-3.5 border-l-[3px] px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent hover:bg-muted/60'
                      }`}
                    >
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={otherUser.avatar_url || '/default-avatar.webp'}
                          alt={otherUser.username}
                          fill
                          className="rounded-full object-cover ring-1 ring-border"
                        />
                        {isUnread && (
                          <span className="absolute -right-0.5 -top-0.5 block h-3 w-3 rounded-full bg-primary ring-2 ring-card" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className={`truncate text-[15px] ${isUnread ? 'font-bold text-foreground' : 'font-semibold text-foreground'}`}>
                            {otherUser.username}
                          </h3>
                          <TimeDisplay date={match.last_message?.created_at} />
                        </div>
                        <p className={`mt-0.5 truncate text-sm ${isUnread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {match.last_message ? match.last_message.content : 'Commencez la conversation !'}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="p-8 text-center text-[15px] leading-relaxed text-muted-foreground">
                Vous n&apos;avez pas encore de match. Continuez à swiper&nbsp;!
              </p>
            </div>
          )}
        </div>
        {/* Conversation Panel */}
        <div className={`w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:w-2/4 ${selectedMatch ? 'flex' : 'hidden md:flex'}`}>
          {selectedMatch ? (
            <ChatThread
              key={selectedMatch.id}
              currentUserId={currentUserId}
              otherUser={selectedMatch.user_id_1 === currentUserId ? selectedMatch.user2 : selectedMatch.user1}
              variant="embedded"
              onConversationEnd={() => {
                setSelectedMatch(null);
                router.refresh();
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Sélectionnez une conversation pour voir les messages.</p>
            </div>
          )}
        </div>
        {/* Profile Panel */}
        <div className="hidden flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:flex lg:w-1/4">
          {selectedMatch ? (
            <ProfilePanel
              userId={selectedMatch.user_id_1 === currentUserId ? selectedMatch.user_id_2 : selectedMatch.user_id_1}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Sélectionnez une conversation pour voir le profil.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesClientPage;
