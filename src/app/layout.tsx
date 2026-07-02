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
import { IAOverlayProvider } from '@/contexts/IAOverlayContext';
import ClientOverlays from '@/components/layout/ClientOverlays';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import GoogleAdsTag from '@/components/analytics/GoogleAdsTag';
import MetaPixel from '@/components/analytics/MetaPixel';
config.autoAddCss = false;

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'] 
});

const siteConfig = {
  name: "Philippin'Easy",
  title: "Voyage & Expatriation Philippines 2026 | Guide Complet - Philippin'Easy",
  url: "https://philippineasy.com",
  description: "Le guide francophone #1 pour voyager et vivre aux Philippines. Itinéraires IA personnalisés, visas, coût de la vie, forum communautaire. +10 000 voyageurs accompagnés.",
  ogImage: "https://philippineasy.com/imagesHero/couple-rencontre-aux-philippines.webp",
  links: {
    twitter: "https://twitter.com/philippineasy",
    // github: "https://github.com/user/repo",
  },
  keywords: [
    "Philippines",
    "voyage Philippines 2026",
    "vivre aux Philippines",
    "s'installer aux Philippines",
    "expatriation Philippines",
    "coût de la vie Philippines",
    "visa Philippines",
    "itinéraire Philippines",
    "guide de voyage Philippines",
    "Manille",
    "Cebu",
    "Palawan",
    "Boracay",
    "Siargao",
    "bons plans Philippines",
    "rencontre Philippines",
    "forum Philippines francophone",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
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
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Philippin'Easy - Guide voyage et expatriation Philippines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@philippineasy",
  },
  // PAS de `canonical` ici. Sinon Next propage cette valeur a TOUTES les pages
  // enfants qui ne declarent pas leur propre canonical, et Google les voit
  // toutes comme duplicates de la home (bug ressenti pendant des mois,
  // identique a celui detecte sur Ondayvaluemoney). Chaque page declare son
  // propre canonical via metadata/generateMetadata.
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  // SSR-hydrate de l'auth pour eviter le flash "non connecte" cote client.
  // getUser() valide le JWT (contrairement a getSession qui lit juste le cookie).
  const { data: { user: ssrUser } } = await supabase.auth.getUser();

  const [voyagerResult, vivreResult, plansResult, productCategoriesResult, profileResult, vendorResult] = await Promise.all([
    getCategoriesByMainCategory(supabase, 'voyager-aux-philippines'),
    getCategoriesByMainCategory(supabase, 'vivre-aux-philippines'),
    getCategoriesByMainCategory(supabase, 'meilleurs-plans-aux-philippines'),
    getProductCategories(supabase),
    ssrUser
      ? supabase.from('profiles').select('*').eq('id', ssrUser.id).single()
      : Promise.resolve({ data: null, error: null }),
    ssrUser
      ? supabase.from('vendors').select('id').eq('user_id', ssrUser.id).eq('status', 'approved').maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const initialProfile = profileResult.data ?? null;
  const initialIsVendor = !!vendorResult.data;

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
  // Nav alignee sur le proto handoff : 6 entrees top-level visibles
  // (+ Admin conditionnel). Services et Marketplace conserves dans des sous-menus
  // pour ne pas perdre l'acces tout en respectant le screenshot.
  const navLinks = [
    { href: '/itineraire-personnalise-pour-les-philippines', label: 'Créer Itinéraire', special: true },
    {
      label: 'Voyager',
      href: '/voyager-aux-philippines',
      submenu: [
        { href: '#', label: 'Destinations', heading: true },
        ...voyagerCats
          .filter((c: Category) => c.slug !== 'conseils-voyage')
          .map((c: Category) => ({ href: `/voyager-aux-philippines/${c.slug}`, label: c.name })),
        { href: '#', label: 'Préparer son voyage', heading: true },
        { href: '/voyager-aux-philippines/quand-partir', label: 'Quand partir' },
        { href: '/voyager-aux-philippines/budget', label: 'Budget' },
        { href: '/voyager-aux-philippines/transport', label: 'Transport' },
        { href: '/voyager-aux-philippines/communication', label: 'Communication & SIM' },
        { href: '/voyager-aux-philippines/sante-securite', label: 'Santé & Sécurité' },
        { href: '/voyager-aux-philippines/conseils-voyage', label: 'Conseils pratiques' },
        { href: '#', label: 'Itinéraires', heading: true },
        { href: '/itineraires-philippines', label: 'Itinéraires prêts à partir' },
        { href: '/itineraire-personnalise-pour-les-philippines', label: 'Itinéraire sur mesure (IA)' },
      ]
    },
    {
      label: "S'installer",
      href: '/vivre-aux-philippines',
      submenu: [
        { href: '#', label: 'Par sujet', heading: true },
        ...vivreCats.map((c: Category) => ({ href: `/vivre-aux-philippines/${c.slug}`, label: c.name })),
        { href: '#', label: 'Guides pratiques', heading: true },
        { href: '/vivre-aux-philippines/travailler/emploi-salarie', label: 'Trouver un emploi' },
        { href: '/vivre-aux-philippines/travailler/creer-entreprise', label: 'Créer son entreprise' },
        { href: '/vivre-aux-philippines/investir/immobilier', label: 'Immobilier locatif' },
        { href: '/vivre-aux-philippines/investir/bourse-et-entreprises', label: 'Bourse & entreprises' },
        { href: '/vivre-aux-philippines/etudier/universites', label: 'Universités' },
        { href: '/vivre-aux-philippines/etudier/ecoles-internationales', label: 'Écoles internationales' },
      ]
    },
    {
      label: 'Communauté',
      href: '/forum-sur-les-philippines',
      submenu: [
        { href: '/forum-sur-les-philippines', label: 'Forums' },
        { href: '/actualites-sur-les-philippines', label: 'Actualités' },
        { href: '/application-mobile', label: 'App Mobile' },
        { href: '/services', label: 'Services Easy+' },
        { href: '/services#buddy', label: 'Buddy System' },
        { href: '/services#pack-ultime', label: 'Pack Ultime' },
      ]
    },
    { href: '/rencontre-philippines', label: 'Rencontres', badge: 'Nouveau' },
    {
      label: 'Bons Plans',
      href: '/meilleurs-plans-aux-philippines',
      submenu: [
        ...plansCats.map((c: Category) => ({ href: `/meilleurs-plans-aux-philippines/${c.slug}`, label: c.name })),
        { href: '/marketplace-aux-philippines', label: 'Marketplace' },
        ...productCats.map((c: Category) => ({ href: `/marketplace-aux-philippines/categorie/${c.slug}`, label: c.name })),
      ]
    },
    { href: '/admin', label: 'Admin', admin: true, roles: ['super_admin', 'editor'] },
  ];

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Applique le thème AVANT l'hydratation pour éviter le flash clair→sombre.
            localStorage.theme ('dark' | 'light') prime, sinon préférence système. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()",
          }}
        />
      </head>
      <body className={`${poppins.className} bg-muted`}>
        <GoogleAnalytics />
        <GoogleAdsTag />
        <MetaPixel />
        <AuthProvider
          initialUser={ssrUser}
          initialProfile={initialProfile}
          initialIsVendor={initialIsVendor}
        >
          <CartProvider>
            <EditModeProvider>
              <IAOverlayProvider>
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
            <ClientOverlays />
            <Toaster position="bottom-right" />
              </IAOverlayProvider>
            </EditModeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
