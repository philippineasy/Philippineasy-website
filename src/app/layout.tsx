import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import WeatherTicker from "@/components/layout/WeatherTicker";
import { createClient } from '@/utils/supabase/server';
import { getCategoriesByMainCategory, getProductCategories } from "@/services/categoryService";
import TawkToChat from "@/components/shared/TawkToChat";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { EditModeProvider } from '@/contexts/EditModeContext';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'] 
});

const siteConfig = {
  name: "Philippin'Easy",
  url: "https://philippineasy.com",
  description: "Explorez les Philippines comme jamais auparavant avec des itinéraires personnalisés, des conseils de voyage, et une communauté active pour vivre, voyager, et s'installer.",
  ogImage: "https://philippineasy.com/imagesHero/couple-rencontre-aux-philippines.webp",
  links: {
    twitter: "https://twitter.com/philippineasy",
    // github: "https://github.com/user/repo",
  },
  keywords: [
    "Philippines",
    "voyage Philippines",
    "vivre aux Philippines",
    "s'installer aux Philippines",
    "expatriation Philippines",
    "tourisme Philippines",
    "guide de voyage Philippines",
    "Manille",
    "Cebu",
    "Palawan",
    "Boracay",
    "bons plans Philippines",
    "rencontre Philippines",
    "forum Philippines",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "Philippin'Easy",
      url: siteConfig.url,
    },
  ],
  creator: "Philippin'Easy",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@philippineasy",
  },
  icons: {
    icon: '/logo-philippineasy.png',
    shortcut: '/logo-philippineasy.png',
    apple: '/logo-philippineasy.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/logo-philippineasy.png',
      },
      {
        rel: 'icon',
        url: '/logo-philippineasy.png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        url: '/logo-philippineasy.png',
        sizes: '16x16',
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const results = await Promise.all([
    getCategoriesByMainCategory(supabase, 'voyager-aux-philippines'),
    getCategoriesByMainCategory(supabase, 'vivre-aux-philippines'),
    getCategoriesByMainCategory(supabase, 'meilleurs-plans-aux-philippines'),
    getProductCategories(supabase)
  ]);

  const [voyagerResult, vivreResult, plansResult, productCategoriesResult] = results;

  // Handle errors gracefully, maybe show a minimal layout
  if (voyagerResult.error || vivreResult.error || plansResult.error) {
    console.error("Failed to load categories for layout", { voyagerResult, vivreResult, plansResult });
    // You might want a more robust error state here
  }

  const voyagerCats = voyagerResult.data || [];
  const vivreCats = vivreResult.data || [];
  const plansCats = plansResult.data || [];
  const productCats = productCategoriesResult.data || [];

  interface Category {
    slug: string;
    name: string;
  }
  const navLinks = [
    { href: '/itineraire-personnalise-pour-les-philippines', label: 'Créer Itinéraire', special: true },
    { 
      label: 'Voyager',
      href: '/voyager-aux-philippines',
      submenu: voyagerCats.map((c: Category) => ({ href: `/voyager-aux-philippines/${c.slug}`, label: c.name }))
    },
    { 
      label: "S'installer",
      href: '/vivre-aux-philippines',
      submenu: vivreCats.map((c: Category) => ({ href: `/vivre-aux-philippines/${c.slug}`, label: c.name }))
    },
    { 
      label: 'Communauté', 
      href: '/forum-sur-les-philippines',
      submenu: [
        { href: '/forum-sur-les-philippines', label: 'Forums' },
        { href: '/rencontre-philippines', label: 'Rencontre', highlight: true },
        { href: '/actualites-sur-les-philippines', label: 'Actualités' },
        { href: '/application-mobile', label: 'App Mobile' },
      ]
    },
    { 
      label: 'Bons Plans', 
      href: '/meilleurs-plans-aux-philippines',
      submenu: plansCats.map((c: Category) => ({ href: `/meilleurs-plans-aux-philippines/${c.slug}`, label: c.name }))
    },
    { 
      label: 'Marketplace', 
      href: '/marketplace-aux-philippines',
      submenu: productCats.map((c: Category) => ({ href: `/marketplace-aux-philippines/categorie/${c.slug}`, label: c.name }))
    },
    { href: '/admin', label: 'Admin', admin: true, roles: ['super_admin', 'editor'] },
  ];

  return (
    <html lang="fr">
      <body className={`${poppins.className} bg-gray-100`}>
        <AuthProvider>
          <CartProvider>
            <EditModeProvider>
              <div className="fixed top-0 w-full z-50">
              <Header navLinks={navLinks} />
              <WeatherTicker />
            </div>
            <main className="pt-32"> {/* Ajustez cette valeur si la hauteur totale change */}
              {children}
            </main>
            <CookieBanner />
            <Footer />
            <TawkToChat />
            <Toaster position="bottom-right" />
            </EditModeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
