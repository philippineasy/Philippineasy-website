'use client';

import { useState } from 'react';
import { handleVendorApproval } from './actions';
import toast from 'react-hot-toast';

export type PendingVendor = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  user_id: string;
  username: string;
};

type VendorManagementClientProps = {
  pendingVendors: PendingVendor[];
};

export function VendorManagementClient({ pendingVendors: initialVendors }: VendorManagementClientProps) {
  const [vendors, setVendors] = useState(initialVendors);
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const onApprove = async (vendorId: number, userId: string) => {
    setLoading(prev => ({ ...prev, [vendorId]: true }));
    const result = await handleVendorApproval(vendorId, userId, 'approved');
    if (result.success) {
      toast.success('Vendeur approuvé !');
      setVendors(prev => prev.filter(v => v.id !== vendorId));
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
    setLoading(prev => ({ ...prev, [vendorId]: false }));
  };

  const onReject = async (vendorId: number, userId: string) => {
    setLoading(prev => ({ ...prev, [vendorId]: true }));
    const result = await handleVendorApproval(vendorId, userId, 'rejected');
     if (result.success) {
      toast.success('Vendeur rejeté.');
      setVendors(prev => prev.filter(v => v.id !== vendorId));
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
    setLoading(prev => ({ ...prev, [vendorId]: false }));
  };

  if (vendors.length === 0) {
    return <p className="text-muted-foreground">Aucune nouvelle demande de vendeur pour le moment.</p>;
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-4">Boutique</th>
            <th className="p-4">Utilisateur</th>
            <th className="p-4">Date de la demande</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="border-b last:border-b-0">
              <td className="p-4">
                <div className="font-bold">{vendor.name}</div>
                <div className="text-sm text-muted-foreground truncate">{vendor.description}</div>
              </td>
              <td className="p-4">
                <div>{vendor.username}</div>
              </td>
              <td className="p-4">{new Date(vendor.created_at).toLocaleDateString()}</td>
              <td className="p-4 space-x-2">
                <button
                  onClick={() => onApprove(vendor.id, vendor.user_id)}
                  disabled={loading[vendor.id]}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Approuver
                </button>
                <button
                  onClick={() => onReject(vendor.id, vendor.user_id)}
                  disabled={loading[vendor.id]}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Rejeter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
