'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash, faChartLine, faLightbulb, faUserCheck, faBoxOpen, faCog, faEye } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { handleDeleteProduct } from './modifier-produit/[id]/actions';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import { handleUpdateVendorProfile } from './actions';
import { supabase } from '@/utils/supabase/client';

// Types
type Vendor = {
  id: number;
  name: string;
  description: string | null;
  logo_url: string | null;
};

type Product = {
  id: number;
  name: string;
  price: number;
  status: string;
  image_urls: string[] | null;
};

type OrderItem = {
    id: number;
    quantity: number;
    price: number;
    products: {
        name: string;
    };
    orders: {
        shipping_address: any;
        created_at: string;
    }
}

type BoutiqueClientPageProps = {
  vendor: Vendor;
  initialProducts: Product[];
  monthlySales: number;
  monthlyViews: number;
};

// Sub-components
const StatCard = ({ icon, title, value }: { icon: any, title: string, value: string | number }) => (
  <div className="bg-card rounded-2xl p-4 flex items-center gap-4 border border-border shadow-card-rest transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40">
    <div className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 bg-primary/10 text-primary">
      <FontAwesomeIcon icon={icon} className="text-[16px]" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground mb-0.5">
        {title}
      </p>
      <p className="text-foreground tabular-nums text-[22px] font-bold tracking-[-0.01em] leading-none">
        {value}
      </p>
    </div>
  </div>
);

