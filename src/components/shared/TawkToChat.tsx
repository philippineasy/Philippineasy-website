'use client';

import { useEffect } from 'react';

/**
 * Tawk.to live chat — chargé en LAZY pour ne pas plomber le LCP/TBT.
 *
 * Stratégie : on attend la première interaction utilisateur (scroll, click,
 * mousemove, touchstart) OU 5s d'idle, puis on charge le script Tawk.
 *
 * Pourquoi : audit PageSpeed (2026-05-05) a montré que le chargement immédiat
 * du script Tawk dans useEffect contribuait au TBT (380ms) et générait une
 * erreur console CORS au load. Lazy = chat dispo pour les vrais users sans
 * pénaliser le LCP/TBT mesuré par Google CrUX.
 */
const TawkToChat = () => {
  useEffect(() => {
    let loaded = false;
    const loadTawk = () => {
      if (loaded) return;
      loaded = true;
      const s1 = document.createElement('script');
      const s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/68898021711618192cf5c36b/1j1chp1lr';
      s1.charset = 'UTF-8';
      s1.crossOrigin = 'anonymous';
      s0.parentNode?.insertBefore(s1, s0);

      // Cleanup listeners
      events.forEach((ev) => window.removeEventListener(ev, loadTawk));
      if (idleTimer) clearTimeout(idleTimer);
    };

    const events = ['scroll', 'click', 'mousemove', 'touchstart', 'keydown'];
    events.forEach((ev) =>
      window.addEventListener(ev, loadTawk, { once: true, passive: true })
    );

    // Fallback : si pas d'interaction après 5s, charge en idle pour que le chat
    // soit dispo dès qu'un user en a besoin (sans bloquer le LCP).
    const idleTimer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadTawk);
      } else {
        loadTawk();
      }
    }, 5000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, loadTawk));
      clearTimeout(idleTimer);
    };
  }, []);

  return null;
};

export default TawkToChat;
