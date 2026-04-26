'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, LayoutDashboard, Map, Package, Phone, MessageCircle, FileDown, Crown } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/mon-espace', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/mon-espace/itineraires', label: 'Mes Itinéraires', icon: Map },
  { href: '/mon-espace/services', label: 'Mes Services', icon: Package },
  { href: '/mon-espace/appels', label: 'Mes Appels', icon: Phone },
  { href: '/mon-espace/messages', label: 'Messages', icon: MessageCircle },
  { href: '/mon-espace/guides', label: 'Guides PDF', icon: FileDown },
  { href: '/mon-espace/easy-plus', label: 'Easy+', icon: Crown },
];

export default function MonEspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              <ArrowLeft className="w-4 h-4" />
              Mon Profil
            </Link>

            <nav aria-label="Navigation Mon Espace" className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <nav aria-label="Navigation Mon Espace" className="md:hidden w-full mb-4" aria-hidden="false">
            <div className="flex gap-1 overflow-x-auto pb-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isActive ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
