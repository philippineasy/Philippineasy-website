'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignInAlt, faBars, faTimes, faBell } from '@fortawesome/free-solid-svg-icons';
import { getNotifications, getUnreadNotificationCount, markAsRead, markAllAsRead } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import { Cart } from './Cart';
import { DropdownMenu } from './DropdownMenu';
import { ThemeToggle } from './ThemeToggle';
import { useIAOverlay } from '@/contexts/IAOverlayContext';

interface NavLink {
  href: string;
  label: string;
  special?: boolean;
  admin?: boolean;
  roles?: string[];
  badge?: string;
  submenu?: { href: string; label: string; heading?: boolean; }[];
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
  const iaOverlay = useIAOverlay();
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
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  interface NavLinkProps {
    href: string;
    label: string;
    special?: boolean;
    admin?: boolean;
    roles?: string[];
    badge?: string;
  }

  const NavLink = ({ href, label, special = false, admin = false, badge }: NavLinkProps) => {
    const isActive = pathname.startsWith(href) || (activeMainCategory && label.toLowerCase() === activeMainCategory.toLowerCase());
    const baseClasses = "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none";
    const activeClasses = "bg-primary/10 text-primary font-bold";
    const specialClasses = "bg-accent text-accent-foreground shadow-cta hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99] font-semibold motion-reduce:hover:scale-100";
    const defaultClasses = "text-foreground hover:text-primary hover:bg-primary/10";
    const adminClasses = "text-destructive hover:text-destructive/90 hover:bg-destructive/10";

    if (admin && !isAdmin) {
      return null;
    }

    // Special CTA "+ Créer Itinéraire" opens the IA overlay instead of navigating.
    if (special) {
      return (
        <button
          type="button"
          onClick={() => {
            iaOverlay.open();
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'ia_overlay_opened', { source: 'header' });
            }
          }}
          className={`${baseClasses} ${specialClasses}`}
        >
          <span aria-hidden="true">+</span>
          <span className="relative inline-flex items-center">{label}</span>
        </button>
      );
    }

    return (
      <Link href={href} className={`${baseClasses} ${admin ? adminClasses : defaultClasses} ${isActive ? activeClasses : ''}`}>
        {special && <span aria-hidden="true">+</span>}
        <span className="relative inline-flex items-center">
          {label}
          {badge && (
            <>
              <span
                className="absolute -top-0.5 -right-2 w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot motion-reduce:animate-none"
                style={{ boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.22)' }}
                aria-hidden="true"
              />
              <span className="sr-only">({badge})</span>
            </>
          )}
        </span>
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
    const baseClasses = "px-3 py-2 rounded-md transition-colors duration-200 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
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
      <nav className="w-full bg-card supports-[backdrop-filter]:bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          {/* Top row : wordmark left | actions right */}
          <div className="flex items-center justify-between py-3.5">
            <Link
              href="/"
              className="text-[20px] md:text-[22px] font-bold text-primary tracking-[-0.02em] leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              aria-label="Philippin'Easy — Accueil"
            >
              Philippin&apos;<span className="text-accent">Easy</span>
            </Link>

            <div className="flex items-center gap-1.5">
              <ThemeToggle className="hidden md:inline-flex" />
              <button
                onClick={() => setIsSearchModalOpen(true)}
                aria-label="Rechercher sur le site"
                className="hidden md:inline-flex w-11 h-11 items-center justify-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <FontAwesomeIcon icon={faSearch} className="text-[16px]" />
              </button>

              {loading ? (
                <div className="w-11 h-11 bg-muted rounded-full animate-pulse motion-reduce:animate-none" />
              ) : user ? (
                <>
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      aria-label={unreadCount > 0 ? `Notifications (${unreadCount} non lues)` : 'Notifications'}
                      aria-haspopup="true"
                      aria-expanded={isNotificationsOpen}
                      className={`relative w-11 h-11 inline-flex items-center justify-center rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${unreadCount > 0 ? 'animate-pulse motion-reduce:animate-none' : ''}`}
                    >
                      <FontAwesomeIcon icon={faBell} className="text-[16px]" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
                    {isNotificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-xl border border-border z-10">
                        <div className="p-3 flex justify-between items-center border-b border-border">
                          <h3 className="font-semibold">Notifications</h3>
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
                <Link
                  href="/connexion"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2 opacity-80 text-[12px]" />
                  Connexion
                </Link>
              )}

              <button
                className="md:hidden inline-flex w-11 h-11 items-center justify-center rounded-full hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMenuOpen}
              >
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-xl text-foreground" />
              </button>
            </div>
          </div>

          {/* Nav row (desktop) */}
          <div className="hidden md:flex items-center justify-center gap-1 pb-3 flex-wrap">
            {navLinks.map((link) => {
              if (link.submenu && link.submenu.length > 0) {
                return (
                  <DropdownMenu
                    key={link.label}
                    label={link.label}
                    items={link.submenu}
                    isActive={pathname.startsWith(link.href)}
                  />
                );
              }
              return <NavLink key={link.href} {...link} />;
            })}
          </div>

          {/* Mobile drawer */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full right-4 mt-2 w-[calc(100vw-2rem)] max-w-sm max-h-[70vh] overflow-y-auto rounded-lg shadow-xl bg-card z-20 border border-border">
              <div className="flex flex-col space-y-1 p-3">
                {navLinks.map((link) => {
                  if (link.special) return null;
                  if (link.submenu && link.submenu.length > 0) {
                    return (
                      <details key={link.href} className="group">
                        <summary className="px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200 cursor-pointer list-none flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          <span className={pathname.startsWith(link.href) ? 'font-bold' : ''}>{link.label}</span>
                          <span aria-hidden="true" className="text-muted-foreground text-xs transition-transform duration-200 group-open:rotate-180">▾</span>
                        </summary>
                        <div className="pl-3 pb-1 flex flex-col">
                          <Link
                            href={link.href}
                            className="px-3 py-2 rounded-md text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                          >
                            Tout {link.label} →
                          </Link>
                          {link.submenu.map((item) =>
                            item.heading ? (
                              <p key={`m-heading-${item.label}`} className="px-3 pt-2 pb-0.5 text-[11px] uppercase tracking-[0.06em] font-semibold text-muted-foreground select-none">
                                {item.label}
                              </p>
                            ) : (
                              <Link
                                key={`m-${item.label}-${item.href}`}
                                href={item.href}
                                className="px-3 py-2 rounded-md text-sm text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                              >
                                {item.label}
                              </Link>
                            )
                          )}
                        </div>
                      </details>
                    );
                  }
                  return <MobileNavLink key={link.href} {...link} />;
                })}
                <button
                  type="button"
                  onClick={() => {
                    iaOverlay.open();
                    setIsMenuOpen(false);
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'ia_overlay_opened', { source: 'header_mobile' });
                    }
                  }}
                  className="px-3 py-2 rounded-md bg-accent text-accent-foreground shadow-cta font-semibold hover:bg-accent/90 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  + Créer Itinéraire
                </button>
                <button
                  onClick={() => { setIsSearchModalOpen(true); setIsMenuOpen(false); }}
                  className="px-3 py-2 rounded-md text-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <FontAwesomeIcon icon={faSearch} className="mr-2" /> Rechercher
                </button>
                <div className="flex items-center px-3 py-1">
                  <ThemeToggle />
                  <span className="ml-2 text-sm text-muted-foreground">Thème clair / sombre</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-card p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setIsSearchModalOpen(false)}
              aria-label="Fermer la recherche"
              className="absolute top-2 right-2 w-11 h-11 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-2xl leading-none"
            >
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
