'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { getConversationsByUser } from '@/services/crmService';
import type { CRMConversation } from '@/types/services';
import StatusBadge from '@/components/crm/StatusBadge';
import UserChatPanel from './UserChatPanel';

export default function MesMessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<CRMConversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  // Mobile-only view toggle. On desktop both panes are always visible; on mobile
  // we swap between the conversation list and the full-screen chat.
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  const fetchConversations = async () => {
    setLoading(true);
    const { data } = await getConversationsByUser(supabase, user!.id);
    setConversations(data || []);
    if (data && data.length > 0) {
      // Pre-select for desktop; mobile still starts on the list (view === 'list').
      setSelectedConvo(data[0].id);
    }
    setLoading(false);
  };

  const openConversation = (id: string) => {
    setSelectedConvo(id);
    setView('chat');
  };

  const selected = conversations.find((c) => c.id === selectedConvo) || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + breadcrumb */}
      <div className="space-y-4">
        <nav aria-label="Fil d'ariane" className="text-[12px] uppercase tracking-[0.12em]">
          <ol className="m-0 flex list-none items-center gap-2 p-0">
            <li>
              <Link
                href="/mon-espace"
                className="rounded font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Mon espace
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-foreground/50">/</li>
            <li>
              <span aria-current="page" className="font-semibold text-foreground">Messages</span>
            </li>
          </ol>
        </nav>

        <div>
          <h1 className="text-[clamp(1.625rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
            Vos <span className="text-accent-strong">messages</span>
          </h1>
          <p className="mt-2 max-w-[62ch] text-[14.5px] text-muted-foreground">
            Échangez directement avec notre équipe à propos de vos services.
          </p>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card shadow-card-rest p-8 text-center lg:p-12">
          <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
            <MessageSquare className="h-6 w-6" />
          </span>
          <h2 className="text-[18px] font-bold text-ink">Aucune conversation</h2>
          <p className="mx-auto mt-1 max-w-[42ch] text-[13.5px] leading-snug text-muted-foreground">
            Vos échanges apparaîtront ici après l&apos;achat d&apos;un service d&apos;accompagnement.
          </p>
        </div>
      ) : (
        <div className="flex h-[calc(100dvh-13rem)] min-h-[440px] gap-4">
          {/* Conversation list — full width on mobile (list view), fixed column on desktop */}
          <div
            className={`${
              view === 'chat' ? 'hidden md:flex' : 'flex'
            } w-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-rest md:w-72 md:shrink-0`}
          >
            <div className="border-b border-border/60 px-4 py-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Conversations
              </h2>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              {conversations.map((convo) => {
                const isActive = selectedConvo === convo.id;
                return (
                  <button
                    key={convo.id}
                    onClick={() => openConversation(convo.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`w-full border-b border-border/60 px-4 py-3 text-left transition-colors last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                      isActive
                        ? 'border-l-2 border-l-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <p className="truncate text-[14px] font-medium text-foreground">{convo.subject}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <StatusBadge status={convo.status} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat panel — full width on mobile (chat view), flexible column on desktop */}
          <div
            className={`${
              view === 'chat' ? 'flex' : 'hidden md:flex'
            } min-w-0 flex-1 flex-col`}
          >
            {selected ? (
              <UserChatPanel
                conversationId={selected.id}
                userId={user!.id}
                subject={selected.subject}
                status={selected.status}
                onBack={() => setView('list')}
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-border/60 bg-card text-[14px] text-muted-foreground shadow-card-rest">
                Sélectionnez une conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
