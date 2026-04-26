'use client';

import { Search, Filter } from 'lucide-react';
import { AdminCard } from '@/components/admin';

interface Props {
  defaultQ: string;
  defaultService: string;
}

export default function CustomerFilters({ defaultQ, defaultService }: Props) {
  return (
    <AdminCard padding="md" className="mb-6">
      <form className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="cust-q" className="sr-only">Rechercher un client</label>
          <input
            id="cust-q"
            type="search"
            name="q"
            defaultValue={defaultQ}
            placeholder="Rechercher (username)…"
            className="w-full rounded-lg border border-border bg-card pl-10 pr-3 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground/60"
          />
        </div>
        <div>
          <label htmlFor="cust-service" className="sr-only">Filtrer par service</label>
          <select
            id="cust-service"
            name="service"
            defaultValue={defaultService}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="">Tous les services</option>
            <option value="buddy">Buddy System</option>
            <option value="voyage_serein">Voyage Serein</option>
            <option value="pack_ultime">Pack Ultime</option>
            <option value="easy_plus">Easy+</option>
            <option value="guide_pdf">Guides PDF</option>
            <option value="rencontre">Rencontre</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-[13px] font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Filter className="w-4 h-4" />
          Filtrer
        </button>
      </form>
    </AdminCard>
  );
}
