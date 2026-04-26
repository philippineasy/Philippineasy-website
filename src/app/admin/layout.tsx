import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const ADMIN_ROLES = new Set(['super_admin', 'editor', 'moderator']);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?redirect=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile?.role || !ADMIN_ROLES.has(profile.role)) {
    redirect('/');
  }

  const isSuperAdmin = profile.role === 'super_admin';

  return (
    <div className="flex bg-muted/40 min-h-screen pt-20">
      <AdminSidebar isSuperAdmin={isSuperAdmin} />
      <main className="flex-1 min-w-0 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
