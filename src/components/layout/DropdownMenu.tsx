'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface SubMenuItem {
  href: string;
  label: string;
  highlight?: boolean;
  /** Intitulé de groupe non cliquable (ex. « Destinations », « Guides pratiques ») */
  heading?: boolean;
}

interface DropdownMenuProps {
  label: string;
  items: SubMenuItem[];
  isActive: boolean;
}

export const DropdownMenu = ({ label, items, isActive }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const baseClasses = "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none";
  const activeClasses = "bg-primary/10 text-primary font-bold";
  const defaultClasses = "text-foreground hover:text-primary hover:bg-primary/10";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`${baseClasses} ${isActive ? activeClasses : defaultClasses}`}
      >
        <span>{label}</span>
        <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5 text-accent/80" />
      </button>

      {/* Toujours rendu dans le DOM (liens crawlables par Googlebot), masqué
          visuellement via CSS tant que le menu n'est pas ouvert. Le démontage
          conditionnel précédent ({isOpen && ...}) rendait toute la navigation
          invisible au crawl → pages "Détectée, jamais crawlée" dans GSC. */}
      <div
        role="menu"
        aria-hidden={!isOpen}
        className={`absolute left-0 mt-2 w-64 bg-card rounded-md shadow-lg border border-border z-20 transition-all duration-150 motion-reduce:transition-none ${
          isOpen
            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
            : 'opacity-0 invisible -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="py-1">
          {items.map((item) =>
            item.heading ? (
              <p
                key={`heading-${item.label}`}
                role="presentation"
                className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-[0.06em] font-semibold text-muted-foreground select-none"
              >
                {item.label}
              </p>
            ) : (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                tabIndex={isOpen ? undefined : -1}
                className={`block px-4 py-2 text-sm hover:bg-muted ${item.highlight ? 'text-red-500 font-bold' : 'text-foreground'}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};
