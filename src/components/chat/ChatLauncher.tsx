'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Panel chargé UNIQUEMENT à l'ouverture (dynamic import) : le launcher ne pèse
// que quelques Ko dans le bundle commun — zéro impact LCP/TBT, contrairement
// à l'ancien widget Tawk.to (script + iframe tiers).
const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });

export const CHAT_STORAGE_KEYS = {
  visitorKey: 'pe_chat_key',
  conversationId: 'pe_chat_conv',
  lastSeenAt: 'pe_chat_seen',
} as const;

export function getVisitorKey(): string {
  let key = localStorage.getItem(CHAT_STORAGE_KEYS.visitorKey);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(CHAT_STORAGE_KEYS.visitorKey, key);
  }
  return key;
}

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // panel monté au moins une fois
  const [unread, setUnread] = useState(false);
  const checkedRef = useRef(false);

  const openChat = useCallback(() => {
    setMounted(true);
    setOpen(true);
    setUnread(false);
  }, []);

  // Le bouton "Discuter avec l'équipe" (et tout autre CTA) ouvre le chat via
  // cet événement — remplace window.Tawk_API.maximize().
  useEffect(() => {
    const handler = () => openChat();
    window.addEventListener('pe:open-chat', handler);
    return () => window.removeEventListener('pe:open-chat', handler);
  }, [openChat]);

  // Reprise de conversation : si le visiteur a un fil en cours, UN SEUL fetch
  // différé (idle) vérifie s'il a reçu une réponse depuis sa dernière visite.
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    const conversationId = localStorage.getItem(CHAT_STORAGE_KEYS.conversationId);
    if (!conversationId) return;

    const check = async () => {
      try {
        const visitorKey = getVisitorKey();
        const seen = localStorage.getItem(CHAT_STORAGE_KEYS.lastSeenAt);
        const params = new URLSearchParams({ visitorKey, conversationId });
        if (seen) params.set('after', seen);
        const res = await fetch(`/api/chat/messages?${params}`);
        if (!res.ok) return;
        const json = await res.json();
        const hasReply = (json.messages ?? []).some(
          (m: { sender: string }) => m.sender !== 'visitor'
        );
        if (hasReply) setUnread(true);
      } catch {
        // silencieux — simple indicateur de confort
      }
    };

    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(check);
      } else {
        check();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {mounted && (
        <ChatPanel open={open} onClose={() => setOpen(false)} />
      )}

      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le chat — une question ?'}
        className={`fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          open ? 'max-sm:hidden' : ''
        }`}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3C7.03 3 3 6.58 3 11c0 2.04.86 3.9 2.28 5.32-.15 1.12-.62 2.36-1.53 3.35-.18.2-.04.52.23.5 1.83-.13 3.32-.8 4.4-1.5.99.34 2.07.53 3.2.53 4.97 0 9-3.58 9-8s-4.03-8-8.58-8Z" />
          </svg>
        )}
        {unread && !open && (
          <span
            className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-red-500"
            aria-hidden="true"
          />
        )}
      </button>
    </>
  );
}
