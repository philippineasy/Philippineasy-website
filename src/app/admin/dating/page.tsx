import { createServiceRoleClient } from '@/utils/supabase/service-role';
import Link from 'next/link';
import { Heart, UserCheck, UserX, Camera, Flag, Plus, ArrowUpRight } from 'lucide-react';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminCard,
  AdminSection,
} from '@/components/admin';

export const dynamic = 'force-dynamic';

export default async function AdminDatingPage() {
  const supabase = createServiceRoleClient();

  const [{ count: total }, { count: validated }, { count: pending }, { count: photos }] = await Promise.all([
    supabase.from('dating_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('dating_profiles').select('*', { count: 'exact', head: true }).eq('is_validated', true),
    supabase.from('dating_profiles').select('*', { count: 'exact', head: true }).eq('is_validated', false),
    supabase.from('dating_photos').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Modération · Rencontre"
        title={<>Section <span className="text-accent">Rencontre</span></>}
        description="Validation des profils, modération des photos et traitement des signalements."
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

      <AdminSection eyebrow="Vue d'ensemble" title="Profils & médias">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <AdminStatCard
            label="Profils au total"
            value={total || 0}
            accent="primary"
            icon={<Heart className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Profils validés"
            value={validated || 0}
            accent="emerald"
            icon={<UserCheck className="w-5 h-5" />}
          />
          <AdminStatCard
            label="En attente de modération"
            value={pending || 0}
            accent={pending && pending > 5 ? 'amber' : 'sky'}
            icon={<UserX className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Photos uploadées"
            value={photos || 0}
            accent="violet"
            icon={<Camera className="w-5 h-5" />}
          />
        </div>
      </AdminSection>

      <AdminSection eyebrow="Outils" title="Modération">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModTile
            href="/admin/dating/profiles"
            icon={<UserCheck className="w-5 h-5" />}
            title="Gestion des profils"
            description="Valider, bannir, et gérer les utilisateurs."
          />
          <ModTile
            href="/admin/dating/photos"
            icon={<Camera className="w-5 h-5" />}
            title="Modération des photos"
            description="Approuver, rejeter ou flagger les photos uploadées."
          />
          <ModTile
            href="/admin/dating/reports"
            icon={<Flag className="w-5 h-5" />}
            title="Messages signalés"
            description="Conversations signalées par les utilisateurs."
          />
        </div>
      </AdminSection>
    </>
  );
}

function ModTile({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl">
      <AdminCard hoverable>
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center" aria-hidden="true">
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <strong className="text-[15px] font-semibold text-ink truncate">{title}</strong>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
            </div>
            <p className="text-[12.5px] text-muted-foreground leading-snug">{description}</p>
          </div>
        </div>
      </AdminCard>
    </Link>
  );
}
