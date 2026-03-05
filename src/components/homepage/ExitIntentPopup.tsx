'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faGift, faSpinner, faCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0) {
      const dismissed = sessionStorage.getItem('exit-popup-dismissed');
      const subscribed = localStorage.getItem('newsletter-subscribed');
      if (!dismissed && !subscribed) {
        setIsVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    // Delay activation to avoid triggering on page load
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('exit-popup-dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        localStorage.setItem('newsletter-subscribed', 'true');
        // Auto-trigger download of Palawan guide as bonus
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = '/lead-magnets/palawan-7-jours.pdf';
          link.download = 'palawan-7-jours.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 1000);
        setTimeout(handleClose, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setStatus('error');
      setMessage('Erreur de connexion.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4" onClick={handleClose}>
      <div
        className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl"
          aria-label="Fermer"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faGift} className="text-2xl text-accent" />
          </div>

          <h3 className="text-2xl font-bold mb-2">Attendez !</h3>
          <p className="text-muted-foreground mb-6">
            Recevez gratuitement notre guide <strong className="text-primary">"7 Jours a Palawan"</strong> avant de partir.
            Itineraire complet, budget et astuces locales.
          </p>

          {status === 'success' ? (
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <FontAwesomeIcon icon={faCheck} className="text-2xl text-green-500 mb-2" />
              <p className="font-semibold text-green-700">Telechargement en cours !</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                  disabled={status === 'loading'}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-bold text-lg hover:bg-accent/90 transition disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                ) : null}
                Recevoir le guide gratuit
              </button>
              {status === 'error' && (
                <p className="text-red-500 text-sm">{message}</p>
              )}
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            Pas de spam, desabonnement en 1 clic.
          </p>
        </div>
      </div>
    </div>
  );
};
