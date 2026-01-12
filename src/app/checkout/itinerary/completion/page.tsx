'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faSpinner,
  faEnvelope,
  faFilePdf,
  faPaperPlane,
  faUser,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

function CompletionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const redirectStatus = searchParams.get('redirect_status');
  const generationId = searchParams.get('generation_id');
  const paymentIntentId = searchParams.get('payment_intent');

  // Etats du formulaire
  const [email, setEmail] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>(['email']);
  const [isDelivering, setIsDelivering] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Pre-remplir l'email avec celui du compte
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Confirmer le paiement cote serveur (pour localhost sans webhook)
  useEffect(() => {
    const confirmPayment = async () => {
      if (redirectStatus === 'succeeded' && generationId && !paymentConfirmed) {
        setIsConfirmingPayment(true);
        try {
          const response = await fetch('/api/itinerary/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              generation_id: generationId,
              payment_intent_id: paymentIntentId,
            }),
          });
          const data = await response.json();
          if (data.success) {
            setPaymentConfirmed(true);
          } else {
            setError(data.error || 'Erreur lors de la confirmation du paiement');
          }
        } catch (err) {
          console.error('Payment confirmation error:', err);
        } finally {
          setIsConfirmingPayment(false);
        }
      }
    };
    confirmPayment();
  }, [redirectStatus, generationId, paymentIntentId, paymentConfirmed]);

  // Redirection si non connecte
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion');
    }
  }, [user, authLoading, router]);

  const toggleDeliveryMethod = (method: string) => {
    setDeliveryMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleDeliver = async () => {
    if (deliveryMethods.length === 0) {
      setError('Veuillez selectionner au moins une methode de livraison');
      return;
    }

    if (deliveryMethods.includes('email') && !email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (deliveryMethods.includes('telegram') && !telegramChatId) {
      setError('Veuillez entrer votre Chat ID Telegram');
      return;
    }

    setIsDelivering(true);
    setError(null);

    try {
      // D'abord confirmer le paiement si pas encore fait
      if (!paymentConfirmed && redirectStatus === 'succeeded') {
        const confirmResponse = await fetch('/api/itinerary/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generation_id: generationId,
            payment_intent_id: paymentIntentId,
          }),
        });
        const confirmData = await confirmResponse.json();
        if (!confirmData.success) {
          throw new Error(confirmData.error || 'Erreur lors de la confirmation du paiement');
        }
        setPaymentConfirmed(true);
      }

      // Envoyer par email si selectionne
      if (deliveryMethods.includes('email')) {
        const response = await fetch('/api/itinerary/deliver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generation_id: generationId,
            delivery_method: 'email',
            email,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Erreur lors de l\'envoi par email');
        }
      }

      // Envoyer par Telegram si selectionne
      if (deliveryMethods.includes('telegram')) {
        const response = await fetch('/api/itinerary/deliver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generation_id: generationId,
            delivery_method: 'telegram',
            telegram_chat_id: telegramChatId,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Erreur lors de l\'envoi par Telegram');
        }
      }

      // TODO: Gerer le telechargement PDF
      if (deliveryMethods.includes('pdf')) {
        // Pour l'instant, on redirige vers une page de telechargement
        // Cela necessitera une API specifique
      }

      setDelivered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsDelivering(false);
    }
  };

  if (authLoading || isConfirmingPayment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary mb-4" />
        {isConfirmingPayment && (
          <p className="text-muted-foreground">Confirmation du paiement en cours...</p>
        )}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Echec du paiement
  if (redirectStatus !== 'succeeded') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-card p-8 rounded-xl border-2 border-red-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Echec du paiement</h1>
          <p className="text-muted-foreground mb-6">
            Le paiement n&apos;a pas pu etre traite. Veuillez reessayer.
          </p>
          <Link
            href="/itineraire-personnalise-pour-les-philippines"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Reessayer
          </Link>
        </div>
      </div>
    );
  }

  // Livraison effectuee
  if (delivered) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-card p-8 rounded-xl border-2 border-green-200 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Itineraire envoye !
          </h1>
          <div className="text-muted-foreground mb-6 space-y-2">
            {deliveryMethods.includes('email') && (
              <p>Verifiez votre boite email : <strong>{email}</strong></p>
            )}
            {deliveryMethods.includes('telegram') && (
              <p>Message envoye sur Telegram</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profil"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <FontAwesomeIcon icon={faUser} />
              Voir dans mon profil
            </Link>
            <Link
              href="/itineraire-personnalise-pour-les-philippines"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-primary rounded-lg hover:bg-accent/90"
            >
              Creer un autre itineraire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire de livraison
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="bg-card p-8 rounded-xl border-2 border-green-200 shadow-lg">
        {/* Succes */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Paiement reussi !
          </h1>
          <p className="text-muted-foreground">
            Votre itineraire est pret. Choisissez comment le recevoir :
          </p>
        </div>

        {/* Options de livraison */}
        <div className="space-y-4 mb-6">
          {/* Email */}
          <div
            onClick={() => toggleDeliveryMethod('email')}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              deliveryMethods.includes('email')
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deliveryMethods.includes('email')}
                onChange={() => toggleDeliveryMethod('email')}
                className="w-5 h-5 text-primary"
              />
              <FontAwesomeIcon icon={faEnvelope} className="text-primary text-xl" />
              <span className="font-semibold">Par email</span>
            </div>
            {deliveryMethods.includes('email') && (
              <div className="mt-3 ml-8">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-2 border border-primary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Telegram */}
          <div
            onClick={() => toggleDeliveryMethod('telegram')}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              deliveryMethods.includes('telegram')
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deliveryMethods.includes('telegram')}
                onChange={() => toggleDeliveryMethod('telegram')}
                className="w-5 h-5 text-primary"
              />
              <FontAwesomeIcon icon={faTelegram} className="text-[#0088cc] text-xl" />
              <span className="font-semibold">Par Telegram</span>
              <span className="text-xs text-muted-foreground">(optionnel)</span>
            </div>
            {deliveryMethods.includes('telegram') && (
              <div className="mt-3 ml-8">
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="Votre Chat ID Telegram"
                  className="w-full px-4 py-2 border border-primary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Envoyez /start a @philippineasy_bot pour obtenir votre Chat ID
                </p>
              </div>
            )}
          </div>

          {/* PDF */}
          <div
            onClick={() => toggleDeliveryMethod('pdf')}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              deliveryMethods.includes('pdf')
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={deliveryMethods.includes('pdf')}
                onChange={() => toggleDeliveryMethod('pdf')}
                className="w-5 h-5 text-primary"
              />
              <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-xl" />
              <span className="font-semibold">Telecharger en PDF</span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Bientot</span>
            </div>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Bouton envoyer */}
        <button
          onClick={handleDeliver}
          disabled={isDelivering || deliveryMethods.length === 0}
          className="w-full py-4 bg-accent text-primary font-bold text-lg rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isDelivering ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} />
              Recevoir mon itineraire
            </>
          )}
        </button>

        {/* Lien profil */}
        <div className="mt-6 text-center">
          <Link
            href="/profil"
            className="text-primary hover:underline text-sm flex items-center justify-center gap-1"
          >
            Acceder a mon profil
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryCompletionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary" />
      </div>
    }>
      <CompletionContent />
    </Suspense>
  );
}
