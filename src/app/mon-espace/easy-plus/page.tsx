import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  Sparkles, Crown, Check, Headphones, MessagesSquare, Tag, Map, Heart,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const PERKS: { icon: React.ReactNode; title: string; description: string }[] = [
  {
    icon: <Map className="w-5 h-5" />,
    title: 'Itinéraires IA illimités',
    description: '2 générations gratuites par mois (au lieu de 0). Économie : 9,99 € par génération.',
  },
  {
    icon: <Tag className="w-5 h-5" />,
    title: '20 % sur tous les services',
    description: 'Buddy System, Pack Voyage Serein, Pack Ultime — sur toutes nos prestations à durée limitée.',
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: 'Support prioritaire',
    description: 'Réponse sous 4 h en jours ouvrés (au lieu de 48 h pour les utilisateurs standards).',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Rencontre Premium 6 mois',
    description: 'Accès swipe illimité + voir qui vous a liké + filtres premium (inclus dans Pack Ultime).',
  },
  {
    icon: <MessagesSquare className="w-5 h-5" />,
    title: 'Groupe privé Telegram',
    description: 'Communauté de voyageurs et expatriés actifs aux Philippines, partage tips terrain.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Codes promo partenaires',
    description: 'Klook, Booking, Airalo, Wise — codes exclusifs négociés pour membres Easy+.',
  },
];

function formatExpiry(iso: string | null | undefined): { label: string; days: number | null; tone: string } {
  if (!iso) return { label: 'Aucun abonnement actif', days: null, tone: 'text-muted-foreground' };
  const ms = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(ms / 86400000);
  if (days < 0) return { label: 'Expiré', days, tone: 'text-destructive' };
  if (days <= 7) return { label: `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`, days, tone: 'text-accent-strong' };
  if (days <= 30) return { label: `${days} jours restants`, days, tone: 'text-[hsl(var(--success))]' };
  return { label: `${days} jours restants`, days, tone: 'text-[hsl(var(--success))]' };
}

export default async function MonEspaceEasyPlusPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?redirect=/mon-espace/easy-plus');

  const { data: profile } = await supabase
    .from('profiles')
    .select('easy_plus_expires_at')
    .eq('id', user.id)
    .single();

  const expiry = formatExpiry(profile?.easy_plus_expires_at);
  // Subscription valid through end of expiry day → days >= 0 still counts as active.
  const isActive = expiry.days !== null && expiry.days >= 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-1">
          ✦ Membre Easy+
        </span>
        <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.02em] leading-tight text-ink">
          Votre statut <span className="text-accent">Philippin'Easy+</span>
        </h1>
      </div>

      {/* Status card — pulse if active */}
      <div className={[
        'rounded-3xl px-6 py-7 lg:px-8 lg:py-8 border shadow-card-rest',
        isActive
          ? 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30'
          : 'bg-muted/40 border-border/60',
      ].join(' ')}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className={[
              'shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center',
              isActive ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground',
            ].join(' ')}>
              <Crown className="w-7 h-7" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <strong className="block text-[18px] font-bold text-ink leading-tight">
                {isActive ? 'Membre Easy+ actif' : 'Membre Standard'}
              </strong>
              <span className={['block text-[13px] mt-0.5 font-medium', expiry.tone].join(' ')}>
                {expiry.label}
                {profile?.easy_plus_expires_at && expiry.days !== null && expiry.days >= 0 && (
                  <> · expire le {new Date(profile.easy_plus_expires_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</>
                )}
              </span>
            </div>
          </div>
          {!isActive && (
            <Link
              href="/services#easy-plus"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Sparkles className="w-4 h-4" />
              Devenir membre — dès 29 €/mois
            </Link>
          )}
        </div>
      </div>

      {/* Perks */}
      <div>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">
          {isActive ? 'Vos avantages actifs' : 'Avantages réservés aux membres'}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          {PERKS.map((perk, i) => (
            <div
              key={i}
              className={[
                'rounded-2xl border p-5 transition-all',
                isActive
                  ? 'bg-card border-border/60 shadow-card-rest'
                  : 'bg-muted/20 border-border/50 opacity-75',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <span className={[
                  'shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
                  isActive ? 'bg-accent/15 text-accent' : 'bg-muted text-muted-foreground',
                ].join(' ')} aria-hidden="true">
                  {perk.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <strong className="text-[15px] font-semibold text-ink">{perk.title}</strong>
                    {isActive && <Check className="w-3.5 h-3.5 text-[hsl(var(--success))] shrink-0" aria-hidden="true" />}
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-snug">{perk.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!isActive && (
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/85 text-primary-foreground px-6 py-7 lg:px-8 lg:py-8 shadow-cta">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="block text-[11px] uppercase tracking-[0.1em] text-accent font-semibold mb-1">✦ Offre à vie</span>
              <strong className="block text-[20px] lg:text-[22px] font-bold leading-tight mb-1">
                Devenez membre Easy+ à vie pour 499 €
              </strong>
              <p className="text-[13.5px] text-primary-foreground/85">
                Économie de 79 % sur 24 mois · accès à vie à tous les avantages ci-dessus.
              </p>
            </div>
            <Link
              href="/services#easy-plus"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-3 text-[14px] font-semibold shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Voir les options
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
