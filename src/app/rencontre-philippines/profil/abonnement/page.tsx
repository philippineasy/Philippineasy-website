'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/usePremium';
import { getSubscription, cancelSubscription } from '../actions';
import toast from 'react-hot-toast';
import ComparisonTable from '@/components/dating/ComparisonTable';

const AbonnementPage = () => {
  const { user } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremium();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchSubscription = async () => {
        const sub = await getSubscription();
        if (sub) {
          setSubscription(sub);
        }
        setLoading(false);
      };
      fetchSubscription();
    }
  }, [user]);

  const handleCancel = async () => {
    if (!subscription) return;
    if (!confirm('Êtes-vous sûr de vouloir résilier votre abonnement ? Il restera actif jusqu\'à la fin de la période en cours.')) return;
    
    setIsCancelling(true);
    const result = await cancelSubscription(subscription.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Votre abonnement a été résilié et ne sera pas renouvelé.');
      // Refresh subscription data
      const sub = await getSubscription();
      setSubscription(sub);
    }
    setIsCancelling(false);
  };

  if (loading || premiumLoading) {
    return <div className="p-12 text-center text-muted-foreground">Chargement de votre abonnement…</div>;
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="mb-8">
          <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Rencontre Premium
          </span>
          <h1 className="mt-2 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] text-foreground">
            Gérer mon abonnement
          </h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {subscription ? (
            <div className="space-y-5">
              <dl className="divide-y divide-border">
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm font-medium text-muted-foreground">Plan actuel</dt>
                  <dd className="text-[15px] font-semibold capitalize text-foreground">{subscription.items.data[0].plan.nickname}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm font-medium text-muted-foreground">Statut</dt>
                  <dd>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${subscription.status === 'active' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent-strong'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${subscription.status === 'active' ? 'bg-success' : 'bg-accent'}`} />
                      {subscription.status === 'active' ? 'Actif' : 'En cours'}
                    </span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm font-medium text-muted-foreground">Prochain renouvellement</dt>
                  <dd className="text-[15px] font-semibold tabular-nums text-foreground">{new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR')}</dd>
                </div>
              </dl>

              {subscription.cancel_at_period_end ? (
                <div className="rounded-xl border-l-4 border-accent bg-accent/10 p-4">
                  <p className="font-semibold text-accent-strong">Résiliation programmée</p>
                  <p className="mt-1 text-sm text-foreground">Votre abonnement prendra fin le {new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR')}.</p>
                </div>
              ) : (
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 px-6 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isCancelling ? 'Résiliation…' : "Résilier l'abonnement"}
                </button>
              )}
            </div>
          ) : isPremium ? (
            <div className="rounded-xl border-l-4 border-primary bg-primary/10 p-4">
              <p className="font-semibold text-primary">Vous bénéficiez d&apos;un accès Premium.</p>
              <p className="mt-1 text-sm text-foreground">Cet accès a été accordé manuellement et ne nécessite pas de gestion.</p>
            </div>
          ) : (
            <p className="text-[15px] text-muted-foreground">Vous n&apos;avez pas d&apos;abonnement actif.</p>
          )}

          <div className="mt-8 border-t border-border pt-8">
            <ComparisonTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbonnementPage;
