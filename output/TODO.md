# TODO — Philippineasy Guide Operationnel Complet
# Mis a jour automatiquement par Claude Code a chaque session
# Derniere MAJ : 2026-04-28 (P0 fix value:0 + Klook live)

## Legende
### Guides (colonne G)
- [v] = Guide redige (fichier .md dans output/guides/)

### Implementation (colonne I)
- [x] = Implemente et fonctionnel
- [~] = Partiellement implemente
- [ ] = A faire (necessite du code ou de la config)
- [-] = Pas de code necessaire (guide strategique / config UI / creatif)
- [>] = Bloque par une autre tache

---

## BLOC 0 — BOOTSTRAP SYSTEME
| # | Tache | G | I |
|---|-------|---|---|
| 0.1 | Creer CLAUDE.md | [v] | [x] |
| 0.2 | Creer TODO.md | [v] | [x] |
| 0.3 | Structure dossiers output/guides/ | [v] | [x] |
| 0.4 | Importer skills marketing | [v] | [x] |
| 0.5 | Lire strategie marketing | [v] | [x] |

---

## BLOC 1 — TRACKING & ANALYTICS (BLOQUANT)
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 1.1 | GA4 installation Next.js 15 | [v] | [x] | Consent mode v2 RGPD implemente (denied par defaut, update via CookieBanner CustomEvent). Reste: retention 14 mois, Google Signals, filtre trafic interne (config GA4 UI) |
| 1.2 | GA4 conversions config | [v] | [x] | `src/lib/analytics.ts` cree (12 fonctions). Integre dans checkout itineraire/marketplace/services, contact, newsletter, exit intent, lead magnets. **Fix 2026-04-28 (commit f62615b)** : les 3 pages completion envoyaient `value: 0` -> nouveaux endpoints `/api/services/verify-session` et `/api/orders/verify-payment`, `/api/itinerary/confirm-payment` retourne maintenant `amount`. ROAS/CPA enfin mesurables. |
| 1.3 | GA4 dashboard personnalise | [v] | [ ] | Config GA4 UI — maintenant possible grace aux events 1.2 |
| 1.4 | Meta Pixel installation | [v] | [x] | Consent mode (revoke par defaut), `NEXT_PUBLIC_META_PIXEL_ID` configure sur Vercel (667078773024359). `src/lib/meta-pixel.ts` cree (9 fonctions). Events integres. **Fix 2026-04-28** : sanitize ID (strip non-digit chars) pour resister aux env Vercel mal saisis (avait `\n` litteral) + switch `dangerouslySetInnerHTML` au lieu de Script children pour eviter erreurs `appendChild Invalid token` declenchees par adblockers Brave Shields |
| 1.5 | Google Tag Manager | [v] | [-] | Intentionnellement reporte. GA4 + Meta Pixel directs suffisent pour le lancement. A reconsiderer si LinkedIn/TikTok Ads |
| 1.6 | UTM conventions | [v] | [~] | GA4 capture automatiquement les UTM des URLs (natif). **Manque:** aucun code custom de parsing/stockage UTM, pas de forwarding vers Stripe/CRM. Acceptable pour le lancement |
| 1.7 | Google Search Console | [v] | [x] | Propriete verifiee depuis jan 2026, GA4 associe, SA ajoute, APIs activees (Analytics Data + Search Console). robots.txt corrige (news-sitemap fantome retire). MCP GSC connecte |

### Actions P0 — COMPLETE (2026-04-16)
- [x] **1.1a** Consent mode v2 RGPD branche (CookieBanner -> GA4 + MetaPixel via CustomEvent)
- [x] **1.2a** `src/lib/analytics.ts` cree (12 fonctions tracking GA4)
- [x] **1.2b** Tracking integre dans 6 fichiers (checkout x3, contact, newsletter, exit intent, lead magnets)
- [x] **1.4a** `NEXT_PUBLIC_META_PIXEL_ID=667078773024359` configure sur Vercel (3 envs)
- [x] **1.4b** `src/lib/meta-pixel.ts` cree (9 fonctions Meta Pixel)
- [x] **1.7a** APIs Analytics Data + Search Console activees (Google Cloud)
- [x] **1.7b** GSC deja verifie depuis jan 2026, pas besoin de meta tag
- [x] **1.7c** Reference news-sitemap.xml retiree de robots.txt

