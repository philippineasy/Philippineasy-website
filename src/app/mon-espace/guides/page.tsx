'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, FileText, Check, Lock, Mail, Library } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';

const GUIDES = [
  {
    type: 'guide_pdf_visa',
    name: 'Guide Visa Philippines 2026',
    description: 'Tout savoir sur les visas : touriste, business, retraite, SRRV, 13(a)...',
  },
  {
    type: 'guide_pdf_cout_vie',
    name: 'Guide Coût de la Vie',
    description: 'Budget détaillé : logement, nourriture, transport, santé, loisirs...',
  },
  {
    type: 'guide_pdf_destinations',
    name: 'Guide Destinations Secrètes',
    description: 'Îles et spots méconnus des touristes, testés par notre équipe',
  },
];

const GUIDES_CONTACT_EMAIL = 'contact@philippineasy.com';

function guideMailtoUrl(guideName: string): string {
  const subject = `Envoi de mon guide acheté — ${guideName}`;
  const body = `Bonjour,\n\nJ'ai acheté le guide "${guideName}" et je souhaiterais le recevoir par e-mail.\n\nMerci !`;
  return `mailto:${GUIDES_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function MesGuidesPage() {
  const { user } = useAuth();
  const [ownedGuides, setOwnedGuides] = useState<string[]>([]);
  const [hasLibraryAccess, setHasLibraryAccess] = useState(false);
  const [libraryExpiresAt, setLibraryExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchGuides();
  }, [user]);

  const fetchGuides = async () => {
    setLoading(true);

    // 1. Bibliotheque complete (Pack Ultime) : un seul entitlement
    //    `pdf_library_access` actif = acces a TOUS les guides existants
    //    et futurs sans maintenir de liste hardcodee.
    const { data: libraryRows } = await supabase
      .from('purchase_entitlements')
      .select('expires_at')
      .eq('user_id', user!.id)
      .eq('feature_type', 'pdf_library_access')
      .in('status', ['available', 'in_use'])
      .order('expires_at', { ascending: false })
      .limit(1);

    const lib = libraryRows?.[0];
    const libActive = !!(lib && (!lib.expires_at || new Date(lib.expires_at) > new Date()));
    setHasLibraryAccess(libActive);
    setLibraryExpiresAt(lib?.expires_at ?? null);

    // 2. Guides individuels (achats unitaires guide_pdf_*)
    const { data } = await supabase
      .from('purchase_entitlements')
      .select('feature_type')
      .eq('user_id', user!.id)
      .like('feature_type', 'guide_pdf_%')
      .in('status', ['available', 'in_use', 'fully_used']);

    setOwnedGuides((data || []).map((e: any) => e.feature_type));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + breadcrumb */}
      <div className="space-y-4">
        <nav aria-label="Fil d'ariane" className="text-[12px] uppercase tracking-[0.12em]">
          <ol className="m-0 flex list-none items-center gap-2 p-0">
            <li>
              <Link
                href="/mon-espace"
                className="rounded font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Mon espace
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-foreground/50">/</li>
            <li>
              <span aria-current="page" className="font-semibold text-foreground">Guides PDF</span>
            </li>
          </ol>
        </nav>

        <div>
          <h1 className="text-[clamp(1.625rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
            Vos <span className="text-accent-strong">guides PDF</span>
          </h1>
          <p className="mt-2 max-w-[62ch] text-[14.5px] text-muted-foreground">
            Retrouvez ici les guides que vous avez achetés. Recevez-les par e-mail en un clic.
          </p>
        </div>
      </div>

      {hasLibraryAccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400" aria-hidden="true">
            <Library className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-ink">Bibliothèque PDF complète activée</div>
            <div className="text-[12.5px] text-muted-foreground">
              Accès à tous les guides existants et à venir
              {libraryExpiresAt && (
                <> jusqu&apos;au {new Date(libraryExpiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</>
              )}
              .
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => {
          const isOwned = hasLibraryAccess || ownedGuides.includes(guide.type);
          const ownedVia = hasLibraryAccess && !ownedGuides.includes(guide.type) ? 'library' : 'individual';

          return (
            <div
              key={guide.type}
              className={`rounded-2xl border bg-card p-5 shadow-card-rest transition-colors ${
                isOwned ? 'border-border/60' : 'border-border/60 opacity-70'
              }`}
            >
              <div className="mb-3 flex items-start justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isOwned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
                  aria-hidden="true"
                >
                  <FileText className="h-5 w-5" />
                </span>
                {isOwned ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3 w-3" aria-hidden="true" />
                    {ownedVia === 'library' ? 'Inclus pack' : 'Acheté'}
                  </span>
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </div>

              <h2 className="mb-1 text-[14px] font-semibold text-ink">{guide.name}</h2>
              <p className="mb-4 text-[12.5px] leading-relaxed text-muted-foreground">{guide.description}</p>

              {isOwned ? (
                <a
                  href={guideMailtoUrl(guide.name)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-[13px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Recevoir par e-mail
                </a>
              ) : (
                <Link
                  href={`/checkout/services?type=${guide.type}`}
                  className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  Acheter
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
