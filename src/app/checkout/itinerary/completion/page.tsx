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
  faArrowRight,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { trackPurchase } from '@/lib/analytics';
import { metaTrackPurchase } from '@/lib/meta-pixel';

function CompletionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const redirectStatus = searchParams.get('redirect_status');
  const generationId = searchParams.get('generation_id');
  const paymentIntentId = searchParams.get('payment_intent');

  const [email, setEmail] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [deliveryEmail, setDeliveryEmail] = useState(true);
  const [deliveryTelegram, setDeliveryTelegram] = useState(false);
  const [deliveryPdf, setDeliveryPdf] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  // Auto-confirm payment and set status to 'delivered' immediately
  useEffect(() => {
    const confirmPayment = async () => {
      if (redirectStatus !== 'succeeded' || !generationId || paymentConfirmed) return;
      setIsConfirming(true);
      try {
        const res = await fetch('/api/itinerary/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ generation_id: generationId, payment_intent_id: paymentIntentId }),
        });
        const data = await res.json();
        if (data.success) {
          setPaymentConfirmed(true);
          const value = Number(data.amount) || 0;
          const currency = data.currency || 'EUR';
          trackPurchase({
            transaction_id: paymentIntentId || generationId || '',
            value,
            currency,
            items: [{ item_id: generationId || '', item_name: 'Itineraire IA', item_category: 'itinerary' }],
          });
          metaTrackPurchase({
            value,
            currency,
            content_name: 'Itineraire IA',
            content_ids: generationId ? [generationId] : undefined,
          });
        } else {
          setError(data.error || 'Erreur lors de la confirmation du paiement');
        }
      } catch {
        setError('Erreur de connexion');
      } finally {
        setIsConfirming(false);
      }
    };
    confirmPayment();
  }, [redirectStatus, generationId, paymentIntentId, paymentConfirmed]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/connexion');
  }, [user, authLoading, router]);

  const handleSendExternal = async () => {
    if (!deliveryEmail && !deliveryTelegram && !deliveryPdf) {
      setError('Selectionnez au moins une option');
      return;
    }
    if (deliveryEmail && !email) {
      setError('Entrez votre adresse email');
      return;
    }
    if (deliveryTelegram && !telegramChatId) {
      setError('Entrez votre Chat ID Telegram');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // Save delivery preferences
      const prefsRes = await fetch('/api/itinerary/delivery-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation_id: generationId,
          email,
          delivery_email: deliveryEmail,
          delivery_telegram: deliveryTelegram,
          delivery_pdf: deliveryPdf,
          telegram_chat_id: deliveryTelegram ? telegramChatId : null,
        }),
      });
      const prefsData = await prefsRes.json();
      if (!prefsData.success) throw new Error(prefsData.error || 'Erreur sauvegarde preferences');

      // Trigger external delivery via n8n
      if (deliveryEmail || deliveryTelegram) {
        const deliverRes = await fetch('/api/itinerary/deliver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generation_id: generationId,
            delivery_email: deliveryEmail,
            delivery_telegram: deliveryTelegram,
            email: deliveryEmail ? email : null,
            telegram_chat_id: deliveryTelegram ? telegramChatId : null,
          }),
        });
        const deliverData = await deliverRes.json();
        if (!deliverData.success) throw new Error(deliverData.error || 'Erreur envoi');
      }

      // PDF download
      if (deliveryPdf) {
        window.open(`/api/itinerary/pdf/${generationId}`, '_blank');
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading || isConfirming) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary mb-4" />
        <p className="text-muted-foreground">
          {isConfirming ? 'Confirmation du paiement...' : 'Chargement...'}
        </p>
      </div>
    );
  }

  if (!user) return null;

  // Payment failed
  if (redirectStatus !== 'succeeded') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-card p-8 rounded-2xl border border-destructive/20 shadow-lg text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-destructive text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-destructive mb-4">Echec du paiement</h1>
          <p className="text-muted-foreground mb-6">Le paiement n&apos;a pas pu etre traite.</p>
          <Link href="/itineraire-personnalise-pour-les-philippines" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Reessayer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      {/* Main CTA: Itinerary is ready in profile */}
      <div className="bg-card p-8 rounded-2xl border border-border shadow-lg text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Votre itineraire est pret !
        </h1>
        <p className="text-muted-foreground mb-6">
          Il est disponible dans votre espace personnel. Bon voyage aux Philippines !
        </p>
        <Link
          href={`/itineraire/${generationId}`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
        >
          Voir mon itineraire
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>

      {/* Optional external delivery */}
      {!sent ? (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h2 className="font-bold text-foreground mb-1">Recevoir aussi par...</h2>
          <p className="text-sm text-muted-foreground mb-4">Optionnel — votre itineraire est deja accessible dans votre profil</p>

          <div className="space-y-3 mb-6">
            {/* Email */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${deliveryEmail ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
              <input type="checkbox" checked={deliveryEmail} onChange={() => setDeliveryEmail(!deliveryEmail)} className="mt-1 w-4 h-4 accent-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary w-4 h-4" />
                  <span className="font-medium text-sm">Par email</span>
                </div>
                {deliveryEmail && (
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com"
                    className="mt-2 w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                )}
              </div>
            </label>

            {/* Telegram */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${deliveryTelegram ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
              <input type="checkbox" checked={deliveryTelegram} onChange={() => setDeliveryTelegram(!deliveryTelegram)} className="mt-1 w-4 h-4 accent-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faTelegram} className="text-[#0088cc] w-4 h-4" />
                  <span className="font-medium text-sm">Par Telegram</span>
                </div>
                {deliveryTelegram && (
                  <div className="mt-2">
                    <input type="text" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} placeholder="Votre Chat ID Telegram"
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <p className="text-xs text-muted-foreground mt-1">Envoyez /start a @philippineasy_bot pour obtenir votre Chat ID</p>
                  </div>
                )}
              </div>
            </label>

            {/* PDF */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${deliveryPdf ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
              <input type="checkbox" checked={deliveryPdf} onChange={() => setDeliveryPdf(!deliveryPdf)} className="mt-1 w-4 h-4 accent-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFilePdf} className="text-red-500 w-4 h-4" />
                  <span className="font-medium text-sm">Telecharger en PDF</span>
                </div>
              </div>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mb-4">{error}</div>
          )}

          {(deliveryEmail || deliveryTelegram || deliveryPdf) && (
            <button onClick={handleSendExternal} disabled={isSending}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {isSending ? (
                <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Envoi en cours...</>
              ) : (
                <><FontAwesomeIcon icon={faPaperPlane} /> Envoyer</>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-card p-6 rounded-2xl border border-green-200 shadow-sm text-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl mb-2" />
          <p className="text-foreground font-medium">Envoye avec succes !</p>
          {deliveryEmail && <p className="text-sm text-muted-foreground">Email envoye a {email}</p>}
          {deliveryTelegram && <p className="text-sm text-muted-foreground">Message Telegram envoye</p>}
          {deliveryPdf && <p className="text-sm text-muted-foreground">PDF telecharge</p>}
        </div>
      )}
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
