import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ChatClientPage from './ChatClientPage';
import { getProfileById } from '@/services/userService';

export default async function MessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: otherUserId } = await params;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const [otherUserProfile, currentUserProfile] = await Promise.all([
    getProfileById(otherUserId),
    getProfileById(user.id)
  ]);

  if (!otherUserProfile || !currentUserProfile) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-4 mt-8">
      <ChatClientPage
        currentUser={currentUserProfile}
        otherUser={otherUserProfile}
      />
    </div>
  );
}