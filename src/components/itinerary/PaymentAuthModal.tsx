'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faMagic,
  faSpinner,
  faCheckCircle,
  faEnvelope,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/utils/supabase/client';
import { modalOverlay, modalContent, scaleIn } from './animations';
import type { OfferType } from '@/config/itinerary-pricing';

interface PaymentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Email pré-rempli depuis le formulaire de préférences */
  email: string;
  generationId: string;
  offer: OfferType;
  /** Variant choisi (relax/balanced/adventure) — sera transmis au resume_payment */
  variant: string;
}

// Regex simple pour valider un email côté client
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PaymentAuthModal({
  isOpen,
  onClose,
  email: initialEmail,
  generationId,
  offer,
  variant,
}: PaymentAuthModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Cooldown anti-spam : empeche de re-cliquer le bouton avant N secondes
  // pour ne pas declencher le rate limit Supabase ni floodder l'inbox du user
  const [cooldownSec, setCooldownSec] = useState(0);

  // Decrement cooldown timer
  useEffect(() => {
    if (cooldownSec <= 0) return;
    const t = setTimeout(() => setCooldownSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldownSec]);

  // URL de retour après clic sur le magic link :
  // On route via /auth/callback?next=<URL encodee> pour preserver les query
  // params (resume_payment + offer). Sinon Supabase magic link redirige direct
  // vers emailRedirectTo et strippe nos params (bug observe en prod 2026-05-03).
  const buildRedirectUrl = (): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const targetParams = new URLSearchParams({
      resume_payment: generationId,
      offer,
      variant,
    });
    const targetUrl = `/itineraire-personnalise-pour-les-philippines?${targetParams.toString()}`;
    return `${origin}/auth/callback?next=${encodeURIComponent(targetUrl)}`;
  };

  const handleMagicLink = async () => {
    if (cooldownSec > 0) return; // Anti-spam : bouton inactif pendant cooldown
    if (!email || !EMAIL_RE.test(email)) {
      setError('Veuillez saisir un email valide.');
      return;
    }
    setError(null);
    setIsSending(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: buildRedirectUrl(),
          shouldCreateUser: true,
        },
      });

      if (otpError) {
        throw otpError;
      }

      // Tracker GA4 — magic link envoyé
      if (typeof window !== 'undefined' && (window as { gtag?: (...a: unknown[]) => void }).gtag) {
        (window as { gtag: (...a: unknown[]) => void }).gtag('event', 'magic_link_sent', {
          generation_id: generationId,
          offer,
        });
      }

      setIsSent(true);
      setCooldownSec(60); // 60s cooldown si le user veut renvoyer
    } catch (err) {
      // Detection du rate limit Supabase pour message user-friendly
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('rate limit') || lowerMsg.includes('over_email_send_rate_limit')) {
        setError(
          'Vous avez deja demande un lien recemment. Verifiez votre boite mail (et les spams). Si rien recu, reessayez dans quelques minutes.'
        );
        setCooldownSec(120); // Cooldown long apres rate limit
      } else if (lowerMsg.includes('email') && lowerMsg.includes('invalid')) {
        setError('Cet email n\'est pas valide. Verifiez l\'orthographe.');
      } else {
        setError(message);
      }
    } finally {
      setIsSending(false);
    }
  };

  // URL de redirection vers la page de connexion classique
  const loginUrl = `/connexion?redirect=${encodeURIComponent(
    `/itineraire-personnalise-pour-les-philippines?resume_payment=${generationId}&offer=${offer}&variant=${variant}`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            variants={modalOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Contenu de la modal */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-auth-title"
            className="relative bg-card rounded-2xl shadow-xl max-w-md w-full border border-border/50 overflow-hidden"
          >
            {/* Bouton fermeture */}
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-xl transition-colors z-10"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-muted-foreground" />
            </button>

            {isSent ? (
              /* --- État succès --- */
              <div className="p-8 text-center">
                <motion.div
                  variants={scaleIn}
                  initial="initial"
                  animate="animate"
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-3xl" />
                </motion.div>
                <h3 id="payment-auth-title" className="text-lg font-semibold text-foreground mb-2">
                  Vérifiez votre email !
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nous avons envoyé un lien de connexion à{' '}
                  <strong className="text-foreground">{email}</strong>.<br />
                  Cliquez dessus pour finaliser votre paiement.
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  Vérifiez également vos spams si vous ne le voyez pas.
                </p>
              </div>
            ) : (
              /* --- Formulaire --- */
              <div className="p-6">
                {/* Header */}
                <div className="mb-6 pr-8">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                    <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                  </div>
                  <h2 id="payment-auth-title" className="text-xl font-bold text-foreground">
                    Presque fini !
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Connectez-vous pour finaliser votre paiement et recevoir votre itinéraire
                    directement dans votre espace personnel.
                  </p>
                </div>

                {/* Séparateur */}
                <div className="h-px bg-border mb-5" />

                {/* Champ email */}
                <div className="mb-4">
                  <label
                    htmlFor="payment-auth-email"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Votre email
                  </label>
                  <input
                    id="payment-auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    autoComplete="email"
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-muted/50 hover:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-sm"
                    placeholder="votre@email.com"
                    disabled={isSending}
                  />
                </div>

                {/* Message d'erreur */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-xs mb-4 bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20"
                  >
                    {error}
                  </motion.p>
                )}

                {/* CTA principal — magic link */}
                <Button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={isSending || cooldownSec > 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold"
                >
                  {isSending ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : cooldownSec > 0 ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="mr-2 opacity-50" />
                      Renvoyer dans {cooldownSec}s
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faMagic} className="mr-2" />
                      M&apos;envoyer le lien de connexion
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Un lien magique sécurisé — pas de mot de passe requis.
                </p>

                {/* Séparateur */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Lien secondaire — connexion classique */}
                <a
                  href={loginUrl}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="text-sm" />
                  Connexion avec mot de passe
                </a>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
