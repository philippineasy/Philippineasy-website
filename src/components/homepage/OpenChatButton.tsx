'use client';

// Petit composant client isolé pour garder FinalCtaSection en Server Component.
// Ouvre le chat maison : ChatLauncher (monté dans le root layout) écoute
// l'événement pe:open-chat et charge le panel en lazy au moment du clic.

export const OpenChatButton = () => {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('pe:open-chat'))}
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
