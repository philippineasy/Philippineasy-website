import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import ChatThread from '@/components/dating/ChatThread';
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

  const otherUserProfile = await getProfileById(supabase, otherUserId);
  if (!otherUserProfile) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-4 mt-8">
      <ChatThread
        currentUserId={user.id}
        otherUser={otherUserProfile}
        variant="standalone"
      />
    </div>
  );
}
