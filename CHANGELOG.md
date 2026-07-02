# Changelog — Philippineasy Website

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Design — Refonte visuelle Phases 0+1 : Section Kit + 31 pages harmonisées sur le langage de la home (2026-07-02)

Lancement de la refonte design globale (plan : `output/PLAN_REFONTE_DESIGN_SITE_2026-07.md`). Objectif : un seul langage visuel (celui de la home) sur tout le site, fin du style « AI 2025 » (HeroThematic plein écran, stats en dégradés arc-en-ciel, alternances génériques).

**Phase 0 — Section Kit (`src/components/sections/`)** : 7 composants réutilisables créés par l'agent designer à partir du design system handoff — `PageHero` (hero éditorial gauche-aligné, hauteur contenue, scrim navy AA), `StatRow`, `SplitSection` (2 colonnes éditoriales), `CardGrid`/`LinkCard` (cartes fines tokenisées), `AppWindowPanel` (panneau signature bleu + fenêtre app), `CTABand`. 100 % tokens sémantiques (sauf dégradés signature volontairement constants), zéro framer-motion, Server Components. **Dark mode : bloc `.dark` complet ajouté dans `globals.css`** (famille ink, contrastes AA vérifiés dans les deux modes) — `darkMode:["class"]` était configuré mais aucun token sombre n'existait.

