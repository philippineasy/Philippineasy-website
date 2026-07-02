'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Newspaper, Users, MessagesSquare, Heart,
  UserCog, Phone, BarChart3, Store, Tag, Image as ImageIcon, TrendingUp, Map,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  title?: string;
  items: NavItem[];
  superAdminOnly?: boolean;
};

const GROUPS: NavGroup[] = [
  {
    items: [
      { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/admin/articles', label: 'Articles', icon: Newspaper },
      { href: '/admin/users', label: 'Utilisateurs', icon: Users },
      { href: '/admin/forum', label: 'Forum', icon: MessagesSquare },
      { href: '/admin/dating', label: 'Rencontre', icon: Heart },
    ],
  },
  {
    title: 'Services & Itinéraires',
    items: [
      { href: '/admin/customers', label: 'Clients', icon: UserCog },
      { href: '/admin/itinerary-sales', label: 'Itinéraires', icon: Map },
      { href: '/admin/calls', label: 'Appels', icon: Phone },
      { href: '/admin/revenue', label: 'Revenus', icon: TrendingUp },
    ],
  },
  {
    title: 'Marketplace',
    items: [
      { href: '/admin/vendors', label: 'Vendeurs', icon: Store },
      { href: '/admin/marketplace/categories', label: 'Catégories', icon: Tag },
    ],
  },
  {
    title: 'Super Admin',
    superAdminOnly: true,
    items: [
      { href: '/admin/heroes', label: 'Gestion des Héros', icon: ImageIcon },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
];

type Props = {
  isSuperAdmin: boolean;
};

export function AdminSidebar({ isSuperAdmin }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex w-60 shrink-0 bg-night text-white flex-col border-r border-white/10 sticky top-20 h-[calc(100vh-5rem)]">
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-[18px] font-bold tracking-[-0.01em]"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
          Admin
        </Link>
        <span className="block text-[10.5px] text-white/50 uppercase tracking-[0.12em] mt-0.5">
          Philippin'Easy
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {GROUPS.map((group, gi) => {
          if (group.superAdminOnly && !isSuperAdmin) return null;
          return (
            <div key={gi}>
              {group.title && (
                <span className="block px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  {group.title}
                </span>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={[
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-ink',
                          active
                            ? 'bg-accent text-accent-foreground shadow-sm'
                            : 'text-white/80 hover:bg-white/5 hover:text-white',
                        ].join(' ')}
                        aria-current={active ? 'page' : undefined}
                      >
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <Link
          href="/"
          className="block text-[12px] text-white/50 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          ← Retour au site
        </Link>
      </div>
    </aside>
  );
}
