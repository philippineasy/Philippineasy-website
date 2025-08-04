'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignInAlt, faBars, faTimes, faBell } from '@fortawesome/free-solid-svg-icons';
import { getNotifications, getUnreadNotificationCount, markAsRead, markAllAsRead } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { UserMenu } from './UserMenu';
import { Cart } from './Cart';
import { DropdownMenu } from './DropdownMenu';

interface NavLink {
  href: string;
  label: string;
  special?: boolean;
  admin?: boolean;
  roles?: string[];
  submenu?: { href: string; label: string; }[];
}

interface HeaderProps {
  activeMainCategory?: string;
  navLinks: NavLink[];
}

interface Notification {
  id: number;
  is_read: boolean;
  type: 'like' | 'super_like' | 'new_match' | 'new_reply' | 'new_message';
  link?: string;
  actor: {
    username: string;
  };
  topic?: {
    slug: string;
    title: string;
  };
  created_at: string;
}

const Header = ({ activeMainCategory, navLinks }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const notifs = await getNotifications(supabase, user.id);
        if (notifs && notifs.length > 0) {
          const actorIds = [...new Set(notifs.map(n => n.actor_id).filter(id => id))];
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', actorIds);
          
          const profilesMap = new Map(profilesData?.map(p => [p.id, p.username]));

          const notificationsWithActors = notifs.map(n => ({
            ...n,
            actor: { username: profilesMap.get(n.actor_id) || 'Un utilisateur' }
          }));
          setNotifications(notificationsWithActors as unknown as Notification[]);
        } else {
          setNotifications([]);
        }
        const count = await getUnreadNotificationCount(supabase, user.id);
        setUnreadCount(count);
      };
      fetchNotifications();

      const channel = supabase.channel(`realtime:notifications:${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
        async (payload) => {
          const newNotif = payload.new as any;
          const { data: actorProfile } = await supabase.from('profiles').select('username').eq('id', newNotif.actor_id).single();
          const newNotificationWithActor = {
            ...newNotif,
            actor: { username: actorProfile?.username || 'Un utilisateur' }
          };
          setNotifications(prev => [newNotificationWithActor, ...prev]);
          setUnreadCount(prev => prev + 1);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, supabase]);


  interface NavLinkProps {
    href: string;
    label: string;
    special?: boolean;
    admin?: boolean;
    roles?: string[];
  }

  const NavLink = ({ href, label, special = false, admin = false }: NavLinkProps) => {
    const isActive = pathname.startsWith(href) || (activeMainCategory && label.toLowerCase() === activeMainCategory.toLowerCase());
    const baseClasses = "px-3 py-2 lg:px-4 rounded-lg transition duration-300";
    const activeClasses = "font-bold text-primary bg-primary/10";
    const specialClasses = "text-accent-foreground bg-accent hover:bg-accent/90 font-semibold";
    const defaultClasses = "text-foreground hover:text-primary hover:bg-primary/10";
    const adminClasses = "text-destructive hover:text-destructive/90 hover:bg-destructive/10";

    if (admin && !isAdmin) {
      return null;
    }

    return (
      <Link href={href} className={`${baseClasses} ${special ? specialClasses : (admin ? adminClasses : defaultClasses)} ${isActive ? activeClasses : ''}`}>
          {label}
      </Link>
    );
  };
  
  interface MobileNavLinkProps {
    href: string;
    label: string;
    admin?: boolean;
  }
  
  const MobileNavLink = ({ href, label, admin = false }: MobileNavLinkProps) => {
    const isActive = pathname.startsWith(href) || (href === '/actualites' && pathname.startsWith('/article'));
    const baseClasses = "px-3 py-2 rounded-md transition duration-300 block";
    const activeClasses = "font-bold bg-primary/10";
    const defaultClasses = "text-foreground hover:text-primary hover:bg-primary/10";
    const adminClasses = "text-destructive hover:text-destructive/90 hover:bg-destructive/10";

    if (admin && !isAdmin) {
      return null;
    }

    return (
        <Link href={href} className={`${baseClasses} ${admin ? adminClasses : defaultClasses} ${isActive ? activeClasses : ''}`}>
            {label}
        </Link>
    );
  };


  return (
    <>
      <nav className="w-full bg-card shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col">
            {/* Top row for the logo */}
            <div className="flex justify-center py-4">
              <Link href="/" className="text-4xl font-bold text-primary">
                Philippin'<span className="text-accent">Easy</span>
              </Link>
            </div>

            {/* Bottom row for nav links and user actions */}
            <div className="flex w-full justify-between items-center pt-3 pb-3">
              {/* Desktop Navigation & Mobile Placeholder */}
              <div className="hidden md:flex flex-1 justify-center items-center space-x-1 lg:space-x-1 flex-wrap">
                {navLinks.map((link) => {
                  if (link.submenu) {
                    return (
                      <DropdownMenu 
                        key={link.label} 
                        label={link.label} 
                        items={link.submenu} 
                        isActive={pathname.startsWith(link.href)}
                      />
                    )
                  }
                  return <NavLink key={link.href} {...link} />
                })}
              </div>

              {/* Mobile placeholder */}
              <div className="flex-1 md:hidden"></div>

              <div className="flex justify-end items-center space-x-4">
                <button onClick={() => setIsSearchModalOpen(true)} className="text-foreground hover:text-primary focus:outline-none hidden md:block" aria-label="Rechercher sur le site">
                  <FontAwesomeIcon icon={faSearch} className="text-xl" />
                </button>
                {loading ? (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <>
                    <div className="relative" ref={notificationRef}>
                      <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`relative text-foreground hover:text-primary ${unreadCount > 0 ? 'animate-pulse' : ''}`}>
                        <FontAwesomeIcon icon={faBell} className="text-xl" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-2 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">{unreadCount}</span>
                        )}
                      </button>
                      {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-xl border border-border z-10">
                          <div className="p-3 flex justify-between items-center border-b border-border">
                            <h4 className="font-semibold">Notifications</h4>
                            <button onClick={async () => {
                              if (user) {
                                await markAllAsRead(supabase, user.id);
                                setUnreadCount(0);
                              }
                            }} className="text-xs text-primary hover:underline">Tout marquer comme lu</button>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? notifications.map(notif => (
                              <Link key={notif.id} href={
                                notif.type === 'new_reply' && notif.topic?.slug ? `/forum-sur-les-philippines/sujet/${notif.topic.slug}` :
                                (notif.type === 'like' || notif.type === 'super_like') ? `/rencontre-philippines/likes` :
                                (notif.type === 'new_match' || notif.type === 'new_message') && notif.link ? notif.link :
                                '#'
                              } onClick={async () => {
                                if (!notif.is_read) {
                                  await markAsRead(supabase, notif.id.toString());
                                  setUnreadCount(prev => Math.max(0, prev - 1));
                                }
                                setIsNotificationsOpen(false);
                              }} className={`block p-3 hover:bg-muted ${!notif.is_read ? 'bg-primary/10' : ''}`}>
                                <p className="text-sm">
                                  <span className="font-bold">{notif.actor.username}</span>
                                  {notif.type === 'like' && ' a aimé votre profil.'}
                                  {notif.type === 'super_like' && ' vous a envoyé un Super Like !'}
                                  {notif.type === 'new_match' && ' a matché avec vous !'}
                                  {notif.type === 'new_message' && ' vous a envoyé un message.'}
                                  {notif.type === 'new_reply' && ` a répondu à votre sujet "${notif.topic?.title}"`}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(notif.created_at).toLocaleString('fr-FR')}</p>
                              </Link>
                            )) : <p className="p-4 text-sm text-muted-foreground">Aucune notification.</p>}
                          </div>
                        </div>
                      )}
                    </div>
                    <Cart />
                    <UserMenu />
                  </>
                ) : (
                  <Link href="/connexion" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 flex items-center text-sm font-medium">
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-2 opacity-80" /> Connexion
                  </Link>
                )}
              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl text-foreground" />
              </button>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden absolute top-full right-0 mt-2 w-auto max-w-xs rounded-lg shadow-lg bg-secondary z-20 border border-border">
              <div className="flex flex-col space-y-2 p-4">
                {navLinks.map((link) => !link.special && <MobileNavLink key={link.href} {...link} />)}
                <MobileNavLink href="/itineraire" label="Créer Itinéraire" />
                <button onClick={() => { setIsSearchModalOpen(true); setIsMenuOpen(false); }} className="px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-primary/10 transition duration-300 flex items-center">
                    <FontAwesomeIcon icon={faSearch} className="mr-2" /> Rechercher
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-card p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-lg relative">
            <button onClick={() => setIsSearchModalOpen(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground focus:outline-none text-2xl leading-none">
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-6 text-center text-foreground">Rechercher sur le site</h3>
            <form action="/recherche" method="GET">
              <input type="search" name="q" placeholder="Tapez votre recherche ici..." className="w-full px-4 py-3 border border-border rounded-lg text-base focus:ring-2 focus:ring-ring focus:border-primary mb-4" autoFocus />
              <button type="submit" className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold text-base">
                Rechercher
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
