interface BudgetTableProps {
  budgetBackpacker: number | null;
  budgetMidrange: number | null;
  budgetLuxury: number | null;
  recommendedDays: number | null;
}

export function BudgetTable({
  budgetBackpacker,
  budgetMidrange,
  budgetLuxury,
  recommendedDays,
}: BudgetTableProps) {
  if (!budgetBackpacker && !budgetMidrange && !budgetLuxury) return null;

  const days = recommendedDays ?? 7;

  const rows = [
    {
      label: 'Backpacker',
      perDay: budgetBackpacker,
      icon: '🎒',
      desc: 'Auberges, repas locaux, transport public',
    },
    {
      label: 'Mid-range',
      perDay: budgetMidrange,
      icon: '🏨',
      desc: 'Hôtels 3*, restaurants, transferts privés',
    },
    {
      label: 'Luxury',
      perDay: budgetLuxury,
      icon: '✨',
      desc: 'Resorts, fine dining, vols domestiques',
    },
  ];

  return (
    <section className="rounded-2xl bg-slate-50 p-6">
      <h2 className="text-2xl font-bold text-slate-900">Budget détaillé</h2>
      <p className="mt-1 text-sm text-slate-600">
        Estimations en euros par personne, basées sur l&apos;expérience terrain.
      </p>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="text-left text-sm font-semibold text-slate-700">
              <th className="py-2 pr-4">Profil</th>
              <th className="py-2 pr-4">Par jour</th>
              <th className="py-2 pr-4">Total {days} jours</th>
              <th className="py-2">Inclus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {rows.map(
              (row) =>
                row.perDay && (
                  <tr key={row.label}>
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      {row.icon} {row.label}
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{row.perDay} €</td>
                    <td className="py-3 pr-4 text-slate-700">
                      {row.perDay * days} €
                    </td>
                    <td className="py-3 text-slate-600">{row.desc}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
