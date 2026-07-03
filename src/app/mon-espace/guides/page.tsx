'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faFileDownload, faCheck, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

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
        <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Guides PDF</h1>

      {hasLibraryAccess && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
          <FontAwesomeIcon icon={faCheck} className="text-amber-600 dark:text-amber-400 text-xl" />
          <div className="flex-1">
            <div className="font-semibold text-sm">Bibliothèque PDF complète activée</div>
            <div className="text-xs text-muted-foreground">
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
              className={`bg-card border rounded-xl p-5 ${
                isOwned ? 'border-primary/30' : 'border-border opacity-70'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <FontAwesomeIcon
                  icon={faFileDownload}
                  className={`text-2xl ${isOwned ? 'text-primary' : 'text-muted-foreground'}`}
                />
                {isOwned ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <FontAwesomeIcon icon={faCheck} />
                    {ownedVia === 'library' ? 'Inclus pack' : 'Acheté'}
                  </span>
                ) : (
                  <FontAwesomeIcon icon={faLock} className="text-muted-foreground" />
                )}
              </div>

              <h3 className="font-semibold text-sm mb-1">{guide.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{guide.description}</p>

              {isOwned ? (
                <a
                  href={guideMailtoUrl(guide.name)}
                  className="block w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-center text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-1.5" />
                  Recevoir par e-mail
                </a>
              ) : (
                <Link
                  href={`/checkout/services?type=${guide.type}`}
                  className="block w-full py-2.5 bg-muted text-foreground rounded-lg text-center text-sm font-medium hover:bg-muted/80 transition-colors"
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
