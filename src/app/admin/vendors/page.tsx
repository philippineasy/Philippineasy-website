import { createClient } from '@/utils/supabase/server';
import { VendorManagementClient, PendingVendor } from './VendorManagementClient';
import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

async function getPendingVendors(supabase: ReturnType<typeof createClient>): Promise<PendingVendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select(`
      id,
      name,
      description,
      created_at,
      user_id,
      profiles (
        username
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending vendors:', error);
    return [];
  }
  
  // The profile is nested, so we need to flatten it.
  return data.map(v => ({
    id: v.id,
    name: v.name,
    description: v.description,
    created_at: v.created_at,
    user_id: v.user_id,
    username: (v.profiles as any)?.username || 'N/A',
  }));
}

export default async function AdminVendorsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/connexion');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'super_admin') {
    return (
      <div>
        <h1 className="text-2xl font-bold">Accès non autorisé</h1>
        <p>Vous n'avez pas les droits pour accéder à cette page.</p>
      </div>
    );
  }

  const pendingVendors = await getPendingVendors(supabase);

  return (
    <div>
      <Toaster position="bottom-center" />
      <h1 className="text-2xl font-bold mb-6">Gestion des Vendeurs</h1>
      <VendorManagementClient pendingVendors={pendingVendors} />
    </div>
  );
}
