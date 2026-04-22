# Changelog — Philippineasy Website

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Refonte homepage 2026 — Etape 1 : tokens & config
- **Added** : Tokens design — couleurs `ink` (#0F172A), `ink-dim` (#1E293B), box-shadows nommees (`card`, `hero`, `cta`, `like`, `mockup`, `card-rest`), keyframe + animation `pulse-dot` pour le dot live du WeatherTicker
- **Added** : Variant Button `accent` (bg-accent + text-ink + shadow-cta + hover scale 1.02 + active scale 0.99), respecte `prefers-reduced-motion` via `motion-reduce` utilities
- **Added** : `text-balance` sur h1/h2/h3 et `text-pretty` sur p (Tailwind 3.4 native)
- **Added** : `prefers-reduced-motion` sur `scroll-behavior` (auto au lieu de smooth)
- **Removed** : `.section-bg-1` et `.section-bg-2` (URL Unsplash hardcodee, classes inutilisees dans tout le repo)
- **Changed** : Cleanup keyframes accordion-* dupliquees dans `tailwind.config.js`
- **Added** : `_handoff/` package (gitignore) — design package complet avec specs, brand, prototype HTML/JSX, screenshots
- **Added** : `PLAN.md` a la racine — plan d'implementation valide (decisions Q1-Q7 actees, ordre des commits)

### Refonte homepage 2026 — Etape 2 : Header 2-row + WeatherTicker pixel-perfect + Hero stats
- **Changed** : `Header` — refonte structurelle en 2 rangees pour matcher le proto : (1) top row = wordmark a gauche + actions (search, bell, cart, UserMenu/Connexion, hamburger) a droite, (2) nav row centree dessous avec NavLinks + DropdownMenus. `bg-card/94 backdrop-blur-md border-b border-border/50` au lieu de `bg-card shadow-md`. CTA "+ Creer Itineraire" en variant `accent` (text-ink + shadow-cta + hover scale + motion-reduce safety). Icon buttons (search, bell, hamburger) dans des ronds 36x36 avec hover bg-primary/10. Badge unread count "9+" si >9. Tous les `focus-visible:ring-2` et `aria-label` ajoutes (a11y).
- **Changed** : `layout.tsx` — `navLinks` reorganises pour matcher le screenshot proto : 6 entrees top-level visibles (`+ Creer Itineraire`, `Voyager`, `S'installer`, `Communaute`, `Rencontres`, `Bons Plans`). Ajout `Rencontres` en top-level (etait dans le sous-menu Communaute). `Services` (+ Buddy/Pack Ultime) deplace dans le sous-menu Communaute. `Marketplace` (+ categories produits) deplace dans le sous-menu Bons Plans. Garde `Admin` conditionnel.
- **Changed** : `WeatherTicker` — refonte editoriale pixel-perfect : bg `ink` (#0F172A), 4 villes phares (Manille/Cebu/Palawan/Siargao), badge "EN DIRECT · Manille HH:MM" avec fond rouge translucide + dot pulse `animate-pulse-dot` + box-shadow `0 0 0 3px rgba(239,68,68,.2)`, **heure live Manille** via nouveau client component `LiveManilaTime` (timezone Asia/Manila, refresh 30s, suppressHydrationWarning). Separateurs verticaux entre items (`border-r border-white/10`). Emojis Unicode (☀⛅☁🌧⚡) au lieu de FontAwesome. Meta texte gris (text-white/45) : ressenti pour Manille/Palawan/Siargao, humid. % pour Cebu — donnees reelles via WeatherAPI (cache 600s). Taux EUR/PHP en `text-warm-yellow` via Frankfurter API. Vol Paris→MNL en `text-blue-300` (hardcoded MVP). Mobile : meta cachees (md:inline). `role=status aria-live=polite` pour lecteurs ecran.
- **Added** : `LiveManilaTime` (client component) — heure timezone Asia/Manila live, refresh 30s
- **Changed** : `HeroSection` — ajout stats row "**4,9/5** · 1 200+ avis · Gratuit · Sans inscription" sous les CTAs (white/78), motion-reduce sur le 2e CTA

### Propagation du design system editorial — batch marchand/outils
- **Changed** : `MeilleursPlansClientPage` — cards categories refondues (rounded-2xl 0.5px border, icone categorie dans carre 32x32 soft-blue, placeholder gradient avec icone si heroImage null) + bloc Easy+ refondu dans le design system (fond soft-blue, border 0.5px, kicker "★ PROGRAMME PRIVILEGE" uppercase, H2 avec "Easy+" en primary, checkmarks dans ronds bleu pale, CTA primary + lien secondaire avec fleche glisse, carte membre avec shadow primary translucide)
- **Changed** : `OfferSelection` (itineraire Express/Premium/Conciergerie) — cards refondues (border 1.5px primary si selected, bandeau "RECOMMANDE" gradient bleu uppercase pour Premium, icone 36x36 rounded-xl colore par offre, kicker "PRIX" + valeur 32px 700 tabular-nums, checkmarks 16x16 ronds bleus sur fond soft-blue, bloc modifications en card editoriale)
- **Changed** : `KeyStatCard` (composant partage) — icone dans carre 52x52 rounded-xl (bleu primary ou orange accent), valeur 32px 700 tabular-nums, label 12px gris letter-spacing
- **Changed** : `FeaturedProductsCarousel` (homepage) — section header aligne ("Decouvrez l'artisanat **local**" + sous-titre), skeleton loading rounded-2xl 180px, CTA final transforme en mini-card editoriale (icone sac + titre + baseline + fleche)
- **Changed** : `checkout/page.tsx` — kickers "RESUME DE LA COMMANDE" / "PAIEMENT" uppercase 11px, 2 cards 0.5px border rounded-2xl, total 24px 700 tabular-nums avec kicker

### Propagation du design system editorial sur tout le site
- **Changed** : `ProductCard` (marketplace) — refondu au pattern editorial (rounded-2xl, border 0.5px, badge vendeur primary, bloc prix kicker "PRIX" + valeur tabular-nums 18px, lien "Voir →" primary)
- **Changed** : `VoyagerClientPage` — cards destinations refondues (image 180px zoom hover, titre 18px 600, lien "Explorer X →") + bloc wrapper "Destinations Incontournables" aligne + 6 cartes conseils pratiques editoriales (icones FontAwesome dans carres 48x48 orange accent sur fond creme)
- **Changed** : `VivreClientPage` — cards categories refondues + 4 cartes thematiques (S'installer/Travailler/Investir/Etudier) avec icones dans carres 48x48 bleu primary sur fond soft-blue
- **Changed** : `ForumListClient` — cards categories forum refondues (badges colores par theme en 10px uppercase letter-spacing 0.05em, meta "Dernier" + avatar auteur + temps relatif, lien "Voir le forum →") + bloc login "Rejoignez la discussion" en card editoriale
- **Changed** : `ServiceCard` (/services pricing) — bordure 1.5px primary si highlighted (+ shadow primary translucide), icone 52x52 rounded-xl, prix 36px 700 tabular-nums, checkmarks rounds colores, badge popin 10px uppercase
- **Changed** : `EntitlementCard` + `PackProgressCard` (/mon-espace CRM) — rounded-2xl 0.5px border, icones rounded-xl dans fond soft-blue, typography editoriale, meta tabular-nums
- **Changed** : `ProposalCards` (itineraire) — bordure 1.5px primary si selected, bande "RECOMMANDE POUR VOUS" en gradient bleu uppercase, kickers "POINTS FORTS / APERCU / BUDGET ESTIME" editoriaux, checkmarks 16x16 bleus, budget 20px 700 tabular-nums
- **Changed** : `DaySchedule` (itineraire jours) — header pastille 28x28 bleu + location 15px 600, elements de periode en cards rounded-xl 0.5px (bordure primary 1.5px si highlighted), kickers periode 11px uppercase tracking
- **Changed** : `HowItWorks` (itineraire intro) — wrapper card editorial avec titre "Comment ca marche ?"
- **Changed** : `StatCard` + `InfoWidget` (/profil/boutique) — rounded-2xl 0.5px border, icone stat 44x44 rounded-xl, kicker titre 10px uppercase, valeurs tabular-nums 22px 700; widget titre avec icone 28x28 dans carre soft-blue

### Refonte homepage — Editorial design system
- **Added** : Nouveau pattern de card editorial (rounded-2xl, border 0.5px #e5e7eb, shadow 0 1px 2px, hover translate-y + shadow-lg) applique a toute la homepage
- **Added** : Tokens Tailwind `warm-yellow` (#FCD34D) et `soft-blue` (#F4F7FE) pour sections alternees et accents
- **Added** : Composant `HeroSection.tsx` — hero refondu avec overlay gradient vertical bleu, kicker uppercase editorial (etoile orange + voyageurs), H1 clamp(2.25-3.25rem) letter-spacing -0.02em, CTA primaire orange + CTA bleu primary
- **Added** : Composant `ArchipelMilleVisages.tsx` — section 2 colonnes photo + liste des 6 regions avec pins SVG inline, bloc carte blanche rounded-2xl
- **Added** : Composant `RegionCards.tsx` — 3 cartes regions (Palawan, Cebu & Visayas, Siargao) sur fond soft-blue avec SVG placeholder coucher de soleil pour Cebu (TODO: remplacer par photo Supabase)
- **Added** : Composant `InstallerCards.tsx` — 4 cartes thematiques (S'installer, Travailler, Investir, Etudier) avec SVG inline stroke-width 1.5
- **Added** : Composant `ItineraireIABlock.tsx` — section signature gradient bleu (135deg #3B5BDB -> #1e40af) avec mockup itineraire realiste (header titre+budget, jour 1 expanded avec transport bar + activites photos + Google ratings, 3 jours collapsed)
- **Added** : Composant `TestimonialsSection.tsx` — 3 temoignages avec glyphe guillemet SVG orange, etoiles SVG, pastilles initiales colorees (PD bleu, SL orange, MT rouge)
- **Added** : Composant `FinalCtaSection.tsx` — CTA gradient bleu (#1e3a8a -> #3B5BDB) avec SVG decor (cercles jaunes + vagues bas), H2 "philippine" en #FCD34D, CTA orange + CTA ghost
- **Changed** : `LeadMagnetSection.tsx` — 3 couvertures SVG colorees (Palawan cyan + iles karstiques + soleil, Visa bleu + checklist cochee, Budget orange + tableau total 1750€), badges couleurs, email gate conserve
- **Changed** : `BestDealsSection.tsx` — cards refondues au pattern editorial + integration `KlookCarousel` avec mix palawan/cebu/siargao activities
- **Changed** : `FeaturedNewsSection.tsx` — fond soft-blue, cards uniformisees (articles + topics forum avec SVG decoratif bulles de discussion), CTA "voir tous" transformes en mini-cards icone+titre+baseline
- **Changed** : `src/app/page.tsx` — orchestration complete avec nouveau pattern, suppression de "Prepar ez votre Aventure" et ancien "CTA Itineraire" redondants
- **Changed** : `ArticleCard` — refondu au pattern editorial (bordure 0.5px, rounded-2xl, SVG inline pour horloge/calendrier, badge categorie primary uppercase, hover translate + shadow-lg, image h180 avec zoom subtil)

### Systeme d'affiliation — Page /partenaires + Recommandations contextuelles
- **Added** : Composant `AffiliateLink` — liens `rel="sponsored"` avec tracking GA4 (cta_clicked)
- **Added** : Composant `AffiliateRecommendation` — bloc recommandation reutilisable avec cards partenaires
- **Added** : Page `/partenaires` — hub central avec 7 partenaires (Booking, Chapka, AVI, Wise, Airalo, NordVPN, Klook), badges "Recommande", disclaimer transparence
- **Added** : Recommandations affiliees sur 8 pages : budget (Booking+Wise), communication (Airalo+NordVPN), sante-securite (Chapka+NordVPN), palawan (Booking+Klook), cebu-visayas (Booking+Klook), siargao (Booking+Klook), carte-sim (Airalo), banque-assurance (Wise+Chapka)
- **Added** : Liens affilies Klook reels avec tracking (aid=118789) sur 4 pages

### Tracking & Analytics — RGPD Consent Mode + Event Tracking
- **Added** : Consent mode v2 RGPD — GA4 et Meta Pixel demarrent avec consentement refuse par defaut, mis a jour dynamiquement quand l'utilisateur accepte/refuse via CookieBanner
- **Fixed** : CookieBanner etait decoratif (console.log placeholder) — maintenant branche a GA4 (`gtag consent`) et Meta Pixel (`fbq consent`) via CustomEvent
- **Added** : Module `src/lib/analytics.ts` — 12 fonctions de tracking GA4 (purchase, begin_checkout, generate_lead, sign_up, newsletter_signup, cta_clicked, exit_intent, dating, services)
- **Added** : Module `src/lib/meta-pixel.ts` — 9 fonctions Meta Pixel (Purchase, InitiateCheckout, Lead, ViewContent, CompleteRegistration, custom events)
- **Added** : Tracking integre dans checkout itineraire (begin_checkout + purchase), checkout marketplace (purchase), checkout services (purchase), formulaire contact (generate_lead), newsletter footer + lead magnets + exit intent (newsletter_signup + Lead)
- **Fixed** : Reference fantome `news-sitemap.xml` retiree de `robots.txt` (fichier n'existait pas)
- **Added** : `NEXT_PUBLIC_META_PIXEL_ID` configure sur Vercel (production, preview, development)

### MCP & Outils Claude Code
- **Added** : MCP Google Analytics (`uvx analytics-mcp`) — acces GA4 Data API pour rapports et metriques
- **Added** : MCP Google Search Console (`uvx mcp-gsc`) — acces GSC pour requetes, impressions, clics, positions
- **Added** : Service Account Google (`indexing-service@api-new-472306`) ajoute comme Editeur dans GA4
- **Added** : APIs activees dans Google Cloud : Analytics Data API + Search Console API
- **Added** : Fichier `.mcp.json` pour configuration projet Claude Code

### Articles republies
- **Fixed** : 3 articles n8n republies apres correction des liens internes casses (`/blog/xxx/` → URLs correctes)
- **Published** : "Saisies de contrefacons a Binondo" (actualites)
- **Published** : "CHR condamne les remarques sexistes de Bong Suntay" (actualites)
- **Published** : "Arrestation miniere illegale a Cagayan" (actualites)

### Images categories Voyager
- **Added** : 4 hero images AI pour les categories voyager-aux-philippines (Palawan, Cebu & Visayas, Siargao, Conseils Voyage)
- **Added** : Images compressees PNG ~9MB → WebP ~120-190KB, uploadees dans Supabase storage
- **Fixed** : Lien parasite `#palawan-quand` sur la homepage → corrige vers `/voyager-aux-philippines/quand-partir`

### Systeme d'emails automatiques — Phase 1
- **Added** : Infrastructure email complete (`src/emails/`) — config, types, templates branded, send unifie, gestion desinscription
- **Added** : Template HTML brande Philippin'Easy — header bleu #4A7FD6 avec logo, barre accent orange #F5A623, footer avec desinscription
- **Added** : 8 adresses email separees par fonction (bienvenue@, commandes@, communaute@, newsletter@, equipe@, itineraire@, contact@, noreply@)
- **Added** : Table `email_preferences` avec gestion opt-out par categorie + token desinscription
- **Added** : Endpoint `/api/email/unsubscribe` — page branded de confirmation desinscription
- **Added** : Email #1 — Bienvenue apres inscription (regles du site + features disponibles)
- **Added** : Email #2 — Confirmation achat service (Buddy, Pack Ultime, etc.) avec details entitlements
- **Added** : Email #3 — Confirmation paiement itineraire
- **Added** : Email #4 — Itineraire pret (refactored avec nouveau template)
- **Added** : Email #5 — Echec de paiement (Stripe invoice.payment_failed)
- **Added** : Email #6 — Annulation abonnement (Stripe subscription.deleted)
- **Added** : Email #7 — Auto-reply formulaire contact (confirmation au visiteur)
- **Added** : Email #8 — Bienvenue newsletter (confirmation inscription)
- **Changed** : `emailService.ts` refactored — delegue au nouveau systeme `src/emails/`

### Systeme d'emails automatiques — Phase 2 (Communaute)
- **Added** : Email #9 — Notification reponse forum (tous les participants du sujet)
- **Added** : Email #10 — Notification like dating
- **Added** : Email #11 — Notification super like dating
- **Added** : Email #12 — Notification nouveau message dating
- **Added** : Email #13 — Bienvenue inscription dating (conseils profil)
- **Added** : Email #14 — Confirmation commande marketplace (acheteur, detail produits + total)
- **Added** : Email #15 — Notification nouvelle commande marketplace (vendeur)
- **Added** : Email #16 — Confirmation candidature vendeur marketplace

### Systeme d'emails automatiques — Phase 3 (Lifecycle)
- **Added** : Email #17 — Rappel appel 24h avant (cron daily 7h UTC)
- **Added** : Email #18 — Expiration abonnement dans 7 jours (cron daily 8h UTC)
- **Added** : Email #19 — Confirmation dating premium active
- **Added** : Email #20 — Boutique vendeur approuvee
- **Added** : Email #21 — Nouveau message CRM admin
- **Added** : Cron jobs Vercel (`vercel.json`) pour rappels appels et expirations
- **Added** : Colonne `reminder_sent_at` sur `call_bookings` pour eviter doublons
- **Added** : Variable `CRON_SECRET` pour securiser les endpoints cron
- **Added** : Table `email_log` — historique complet des emails envoyes et recus par utilisateur (direction, status, categorie)
- **Added** : Logging automatique dans `sendEmail()` — chaque email envoye/echoue est trace en base
- **Added** : Logging des emails inbound (recus sur contact@philippineasy.com) dans email_log
- **Added** : Email vendeur approuve branche sur l'action admin d'approbation
- **Added** : Email notification CRM branche sur `sendMessage()` quand un admin envoie un message
- **Added** : Email #22 — Guide PDF pret (branche dans activationService pour `guide_pdf_*`)
- **Added** : Email #23 — Feedback post-voyage (cron daily 9h UTC, 3j apres fin itineraire)
- **Added** : Email #25 — Nouvel article publie → notification newsletter subscribers
- **Added** : Email #26 — Anniversaire inscription (cron daily 10h UTC, 1 an apres signup)
- **Added** : Rate-limiting emails communaute — max 1 email/30min par destinataire (evite le spam de likes)
- **Added** : Page preferences email `/api/email/preferences` — toggles par categorie (communaute, newsletter, services) accessible via token sans login
- **Changed** : Email admin contact refactored avec le nouveau template brande (header logo + barre orange)

### SEO — Sitemap (CRITIQUE)
- **Fixed** : Sitemap cassé — toutes les requêtes dynamiques Supabase échouaient silencieusement (colonnes `updated_at` inexistantes sur 7/8 tables). Google ne voyait que 15 URLs au lieu de ~96, causant une désindexation progressive (34 → 16 pages indexées)
- **Fixed** : `articles` → `published_at` au lieu de `updated_at`
- **Fixed** : `categories` → suppression de `updated_at` (pas de timestamp)
- **Fixed** : `forum_topics` → `last_activity_at` au lieu de `updated_at`
- **Fixed** : `forum_categories`, `product_categories`, `vendors` → `created_at` au lieu de `updated_at`
- **Fixed** : `dating_profiles` → `user_id` au lieu de `id` (PK = `user_id`)
- **Fixed** : `pages` → `created_at` + URL corrigée avec préfixe `section` (avant: `/budget` 404, après: `/voyager-aux-philippines/budget`)
- **Added** : `/services` et `/contact` dans les pages statiques du sitemap
- **Removed** : `/connexion` du sitemap (Disallow dans robots.txt)
- **Added** : Logging `console.error` sur chaque requête Supabase du sitemap
- **Fixed** : Page 404 — canonical `/404` remplacé par `robots: { index: false }` (une page 404 ne doit pas être indexée)
- **Fixed** : Suppression du pré-échappement XML (`escapeXml`) sur les URLs — Next.js le fait déjà, risque de double-encodage
- **Fixed** : `lastModified` — `currentDate` conservé pour les pages de listing (homepage, actualités, forum, marketplace), dates fixes pour les pages vraiment statiques (CGU, mentions légales, contact, etc.)
- **Added** : `export const revalidate = 3600` — régénération du sitemap toutes les heures
- **Added** : 10 sous-pages vivre-aux-philippines dans le sitemap (logement, visas, banque-assurance, creer-entreprise, emploi-salarie, universites, ecoles-internationales, immobilier, bourse-et-entreprises, famille)
- **Added** : Schema `VideoObject` automatique — toute video YouTube embedee dans un article genere les donnees structurees pour l'indexation video Google (thumbnail, embedUrl, contentUrl)

### Contact & Email
- **Added** : Page `/contact` avec formulaire (nom, email, sujet, message) — design Airbnb-style coherent avec le systeme de design existant
- **Added** : API route `POST /api/contact` — validation des inputs, envoi email via Resend (`noreply@philippineasy.com` → `contact@philippineasy.com`)
- **Added** : Rate limiting in-memory — max 3 emails par heure par IP
- **Added** : Alerte Telegram admin apres chaque soumission (non-bloquant)
- **Fixed** : Token Telegram supprime du code source (etait expose sur le repo public GitHub) — migre vers variables d'environnement (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`)
- **Added** : Reception email activee sur Resend — record MX configure sur Vercel DNS (`inbound-smtp.us-east-1.amazonaws.com`)
- **Added** : Webhook Resend `email.received` + API route `/api/webhooks/resend-inbound` — tout email recu sur `contact@philippineasy.com` est automatiquement forwarde vers Gmail + notification Telegram

### Itineraire — UX chargement
- **Added** : Panneau de feedback pendant la generation d'itineraire — 3 messages texte, barre de progression animee, dots animes
- **Changed** : Le bouton "Generer" ne scale plus au hover quand le chargement est actif

### Itineraire — Validation n8n (boucle Google Places)
- **Added** : Boucle Split/HTTP/Validate dans le workflow n8n Generator V3
- **Added** : Chaque lieu valide via Google Places API (coordonnees, rating, Google Maps URL) DANS le workflow n8n
- **Added** : Validation haversine avec rayon dynamique par destination (8km Boracay, 30km Davao, etc.)
- **Added** : Lieux hors zone rejetes automatiquement (ex: Coral Garden Samal rejete pour un jour Talikud)
- **Changed** : Plus besoin du fallback frontend pour l'enrichissement — tout se fait a la generation

### Auth
- **Fixed** : Session auth bloquee en "loading" indefiniment — ajout fallback `getSession()` quand `onAuthStateChange` ne fire pas (race condition SSR/cookies)

### Itineraire — Enrichissement Google Places
- **Added** : Enrichissement automatique au premier chargement — coordonnees GPS, ratings, liens Google Maps pour chaque lieu
- **Added** : Ratings affiches sur les cards activites, restaurants et hebergements (ex: 4.3/5)
- **Added** : Liens Google Maps cliquables sur chaque card (activite, restaurant, hebergement)
- **Added** : Donnees enrichies sauvegardees en base (`delivered_itinerary`) — enrichissement unique, pas a chaque visite
- **Added** : Map interactive avec tous les marqueurs (maintenant que les coordonnees sont presentes)
- **Added** : Validation coherence geographique — rejette les resultats Google Places a +80km du lieu du jour
- **Added** : Location bias dans les recherches Google Places (biais vers la ville/ile du jour)
- **Added** : Re-validation des coordonnees existantes si trop loin de la reference
- **Changed** : Limite enrichissement augmentee de 25 a 50 lieux (couvre 10 jours complets)
- **Changed** : Prompt GPT V3 — regles de coherence geographique ajoutees (petit-dej pres de l'hotel, activites dans un rayon 30km, transport prevu pour changement d'ile)
- **Fixed** : Photos ne chargent pas sans coordonnees GPS — PlacePhoto cherche par nom seul
- **Fixed** : API `/api/places/photo` accepte les requetes sans lat/lng
- **Fixed** : Hebergement affiche "cost/nuit/nuit" → retire le doublon "/nuit"

### Itineraire — PDF
- **Fixed** : Emojis casses dans le PDF (remplaces par labels texte + icones colorees)
- **Fixed** : Duree brute "10-days" → traduite en "10 jours" sur la cover
- **Fixed** : "N/A" dans l'annuaire et l'hebergement — filtre les entries invalides
- **Fixed** : Header jour — location ne se superpose plus au titre
- **Added** : Photos Google Places dans le PDF — jusqu'a 15 photos par itineraire
- **Changed** : Section headers avec pastilles colorees (T/P/R/H) au lieu d'emojis

---

## [2.4.0] - 2026-04-14

### Itineraire — Generation IA
- **Added** : Workflow n8n Generator V3 — prompt francais, 16K tokens, GPT-4.1 temp 0.3
- **Added** : Parser robuste (meals string→objet, detection locations, normalisation variants FR/EN)
- **Fixed** : Lieux hors Philippines — prompt avec contraintes geo strictes
- **Fixed** : Meals generes comme strings au lieu d'objets structures
- **Fixed** : Titres en anglais → maintenant 100% francais
- **Fixed** : Tips manquants → 3 tips par variant garanti

### Itineraire — Livraison
- **Added** : Livraison automatique au profil apres paiement (status='delivered' immediat)
- **Added** : Table Supabase `delivery_preferences` (email, telegram, pdf, status, error_log)
- **Added** : API route POST `/api/itinerary/delivery-preferences`
- **Added** : Email via Resend SDK (template HTML brande, liens PDF + itineraire)
- **Added** : Domaine `philippineasy.com` configure dans Resend (DKIM, SPF, MX)
- **Changed** : Page completion restructuree — CTA principal vers itineraire, extras optionnels en dessous
- **Changed** : API deliver accepte booleans `delivery_email`/`delivery_telegram` (backward compatible)
- **Fixed** : Workflow n8n Deliver — Switch remplace par IF node, routing email/telegram corrige
- **Fixed** : n8n Deliver — plus de HTTP dans Code nodes (Task Runner compatible)

### Itineraire — PDF Premium
- **Added** : `@react-pdf/renderer` — generation PDF server-side
- **Added** : Composants PDF : CoverPage, DayPage, SummaryPage avec liens Google Maps cliquables
- **Added** : API route GET `/api/itinerary/pdf/[id]` — telecharge le PDF
- **Added** : Bouton "PDF" dans le header de la page itineraire
- **Added** : Annuaire des etablissements cliquable dans le PDF

### Itineraire — Page detail (Airbnb-style)
- **Added** : Google Places Photos API — vraies photos pour chaque activite, restaurant, hotel
- **Added** : API route GET `/api/places/photo` — fetch photos via Places API v1 (New)
- **Added** : Composant `PlacePhoto` avec skeleton shimmer et fallback icones
- **Added** : Bandeau de bienvenue apres checkout (`?welcome=true`)
- **Changed** : Layout Airbnb Experiences — photo + contenu pour chaque card
- **Changed** : Categories en labels uppercase (ACTIVITES, RESTAURANTS, HEBERGEMENT)
- **Changed** : Staggered `whileInView` animations sur les activity cards
- **Fixed** : Photos en double → text search avec nom exact au lieu de nearby search
- **Fixed** : API Places legacy denied → migration vers Places API v1

### Itineraire — Page formulaire
- **Added** : 5 sous-composants : HowItWorks, InterestSelector, PreferencesForm, ProposalCards, OfferSelection
- **Added** : 4 composants shadcn/ui : Accordion, Badge (8 variants), Checkbox, Textarea
- **Added** : Animations Framer Motion partagees (`animations.ts`)
- **Changed** : Proposal cards — shadow-lg, badge "Recommande" en barre solide
- **Changed** : Offer cards — icones en cercles colores, prix 3xl, features avec check circles
- **Changed** : InterestSelector — pill-toggles animes au lieu de checkboxes natifs

---

## [2.3.0] - 2026-03-19

### Dating — Admin
- **Fixed** : Upload photo profil admin — bon bucket storage
- **Added** : Creation manuelle de profil depuis le panel admin
- **Fixed** : `listUsers` fragile remplace par `getUserById` individuel

### Dating — Inscription
- **Changed** : Redesign complet onboarding inscription + page validation en attente

---

## [2.2.0] - 2026-02-11

### CRM & Services
- **Added** : Systeme CRM complet — 8 tables Supabase (purchases, entitlements, activations, calls, bookings, conversations, messages, notes)
- **Added** : Checkout Stripe + auto-activation services
- **Added** : Dashboard admin (`/admin/customers`, `/admin/calls`, `/admin/revenue`)
- **Added** : Portail utilisateur `/mon-espace`
- **Added** : Composants CRM partages (StatusBadge, CountdownTimer, EntitlementCard, PackProgressCard)
- **Added** : PackChecklist sidebar dans la vue client
- **Fixed** : InfoTooltip redesign avec Radix UI

---

## [2.1.0] - 2026-02-10

### Securite (Audit Supabase)
- **Security** : `.env` retire du tracking git
- **Security** : 18 SECURITY DEFINER functions → `search_path=public`
- **Security** : `validated_places` write policy restreinte a `service_role`
- **Security** : `article_views` INSERT policy nettoyee (`OR true` supprime)
- **Security** : `reported_messages` — 4 RLS policies ajoutees
- **Fixed** : 29 FK indexes crees
- **Fixed** : 10 RLS policies avec pattern `(SELECT auth.uid())`

### Auth
- **Fixed** : Race condition session causant perte de profil au refresh
- **Fixed** : Bouton Facebook OAuth desactive (verification Meta en cours)

---

## [2.0.0] - 2026-01-15

### Homepage
- **Changed** : Redesign complet homepage — lead magnets, newsletter, Stripe build fix

### SEO & Performance
- **Added** : Google Analytics 4
- **Added** : Audit SEO complet — metadata, robots.txt, generateStaticParams
- **Changed** : Articles — server-side rendering, ISR, content rewrite
- **Fixed** : Sitemap — lazy-init Supabase client

### UI/UX
- **Changed** : Design system refactor — migration couleurs hardcodees vers tokens
- **Changed** : Nouvelle section Services
- **Changed** : Redesign 9 pages vivre-aux-philippines (contenu 2026)

### Itineraire — V1
- **Added** : Systeme de pricing (Express, Premium, Conciergerie)
- **Added** : Checkout Stripe pour itineraires
- **Added** : Rate limiting IP (2 paiements test/semaine)
- **Added** : Systeme de visualisation et modification itineraire
- **Fixed** : Logout intermittent Supabase SSR

### Articles
- **Fixed** : Rendu embed blocks (YouTube) dans le contenu
- **Fixed** : CSP — YouTube iframes autorises

---

## How to maintain this changelog

Every Claude Code session that modifies code in this project MUST add entries here under `[Unreleased]` before committing. Categories:
- **Added** : new features
- **Changed** : modified behavior
- **Fixed** : bug fixes
- **Removed** : deleted features
- **Security** : vulnerability fixes

When releasing, move `[Unreleased]` entries to a new `[X.Y.Z] - YYYY-MM-DD` section.
