'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faPencilAlt, faChevronDown, faStore, faUserShield, faChartLine, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useEditMode } from '@/contexts/EditModeContext';

export const UserMenu = () => {
  const { user, profile, isAdmin, isVendor, signOut } = useAuth();
  const { editMode, toggleEditMode } = useEditMode();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
  };

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

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
        {editMode ? (
          <FontAwesomeIcon icon={faPencilAlt} className="w-8 h-8 text-destructive p-1" />
        ) : (
          <div className="relative w-8 h-8 rounded-full">
            <Image src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`} alt="Avatar" fill sizes="32px" className="rounded-full" />
          </div>
        )}
        <span className="hidden md:inline text-sm font-medium text-foreground">{profile?.username || user.email}</span>
        <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-accent" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card rounded-md shadow-lg border z-20">
          <div className="py-1">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-semibold">{profile?.username || 'Utilisateur'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Link href="/profil" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Profil
            </Link>
            <Link href="/rencontre/likes" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                <FontAwesomeIcon icon={faHeart} className="mr-2" /> Qui m'a liké ?
            </Link>
            {isVendor && (
              <Link href="/profil/boutique" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                <FontAwesomeIcon icon={faStore} className="mr-2" /> Ma Boutique
              </Link>
            )}
            {isAdmin && (
              <>
                <Link href="/admin" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                  <FontAwesomeIcon icon={faUserShield} className="mr-2" /> Pannel Admin
                </Link>
                <Link href="/admin/analytics" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" /> Analytics
                </Link>
                <button onClick={() => { toggleEditMode(); setIsOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-muted">
                  <FontAwesomeIcon icon={faPencilAlt} className="mr-2" /> {editMode ? 'Désactiver Édition' : 'Activer Édition'}
                </button>
              </>
            )}
            <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-sm text-destructive hover:bg-muted">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
