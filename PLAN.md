# PLAN — Implémentation redesign Philippin'Easy (handoff `_handoff/`)

> Document à valider avant tout code. Ordre : (1) lire les hypothèses & alertes, (2) trancher les questions ouvertes, (3) valider l'ordre d'implémentation. Tant que ce PLAN n'est pas validé, je n'écris pas une ligne de code applicatif.

## 0. État des lieux (rapide)

**Stack confirmée** : Next.js 15 App Router · Tailwind + shadcn/ui · Supabase · Poppins via `next/font` (déjà chargée dans `src/app/layout.tsx`).

**Composants homepage actuels** (`src/components/homepage/`) :
`HeroSection`, `ArchipelMilleVisages`, `RegionCards`, `InstallerCards`, `ItineraireIABlock`, `LeadMagnetSection`, `BestDealsSection`, `TestimonialsSection`, `FeaturedNewsSection`, `FinalCtaSection`, `ExitIntentPopup`, `FeaturedProductsCarousel`.

**Layout** : Header (`src/components/layout/Header.tsx`) + WeatherTicker fixés `top-0 z-50`, main a `pt-32`. Footer 4 cols.

**APIs existantes** :
- `POST /api/itinerary/generate` → forwarde vers webhook n8n (champs `travelType, duration, budget, tripStyle, interests`). **Pas de streaming SSE.**
- `/api/dating/{likes,messages,profiles}` (la fonctionnalité Rencontres s'appelle `dating_*` côté code, pas `rencontres_*`)
- `/itineraire-personnalise-pour-les-philippines/page.tsx` est une page formulaire complète (existante).

**Tokens déjà en place** (`tailwind.config.js`) : tous les tokens shadcn HSL (primary, accent, secondary, muted, border…), `warm-yellow #FCD34D`, `soft-blue #F4F7FE`. Animations `scroll`, `accordion-*`. Box-shadow custom : aucune (utilise les défauts Tailwind).

**Manque côté tokens** : variant Button `accent`, box-shadows nommées (`card`, `hero`, `cta`, `like`), couleurs `ink #0F172A` / `ink-dim #1E293B`, `text-balance/pretty` utilities (Tailwind 3.4+ les a en built-in si la version est OK).

---

## 1. Décisions à prendre AVANT codage (questions ouvertes)

### Q1. InstallerCards — conflit fonctionnel
**Actuel** : 4 cartes thématiques **S'installer / Travailler / Investir / Étudier** (sous-catégories Vivre).
**Handoff** : 3 cartes **Voyager / S'installer / Rencontrer** (intent macro).

Les deux ont du sens mais visent des audiences différentes. Le handoff fait le tri en haut-d'entonnoir, l'actuel fait le tri intra-Vivre.

**Recommandation** : suivre le handoff (3 cartes intent). Conserver les 4 cartes Vivre/Travailler/Investir/Étudier dans la page `/vivre-aux-philippines` ou en sous-section. Sinon proposer un compromis "3+1" (Voyager / S'installer / Rencontrer + lien "Approfondir : Travailler · Investir · Étudier").

→ **Décision attendue : (a) suivre handoff strict / (b) garder 4 cartes Vivre / (c) compromis 3+1 / (d) renommer InstallerCards → IntentCards et créer un autre composant pour Vivre.**

### Q2. ArchipelMilleVisages — sort ?
**Actuel** : section dédiée avec 1 image hero + 6 régions listées + CTA "Explorer par île".
**Handoff** : ce composant est **fusionné dans RegionCards** (grid 2×2 avec 4 régions). L'eyebrow "Un archipel aux mille visages" devient le H2 de RegionCards.

**Recommandation** : supprimer `ArchipelMilleVisages.tsx` après avoir transféré son CTA "Explorer par île" dans RegionCards.

→ **Décision attendue : OK pour suppression de ArchipelMilleVisages ?**

### Q3. IAOverlay vs page `/itineraire-personnalise-pour-les-philippines`
La spec handoff dit "Overlay IA = modal multi-step" déclenché depuis Hero / ItineraireIABlock. Or il existe déjà une **page complète** dédiée (route `/itineraire-personnalise-pour-les-philippines`) avec son propre formulaire et sa logique.

**Options** :
- **A)** Créer l'IAOverlay en plus de la page. Le CTA "Créer mon itinéraire IA" du Hero ouvre l'overlay (parcours rapide), le menu "Créer Itinéraire" amène à la page (parcours détaillé). Doublon mais conversion ++.
- **B)** Refactorer la page existante en un overlay réutilisable, et la route `/itineraire-personnalise-pour-les-philippines` rend le composant overlay en mode plein écran.
- **C)** Garder la page actuelle telle quelle, ne pas créer l'overlay, juste embellir la transition.

