import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faNewspaper, faUsers, faComments, faStore, faTags, faImage, faChartLine, faHeart } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();

  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <div className="flex bg-muted pt-20">
      <aside className="w-64 bg-neutral-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">Admin</div>
        <nav className="flex-grow">
          <ul>
            <li><Link href="/admin" className="block px-6 py-3 hover:bg-gray-700"><FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />Dashboard</Link></li>
            <li><Link href="/admin/articles" className="block px-6 py-3 hover:bg-gray-700"><FontAwesomeIcon icon={faNewspaper} className="mr-2" />Articles</Link></li>
            <li><Link href="/admin/users" className="block px-6 py-3 hover:bg-gray-700"><FontAwesomeIcon icon={faUsers} className="mr-2" />Utilisateurs</Link></li>
            <li><Link href="/admin/forum" className="block px-6 py-3 hover:bg-gray-700"><FontAwesomeIcon icon={faComments} className="mr-2" />Forum</Link></li>
            <li><Link href="/admin/dating" className="block px-6 py-3 hover:bg-gray-700"><FontAwesomeIcon icon={faHeart} className="mr-2" />Rencontre</Link></li>
            <li className="px-6 pt-4 pb-2 text-xs uppercase text-gray-400">Marketplace</li>
            <li><Link href="/admin/vendors" className="block px-6 py-3 hover:bg-gray-700"><FontAwesomeIcon icon={faStore} className="mr-2" />Vendeurs</Link></li>
            <li><Link href="/admin/marketplace/categories" className="block px-6 py-3 hover:bg-gray-700"><FontAwesomeIcon icon={faTags} className="mr-2" />Catégories</Link></li>
            
            {isSuperAdmin && (
              <>
                <li className="px-6 pt-4 pb-2 text-xs uppercase text-gray-400">Super Admin</li>
                <li><Link href="/admin/heroes" className="block px-6 py-3 hover:bg-gray-700"><FontAwesomeIcon icon={faImage} className="mr-2" />Gestion des Héros</Link></li>
                <li><Link href="/admin/analytics" className="block px-6 py-3 hover:bg-gray-700"><FontAwesomeIcon icon={faChartLine} className="mr-2" />Analytics</Link></li>
              </>
            )}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
