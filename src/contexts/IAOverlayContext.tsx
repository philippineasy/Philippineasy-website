'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type IAOverlayState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const IAOverlayContext = createContext<IAOverlayState | null>(null);

export function IAOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // ESC key closes the overlay
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // Prevent body scroll while open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  const value = useMemo<IAOverlayState>(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <IAOverlayContext.Provider value={value}>{children}</IAOverlayContext.Provider>;
}

export function useIAOverlay(): IAOverlayState {
  const ctx = useContext(IAOverlayContext);
  if (!ctx) throw new Error('useIAOverlay must be used within IAOverlayProvider');
  return ctx;
}