**Recommandation** : **A** pour la première PR (rapide, peu invasif). B/C en suivi si conversion peu satisfaisante.

→ **Décision attendue : option A / B / C ?**

### Q4. Backend `/api/ai/itinerary` (streaming SSE) vs `/api/itinerary/generate` (n8n POST)
Le handoff veut un endpoint **POST `/api/ai/itinerary`** qui **streame** un itinéraire SSE. L'existant `POST /api/itinerary/generate` appelle un workflow n8n et renvoie une réponse complète (pas de SSE).

**Options** :
- **A)** Garder l'overlay non-streamé sur l'endpoint existant `/api/itinerary/generate`. Loading spinner pendant 30s, puis affichage complet du résultat. Pas de nouvel endpoint.
- **B)** Créer une route `/api/ai/itinerary` parallèle qui appelle directement OpenAI/Claude avec streaming SSE (nouveau coût API, nouvelle clé). Bypass n8n.
- **C)** Modifier le workflow n8n pour streamer (compliqué, n8n n'a pas de bon support SSE natif).

**Recommandation** : **A** — l'UX 30s avec spinner + indicateurs progress (3 dots animés style "Notre IA assemble votre itinéraire…") est suffisante pour MVP. **B** si tu veux le SSE polish (je peux ajouter en suivi).

→ **Décision attendue : A / B / C ?**

### Q5. Surfaces "Article / Forum / Rencontres" dans cette PR ou en suivi ?
Le handoff livre 14 specs dont 4 surfaces produit complètes (Article long-form, ForumList + ForumThread, Rencontres swipe deck). Refactorer ces surfaces = **3-4 jours** en plus du chantier homepage.

**Options** :
- **PR1 (4-5 jours)** : tokens + 10 sections homepage + IAOverlay + Footer. Surfaces produit en PR2.
- **PR mega (10+ jours)** : tout d'un coup.

**Recommandation** : **PR1 d'abord** (livrable rapide, risque faible). Je propose un PLAN suivi pour PR2 (Article/Forum/Rencontres) après validation visuelle de PR1.

→ **Décision attendue : PR1 seul / PR mega / autre découpe ?**

### Q6. WeatherTicker — refactor partiel ou complet ?
**Actuel** : bg `bg-primary` (bleu), 20 villes en scroll horizontal, fetch direct WeatherAPI à chaque request.
**Handoff** : bg `bg-ink` (noir #0F172A), 4 villes uniquement + dot rouge "EN DIRECT" + FX EUR/PHP + flight teaser.

**Recommandation** : (a) bg-ink + (b) limiter à 4 villes phares (Manille, Cebu, Palawan, Siargao) + (c) ajouter FX + (d) ajouter dot pulse. **Cron table `home_ticker`** = optionnel, on peut commencer en SSR cache 10min sans nouvelle table.

→ **Décision attendue : on garde l'archi actuelle (fetch SSR) ou on crée la table `home_ticker` + cron ?**

### Q7. Migrations Supabase — toutes nécessaires ?
Voir §6 plus bas. La plus importante : `dating_profiles.show_in_teaser BOOLEAN DEFAULT false`. Les tables `testimonials` et `regions` sont nice-to-have (les statiques dans le code marchent très bien pour MVP). `home_ticker` dépend de Q6.

→ **Décision attendue : on fait toutes les migrations / juste celle de show_in_teaser / aucune (tout en dur) ?**

---

## 2. Refactor vs création — par composant

### À REFACTORER (existent déjà, à aligner sur le proto)

| Composant | Fichier | Niveau | Notes |
|---|---|---|---|
| HeroSection | `homepage/HeroSection.tsx` | minor | ajouter stats row "4,9/5 · 1 200+ avis · Gratuit · Sans inscription" + brancher CTA IA sur l'overlay. Tout le reste est déjà conforme. |
| ItineraireIABlock | `homepage/ItineraireIABlock.tsx` | minor | brancher CTA sur overlay. Le mockup actuel est déjà très bon. |
| RegionCards | `homepage/RegionCards.tsx` | major | passer 3→4 régions (ajouter Luzon), grid 2×3 → 2×2, ajouter tags pill overlay sur image, eyebrow "EXPLORER PAR ÎLE", H2 "Un archipel aux **mille visages**". |
| InstallerCards | `homepage/InstallerCards.tsx` | major | dépend Q1. Si handoff strict : 3 cartes intent (Voyager/Installer/Rencontrer). |
| TestimonialsSection | `homepage/TestimonialsSection.tsx` | minor | ajouter eyebrow + watermark "99" accent/30 top-right (déjà partiellement présent via QuoteGlyph). |
| BestDealsSection | `homepage/BestDealsSection.tsx` | minor | ajouter eyebrow "LES INCONTOURNABLES" + rating + price + CTA outline "Voir l'activité →" sur chaque carte (au lieu du link inline actuel). Garder Klook carousel séparé. |
| Header | `layout/Header.tsx` | major | top row : wordmark centré ✓ déjà fait. Nav row : ajouter "Rencontres" dans le menu principal, repositionner "Créer Itinéraire" en accent en première position. |
| WeatherTicker | `layout/WeatherTicker.tsx` | major | dépend Q6. bg-ink, 4 villes, dot pulse, FX. |
| Footer | `layout/Footer.tsx` | major | passer 4 cols → 5 cols (Brand / Voyager / S'installer / Communauté / Philippin'Easy). Actuellement Newsletter prend 1 col, on déplace dans bottom row ou on garde. Tagline "Fait avec 🧡 à Cebu & Paris" en bottom-right. |

### À CRÉER (n'existent pas)

| Composant | Chemin cible | Priorité | Complexité |
|---|---|---|---|
| **BlogSection** | `homepage/BlogSection.tsx` | haute | moyenne — layout split 1.5fr/1fr featured + side stack 2 + row 3 cards. Réutilise `getHomepageArticles` (déjà 5 articles featured). |
| **RencontresTeaser** | `homepage/RencontresTeaser.tsx` | haute | élevée — split 2col + stack `absolute` 4 profile cards rotées (CSS positions précises), badge floating "23 nouveaux matchs". `prefers-reduced-motion` à honorer. |
| **IAOverlay** | `components/itinerary/IAOverlay.tsx` (nouveau dossier) | haute | élevée — modal Radix Dialog 3 steps : style → params → loading/result. ESC + focus trap. |

### À SUPPRIMER (ou déplacer)

| Composant | Action |
|---|---|
| `ArchipelMilleVisages` | dépend Q2. Si suppression : son CTA "Explorer par île" passe dans le footer du nouveau RegionCards. |
| `LeadMagnetSection` | **Garder** — pas dans le handoff, mais pertinent (lead capture). À placer entre BestDeals et BlogSection. |
| `FeaturedNewsSection` | **Remplacer par BlogSection** — fait double-emploi. À supprimer. |
| `FinalCtaSection` | **Garder** — utile en pied de page avant Footer. Le handoff ne le bloque pas. |
| `FeaturedProductsCarousel` | **Garder** mais à vérifier si encore utilisé. |
| `ExitIntentPopup` | **Garder** — fonctionnel, pas dans le scope visuel handoff. |

---

## 3. Tokens & config

### `tailwind.config.js` — ajouts à apporter

```js
// theme.extend.colors
ink: '#0F172A',
'ink-dim': '#1E293B',
// soft-blue déjà présent (#F4F7FE)
// warm-yellow déjà présent (#FCD34D)

// theme.extend.boxShadow
card: '0 8px 22px rgba(15, 23, 42, 0.08)',
hero: '0 10px 30px rgba(15, 23, 42, 0.12)',
cta: '0 10px 30px rgba(245, 158, 11, 0.35)',
like: '0 8px 20px rgba(236, 72, 153, 0.35)',
'card-rest': '0 1px 2px rgba(0, 0, 0, 0.03)',
'mockup': '0 8px 32px rgba(0, 0, 0, 0.20)',

// theme.extend.borderRadius
'2xl': '1rem',     // shadcn default
'3xl': '1.5rem',
'4xl': '1.75rem',  // pour cards dense

// theme.extend.keyframes / animation
'pulse-dot': {
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.35 },
},
animation: {
  'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
}
```

### `src/components/ui/Button.tsx` — variant `accent`

Ajout dans `buttonVariants.variants.variant` :
```ts
accent: "bg-accent text-ink shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.99]",
```

### `src/app/globals.css` — petit cleanup

- Supprimer `.section-bg-2` (URL Unsplash hardcodée — ligne 68)
- Ajouter `text-wrap: balance` sur `h1, h2, h3` via `@layer base`

### `next.config.js` (à vérifier)

Vérifier que le bucket Supabase d'images est dans `images.remotePatterns`. Sinon, ajouter (mais probablement déjà fait).

---

## 4. Backend — endpoints

### Existants à réutiliser
- `POST /api/itinerary/generate` (n8n webhook) → réutilisé par IAOverlay (cf Q4 option A)
- `POST /api/newsletter` → réutilisé par lead magnet & footer
- `GET /api/dating/profiles` → à étendre avec query `?teaser=true&limit=4` ou créer nouvel endpoint léger
- `GET /api/dating/likes`, `/api/dating/messages` → inchangés

### À créer si Q4=B
- `POST /api/ai/itinerary` (SSE streaming) → appelle OpenAI/Claude direct, bypasse n8n. **Coût API à anticiper.**

### À créer (léger)
- `GET /api/rencontres/teaser-profiles` → retourne 4 profils `verified=true AND show_in_teaser=true`, avec only `{ first_name, age, city, distance, avatar_url, tags[] }` (RGPD : pas d'ID, pas de bio). Cacheable 5 min.
  - **Alternative** : faire la query en RSC dans le composant `RencontresTeaser.tsx` (pas besoin d'endpoint).

---

## 5. Migrations Supabase

Toutes optionnelles selon décisions Q5/Q6/Q7. Listées par priorité :

### Migration P0 (indispensable si on veut afficher des vrais profils dans le teaser)
```sql
-- 0046_dating_show_in_teaser.sql
ALTER TABLE dating_profiles
  ADD COLUMN show_in_teaser BOOLEAN NOT NULL DEFAULT false;

-- Index pour la query du teaser
CREATE INDEX idx_dating_profiles_teaser
  ON dating_profiles (show_in_teaser, is_validated, created_at DESC)
  WHERE show_in_teaser = true AND is_validated = true;

-- RLS : la lecture des champs limités (first_name, city, avatar_url) doit être public-readable pour les profils opt-in
-- À écrire avec policy spécifique si nécessaire
```

### Migration P1 (table testimonials)
```sql
-- 0047_testimonials.sql
CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  age INTEGER,
  role TEXT,
  location TEXT,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  avatar_color TEXT,         -- hex pour bg de l'avatar initiales
  initials TEXT,
  featured BOOLEAN DEFAULT false,
  sort_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Admin write" ON testimonials FOR ALL TO authenticated USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'editor')
);
```
Sinon : garder le tableau JS hardcodé actuel dans `TestimonialsSection.tsx`.

### Migration P2 (table regions)
```sql
-- 0048_regions.sql
CREATE TABLE regions (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  sort_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- + RLS public read + admin write
```
Sinon : garder le tableau JS hardcodé dans `RegionCards.tsx`.

### Migration P3 (home_ticker — uniquement si Q6 = "table + cron")
```sql
-- 0049_home_ticker.sql
CREATE TABLE home_ticker (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Singleton pour le ticker
```

---

## 6. Assets & images

### Disponibles dans `public/imagesHero/`
`hero-home.webp`, `couple-rencontre-aux-philippines.webp`, `hutte-philippines.webp`, `visa-philippines-processus.webp`, etc. (14 fichiers).

### Disponibles dans `public/images/`
Sous-dossiers : `palawan/`, `siargao/`, `voyager/`, `budget/`, `famille/`, `meteo/`, `nourriture/`, `sante/`, `transport/`, `investir/`, `communication/`.

### **Manques identifiés** (à uploader avant ou pendant l'implémentation)
- Photo région **Cebu & Visayas** (1 hero shot)
- Photo région **Luzon** (rizières Banaue ou Manille skyline)
- Photo région **Boracay** (si on l'inclut, sinon optionnelle)
- Avatars/photos pour les **profils Rencontres teaser** (4 photos cohérentes — peut venir de la base `dating_profiles` réelle si Q5=opt-in)

→ **Action** : je peux générer des SVG placeholder éditoriaux (style Cebu actuel) pour Cebu/Luzon en attendant, ou demander des photos. **Décision attendue.**

### Migration Unsplash → assets locaux
- `globals.css` ligne 68 : `.section-bg-2` utilise une URL Unsplash. À supprimer (classe non utilisée a priori, à vérifier avec grep).
- Aucune autre URL Unsplash trouvée dans `src/`.

---

## 7. Ordre d'implémentation suggéré (PR1)

Chaque étape = un commit logique. Je teste visuellement (Chrome dev) entre chaque.

1. **Tokens & config** (commit `feat(tokens): align design tokens with handoff`)
   - `tailwind.config.js` : ajouts box-shadow + colors ink + animations
   - `src/components/ui/Button.tsx` : variant `accent`
   - `src/app/globals.css` : cleanup Unsplash + text-balance

2. **Header & WeatherTicker** (commit `refactor(layout): editorial header + ink ticker`)
   - Header : nav row alignée handoff (CTA accent en 1ère position, ajout "Rencontres")
   - WeatherTicker : bg-ink, 4 villes, dot pulse, FX

3. **Hero polish** (commit `refactor(hero): align CTA stack with handoff`)
   - Ajout stats row, brancher CTA IA sur overlay (à venir étape 8)

4. **InstallerCards** (commit `refactor(homepage): intent cards 3-up`)
   - Décision Q1 appliquée

5. **RegionCards** (commit `refactor(homepage): 4 regions grid 2x2 with tags overlay`)
   - 4 régions, tags pill, eyebrow

6. **Suppression ArchipelMilleVisages** (si Q2 = OK)

7. **ItineraireIABlock** (commit `refactor(homepage): wire itinerary block to overlay`)
   - Brancher CTA sur overlay (à venir étape 8)

8. **IAOverlay (NEW)** (commit `feat(itinerary): IA overlay multi-step modal`)
   - Composant modal Radix Dialog
   - Step 1 : grid 2×2 styles
   - Step 2 : sliders + select
   - Step 3 : loading → résultat (calls `/api/itinerary/generate` ou nouveau)

9. **TestimonialsSection** (commit `refactor(testimonials): polish + optional db source`)
   - Visuel + branchement table testimonials si P1 faite

10. **BestDealsSection polish** (commit `refactor(deals): full card CTA outline`)

11. **LeadMagnetSection placement** — pas de refactor, juste réordonner dans `page.tsx`

12. **BlogSection (NEW)** (commit `feat(homepage): editorial blog section`)
    - Layout split 1.5fr/1fr + row 3 cards

13. **RencontresTeaser (NEW)** (commit `feat(homepage): rencontres teaser with fanned card stack`)
    - Stack absolute 4 cards rotées
    - Honorer prefers-reduced-motion (fallback grid 2×2)
    - Mobile : stack hidden, copy seul

14. **Suppression FeaturedNewsSection** (remplacée par BlogSection)

15. **Footer** (commit `refactor(footer): 5-col layout aligned with handoff`)

16. **Page d'accueil — assemblage final** (commit `refactor(home): final composition matches handoff order`)
    - Réordonner `src/app/page.tsx` selon : Hero → InstallerCards → RegionCards → ItineraireIABlock → TestimonialsSection → BestDeals → LeadMagnet → BlogSection → RencontresTeaser → FinalCtaSection

17. **VISUAL_QA pass** (commit `chore(qa): cocher VISUAL_QA.md complet`)
    - Checklist cochée dans `_handoff/VISUAL_QA.md`
    - Lighthouse mobile (perf ≥90, a11y ≥95)
    - `grep -r unsplash src/` doit être vide
    - `grep -r "<img " src/` doit être vide

18. **CHANGELOG** (commit `docs(changelog): redesign homepage 2026 release`)

**Total estimé** : 4-5 jours dev + 1 jour QA visuelle = **5-6 jours** pour PR1.

---

## 8. Hors scope PR1 (proposé pour PR2)

- Surfaces produit : Article (long-form layout), Forum (List + Thread), Rencontres (swipe deck) — chacune 1 spec handoff complète, ~3-4 jours combinés.
- Migration `home_ticker` + cron (si Q6 demande)
- Streaming SSE `/api/ai/itinerary` (si Q4=B)
- Optimisation images existantes (logo PNG 981KB → SVG/WebP, audit déjà flagué)

---

## 9. Risques identifiés

| Risque | Mitigation |
|---|---|
| Conflit visuel pendant étapes 1-15 (sections déjà en prod désaccordées) | Travailler sur branche dédiée, pas de push intermédiaire main. |
| Webhook n8n trop lent → mauvaise UX overlay | Skeleton + indicators progressifs ; timeout 45s puis erreur claire. |
| `dating_profiles` n'a pas assez de profils opt-in `show_in_teaser=true` | Fallback : 4 profils mock si query retourne <4 (hors prod, bannière dev). |
| Régression Header sur les autres pages (Header est utilisé partout) | Tester chaque page principale après le refactor Header. |
| `text-balance` pas supporté → fallback Tailwind 3.4+ requis | Vérifier version Tailwind avant. |
| Photos Cebu / Luzon manquantes | SVG placeholder éditoriaux comme actuellement pour Cebu, ou photos à fournir. |

---

## 10. Récapitulatif des décisions à prendre

Coche / réponds avant que je code :

- [ ] **Q1** InstallerCards : (a) 3 cartes intent / (b) garder 4 / (c) compromis 3+1
- [ ] **Q2** Supprimer ArchipelMilleVisages : OK / non
- [ ] **Q3** IAOverlay : (A) overlay + page coexistent / (B) overlay seul, page → wrapper / (C) page seule
- [ ] **Q4** Backend itinéraire : (A) réutiliser n8n existant / (B) créer SSE /api/ai/itinerary / (C) autre
- [ ] **Q5** Découpe : (PR1) homepage + tokens / (PR mega) tout d'un coup
- [ ] **Q6** WeatherTicker : SSR fetch direct (statu quo data) / table home_ticker + cron
- [ ] **Q7** Migrations à faire : `show_in_teaser` (P0) ✓ obligatoire si on affiche profils ; `testimonials` (P1) ; `regions` (P2) ; `home_ticker` (P3)
- [ ] **Photos manquantes** : SVG placeholder éditorial pour Cebu/Luzon ou photos fournies ?

Une fois validé, j'attaque l'étape 1 (tokens) en premier commit.
