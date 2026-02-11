'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faFileDownload, faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

const GUIDES = [
  {
    type: 'guide_pdf_visa',
    name: 'Guide Visa Philippines 2026',
    description: 'Tout savoir sur les visas : touriste, business, retraite, SRRV, 13(a)...',
    downloadUrl: '/guides/visa-philippines-2026.pdf',
  },
  {
    type: 'guide_pdf_cout_vie',
    name: 'Guide Coût de la Vie',
    description: 'Budget détaillé : logement, nourriture, transport, santé, loisirs...',
    downloadUrl: '/guides/cout-vie-philippines.pdf',
  },
  {
    type: 'guide_pdf_destinations',
    name: 'Guide Destinations Secrètes',
    description: 'Îles et spots méconnus des touristes, testés par notre équipe',
    downloadUrl: '/guides/destinations-secretes-philippines.pdf',
  },
];

export default function MesGuidesPage() {
  const { user } = useAuth();
  const [ownedGuides, setOwnedGuides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchGuides();
  }, [user]);

  const fetchGuides = async () => {
    setLoading(true);

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => {
          const isOwned = ownedGuides.includes(guide.type);

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
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <FontAwesomeIcon icon={faCheck} />
                    Acheté
                  </span>
                ) : (
                  <FontAwesomeIcon icon={faLock} className="text-muted-foreground" />
                )}
              </div>

              <h3 className="font-semibold text-sm mb-1">{guide.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{guide.description}</p>

              {isOwned ? (
                <a
                  href={guide.downloadUrl}
                  download
                  className="block w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-center text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <FontAwesomeIcon icon={faFileDownload} className="mr-1.5" />
                  Télécharger
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
