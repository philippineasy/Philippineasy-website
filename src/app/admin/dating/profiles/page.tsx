import Link from 'next/link';
import { ProfilesClient } from './ProfilesClient';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { Plus, Filter } from 'lucide-react';
import {
  AdminPageHeader,
  AdminCard,
  AdminEmptyState,
} from '@/components/admin';

export default async function AdminDatingProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; plan?: string }>;
}) {
  const { q, status, plan } = await searchParams;

  const supabase = createServiceRoleClient();

  // PostgREST .ilike() / .eq() on joined relations (profiles.column) is not
  // reliably supported via the JS client — we filter client-side after fetch.
  let query = supabase
    .from('dating_profiles')
    .select('*, profiles!inner(*)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (status) query = query.eq('is_validated', status === 'validated');

  const { data: profilesRaw, error } = await query;

  // Client-side filtering for joined-relation criteria
  const profiles = (profilesRaw || []).filter((row: any) => {
    if (q && !row.profiles?.username?.toLowerCase().includes(q.toLowerCase())) return false;
    if (plan && row.profiles?.plan !== plan) return false;
    return true;
  });

  if (error) {
    return (
      <AdminCard padding="lg">
        <p className="text-rose-700 font-medium">Erreur lors du chargement des profils: {error.message}</p>
      </AdminCard>
    );
  }

  const emailMap = new Map<string, string>();
  const userResults = await Promise.allSettled(
    profiles.map((p) => supabase.auth.admin.getUserById(p.user_id))
  );
  userResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.data?.user?.email) {
      emailMap.set(profiles[index].user_id, result.value.data.user.email);
    }
  });

  const profilesWithEmail = profiles.map((profile) => ({
    ...profile,
    email: emailMap.get(profile.user_id),
  }));

  return (
    <>
      <AdminPageHeader
        eyebrow="Modération · Rencontre"
        title={<>Gestion des <span className="text-accent">profils</span></>}
        description={`${profilesWithEmail.length} profil${profilesWithEmail.length > 1 ? 's' : ''} ${q ? `correspondant à « ${q} »` : 'au total'}.`}
        actions={
          <Link
            href="/admin/dating/profiles/add"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent text-ink px-4 py-2 text-[13px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un profil
          </Link>
        }
      />

      <AdminCard padding="md" className="mb-6">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1.5">Recherche</label>
            <input type="text" name="q" defaultValue={q} placeholder="Nom d'utilisateur…" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground/60" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1.5">Statut</label>
            <select name="status" defaultValue={status} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <option value="">Tous</option>
              <option value="validated">Validé</option>
              <option value="pending">En attente</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-1.5">Abonnement</label>
            <select name="plan" defaultValue={plan} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <option value="">Tous</option>
              <option value="premium">Premium</option>
              <option value="free">Gratuit</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-[13px] font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
          </div>
        </form>
      </AdminCard>

      {profilesWithEmail.length > 0 ? (
        <AdminCard padding="sm" className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60">
                  <th className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Utilisateur</th>
                  <th className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Statut</th>
                  <th className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Abonnement</th>
                  <th className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Inscrit le</th>
                  <th className="px-4 py-3 text-right font-semibold text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <ProfilesClient profiles={profilesWithEmail} />
            </table>
          </div>
        </AdminCard>
      ) : (
        <AdminCard padding="lg">
          <AdminEmptyState
            title="Aucun profil"
            description={q ? `Aucun profil ne correspond à « ${q} »` : 'Pas encore de profil dating à modérer.'}
          />
        </AdminCard>
      )}
    </>
  );
}
