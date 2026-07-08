'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { CheckCircle2, Loader2, Mail, FileText, Send, ArrowRight, TriangleAlert } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  // offer_type recupere du backend (api/itinerary/confirm-payment) pour adapter
  // les options de delivery — PDF reserve a Premium/Conciergerie (cf. OFFER_LABELS)
  const [offerType, setOfferType] = useState<'express' | 'premium' | 'conciergerie' | null>(null);
  const hasPdfAccess = offerType === 'premium' || offerType === 'conciergerie';

  // Previews-first : l'itinéraire COMPLET est généré après le paiement
  // (1-3 min). On poll finalize_status jusqu'à ready/failed.
  const [finalizeStatus, setFinalizeStatus] = useState<'pending' | 'ready' | 'failed' | 'timeout'>('pending');
  const [finalizeElapsed, setFinalizeElapsed] = useState(0);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  // ── Polling de la finalisation (démarre une fois le paiement confirmé) ────
  useEffect(() => {
    if (!paymentConfirmed || !generationId || finalizeStatus !== 'pending') return;

    // Filet : déclenche la finalisation si le webhook ne l'a pas déjà fait.
    // Idempotent côté serveur (claim atomique) — pas besoin d'attendre la réponse.
    fetch('/api/itinerary/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generation_id: generationId }),
    }).catch(() => { /* le polling + cron rattrapent */ });

    const startedAt = Date.now();
    const MAX_WAIT_MS = 5 * 60 * 1000;
    const interval = setInterval(async () => {
      setFinalizeElapsed(Math.round((Date.now() - startedAt) / 1000));
      try {
        const res = await fetch(`/api/itinerary/generation/${generationId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.finalize_status === 'ready') {
            setFinalizeStatus('ready');
            clearInterval(interval);
            return;
          }
          if (data.finalize_status === 'failed') {
            setFinalizeStatus('failed');
            clearInterval(interval);
            return;
          }
        }
      } catch { /* erreur réseau transitoire : on continue de poller */ }
      if (Date.now() - startedAt > MAX_WAIT_MS) {
        setFinalizeStatus('timeout');
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [paymentConfirmed, generationId, finalizeStatus]);

  const retryFinalize = () => {
    setFinalizeStatus('pending');
    setFinalizeElapsed(0);
  };

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
          if (data.offer_type) setOfferType(data.offer_type);
          // L'aperçu persisté sur la landing n'a plus d'utilité une fois payé
          try { localStorage.removeItem('phe_itinerary_previews_v1'); } catch { /* noop */ }
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
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        <p className="text-muted-foreground">
          {isConfirming ? 'Confirmation du paiement…' : 'Chargement…'}
        </p>
      </div>
    );
  }

  if (!user) return null;

  // Payment failed
  if (redirectStatus !== 'succeeded') {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-destructive/20 bg-card p-8 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert className="h-7 w-7 text-destructive" aria-hidden="true" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-destructive">Échec du paiement</h1>
          <p className="mb-6 text-muted-foreground">Le paiement n&apos;a pas pu être traité.</p>
          <Link
            href="/itineraire-personnalise-pour-les-philippines"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Réessayer
          </Link>
        </div>
      </div>
    );
  }

  // ── Paiement OK, itinéraire complet en cours de rédaction ──────────────────
  if (finalizeStatus !== 'ready') {
    const stageLabel = finalizeElapsed < 20
      ? 'Rédaction de votre itinéraire jour par jour…'
      : finalizeElapsed < 50
        ? 'Vérification de la cohérence avec votre aperçu…'
        : finalizeElapsed < 90
          ? 'Ajout des liens Google Maps et des coordonnées…'
          : 'Dernières finitions, merci de patienter…';

    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-card">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--success)/0.15)]">
            <CheckCircle2 className="h-9 w-9 text-[hsl(var(--success))]" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-ink">
            Paiement confirmé !
          </h1>

          {finalizeStatus === 'pending' && (
            <>
              <p className="mb-1 text-muted-foreground">
                Votre itinéraire complet est en cours de rédaction — comptez 1 à 2 minutes.
              </p>
              <p aria-live="polite" className="mb-6 text-[14px] font-medium text-primary">
                {stageLabel}
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
              </div>
              <p className="mt-6 text-[13px] text-muted-foreground">
                Vous pouvez fermer cette page : l&apos;itinéraire vous sera aussi envoyé par email dès qu&apos;il est prêt.
              </p>
            </>
          )}

          {(finalizeStatus === 'failed' || finalizeStatus === 'timeout') && (
            <>
              <p className="mb-6 text-muted-foreground">
                {finalizeStatus === 'failed'
                  ? 'La rédaction a rencontré un souci — relancez-la, votre paiement est bien enregistré.'
                  : 'La rédaction prend plus de temps que prévu. Vous recevrez votre itinéraire par email dès qu\'il est prêt — ou relancez maintenant.'}
              </p>
              <button
                onClick={retryFinalize}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-[16px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Relancer la rédaction
              </button>
              <p className="mt-4 text-[13px] text-muted-foreground">
                Besoin d&apos;aide ? Répondez simplement à l&apos;email de confirmation de paiement.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      {/* Main CTA: Itinerary is ready in profile */}
      <div className="mb-8 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-card">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--success)/0.15)]">
          <CheckCircle2 className="h-9 w-9 text-[hsl(var(--success))]" aria-hidden="true" />
        </div>
        <h1 className="mb-2 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-ink">
          Votre itinéraire est prêt !
        </h1>
        <p className="mb-6 text-muted-foreground">
          Il est disponible dans votre espace personnel. Bon voyage aux Philippines !
        </p>
        <Link
          href={`/itineraire/${generationId}?welcome=true`}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-[16px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Voir mon itinéraire
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Optional external delivery */}
      {!sent ? (
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card-rest">
          <h2 className="mb-1 text-[16px] font-bold text-ink">Recevoir aussi par…</h2>
          <p className="mb-4 text-[13px] text-muted-foreground">Optionnel — votre itinéraire est déjà accessible dans votre profil</p>

          <div className="mb-6 space-y-3">
            {/* Email */}
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${deliveryEmail ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/30'}`}>
              <input type="checkbox" checked={deliveryEmail} onChange={() => setDeliveryEmail(!deliveryEmail)} className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-[14px] font-medium text-foreground">Par email</span>
                </div>
                {deliveryEmail && (
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com"
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-primary" />
                )}
              </div>
            </label>

            {/* Telegram */}
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${deliveryTelegram ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/30'}`}>
              <input type="checkbox" checked={deliveryTelegram} onChange={() => setDeliveryTelegram(!deliveryTelegram)} className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faTelegram} className="w-4 text-[#0088cc]" />
                  <span className="text-[14px] font-medium text-foreground">Par Telegram</span>
                </div>
                {deliveryTelegram && (
                  <div className="mt-2">
                    <input type="text" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} placeholder="Votre Chat ID Telegram"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-primary" />
                    <p className="mt-1 text-[12px] text-muted-foreground">Envoyez /start à @philippineasy_bot pour obtenir votre Chat ID</p>
                  </div>
                )}
              </div>
            </label>

            {/* PDF — reserve aux offres Premium et Conciergerie */}
            {hasPdfAccess ? (
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${deliveryPdf ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/30'}`}>
                <input type="checkbox" checked={deliveryPdf} onChange={() => setDeliveryPdf(!deliveryPdf)} className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" aria-hidden="true" />
                    <span className="text-[14px] font-medium text-foreground">Télécharger en PDF</span>
                  </div>
                </div>
              </label>
            ) : offerType === 'express' ? (
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-border/60 bg-muted/30 p-3">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-muted-foreground">PDF professionnel</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    Disponible avec les offres Premium et Conciergerie
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-[14px] text-destructive">{error}</div>
          )}

          {(deliveryEmail || deliveryTelegram || deliveryPdf) && (
            <button onClick={handleSendExternal} disabled={isSending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50">
              {isSending ? (
                <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Envoi en cours…</>
              ) : (
                <><Send className="h-4 w-4" aria-hidden="true" /> Envoyer</>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-[hsl(var(--success)/0.3)] bg-card p-6 text-center shadow-card-rest">
          <CheckCircle2 className="mx-auto mb-2 h-7 w-7 text-[hsl(var(--success))]" aria-hidden="true" />
          <p className="text-[15px] font-medium text-foreground">Envoyé avec succès !</p>
          {deliveryEmail && <p className="text-[13px] text-muted-foreground">Email envoyé à {email}</p>}
          {deliveryTelegram && <p className="text-[13px] text-muted-foreground">Message Telegram envoyé</p>}
          {deliveryPdf && <p className="text-[13px] text-muted-foreground">PDF téléchargé</p>}
        </div>
      )}
    </div>
  );
}

export default function ItineraryCompletionPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
      </div>
    }>
      <CompletionContent />
    </Suspense>
  );
}
