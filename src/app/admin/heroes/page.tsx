import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { HeroCard } from '@/app/admin/heroes/HeroCard';
import { getAllPages } from '@/services/pageService';

const HeroesAdminPage = async () => {
    const supabase = await createClient();
    const { data: groupedPages, error } = await getAllPages(supabase);

    if (error || !groupedPages) {
        return notFound();
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Gestion des Images de Couverture</h1>
            {Object.entries(groupedPages as Record<string, any[]>).map(([section, pages]) => (
                <div key={section} className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 capitalize">{section}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pages.map((page) => (
                            <HeroCard key={page.id} page={page} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeroesAdminPage;
