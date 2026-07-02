'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

/**
 * Bouton clair/sombre. L'icône est gérée en pur CSS (dark:) pour éviter tout
 * mismatch d'hydratation : lune visible en clair, soleil visible en sombre.
 * La classe `dark` est posée avant hydratation par le script inline du layout.
 */
export const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const toggle = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      /* stockage indisponible (navigation privée) : le toggle reste fonctionnel pour la session */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Basculer entre thème clair et sombre"
      className={`inline-flex w-11 h-11 items-center justify-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      <FontAwesomeIcon icon={faMoon} className="text-[16px] dark:hidden" />
      <FontAwesomeIcon icon={faSun} className="text-[16px] hidden dark:inline-block" />
    </button>
  );
};
