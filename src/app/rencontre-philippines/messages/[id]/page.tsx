import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import ChatClientPage from './ChatClientPage';
import { getProfileById, getDatingGateStatus } from '@/services/userService';

export default async function MessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: otherUserId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const gateStatus = await getDatingGateStatus(supabase, user.id);
  if (gateStatus === 'no-profile') {
    redirect('/rencontre-philippines/inscription');
  }
  if (gateStatus === 'pending') {
    redirect('/rencontre-philippines/en-attente');
  }

  const [otherUserProfile, currentUserProfile] = await Promise.all([
    getProfileById(supabase, otherUserId),
    getProfileById(supabase, user.id),
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