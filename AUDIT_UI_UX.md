# Audit UI/UX — Homepage Philippin'Easy

**Date** : 15 février 2026
**Scope** : Homepage (`/`) uniquement
**Objectif** : Identifier les freins à la conversion et les opportunités de capture de leads

---

## 1. Résumé Exécutif — 7 problèmes critiques

| # | Problème | Sévérité | Impact conversion |
|---|----------|----------|-------------------|
| 1 | Newsletter footer sans backend — `<form>` sans action ni onSubmit | **Critique** | 100% leads newsletter perdus |
| 2 | Photos témoignages = randomuser.me — crédibilité détruite si reconnu | **Critique** | Confiance -50% |
| 3 | CTA "Discuter avec notre IA" ouvre Tawk.to — promesse mensongère | **Majeur** | Déception + perte confiance |
| 4 | Aucun lead magnet (guide PDF, checklist) sur toute la page | **Majeur** | 0 capture email pour visiteurs non prêts |
| 5 | 3 CTAs hero sans hiérarchie claire — dispersion attention | **Majeur** | Paradoxe du choix, conversion -20% |
| 6 | Pas de pixel Meta/Facebook — 0 retargeting publicitaire | **Majeur** | Coût acquisition x3-5 |
| 7 | Copyright "© 2025" non à jour | **Mineur** | Perception site abandonné |

> **Note** : Le login obligatoire avant le flow complet d'itinéraire IA est un choix business voulu (les utilisateurs ont accès à un aperçu sans être connectés).

---

## 2. Constats Détaillés — 7 domaines

### A. Première Impression & Hero Section

- **A1.** 3 CTAs de taille identique (`px-8 py-3 text-lg`) : pas de hiérarchie → le CTA itinéraire IA devrait dominer visuellement
  - **Fichier** : `src/app/page.tsx:75-85`
- **A2.** Badge "+10 000 voyageurs" en `text-sm bg-white/10` trop discret, enfoncé sous le sous-titre
  - **Fichier** : `src/app/page.tsx:71-73`
- **A3.** WeatherTicker au-dessus du hero = distraction avant le H1 (mineur, feature originale)
- **A4.** H1 "Voyage & Expatriation aux Philippines" = descriptif mais pas émotionnel. Manque de punch
  - **Fichier** : `src/app/page.tsx:64`

### B. Génération de Leads & Conversion

- **B1.** Newsletter footer cassée — `Footer.tsx:59` `<form className="mb-4">` sans handler
  - **Fichier** : `src/components/layout/Footer.tsx:59-64`
- **B2.** Aucun lead magnet intercalé dans le scroll (ex: "Téléchargez le guide Palawan" après mini-guides)
- **B3.** CTA final "Créer un compte" trop générique — pas de bénéfice exprimé
  - **Fichier** : `src/app/page.tsx:258`
- **B4.** 0 capture email entre le hero et le footer (10 sections sans aucun formulaire)
- **B5.** Pas d'exit-intent popup ni sticky CTA mobile

### C. Confiance & Preuve Sociale

- **C1.** 3 photos = randomuser.me (`men/32`, `women/68`, `men/45`) — reconnaissables par les digital nomads
  - **Fichier** : `src/app/page.tsx:223,231,239`
- **C2.** Témoignages courts (2 lignes), sans date, sans rating étoiles, sans badge "vérifié"
- **C3.** Pas de compteur dynamique (nb membres forum, nb itinéraires générés)
- **C4.** Pas de mentions presse, partenaires, certifications

### D. Architecture du Contenu & Flow

- **D1.** Ordre actuel : Hero → Mini-Guides → À la Une → CTA Itinéraire → Marketplace → Bons Plans → Outils → Témoignages → CTA final
- **D2.** La section "Outils Essentiels" (App/Forums/Actus) dilue l'attention juste avant le CTA final — contenu déjà dans le header
  - **Fichier** : `src/app/page.tsx:186-214`
- **D3.** "À la Une" mélange articles et topics forum dans un même grid — confusion entre contenu éditorial et UGC
- **D4.** Carousel Marketplace affiche "Chargement des produits..." (texte brut, pas de skeleton)
  - **Fichier** : `src/components/homepage/FeaturedProductsCarousel.tsx:65-71`
- **D5.** Section "Bons Plans" et section "Marketplace" se cannibalisent (2 sections commerce consécutives)
- **D6.** Recommandation d'ordre optimisé : Hero → Mini-Guides → **Lead Magnet** → CTA Itinéraire IA → Témoignages → Bons Plans → À la Une → CTA final

### E. Navigation & UX

- **E1.** Menu 7 catégories + dropdowns = charge cognitive élevée pour un nouveau visiteur
- **E2.** Bouton "Créer Itinéraire" en nav a le style `bg-accent` — visible mais noyé parmi 7+ items
- **E3.** Mobile : le menu burger s'ouvre en dropdown petit (`max-w-xs`) à droite — pas fullscreen, peut couper des labels
  - **Fichier** : `src/components/layout/Header.tsx:275`
- **E4.** Lien mobile "Créer Itinéraire" pointait vers `/itineraire` au lieu de `/itineraire-personnalise-pour-les-philippines`
  - **Fichier** : `src/components/layout/Header.tsx:278` — **CORRIGÉ**

