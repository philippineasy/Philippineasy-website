-- Seed Boracay : itineraire 5 jours, sable blanc emblematique + version backpacker possible
-- Couverture SEO : "boracay", "que faire boracay", "boracay philippines"
-- Volume estime FR : 200-600/mois
-- A passer published = true apres relecture Hugo

INSERT INTO destination_itineraries (
  slug, name, hero_image, hero_image_alt,
  meta_title, meta_description,
  intro_text,
  recommended_days, best_season, how_to_get_there,
  budget_backpacker, budget_midrange, budget_luxury,
  itinerary, faq, related_destinations, practical_tips,
  category, published
) VALUES (
  'boracay',
  'Boracay',
  '/imagesHero/boracay-white-beach.webp',
  'White Beach à Boracay, sable blanc et eau turquoise des Philippines',
  'Itinéraire Boracay : Guide 5 Jours (2026) — Philippineasy',
  'Itinéraire Boracay 5 jours : White Beach, parasailing, paraw, plongée. Version backpacker Station 3. Guide francophone honnête 2026.',
  'Soyons honnêtes dès le début : Boracay n''est pas une destination backpacker pure. C''est l''île la plus commerciale des Philippines, 4 km de plage de sable blanc absolument cinématographique (souvent classée parmi les 10 plus belles du monde), mais avec hôtels-resorts, restaurants chaînes, et un flux touristique massif venant de Corée, Chine et Manille. Si tu cherches une île ''secrète'', va à Bantayan ou Siquijor. Si tu cherches LA carte postale Philippines + soirées + activités nautiques + facilité totale d''organisation, c''est Boracay.

Petit rappel historique : en 2018, Duterte a fermé l''île 6 mois pour la nettoyer. Eaux usées qui partaient direct dans la mer, sur-construction anarchique, déchets partout. Après la fermeture, nouvelles règles : restaurants reculés de la plage, fumée et alcool interdits sur le sable, structures illégales démolies. Le résultat : la plage est redevenue propre, l''eau cristalline. Mais le côté commercial reste — ce n''est pas Siargao en mode chill.

La bonne nouvelle pour les backpackers : tu peux faire Boracay en mode budget si tu loges à Station 3 (l''extrémité sud, moins chère, plus locale). Hostels à 600-900 PHP, repas à 200 PHP au mercado, et tu profites de la même plage de sable blanc que les hôtels à 300€/nuit. La plage est publique, l''eau est la même.

Cet itinéraire 5 jours te donne le mélange : White Beach iconique, parasailing et paraw au coucher de soleil, plongée correcte aux Crocodile Island, helmet diving si tu veux du WTF, plus une journée à Puka Beach (au nord, sauvage, vide) pour échapper à la foule. On a accompagné plus de 10 000 voyageurs depuis 2020 et Boracay reste une destination citée par 70% des premiers voyages. Tu restes libre de réserver vols et hébergements où tu veux.',
  5,
  'Novembre à Mai (saison sèche, mer calme côté Habagat). Évitez juin-octobre (pluies, kitesurf saison opposée mais White Beach moins belle)',
  'Vol Manille → Caticlan (1h, le plus pratique) ou Manille → Kalibo (1h15, moins cher mais 2h de bus en plus jusqu''au port). Caticlan est à 5 min en tricycle du jetty port pour le ferry Boracay (15 min, 350 PHP frais inclus). Aussi vols depuis Cebu, Clark, Davao',
  35,
  90,
  300,
  '[
    {
      "day": 1,
      "title": "Arrivée Caticlan + traversée + installation",
      "activities": [
        {
          "name": "Vol + ferry vers Boracay",
          "description": "Atterrissage Caticlan (CRK ou MPH selon la compagnie). Compte 5 min en tricycle jusqu''au Caticlan Jetty Port (50 PHP). Là, tu paies un combo aux 3 guichets séparés : terminal fee 150 PHP + environmental fee 300 PHP (touriste étranger, 150 PHP pour locaux) + ferry pump boat 50-100 PHP = ~500 PHP au total pour un foreigner. Cash uniquement, pas de carte. Ferry 15 min jusqu''à Cagban Jetty sur Boracay. De Cagban, e-trike (le tricycle électrique imposé sur l''île) jusqu''à ton hostel — 100-200 PHP selon la station. Total porte à porte depuis Caticlan : 1h.",
          "duration": "1h",
          "cost": "500-650 PHP"
        },
        {
          "name": "Choix de Station — où loger",
          "description": "Boracay est divisée en 3 ''Stations'' le long de White Beach. Station 1 = nord, hôtels 4-5*, prix 200€+/nuit, plage la plus large et belle. Station 2 = centre, D''Mall, vie nocturne, prix moyens. Station 3 = sud, plus calme, plus local, hostels backpacker (600-1200 PHP), restaus locaux pas chers. Pour budget : Station 3 sans hésiter. Tu marches 15 min jusqu''à D''Mall.",
          "duration": "1h installation",
          "cost": "Inclus"
        },
        {
          "name": "Premier coucher de soleil + dîner D''Talipapa",
          "description": "Première règle : tous les voyageurs convergent sur la plage à 17h-18h pour le coucher de soleil. C''est mythique, vraiment. Trouve une place sur le sable, achète un cocktail au bar le plus proche (300-400 PHP) ou viens en mode local avec une bière San Mig achetée en sari-sari (90 PHP). Dîner à D''Talipapa, le marché aux poissons couvert : tu choisis ton poisson au stand, ils te le cuisinent au restau juste derrière (paye le poisson au poids + ~150 PHP préparation). Compte 600-800 PHP/personne. Authentique et pas cher pour Boracay.",
          "duration": "3-4h",
          "cost": "500-1000 PHP"
        }
      ],
      "transport": "Vol + ferry + e-trike",
      "accommodation": "Frendz Resort & Hostel (Station 1, dortoir 800 PHP, ambiance backpacker iconique) ou Boracay Backpackers (Station 3, 700 PHP, plus calme et local). Note : Mad Monkey Boracay a fermé en 2022, il existe d''autres dortoirs Station 2 type MNL Beach Hostel ou Stoke Travel.",
      "meals": "Snack en transit, dîner D''Talipapa"
    },
    {
      "day": 2,
      "title": "White Beach + paraw au coucher de soleil",
      "activities": [
        {
          "name": "Matinée plage + baignade White Beach",
          "description": "Profite de White Beach. Vraiment. C''est 4 km de sable blanc fin comme de la farine — pas une métaphore, c''est littéralement comme marcher dans du talc. Mer turquoise progressive, profondeur douce, parfait pour nager. Stations 1 et 2 sont les plus belles (sable plus fin, sans algues). Apporte ton matos snorkel (location 200 PHP). Pas d''ombre sur le sable — chapeau et crème reef-safe obligatoires. Évite midi-14h (cuisson complète).",
          "duration": "3-4h",
          "cost": "Gratuit"
        },
        {
          "name": "Massage à la plage 1h",
          "description": "Boracay c''est aussi LA destination pour les massages plage. Des dizaines de masseuses installent leurs nattes sur le sable, 350-600 PHP/h pour un massage philippin ou shiatsu. Le rapport qualité/prix défie toute concurrence. Mes préférés : Mandala Spa (premium, 1500 PHP/h, eucalyptus et bougies — vaut le coup une fois) ou les nattes plage anonymes pour le mode 350 PHP cash.",
          "duration": "1h",
          "cost": "400-1500 PHP"
        },
        {
          "name": "Paraw sailing au coucher du soleil",
          "description": "L''expérience iconique de Boracay. Tu embarques sur un paraw — un voilier traditionnel philippin double-coque avec voile orange — pour 1h30 sur l''eau pendant que le soleil tombe. Tu glisses silencieusement, tu vois White Beach depuis la mer (vue dingue), tu peux sauter à l''eau pour nager. Tarif : 600-1000 PHP/personne en groupe (négocie sur la plage), 3000-4000 PHP pour privatiser un bateau. Apporte petite étanche pour ton phone. Réserve la veille ou le matin même via ton hostel.",
          "duration": "1h30 + préparation",
          "cost": "800 PHP/personne"
        },
        {
          "name": "Vie nocturne D''Mall + Station 2",
          "description": "Soir : si tu cherches la fête, Station 2 est ton quartier. Epic Boracay (cocktails 350 PHP, DJ), Mañana Mexican (margaritas + ambiance latino), Coco Bar (sand bar). Si tu veux tranquille : dîner sur la plage à un resto avec menu poisson grillé, 800-1200 PHP/personne. Si tu veux vraiment local : Andok''s lechon manok (poulet rôti 250 PHP) + bière à l''hostel.",
          "duration": "Soirée",
          "cost": "500-1500 PHP"
        }
      ],
      "transport": "À pied le long de White Beach",
      "accommodation": "Hostel (2e nuit)",
      "meals": "Petit-déj hostel, déjeuner Pancake House ou turo-turo (cantine philippine, 200 PHP), dîner selon humeur"
    },
    {
      "day": 3,
      "title": "Activités nautiques + Crystal Cove",
      "activities": [
        {
          "name": "Choix activité nautique : parasailing OU helmet diving OU jet ski",
          "description": "Boracay est LA capitale des activités nautiques aux Philippines. Trois options populaires : parasailing en duo (1500-2000 PHP/personne, 15 min en l''air, vue dingue sur White Beach) ; helmet diving / sea walking (1800 PHP, tu marches au fond avec un casque rempli d''air, expérience WTF mais bof éthiquement, on touche les coraux) ; jet ski 30 min (2500-3500 PHP). Notre recommandation : parasailing pour la vue, skipper le helmet diving (impact corail + stress poissons).",
          "duration": "Demi-journée selon choix",
          "cost": "1500-3000 PHP"
        },
        {
          "name": "Crystal Cove Island (sympa, pas obligatoire)",
          "description": "Petite île privée à 15 min en bateau de Boracay, 200 PHP entrée. Deux grottes, plage de sable blanc, water buoy, photos. Touristique mais pas mal pour 2-3h. Souvent inclus dans les tours ''island hopping Boracay'' (1500-2000 PHP la journée groupé : Crystal Cove + Crocodile Island snorkeling + Magic Island sauts).",
          "duration": "2-3h",
          "cost": "200 PHP entrée"
        },
        {
          "name": "Île Hopping classique : Crocodile Island + Magic Island",
          "description": "Si tu veux la journée combo : tour bateau à 1500-2000 PHP qui inclut Crystal Cove + snorkeling Crocodile Island (récif corallien, beaucoup de poissons) + Magic Island (saut de falaise 5-8m dans la mer). Départ 9h, retour 14h, déjeuner inclus. Plus complet qu''une seule activité. Réserve via ton hostel ou directement sur la plage (ne paye pas tout d''avance).",
          "duration": "Journée complète",
          "cost": "1500-2000 PHP"
        }
      ],
      "transport": "Bateau",
      "accommodation": "Hostel (3e nuit)",
      "meals": "Petit-déj hostel, déjeuner inclus tour, dîner D''Talipapa ou Smoke Resto (filipino classique 400 PHP)"
    },
    {
      "day": 4,
      "title": "Puka Beach (échapper à la foule) + plongée option",
      "activities": [
        {
          "name": "Puka Shell Beach au nord",
          "description": "Puka Beach est l''opposé de White Beach : 1 km au nord, plage sauvage de sable doré et pas blanc, parsemée de coquillages puka, beaucoup moins fréquentée, presque pas de bars/restos. Atmosphère ''avant le développement de Boracay''. Tu y vas en e-trike depuis ta station (200-300 PHP négocié, 30 min de route). Apporte de l''eau et des snacks (peu d''options sur place). Restos de poisson grillé local en bord de plage (400 PHP). Idéal pour journée détente loin du chaos White Beach.",
          "duration": "Demi-journée",
          "cost": "300 PHP transport + 500 PHP repas"
        },
        {
          "name": "ALTERNATIVE : Plongée Yapak Wall (avancé) ou découverte (open water)",
          "description": "Boracay a une plongée correcte (pas comparable à Coron ou Malapascua) : Yapak Wall (mur 30-40m, raies mantas en saison), Crocodile Island (récifs colorés, pour découverte), Friday''s Rock (épave). Compte 2500-3500 PHP les 2 plongées matin (Calypso Diving, Lapu-Lapu Diving sont les références). Open Water si tu n''as pas la certif : 22000-26000 PHP les 4 jours.",
          "duration": "Matinée 6h-12h",
          "cost": "2500-3500 PHP"
        },
        {
          "name": "Bulabog Beach (kitesurf si saison)",
          "description": "Bulabog Beach est sur l''autre côté de l''île (5 min à pied depuis White Beach Station 2). Pendant la saison Habagat (juin-octobre), c''est la capitale du kitesurf des Philippines : vents constants, eau peu profonde, idéal pour apprendre. Cours débutant 4500-6000 PHP les 3h. Hors saison (novembre-mai), c''est plus calme, plus stable. Si tu n''es pas kitesurfer, va voir le spectacle des kites depuis la plage : impressionnant.",
          "duration": "Demi-journée",
          "cost": "Variable"
        }
      ],
      "transport": "E-trike + bateau si plongée",
      "accommodation": "Hostel (4e nuit)",
      "meals": "Petit-déj café Patio Pacific, déjeuner Puka Beach (poisson grillé), dîner Cyma Greek Taverna (excellent, 800 PHP)"
    },
    {
      "day": 5,
      "title": "Dernière matinée + retour",
      "activities": [
        {
          "name": "Brunch + souvenirs",
          "description": "Selon ton heure de vol, profite d''une dernière matinée plage. Petit-déj smoothie bowl Real Coffee & Tea Café (Station 1, mangue+banane 280 PHP). Souvenirs : Talipapa Market (pareos, t-shirts, poteries Aklan), évite les magasins ''souvenirs'' alignés au D''Mall qui vendent du made in China sur-marqué.",
          "duration": "2-3h",
          "cost": "500-800 PHP"
        },
        {
          "name": "Retour vers Caticlan",
          "description": "Réserve ton transfert via l''hostel : e-trike vers Cagban Jetty (200 PHP) + ferry (50 PHP) + tricycle aéroport (50 PHP). OU package combo aéroport (500 PHP tout inclus, plus simple). Compte 1h porte à porte. Arrive 1h30 avant ton vol — Caticlan est petit mais peut être chaotique en haute saison.",
          "duration": "1h",
          "cost": "300-500 PHP"
        }
      ],
      "transport": "E-trike + ferry + tricycle",
      "accommodation": "Vol retour ou prochaine destination",
      "meals": "Brunch matinal, snacks aéroport"
    }
  ]'::jsonb,
  '[
    {
      "question": "Combien de jours faut-il pour Boracay ?",
      "answer": "4 à 5 jours est l''idéal. 3 jours = juste profiter de White Beach et faire 2-3 activités. 5 jours = full expérience avec une journée à Puka Beach et de la plongée. Au-delà de 6 jours, tu as fait le tour — Boracay est petite et concentrée, ce n''est pas une île à explorer comme Cebu ou Siargao."
    },
    {
      "question": "Boracay vaut-elle vraiment le coup ?",
      "answer": "Pour la plage : oui, sans débat, c''est l''une des plus belles plages du monde. Pour la vibe : ça dépend. Si tu cherches local-authentique-tranquille, NON, va à Bantayan/Siquijor/Pacifico (Siargao). Si tu veux la plage iconique + activités + facilité d''organisation, OUI. Beaucoup la combinent avec Palawan ou Cebu pour avoir le mix iconique + moins commercial."
    },
    {
      "question": "Peut-on faire Boracay en mode backpacker ?",
      "answer": "Oui, à condition de loger à Station 3 (sud, hostels 600-1200 PHP), manger turo-turo et D''Talipapa (250-400 PHP/repas), boire en sari-sari (90 PHP la San Mig grande). Compte 35-50€/jour. La plage et l''eau sont les mêmes pour tout le monde. Évite les bars de plage standards à 350 PHP la bière, et les hôtels Station 1 à 8000 PHP/nuit."
    },
    {
      "question": "Quelle est la meilleure saison pour Boracay ?",
      "answer": "Novembre à mai (saison sèche Amihan). Mer calme côté White Beach, pluie rare. Décembre-février = haute saison (prix x2, foule). Mars-mai = chaud mais belle météo. Juin-octobre = saison Habagat, pluies fréquentes, mer agitée côté White Beach (mais bonne saison kitesurf à Bulabog côté est)."
    },
    {
      "question": "Quels scams éviter à Boracay ?",
      "answer": "Trois grandes arnaques : 1) ''Henna tattoo'' à la plage qui s''avèrent être de l''encre cancérigène à base de PPD (refuse, prends seulement henné brun naturel) ; 2) Tour bateaux qui demandent paiement complet à l''avance puis ne se présentent pas (paye à l''embarquement ou via ton hostel) ; 3) Massages ''VIP'' à 1500 PHP qui sont les mêmes que les 400 PHP plus loin. Compare avant de payer."
    },
    {
      "question": "Faut-il réserver les hôtels à l''avance ?",
      "answer": "Décembre-mars : OUI absolument, les bonnes adresses se vendent 2-3 mois avant et les prix peuvent doubler. Avril-mai et novembre : 2 semaines d''avance suffisent. Juin-octobre (basse saison) : plus de flexibilité, walk-in possible avec négociation. Booking, Agoda et Hostelworld ont les meilleurs deals."
    },
    {
      "question": "Combien coûte un cocktail à Boracay ?",
      "answer": "Plage Stations 1-2 : 250-450 PHP le cocktail standard, 600+ PHP les ''signature''. Bars locaux Station 3 : 150-250 PHP. Sari-sari (épicerie locale) : bière San Mig grande 90 PHP, rhum Tanduay 80 PHP la pinte. Le hack budget : achète en sari-sari, bois sur la plage en mode local."
    },
    {
      "question": "Peut-on louer un scooter à Boracay ?",
      "answer": "Limité. L''île impose les e-trikes (tricycles électriques) pour réduire la pollution. Quelques locations de scooter existent mais routes encombrées et police vigilante (amende 1500 PHP sans permis). E-trike privatisé : 150-300 PHP la course, suffit largement pour les distances courtes."
    },
    {
      "question": "Le wifi est-il correct à Boracay ?",
      "answer": "Hôtels et hostels : généralement bon (10-30 Mbps). Cafés Stations 1-2 : très bon. Sur la plage : variable. SIM Globe ou Smart 50GB pour 30 jours ~700 PHP, achète à l''aéroport (Manille ou Caticlan). Couverture 4G excellente partout sur l''île."
    },
    {
      "question": "Faut-il un visa pour les Philippines ?",
      "answer": "Non pour les Français/Belges/Suisses/Canadiens jusqu''à 30 jours (tampon gratuit à l''arrivée). Extension possible jusqu''à 59 jours puis 6 mois total via le Bureau of Immigration. Passeport valide 6 mois minimum. Billet retour ou continuation demandé à l''embarquement."
    },
    {
      "question": "Boracay est-elle vraiment ''propre'' depuis la fermeture de 2018 ?",
      "answer": "Oui, l''eau de White Beach est cristalline et les analyses bactériologiques officielles sont passées de zone D à zone B (acceptable baignade). Restaurants reculés du sable (15m), fumée et alcool interdits sur le sable, structures illégales démolies. Reste : sur-fréquentation en haute saison (le problème reste la quantité de visiteurs)."
    },
    {
      "question": "Combien coûte un vol Manille-Caticlan ?",
      "answer": "Cebu Pacific et Philippine Airlines : 2000-5000 PHP A/R (35-90€) si réservé 4-6 semaines à l''avance. Last minute monte à 7000-10000 PHP. Caticlan (MPH) plus pratique que Kalibo (KLO, 2h de bus). Vols quotidiens nombreux."
    }
  ]'::jsonb,
  ARRAY['palawan', 'cebu', 'siargao', 'philippines-2-semaines'],
  ARRAY[
    'Loge à Station 3 pour le mode backpacker — même plage, prix divisés par 2-3',
    'Vol direct Manille → Caticlan (MPH) plus pratique que Kalibo (KLO, 2h de bus en plus)',
    'Frais combinés ferry Caticlan-Boracay : ~500 PHP par touriste étranger (terminal 150 + environmental 300 + ferry 50). Cash uniquement, pas de carte. Le combo "package" via certains hostels peut tout inclure pour 950-1050 PHP avec transport au sol',
    'Tatouages au henné : refuse le ''black henna'' (PPD cancérigène), accepte seulement le brun naturel',
    'Cocktails plage 350 PHP, en sari-sari San Mig 90 PHP — choisis ton mode',
    'Crème solaire reef-safe obligatoire — les autres détruisent les coraux et l''île a serré le contrôle',
    'Parasailing > helmet diving (le helmet diving impacte les coraux et stresse les poissons)',
    'Massages plage 350-500 PHP/h — les vrais bons rapports qualité/prix',
    'Évite décembre-février si tu cherches calme — prix x2 et foule maximale',
    'Saison kitesurf Bulabog : juin-octobre. Saison surf White Beach : nov-mai',
    'Restos plage avec menu en photo et prix gonflés : skippe, va à D''Talipapa',
    'GCash fonctionne dans 90% des restos et magasins. Active-le à l''arrivée Manille',
    'E-trike privatisé : négocie le prix avant de monter (150-300 PHP normal)',
    'Eau du robinet imbuvable comme partout aux Philippines. Bouteilles 5L 50 PHP en sari-sari',
    'Puka Beach pour échapper à la foule — sable doré sauvage, presque vide en semaine'
  ],
  'destination',
  false
)
ON CONFLICT (slug) DO NOTHING;
