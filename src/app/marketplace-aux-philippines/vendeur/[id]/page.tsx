import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/shared/ProductCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import BreadcrumbJsonLd from '@/components/shared/BreadcrumbJsonLd';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const vendorId = parseInt(id, 10);

  const { data: vendor } = await supabase
    .from('vendors')
    .select('name, description, logo_url')
    .eq('id', vendorId)
    .eq('status', 'approved')
    .single();

  if (!vendor) {
    return {
      title: 'Vendeur non trouvé',
    };
  }

  const canonicalUrl = `https://philippineasy.com/marketplace-aux-philippines/vendeur/${id}`;
  const description = vendor.description || `Découvrez tous les produits de ${vendor.name} sur notre marketplace Philippines.`;

  return {
    title: `${vendor.name} - Vendeur Philippines`,
    description,
    keywords: ['vendeur Philippines', vendor.name, 'marketplace Philippines', 'acheter Philippines'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${vendor.name} - Vendeur Philippines`,
      description,
      url: canonicalUrl,
      siteName: "Philippin'Easy",
      locale: 'fr_FR',
      type: 'website',
      images: vendor.logo_url ? [{ url: vendor.logo_url, width: 400, height: 400, alt: vendor.name }] : [],
    },
    twitter: {
      card: 'summary',
      title: `${vendor.name} - Vendeur`,
      description,
      site: '@philippineasy',
      images: vendor.logo_url ? [vendor.logo_url] : [],
    },
  };
}

async function getVendorDetails(supabase: Awaited<ReturnType<typeof createClient>>, vendorId: number) {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select(`
      name,
      description,
      logo_url,
      products (
        id,
        name,
        slug,
        price,
        image_urls,
        vendors (name)
      )
    `)
    .eq('id', vendorId)
    .eq('status', 'approved')
    .single();

  if (error || !vendor) {
    notFound();
  }

  return vendor;
}

export default async function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const vendorId = parseInt(id, 10);
  const vendor = await getVendorDetails(supabase, vendorId);

  const products = vendor.products ?? [];
  const productCount = products.length;

  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/marketplace-aux-philippines', label: 'Marketplace' },
    { label: vendor.name },
  ];

  const breadcrumbJsonLdItems = [
    { name: 'Accueil', item: '/' },
    { name: 'Marketplace', item: '/marketplace-aux-philippines' },
    { name: vendor.name, item: `/marketplace-aux-philippines/vendeur/${id}` },
  ];

  return (
    <div>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      {/* Vendor header band */}
      <section className="border-b border-border bg-muted py-10 md:py-12">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {vendor.logo_url && (
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-[0.5px] border-border bg-card shadow-card-rest md:h-24 md:w-24">
                <Image src={vendor.logo_url} alt={`Logo de ${vendor.name}`} fill className="object-cover" sizes="96px" />
              </div>
            )}
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em] text-primary">
                Vendeur vérifié
              </span>
              <h1
                className="mt-2.5 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-foreground"
                style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
              >
                {vendor.name}
              </h1>
              {vendor.description && (
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  {vendor.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold text-foreground md:text-2xl">
              {productCount > 0
                ? `${productCount} ${productCount > 1 ? 'produits' : 'produit'} de ${vendor.name}`
                : `Produits de ${vendor.name}`}
            </h2>

            {productCount > 0 ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-md rounded-2xl border-[0.5px] border-border bg-card px-6 py-14 text-center shadow-card-rest">
                <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <StoreIcon />
                </span>
                <h3 className="text-lg font-bold text-foreground">Aucun produit pour le moment</h3>
                <p className="mt-2 text-[15px] text-muted-foreground">
                  Ce vendeur n&apos;a pas encore publié de produits. Revenez bientôt pour découvrir
                  sa boutique.
                </p>
                <Link
                  href="/marketplace-aux-philippines"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Explorer la marketplace
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const StoreIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l1.5-5h15L21 9" />
    <path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
    <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
  </svg>
);
