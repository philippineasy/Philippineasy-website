'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface SubMenuItem {
  href: string;
  label: string;
  highlight?: boolean;
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

  const baseClasses = "px-3 py-2 lg:px-4 rounded-lg transition duration-300 flex items-center space-x-2";
  const activeClasses = "font-bold text-primary bg-primary/10";
  const defaultClasses = "text-foreground hover:text-primary hover:bg-primary/10";

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`${baseClasses} ${isActive ? activeClasses : defaultClasses}`}
      >
        <span>{label}</span>
        <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-accent" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-card rounded-md shadow-lg border z-20">
          <div className="py-1">
            {items.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`block px-4 py-2 text-sm hover:bg-muted ${item.highlight ? 'text-red-500 font-bold' : 'text-foreground'}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
