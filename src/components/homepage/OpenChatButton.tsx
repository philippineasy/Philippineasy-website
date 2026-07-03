'use client';

// Petit composant client isolé pour garder FinalCtaSection en Server Component.
// Tawk.to est chargé en lazy (cf. TawkToChat.tsx) : window.Tawk_API n'est
// disponible qu'après la première interaction utilisateur ou un délai idle. Si
// le widget n'est pas encore prêt au clic, on force son chargement puis on
// l'ouvre dès qu'il l'est ; en dernier recours, on retombe sur /contact plutôt
// que de laisser le bouton mort.
declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
      onLoad?: () => void;
    };
  }
}

function openTawkChat() {
  if (typeof window === 'undefined') return;

  if (window.Tawk_API?.maximize) {
    window.Tawk_API.maximize();
    return;
  }

  if (window.Tawk_API) {
    // Widget en cours de chargement : ouvre-le dès qu'il est prêt.
    const previousOnLoad = window.Tawk_API.onLoad;
    window.Tawk_API.onLoad = () => {
      previousOnLoad?.();
      window.Tawk_API?.maximize?.();
    };
    return;
  }

  // Tawk pas encore initialisé (interaction n'a pas encore déclenché le lazy
  // load, cf. TawkToChat.tsx) : on retombe sur la page de contact.
  window.location.href = '/contact';
}

export const OpenChatButton = () => {
  return (
    <button
      type="button"
      onClick={openTawkChat}
      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-medium text-base text-white transition-all duration-200 hover:bg-white/15"
      style={{
        backgroundColor: 'transparent',
        border: '1px solid rgba(255,255,255,0.5)',
      }}
    >
      Discuter avec l&apos;équipe
    </button>
  );
};
