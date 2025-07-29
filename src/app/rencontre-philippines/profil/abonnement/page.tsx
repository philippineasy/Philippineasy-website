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
    return <div className="text-center p-12">Chargement de votre abonnement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gérer mon Abonnement</h1>
        {subscription ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Plan Actuel</h2>
              <p className="text-gray-600 capitalize">{subscription.items.data[0].plan.nickname}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Statut</h2>
              <p className={`capitalize font-medium ${subscription.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                {subscription.status === 'active' ? 'Actif' : 'En cours'}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Prochain renouvellement</h2>
              <p className="text-gray-600">{new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR')}</p>
            </div>
            {subscription.cancel_at_period_end ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-lg">
                <p className="font-bold">Résilisation programmée</p>
                <p>Votre abonnement prendra fin le {new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR')}.</p>
              </div>
            ) : (
              <button 
                onClick={handleCancel}
                disabled={isCancelling}
                className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {isCancelling ? 'Résiliation...' : 'Résilier l\'abonnement'}
              </button>
            )}
          </div>
        ) : isPremium ? (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r-lg">
            <p className="font-bold">Vous bénéficiez d'un accès Premium.</p>
            <p>Cet accès a été accordé manuellement et ne nécessite pas de gestion.</p>
          </div>
        ) : (
          <p>Vous n'avez pas d'abonnement actif.</p>
        )}
        <ComparisonTable />
      </div>
    </div>
  );
};

export default AbonnementPage;
