'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faShoppingCart, faChartLine, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/utils/supabase/client';

interface RevenueStats {
  totalRevenue: number;
  totalPurchases: number;
  averageOrder: number;
  byService: Record<string, { count: number; revenue: number }>;
  byMonth: { month: string; revenue: number }[];
}

export default function AdminRevenuePage() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    const { data: purchases } = await supabase
      .from('service_purchases')
      .select('service_type, amount_paid, status, created_at')
      .in('status', ['active', 'paid', 'expired']);

    if (!purchases) {
      setLoading(false);
      return;
    }

    const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
    const totalPurchases = purchases.length;
    const averageOrder = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;

    // By service
    const byService: Record<string, { count: number; revenue: number }> = {};
    purchases.forEach((p) => {
      const key = p.service_type.replace(/_(?:short|medium|long|expat|monthly|yearly|lifetime|visa|cout_vie|destinations|pack)$/, '');
      if (!byService[key]) byService[key] = { count: 0, revenue: 0 };
      byService[key].count++;
      byService[key].revenue += p.amount_paid || 0;
    });

    // By month
    const monthMap: Record<string, number> = {};
    purchases.forEach((p) => {
      const month = new Date(p.created_at).toISOString().slice(0, 7);
      monthMap[month] = (monthMap[month] || 0) + (p.amount_paid || 0);
    });
    const byMonth = Object.entries(monthMap)
      .sort()
      .map(([month, revenue]) => ({ month, revenue }));

    setStats({ totalRevenue, totalPurchases, averageOrder, byService, byMonth });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return null;

  const SERVICE_NAMES: Record<string, string> = {
    buddy: 'Buddy System',
    voyage_serein: 'Voyage Serein',
    pack_ultime: 'Pack Ultime',
    easy_plus: 'Easy+',
    guide_pdf: 'Guides PDF',
    rencontre: 'Rencontre Premium',
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Revenue</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </div>
            <span className="text-sm text-muted-foreground">Revenue total</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalRevenue.toFixed(0)}€</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faShoppingCart} />
            </div>
            <span className="text-sm text-muted-foreground">Achats</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalPurchases}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <span className="text-sm text-muted-foreground">Panier moyen</span>
          </div>
          <p className="text-3xl font-bold">{stats.averageOrder.toFixed(0)}€</p>
        </div>
      </div>

      {/* Revenue by service */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-4">Revenue par service</h2>
        <div className="space-y-3">
          {Object.entries(stats.byService)
            .sort(([, a], [, b]) => b.revenue - a.revenue)
            .map(([service, data]) => {
              const percentage = stats.totalRevenue > 0 ? (data.revenue / stats.totalRevenue) * 100 : 0;
              return (
                <div key={service}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{SERVICE_NAMES[service] || service}</span>
                    <span className="text-muted-foreground">
                      {data.revenue.toFixed(0)}€ ({data.count} ventes)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Monthly revenue */}
      {stats.byMonth.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Revenue mensuel</h2>
          <div className="space-y-2">
            {stats.byMonth.map(({ month, revenue }) => (
              <div key={month} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm font-medium">
                  {new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
                <span className="text-sm font-bold">{revenue.toFixed(0)}€</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
