import { createClient } from '@/utils/supabase/server';
import { getArticleAnalytics } from '@/services/articleService';

const AnalyticsPage = async () => {
    const supabase = await createClient();
    const { data: analytics } = await getArticleAnalytics(supabase);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Analytics des Articles</h1>
            <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Articles les plus vus (30 derniers jours)</h2>
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">Titre</th>
                            <th className="text-left p-2">Vues</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analytics?.map((article: any) => (
                            <tr key={article.article_id} className="border-b">
                                <td className="p-2">{article.title}</td>
                                <td className="p-2">{article.views_in_range}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalyticsPage;