### F. Responsive Mobile

- **F1.** Hero `h-[90vh]` peut couper le contenu sur mobile landscape → utiliser `min-h-[70vh] md:min-h-[90vh]`
  - **Fichier** : `src/app/page.tsx:51`
- **F2.** CTAs hero en `flex-col` sur mobile = OK, mais `space-y-4` un peu espacé
- **F3.** WeatherTicker scroll fonctionne bien sur mobile (inline-block natif)
- **F4.** Grid 4 cols À la Une → 1 col mobile = OK, mais cards très longues en colonne

### G. UX Technique

- **G1.** Accessibilité : `pulse-animation` sans `prefers-reduced-motion` — 5% des utilisateurs affectés
  - **Fichier** : `src/app/globals.css:83-90` — **CORRIGÉ**
- **G2.** SEO : H1 unique ✓, FAQ Schema ✓, Open Graph ✓, JSON-LD Organization+WebSite ✓ — bon
- **G3.** Performance : Hero WebP priority ✓, dynamic imports pour sections below fold ✓, ISR 300s ✓
- **G4.** Copyright "© 2025" dans Footer — **CORRIGÉ** → 2026
  - **Fichier** : `src/components/layout/Footer.tsx:69`
- **G5.** Logo 981KB en PNG (`logo-philippineasy.png`) — devrait être WebP ou SVG

---

## 3. Quick Wins — Statut d'implémentation

| Action | Temps | Impact | Fichier | Statut |
|--------|-------|--------|---------|--------|
| Copyright 2025 → 2026 | 2 min | Crédibilité | `Footer.tsx:69` | ✅ Fait |
| Remplacer photos randomuser.me par avatars initiales + étoiles | 15 min | Crédibilité++ | `page.tsx:221-244` | ✅ Fait |
| "Discuter avec notre IA" → "Discuter avec notre équipe" | 2 min | Honnêteté | `page.tsx:260` | ✅ Fait |
| Brancher newsletter sur API route + Supabase | 30 min | Leads | `Footer.tsx` + `/api/newsletter/route.ts` | ✅ Fait |
| Skeleton loader Marketplace | 10 min | Polish | `FeaturedProductsCarousel.tsx:65-71` | ✅ Fait |
| Hiérarchiser CTAs hero (1 dominant + 2 liens texte) | 20 min | Conversion | `page.tsx:75-85` | ✅ Fait |
| Ajouter `@media (prefers-reduced-motion)` | 5 min | Accessibilité | `globals.css:83-90` | ✅ Fait |
| Fixer lien mobile `/itineraire` → chemin complet | 2 min | Navigation | `Header.tsx:278` | ✅ Fait |

> **Pré-requis Supabase pour la newsletter** : Créer la table `newsletter_subscribers` :
> ```sql
> CREATE TABLE newsletter_subscribers (
>   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
>   email TEXT NOT NULL UNIQUE,
>   created_at TIMESTAMPTZ DEFAULT now(),
>   source TEXT DEFAULT 'footer'
> );
>
> -- RLS
> ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
>
> -- Allow anonymous inserts (for the API route using anon key)
> CREATE POLICY "Allow anonymous inserts" ON newsletter_subscribers
>   FOR INSERT WITH CHECK (true);
>
> -- Only service role can read/update/delete
> CREATE POLICY "Service role full access" ON newsletter_subscribers
>   FOR ALL USING (auth.role() = 'service_role');
> ```

---

## 4. Feuille de Route Prioritaire

### Semaine 1 — Fondations (8h dev)
1. ~~Brancher newsletter footer (API + Supabase + feedback UI)~~ ✅
2. ~~Remplacer photos témoignages (avatars initiales + ratings étoiles)~~ ✅
3. ~~Fixer tous les quick wins du tableau ci-dessus~~ ✅
4. Ajouter Meta Pixel dans `layout.tsx`
5. ~~Créer la table `newsletter_subscribers` dans Supabase~~ ✅ (table + RLS policies créées et testées)

### Semaine 2 — Lead magnets (8h dev + contenu)
6. Créer lead magnet PDF ("7 jours à Palawan" ou "Checklist Visa SRRV")
7. Ajouter section lead magnet sur homepage entre mini-guides et CTA itinéraire
8. Configurer séquence email onboarding (3-5 emails post-inscription via n8n)

### Semaine 3 — Optimisation (4h dev)
9. Exit-intent popup (offre guide gratuit avant départ)
10. Réorganiser l'ordre des sections homepage (flow optimisé pour conversion)
11. A/B test CTAs hero (Vercel Analytics ou Posthog)

---

## Vérification post-implémentation

- [ ] Vérifier visuellement chaque Quick Win sur `localhost:3000`
- [x] Créer la table `newsletter_subscribers` dans Supabase
- [ ] Tester le formulaire newsletter (submit → vérifier insertion en BDD Supabase)
- [ ] Lighthouse audit (performance, accessibilité, SEO) avant/après
- [ ] Vérifier responsive sur mobile (Chrome DevTools 375px, 390px, 414px)