**Phase 1 — 31 pages re-skinnées, contenu strictement verbatim** (vérifié par diff des nœuds texte ; URLs/metadata/canonical/hrefs intouchés) :
- `CategoryPage.tsx` réécrit avec le kit (touche actualités + bons plans + fallbacks) ; labels breadcrumb « Y Vivre »/« Voyager » corrigés en « Vivre aux Philippines »/« Voyager aux Philippines ».
- Fil d'Ariane des articles complété (`JsonLd.tsx`) : chaîne Accueil → **Section** → Catégorie → Article (le niveau section manquait — cohérence avec les pages catégories).
- 6 pages sujets vivre, 6 guides (emploi, création d'entreprise, immobilier, bourse, universités, écoles), 18 pages voyager (destinations, budget, transport, communication, santé, quand-partir, conseils).
- Fin du « rainbow coding » : les palettes par carte (blue/green/purple/amber/cyan…) sont consolidées sur primary/accent/destructive à usage sémantique (préférence anti-rainbow).
- Hack de chevauchement `-mt-20` supprimé partout ; icônes en ReactNode ; imports morts nettoyés.

Vérifications : tsc + eslint verts sur chaque fichier, build de production propre, smoke test local 32/32 pages (HTTP 200, H1 unique). Restent en style 2025 : la landing Rencontres (Phase 2c) et les composants legacy eux-mêmes (supprimés en Phase 5 après les Phases 2-4).

### Refonte — Fin de la double taxonomie « Vivre » + navigation 100 % couvrante (2026-07-02)

Suite à l'audit d'architecture (rapport : `output/AUDIT_ARCHITECTURE_VIVRE_2026-07-02.md`) : la section vivait avec DEUX systèmes parallèles — 6 catégories DB (dans le menu, template générique moche, 0 image) et 14 pages thèmes statiques (invisibles du menu, 11/14 à zéro impression GSC sur 28 j). Objectif utilisateur : plus AUCUNE page hors menu, consolidation, et plus de vues Google.

**Fusion (une seule page riche par sujet, à l'URL de la catégorie DB — celle du menu, qui garde les articles) :**
1. `visas-et-formalites` ← port intégral de `s-installer/visas` (simulateur de visa inclus) + articles de la catégorie.
2. `logement` ← port de `s-installer/logement` + section « investir locatif » (2 CTA distincts locatif/habiter, anti-cannibalisation respectée) + articles.
3. `travail-entreprise` ← hub `travailler` statifié + sections liant les guides conservés (emploi-salarie, creer-entreprise, bourse, immobilier) + articles.
4. `banque-finances` + `sante-assurances` ← split de `s-installer/banque-assurance` (blocs affiliés Wise/Chapka déplacés au bon endroit) + articles.
5. `culture-integration` ← fusion des hubs `etudier` + `famille` + guides universités/écoles liés + articles.

Toutes suivent le squelette des pages destinations (HeroThematic → stats → contenu → ArticleList), avec Breadcrumb + BreadcrumbJsonLd, canonical propre, title sans suffixe brand. Les pages statiques masquent la route dynamique `[slug]` (pattern voyager/palawan, vérifié au build).

**Suppressions + 301 (next.config.ts, sources exactes — les guides enfants restent en place) :** `s-installer` (+3 sous-pages), `travailler`, `investir`, `etudier`, `famille` → 8 URLs redirigées vers leurs pages fusionnées. Sitemap nettoyé (entrées statiques retirées + exclusion des slugs fusionnés issus de la table `pages`), section vivre : 21 URLs → 14.

**Navigation — plus aucune page orpheline :**
- Menu « S'installer » : groupes « Par sujet » (6 catégories) + « Guides pratiques » (6 guides conservés). `DropdownMenu` supporte désormais des intitulés de groupe non cliquables.
- Menu « Voyager » : groupes « Destinations » (Palawan, Siargao, Cebu), « Préparer son voyage » (quand-partir, budget, transport, communication, santé-sécurité, conseils — jusqu'ici accessibles nulle part) et « Itinéraires » (`/itineraires-philippines` + itinéraire IA — jusqu'ici accessibles nulle part depuis le header).
- **Menu mobile : bug corrigé** — le drawer ignorait tous les sous-menus (`Header.tsx`), aucune catégorie n'était accessible au doigt. Accordéons `<details>` + lien « Tout {section} ».
- **Footer réparé** : « Visas / Logement / Travailler / Investir / Études » pointaient TOUS vers `/vivre-aux-philippines` ; désormais deep links réels. Faux liens Boracay/Manille remplacés par Quand partir + Itinéraires prêts à partir.
- Cartes « S'installer/Travailler/Investir/Étudier » de la home (`InstallerCards`) re-pointées vers les nouvelles cibles.

**Images :** les 6 catégories vivre n'avaient AUCUNE `heroImage` en DB → toutes les cartes du hub affichaient le même coucher de soleil Unsplash (fallback). 6 images réelles de `public/imagesHero/` attribuées en DB ; fallback Unsplash remplacé par une image locale. Hub simplifié : une seule grille de 6 sujets + section guides (fin de la double rangée thèmes/dossiers).

**SEO :** aucun slug d'article modifié ; le refocus anti-cannibalisation du 01/07 est préservé (liens « investir » larges → article gagnant `investir-aux-philippines-guide-francais-2025`). Consolidation 21→14 URLs = concentration du crawl budget (cause racine identifiée dans l'audit indexation de juin).

### Chore — Grand tri du dépôt : 49 fichiers obsolètes retirés, secrets détrackés (2026-07-02)

Audit complet de la racine du projet (fichiers du 8-10 janvier + restes d'août 2025), croisé avec le code actuel, 218 commits d'historique et la base n8n locale. Rapport détaillé : `output/RAPPORT_TRI_FICHIERS_2026-07-02.md`.

1. **Sécurité** : `.sentryclirc` (token Sentry en clair) et `.mcp.json` (config locale) détrackés + gitignorés — ils restent en local. ⚠️ Le repo étant public, le token Sentry reste visible dans l'historique git : révocation nécessaire côté sentry.io.
2. **Doc workflow n8n du 8-10 janvier (30 fichiers supprimés)** : guides d'installation, rapports de validation/correction, checklists, scripts one-shot et SQL déjà appliqué. Les workflows vivants sont dans la base n8n (« Article Automation V2 copy » et « GPT Custom Import », actifs) ; les 3 exports JSON + la note de jonction sont archivés dans `n8n-workflows/` (local, gitignored).
3. **Restes d'août 2025** : `debug-env.ts` (loggait les clés Supabase), `migrate-styles.mjs` (migration exécutée), `test-connexion.txt` (vide), `postcss.config.mjs` (config Tailwind v4 jamais chargée — le projet est en v3, `postcss.config.js` reste la config active).
4. **Doublons/oublis** : `package-lock.json` supprimé (le projet est sous pnpm, `pnpm-lock.yaml` conservé — lève l'ambiguïté de détection du package manager sur Vercel) ; 3 captures d'écran trackées dans `src/app/` (zéro référence) ; `supabase/20250712162700_fix_warnings.sql.temp` (migration appliquée en février) ; `output/TODO.md` détracké (le dossier `output/` est gitignored).
5. **Docs stratégiques obsolètes** : `AUDIT_UI_UX.md` (tout implémenté : pixel Meta, lead magnet, exit-intent, newsletter), `SEO_OPTIMIZATIONS.md` et `GOOGLE_INDEXING_SETUP.md` (features vivantes dans le code, news-sitemap supprimé en mai), `PLAN.md` déplacé vers `_handoff/` (redesign exécuté). Les 6 idées jamais réalisées sont préservées dans `output/BACKLOG_IDEES.md` (logo PNG 958 KB → WebP, redesign Article/Forum/Rencontres, onboarding email, A/B test CTAs, SSE itinéraire, Google News).

Racine du projet : ~55 → ~20 fichiers. Aucun fichier applicatif touché.

### Contenu / SEO — Simulateur de visa interactif "Quel visa pour les Philippines ?" (2026-07-02)

Premier "linkable asset" de la stratégie backlinks : un simulateur interactif intégré en haut de `/vivre-aux-philippines/s-installer/visas`. L'utilisateur choisit son objectif (voyager, retraite, travail, investir, télétravail, conjoint) puis répond à une question de suivi, et obtient le visa recommandé avec ses conditions clés, dépôt/durée, un encadré honnête "à vérifier" et un lien vers le comparatif SRRV vs 13(a).

Intérêt : (1) donne enfin à la page visas (jusque-là "Découverte, non indexée" dans GSC) un contenu unique et interactif pour mériter l'indexation ; (2) actif partageable en communauté sans lien promotionnel direct.

Données à jour 2025-2026, vérifiées par recherche web (sources : Bureau of Immigration, PRA, Executive Order n°86) : réforme SRRV du 1er septembre 2025 (âge abaissé à 40 ans, tranches 40-49 / 50+, catégories Classic/Courtesy, dépôts 15-50 k$, BI Clearance), Digital Nomad Visa (EO n°86), visa touriste 9(a), 9(g) travail, SIRV investisseur, 13(a) conjoint.

Design aligné sur l'ADN de la home (section `ItineraireIABlock`) et non sur un formulaire générique : panneau bleu en dégradé `rounded-3xl`, colonne éditoriale à gauche (eyebrow, titre à accent, checklist), fenêtre "app" blanche à droite (barre style Mac) contenant le flux en lignes compactes et la fiche résultat. Composant client autonome `src/components/visa/VisaSimulator.tsx`, réutilisable ailleurs. Accessibilité (aria-live, useReducedMotion, contraste AA via `text-accent-strong`), framer-motion sobre, `tsc` + eslint OK.

### SEO — Refocus anti-cannibalisation + maillage interne section "Vivre" (2026-07-01)

Suite de l'audit d'indexation : investigation de la redondance de taxonomie dans `/vivre-aux-philippines`. Le constat (données GSC par requête) : deux systèmes parallèles coexistent — des pages "thèmes" éditoriales statiques (`s-installer`, `travailler`, `investir`, `etudier`) et des catégories DB (`logement`, `visas-et-formalites`, `banque-finances`, `travail-entreprise`, etc., où vivent les articles). La cannibalisation réelle s'est révélée limitée (2 requêtes contestées : "visa retraite" et "investir aux philippines", où l'article gagne déjà) plutôt que systémique — donc refocus chirurgical, pas de migration ni de suppression de contenu.

Changements :
1. **`investir/immobilier`** recentré sur l'**investissement locatif / rendement** (title, description, OG/Twitter, sous-titre hero) pour se distinguer de l'article "acheter sa résidence" (`logement/acheter-immobilier-philippines`) et du guide général. Liens croisés ajoutés vers ces deux pages.
2. **`investir/bourse-et-entreprises`** : callout ajouté vers le guide général "investir aux philippines" (défère la requête large au gagnant). Titre PSE/bourse conservé (déjà niché).
3. **`s-installer/visas`** : callout vers l'article comparatif SRRV vs 13(a) pour déférer "visa retraite" à l'article gagnant ; le hub reste sur l'intent large (types de visas).
4. **Maillage thèmes → catégories DB** : les pages hub `s-installer` (nouvelle section 4 liens), `travailler` et `investir` linkent désormais vers les catégories DB où vivent les articles (flux de jus de lien vers les pages jusque-là faiblement liées). Server Components → liens crawlables.

Aucun slug d'article ni canonical modifié. `tsc` + eslint OK, aucun pattern AI-writing.

### SEO — Indexation : méga-menu crawlable + liens internes vers URLs canoniques (2026-06-09)

Audit du rapport GSC "Pourquoi des pages ne sont pas indexées" : **53 pages non indexées** (30 "Explorée, actuellement non indexée" + 23 "Détectée, actuellement non indexée"). Diagnostic via l'API URL Inspection : ce n'est **ni le contenu** (47 articles publiés, médiane 12 000 caractères, 0 thin) **ni le canonical** (les pages crawlées montrent `googleCanonical == userCanonical == self` — le bug de propagation canonical historique ne sévit plus). Cause réelle = **crawl budget / maillage interne** : plusieurs pages du sitemap sont "unknown to Google" ou "Discovered, never crawled" malgré une soumission datant d'un mois. Deux bugs de code amplifiaient le problème.

**1. Méga-menu de navigation invisible au crawl** (`DropdownMenu.tsx`) : les `<Link>` du sous-menu étaient rendus avec `{isOpen && (...)}` → présents dans le DOM uniquement après un clic utilisateur. Googlebot ne clique pas → il ne voyait **aucun** lien de catégorie/destination/section du menu principal. Toute la navigation primaire ne transmettait donc pas de jus de lien (les pages n'étaient découvertes que via footer + cartes homepage + sitemap). Fix : les liens sont désormais **toujours rendus dans le DOM** et masqués visuellement via CSS (`opacity`/`invisible`/`pointer-events`), avec `aria-hidden` et `tabIndex={-1}` quand le menu est fermé. UX identique (clic pour ouvrir, click-outside pour fermer), liens crawlables.

**2. Liens internes pointant vers des sources de redirection 301** (5 fichiers) : `MeilleursPlansClientPage.tsx` générait `href={/meilleurs-plans/${slug}}` au lieu de `/meilleurs-plans-aux-philippines/${slug}` → les seuls liens internes vers les 3 catégories meilleurs-plans passaient par un 301 (next.config), d'où leur statut "Détectée non indexée". Corrigé. Idem pour `/rencontre/premium`, `/rencontre/likes`, `/marketplace/vendeur/connexion` (`connexion/page.tsx`, `ProfileViewers.tsx`, `UserLimits.tsx`, `UserMenu.tsx`) → suffixes canoniques (impact SEO faible car pages sous auth, mais nettoyage du graphe de liens).

Vérifications : 0/113 URLs du sitemap en erreur HTTP (sitemap propre), pages hub toutes en `index:true` (pas de conflit noindex/sitemap), sitemap resoumis à Google via l'API (HTTP 204, recrawl déclenché). Leviers restants hors code : autorité de domaine (backlinks) et "Demander l'indexation" manuel sur les URLs prioritaires dans la console GSC.

### SEO — Fix titre `<title>` dédoublé site-wide (2026-06-08)

Audit SEO post-1-mois (GSC : CTR 4,49% → 3,18% malgré +40% impressions). Cause majeure identifiée : le suffixe ` | Philippin'Easy` était ajouté **deux fois** sur 100% des pages — une fois manuellement dans chaque `generateMetadata`/`metadata`, une fois par le `template: '%s | Philippin'Easy'` du root layout. Résultat : `<title>Sugba Lagoon... | Philippin'Easy | Philippin'Easy</title>`. Gaspillage de ~15 caractères de pixels titre (Google tronque à ~60), rendu spammy → CTR dégradé partout.

Fix : retrait du suffixe brand manuel dans ~40 fichiers (`title:` principaux uniquement, les `openGraph.title`/`twitter.title` non affectés par le template restent inchangés). Le template root ajoute désormais le brand une seule fois. Les qualifieurs de section (Forum, Marketplace, Rencontre) deviennent des descripteurs (`X - Forum` → template → `X - Forum | Philippin'Easy`). `siteConfig.title` (homepage `default`) inchangé.

Aussi corrigé : le renderer d'articles (`EditorialRenderer.tsx`) émettait un vrai `<h1>` pour les blocs header `level: 1` du contenu EditorJS. Clamp défensif `level <= 1 → H2` pour ne jamais avoir un 2e `<h1>` sur la page (le seul H1 doit être le titre via ArticleHero). Cf. fix data articles #67/#51 ci-dessous.

### Funnel — Fix recovery flow non-auth (loader infini) + coupon preserve (2026-05-09)

Audit GA4 + reproduction live 2026-05-09 : un user non-connecte qui clique sur un lien recovery email (URL `?resume_payment=...&coupon=...`) voyait le splash "Préparation de votre paiement" tourner en boucle. Cause : le `useEffect` resume_payment retournait silencieusement a `if (!user) return` mais le splash plein-ecran (`if (isResuming && !error) return ...`) restait affiche, masquant la modal magic-link et empechant le user de s'authentifier. **4 leads `ia_checkout_started` perdus en 28j** (GA4 confirme : 0 user non-Hugo n'a atteint `/checkout/itinerary`).

Fixes :
1. **Auto-ouverture de `PaymentAuthModal`** quand `isResuming && !user && !authLoading`. Set automatique de `generationId/selectedVariant/pendingOffer` depuis URL params puis `setPaymentAuthModalOpen(true)`. User saisit son email -> magic link -> click email -> revient auth -> useEffect existant declenche `triggerPayment`.
2. **Splash conditionnel a l'auth** : la garde devient `if (isResuming && user && !error)` au lieu de `if (isResuming && !error)`. Sinon le loader masquait la modal.
3. **Coupon preserve dans `buildRedirectUrl`** de `PaymentAuthModal` : sans ce fix, un user revenant du magic link perdait le coupon URL -> payait plein prix malgre le -X% promis dans l'email recovery. Bug identifie en testant le mailing perso Maryse Lafleuriere (recovery -50%). Ajout d'une prop `coupon?: string` a `PaymentAuthModal` + propagation dans `loginUrl` et `buildRedirectUrl`.

Impact attendu : tous les futurs leads recovery (cron J+3 + perso) peuvent desormais finaliser leur paiement, alors qu'avant 100% etaient bloques au loader. Equivalent business : recuperer ~16€/lead × 4 abandons/mois.

### Funnel — IAOverlay capture email obligatoire (2026-05-09)

Audit Google Ads + Supabase 2026-05-09 : sur 4 vraies générations issues de la campagne Search/Display, **3 étaient anonymes sans email** (75%) — toutes irrécupérables. Coût : 80€ pour 4 leads dont 3 fantômes.

Cause : `IAOverlay.tsx` (popup déclenchée par le bouton "Créer Itinéraire" du Header) appelait `/api/itinerary/generate` **sans champ email** dans le payload, contrairement à `PreferencesForm.tsx` (landing page) qui l'exigeait. Deux entry points, deux comportements — fix #25 ne couvrait que le second.

Fix : ajout d'un champ email obligatoire dans le step 1 de `IAOverlay.tsx` (entre "Centres d'intérêt" et "Note libre"), aligné sur `PreferencesForm` (même regex `EMAIL_RE`, même copy). Validation bloquante avant l'appel à `/api/itinerary/generate`. Email persisté en `delivery_email` -> recovery cron J+1/J+3/J+7 + magic link checkout fonctionnent désormais pour TOUTES les générations.

L'email saisi n'est pas reset à la fermeture/réouverture de l'overlay (réduction de la friction si l'utilisateur ouvre 2 fois).

### Perf — LCP image + Google Ads lazy (2026-05-05)

PageSpeed perf score 72 → 85 apres bundle split (cf. ci-dessous). Reste 2 pains points : LCP image et Google Ads.

**1. LCP image — delai 3.15s avant load** : le hero `/_next/image?url=...&w=640&q=75` etait optimise on-demand par Vercel Image API (cold cache = 1-3s par variante). Fix : pre-bake de 3 variants statiques (`hero-home-640.webp` 48 KB, `hero-home-1024.webp` 118 KB, `hero-home-1600.webp` 257 KB) servis directement depuis `/imagesHero/` (Cache-Control `immutable` deja en place via `next.config.ts`). HeroSection passe de `next/image` -> `<picture>` + `<source>` + `<img fetchpriority="high">`. Plus 3 `<link rel="preload">` media-queried dans `src/app/page.tsx` pour declencher le download des l'HTML parse, avant meme l'hydration React. Estimation : LCP 3.1s -> ~1.5s.

**2. Google Ads tag charge en first-interaction** : `gtag('config','AW-...')` declenchait un download de `gtag/js?id=AW-...` (133 KB, flag PageSpeed unused JS). Refacto `GoogleAdsTag.tsx` : la commande est maintenant differee jusqu'au premier `scroll/click/touch` ou un fallback idle 8s. Pour le remarketing Google Ads c'est sans cout (les bouncers sans interaction ne sont pas une audience valable de toute facon), mais ca sort completement le payload de la fenetre LCP de Lighthouse.

### Perf — Bundle splitting massif (2026-05-05)

Audit `@next/bundle-analyzer` post-PageSpeed (perf 72/100). Deux coupables identifies :

**1. `country-state-city` (8 MB JSON cities/states)** — embarque dans le First Load de toutes les pages utilisant `CitySelector` (5 pages : `/rencontre/swipe`, `/rencontre/profil/modifier`, `/rencontre/inscription`, `/transport/bus`, `/admin/dating/profiles/add`). Fix : wrapper `next/dynamic({ ssr: false })` autour du composant. Le chunk villes est charge async uniquement quand le selector est rendu, plus dans le bundle initial.

| Page | Avant | Apres | Gain |
|---|---|---|---|
| `/rencontre/swipe` | 2.66 MB | **352 kB** | **−87%** |
| `/rencontre/profil/modifier` | 2.66 MB | **351 kB** | **−87%** |
| `/transport/bus` | 2.6 MB | **278 kB** | **−89%** |

**2. `framer-motion` sur homepage (~40 KB gzip)** — `TrustBadge.tsx` importait `framer-motion` uniquement pour un `motion.div` decoratif (fade-in du `TrustBadgeBar`). Remplacement par une animation CSS pure (`animate-fade-in-up` keyframe Tailwind). Resultat : homepage `/` passe de **282 kB → 243 kB First Load (-14%)**.

Type-check + build OK. Aucune regression visuelle (le fade-in CSS reproduit l'effet framer a l'identique : opacity 0 → 1, translateY 8px → 0, duree 0.4s, ease cubic-bezier).

### Branding — Restauration de l'orange brand sur tous les titres home (2026-05-05)

Suite a l'audit A11y du 2026-05-05, l'agent ui-ux-designer avait introduit `text-accent-strong` (#A85F0A, AA-compliant 5.7:1) sur tous les `<span>` orange des titres home pour passer le test contraste Lighthouse. Hugo : "wouah cette quoi cette couleur caca... je veux retrouver mon orange dans tout les titres".

Decision : **branding > AA strict**. L'orange brand `#F59E0B` (token `--accent`) est restaure sur tous les titres et elements de prix/rating de la home. Lighthouse va re-flagger 18 contrastes mais c'est un trade-off accepte.

`text-accent-strong` token gardé dans `globals.css` pour usage futur si besoin (cas où AA est imperatif). Les autres fixes A11y (zones tactiles 44px, headers h4→h3, ARIA labels Cart, opacity blanches sur scrims sombres) restent en place — ils n'avaient aucun cout visuel.

7 fichiers reverts via sed (text-accent-strong → text-accent) : `BestDealsSection`, `BlogSection`, `InstallerCards`, `ItineraireIABlock`, `LeadMagnetSection`, `RegionCards`, `TestimonialsSection`.

### A11y — 45 violations corrigees suite audit Lighthouse mobile (2026-05-05)

PageSpeed Insights mobile (score 53/100) signalait 4 categories de violations Accessibilite : ARIA invalides, contraste insuffisant, zones tactiles trop petites, headers mal sequences. Audit + fix complet via agent ui-ux-designer (skill `web-design-guidelines`) sans toucher au design existant.

**Score A11y attendu** : 53 → estime 90+ au prochain run Lighthouse.

**Strategy contraste — nouveau token `--accent-strong`** :
Le token `--accent` (orange brand `#F59E0B`) etait utilise pour du **texte** sur fond clair = ratio 2.17:1 (FAIL AA). Probleme historique car ce orange est la signature visuelle Philippineasy.

Solution : ajout d'un token sister `--accent-strong: 28 90% 35%` (≈ `#A85F0A`) — meme famille de teinte, ratio 5.7:1 vs blanc + 5.3:1 vs `#F4F7FE` (AA pass). Le `accent` original reste pour les backgrounds, scrims, decoratifs (ou le contraste vient du `accent-foreground` dark place dessus = 12:1).

`src/app/globals.css` : ajout token `--accent-strong` + utility `.text-accent-strong`.

**Fichiers modifies (17 total) avec compteur par categorie** :

| Categorie | Count |
|---|---|
| Contraste (text-accent → text-accent-strong, low-opacity whites bumped, low-contrast pills darkened) | **18** |
| Zones tactiles (w-9/w-10/w-[38px] → w-11 + min-h-[44px] partout, conformite 44×44px Apple HIG) | **19** |
| Headers (h4 → h3 dans Footer + BlogSection cards + Header notifications dropdown — fixes la sequence h1→h2→h3 sur la home) | **4** |
| ARIA labels (Cart trigger, Cart close, trash buttons — manquaient totalement) | **3** |
| Page outline (TestimonialsSection : kicker "Ils ont choisi les" duplique avec h2) | **1** |

**Composants impactes** :
- Homepage : HeroSection (3 white-opacity bumps + star color), InstallerCards / RegionCards / ItineraireIABlock / TestimonialsSection / BestDealsSection / BlogSection / LeadMagnetSection / RencontresTeaser / FinalCtaSection (text-accent → text-accent-strong sur les h2 spans)
- Layout : Header (icon buttons 36→44px), Footer (social links 38→44px, newsletter input/btn min-h-[44px], h4→h3), Cart (aria-label sur 3 boutons), WeatherTicker (text-white/45 → /75 = 8:1), CookieBanner (5 btns py-2 → min-h-[44px])
- IAOverlay : modal close 36→44px

**Volontairement non-modifie** (justifie dans le rapport agent) :
- Le brand token `--accent` reste intact (Hugo : "pas de redesign")
- Breadcrumb `aria-current="page"` sur `<li>` (valide WAI-ARIA 1.2)
- Footer bottom legal links a 12px (pattern accepte si focus-visible OK)
- `role="radio"` + `aria-checked` dans IAOverlay step 2 (pattern valide)

**Bonus performance** : la simplification de TestimonialsSection (1 kicker au lieu de 2) economise ~50 lignes de markup repete.

Type-check + ESLint pass.

### SEO — Filtres qualite forum + marketplace dans le sitemap (2026-05-05)

Suite a l'audit "Discovered, currently not indexed" sur GSC (~56 pages flaggees), diagnostic DB :
- 7 forum sujets : tous avec **0 view + 1 post (initial)** = thin content
- 7 forum categories : toutes avec 1 topic seulement (le seed initial) = thin
- 1 produit marketplace + 1 categorie marketplace
- => 16 pages thin pollutent le sitemap, plombent la qualite percue du domaine par Google.

**Pattern existant** (deja applique aux categories articles via `publishedCategoryIds`) etendu aux 4 types :

`src/app/sitemap.ts` — 4 filtres qualite ajoutes :

1. **Forum sujets** : switch `forum_topics` -> `forum_topics_with_stats` (vue avec reply_count + view_count). Filtre : `reply_count >= 1 OR view_count >= 20`. Sujet seed sans engagement -> exclu jusqu'a activite reelle.

2. **Forum categories** : switch `forum_categories` -> `forum_categories_with_stats`. Filtre : `topic_count >= 2`. Une categorie ne mediant qu'un seul topic (le seed) reste hors sitemap. lastModified ameliore avec `last_post_timestamp` (vraie fraicheur).

3. **Produits marketplace** : ajout `.eq('status', 'published')`. Skip drafts/pending/sold. Selectionne aussi `category_id` pour le filtre suivant.

4. **Categories marketplace** : pattern `publishedProductCategoryIds` (Set des category_ids ayant au moins 1 produit publie). Categorie vide -> exclue.

**Comportement self-managing** : quand un sujet recoit sa 1ere reponse / une categorie son 2eme sujet / un produit publie / une categorie marketplace son 1er produit, le prochain Vercel ISR rebuild (10 min) les inclut automatiquement dans le sitemap. Aucun follow-up manuel.

**Impact attendu** :
- ~14-16 URLs thin retirees du sitemap (sur 130 -> ~115 entries)
- Signal qualite domaine ameliore : Google voit moins de "Discovered not indexed" stat
- Crawl budget mieux alloue aux pages qui meritent indexation
- Pages exclues du sitemap restent **accessibles via menu/internal linking** (juste pas crawlees prioritairement)

Type-check pass.

### SEO — Cannibalisation : 301 redirects + status draft sur 2 articles doublons (2026-05-05)

L'agent SEO de la session precedente avait detecte 2 doublons qui cannibalisaient les articles refondus aujourd'hui. Resolus avec le pattern habituel (cf. precedent "Phase E SEO 2026-04-27" rencontre).

**Articles passes en `status='draft'`** (UPDATE Supabase) :
- `#45` `bohol-chocolate-hills-tarsiers-plages-panglao` (7K chars) -> doublon de #105 winner (33K chars)
- `#115` `guide-ultime-explorer-siquijor-philippines-logement` (10K chars) -> doublon de #46 winner (24K chars)

Effet du status=draft :
- `articleService.ts` filtre `.eq('status', 'published')` -> ces 2 ne sont plus servis (404 par la route normale)
- `sitemap.ts` filtre pareil -> retires automatiquement du sitemap au prochain build
- DB conserve l'historique (rollback toujours possible via UPDATE status='published')

**Redirects 301 ajoutes dans `next.config.ts`** (zone "Cannibalisation Bohol/Siquijor Phase F SEO 2026-05-05") :
- `/voyager-aux-philippines/cebu-visayas/bohol-chocolate-hills-tarsiers-plages-panglao` -> `/voyager-aux-philippines/cebu-visayas/visiter-bohol-philippines-guide-complet-2026`
- `/voyager-aux-philippines/cebu-visayas/guide-ultime-explorer-siquijor-philippines-logement` -> `/voyager-aux-philippines/cebu-visayas/siquijor-mystique`

**Court-circuit chain detecte et corrige** : un redirect existant (ligne 173) pointait `/actualites-sur-les-philippines/actualites/guide-ultime-explorer-siquijor-philippines-logement` -> `/voyager-aux-philippines/cebu-visayas/guide-ultime-explorer-siquijor-philippines-logement` (notre nouveau doublon). Risque de chain 301 -> 301 que Google penalise. **Fix** : destination de ce redirect mise a jour pour pointer directement sur `/siquijor-mystique` (winner final).

Resultat :
- Toute requete sur les anciennes URLs doublons -> 301 vers le bon article
- Jus SEO des backlinks externes preserve
- Aucune chain redirect (1 hop max)
- Sitemap nettoye automatiquement

Type-check pass. Vercel rebuild applique les redirects au niveau edge.

### SEO — Refonte de 3 articles "Crawled - currently not indexed" (2026-05-05)

3 articles Philippineasy avaient ete crawles par Google mais **rejetes a l'indexation** (memory project Hugo : ils avaient ete generes par ChatGPT via workflow n8n -> contenu trop similaire a d'autres articles existants ailleurs sur le web).

Refonte complete via agent SEO senior (skills `seo-audit`, `content-research-writer`, `programmatic-seo`, `copywriting`) avec recherche WebSearch + WebFetch pour vraies sources autoritatives.

**Articles refondus** (UPDATE applique en prod via Supabase Management API) :

| Slug | Avant | Apres |
|---|---|---|
| `siquijor-mystique` (id 46) | Title generique "L'Île Mystique et Chutes d'Eau Secrètes", 7K chars, 3 min | **"Siquijor Philippines : guide pratique 2026 (ferry, plages, mananambal)"**, 24K chars, 76 blocks, 15 min |
| `meilleures-plages-philippines-2025` (id 64) | Title "Trésors Cachés et Incontournables", 10K chars, 3 min | **"Plages des Philippines : top 12 testées (prix, accès, foule)"**, 27K chars, 93 blocks, 16 min |
| `visiter-bohol-philippines-guide-complet-2026` (id 105) | Title "Le Guide Ultime", 25K chars mais NON indexe | **"Bohol Philippines : itinéraire 5 jours testé (Geopark UNESCO)"**, 33K chars, 107 blocks, 20 min |

**Ameliorations communes** :
- Titles uniques anti-pattern overused (≤ 60 chars sauf Siquijor 70 chars sous limite Google 600px)
- Lead paragraphs ancres terrain ("J'ai debarque...", prix exacts PHP, dates concretes)
- Structures EditorJS riches : H2/H3 logiques, tableaux comparatifs (genere featured snippets), listes structurees, FAQ block compatible schema.org
- 5-7 sources externes autoritatives par article (gov.ph, UNESCO, PAGASA, France Diplomatie, Bureau of Immigration, Wikipedia FR)
- 5-8 internal backlinks par article vers autres pages Philippineasy (cebu-visayas, surf siargao, vols intérieurs, SIM, assurance, budget 35€/jour, etc.)

**Backups** : avant les UPDATE, 3 fichiers `/tmp/article-backups-20260505/article-{46,64,105}-backup.json` contiennent les anciens content jsonb (rollback possible si besoin).

**SQL files** : `/tmp/article-rewrite-{siquijor,plages,bohol}.sql` (88K total) — non commit (gitignored par convention pour les seeds large + non standard).

**Action manuelle Hugo requise** :

1. **GSC Request Indexing** sur les 3 URLs refondus (web UI uniquement, pas d'API) :
   - https://philippineasy.com/voyager-aux-philippines/cebu-visayas/siquijor-mystique
   - https://philippineasy.com/voyager-aux-philippines/conseils-voyage/meilleures-plages-philippines-2025
   - https://philippineasy.com/voyager-aux-philippines/cebu-visayas/visiter-bohol-philippines-guide-complet-2026

   Process : GSC -> Inspection URL -> coller URL -> "Demander une indexation". Limite ~10/jour. Acceleration de 2-3 semaines a 1-3 jours pour le re-crawl.

2. **CRITIQUE — DOUBLONS de contenu detectes par l'agent** (vrai bug SEO ancien, non resolu par cette refonte) :
   - Article `#45 (bohol-chocolate-hills-tarsiers-plages-panglao)` est un DOUBLON de `#105` (cannibalisation Bohol)
   - Article `#115 (guide-ultime-explorer-siquijor-philippines-logement)` est un DOUBLON de `#46` (cannibalisation Siquijor)
   - **Action recommandee** : 301 redirect du #45 -> #105 et #115 -> #46, ou fusion contenu. A faire dans une session dediee (necessite ajout de redirect dans `next.config.ts`).

3. **Mini-bug `<title>` duplique "Philippin'Easy | Philippin'Easy"** (visible sur les 3 articles) — a corriger plus tard dans le composant article qui injecte le site name 2x dans le title.

### SEO — Ajout de 10 pages hubs au sitemap (2026-05-05)

Suite a l'audit GSC qui montrait `/partenaires` + 9 hubs `/voyager-aux-philippines/{categorie}` comme **UNKNOWN to Google**, fix dans `src/app/sitemap.ts` apres verification :
- Toutes les 10 URLs verifiees HTTP 200 + meta robots `index, follow`
- DB Supabase confirmee (table `pages` ne contenait pas ces sections)
- Format des entries coherent avec l'existant (lastModified `2026-04-15`, changeFrequency `monthly`, priority 0.6-0.7)
- Type-check pass

**Nouvelles entries** (11 lignes ajoutees) :
- `staticPages` : `/partenaires` (priority 0.7)
- `subPages` voyager-aux-philippines :
  - Destinations principales (priority 0.7) : `/palawan`, `/cebu-visayas`, `/siargao`
  - Guides pratiques (priority 0.7) : `/budget`, `/conseils-voyage`
  - Guides pratiques (priority 0.6) : `/transport`, `/sante-securite`, `/communication`, `/quand-partir`

**Pourquoi c'est important** : ces hubs portent le **internal linking** vers les articles enfants (38 articles voyager-aux-philippines deja dans le sitemap). Sans hubs dans le sitemap, Google decouvre lentement via menu/breadcrumb. Ajouter accelère significativement l'indexation des hubs ET renforce le jus SEO transmis aux articles enfants.

**Bonus** : `rm -rf .next/types/` pour nettoyer le cache de build qui referencait encore l'ex-news-sitemap.xml supprime au commit precedent.

### SEO — Audit GSC + suppression news-sitemap.xml fantome (2026-05-05)

Audit complet via API Google Search Console (read-only sauf cleanup news-sitemap). Findings :

**A — news-sitemap.xml fantome supprime** :
- La route `src/app/news-sitemap.xml/route.ts` existait encore et generait dynamiquement un sitemap depuis `articles WHERE published_at > now() - 48h` (fallback 7j)
- Tous les fallbacks retournaient 0 articles -> sitemap repondait HTTP 200 avec `<urlset></urlset>` vide
- GSC le tracait depuis oct 2025 avec "4 URLs submitted, 0 indexed" (URLs fantomes)
- Memory disait "retire du robots.txt" mais le fichier physique etait toujours servi
- **Action** : `rm -rf src/app/news-sitemap.xml/` + `mcp__google-search-console__delete_sitemap` cote GSC

**B — Audit canonical sur 2 pages potentiellement diluees (RAS, deja OK)** :
- `investir-aux-philippines-guide-francais-2025` apparaissait 15+ fois dans GSC search analytics
- `guide-rencontrer-femmes-philippines-conseils-et-astuces` apparaissait 7 fois
- Verifications effectuees :
  - DB Supabase : un seul article par slug (pas de doublon DB)
  - HTML rendu : `<link rel="canonical">` correctement defini sur clean URL
  - Test avec `?utm_source=test` : canonical reste pointe sur clean URL ✅
  - Trailing slash `/url/` : redirect 308 vers `/url` ✅
  - GSC URL inspection : `Google Canonical` = clean URL ✅, `Indexing Status: PASS`, `Submitted and indexed`, Rich Results Breadcrumbs
- **Verdict** : pas de bug actuel. Les 15+ variantes diluees sont des **artefacts historiques** d'un bug canonical resolu (memory `feedback_seo_canonical_bug.md`). Google consolidera naturellement vers le canonical (peut prendre des mois). Aucun fix code requis.

**Etat global indexation** :
- 119 URLs dans sitemap.xml, 0 errors
- 81 pages "non indexees" dans GSC : 56 "Detectee" + 25 "Exploree"
- Pages cle indexees : home (Rich Results FAQ), `/itineraire-personnalise...` (position 3.9), `/rencontre-philippines`, `/marketplace-aux-philippines`
- Top SEO asset : `/vivre-aux-philippines/travail-entreprise/investir-aux-philippines-guide-francais-2025` (24 clics, 841 impressions, 2.85% CTR, position 6.9 sur 28 jours)
- Pages anormalement UNKNOWN (a investiguer plus tard) : `/partenaires`, `/voyager-aux-philippines/budget`, `/voyager-aux-philippines/destinations/{palawan,cebu-visayas,siargao}`
- Nouvelles destinations crees hier `/itineraire-{slug}` : DISCOVERED ou UNKNOWN, `Last Crawl: Never` — sera indexe sous 24h-2sem (sitemap soumis)

### UI/UX — Refonte complete des pages articles destinations (2026-05-05)

Suite a la critique Hugo : *"très IA, on voit tout de suite que c'est de l'IA génération... ça fait des blocs à lire"*. Refonte complete des 7 fichiers (page + 6 composants) pour aligner sur le langage visuel home : gradient `#3B5BDB → #1e40af`, cercles dashed decoratifs (signature pattern), eyebrow uppercase + accent `✦`, typo `letterSpacing: -0.02em`. Plus aucun `bg-blue-500` Tailwind par defaut.

**5 decisions cles** :

1. **DayCard reimagine avec timeline verticale dashed bleue** entre jours + chiffre `J{n}` en pill orange cerclee (style HowItWorks home). Chaque activite = sous-card distincte avec numero circule, image WebP 80-96px arrondie, pills duree/cout aux tons primary/accent. Footer transport/hebergement/repas en grid 3 cols. Plus de "mur de texte par jour" critique par Hugo.

2. **Budget reinvente en 3 cards horizontales** (Backpacker/Mid-range/Luxe) avec mid-range highlighted gradient bleu + badge orange "Recommande" + barres CSS pures proportionnelles. Le table generique est mort.

3. **Rythme de sections alternees** `bg-background` ↔ `bg-soft-blue` avec `py-14 md:py-18`, eyebrow `✦` systematique avant chaque H2, max-width contextuelles (3xl intro, 4xl itineraire, 5xl budget, 6xl related).

4. **Hero plein ecran 78vh** avec photo dominante + overlay gradient sombre + cercles dashed signature + eyebrow + H1 accent jaune sur "jour par jour" + 3 pills horizontaux (duree/budget/saison) + CTA orange brand.

5. **CRO baked-in** : CTA inline mid-itineraire (insertion auto entre J{n/2} et J{n/2+1} si ≥5 jours), CTA hero avec ancre #itineraire-jour-par-jour, related cards avec photo dominante 4/3 + nom en overlay (style RegionCards), final CTA full block reprenant `ItineraireIABlock`.

**Mobile-first** : hero 78vh photo plein ecran, day cards stack vertical, budget 3 cards stack, FAQ accordion (premier item ouvert), related grid 1 col photo 4/3 dominante.

**Desktop ≥1024px** : hero max-w-6xl avec cercles dashed visibles, day cards max-w-4xl avec timeline dashed verticale, budget grid 3 cols horizontal, related grid 3 cols.

7 fichiers (595 → 1372 lignes) : `src/app/itineraires/[slug]/page.tsx`, `src/components/destinations/{ItineraryHero, ItineraryDayCard, BudgetTable, FAQSection, RelatedItineraries, Breadcrumb}.tsx`.

Type-check + ESLint pass.

### SEO — Sitemap soumis a Google Search Console (2026-05-05)

Apres publication des 4 nouveaux articles destinations, sitemap `https://philippineasy.com/sitemap.xml` re-soumis a GSC via API (`mcp__google-search-console__submit_sitemap`). Status : Pending processing. Les 5 URLs `/itineraire-{slug}` + le hub `/itineraires-philippines` seront indexees Google sous 24h-2 semaines (suivant priorite GSC).

### SEO — Publication des 4 articles destinations + heroes WebP (2026-05-05)

Apres fact-check + corrections + traitement images, **4 articles passes en `published=true`** via Supabase Management API. Le sitemap dynamique inclut maintenant 5 articles destinations (palawan + cebu + siargao + boracay + philippines-2-semaines) + le hub `/itineraires-philippines`.

**URLs publiques live (HTTP 200 verifies)** :
- https://philippineasy.com/itineraire-palawan (deja live)
- https://philippineasy.com/itineraire-cebu (NOUVEAU)
- https://philippineasy.com/itineraire-siargao (NOUVEAU)
- https://philippineasy.com/itineraire-boracay (NOUVEAU)
- https://philippineasy.com/itineraire-philippines-2-semaines (NOUVEAU)
- https://philippineasy.com/itineraires-philippines (hub avec les 5 cards)

**Heroes WebP** ajoutes dans `public/imagesHero/` :
- `siargao-surf-philippines.webp` (266K, 1448x1036, coucher de soleil + bangka + surfeurs)
- `cebu-island-philippines.webp` (331K, 1717x866, lagune turquoise karst calcaire)
- `boracay-white-beach.webp` (244K, 1408x718, scene nocturne D-Mall)
- `philippines-itineraire-multi-iles.webp` (89K, 1408x718, trekking dans les nuages)

Pipeline traitement : crop bottom 50px (watermark Gemini) -> cwebp q82 m=6 mt -> ~85-95% reduction taille vs PNG source.

**SEO ouverture** :
- Sitemap.xml inclut maintenant les 5 itineraires + hub (priority 0.85, changeFrequency monthly)
- Vercel rebuild automatique au prochain git push (le commit CHANGELOG declenche un deploy qui regenere sitemap.ts)
- Volume de recherche FR cible cumule : ~6-15k/mois (palawan ~1-3k + cebu ~500-1.5k + siargao ~300-800 + boracay ~200-600 + philippines-2-semaines ~2-5k)
- A faire manuellement plus tard : soumettre le sitemap a Google Search Console (gsc.google.com -> Sitemaps -> Submit) pour acceleration indexation.

**Hugo manual followup** :
- Verifier rendu mobile/desktop sur les 5 pages
- Spot-check les claims terrain (3 hostels non verifies par fact-check : Chief Mau Backpackers Moalboal, Bohol Beach House Hostel Alona, Hop Hostel Coron)
- Si une image hero ne plait pas (Boracay AI a genere du texte sur les enseignes), regenerer + reprocessing

### SEO — Fact-checks corrections sur 4 articles destinations (2026-05-05)

Suite a un audit complet via WebSearch + WebFetch sur 7 claims des 4 articles. **3 erreurs critiques + 3 corrections moyennes** appliquees aux seed files locaux ET en prod (DELETE + INSERT, articles toujours `published=false`). Le seul article `published=true` reste Palawan (intact).

**Erreurs critiques corrigees** :
- ❌ **Caticlan-Boracay fees** : article disait "terminal 100 + env 75 + ferry 50 = 225 PHP" mais reality 2026 = **150 + 300 (touriste etranger) + 50-100 = ~500 PHP**. Aurait induit en erreur les voyageurs au point de cash de ~250 PHP/personne. Corrige dans `boracay.sql` (description Day 1) et `philippines-2-semaines.sql` (Day 13). Cost ranges adaptes : "350-500 PHP" -> "500-650 PHP".
- ❌ **Mad Monkey Boracay** : ferme depuis 2022. Le hostel etait recommande dans le seed. Remplace par Frendz Resort Station 1 + Boracay Backpackers Station 3 + mention que Mad Monkey a ferme + alternative MNL Beach Hostel / Stoke Travel Station 2. Source : hostelgeeks.com.
- ❌ **Malapascua threshers Monad Shoal** : depuis 2022 les threshers ont migre a **Kimud Shoal** (plus accessible, 15-20m, Open Water suffit avec instructeur). Monad Shoal reste plonge mais plus pour threshers + Advanced Open Water requis (25-30m). Article clamait "Open Water minimum a Monad" — incorrect. Corrige dans `cebu.sql`. Sources : thresher-shark-divers.com, zubludiving.com.

**Corrections moyennes** :
- ⚠️ **El Nido ETDF** : ordonnance municipale 2024 a fixe le tarif a **400 PHP** (vs 200 PHP historique) mais application varie selon operateurs. Article mentionnait juste 200 PHP — mis a jour avec range "200-400 PHP" et explication de l'incertitude. Source : elnido.gov.ph (ordonnance 01 Series of 2024).
- ⚠️ **Ferry El Nido-Coron** : prix corrige de "1800 PHP" a "1500-3000 PHP selon operateur" (Montenegro 1500-2000 PHP @3h30 vs Atienza ~3000 PHP @4-5h). Horaires precises (Montenegro 6h, Atienza 12h). Sources : atienzainterislandferriesinc.com, bookaway.com.
- ⚠️ **Cebu→Siargao** : "~50€ A/R" -> "60-80€ A/R" (KAYAK / Cebu Pacific 2026 actual data).

**Verifications validees sans changement** :
- ✅ Visa extension fee BoI ~3000 PHP (reality PHP 3,030 confirmee)
- ✅ Hostels actifs verifies : Mad Monkey Cebu City (note : Adults Only depuis), Harana Surf Resort Siargao, Spin Designer Hostel El Nido, Casa Kalaw, Frendz Resort Boracay, Z Hostel Manille
- ✅ Prix vols domestiques 2026 : Manille-Cebu, Manille-Caticlan, Manille-PPS dans la fourchette correcte de l'article

**Hostels non verifies explicitement** (Hugo doit confirmer terrain) : Chief Mau Backpackers (Moalboal), Bohol Beach House Hostel Alona, Hop Hostel Coron.

### SEO — 4 articles programmatiques destinations en attente de relecture (2026-05-05)

Pour exploiter le volume SEO francais (estime 6-15k recherches mensuelles) sur les destinations Philippines, 4 articles long-form rediges en style backpacker authentique et inseres en `published=false` (invisible publiquement, le service `destinationItinerariesService` filtre `published=true` partout).

**Fichiers seed crees** dans `supabase/seeds/` (~14 600 mots cumules) :
- `destination_itineraries_cebu.sql` (~3460 mots, 8 jours, hub Visayas + plongee Malapascua + sardines Moalboal + Bohol)
- `destination_itineraries_siargao.sql` (~3250 mots, 7 jours, surf capital + digital nomad scene)
- `destination_itineraries_boracay.sql` (~2850 mots, 5 jours, hook contrarian "comment faire backpacker dans une ile resort")
- `destination_itineraries_philippines-2-semaines.sql` (~5070 mots, 14 jours, multi-iles le plus gros volume SEO ~2-5k recherches/mois)

**Style editorial** (Hugo : "style backpacker authentique, pas court") : voix terrain "j'y etais", prix exacts PHP + EUR conversion, noms d'hostels / guesthouses (Spin Designer, Harana, Mad Monkey, etc.), conseils pratiques sur scams, cash, GCash, ferries reservation, eau filtree, scooter negociation. Honnete sur les challenges (typhon Odette Siargao, ethique whale sharks Oslob avec alternative Donsol, fermeture Boracay 2018). FAQ riche (8-12 questions par article au lieu de 5 sur Palawan), 10-15 practical_tips par destination.

**Skills appliques** (lus avant redaction) : `programmatic-seo` (structure + meta titles), `content-research-writer` (depth), `copywriting` (voice), `seo-audit` (keywords).

**Application en prod** : 4 INSERT via Supabase Management API, table `destination_itineraries` contient maintenant 5 rows (palawan published + 4 nouveaux unpublished). Sitemap dynamique exclut automatiquement les unpublished.

**Workflow Hugo restant** :
1. Relire les seeds en local pour fact-check (prix vols domestiques 2026, environmental fees El Nido, ferry Atienza/Montenegro, hostels nommes encore actifs)
2. Eventuellement ajouter ses anecdotes terrain personnelles (l'agent a respecte la consigne "ne pas inventer")
3. Remplacer les hero_image placeholder (`/imagesHero/{slug}.webp`) par vraies photos terrain quand dispo
4. Flip `published = true` quand satisfait : `UPDATE destination_itineraries SET published = true WHERE slug = '...'` via Dashboard SQL Editor

### Payment — Auto-apply RELANCE10 coupon via URL (PaymentIntent + email J+3) (2026-05-04)

Stripe PaymentIntents ne supportent pas les promo codes nativement (vs Checkout Sessions). Pour faire fonctionner `RELANCE10` dans l'email recovery J+3 sans refactor du flow, le coupon est applique **automatiquement via parametre d'URL** plutot que par saisie manuelle. Zero friction, zero risque de typo cote user.

**`/api/itinerary/payment/route.ts`** :
- Accepte un nouveau champ `coupon` optionnel dans le body
- Si present : `stripe.coupons.retrieve(coupon)` + validation (`valid`, `percent_off > 0 && < 100`, montant final >= 50c minimum Stripe)
- Applique le discount manuellement : `amountInCents = Math.round(originalAmountCents * (1 - percent_off / 100))`
- Audit metadata sur le PaymentIntent : `coupon_applied`, `discount_percent`, `original_amount_cents`
- **Strategie LENIENT critique** : tout echec de validation (coupon inexistant, expire, malformé, montant trop bas, Stripe API down) -> log warning + paiement plein prix sans erreur user. **L'utilisateur n'est jamais bloque par un coupon foireux** -- la livraison de l'itineraire post-paiement reste prioritaire (cf. webhook delivery chain).
- Response inclut `coupon_applied` + `discount_percent` + `original_amount` pour transparence cote frontend.

**`src/emails/senders/itinerary-recovery.ts`** (email J+3) :
- `buildResumeUrl` accepte un parametre `coupon` optionnel (ajoute `&coupon=<code>` a l'URL si present)
- Email J+3 reformule : plus de "saisissez RELANCE10 manuellement", remplace par badge "-10% inclus" + CTA "Profiter de l'offre" qui contient le param coupon dans son URL. Preheader mis a jour.

**`page.tsx`** : `triggerPayment` accepte coupon arg et le passe dans le POST body. `resumePayment` useEffect lit `?coupon` depuis searchParams et le propage.

**Stripe state** :
- Coupon `RELANCE10` cree sur compte live `acct_1RgU2WRxqcfmHXQY` (10% off, duration `once`, no max redemptions, metadata purpose/stage trackees)
- Promotion code `RELANCE10` cree (lie au coupon, actif). Garde en reserve si Hugo migre vers Checkout Sessions plus tard ou pour cas support client.

**Garantie 0 regression delivery** : le webhook `payment_intent.succeeded` chain (dispatchItineraryReadyEmail + handleAnonymousItineraryPurchase) ne depend pas du coupon — il fonctionne identiquement quel que soit le montant paye. L'email itineraire, le profil, le PDF (Premium+), et Telegram sont tous livres aussi bien avec qu'avant le coupon.

### Marketing — Cron de relance pour itineraires abandonnes (2026-05-04)

Sequence de 3 emails de relance pour les utilisateurs qui ont genere un itineraire IA
(formulaire rempli + 3 propositions vues) mais n'ont pas finalise le paiement
(payment_status = 'pending', delivery_email presente).

**Pourquoi** : les paniers abandonnes e-commerce convertissent typiquement a 15-30% avec une sequence email bien congue. Ici l'intention est forte (l'utilisateur a rempli le formulaire ET vu les 3 propositions), la friction principale est le passage a l'acte paiement. La sequence adresse les 3 moments psychologiques cles : rappel de valeur (endowment effect), levier prix (reciprocite + regle des 100), et urgence douce (loss aversion tempere).

**Fichiers crees** :
- `supabase/migrations/20260504_recovery_email_columns.sql` : 3 colonnes `recovery_email_*_sent_at` + index partiel sur `(payment_status, created_at) WHERE pending AND delivery_email IS NOT NULL`
- `src/emails/senders/itinerary-recovery.ts` : 3 fonctions `sendRecoveryEmail24h/72h/7d` avec copy francophone soignee
- `src/app/api/cron/recover-itineraries/route.ts` : cron idempotent avec pattern claim-before-send (UPDATE ... IS NULL ... RETURNING pour eviter les doublons si le cron tourne en parallele)

**Fichiers modifies** :
- `vercel.json` : ajout du cron `recover-itineraries` a 09:00 UTC (11:00 Paris)
- `CHANGELOG.md` : ce bloc

**Sequence** :
- Email #1 (J+1 a J+3) : "Votre itineraire Philippines vous attend" — rappel valeur, zero pression
- Email #2 (J+3 a J+7) : "Un petit cadeau pour finaliser votre voyage" — coupon RELANCE10 (-10%, 24h)
- Email #3 (J+7 a J+14) : "Derniere chance pour votre itineraire Philippines" — urgence douce (suppression donnees), touche personnelle Hugo

**Action manuelle requise avant mise en prod** :
1. Appliquer la migration SQL via Supabase Dashboard SQL Editor
2. Creer le coupon Stripe `RELANCE10` : type percentage, value 10%, duration once, no expiry date (la limite de 24h est communicationnelle, pas technique — Stripe ne supporte pas les coupons auto-expirables a la minute pres sans webhook supplementaire)
3. Verifier que `CRON_SECRET` est bien defini dans les env vars Vercel

### Operational — Optimisations Google Ads (hors code, 2026-05-04 PM)

Actions appliquees dans Google Ads UI suite a l'audit des 3 fichiers `Recommandations concernant la campagne+2026-05-04-*.xlsx` :

**SEARCH_Brand** (score 76.4% -> ~85% attendu) :
- Suppression sitelink "Rencontre" (refuse par Google : Services de rencontres et de compagnie sans certif)
- Annonce reformulee pour retirer le mot "rencontre" trigger (description #2 : "Itineraires IA rencontre services et marketplace" -> "Itinéraires IA, communauté expat, bons plans")
- Ajout extraits structures Destinations (Palawan, Cebu, Bohol, Siargao, Manille, Boracay, El Nido, Coron, Davao)
- Ajout extensions de prix Services (Express 9,99€ / Premium 29€ / Conciergerie 79€ — qualificateur "À partir de")
- Ajout images photos Philippines aux annonces

**SEARCH_Itineraire_IA** (score 83.6% -> ~88% attendu) :
- Suppression sitelink "Rencontre Philippines" refuse
- AI Max for Search **desactive** (toggle Paramètres -> AI Max OFF). Eliminait des 84 clics / 12,49€ par semaine de "Correspondances etendues automatiques" sur des recherches sans rapport.
- **Reseau Display desactive** dans les Reseaux de la campagne (n'etait pas que Search malgre le nom — diffusait aussi en banniere sur sites random). Economise ~12€/semaine de trafic poubelle.
- Pause des 2 mots-cles les plus couteux sans conversion : `"guide philippines"` (3,12€ / 6 clics) + `"vacances philippines"` (2,26€ / 3 clics)
- Ajout 17 nouveaux mots-cles (14 phrase + 3 exact), reparti dans `Phrase_Voyage_PH` et `Exact_Itineraire`, listes complètes dans `~/Desktop/keywords-bulk-import-2026-05-04.csv`
- Ajout 18 mots-cles negatifs niveau campagne (`gratuit`, `escort`, `agence voyage`, `visa`, `casino`, etc.) — `~/Desktop/keywords-negatives-bulk-2026-05-04.csv`
- Ajout extraits structures Destinations (idem SEARCH_Brand)
- Ajout images aux annonces

**DISPLAY_Remarketing** (score 90.2%, presque rien a faire) :
- Reactivee
- Recommandation pendante : exclusions placements (Sujets : Jeux, Religion, Loteries — cf. memory `project_google_ads_pending_actions.md`). A faire dans 7-14 jours quand on aura plus de data.

**Suivi conversions** :
- Conversion `Site web Philippines (web) purchase` deja correctement importee depuis GA4 (verifie : Source = Google Analytics (GA4), Optimisation = Achats / Action principale, Attribution = Basee sur les donnees, Periode 90j). Le warning "suivi non termine" persiste tant qu'aucune vraie conversion n'a ete enregistree post-fix funnel.

**A surveiller** : si SEARCH_Itineraire_IA continue a depenser ~5-10€/jour sans conversion sous 7 jours, baisser le budget de 10€ a 5€/jour et analyser les nouveaux search terms dans le rapport pour ajouter d'autres negatifs.

### Infra — Migration tunnel n8n vers `n8n.adascanpro.com` (2026-05-04)

- Le domaine `hugogotophilippines.com` (qui ne servait QUE de hostname pour le tunnel Cloudflare exposant le n8n local sur port 5678) a expire et CF demandait un renouvellement annuel a ~12$/an. Migre vers un sous-domaine d'un autre domaine deja possede et inutilise (`adascanpro.com`, abandonne suite a echec d'un autre projet) -> economie perpetuelle.
- Tunnel CF recree sur le compte CF qui possede `adascanpro.com` (compte V4724408). Le routage cross-account d'un tunnel n'est pas autorise sans Cloudflare for SaaS, donc impossible de garder l'ancien tunnel et juste pointer un nouveau CNAME : recreation complete necessaire.
- Etapes effectuees (script `~/.cloudflared/`) : backup ancien `cert.pem` + creds + `config.yml` (suffix `.bak.20260504`), `cloudflared tunnel logout` + `tunnel login` interactif sur le bon compte, `cloudflared tunnel create n8n-hugo` (nouveau UUID `47a957ea-794c-4d7a-b6bb-ba2dff612794`), `tunnel route dns` (record DNS edite manuellement car le CLI n'ecrasait pas le CNAME pre-existant), `config.yml` reecrit avec nouveau tunnel + ingress unique sur `n8n.adascanpro.com`, launchagent macOS `homebrew.mxcl.cloudflared.plist` corrige avec les bons args (le brew service par defaut lancait `cloudflared` sans arguments -> exit immediat, pas de restart au reboot).
- Code Philippineasy : 2 fallback URLs `N8N_ITINERARY_GENERATE_URL` + `N8N_ITINERARY_DELIVER_URL` mises a jour vers `https://n8n.adascanpro.com/webhook/...`. Aucune env var `N8N_*` cote Vercel (verifie via `vercel env ls`), donc pas d'edit Vercel necessaire.
- A faire manuellement plus tard : ne pas renouveler `hugogotophilippines.com` (laisser expirer), supprimer l'ancien tunnel sur le compte hugosthaijourney apres validation du flow, supprimer 2 CNAME bidons `n8n.philippineasy.com.hugogotophilippines.com` + `n8n.adascanpro.com.hugogotophilippines.com` que le CLI a crees lors des essais (cosmetique).

### UX — Polish funnel resume_payment post-magic-link (2026-05-04)

- **Splash plein ecran pendant le resume_payment** : l'ancien comportement faisait flasher le formulaire vide pendant 200-500ms (le temps de la propagation auth + appel API), avec une banniere d'erreur rouge transitoire avant que le second render reussisse et redirige vers Stripe. Refactor dans `page.tsx` : si `searchParams.get('resume_payment')` ET pas d'erreur definitive, on remplace tout le rendu par un loading splash centre avec spinner + "Préparation de votre paiement — On vérifie votre commande et on vous redirige vers Stripe". L'utilisateur voit un loader propre puis Stripe.
- **Retry silencieux sur 401/403 dans `resumePayment`** : la session auth post-magic-link prend ~200-500ms a se propager cote API. La 1ere tentative de fetch `/api/itinerary/generation/[id]` etait souvent un 401 transitoire qui setait l'erreur avant que le re-render reussisse. Ajout d'un retry silencieux jusqu'a 3 tentatives (backoff 300ms puis 700ms) avant d'afficher la moindre erreur. Cancellation flag dans la cleanup de l'effect pour eviter setState apres unmount. Message d'erreur final pour 401 definitif change en "Session expirée" (plus actionnable que "réessayez depuis le début").
- **Banniere d'erreur sticky en haut de page** + auto-scroll : le rate limit 429 (limite IP 2 paiements/semaine) etait affiche dans `PreferencesForm` tout en bas, invisible sans scroll. Cout ~1h de "le magic link marche pas" alors que tout fonctionnait, juste l'erreur etait cachee. Banniere `role="alert" aria-live="assertive"` rouge sticky dismissible (×) + `useEffect` qui scrolle au top quand `error` change. `triggerPayment` distingue maintenant 429/`RATE_LIMIT_EXCEEDED` avec message explicite ("Vous avez atteint la limite de tentatives de paiement (2 par semaine). Reessayez plus tard ou contactez-nous.") au lieu du generique "Erreur lors du paiement".

### Marketing — P0 + P1 CRO (3 agents marketing reviewed) (2026-05-04)

Synthese de 3 agents (copywriting, funnel/CRO, pricing-strategy) qui ont audite la modal de confirmation. Convergence sur 3 axes : copy trop transactionnel ("Continuer vers le paiement" alors que l'etape suivante est un email), 2 modales sequentielles trop friction pour un ticket impulse a 9.99€, Express framing punitif (5 inclus / 4 non-inclus + bandeau + checkbox = 4 signaux de doute consecutifs).

P0 (impact estime cumule +30-40%) :

- **CTA principal** : "Continuer vers le paiement" -> **"Recevoir mon itinéraire par email"** (`OfferConfirmationModal.tsx`). Match l'action reelle de l'etape suivante (magic link email, pas Stripe). Elimine l'expectation mismatch.
- **Micro-copy explicatif** sous le CTA : *"On vous envoie un email pour confirmer votre adresse, puis vous finalisez en quelques secondes."* Anti-anxiete : transparence du flow en 2 etapes (email puis paiement) pour que Stripe soit pas une surprise hostile.
- **Auto-send magic link** dans `PaymentAuthModal.tsx` : useEffect qui declenche `signInWithOtp` au mount si `initialEmail` est valide. La modal s'ouvre directement sur l'ecran "Vérifiez votre boîte mail" au lieu de re-demander la saisie email + clic bouton (l'email est deja capture dans `PreferencesForm`). Bouton "Pas le bon email ?" pour reedition en cas de typo.
- **NOT_INCLUDED.express** reduit de 4 a 2 items, reformule en positif : `"Modifications en option (à partir de 4,99€)"` + `"Pas de suivi humain personnalisé"`. Suppression doublons avec bandeau positionnement et checkbox consentement.

P1 (polish structurel) :

- Section header `"Non inclus"` -> **"Bon à savoir"** pour Express uniquement (vocabulaire neutre, moins loss-aversion).
- Bandeau positionnement reformule en positif : `"On vous donne le plan, vous gardez les clés."` + reformulation conciliante. Vire le ton legaliste "non responsables des disponibilites".
- Upsell desature (slate-50 au lieu de gradient jaune dore) + reframe en add-on (`"Ajouter modifications + support 48h +19€"`) au lieu d'alternative concurrente (`"dès 29€"`). Stop la concurrence visuelle avec le CTA principal.
- "Annuler" -> **"Plus tard"** (respect-the-no, garde la porte ouverte).
- Trust signal : "SSL chiffré" -> "Sans engagement" (moins generique, plus rassurant).

### Offers — PDF gating Premium+ uniquement (2026-05-04)

Per `OFFER_LABELS` dans `src/config/itinerary-pricing.ts`, le PDF est une feature **Premium+** (Express recoit email + vue web seulement). 7 fichiers touches pour appliquer la regle de bout en bout :

- `src/emails/senders/itinerary.ts` : nouveau parametre optionnel `offerType` sur `sendItineraryReadyEmail`. Si `'express'`, le CTA secondaire "Telecharger PDF" est omis du mail ET la ligne de conseil "Vous pouvez telecharger le PDF a tout moment" est retiree. Default `'premium'` pour back-compat avec generations sans `offer_type` renseigne.
- `src/services/emailService.ts` : wrapper backward-compat propage `offerType`.
- `src/app/api/stripe/webhook/route.ts` : `dispatchItineraryReadyEmail` SELECT `offer_type` depuis la generation et le forward au sender.
- `src/app/api/itinerary/deliver/route.ts` : meme propagation pour le re-send manuel depuis la completion page.
- `src/app/api/itinerary/pdf/[id]/route.tsx` : gate server-side, retourne 403 `{ upgradeRequired: true }` si `generation.offer_type === 'express'`. Default conservatif sur `'express'` si null. Defense in depth : meme si UI bypass, l'API refuse.
- `src/app/api/itinerary/confirm-payment/route.ts` : retourne `offer_type` au front pour adaptation UI.
- `src/app/checkout/itinerary/completion/page.tsx` : masque la checkbox PDF pour Express, affiche un placeholder discret "PDF professionnel — Disponible avec les offres Premium et Conciergerie". Email + Telegram restent disponibles pour tous.

### UI — Redesign + corrections OfferConfirmationModal (2026-05-04)

3 iterations successives via l'agent ui-ux-designer pour aligner sur le design language home + corriger les regressions visuelles trouvees en test reel :

1. **Redesign initial** : header gradient bleu profond `#3B5BDB → #1e40af` (match `ItineraireIABlock` + `FinalCtaSection`), cercles dashed decoratifs (signature pattern home), eyebrow uppercase + etoile accent jaune, `rounded-3xl` + shadow custom 24px/60px ink + bordure 0.5px, mobile-first bottom-sheet (`items-end` + `rounded-t-3xl`), grid 2-cols inclus/non-inclus desktop, custom checkbox sr-only + span style, CTA orange brand `#F59E0B` + shadow-cta, accents francais corriges partout.
2. **Fix alignement bandeau prix + footer** : refactor du bloc prix (3 alignements concurrents -> stack vertical eyebrow / prix / sub-label, sub-label enrichi "paiement unique · sans engagement"), footer symetrique 2 rangs (Annuler | CTA puis trust signal centre pleine largeur au lieu de sublabel colle au bouton droit), upsell card padding-right augmente, contraste bandeau positionnement bumpe a 11.2:1 AAA.
3. **Fix clipping prix sur viewport etroit** : `9.99€` qui touchait le bord du gradient bleu sur mobile. Combo `pb-6 -> pb-8 sm:pb-9` (header), stack `flex-col` au lieu de `flex baseline` (sub-label sous le prix sert de tampon), `clamp` min reduit a `1.75rem` + `lineHeight 1.05` + `paddingBottom 2px` sur le glyphe (descenders ne touchent jamais leur conteneur).

### Fixes — Resume payment params + Reprendre button (2026-05-04)

- **`selected_variant` perdu au reload post-magic-link** -> `/api/itinerary/payment` retournait 400 (variant null requis). Fix dans `PaymentAuthModal.tsx` : `buildRedirectUrl` inclut maintenant `&variant=<balanced|relax|adventure>` dans l'URL. `page.tsx` `resumePayment` lit `?variant` depuis searchParams, fallback sur `data.selected_variant` de la DB, puis 'balanced' en dernier recours. `triggerPayment` accepte le variant en arg explicite (au lieu de capture closure depuis `selectedVariant` state) pour eliminer le footgun stale-closure.
- **Bouton "Reprendre" depuis `/mon-espace/itineraires`** ne passait aucun query param -> page chargeait sans declencher `resumePayment`. Fix : URL construite avec `?resume_payment=<id>&offer=<offer_type|express>&variant=<selected_variant|balanced>` depuis la generation pending la plus recente, defaults safe pour generations qui n'ont jamais atteint l'etape Pay (`offer_type` + `selected_variant` null). Ajout de `offer_type` au SELECT de la query `pendingGens`.

### UX — Modal de confirmation/consentement de l'offre avant paiement (2026-05-04)

- **Nouveau** : `src/components/itinerary/OfferConfirmationModal.tsx` s'intercale entre le clic "Debloquer" et le PaymentAuthModal (ou Stripe direct si user authentifie). Affiche :
  - Recap clair (nom offre + duree + prix + paiement unique)
  - **Bandeau positionnement** : "Philippin'Easy est un guide francophone des Philippines, pas une agence de voyage" (memory project_philippineasy_positionnement)
  - Section "Ce qui est inclus" (features de l'offre + nombre de modifications gratuites)
  - Section "Ce qui n'est PAS inclus" (variant par offre — Express : pas de modification ni de suivi, etc.)
  - **Upsell soft** : si Express -> propose Premium avec bouton de switch ; si Premium -> propose Conciergerie. Le user peut switcher d'offre sans fermer la modal.
  - **Checkbox de consentement obligatoire** : "J'ai compris ce que comprend l'offre X et j'accepte que Philippin'Easy soit un guide d'accompagnement, pas une agence". Bouton "Continuer vers le paiement" disabled jusqu'au check.
  - GA4 event `ia_offer_review_opened` au mount, `ia_checkout_started` deplace au moment du consentement (vs auparavant au clic Debloquer).

- **Refactor `handlePayment`** dans `src/app/itineraire-personnalise-pour-les-philippines/page.tsx` : split en 2 etapes (`handlePayment` ouvre la modal recap, `handleConfirmOffer` execute le flow paiement post-consentement). Reduit le risque de disputes refunds dues a une mauvaise comprehension de l'offre Express (IA only, pas de suivi humain).

### Fixes — Funnel resume_payment post-magic-link + suppression user Supabase (2026-05-04)

- **Endpoint manquant `/api/itinerary/generation/[id]`** : la page `itineraire-personnalise-pour-les-philippines/page.tsx:205` fetchait cet endpoint apres retour du magic link pour recuperer la `duration` de la generation et auto-relancer le paiement Stripe. La route n'existait pas (seul `/api/itinerary/[id]/` existait, dedie au full itineraire post-payment) -> 404 silencieux -> fallback `if (duration)` echouait car page tout juste rechargee -> user atterri sur formulaire vide. Console : `Failed to load resource: 404 /api/itinerary/gener...8f90-5652cf0fd06d`. Cree `src/app/api/itinerary/generation/[id]/route.ts` qui :
  - GET id -> renvoie `{ id, duration, offer_type, payment_status, status, preferences, selected_variant }` (duration extrait depuis `preferences.duration` jsonb, pas une colonne dediee)
  - Ownership : `user_id = auth.uid()` OU `user_id IS NULL ET delivery_email = user.email`
  - Auto-link la generation au user authentifie si match anonyme par email (idempotent, only if `user_id IS NULL`)
  - Bypass RLS via service-role apres check applicatif (RLS trop restrictive pour le pattern anonyme -> proprietaire-via-email)

- **Migration `20260504_cascade_user_deletion.sql`** : 11 FK du schema public vers `auth.users(id)` etaient en `ON DELETE NO ACTION`, ce qui faisait echouer le bouton "Delete user" de l'UI Supabase (erreur `Database error deleting user`). DO block PL/pgSQL qui introspecte `pg_constraint` et convertit dynamiquement chaque FK en `ON DELETE CASCADE`. Tables touchees : profiles, dating_profiles, flights, bus_routes, itinerary_modifications, message_reactions, messages (x2), notifications (x2), orders. 4 FK conservees en SET NULL (forum_posts, forum_topics, delivery_preferences, users_restricted) — comportement RGPD-friendly preservant l'historique forum/preferences. Applique en prod via Supabase Management API.

### Marketing — Funnel itinéraire IA refonte UX (anonyme + email + magic link)

**Diagnostic post-3-jours-de-Google-Ads** (118 clics, 41.99€, 0 conversion organique) : la landing `/itineraire-personnalise-pour-les-philippines` bloquait les visiteurs Google Ads cold avec une gate "connexion obligatoire" AVANT toute génération. Les utilisateurs payaient 0.44€/clic Search puis fuyaient face à l'écran "créez un compte". Le backend supportait déjà le flux anonyme (`payment/route.ts:84-91` accepte les générations `user_id NULL`), mais la UX bloquait tout.

**Refonte du funnel** :

- `src/components/itinerary/PreferencesForm.tsx` : retire la gate auth (lignes 178-194 supprimees), ajoute un champ email obligatoire pour les utilisateurs non-authentifies (validation regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`), CTA "Voir mon apercu gratuit" au lieu de "Generer mon Itineraire". Champ email pre-rempli si `defaultEmail` prop fournie. Apparait uniquement si user pas auth (non-auth users only).

- `src/app/api/itinerary/generate/route.ts` : accepte `email` dans le body, validation server-side, stocke `delivery_email` sur la row apres reponse n8n successful (UPDATE direct cote Next.js, n8n workflow inchange). Refuse 400 si pas auth ET email invalide.

- `src/app/api/itinerary/payment/route.ts` : ajoute `delivery_email` dans le SELECT et dans les metadata Stripe du PaymentIntent (rétrocompat pour rows sans le champ).

- `src/app/itineraire-personnalise-pour-les-philippines/page.tsx` : wrap dans `<Suspense>` (requis par `useSearchParams` Next 15), state `capturedEmail` alimente par `handleGenerate`, modal `PaymentAuthModal` ouverte si `!user` au clic offre, `useEffect` resume_payment apres retour magic link auto-trigger paiement quand user authentifie.

- `src/components/itinerary/PaymentAuthModal.tsx` (nouveau) : modal Framer Motion avec email pre-rempli, CTA principal magic link via `supabase.auth.signInWithOtp({ emailRedirectTo: ?resume_payment=<id>&offer=<offer> })`, lien secondaire vers `/connexion`. Event GA4 `magic_link_sent` au submit.

- `src/app/api/stripe/webhook/route.ts` : nouveau handler `handleAnonymousItineraryPurchase` declenche si `payment_intent.succeeded` arrive sur une generation `user_id NULL` avec `delivery_email`. Cherche compte existant via `supabase.auth.admin.listUsers`, sinon cree user via `admin.createUser({ email_confirm: true, user_metadata.created_via: 'itinerary_anonymous_purchase' })`, link `itinerary_generations.user_id = finalUserId`, envoie email itineraire + magic link bienvenue. Resout un bug silencieux pre-existant : sans cette logique, un anonyme qui payait recevait jamais son itineraire (`if (generation?.user_id)` skip dans le webhook).

**Architecture** :
- Aucune nouvelle table DB (utilise `delivery_email` existant)
- n8n workflow inchange (UPDATE delivery_email cote Next.js)
- Tracking GA4 prserve (`ia_checkout_started`, `purchase`) + nouveau `magic_link_sent`
- RLS preservée
- Idempotence webhook preservée (`.neq('payment_status', 'completed')`)

**Impact attendu** : passer de 0% a 3-5% conversion sur clics qualifies Search ads. Capture email = recovery emails possibles (cron a venir, task #28). Bug silencieux delivery anonyme reglé.

### SEO — BLOC 6.2 Articles programmatiques `/itineraire-[slug]` (scaffolding)
Mise en place du pipeline SEO programmatique pour cibler 20 pages "itinéraire [destination]" avec ~5-9K visites/mois potentielles selon le guide. **Code applicatif pret en prod**, table Supabase a appliquer manuellement via Dashboard SQL Editor.

**Nouveaux fichiers** :
- `supabase/migrations/20260429_destination_itineraries.sql` (gitignored, a appliquer manuellement) : table avec RLS public read + service_role full access, trigger `updated_at`, JSONB pour `itinerary` (jour par jour) et `faq` (rich snippets), index sur slug/published/category
- `supabase/seeds/destination_itineraries_palawan.sql` : seed Palawan complet (intro, 7 jours, 5 FAQ, budgets backpacker/midrange/luxury, related destinations) en `published=false` pour que Hugo re-ecrive l'intro avant publication
- `src/types/destinationItineraries.ts` : types TypeScript (DestinationItinerary, ItineraryDay, ItineraryActivity, FAQEntry, DestinationCategory, DestinationItinerarySummary)
- `src/services/destinationItinerariesService.ts` : 4 fonctions (getAllPublishedSlugs pour generateStaticParams, getItineraryBySlug, getRelatedItineraries, getAllPublishedItineraries)
- `src/app/itineraire-[slug]/page.tsx` : page dynamique SSG avec ISR `revalidate: 86400`, generateStaticParams, generateMetadata dynamique (title/description/canonical/OG/Twitter), notFound() si slug invalide
- `src/app/itineraires-philippines/page.tsx` : page hub avec groupBy categorie (destination/duration/profile), fallback "Les itinéraires arrivent" si table vide
- `src/components/destinations/` : 6 composants (ItineraryHero, ItineraryDayCard, BudgetTable, FAQSection avec schema FAQPage, RelatedItineraries, Breadcrumb avec schema BreadcrumbList)

**Modifie** :
- `src/app/sitemap.ts` : ajout dynamique des `/itineraire-{slug}` (priority 0.85, changeFrequency monthly) + hub page (uniquement si ≥1 itineraire publie)

**Impact** : pas de comportement runtime change tant que la table n'existe pas (la hub page affiche un fallback gracieux). Une fois migration appliquee + seed Palawan + Hugo re-ecrit l'intro et passe `published=true`, la page `/itineraire-palawan` sera live avec :
- SSG ultra rapide (pages pre-rendered au build)
- Schema.org FAQPage et BreadcrumbList pour rich snippets
- Maillage interne vers 3-5 destinations liees + ressources voyager-aux-philippines
- CTA vers `/itineraire-personnalise-pour-les-philippines` (entonnoir vers IA payante)
- Sitemap auto-mis-a-jour (revalidate 10min)

**Reste a faire (Hugo)** : appliquer migration via Dashboard SQL Editor, appliquer seed Palawan, re-ecrire intro avec tone perso terrain, ajouter photos uniques, passer `published=true`. Puis dupliquer pour 4 autres destinations P1 (Cebu, Siargao, Boracay, Philippines 2-semaines).

### Marketing — BLOC 3 Google Ads complet : 3 campagnes live (Search + Display + Brand)
Lancement campagnes payantes Google Ads. **Aucun changement de code applicatif**, tout configure cote regie (compte 380-633-5752). Actions documentees dans `output/TODO.md` + audit guides `output/guides/bloc3-google-ads/`.

**Setup tracking** (cf. commit 23af578 BLOC 3.7) :
- Tag `AW-16902543219` deploye via `GoogleAdsTag.tsx`
- 3 conversions GA4 importees : `purchase`, `generate_lead`, `newsletter_signup`
- 2 audiences GA4 event-based crees via Admin API (`Itineraire IA Engages Sans Achat` + `Abandons Checkout Itineraire`)
- 2 audiences URL Google Ads (`Visiteurs_Itineraire_Sans_Achat` 30j + `Abandons_Checkout` 7j)

**Setup campagnes** :
- 3 campagnes : SEARCH_Itineraire_IA (10eur/j Maximize Clics CPC max 0.80eur), DISPLAY_Remarketing (5eur/j Maximize Conversions), SEARCH_Brand (3eur/j CPC manuel 1eur/keyword)
- 6 ad groups propres (Exact_Itineraire, Phrase_Voyage_PH, Brand_Philippineasy_Itineraire, Visiteurs_Itineraire_Sans_Achat, Abandons_Checkout, Brand_Terms)
- 86 keywords positifs + 50 negatifs cibles par campagne (emploi, visa, typhon, concurrents, contenu sensible)
- 5 RSA Search + 2 RDA Display (12 images itineraire + 6 abandon)
- 10 sitelinks + 14 callouts
- Frequency cap 3/jour, content exclusions (evenements tragiques, politique, sensationnel, below-the-fold)
- Budget total 18eur/jour ≈ 540eur/mois (Phase 1 soft launch alignee sur guide 3.10)

**Setup visuels** :
- 33 bannieres totales dans `output/google-ads-assets/` : 18 base 1200x628/1200x1200 (3 segments x 3 variantes A/B/C x 2 formats) + 15 formats Display Network (300x250, 728x90, 970x250, 300x600, 1080x1920) sur les 3 controle A
- Variante B "-10% FINALSTEP" gardee dans la RDA Abandons_Checkout pour activation future quand le coupon Stripe sera implemente

**Activation** : 3 campagnes activees 2026-04-28 ~21h. Diffusion effective sous 24-48h (review Google des annonces) ; DISPLAY a J+7 (audiences peuplees).

**Prochaines etapes** :
- J+15 : si SEARCH_Itineraire_IA atteint 10+ conversions, switch en "Maximiser les conversions"
- J+30 : si CPA stable < cibles (8eur Express, 15eur Premium), passer Phase 2 du guide (550 -> 950eur/mois)

### Tracking — Google Ads remarketing tag (BLOC 3.7)
Pose du tag Google Ads (`AW-16902543219`) pour activer le remarketing Display et l'import des conversions GA4 (`purchase`, `generate_lead`, `newsletter_signup`) dans la regie Ads. Le compte Ads (380-633-5752) est lie a GA4 (520177629) avec personnalisation des annonces + auto-tagging actives.

- `src/components/analytics/GoogleAdsTag.tsx` (nouveau) : composant defensif, sanitize l'ID (resilient aux env values pollues), retourne `null` si `NEXT_PUBLIC_GOOGLE_ADS_ID` absent (aucun script charge inutilement)
- `src/lib/analytics.ts` : nouveau helper `trackGoogleAdsConversion({ sendTo, value, currency, transaction_id })` — fallback si on veut fire une conversion ciblee cote client (l'import GA4 -> Ads couvre deja le cas standard)
- `src/app/layout.tsx` : mount du `<GoogleAdsTag />` apres GA4 et Meta Pixel
- `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-16902543219` ajoute sur Vercel (production, preview, development)

**Impact** : permet la creation des audiences remarketing (visiteurs site, abandons checkout, segments itineraire 1-7j vs 8-30j) pour les campagnes Display avec les 18 bannieres deja produites. Les conversions GA4 importees vont s'attacher automatiquement aux clics Ads via le `gclid` (auto-tagging).

### Tracking — Fix `value: 0` sur tous les events Purchase (GA4 + Meta Pixel)
Les 3 pages de completion paiement envoyaient `value: 0` aux trackers (GA4 et Meta Pixel) — impossible de calculer ROAS / CPA sur n'importe quel canal. Fix complet :

- `/api/itinerary/confirm-payment` : retourne maintenant `amount` + `currency` dans la response (early-return idempotent retourne aussi le montant depuis DB)
- Nouveau endpoint `/api/services/verify-session` (auth + ownership check) : retourne `amount`, `currency`, `service_type` depuis `service_purchases` via `stripe_checkout_session_id`
- Nouveau endpoint `/api/orders/verify-payment` (auth + ownership check) : retourne `total_amount` depuis `orders` via `stripe_payment_intent_id`
- `/checkout/itinerary/completion` : utilise `data.amount` reel (avant : `?? 0` parce que l'API ne retournait pas `amount`)
- `/checkout/services/completion` : appelle verify-session avant tracking, fallback gracieux si webhook pas encore traite
- `/checkout/completion` (marketplace) : appelle verify-payment avec retry 1.5s pour laisser le temps au webhook Stripe de creer la ligne `orders`
- `MetaPixel.tsx` : sanitize `META_PIXEL_ID` (strip non-digit chars) pour resister aux env values mal saisies sur Vercel (ex: trailing `\n` litteral) + switch `dangerouslySetInnerHTML` au lieu de children template literal pour eviter les erreurs `appendChild Invalid token` (probablement causees par adblockers interceptant le script)
- `analytics.ts` + `meta-pixel.ts` : ajout `console.log` dev-only (gated derriere `NODE_ENV !== 'production'`) pour debug futur

**Impact** : ROAS / CPA enfin mesurables sur Google Ads, Meta Ads, et tout autre canal qui consomme les conversions GA4. Pre-requis pour lancer les campagnes payantes prevues dans la strategie marketing.

### SEO — Phase E : decannibalisation cluster "rencontre philippines" (commits e81f6e1 + new)
3 articles ciblaient la meme requete "rencontrer femmes philippines" -> Google ne savait pas lequel ranker, tous coulaient. Apres lecture editoriale des 3 (vraiment differents en ton, pas duplicates), strategie de differentiation par intent secondaire :

- **Article B** (id 116, 12 clics, position 11.3) GARDE comme winner. Title update :
  - Ancien : "Rencontres aux Philippines : comprendre la culture et eviter les pieges"
  - Nouveau : "Rencontrer une Philippine : 5 ans aux Philippines, mes **erreurs** et mes conseils"
  - Cible : "comment rencontrer une philippine", "rencontre philippines retour experience"
- **Article C** (id 129, 0 clic, 107 blocks le plus long) PIVOTE sur intent culturel different :
  - Ancien : "Rencontrer une Philippine : les **codes** a connaitre" + slug `rencontrer-philippine-codes-culturels`
  - Nouveau : "Codes **culturels** philippins en couple : famille, religion, communication" + slug `codes-culturels-philippins-couple-famille-religion`
  - Cible : "culture philippines couple", "codes culturels philippins", "comprendre culture filipina"
  - 301 redirect depuis l'ancien slug
- **Article A** (id 65, 2 clics, ton touristique cliche) KILL via `status='draft'`. 301 redirect vers article B pour recuperer trafic + autorite backlinks.
- src/components/homepage/BlogSection.tsx : update slug hardcode du featured article (rencontrer-philippine-codes-culturels -> codes-culturels-philippins-couple-famille-religion).
- next.config.ts : 2 nouvelles redirections 301 dans le bloc redirects().

Effet attendu (3-4 semaines via re-crawl Google) : 14 clics existants consolides sur 1 winner avec position +5 attendue, + ouverture nouvel intent culturel (article C) = ~20-30 clics/mois supplementaires.

### SEO — Phase H : HowTo schema auto-detection sur articles tutoriels (commit e81f6e1)
- src/components/shared/JsonLd.tsx : extractHowToSteps() detecte auto les articles type tuto et genere HowTo schema en complement du Article/BlogPosting.
- Triggers : H2 commencant par "Comment", "Etapes", "Tutoriel" + liste `style: ordered` >= 3 items qui suit.
- Pour chaque step : 1ere phrase = name (max 80 chars), texte complet = text, url = articleUrl#step-N (deep link).
- Eligible Google rich result "How-to" carrousel (gros boost CTR sur requetes procedurales).
- Articles existants beneficiant : sugba-lagoon-siargao ("Comment Aller a Sugba Lagoon"), guide-achat-activation-sim, ouvrir-compte-bancaire-philippines (id 131 etapes ouverture compte).

### SEO — Phase F : schema markup BlogPosting + Service (commit 482ad00)
- src/components/shared/JsonLd.tsx : @type conditionnel selon basePath. NewsArticle pour `actualites-sur-les-philippines` uniquement (info perissable < 30j), BlogPosting pour les guides evergreen voyager/vivre/meilleurs-plans. Etait force a NewsArticle pour TOUS = mismatch contenu/schema = penalisation rich results.
- Author Person schema enrichi (E-E-A-T) : @id stable, jobTitle, knowsAbout pour permettre a Google de linker tous les articles du meme auteur.
- Publisher Organization avec @id stable lie a HomepageJsonLd.
- isAccessibleForFree: true (clarifie pas de paywall).
- src/components/shared/ServicesJsonLd.tsx (NEW) : 3 Service schemas (Buddy / Voyage Serein / Pack Ultime) + Brand AggregateRating (4.9/5, 320 avis, 10000 voyageurs - chiffres deja visibles, pas inventes). @graph pour combiner.

### SEO — Phase D : 4 articles drafts categories vides (commits 482ad00 + Phase G nouveau)
Categories vides dans le sitemap = "Discovered, currently not indexed" Google. Solution : remplir.
- ID 130 : "Vols interieurs et transports aux Philippines : guide pratique 2026" (transports, 2041 mots, 10 min)
- ID 131 : "Ouvrir un compte bancaire aux Philippines en 2026 : guide complet pour expatries" (banque-finances, 2495 mots, 12 min)
- ID 132 : "Island hopping aux Philippines : 10 excursions incontournables" (activites-excursions, 2394 mots, 11 min)
- Article hotels (hebergements) en cours de redaction
Tous en `status='draft'` -> a valider + ajouter image hero via /admin avant publication. Format EditorJS v2.31.0, cross-links internes (5 par article), tableaux prix, FAQ, sources verifiees WebSearch.

### SEO — Phase C : tighten CSP (commit 6d52cd0)
- connect-src '*' (trou geant) -> liste explicite Supabase, Stripe, Sentry, Tawk, GA, Facebook, Maps, Places.
- Ajout base-uri 'self' (anti-injection <base>), frame-ancestors 'none' (anti-clickjacking), object-src 'none' (bloque Flash legacy), form-action 'self' https://hooks.stripe.com, upgrade-insecure-requests (force HTTPS sub-resources).
- script-src : ajout connect.facebook.net (Pixel). style-src : ajout fonts.googleapis.com. font-src : ajout fonts.gstatic.com. img-src : restreint a 'self' + data + blob + https.

### SEO — Phase B : metadata pages commerciales (commit 6d52cd0)
- /services layout.tsx : keywords cibles, OG image complete, Twitter card, robots googleBot max-image-preview large.
- /forum-sur-les-philippines/nouveau-sujet/layout.tsx (NEW) : noindex (auth requise).
- /marketplace-aux-philippines/vendeur/connexion/layout.tsx (NEW) : noindex (auth).

### SEO — Phase A : sitemap clean (commit 6d52cd0)
- Retire profilePages (`/rencontre-philippines/profil/UUID`) : contenu USER prive avec noindex meta -> sitemap = signal contradictoire + fuite UUIDs publique.
- Retire vendorPages tant que slug = ID numerique (SEO-hostile).
- Filtre categoryPages : exclut categories sans aucun article publie (resout "Discovered, not indexed" sur 5 categories vides).

### SEO — CRITICAL : drop canonical propagation root layout (commit f36d9dc)
src/app/layout.tsx avait `alternates: { canonical: '/' }` dans le root metadata. Next.js propage cette valeur a TOUTES les pages enfants qui ne declarent pas le leur explicitement -> Google voit toutes les pages comme duplicates de la home. **Cause racine du bug d'indexation depuis des mois** (95 clics/mois pour 46 articles publies, c'est anormalement bas).

Fixes :
- Retire `alternates.canonical` de root layout + commentaire explicatif.
- Ajout canonical explicite a /(home), /cgu, /confidentialite, /mentions-legales.
- Cree /contact/layout.tsx (NEW) avec metadata complete + canonical (la page etait 'use client', impossible d'exporter metadata directement).

Effet attendu (3-6 semaines re-crawl) : pages "Discovered, not indexed" passent en "indexed", articles indexes mais avec home comme canonical retrouvent leur identite, position moyenne baisse (= meilleure) sur long-tail, trafic organique 2-3x sur les pages content de qualite.

Source : memory project Ondayvaluemoney `seo-fixes.md` (meme bug fix le 2026-02-23).

### Auth Supabase — fix bug "il faut N reloads pour voir le profil" (commit ad7ea38)
- **Diagnostic** (cause racine identifiee apres des mois de symptome) :
  - `AuthContext` partait `loading=true` a chaque page load avec un hack `setTimeout(500)` qui appelait `supabase.auth.getSession()` apres 500ms si `INITIAL_SESSION` n'etait pas fire. Pendant ces 500ms, le `Header` rendait "non connecte" -> l'utilisateur faisait F5 -> meme race condition -> loop. Ce hack etait un patch sur un bug `INITIAL_SESSION` non-firing connu en `@supabase/ssr@0.6`.
  - `@supabase/ssr@0.6.1` etait en retard de 4 mineurs ; `0.7+` corrige le bug `INITIAL_SESSION`.
  - `@supabase/auth-helpers-nextjs@0.10.0` (deprecated) etait installe en parallele de `@supabase/ssr` -> 2 systemes auth dans node_modules pouvant interferer sur les cookies.
  - `src/utils/supabase/client.ts` exposait un singleton instancie au module-load (sans memo HMR-safe), pas safe en SSR si appele par accident.
- **Bumps** :
  - `next` 15.3.8 -> 15.5.15 — patche **CVE-2025-66478** (RCE via React Server Components), **CVE-2026-23864** (DoS RSC), **CVE-2025-55184** (DoS), **CVE-2025-55183** (exposition source code).
  - `@supabase/ssr` 0.6.1 -> 0.10.2 — fix `INITIAL_SESSION`.
  - `@supabase/supabase-js` 2.98.0 -> 2.104.1.
  - `eslint-config-next` 15.3.4 -> 15.5.15.
- **Removed** : `@supabase/auth-helpers-nextjs` (dead dep, plus de conflit cookies).
- **Refactor** `src/contexts/AuthContext.tsx` :
  - Accepte `initialUser` + `initialProfile` + `initialIsVendor` en props -> hydrate depuis le SSR. Le HTML envoye par le serveur contient deja le profil, plus aucun flash "non connecte".
  - Demarre `loading=false` si `initialUser` est present.
  - Retire le hack `setTimeout(500)` + le `getSession()` fallback.
  - `onAuthStateChange` skip le re-fetch profil si l'event ramene le meme user que celui hydrate (compare via `lastFetchedUserId` ref).
  - `profileRef` pour eviter de re-subscribe sur chaque mutation profil.
- **Refactor** `src/app/layout.tsx` :
  - Appelle `supabase.auth.getUser()` (verifie le JWT, contrairement a `getSession` qui lit juste le cookie sans validation).
  - Fetch `profile` + `vendors` en parallele des `categories` via `Promise.all` (zero overhead vs avant).
  - Passe `initialUser` / `initialProfile` / `initialIsVendor` a `AuthProvider`.
- **Refactor** `src/utils/supabase/client.ts` :
  - Singleton vrai memoise sur `globalThis.__supabase_browser__` (HMR-safe en dev, garantit une seule instance par tab).
  - `throw` si appele en SSR (au lieu d'instancier silencieusement un client browser cote serveur).
  - `Proxy` pour preserver l'API `import { supabase } from '...'` existante (33 fichiers consommateurs, aucun changement).
- **next.config.ts** : `outputFileTracingRoot` pour eteindre le warning Next 15.5+ qui detectait `~/package-lock.json` comme racine du workspace.
- **Resultat** : sur la 1ere requete, le HTML SSR contient deja le bon `user`/`profile`. Le client est hydrate avec. Plus aucun flash, plus aucune race, fini les multi-reload.

### Securite — 4 vagues de code review exhaustives (commits 6c84f56, 20592a8, 7f5a638)
- **15 critiques + 12 HIGH** identifies et corriges. Methodologie : 4 passes successives de `code-reviewer` agent jusqu'a "0 critical restant".
- **IDOR (Insecure Direct Object Reference)** :
  - `/api/itinerary/confirm-payment` : auth obligatoire + check ownership + UPDATE conditionnel `.neq('payment_status','completed')` + verif `metadata.generation_id` cross-check.
  - `/api/dating/ip-check` : `user_id` derive de la session (etait pris du body, n'importe qui pouvait usurper). Validation IPv4/IPv6 stricte (anti-SSRF).
  - `/api/stripe/create-payment-intent` (marketplace) : prix re-fetch en BDD cote serveur. Le client ne peut plus envoyer son propre prix.
  - `/api/itinerary/payment` : prix derive de `PRICING_GRID` server-side, ownership check, rate-limit fail-CLOSED (etait fail-open si Redis HS).
- **Race conditions** :
  - `callService.bookSlot` : UPDATE atomique `.eq('is_available', true)` + compensating action si insert booking echoue.
  - `entitlementService.consumeEntitlement` : claim atomique `.eq('used_quantity', currentUsed)` + retry signal propre.
  - `/api/itinerary/[id]/modification` : decrement atomique `.gt('modifications_remaining', 0)` + compensating restore.
  - `/api/dating/messages` : claim atomique du quota free `.eq('message_daily_count', currentCount).lt(...,2)` + compensating restore. Bloque le double-spend par double-clic ou onglets paralleles.
- **Stripe webhook idempotence** (Stripe peut retry chaque event sur timeout / redeploy) :
  - `handleServiceCheckout` : `.eq('status','pending')` -> bloque double-activation (entitlements/calls/emails dupliques).
  - `handleItineraryPayment` : `.neq('payment_status','completed')` -> bloque double email confirmation.
  - `handleMarketplacePayment` : pre-check existence par `stripe_payment_intent_id` -> evite l'erreur sur la UNIQUE constraint et le bruit de logs.
- **Securite headers** :
  - CORS `Access-Control-Allow-Origin: '*'` -> `process.env.NEXT_PUBLIC_SITE_URL` + `Vary: Origin`.
- **DB / types alignes sur le schema** :
  - `grantPremium` ecrit aussi `rencontre_premium_expires_at` (sinon le cron ratait la notification d'expiration sur les premiums grantes via admin).
  - `Profile.role` aligne sur la DB (`'member'` au lieu de `'user'`).
  - `delivery_preferences` : `.upsert` au lieu de `.update` (la row peut ne pas exister).
  - `activationService.updateCustomerStats` : Number cast (Supabase retourne les `numeric` en string en JS).
  - `userService.getProfileById` : recoit `supabase` en parametre (plus de singleton browser cote SSR).
  - `userService.userId` : `number` -> `string` (UUID, pour matcher `profiles.id`).
- **Performance / UX** :
  - `mon-espace/layout` : Server Component avec `redirect()` server-side (plus de flash FOUC) + `metadata.robots.noindex` (pas d'indexation Google des espaces prives).
  - `IAOverlay` + `ExitIntentPopup` lazy-loaded via `ClientOverlays` wrapper (~30KB de bundle initial economises sur 100% des pages).
  - PDF route : photos Google Places en parallele (`Promise.all`, cap 15) + `maxDuration=60` + API key en header `X-Goog-Api-Key` (plus dans l'URL queryString) + `error.message` non expose en prod.
  - `ResendItineraryButton` : disable si pas d'email (evite erreurs 400).
  - `CountdownTimer` : init `null` pour eviter hydration mismatch.
  - `N8N_API_KEY` : guarde proprement dans `deliver` route.
- **Admin** :
  - `/admin/customers` reecrit en Server Component pur (drop service-role import dead, drop FontAwesome, design system 2026, batch queries plus de N+1, unread filtre par `customer_id` au lieu de global, filtres server-side dans URL).
- **Lint** : 3 warnings finaux (img tags, alt PDF, eslint-disable inutile) corriges.


- **Changed** : Step 2 de l'overlay devient le **funnel complet self-contained** au lieu d'un teaser qui redirigeait vers la page formulaire (qui se rouvrait vide). Reproduit dans le proto handoff style l'enchainement de la page `/itineraire-personnalise-pour-les-philippines` :
  - **3 ProposalCards** : choix du variant (relax/balanced/adventure) avec recommended badge auto-place sur le variant matchant le tripStyle (relax→relax, adventure/diving→adventure, culture/mix→balanced). Card includes title + description + 3 highlights + 2 teaser_days + budget_estimate. Selectable au clic + Enter/Space (radiogroup ARIA).
  - **3 Offer Cards** : Express / Premium (badge Recommandé) / Conciergerie. Pricing dynamique via `PRICING_GRID[offer][duration]` + `formatPrice()`. Liste des features depuis `OFFER_LABELS`. Premium pre-selectionne par defaut (matche le pattern original).
  - **CTA paiement** : "🔒 Débloquer pour {prix} →" qui appelle `POST /api/itinerary/payment` avec `{generation_id, selected_variant, offer_type, duration, price_id}` puis redirect `/checkout/itinerary?client_secret=X&generation_id=Y` (pattern Stripe Payment Intent existant). Conciergerie 1-mois+ (price=0) redirige vers `/contact?subject=conciergerie-voyage`.
  - Mention discrete sous le CTA : "Paiement sécurisé Stripe · Livraison instantanée par email"
- **Added** : Warning `beforeunload` natif active pendant `loading=true` — affiche le dialogue browser "L'IA travaille encore — êtes-vous sûr de quitter ?" si l'utilisateur ferme l'onglet ou navigue ailleurs pendant la generation (~60-80s).
- **Added** : Bloc d'alerte visible en step 1 pendant `loading` : icone spin + "Notre IA travaille pour vous (~60-80 secondes)" + texte muted "Merci de **ne pas quitter cette page** ni rafraîchir — vos 3 propositions arrivent." Sur fond primary/5 + border primary/20.
- **Added** : Backdrop click + close button **disabled** pendant `loading || paymentLoading` — empeche la fermeture accidentelle pendant les phases critiques. Close button avec `disabled:opacity-30 disabled:cursor-not-allowed`.
- **Added** : Analytics event `ia_checkout_started` avec `{variant, offer, value}` quand le user clique le CTA paiement.
- **Removed** : Le bouton "Voir l'itinéraire complet →" qui redirigeait vers `/itineraire-personnalise-pour-les-philippines?gen=ID` (la page ne lit pas encore les query params, donc rouvrait un formulaire blanc — UX cassee). Remplace par le funnel paiement direct.
- **Decision design** : on respecte le proto handoff "3 steps indicateurs" mais le step 2 contient maintenant l'integralite du funnel (variants + offers + payment). L'overlay devient le tunnel de conversion principal du site, plus puissant que le proto initial. La page `/itineraire-personnalise-pour-les-philippines` continue d'exister comme fallback pour les utilisateurs qui arrivent en direct via SEO/lien externe.

### Fix critique : IAOverlay — payload n8n incorrect, validation rejetait tous les appels
- **Diagnostic** : Investigation via MCP n8n-db sur le workflow `Philippineasy - Itinerary Generator V3` (id `beo6SrTfO1sUS9Sp`, actif). Le node "Valider les Entrees" a des enums stricts qui rejetaient mon payload :
  - `budget` attend `'eco' | 'standard' | 'comfort' | 'luxury'` (j'envoyais `"2000"` un nombre)
  - `interests` attend les clés EN `['beaches','snorkeling','hiking','culture','food','nightlife','surfing','offbeaten','local']` (j'envoyais `["plages","culture","nature"]` en FR)
  - `tripStyle` accepte 5 valeurs : `'relax'|'adventure'|'culture'|'diving'|'mix'` — j'avais oublié `diving`
  - `travelType` : `'solo'|'couple'|'famille'|'amis'`
  - Quand validation throw, le workflow stoppe avant le node "Respond to Webhook" → n8n renvoie HTTP 200 mais content-length: 0 → notre route catch sur `JSON.parse('')` → 500 "Erreur serveur" générique
- **Fixed** : `src/components/iaoverlay/IAOverlay.tsx` reécrit pour matcher la validation n8n :
  - Step 0 : 5 cartes style (ajout **Plongée** 🤿 → `tripStyle: diving`) au lieu de 4
  - Step 1 enrichi : pills travelType (Solo/Couple/Famille/Amis) + sliders durée/budget + chips interests (9 options EN avec emojis FR) + textarea additionalInfo (max 500 chars)
  - Helper `eurToBudget(eur)` : <1500=eco / 1500-2999=standard / 3000-4499=comfort / 4500+=luxury (mapping cohérent avec le node "Preparer le Contexte" qui mappe → fourchettes PHP)
  - Affichage du bucket budget en clair sous le slider (`2 000 € · Standard`)
  - Step 2 : pills "Éco/Standard/Confort/Luxe" alignées sous le slider pour visualiser les seuils
- **Improved** : `src/app/api/itinerary/generate/route.ts` :
  - **Logging structuré** : `[itinerary/generate]` prefix sur tous les logs avec niveau (upstream non-200, empty body, invalid JSON, workflow failure, unexpected error). Plus de catch générique opaque.
  - **HTTP differencie** : 502 sur upstream KO / empty body / invalid JSON, 500 uniquement sur exception inattendue
  - **Lecture rawText d'abord** puis parse — permet de logger le body même invalide pour debug futur
  - **Messages user-friendly** : "Le générateur IA est temporairement indisponible. Réessayez dans une minute." au lieu de "Erreur serveur"
  - `export const maxDuration = 90` : Vercel timeout étendu à 90s pour accommoder GPT-4.1 + Supabase chain (mesure réelle ~62s end-to-end)
  - `export const dynamic = 'force-dynamic'` : pas de cache sur la route (chaque appel = nouvelle generation)
- **Validation end-to-end** : test local `POST /api/itinerary/generate` avec le payload corrigé → HTTP 200 en 62s, 3 previews retournés (variants relax/balanced/adventure), generation_id valide UUID. Sample title : "Détente et Douceur à Bohol et Panglao".
- **Note** : la route `/itineraire-personnalise-pour-les-philippines` (page complète avec PreferencesForm) avait probablement le même bug puisque le payload format était identique. Le fix profite aussi à la page complète (même backend route).

### IAOverlay — modal planificateur IA proto-strict (3 steps + n8n wiring)
- **Added** : `src/contexts/IAOverlayContext.tsx` (NEW) — Provider + `useIAOverlay()` hook (`isOpen`, `open()`, `close()`). Gere ESC pour fermer, lock body scroll a l'ouverture, focus trap entry. Mount unique dans `app/layout.tsx`.
- **Added** : `src/components/iaoverlay/IAOverlay.tsx` (NEW) — Modal full-screen proto-strict (`_handoff/ui_kit/IAOverlay.jsx` + `specs/IAOverlay.md`).
  - Backdrop `bg-ink/72 backdrop-blur-sm`, click close, motion-reduce respecte (no blur)
  - Sheet `max-w-960 max-h-85vh rounded-3xl shadow-2xl`, role="dialog" aria-modal="true" aria-labelledby
  - Step indicator dots (3 etapes, active = bg-accent w-8)
  - **Step 0** Style : grid 2x2 cartes Détente/Aventure/Culture/Equilibré, ring-2 ring-accent on selection, aria-pressed
  - **Step 1** Parametres : 2 sliders accent-accent (Duree 3-30j, Budget 600-6000€/100), labels stronged tabular-nums, error inline si KO
  - **Step 2** Result : eyebrow ✦ accent + H2 recap (durée·style·budget) + previews cards (variant pill, title, description, highlights pills, budget_estimate accent), fallback message si previews vide
  - Loading state : spinner SVG animate-spin (motion-reduce safe), label "Notre IA cherche…", disabled sur le btn pendant fetch
  - Focus trap manuel (Tab/Shift-Tab cycle entre 1er et dernier focusable de la sheet)
- **Added** : Wiring n8n via `/api/itinerary/generate` (route existante qui forward vers `https://n8n.hugogotophilippines.com/webhook/itinerary-generate`).
  - Mapping helpers : `daysToDuration()` (3-5j→`3-days` ... 31j+→`more`) + `STYLE_TO_TRIP` (Détente→`relax`, Aventure→`adventure`, Culture→`culture`, Equilibré→`mix`)
  - Defaults raisonnables pour les champs non collectes par l'overlay : `travelType: "couple"`, `interests: ["plages","culture","nature"]`, `additionalInfo: ""`
  - Au step 2, CTA "Voir l'itinéraire complet →" redirige vers `/itineraire-personnalise-pour-les-philippines?style=X&days=Y&budget=Z&gen=ID` (query params transmis pour pre-remplir la page complete et passer le `generation_id` n8n a la suite du funnel)
- **Added** : `src/components/iaoverlay/IATriggerButton.tsx` (NEW) — bouton client utilisable depuis les server components (ItineraireIABlock, ArticleFooter) sans avoir a convertir le parent en client. Accepte `className` + `source` (analytics tag) + children.
- **Changed** : `src/app/layout.tsx` — wrap dans `<IAOverlayProvider>`, mount unique `<IAOverlay />` apres ExitIntentPopup. Empilage : AuthProvider > CartProvider > EditModeProvider > IAOverlayProvider.
- **Changed** : `src/components/layout/Header.tsx` — le NavLink `special: true` (CTA "+ Créer Itinéraire") n'est plus un `<Link href>` mais un `<button>` qui appelle `iaOverlay.open()`. Pareil pour la version mobile dans le drawer. Push event analytics `ia_overlay_opened` avec `source: "header"` ou `"header_mobile"`.
- **Changed** : `src/components/homepage/ItineraireIABlock.tsx` — CTA "Je crée mon itinéraire" passe de `<Link>` a `<IATriggerButton source="homepage_block">`.
- **Changed** : `src/components/articles/ArticleFooter.tsx` — CTA "Créer mon itinéraire IA" passe de `<Link>` a `<IATriggerButton source="article_footer">`.
- **Note backend** : la spec mentionnait `POST /api/ai/itinerary` avec stream SSE — non implementé. On utilise l'endpoint REST existant `/api/itinerary/generate` (route Next 15 vers webhook n8n) qui retourne `{success, generation_id, previews}` une fois le workflow n8n termine. L'experience utilisateur est equivalente (loading puis result), sans surcharge SSE pour un flow qui prend < 30s typiquement.
- **A11y** : role="dialog" aria-modal sur sheet, aria-labelledby vers le H2 de chaque step, aria-pressed sur les cartes style, aria-label sur close, focus management (close btn focused on open + focus trap), ESC ferme.
- **Analytics** : events GA4 `ia_overlay_opened` (avec `source`), `ia_step_completed` (avec `step`), `ia_itinerary_generated`. PDF export n'est pas dans le scope overlay (delegue a la page complete post-paiement).

### Refonte page Article 2026 — Etape 5 : A11y polish (skip-link + scroll-spy TOC + mobile collapsible)
- **Changed** : `ArticleTOC` passe en client component pour scroll-spy. IntersectionObserver avec `rootMargin: '-120px 0px -60% 0px'` declenche l'active state quand une section H2/H3 entre dans le tiers superieur du viewport. Quand plusieurs sections intersectent, le DOM-order topmost gagne (evite les flickers entre H2 successifs courts).
- **Changed** : Active link recoit `text-accent`, `border-l-2 border-accent` (au lieu de transparent) et `aria-current="true"` pour les screen readers.
- **Added** : TOC mobile collapsible via `<details>` / `<summary>` (lg:hidden, desktop sticky-left preserve). Chevron rotated via `group-open:rotate-180`, motion-reduce honored. `max-h-[60vh]` + scroll interne pour les sommaires longs.
- **Added** : Skip-link `<a href="#article-content">` en tete de page, `sr-only` par defaut, `focus:not-sr-only` qui le fait apparaitre fixe top-left avec fond accent + ring quand focus clavier — premier element interactif pour utilisateurs SR / clavier.
- **Added** : `id="article-content"` sur le `<main>` wrapper (cible du skip-link).

### Refonte page Article 2026 — Etape 4 : Footer (CTA IA + tags + share + author bio + related grid)
- **Added** : `src/components/articles/ArticleFooter.tsx` (NEW) — composant qui regroupe les 4 zones de fin d'article. Remplace l'ancien rendu inline dans page.tsx (tags pill basique + RelatedArticles carousel).
  - **CTA IA block** : carte gradient `from-primary to-primary/85` text-white avec 2 cercles dashed decoratifs (echo du `ItineraireIABlock` home), eyebrow ✦ "Creation IA gratuite", H3 generique "Pret pour votre voyage aux Philippines ?", paragraphe lead 16px, CTA accent rounded-full "Creer mon itineraire IA" -> `/itineraire-personnalise-pour-les-philippines`. Shadow-cta + focus-visible:ring offset primary.
  - **Tags + Share row** : encadre top/bottom border-y, label "Mots-cles" uppercase tracking-[0.1em] muted, tags en pills `border-accent/30 text-accent bg-accent/5`, ShareButtons existant a droite ml-auto. Affiche le bloc tags meme s'il n'y en a pas (placeholder pour Share seul).
  - **Author bio card** : bg-muted/30 rounded-2xl, avatar 64x64 initiales sur #3B5BDB, nom + role "Equipe editoriale Philippin'Easy" + bio 60ch "Basee entre Cebu, Palawan et Siargao depuis 2020...".
  - **Related grid** : eyebrow "Continuer la lecture" + H2 "Dans la meme categorie", grid responsive 1/2/3 cols max 3 ArticleCards. Reutilise le composant `ArticleCard` existant avec basePath infere depuis `getMainCategoryPath(category.main_category)`.
- **Removed** : Usage de `RelatedArticles` (carousel snap horizontal centered) dans page.tsx — son rendu jurait avec le nouveau ton editorial. Composant intact, toujours utilise par d'autres pages (categories etc.).

### Refonte page Article 2026 — Etape 3 : EditorialRenderer (proto-strict typography + blocks)
- **Added** : `src/components/articles/EditorialRenderer.tsx` (NEW) — renderer Editor.js dedie a la page article 2026. Remplace `ArticleContentRenderer` partage uniquement dans la page article (autres usages preserves).
- **Added** : Styling block-by-block proto-strict :
  - **H2** : `clamp(1.625rem, 3.2vw, 2.125rem)` font-bold tracking-[-0.02em], scroll-mt-32, mt-16 first:mt-0
  - **H3** : 22px font-semibold tracking-[-0.01em], mt-10 mb-4
  - **Paragraphes** : 17px leading-[1.7] text-foreground/90 text-pretty, mb-5
  - **Inline `<a>`** : text-accent + underline + decoration-accent/30 + hover decoration-accent
  - **`<ul>`** : checkmark ✓ accent (before-content) dans cercle bg-accent/12 22x22
  - **`<ol>`** : badge numerote bg-accent/12 text-accent rounded-full 24x24 tabular-nums
  - **`<table>`** : zebra rows (muted/30 odd), header bg-primary/5 + uppercase th tracking-[0.04em], rounded-xl border-border/60 + overflow-x-auto wrapper
  - **`<blockquote>`** : border-l-4 accent + bg-accent/5 italic 19px font-medium + cite uppercase muted
  - **delimiter** : `<hr>` decorative 24px wide, my-12
  - **image** : aspect-16/10 rounded-14 + caption 13px muted center
  - **embed** : 16:9 iframe + caption
- **Removed** : Wrapper `prose prose-lg` dans page.tsx (EditorialRenderer est self-styled, plus de conflit avec le plugin typography).
- **Note** : H2 inline-numerotes conservees telles quelles ("1. Pourquoi...", "2. Avant de partir...") — l'auto-numbering "Section 01" via eyebrow a ete tente puis retire pour eviter le doublon avec la numerotation editorialement deja presente dans les titres.

### Refonte page Article 2026 — Etape 2 : Body 3-col grid (TOC sticky left + content + aside)
- **Added** : `src/components/articles/ArticleTOC.tsx` (NEW, server-side a cette etape — sera client en etape 5 pour scroll-spy). Eyebrow "Dans ce guide" + ul des H2/H3, hover border-l-2 accent transition. lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] avec overflow-y interne pour les sommaires longs.
- **Added** : `src/components/articles/ArticleAside.tsx` (NEW) — sidebar droite sticky avec 2 cards :
  - **Card "A lire aussi"** : 3 articles related avec thumbnail 72x72 rounded-lg + title font-semibold + reading_time muted, hover image-scale-105
  - **Card "Newsletter"** : bg gradient from-accent/5 to-accent/10 border-accent/20, eyebrow ✦ accent, H4 "Recevez nos meilleurs guides", paragraphe muted, input email + button accent rounded-lg shadow-cta. Submit vers `/api/newsletter` (existant).
- **Changed** : `page.tsx` body switche de `lg:flex lg:space-x-8` (sidebar TOC + article wrapper bg-card shadow-xl) vers `grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-12`. 3 colonnes : TOC gauche / article centre / aside droite. Le wrapper bg-card shadow-xl autour de l'article a ete retire (etait une box artificielle, le proto preconise un layout plat avec contenu directement dans le grid).
- **Decision design** : la spec `Article.md` indiquait TOC a gauche sticky (`grid-cols-[240px_1fr_300px]`) tandis que le proto `Article.jsx` mettait la TOC en haut du contenu — choix arbitre par le user en faveur de la spec (TOC sticky gauche) pour eviter que les 45 ancres d'un long article occupent tout l'above-the-fold.

### Fix : H1 accent convention switch to **mot** markdown (single word, no italic)
- **Fixed** : Le H1 de l'etape 1 mettait tout le segment apres ":" en accent italic (heuristique inventee), donnant "Partir aux Philippines : *le guide complet 2026*". User feedback : il preferait UN SEUL mot en accent au milieu (style proto "l'itineraire **complet** (El Nido...)") sans italic.
- **Changed** : `ArticleHero` — `splitTitle()` heuristique remplacee par `renderTitleWithAccent()` qui parse les `**word**` markdown bold dans le titre et les rend en `<span className="text-accent">word</span>`. Plus d'italic. Backwards-compat : si le titre n'a pas de `**...**`, il est rendu tel quel sans accent.
- **Changed** : `page.tsx` — `stripTitleAccent()` helper (regex `\*\*([^*]+)\*\*` -> `$1`) applique aux contextes texte brut : `<title>` Google, `og:title`, `og:image alt`, `twitter:title`. Convention invisible cote SEO/SR.
- **Changed** : `ArticleHero` — `plainTitle()` (meme logique) applique aux props `ShareButtons title=` et `<Image alt=` du cover.
- **Changed** : 5 articles seed en BDD migres vers la convention :
  - 125 : "Partir aux Philippines : le guide \\*\\*complet\\*\\* 2026"
  - 126 : "Budget voyage : 35€/jour aux Philippines, \\*\\*vraiment\\*\\* ?"
  - 127 : "Visa longue duree : SRRV, 13A, retraite — \\*\\*comparatif\\*\\*"
  - 128 : "Saison des pluies : quand \\*\\*partir\\*\\* et ou eviter"
  - 129 : "Rencontrer une Philippine : les \\*\\*codes\\*\\* a connaitre"

### Refonte page Article 2026 — Etape 1 : Hero proto-strict (page-head + article-head + cover)
- **Added** : `src/components/articles/ArticleHero.tsx` (NEW) — composant qui regroupe la nouvelle entree visuelle de la page article. Trois zones distinctes alignees pixel-perfect avec le proto handoff `_handoff/ui_kit/Article.jsx` :
  - **Page-head** : back link "Accueil" avec chevron + breadcrumb path uppercase tracking-[0.08em] (Accueil · VOYAGER · CONSEILS-VOYAGE), focus-visible:ring-2 sur les liens
  - **Article-head** : badge category eyebrow `bg-accent/10 text-accent text-[11px] uppercase tracking-[0.1em]`, H1 `clamp(2rem,4.5vw,3.5rem)` avec heuristique de split (segment apres ":" mis en accent italic, sinon dernier mot), excerpt 18px muted (genere via `generateArticleMetaDescription` 220 chars), byline avec avatar rond 44x44 initiales sur bg #3B5BDB + nom + role + reading_time + date update, ShareButtons + EditArticleButton aligne a droite
  - **Cover** : image 2.5:1 ratio, rounded-[24px], shadow-card, `next/image` priority + sizes responsive
- **Changed** : `src/app/(articles)/[main_category]/[category_slug]/[article_slug]/page.tsx` — remplace l'ancien header inline (h1 + share + meta + image carre) par `<ArticleHero />`. Excerpt calcule cote serveur (220 chars max au lieu de 155 pour le SEO meta) et passe au composant. Imports nettoyes (suppression `Image`, `ShareButtons`, `EditArticleButton`, `Breadcrumb` qui sont desormais dans ArticleHero).
- **Changed** : Le layout body (sidebar TOC + article wrapper bg-card shadow-xl) est conserve a l'identique pour cette etape — sera refondu en etape 2 (grid 2-col + TOC en haut + aside cards Newsletter/Related).
- **Note** : H1 split heuristique — si le titre contient ":" (cas le plus frequent : "Budget voyage Philippines : 35 €/jour reel"), le segment apres ":" est mis en accent italic. Sinon le dernier mot. Permet un H1 visuellement editorial sans modifier les titres en BDD.

### Chore : gitignore local workspace dirs
- **Added** : `.gitignore` — `.claude/`, `output/`, `skills_external_claude/`, `skills_external_marketing/`, `workflows/`. Reduit le bruit dans `git status` (dossiers locaux marketing/skills/n8n non destines au repo).

### Fix critique : webhook Resend inbound utilisait le mauvais endpoint API
- **Fixed** : `src/app/api/webhooks/resend-inbound/route.ts` — endpoint API corrige de `https://api.resend.com/emails/{id}` vers `https://api.resend.com/emails/receiving/{id}`. Le premier path est pour les emails sortants (Sending) et renvoyait `404 Email not found` sur tous les inbound. Symptome : Resend Receiving capturait bien les emails sur `contact@philippineasy.com`, le webhook `email.received` etait correctement configure et POSTait sur la route, mais le forward vers `philippineasy@gmail.com` echouait silencieusement avec HTTP 500. Resultat dans le dashboard Resend : 9 events `email.received` en `Failed` sur 7 jours, 7 attempts par event, response body `{"error":"Failed to fetch email"}`. Aucune ligne `direction: 'inbound'` dans `email_log` Supabase.
- **Added** : Verification optionnelle de signature Svix (Resend utilise Svix pour ses webhooks). Si `RESEND_WEBHOOK_SECRET` est defini en env, la route verifie le HMAC SHA-256 base64 sur `svix-id.svix-timestamp.body` contre le header `svix-signature`. Comparaison `crypto.timingSafeEqual` pour eviter les timing attacks. Skipped quand le secret n'est pas configure (mode degrade pour transition / dev).
- **Changed** : Logging des erreurs enrichi — au lieu de `{error: 'Failed to fetch email'}` opaque, la route retourne maintenant `{error, upstream: 502, detail: <body>}` pour faciliter le debug futur. Code HTTP differencie : 401 sur signature invalide, 502 sur upstream Resend KO, 500 sur erreurs internes.
- **Changed** : `replyTo` extrait depuis `emailData.reply_to[0]` au lieu de `from` brut — plus fidele a l'intent du sender (utile quand un visiteur soumet le formulaire avec une adresse different de l'enveloppe SMTP).
- **Changed** : Subject extrait depuis le payload Resend complet (`emailData.subject`) au lieu du payload webhook tronque, pour eviter les sujets coupes a 64 chars.
- **Note** : 9 events failed dans le dashboard Resend (datant des 7 derniers jours) doivent etre replay manuellement apres deploiement (bouton "Replay" sur chaque event, ou via API webhooks).

### Fix dependances : @react-email/render peer manquant (resend@6)
- **Fixed** : Ajout `@react-email/render` 2.0.7 comme dependency directe. Resend@6.11.0 declare ce package en peer dep marque `optional: true`, mais le bundler Next.js (turbopack en dev, webpack en build) ne respecte pas le flag optional sur les imports indirects et echouait a compiler avec `Module not found: Can't resolve '@react-email/render'`. Routes affectees : `/api/contact`, `/api/webhooks/resend-inbound`, `src/emails/send.ts`. Solution recommandee par l'equipe Resend pour v6+. Coût bundle : ~30 KB. Verification post-install : `/api/contact` compile (400 validation au lieu de 500 ENOENT), articles continuent de rendre en 200.

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
- **Fixed** : `DropdownMenu` (Voyager/S'installer/Communaute/Bons Plans) heritait de `text-base` (16px), incoherent avec les NavLinks simples (Rencontres) en `text-sm` (14px). Aligne sur le pattern NavLink (px-3.5 py-2 text-sm font-medium gap-1.5), chevron passe a `w-2.5 h-2.5 text-accent/80`. Ajout `aria-haspopup`/`aria-expanded` + focus-visible.
- **Fixed** : `Header` wordmark — taille reduite de `text-[26px]` a `text-[22px]` (md) / `text-[20px]` (mobile) + `leading-none` pour mieux equilibrer avec les actions a droite (avatar 32px + pseudo).
- **Added** : Marker "Nouveau" sur l'entree Rencontres — notification dot pattern (cercle accent 6px en absolute top-right du label, halo translucide `0 0 0 3px rgba(245,158,11,0.22)`, animation `pulse-dot` 1.6s, motion-reduce honored). Plus discret qu'un pill texte, dans la palette brand. SR-only `(Nouveau)` pour les lecteurs d'ecran. Prop `badge?: string` declenche l'affichage du dot.

### Refonte homepage 2026 — Etape 3 : InstallerCards pixel-perfect proto
- **Changed** : `InstallerCards` — refonte 1:1 avec le proto handoff : 4 cartes Vivre (S'installer/Travailler/Investir/Etudier) conservees mais densite + typographie alignees. Eyebrow `text-[13px] uppercase tracking-[0.08em] text-muted-foreground` "Vivre aux Philippines". H2 clamp(1.875-2.5rem) avec "Philippines" en accent. Lead 17px "Quatre chemins pour faire des Philippines votre nouvelle maison.". Cartes : container icon 64x64 rounded-2xl `rgba(59,91,219,0.08)` (au lieu d'icone nu 48x48), icone 28x28 stroke-1.5 dans le container. Titre 19px font-semibold tracking-[-0.01em] (au lieu de 16px). Description 14px (au lieu de 12px) leading-[1.55]. CTA texte specifique par carte (`En savoir plus / Guides pro / Opportunites / Decouvrir`) en text-primary fleche translate-x au hover. border-[0.5px], shadow-card-rest, hover -translate-y-1 + shadow-card. Padding 22/28. Gap 22px. focus-visible:ring-2 et motion-reduce safety. Note Q1 (compromis 3+1 intent) revoquee par decision proto-strict.

### Refonte homepage 2026 — Etape 4 : RegionCards 4 regions grid 2x2 + suppression ArchipelMilleVisages
- **Changed** : `RegionCards` — refonte 1:1 avec le proto handoff. 4 regions au lieu de 3 (ajout `Luzon & Manille`). Grid `grid-cols-1 md:grid-cols-2` (2x2 desktop). Eyebrow "Explorer par île" uppercase tracking-[0.08em]. H2 "Un archipel aux **mille visages**" (mille visages en accent). Lead 17px "Des lagons de Palawan aux rizieres de Banaue, en passant par le surf a Siargao et la vie urbaine de Manille — choisissez votre porte d'entree.". Cartes : image 220px haut (au lieu de 180), tags pill overlay bottom-left `bg-white/92 text-ink text-[11px] font-semibold backdrop-blur-sm` (Plongée/Iles/Lagons pour Palawan, Aventure/Nature pour Cebu, Surf/Zen pour Siargao, Culture/Urbain pour Luzon). H3 22px font-semibold tracking-[-0.01em] (au lieu de 19px). Desc 15px leading-[1.55] (au lieu de 13px). CTA "Explorer X →" text-primary translate-x au hover. border-[0.5px], shadow-card-rest, hover -translate-y-1 + shadow-card + image scale 1.04. focus-visible:ring-2.
- **Added** : `LuzonManillePlaceholder` (SVG inline) — gradient ciel-vallee + skyline Manille distant + rizieres en terrasse cascadant + reflets eau. TODO marqueur pour photo Supabase reelle.
- **Removed** : `ArchipelMilleVisages.tsx` — fusionne dans le nouveau RegionCards (decision Q2 validee). Son CTA "Explorer par ile" passe en eyebrow + H2 du nouveau RegionCards.
- **Changed** : `src/app/page.tsx` — import et usage de `ArchipelMilleVisages` retires. Nouveau ordre : Hero → InstallerCards → RegionCards → ItineraireIABlock → ... (suite a refondre dans les etapes 5+).
- **Note** : route `/voyager-aux-philippines/luzon-manille` n'existe pas encore (TODO backend). Le lien pointe sur `/voyager-aux-philippines` (page principale) en attendant.

### Refonte homepage 2026 — Etape 5 : ItineraireIABlock proto-strict
- **Changed** : `ItineraireIABlock` — refonte 1:1 avec le proto handoff. Container bleu gradient (`#3B5BDB → #1e40af`) radius `rounded-3xl`, padding clamp(2.5-4rem). 2 cercles decoratifs dashed white/13% (top-right 320x320 -120/-80, bottom-left 200x200 -60/-40). Grid 1×2 desktop / stack mobile gap-10/12.
- **Added** : Eyebrow "✦ Création IA gratuite" en text-accent (etoile signature brand) + uppercase tracking-[0.08em] white/78.
- **Changed** : H2 "Votre itineraire sur-mesure, **pret en 30 secondes**" (au lieu de "Votre itineraire sur mesure"). "Pret en 30 secondes" en accent. clamp(1.875-2.5rem) tracking-[-0.02em].
- **Added** : 4 bullets check (etait paragraphe descriptif) — `Horaires realistes, temps de trajet inclus / Hotels notes 4+ sur Google Maps / Budget estime par jour / Export PDF et partage lien`. Check icone SVG dans cercle 22x22 `bg rgba(245,158,11,0.2)` text-accent.
- **Changed** : Mockup riche photos+activites remplace par mockup style **fenetre Mac** : title bar gris avec 3 dots colores (rouge/jaune/vert) + titre "Mon voyage · 10 jours · Relax". Body : 3 jours condenses en liste (J1 Manille / J2 Palawan / J3 El Nido), chacun avec pastille `J{n}` 36x36 rounded-xl `bg rgba(59,91,219,0.1)` text-primary, eyebrow city accent uppercase, title 14px font-semibold, activites en `<ul>` `· {item}` muted 12px. Footer "BUDGET ESTIME" + "1 900 € – 2 400 €" en accent 16px tabular-nums.
- **Changed** : CTA "Je cree mon itineraire →" passe en variant `accent` (bg-accent text-ink shadow-cta hover scale 1.02). focus-visible:ring sur fond primary (offset). motion-reduce safety.
- **Added** : `role="img"` + `aria-label` sur le mockup pour les lecteurs d'ecran.
- **Removed** : Mention "Easy+" Whatsapp/Telegram retiree (proto la place ailleurs).

### Refonte homepage 2026 — Etape 6 : Testimonials proto-strict
- **Changed** : `TestimonialsSection` — refonte 1:1 avec le proto handoff. Section `bg-soft-blue` (etait `bg-background`). Eyebrow "Ils ont choisi les" en uppercase tracking-[0.08em]. H2 "Ils ont choisi les **Philippines**" clamp(1.875-2.5rem). Plus de lead (proto n'en a pas).
- **Changed** : 3 testimonials remplaces par les contenus exacts du proto :
  - Pierre D., 42 ans · Entrepreneur digital a Cebu · avatar #3B5BDB · "M'installer a Cebu a ete la meilleure decision..."
  - Marie & Camille · Couple en voyage de noces · avatar #F59E0B · "L'itineraire IA nous a fait gagner deux semaines..."
  - Sophie L., 28 ans · Digital nomade a Siargao · avatar #0EA5E9 (cyan) · "Trois mois en coliving a Siargao..."
  (Anciens : Marc T. 63 ans futur retraite + Sophie L. voyageuse en couple — supprimes par proto-strict).
- **Changed** : Card padding 28px (etait 28px direction p-7), border-[0.5px], shadow-card-rest, suppression du hover transform (proto n'en a pas pour les testimonials). 5 etoiles en accent (au lieu de array conditionnel filled/empty).
- **Changed** : Avatar 44x44 (etait 40x40), font 14px font-bold tracking-[0.02em].
- **Added** : `aria-label="Note X sur 5"` sur la rangee d'etoiles. Glyphe guillemet "99" SVG accent/25 top-right (deja present, conserve).

### Refonte homepage 2026 — Etape 7 : BestDeals proto-strict (Klook hero deals)
- **Changed** : `BestDealsSection` — refonte 1:1 avec le proto handoff. Eyebrow "Partenariat Klook · GetYourGuide" uppercase. H2 "Nos meilleurs **bons plans**". Lead "Les activités et expériences sélectionnées par notre équipe locale.".
- **Changed** : 3 hero deals au pattern proto : image 180px haut + tag badge top-left coloré (Adventure amber `#FEF3C7/#854D0E` / Nature emerald `#D1FAE5/#065F46` / Surf blue `#DBEAFE/#1E40AF`) + prix overlay bottom-right `dès XX €` en `bg-card text-accent shadow-md`. Body : icone pin + location uppercase tracking-[0.04em] + H3 16px font-semibold + rating `★ 4.X (XXXX avis)` en accent + CTA `bg-primary` plein "Réserver →" full-width.
- **Changed** : Donnees reelles depuis `klook-activities-data.ts` (Palawan El Nido / Cebu Oslob whalesharks / Siargao Cloud 9 surf), URL affiliate Klook (aid=118789). `target="_blank" rel="sponsored noopener noreferrer"` sur les liens externes.
- **Changed** : Images locales quand dispo (`/images/palawan/vue-aerienne-coron.webp`, `/images/siargao/surf-a-siargao.webp`). Pour Cebu Oslob (whalesharks) : nouveau **SVG placeholder editorial** ocean profond avec silhouette requin-baleine et taches blanches caracteristiques + bulles. TODO photo Supabase reelle.
- **Changed** : Le `KlookCarousel` (revenue value) descend en seconde position avec activites differentes des 3 hero (palawan[1], cebu[1], siargao[1], palawan[2], cebu[2], siargao[2]). Titre "Plus d'activites a reserver aux Philippines".
- **Removed** : Affichage des `initialDeals` (Article DB) — non present dans le proto. Prop conservee dans la signature comme `@deprecated` pour back-compat avec `page.tsx` mais non rendu. EditableWrapper retire (les deals etaient editables, plus pertinent maintenant que c'est hardcoded Klook).

### Refonte homepage 2026 — Etape 8 : BlogSection (NEW) + suppression FeaturedNewsSection
- **Added** : `BlogSection` (nouveau composant) — refonte 1:1 avec le proto handoff. Layout split desktop : featured 1.5fr | side stack 1fr (gap 22px), puis row 3 cards en dessous (gap 18px). Section `bg-soft-blue`. Eyebrow "Magazine · 340+ articles" + H2 "Les **derniers articles** du blog" + lead.
- **Featured hero** : image full cover min-h-[480px] rounded-[20px] shadow-hero. Scrim bottom→top `linear-gradient` ink/0.90 → ink/0.55 → transparent. Pill "Guide complet" (categoryClass blue) top-left. Overlay bottom z-10 : meta `★ À la une · 14 min de lecture` (warm-yellow + white/85), H3 clamp(1.5-1.875rem) bold tracking-[-0.02em] text-balance, excerpt 15px white/85 text-pretty, separator border-white/20, avatar 38x38 gradient amber→orange "M" + author/date + CTA "Lire l'article →" warm-yellow translate-x au hover.
- **Side stack** : 2 cards horizontales (image 140px + body) avec border-[0.5px], shadow-card-rest, hover -translate-y-0.5 + shadow-card + border-primary/30. Badge sm + H4 15px + meta date·read uppercase tracking.
- **Row 3 cards** : 2 articles (Climat/Culture) avec image 140px + tag overlay top-left + body H4 15px + meta. 1 card "Tous les articles" en dashed border (`1.5px dashed #C7D2FE` sur fond `linear-gradient(135deg, #F4F7FE → #fff)`), eyebrow primary "Magazine" + "340+ articles" 24px bold + tagline + lien "Tous les articles →".
- **Tag/badges** : couleurs tonales par categorie (Guide complet=blue 100/800, Budget=emerald, Visa=purple, Climat=amber, Culture=teal). Helper `<Badge>` interne avec sizes sm/md.
- **Note backend** : contenus statiques alignes au proto, liens vers vraies routes existantes (`/voyager-aux-philippines`, `/voyager-aux-philippines/budget`, `/voyager-aux-philippines/quand-partir`, `/vivre-aux-philippines`, `/rencontre-philippines`, `/actualites-sur-les-philippines`). TODO: brancher `getHomepageArticles` ou nouveau `getBlogArticles` au suivi.
- **Removed** : `FeaturedNewsSection.tsx` (remplace par BlogSection). Plus utilise dans `page.tsx`. `featuredItems` retire de la destructuration `getHomepageArticles()`.
- **Added** : Import dynamique de `BlogSection` dans `page.tsx`. Reorder : Hero → InstallerCards → RegionCards → ItineraireIABlock → Testimonials → BestDeals → BlogSection → LeadMagnet → FinalCta (LeadMagnet descendu apres BlogSection pour matcher l'ordre editorial du proto).

### Refonte homepage 2026 — Etape 9 : RencontresTeaser (NEW) — split + fanned stack
- **Added** : `RencontresTeaser` (nouveau composant) — refonte 1:1 avec le proto handoff. Section bg gradient pastel rose `linear-gradient(180deg, #ffffff 0%, #FDF4FF 100%)` (seule entorse palette).
- **Layout split** : 2 cols desktop (gap 60px), stack mobile (gap 40px).
- **Gauche (copy)** : Eyebrow `✦ Rencontres · +40 000 membres` en `#EC4899` (rose secondary signature) uppercase tracking-[0.08em]. H2 "Trouvez **l'amour** aux Philippines" (l'amour en em rose). Lead 17px slate-700. 3 bullets check emerald (`bg #D1FAE5 text emerald-700`) : Profils verifies / Traduction auto FR↔EN↔Tagalog / Conseils culturels. 2 CTAs : primary bleu "Creer mon profil gratuit →" + outline "Voir les profils". Stats row (40k+ / 1 800 / 4,8 ★) avec border-t border-border/60.
- **Droite (visual stack)** : container `min-h-[520px]`. **Desktop** : stack 4 cards `absolute width-[240px]` rotees (-5°/-2°/4°/2°) aux positions exactes du proto (top:0/30/60/200, left/right alternes), z-index 1→4. Hover : rotate(0) + translateY(-1.5) + z-30. **Mobile** : fallback grid 2x2 sans rotation (a11y). `prefers-reduced-motion` : rotations + translations annulees via `motion-reduce:!rotate-0 motion-reduce:!translate-x-0`.
- **ProfileCard** : photo placeholder SVG portrait stylise (gradient + silhouette + sparkles) — 4 profils Maria/Andrea/Sofia/Gabriela avec couleurs avatar et gradients differents. Avatar 42x42 rond avec border-3 white + box-shadow. Pill distance/En ligne en bas-droite (avec dot vert pulsant si online) `bg rgba(0,0,0,0.55) backdrop-blur`. Body : nom+age 15px bold + check verifie 16x16 dans pill primary. City + pin icone. Tags pill 10px `bg #FDF4FF text #9F1239`.
- **Badge floating "23 nouveaux matchs"** : absolute bottom-2 left-0 (md:-left-2) z-20, bg-card rounded-[14px] padding 16/12, shadow-hero, emoji 💬 + texte "23 nouveaux matchs / aujourd'hui dans votre region".
- **Note backend** : profils statiques (TODO brancher GET /api/rencontres/teaser-profiles avec migration `dating_profiles.show_in_teaser`). PortraitSVG = placeholder editorial en attendant les photos opt-in.
- **page.tsx** : import dynamique de `RencontresTeaser`, place entre `BlogSection` et `LeadMagnet` selon l'ordre proto.

### Refonte homepage 2026 — Articles editoriaux + branchement BlogSection
- **Added** : 5 articles rediges (3000-5000 chars chacun, voix narrative humaine, anecdotes concretes, liens internes croises, lien partenaire Klook actif aid=118789, lien `/partenaires` pour les autres affilies en attente). Inseres en DB Supabase via SQL :
  - id=125 `partir-aux-philippines-guide-complet-2026` (cat 10 conseils-voyage, 14 min)
  - id=126 `budget-voyage-35-euros-jour-philippines` (cat 10, 8 min)
  - id=127 `visa-longue-duree-srrv-13a-comparatif` (cat 1 visas-et-formalites, 11 min)
  - id=128 `saison-pluies-quand-partir-philippines` (cat 10, 6 min)
  - id=129 `rencontrer-philippine-codes-culturels` (cat 5 culture-integration, 9 min)
- **Changed** : `BlogSection` passe de composant statique a **async Server Component** qui fetch les 5 articles via `supabase.from('articles').select(... category) WHERE slug IN (...) AND status='published'`. Genere les vraies URLs via `generateArticleUrl` (`/voyager-aux-philippines/conseils-voyage/<slug>`, etc.). Conserve l'UI editoriale exacte (featured 1.5fr + side stack 2 + row 3 + "Tous les articles"). Fallback graceful sur images locales et titres si fetch echoue.
- **Changed** : `page.tsx` — `BlogSection` retiree du `dynamic()` (besoin d'etre async server component) et importee directement.
- **Note** : Champ `image` des 5 articles laisse NULL en DB pour l'instant. Le composant fallback sur les images locales `/imagesHero/*` et `/images/voyager/*` deja en place. A remplacer par les vraies images apres generation Banana 2 (prompts fournis hors codebase).

### Refonte homepage 2026 — Enhancement : BestDeals devient carousel infini
- **Changed** : `BestDealsSection` — passage de 3 cards statiques a un **carousel embla** (loop + autoplay 4.5s + stopOnInteraction false + stopOnMouseEnter false + playOnInit true) qui presente TOUTES les activites Klook (palawanActivities + cebuActivities + siargaoActivities = ~15 cards). UI editoriale conservee a l'identique (tag overlay top-left, prix overlay bottom-right, pin location, rating, CTA Reserver bg-primary). Scroll responsive : 1 card mobile / 2 tablet / 3 desktop.
- **Header** : titre **centre** (eyebrow + H2 + lead) — pas d'arrows a droite (placees sous le carousel pour ne pas alterer l'alignement editorial).
- **Nav controls** : un seul groupe centre `[‹ arrow] [• • • dots] [› arrow]` sous le carousel, mobile et desktop. Plus simple et coherent.
- **Removed** : Le 2e `KlookCarousel` "Plus d'activites a reserver" sous la section — devenu redondant (toutes les activites sont deja dans le hero carousel). Le composant `KlookCarousel` reste dispo pour les pages destination.
- **Tracking** : Chaque clic CTA "Reserver" track via `trackCtaClicked` avec `cta_text=klook_{id}` et `cta_location=best_deals_homepage` pour suivre le perf des hero deals vs autres surfaces affiliate.
- **A11y** : `aria-roledescription="carousel"`, `aria-label`, dots `role="tablist"` + `role="tab"` + `aria-selected`, focus-visible sur tous les controls.

### Refonte homepage 2026 — Fix : BestDeals branche directement les vraies data Klook
- **Fixed** : Les 3 hero cards de `BestDealsSection` utilisaient des images locales (Palawan, Siargao) et un SVG placeholder (Cebu Oslob whaleshark). User a demande l'UI exacte mais avec les vraies infos Klook (photos + liens affiliation) — comme dans le `KlookCarousel` dessous. **Resoud** : chaque hero card mappe directement sur `palawanActivities[0]`/`cebuActivities[0]`/`siargaoActivities[0]` (vraies images Unsplash deal-officielles, vrais prix, vrais ratings/reviews, vraies URLs affiliate aid=118789). UI inchangee (tag overlay + prix + pin location + rating + CTA Réserver).
- **Removed** : `WhalesharkPlaceholder` SVG inline (plus utilise). Logique de fallback local supprimee.
- **Note** : `next.config.js` autorise deja `images.unsplash.com` dans `remotePatterns` — les images Klook officielles passent par next/image avec optimisation AVIF/WebP comme prevu.

### Refonte homepage 2026 — Fix : tags lisibles + image Cebu Supabase
- **Fixed** : `RegionCards` tags pill — passes de `bg-white/92 text-ink` (illisible sur images claires en bas-gauche, comme Palawan/Siargao) a `bg-ink/72 text-white backdrop-blur-md shadow-sm` (frosted glass sombre, lisibilite garantie sur toute image). Style + moderne, brand-coherent.
- **Changed** : `RegionCards` est passe en **async Server Component** qui fetch les categories `voyager-aux-philippines` depuis Supabase via `getCategoriesByMainCategory`. Pour chaque region (palawan/cebu-visayas/siargao), si une `heroImage` existe en DB, elle est utilisee. Sinon fallback image locale (`/images/palawan/...`, `/images/siargao/...`). Pour Luzon & Manille (pas de categorie en DB), garde le SVG placeholder editorial. **Resoud** : Cebu & Visayas affiche maintenant la vraie photo Supabase (coucher de soleil + ponton), comme sur `/voyager-aux-philippines`.
- **Removed** : `CebuVisayasPlaceholder` (SVG inline) — n'est plus necessaire car la vraie photo Supabase est utilisee. Logique de fallback simplifiee (image DB → image locale → SVG placeholder Luzon → gradient subtle).

### Refonte homepage 2026 — Etape 10 : Footer 5-col proto-strict
- **Changed** : `Footer` — refonte 1:1 avec le proto handoff. Bg `bg-ink` (#0F172A) au lieu de `bg-gray-900`. Padding pt-16 pb-6.
- **Layout** : grid `lg:grid-cols-[1.3fr_3fr]` (top section). Col 1 = Brand. Col 2 = Nav block 4 sub-cols.
- **Brand col** : wordmark "Philippin'**Easy**" 26px (Easy en accent) + tagline 14px white/40 max-w-320 + 4 socials ronds 38x38 `bg-white/[0.06]` hover `bg-accent text-ink` (Facebook, Instagram, Telegram, YouTube). **Newsletter compacte** conservee dessous (revenue value) avec label uppercase "Newsletter mensuelle" + input `bg-white/[0.06]` + bouton accent (paper plane, check ou spinner selon status). Branchement existant sur `/api/newsletter` + tracking GA4 + Meta Pixel preserves.
- **Nav block** : 4 cols (`Voyager / S'installer / Communaute / Philippin'Easy`) avec liens proto. Mobile : grid 2 cols.
  - Voyager : Palawan, Cebu & Visayas, Siargao, Boracay (TODO route), Manille (TODO route), Itineraire IA
  - S'installer : Visas, Logement, Travailler, Investir, Etudes, Sante
  - Communaute : Forum, Rencontres, Temoignages, Buddy System, Pack Ultime
  - Philippin'Easy : A propos (TODO), Contact, Presse (TODO), Partenaires, Mentions legales, Confidentialite
- **Titles col** : white 14px font-bold mb-3.5. **Links** : slate-400 13px hover:text-white transition-colors. focus-visible:underline pour a11y.
- **Bottom** : border-t border-white/10 pt-6, flex justify-between : copyright (annee dynamique `new Date().getFullYear()`) + groupe milieu (CGU + Gestion cookies + Admin conditionnel) + tagline "Fait avec ♥ a Cebu & Paris" (♥ en accent).
- **Removed** : Ancienne col "Contact & Support" (email/contact/location) — emails et contact deplaces dans la col "Philippin'Easy" et les pages liees. WhatsApp lien retire (deja dispo via TawkTo chat).
- **A11y** : `<nav aria-label="Navigation pied de page">`, all socials `aria-label`, focus-visible ring sur tous les interactifs, motion-reduce safety sur transitions.

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
