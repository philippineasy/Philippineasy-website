import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { HeroCard } from '@/app/admin/heroes/HeroCard';
import { getAllPages } from '@/services/pageService';
import { AdminPageHeader, AdminSection } from '@/components/admin';

export default async function HeroesAdminPage() {
  const supabase = await createClient();
  const { data: groupedPages, error } = await getAllPages(supabase);

  if (error || !groupedPages) notFound();

  const sectionCount = Object.keys(groupedPages).length;
  const totalPages = Object.values(groupedPages as Record<string, any[]>)
    .reduce((sum, pages) => sum + pages.length, 0);

  return (
    <>
      <AdminPageHeader
        eyebrow="Super Admin · Contenu"
        title={<>Images de <span className="text-accent">couverture</span></>}
        description={`${sectionCount} sections · ${totalPages} pages avec hero éditable. Cliquez une carte pour modifier l'image et le CTA.`}
      />

      {Object.entries(groupedPages as Record<string, any[]>).map(([section, pages]) => (
        <AdminSection
          key={section}
          eyebrow={`${pages.length} page${pages.length > 1 ? 's' : ''}`}
          title={<span className="capitalize">{section}</span>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <HeroCard key={page.id} page={page} />
            ))}
          </div>
        </AdminSection>
      ))}
    </>
  );
}
