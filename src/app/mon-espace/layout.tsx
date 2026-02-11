'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt, faBoxOpen, faPhone, faComments, faFileDownload, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/mon-espace', label: 'Tableau de bord', icon: faTachometerAlt, exact: true },
  { href: '/mon-espace/services', label: 'Mes Services', icon: faBoxOpen },
  { href: '/mon-espace/appels', label: 'Mes Appels', icon: faPhone },
  { href: '/mon-espace/messages', label: 'Messages', icon: faComments },
  { href: '/mon-espace/guides', label: 'Guides PDF', icon: faFileDownload },
];

export default function MonEspaceLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/connexion');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Mon Profil
            </Link>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Mobile nav */}
          <div className="md:hidden w-full mb-4">
            <div className="flex gap-1 overflow-x-auto pb-2">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-card text-muted-foreground'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
