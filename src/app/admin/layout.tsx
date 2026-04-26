import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <div className="flex bg-muted/40 min-h-screen pt-20">
      <AdminSidebar isSuperAdmin={isSuperAdmin} />
      <main className="flex-1 min-w-0 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