### Actions P0a — FIX VALUE:0 (2026-04-28, commit f62615b)
- [x] **1.2c** Fix `/api/itinerary/confirm-payment` retourne maintenant `amount` + `currency` dans la response (avant : seulement success)
- [x] **1.2d** Nouveau endpoint `/api/services/verify-session` (auth + ownership) lookup `service_purchases` par `stripe_checkout_session_id`
- [x] **1.2e** Nouveau endpoint `/api/orders/verify-payment` (auth + ownership) lookup `orders` par `stripe_payment_intent_id` avec retry 1.5s pour webhook async
- [x] **1.2f** 3 pages completion (itinerary, services, marketplace) appellent leur endpoint et envoient les vraies valeurs Purchase a GA4 + Meta
- [x] **1.4c** `MetaPixel.tsx` sanitize l'ID + switch a `dangerouslySetInnerHTML` (resilient aux env values pollues + adblockers)
- [x] **1.2g** `analytics.ts` + `meta-pixel.ts` console.log dev-only (gated NODE_ENV) pour debug futur
- [x] **1.2h** Test end-to-end valide : `[GA4 trackEvent] purchase value: 9.99 currency: EUR` confirme dans devtools

**Impact** : ROAS/CPA enfin mesurables sur Google Ads, Meta Ads et tout autre canal. Pre-requis BLOC 3+4 (campagnes payantes) leve.

---

