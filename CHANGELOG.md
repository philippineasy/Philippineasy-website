# Changelog — Philippineasy Website

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### IAOverlay v2 — funnel complet (variants + offers + paiement) + warning anti-quit
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
