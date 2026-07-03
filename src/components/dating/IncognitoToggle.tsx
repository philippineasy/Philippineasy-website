'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Ghost } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { supabase } from '@/utils/supabase/client';

/**
 * Premium-only "incognito mode" toggle.
 * - Reads current state from `dating_profiles.is_incognito`.
 * - Writes via the `set_incognito` RPC (server-side guard: premium-only).
 * - Free members see the feature explained, disabled, with a CTA to Premium.
 */
const IncognitoToggle = () => {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();
  const [isIncognito, setIsIncognito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('dating_profiles')
        .select('is_incognito')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching incognito status:', error);
      } else {
        setIsIncognito(Boolean(data?.is_incognito));
      }
      setLoading(false);
    };

    if (!authLoading) {
      fetchStatus();
    }
  }, [user, authLoading]);

  const handleToggle = async () => {
    if (!isPremium || isSaving) return;

    const nextValue = !isIncognito;
    const previousValue = isIncognito;
    setIsSaving(true);
    setIsIncognito(nextValue); // optimistic update

    try {
      const { error } = await supabase.rpc('set_incognito', { p_on: nextValue });

      if (error) {
        throw error;
      }
      toast.success(nextValue ? 'Mode incognito activé.' : 'Mode incognito désactivé.');
    } catch (error) {
      console.error('Error toggling incognito mode:', error);
      setIsIncognito(previousValue);
      toast.error("Impossible de modifier le mode incognito. Réessayez.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || authLoading || premiumLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3.5">
          <span
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ background: 'linear-gradient(160deg, #6D28D9, #4C1D95)' }}
          >
            <Ghost className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Mode incognito</h3>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {isPremium
                ? 'Activé, vos visites de profils ne sont plus enregistrées : vous naviguez sans laisser de trace.'
                : 'Réservé aux membres Premium. Passez Premium pour naviguer sans laisser de trace.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isIncognito}
          aria-label="Activer le mode incognito"
          disabled={!isPremium || isSaving}
          onClick={handleToggle}
          className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-40 ${
            isIncognito ? 'bg-primary' : 'bg-muted-foreground/25'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
              isIncognito ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {!isPremium && (
        <Link
          href="/rencontre-philippines/premium"
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
        >
          Débloquer avec Premium
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
};

export default IncognitoToggle;