## BLOC 2 — AFFILIATION (0 EUR investi, REVENU PASSIF)
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 2.1 | Booking.com Affiliate | [v] | [~] | URL `booking.com/country/ph.fr.html` presente sur `/partenaires` et `/voyager-aux-philippines/budget` mais **sans tag affilie** (pas de `aid=` ou `?aid=...`). Inscription programme + ajout tag = 30 min de code |
| 2.2 | Chapka/AVI Assurance | [v] | [~] | URL `chapkadirect.fr/assurance-voyage.html` presente sur `/partenaires` et `/voyager-aux-philippines/sante-securite` mais **sans tag affilie**. Inscription programme + ajout tag = 30 min de code |
| 2.3 | Wise Affiliate | [v] | [~] | URL `wise.com/fr/send-money/send-money-to-philippines` presente sur `/partenaires` mais **sans tag affilie**. Inscription Wise Friends + ajout tag = 30 min de code |
| 2.4 | Airalo eSIM | [v] | [~] | URL `airalo.com/philippines-esim` presente sur `/partenaires` et `/voyager-aux-philippines/communication` mais **sans tag affilie**. Inscription programme + ajout tag = 30 min de code |
| 2.5 | NordVPN Affiliate | [v] | [~] | URL `nordvpn.com/fr/` presente sur `/partenaires`, `/voyager-aux-philippines/sante-securite` et `/voyager-aux-philippines/communication` mais **sans tag affilie**. Inscription CJ Affiliate + ajout tag = 30 min de code |
| 2.6 | Klook Philippines | [v] | [x] | **LIVE.** Affiliate `aid=118789` configure dans `src/components/affiliate/klook-activities-data.ts`. Composant `KlookCarousel` integre sur Palawan, Cebu-Visayas, Siargao + page `/partenaires` + `BestDealsSection` homepage |
| 2.7 | Page /partenaires | [v] | [x] | **LIVE.** Route `src/app/partenaires/page.tsx` existe avec 6 sections (Klook live, Booking/Chapka/Wise/Airalo/NordVPN avec URLs placeholder en attente d'inscription affilie). Composants `AffiliateLink`, `AffiliateRecommendation` reutilisables crees |
| 2.8 | Calculateur revenus | [v] | [-] | Outil de projection (spreadsheet), pas de code. Projection: 4553 EUR/6 mois si tous programmes actifs |

### Actions Bloc 2
- [x] **2.7a** ~~Creer page `/partenaires`~~ — DONE, route active avec 6 sections
- [x] **2.x** ~~Creer composant generique `AffiliateLink`~~ — DONE (`AffiliateLink.tsx`, `AffiliateRecommendation.tsx`, `KlookCarousel.tsx`)
- [x] **2.x** ~~Integrer liens dans pages existantes~~ — DONE (budget, communication, communication/carte-sim, sante-securite, banque-assurance, destinations Palawan/Cebu/Siargao, homepage BestDeals)
- [x] **2.6a** Klook actif (aid=118789)
- [ ] **2.0** S'inscrire aux 5 programmes restants (Booking, Chapka, Wise, Airalo, NordVPN) — **action manuelle Hugo**
- [ ] **2.x** Une fois les 5 IDs obtenus, mettre a jour les URLs avec les tags affilies (les URLs placeholders sont deja en place dans le code, juste a tagguer)

---

## BLOC 3 — GOOGLE ADS (Search + Display)
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 3.1 | Creation compte Google Ads | [v] | [ ] | Config UI. Pas de NEXT_PUBLIC_GOOGLE_ADS_ID configure. GA4 existe mais pas lie a Google Ads |
| 3.2 | Structure compte | [v] | [-] | Planning/strategie, pas de code |
| 3.3 | Campagne Search itineraire | [v] | [~] | Landing page `/itineraire-personnalise-pour-les-philippines` existe et fonctionne. Config campagne = UI Google Ads |
| 3.4 | Mots-cles complet | [v] | [-] | Fichier reference pret a importer dans Google Ads |
| 3.5 | Redaction annonces RSA | [v] | [-] | Templates prets dans guide + `assets/templates-ads/google-ads-templates.md` |
| 3.6 | Extensions annonces | [v] | [-] | Config UI uniquement (sitelinks, accroches, extraits) |
| 3.7 | Conversion tracking GA4<->Ads | [v] | [x] | **LIVE 2026-04-28** : compte Ads `380-633-5752` (EUR/Paris), GA4 `520177629` lie (personnalisation + auto-tagging ON), 3 conversions importees depuis GA4 (`purchase` Achat, `generate_lead` Lead, `newsletter_signup` Inscription), tag `AW-16902543219` (nomme "Philippineasy") deploye via `GoogleAdsTag.tsx`. `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-16902543219` sur Vercel (3 envs). Apres redeploy, le remarketing tag se charge automatiquement et les audiences vont commencer a se constituer. |
| 3.8 | Campagne Display/Remarketing | [v] | [>] | Config UI. **Bloque par** 3.7 (conversion tracking) + audiences GA4 |
| 3.9 | Campagne rencontre compliance | [v] | [~] | Landing page `/rencontre-philippines` existe. Config campagne = UI. Certification dating Google Ads requise |
| 3.10 | Budget et encheres | [v] | [-] | Strategie, pas de code |
| 3.11 | Optimisation hebdomadaire | [v] | [-] | Checklist operationnelle |
| 3.12 | Templates annonces | [v] | [-] | Templates prets dans `assets/templates-ads/google-ads-templates.md` |

### Actions Bloc 3
- [x] **3.1a** Compte Google Ads cree (380-633-5752, EUR/Paris)
- [x] **3.7a** GoogleAdsTag.tsx cree (composant defensif + helper trackGoogleAdsConversion)
- [x] **3.7a-bis** `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-16902543219` ajoute sur Vercel (production, preview, development)
- [x] **3.7b** GA4 <-> Google Ads lies (personnalisation publicitaire ON, taggage automatique ON, autoriser acces Analytics depuis Ads ON)
- [x] **3.7c** 3 conversions importees depuis GA4 : `purchase` (Achat), `generate_lead` (Lead — Envoi formulaire), `newsletter_signup` (Inscription)
- [x] **3.7d** Visuels Display Network produits (33 bannieres totales : 18 base 1200x628/1200x1200 + 15 formats Display Network 300x250/728x90/970x250/300x600/1080x1920). Brief A/B dans `output/google-ads-assets/AB_VARIANTS_BRIEF.md`
- [x] **3.2-3.6** Campagnes integrees via Google Ads Editor 2026-04-28 (compte 380-633-5752) : 3 campagnes Paused (SEARCH_Itineraire_IA 7eur/jour, DISPLAY_Remarketing 2eur/jour, SEARCH_Brand 1eur/jour, total 10eur/jour soft launch), 9 ad groups, 84 keywords (positifs + 50 exclusions), 5 RSA, 10 sitelinks, 14 callouts. Source CSV : `output/google-ads-import/`
- [x] **3.8** Audiences Display Remarketing (2026-04-28) : 2 segments URL Web UI (Visiteurs_Itineraire_Sans_Achat 30j + Abandons_Checkout 7j) + 2 segments GA4 event-based crees via Admin API (Itineraire IA Engages Sans Achat + Abandons Checkout Itineraire) — attachees en mode Ciblage aux 2 ad groups DISPLAY_Remarketing
- [x] **3.8-bis** Bannieres Display uploadees (2026-04-28) : 2 RDA — 12 images itineraire (controle A + B + C, 6 paysage + 6 carre) dans Visiteurs_Itineraire_Sans_Achat + 6 images abandon (3 paysage + 3 carre) dans Abandons_Checkout. Logo paysage + carre. Note : variante B "-10% FINALSTEP" gardee pour activation future quand le coupon Stripe sera implemente
- [x] **3.8-ter** Frequency cap 3/jour, content exclusions (evenements tragiques, politique, sensationnel, vidéos in-stream below the fold) appliquees
- [x] **3.9** "Non-political ads" confirme sur le compte
- [x] **3.10a** Budgets ajustes selon guide Phase 1 (cf. `output/guides/bloc3-google-ads/3.10-budget-encheres-strategies.md`) : SEARCH_Itineraire_IA 10eur/jour, DISPLAY_Remarketing 5eur/jour, SEARCH_Brand 3eur/jour. Total 18eur/jour ≈ 540eur/mois (Phase 1 guide = 550eur)
- [x] **3.10b** Strategies d'encheres alignees sur guide : SEARCH_Itineraire_IA en "Maximiser les clics" portfolio (CPC max 0.80eur) — collecte donnees semaine 1-2 avant switch Maximize Conversions ; DISPLAY_Remarketing portfolio "Maximiser les conversions" ; SEARCH_Brand CPC manuel (1eur/keyword) pour defense brand
- [x] **3.10c** **3 campagnes ACTIVEES 2026-04-28** : SEARCH_Brand + SEARCH_Itineraire_IA + DISPLAY_Remarketing. Statut : annonces "En cours d'examen" Google (24-48h) + DISPLAY en attente audiences peuplees (≥100 visiteurs, ~7j). Diffusion effective sous 24-48h apres approbation
- [x] **3.11a** 50 mots-cles negatifs ajoutes (43 SEARCH_Itineraire_IA + 3 SEARCH_Brand + 4 DISPLAY_Remarketing) — bloque emploi/visa/typhon/concurrents/contenu sensible
- [x] **3.11b** Generic_* ad groups supprimes (cleanup post-import — supprime 48 keywords doublons qui auraient cannibalise Exact/Phrase/Brand)
- [ ] **3.11c** Routine optimisation hebdomadaire 30 min — **process Hugo** (cf. guide 3.11 — verifier CTR > 1.5% Search / 0.5% Display, Quality Score > 7, CPA < 8eur Express / 15eur Premium ; ajouter mots-cles negatifs depuis termes de recherche, exclure placements pourris)
- [ ] **3.12** A J+15 (vers 2026-05-13) : si SEARCH_Itineraire_IA a 10+ conversions trackees, switch strategie de "Maximiser les clics" vers "Maximiser les conversions" (selon progression du guide 3.10)

---

## BLOC 4 — META ADS (Facebook / Instagram)
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 4.1 | Creation Business Manager | [v] | [ ] | Pas de compte Business Manager verifie. Pas de meta tag `facebook-domain-verification` dans layout.tsx. **Action manuelle Hugo** |
| 4.2 | Meta Pixel Next.js 15 | [v] | [~] | `MetaPixel.tsx` existe (init + PageView). `NEXT_PUBLIC_META_PIXEL_ID` NON configure = composant retourne null. Aucun custom event. Identique a 1.4 |
| 4.3 | Structure campagnes funnel | [v] | [-] | Planning TOFU/MOFU/BOFU, pas de code |
| 4.4 | Audience itineraire IA | [v] | [>] | Config Meta UI. **Bloque par** 4.1 (Business Manager) + 4.2 (Pixel actif) |
| 4.5 | Audience rencontre | [v] | [>] | Config Meta UI. **Bloque par** 4.1 + 4.2 |
| 4.6 | Lookalike Audiences | [v] | [>] | Config Meta UI. **Bloque par** 4.4/4.5 (audiences sources) |
| 4.7 | Reels/Stories specs | [v] | [-] | Reference technique creatif (formats, safe zones, durees) |
| 4.8 | Scripts itineraire | [v] | [~] | `script-reel-itineraire-angle1.md` (234 bytes) et `angle2.md` existent mais sont des squelettes. Scripts complets dans le guide mais pas dans les assets |
| 4.9 | Scripts rencontre | [v] | [~] | `script-reel-rencontre-angle1.md` (263 bytes) squelette. Meme situation |
| 4.10 | A/B testing Meta | [v] | [-] | Methodologie, pas de code |
| 4.11 | Retargeting sequences | [v] | [>] | Config Meta UI. **Bloque par** Pixel + audiences |
| 4.12 | Analyse resultats | [v] | [-] | Checklist operationnelle |

### Actions Bloc 4
- [ ] **4.1a** Creer Business Manager + compte pub — **action manuelle Hugo**
- [ ] **4.1b** Ajouter meta tag `facebook-domain-verification` dans layout.tsx
- [ ] **4.2a** = 1.4a (configurer NEXT_PUBLIC_META_PIXEL_ID)
- [ ] **4.8a** Completer les fichiers scripts dans assets/ avec le contenu complet des guides

---

## BLOC 5 — CREATION VISUELS IA (Google AI Pro)
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 5.1 | Veo 2 premiers pas | [v] | [-] | Guide d'utilisation outil externe. Aucun code |
| 5.2 | Veo 2 prompts itineraire | [v] | [-] | 10 prompts dans `assets/prompts-ia/prompts-veo2-philippineasy.md`. Workflow creatif |
| 5.3 | Veo 2 prompts rencontre | [v] | [-] | 5 prompts dans meme fichier. Workflow creatif |
| 5.4 | Imagen 3 generation images | [v] | [-] | Guide style visuel. Workflow creatif |
| 5.5 | Imagen 3 prompts ads | [v] | [-] | 20 prompts dans `assets/prompts-ia/prompts-imagen3-philippineasy.md`. Workflow creatif |
| 5.6 | Gemini Pro copywriting | [v] | [-] | Prompts dans `assets/prompts-ia/prompts-gemini-copywriting.md`. Workflow creatif |
| 5.7 | NotebookLM concurrents | [v] | [-] | Guide recherche/veille. Aucun code |
| 5.8 | Workflow idee->visuel->pub | [v] | [-] | Guide processus complet. Aucun code |
| 5.9 | Bibliotheque prompts | [v] | [-] | Index/reference. Complet |

**Bloc 5 = 100% complet.** Tous les guides sont des workflows creatifs externes, aucun code requis. Assets prompts IA en place.

---

## BLOC 6 — CONTENU & SEO
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 6.1 | SEO technique audit | [v] | [~] | **Fait:** robots.txt correct (bloque admin/api/profil), sitemap.ts dynamique (260+ lignes), JSON-LD complet (8 composants), canonical URLs via `alternates`, Open Graph tags sur les pages principales, 33+ usages `next/image`. **Manque:** 5+ balises `<img>` brutes (admin, dating), verification que toutes les fonts utilisent `next/font`, audit PageSpeed/Core Web Vitals non fait, verification unicite titles/descriptions sur 80+ pages, 145 `'use client'` (certains inutiles, impact LCP) |
| 6.2 | Articles programmatiques | [v] | [ ] | **ZERO implemente.** Pas de table `destination_itineraries` dans Supabase. Pas de template composant. Pas de page dynamique `/itineraire-[slug]`. Pas de hub `/itineraires-philippines`. Les pages destinations existent (Palawan, Cebu, Siargao) mais via routes statiques, pas programmatiques. Gros levier SEO (20 pages potentielles) |
| 6.3 | Calendrier contenu 90j | [v] | [-] | Planning editorial 12 semaines. Pas de code. Necessite outil externe (Notion, Buffer) |
| 6.4 | TikTok creation | [v] | [-] | Setup compte TikTok Business. Pas de TikTok Pixel dans le code (pas necessaire au lancement). 10 scripts video fournis |
| 6.5 | YouTube creation | [v] | [-] | Setup chaine YouTube. Pas de code. 3 scripts video detailles (13000+ mots). Plan 12 videos premiere annee |
| 6.6 | Email marketing sequences | [v] | [~] | **Fait:** Resend integre (`src/emails/send.ts`), 12 senders (welcome, itinerary, payment, newsletter, contact, dating, forum, marketplace, article-notify, lifecycle), templates HTML responsives, preferences email (`/api/email/preferences/`), unsubscribe, rate limiting (30 min), webhooks Resend, crons (anniversary, feedback-request, expiration-reminders, call-reminders), ExitIntentPopup avec lead magnet. **Manque:** table `email_sequences` (etat des sequences par user), welcome sequence incomplete (W1 ok, W2-W5 manquants), post-achat sequence incomplete (PA1 ok, PA2-PA5 manquants), reengagement sequence (3 emails) absente, lead magnets PDF non crees, A/B testing subject lines |
| 6.7 | Pinterest trafic | [v] | [-] | Setup compte Pinterest Business. OG tags presents (Rich Pins possibles). **Manque:** meta tag `p:domain_verify` dans layout.tsx (1 ligne de code). Pas de compte cree |

### Actions Bloc 6
- [ ] **6.1a** Remplacer 5+ balises `<img>` par `next/image` (admin, dating)
- [ ] **6.1b** Audit PageSpeed sur 5 pages cles
- [ ] **6.2a** Creer table `destination_itineraries` dans Supabase
- [ ] **6.2b** Creer composant template + page dynamique `/itineraire-[slug]`
- [ ] **6.2c** Peupler 5 premieres destinations (Palawan, Cebu, Siargao, Boracay, Bohol)
- [ ] **6.6a** Creer table `email_sequences` dans Supabase
- [ ] **6.6b** Completer welcome sequence (W2-W5)
- [ ] **6.6c** Completer post-achat sequence (PA2-PA5)
- [ ] **6.6d** Creer sequence reengagement (RE1-RE3)
- [ ] **6.7a** Ajouter meta tag `p:domain_verify` dans layout.tsx

---

## BLOC 7 — MONETISATION B2B
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 7.1 | Offre referencement hotels/tours | [v] | [ ] | Admin marketplace existe (`/admin/marketplace`) mais aucune offre B2B structuree (tiers 49/149/499 EUR). Pas de formulaire partenaire. Pas de page publique de vente |
| 7.2 | Package visibilite expats | [v] | [~] | Marketplace existe (`/marketplace-aux-philippines`), vendeur peut postuler (`devenir-vendeur/`), admin vendeurs (`/admin/vendors/`). **Manque:** tiers Starter/Business (99/249 EUR), badge "Recommande par Philippineasy", integration article, rotation bandeau pub, dashboard analytics vendeur |
| 7.3 | Leads immobilier | [v] | [ ] | ZERO implemente. Pas de page `/immobilier-philippines`. Pas de formulaire multi-etapes. Pas de table `real_estate_leads`. Pas de workflow n8n distribution leads |
| 7.4 | Formation expatriation | [v] | [ ] | ZERO implemente. Necessite plateforme externe (Teachable/Podia). 3 tiers (197/497/997 EUR). 8 modules, 25+ videos. Pas de page `/formation-expatriation` |
| 7.5 | Cold email prospection | [v] | [-] | Scripts/templates email. Pas de code dans le site. Necessite outil externe (Lemlist/Woodpecker) |
| 7.6 | Page /marketing | [v] | [ ] | **PAGE INEXISTANTE — hub central du bloc 7.** Pas de route `/marketing`. Pas de formulaire B2B. Pas de table `b2b_leads`. Pas de workflow notification. Debloque 7.1-7.5 |
| 7.7 | LinkedIn prospection B2B | [v] | [-] | Strategie de contenu LinkedIn. Pas de code |

### Actions Bloc 7
- [ ] **7.6a** Creer page `/marketing` avec offres B2B + formulaire contact
- [ ] **7.6b** Creer table `b2b_leads` dans Supabase
- [ ] **7.2a** Ajouter tiers premium au systeme marketplace existant

---

## BLOC 8 — SECTION RENCONTRE (Croissance)
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 8.1 | Acquisition profils femmes | [v] | [~] | Admin dating existe (`/admin/dating`). Section rencontre fonctionnelle. **Manque:** aucune campagne ads configuree, pas de systeme referral ambassadrices, pas de calendrier contenu social dating |
| 8.2 | Angle pub exclusivite beta | [v] | [ ] | ZERO messaging beta/exclusivite sur `/rencontre-philippines`. Pas de compteur "200 profils selectionnes". Pas de timer/badge exclusivite. Pas de tableau comparatif vs FilipinoCupid |
| 8.3 | Compliance pub rencontre | [v] | [~] | Page `/confidentialite` existe. **Manque:** CGU specifiques dating (18+, pas de garanties, moderation), certification dating Google Ads, certification Meta, gate verification age |
| 8.4 | Programme ambassadrices | [v] | [ ] | ZERO implemente. Pas de systeme referral_code. Pas de dashboard ambassadrices. Pas de tiers Bronze/Argent/Or/Platine. Pas de tracking recompenses |
| 8.5 | Onboarding hommes premium | [v] | [~] | Systeme de paiement dating existe. **Manque:** messaging freemium (limite 2 msg/jour affichee), triggers paywall ("quelqu'un vous a like"), sequence 5 emails onboarding (J+0 a J+7), code promo -20% premiere semaine, trial premium 24h |

### Actions Bloc 8
- [ ] **8.2a** Redesign messaging `/rencontre-philippines` avec angle exclusivite
- [ ] **8.3a** Ajouter CGU dating (18+, moderation, pas de garanties)
- [ ] **8.4a** Creer systeme ambassadrices (table, codes, dashboard)
- [ ] **8.5a** Implementer triggers paywall + sequence emails onboarding

---

## BLOC 9 — QUICK WINS TECHNIQUES (Site)
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 9.1 | Urgence/FOMO CTAs | [v] | [ ] | Guide fournit code React complet (CountdownTimer, LimitedAvailability). **ZERO dans le codebase.** ExitIntentPopup existe (urgence "Attendez!") mais pas de countdown, pas de "X personnes regardent", pas de "Plus que X places" |
| 9.2 | Itineraire gratuit 3j | [v] | [ ] | **ZERO implemente.** Lead magnets PDF existent dans `/public/lead-magnets/` (palawan-7-jours.pdf, budget-3-semaines.pdf, checklist-visa-srrv.pdf) mais pas de page `/itineraire-gratuit` avec questionnaire 3 questions + email gate + generation IA + sequence 3 emails upsell |
| 9.3 | Programme referral | [v] | [ ] | **ZERO implemente.** Guide fournit schema SQL + code React. Pas de table `referrals` Supabase. Pas de generation codes. Pas de coupons Stripe automatiques. Pas de dashboard `/mon-espace/parrainage`. Pas de paliers |
| 9.4 | Badges confiance | [v] | [ ] | Guide fournit composants TrustBadge, TrustBadgeBar, StripeBadge. **ZERO dans le codebase.** Pas de "+10000 voyageurs" counter. Pas de "98% satisfaction" badge. Pas de Stripe secure badge checkout. Pas de "Satisfait ou rembourse 14j" |
| 9.5 | Goal-Gradient progression | [v] | [ ] | Guide fournit StepProgressBar + ProgressMessage. **ZERO dans le codebase.** PackProgressCard CRM existe mais different (usage services post-achat, pas pre-achat). Pas de barre progression questionnaire itineraire ni checkout |
| 9.6 | Endowment Effect | [v] | [~] | `ProposalCards.tsx` montre 3 variantes d'itineraire (Relax, Equilibre, Aventure) avec jours teaser AVANT paiement = endowment effect deja applique. **Manque:** affichage "Jour 1 complet" avec Jours 2-14 floutes, mecanisme unlock apres paiement |

### Actions Bloc 9
- [ ] **9.4a** Integrer TrustBadge sur homepage, pricing, checkout (composants du guide)
- [ ] **9.1a** Integrer CountdownTimer/FOMO sur pricing itineraire
- [ ] **9.5a** Ajouter StepProgressBar au questionnaire itineraire + checkout
- [ ] **9.2a** Creer page `/itineraire-gratuit` (lead magnet, 3 questions, email gate)
- [ ] **9.3a** Implementer programme referral (table, codes, Stripe coupons, dashboard)

---

## BLOC 10 — SUIVI & REPORTING
| # | Tache | G | I | Detail |
|---|-------|---|---|--------|
| 10.1 | Dashboard Looker Studio | [v] | [ ] | ZERO dashboard externe. Admin interne existe: `/admin/analytics` (top articles), `/admin/revenue` (revenus par service), `/admin/customers`, `/admin/dating`. **Manque:** Looker Studio connecte a GA4 + Stripe + Supabase, workflows n8n export vers Google Sheets, envoi automatique hebdomadaire |
| 10.2 | Rapport mensuel template | [v] | [-] | Template Google Docs. Pas de code |
| 10.3 | KPIs Philippineasy | [v] | [ ] | Admin dashboards partiels (analytics, revenue). **Manque:** dashboard unifie avec seuils vert/jaune/rouge, alertes automatiques quand KPI depasse seuil, tracking objectifs vs realise |
| 10.4 | Routine optimisation | [v] | [-] | Checklist process mensuel. Pas de code |

### Actions Bloc 10
- [ ] **10.1a** Configurer Looker Studio avec sources GA4 + Search Console
- [ ] **10.1b** Creer workflows n8n Stripe -> Google Sheets + Supabase -> Google Sheets
- [ ] **10.3a** Enrichir admin dashboard avec KPIs et seuils d'alerte

---

## STATISTIQUES GLOBALES

### Par statut d'implementation
| Statut | Nombre | % | Guides |
|--------|--------|---|--------|
| Implemente [x] | 5 | 6% | 1.1, 1.2, 1.4, 1.7, 6.6 |
| Partiel [~] | 10 | 13% | 1.6, 3.3, 3.9, 4.2, 4.8, 4.9, 6.1, 7.2, 8.1, 8.3, 8.5, 9.6 |
| A faire [ ] | 21 | 27% | 1.3, 2.1-2.7, 3.1, 3.7, 4.1, 6.2, 7.1, 7.3, 7.4, 7.6, 8.2, 8.4, 9.1-9.5, 10.1, 10.3 |
| Bloque [>] | 5 | 6% | 3.8, 4.4, 4.5, 4.6, 4.11 |
| Pas de code [-] | 36 | 47% | Bloc 5 (9), 1.5, + guides strategie/creatif/UI config |

### Par priorite d'implementation
| Priorite | Actions | Impact |
|----------|---------|--------|
| ~~**P0 — Tracking**~~ | ~~1.1a, 1.2a, 1.2b, 1.4a, 1.4b, 1.7a, 1.7b~~ | **COMPLETE** |
| **P1 — Monetisation passive** | 2.7a, 2.x (liens affiliation) | Revenus 0 EUR investi |
| **P2 — Pub** | 3.1a, 3.7a, 4.1a, 4.1b | Lance les campagnes payantes |
| **P3 — Quick wins** | 9.4a, 9.1a, 9.5a | Ameliore conversion existante |
| **P4 — Growth** | 6.2a-c, 9.2a, 7.6a | SEO + leads + B2B |
| **P5 — Scale** | 6.6a-d, 8.4a, 9.3a, 10.1a | Automation + viral + reporting |

---

## SESSIONS LOG
| Session | Date | Taches completees |
|---------|------|-------------------|
| 1-4 | 2026-04-16 | 77 guides rediges (tous blocs), 8 assets, 3 fichiers prompts IA |
| 5 | 2026-04-16 | MCP GA4+GSC installes. SA Editeur GA4. Audit 77 guides. TODO restructure |
| 6 | 2026-04-16 | **P0 COMPLETE** : consent mode RGPD, analytics.ts (12 fn), meta-pixel.ts (9 fn), tracking dans 6 pages, Meta Pixel ID sur Vercel, APIs Cloud activees, GSC confirme OK |
| 7 | 2026-04-28 | **P0a FIX VALUE:0** (commit `f62615b`) : 3 pages completion envoyaient `value: 0` aux trackers — impossible ROAS/CPA. Fix complet : nouveaux endpoints `/api/services/verify-session` + `/api/orders/verify-payment`, `/api/itinerary/confirm-payment` retourne `amount`, sanitize Meta Pixel ID (resilient adblockers/env pollue), test e2e valide en devtools `value: 9.99 currency: EUR`. **Confirme aussi** : Klook live (`aid=118789`), 5 autres programmes affiliation en attente d'inscription mais URLs deja placees |
| 8 | 2026-04-28 | **BLOC 3.7 prep code** : `GoogleAdsTag.tsx` cree (defensif, sanitize ID format `AW-XXX`, dangerouslySetInnerHTML), integre dans `layout.tsx` a cote de GoogleAnalytics et MetaPixel. Helper `trackGoogleAdsConversion()` ajoute dans `analytics.ts` (optionnel, pour conversion specifique cote client). **Reste actions manuelles Hugo** : creer compte Google Ads, recuperer ID AW-XXX, ajouter NEXT_PUBLIC_GOOGLE_ADS_ID dans Vercel, lier GA4<->Ads, importer conversions, configurer 4 campagnes via UI |