const InfoWidget = ({ icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
  <div className="bg-card rounded-2xl p-5 border border-border shadow-card-rest">
    <h3 className="text-foreground mb-3 flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em]">
      <span className="inline-flex items-center justify-center rounded-lg w-7 h-7 bg-soft-blue text-primary">
        <FontAwesomeIcon icon={icon} className="text-[12px]" />
      </span>
      {title}
    </h3>
    <div className="text-[13px] text-muted-foreground leading-[1.55] space-y-2">
      {children}
    </div>
  </div>
);

const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-semibold text-sm rounded-t-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors ${
            isActive ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-primary'
        }`}
    >
        {label}
    </button>
);

const VendorSettingsForm = ({ vendor }: { vendor: Vendor }) => {
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        formData.append('vendorId', vendor.id.toString());
        
        const result = await handleUpdateVendorProfile(formData);
        if (result.success) {
            toast.success('Profil de la boutique mis à jour !');
        } else {
            toast.error(`Erreur: ${result.error}`);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl border border-border shadow-card-rest space-y-6 max-w-lg mx-auto">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Nom de la boutique</label>
                <input type="text" name="name" defaultValue={vendor.name} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea name="description" defaultValue={vendor.description || ''} rows={4} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"></textarea>
            </div>
            <div>
                <label htmlFor="logo" className="block text-sm font-medium text-foreground mb-1">Logo de la boutique</label>
                {vendor.logo_url && <Image src={vendor.logo_url} alt="Logo actuel" width={80} height={80} className="rounded-full my-2" />}
                <input type="file" name="logo" accept="image/*" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
            <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
        </form>
    );
};


// Main Component
export function BoutiqueClientPage({ vendor, initialProducts, monthlySales, monthlyViews }: BoutiqueClientPageProps) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (activeTab === 'orders') {
        const fetchOrders = async () => {
            const { data, error } = await supabase
                .from('order_items')
                .select(`
                    id,
                    quantity,
                    price,
                    products (name),
                    orders (shipping_address, created_at)
                `)
                .eq('vendor_id', vendor.id);
            
            if (error) {
                toast.error("Impossible de charger les commandes.");
            } else {
                const formattedData = data.map(item => ({
                    ...item,
                    products: Array.isArray(item.products) ? item.products[0] : item.products,
                    orders: Array.isArray(item.orders) ? item.orders[0] : item.orders,
                }));
                setOrders(formattedData as OrderItem[]);
            }
        };
        fetchOrders();
    }
  }, [activeTab, supabase, vendor.id]);

  const handleDeleteRequest = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    const result = await handleDeleteProduct(productToDelete.id);
    if (result.success) {
      toast.success('Produit supprimé avec succès.');
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
    setProductToDelete(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={faBoxOpen} title="Produits en ligne" value={products.length} />
            <StatCard icon={faEye} title="Vues ce mois-ci" value={monthlyViews} />
            <StatCard icon={faChartLine} title="Ventes ce mois-ci" value={`€ ${monthlySales.toFixed(2)}`} />
            
            <div className="md:col-span-2 lg:col-span-3 space-y-6">
                <InfoWidget icon={faUserCheck} title="Profil de votre boutique">
                    {!vendor.logo_url && <p>N&apos;oubliez pas d&apos;ajouter un logo pour personnaliser votre boutique.</p>}
                    <p>Pensez à rédiger une description complète et attrayante pour rassurer vos clients.</p>
                </InfoWidget>

                <InfoWidget icon={faLightbulb} title="Conseils du Vendeur">
                    <p>Utilisez des photos de haute qualité pour mettre en valeur vos produits.</p>
                    <p>Fixez des prix compétitifs en regardant ce que font les autres vendeurs.</p>
                </InfoWidget>
            </div>
          </div>
        );
      case 'products':
        return (
          <div>
            <div className="flex justify-end items-center mb-6">
                <Link href="/profil/boutique/nouveau-produit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Ajouter un produit
                </Link>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-card-rest overflow-hidden">
                <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-border bg-muted/40">
                    <th className="p-4 w-16">Image</th>
                    <th className="p-4">Produit</th>
                    <th className="p-4">Prix</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                    products.map((product) => (
                        <tr key={product.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                        <td className="p-2">
                            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {product.image_urls?.[0] ? (
                              <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover" />
                            ) : (
                              <FontAwesomeIcon icon={faBoxOpen} className="text-muted-foreground text-sm" />
                            )}
                            </div>
                        </td>
                        <td className="p-4 font-medium">{product.name}</td>
                        <td className="p-4">{product.price} €</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            product.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                            }`}>
                            {product.status === 'published' ? 'Publié' : 'Brouillon'}
                            </span>
                        </td>
                        <td className="p-4 space-x-4">
                            <Link href={`/profil/boutique/modifier-produit/${product.id}`} className="text-primary hover:text-primary/80" title="Modifier">
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </Link>
                            <button onClick={() => handleDeleteRequest(product)} className="text-destructive hover:text-destructive/80" title="Supprimer">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        Vous n'avez encore aucun produit. Cliquez sur "Ajouter un produit" pour commencer.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
          </div>
        );
        case 'orders':
            return (
                <div className="bg-card rounded-2xl border border-border shadow-card-rest overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                <th className="p-4">Date</th>
                                <th className="p-4">Produit</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Adresse</th>
                                <th className="p-4">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map(item => (
                                    <tr key={item.id} className="border-b border-border last:border-b-0">
                                        <td className="p-4">{new Date(item.orders.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">{item.products.name} (x{item.quantity})</td>
                                        <td className="p-4">{item.orders.shipping_address?.name}</td>
                                        <td className="p-4 text-xs">{item.orders.shipping_address?.line1}, {item.orders.shipping_address?.city}, {item.orders.shipping_address?.postal_code}</td>
                                        <td className="p-4">{(item.price * item.quantity).toFixed(2)} €</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        Vous n'avez aucune commande pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        case 'settings':
            return <VendorSettingsForm vendor={vendor} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <span className="block text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-1">
          Ma boutique
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-foreground">{vendor.name}</h1>
        {vendor.description && <p className="text-lg text-muted-foreground mt-2">{vendor.description}</p>}
      </div>

      <div className="border-b border-border mb-6">
        <TabButton label="Vue d'ensemble" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="Produits" isActive={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <TabButton label="Commandes" isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        <TabButton label="Paramètres" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>

      <div>
        {renderContent()}
      </div>

      {productToDelete && (
        <ConfirmationModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDeleteProduct}
          title="Confirmer la suppression"
        >
          <p>Êtes-vous sûr de vouloir supprimer le produit "{productToDelete.name}" ? Cette action est irréversible.</p>
        </ConfirmationModal>
      )}
    </div>
  );
}
