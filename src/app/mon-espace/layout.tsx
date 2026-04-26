import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import MonEspaceShell from './MonEspaceShell';

export const metadata: Metadata = {
  title: 'Mon Espace · Philippineasy',
  robots: { index: false, follow: false },
};

export default async function MonEspaceLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connexion?redirect=/mon-espace');
  }

  return <MonEspaceShell>{children}</MonEspaceShell>;
}
