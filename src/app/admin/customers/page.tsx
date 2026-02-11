'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserTie, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { supabase } from '@/utils/supabase/client';
import StatusBadge from '@/components/crm/StatusBadge';
import CustomerTable from './CustomerTable';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    // Fetch profiles that have made purchases (customer_since IS NOT NULL)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, customer_since, total_spent, easy_plus_expires_at, rencontre_premium_expires_at')
      .not('customer_since', 'is', null)
      .order('customer_since', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
      return;
    }

    // For each customer, fetch their active purchases
    const enriched = await Promise.all(
      (data || []).map(async (profile) => {
        const { data: purchases } = await supabase
          .from('service_purchases')
          .select('service_type, status')
          .eq('user_id', profile.id)
          .eq('status', 'active');

        const { count: unreadMessages } = await supabase
          .from('crm_messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_admin_message', false)
          .eq('is_read', false);

        return {
          ...profile,
          active_services: purchases?.map((p: any) => p.service_type) || [],
          purchases_count: purchases?.length || 0,
          unread_messages: unreadMessages || 0,
        };
      })
    );

    setCustomers(enriched);
    setLoading(false);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = !search ||
      c.username?.toLowerCase().includes(search.toLowerCase());
    const matchesService = !serviceFilter ||
      c.active_services.some((s: string) => s.includes(serviceFilter));
    return matchesSearch && matchesService;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">{customers.length} clients au total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Tous les services</option>
          <option value="buddy">Buddy System</option>
          <option value="voyage_serein">Voyage Serein</option>
          <option value="pack_ultime">Pack Ultime</option>
          <option value="easy_plus">Easy+</option>
          <option value="guide_pdf">Guides PDF</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="text-2xl animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CustomerTable customers={filteredCustomers} />
      )}
    </>
  );
}
