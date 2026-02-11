import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CustomerDetailTabs from './CustomerDetailTabs';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (adminProfile?.role !== 'super_admin') redirect('/admin');

  // Fetch customer profile
  const { data: customer, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, bio, location, customer_since, total_spent, whatsapp_number, easy_plus_expires_at, rencontre_premium_expires_at, created_at')
    .eq('id', id)
    .single();

  if (error || !customer) {
    redirect('/admin/customers');
  }

  return (
    <>
      <CustomerDetailTabs customer={customer} adminId={user.id} />
    </>
  );
}
