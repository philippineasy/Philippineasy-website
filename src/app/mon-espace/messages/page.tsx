'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  const fetchConversations = async () => {
    setLoading(true);
    const { data } = await getConversationsByUser(supabase, user!.id);
    setConversations(data || []);
    if (data && data.length > 0) {
      setSelectedConvo(data[0].id);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>

      {conversations.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Aucune conversation. Les messages apparaitront ici après l&apos;achat d&apos;un service.
          </p>
        </div>
      ) : (
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
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={convo.status} />
                </div>
              </button>
            ))}
          </div>

          {/* Chat panel */}
          {selectedConvo && (
            <UserChatPanel conversationId={selectedConvo} userId={user!.id} />
          )}
        </div>
      )}
    </div>
  );
}
