# Changelog — Philippineasy Website

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
