-- Seed Philippines 2 semaines : itineraire MULTI-iles 14 jours, le gros morceau SEO
-- Couverture SEO : "philippines 2 semaines", "itineraire philippines 14 jours", "voyage philippines 2 semaines"
-- Volume estime FR : 2000-5000/mois (LE plus gros volume du site sur cette thematique)
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
  'philippines-2-semaines',
  'Philippines 2 semaines',
  '/imagesHero/philippines-itineraire-multi-iles.webp',
  'Itinéraire Philippines 2 semaines : Cebu, Bohol, Palawan, Siargao multi-îles',
  'Philippines 2 Semaines : Itinéraire 14 Jours (2026)',
  'Itinéraire Philippines 14 jours : Manille, Cebu, Bohol, El Nido, Coron, Siargao. Vols, ferrys, hostels, budget. Guide francophone backpacker 2026.',
  '2 semaines aux Philippines, c''est la durée la plus demandée — et aussi la plus piégeuse à organiser. Le pays compte 7641 îles, 3 zones géographiques majeures (Luzon nord, Visayas centre, Mindanao sud + Palawan ouest), et chaque île a son caractère propre. Vouloir tout voir en 14 jours = courir, prendre 8 vols domestiques, dormir une nuit par destination et passer ses journées en transit. C''est l''erreur classique. À l''opposé, ne faire qu''une seule île c''est passer à côté de la diversité incroyable du pays.

Cet itinéraire 14 jours est le résultat de 6 ans d''accompagnement de plus de 10 000 voyageurs depuis 2020. Il combine 5 destinations choisies pour leur complémentarité : Manille (arrivée + culture), Cebu/Moalboal (sardines + cascades + plongée), Bohol (Chocolate Hills, tarsiers, Panglao plages), Palawan El Nido + Coron (LE must visuel des Philippines), et Siargao (surf + chill + food). On a écarté Boracay volontairement (trop commercial pour 2 semaines, ajoute peu vs Palawan), et on a ramassé Bohol parce qu''il est juste à 2h de Cebu et offre une diversité de paysages unique.

Honnêtement, c''est ambitieux. Tu vas prendre 5 vols domestiques, faire 3 ferrys, négocier des tricycles, gérer des matins 4h pour des départs bateau. Si tu veux plus tranquille, scinde en 2 voyages OU fais 2 destinations seulement (Palawan + Siargao = combo parfait à 14 jours). Mais si tu veux LE goût des Philippines en mode best-of, voici le road book qui marche.

Tu restes libre de réserver tes vols et hébergements où tu veux — on te donne les noms qu''on connaît, les prix qu''on a vérifiés, les horaires qu''on a faits soi-même. Le reste, c''est ton voyage.',
  14,
  'Janvier à Avril (saison sèche, optimal sur tout le pays). Décembre = haute saison + chaud. Évite juillet-octobre (typhons fréquents, ferrys annulés)',
  'Vol international Paris/Bruxelles/Genève → Manille (NAIA, 14-16h avec une escale à Doha, Dubaï, Singapour ou Bangkok). Compagnies : Qatar Airways, Emirates, Singapore Airlines, Turkish, Cathay. Compte 800-1300€ A/R selon saison. Préfère Manille à Cebu pour l''arrivée internationale (plus de vols)',
  40,
  90,
  250,
  '[
    {
      "day": 1,
      "title": "Arrivée Manille — récupération + Intramuros",
      "activities": [
        {
          "name": "Atterrissage NAIA + transfert hôtel",
          "description": "NAIA (Manila Airport) est célèbre pour ses files d''attente immigration interminables. Compte 1h-1h30 entre l''atterrissage et la sortie. Sors du terminal et IGNORE les ''taxi fixe'' (toujours 2-3x plus cher). Prends un Grab depuis l''app — 350-600 PHP vers Makati ou Bonifacio Global City selon le trafic. SIM card : achète à l''aéroport stand Globe ou Smart, 700 PHP pour 50GB sur 30 jours, indispensable pour Grab et GCash.",
          "duration": "2-3h porte à porte",
          "cost": "500-800 PHP transport + 700 PHP SIM"
        },
        {
          "name": "Intramuros — vieille ville espagnole",
          "description": "Si tu arrives le matin, file à Intramuros, le quartier fortifié espagnol du XVIe siècle. Fort Santiago (entrée 75 PHP, mémorial Rizal), Cathédrale de Manille, San Agustin Church (UNESCO, 200 PHP). Loue un kalesa (calèche, 800-1000 PHP/h, négocie ferme) ou bambou-bike pour parcourir les remparts. Compte 3-4h pour bien voir. Évite midi (chaleur écrasante), va plutôt tôt le matin ou en fin de journée.",
          "duration": "Demi-journée",
          "cost": "400-1000 PHP entrées + transport"
        },
        {
          "name": "Dîner cuisine philippine moderne",
          "description": "Premier dîner = découverte cuisine philippine. Adresses sûres : Manam (chaîne mais excellente, kare-kare 480 PHP, sisig 380 PHP, dans les malls Greenbelt ou SM Aura) ou Toyo Eatery (gastronomique philippin, ~3500 PHP/personne, réservation impérative). Si tu veux populaire et pas cher : Mañam à Greenbelt. Bois calamansi juice (citron vert philippin, 90 PHP). Évite les restos ''international cuisine'' du quartier touristique — tu ne mangeras pas philippin.",
          "duration": "2h",
          "cost": "800-1500 PHP"
        }
      ],
      "transport": "Grab depuis l''aéroport",
      "accommodation": "Z Hostel (BGC, dortoir 1200 PHP, top hostel de Manille) ou Lub d Makati (boutique hostel 1500 PHP) ou pour budget Our Awesome Hostel à Malate (700 PHP)",
      "meals": "Snack vol, dîner Manam ou équivalent"
    },
    {
      "day": 2,
      "title": "Manille — National Museum + vol vers Cebu",
      "activities": [
        {
          "name": "Matinée National Museum Complex (gratuit)",
          "description": "Le National Museum of Anthropology + Natural History + Fine Arts est gratuit et excellent pour comprendre l''histoire et la diversité culturelle des Philippines. Compte 2-3h pour voir les 3 bâtiments (Rizal Park). Chronologie pré-coloniale, période espagnole, américaine, lutte pour l''indépendance, art national (Juan Luna, Fernando Amorsolo). Si tu n''as qu''1h, fais le Museum of Anthropology (le plus parlant pour comprendre le pays). Cherche le ''Boxer Codex'' — manuscrit illustré de 1590, dingue.",
          "duration": "2-3h",
          "cost": "Gratuit"
        },
        {
          "name": "Vol Manille → Cebu",
          "description": "Vol domestique Cebu Pacific ou Philippine Airlines, 1h15. Compte 4000-6000 PHP A/R réservé 4-6 semaines avant, 8000+ last minute. Aéroport NAIA Terminal 3 (Cebu Pac) ou Terminal 2 (PAL). Arrive 2h avant, NAIA est imprévisible. Bagages : 7kg cabine + 15-20kg soute selon le tarif (lis bien tes options à la réservation, Cebu Pac surfacture brutalement les excédents).",
          "duration": "1h15 vol + 4h porte à porte",
          "cost": "2500 PHP one-way moyen"
        },
        {
          "name": "Arrivée Cebu City + dîner lechon",
          "description": "Atterrissage Mactan-Cebu fin d''après-midi. Grab vers ton hostel à Cebu City (250-400 PHP). Dîner OBLIGATOIRE chez House of Lechon ou Rico''s Lechon : Cebu est mondialement réputée pour son cochon de lait grillé (lechon), peau craquante, viande fondante. Plat 350-500 PHP. La spécialité philippine la plus accessible.",
          "duration": "2h",
          "cost": "500 PHP dîner"
        }
      ],
      "transport": "Grab + vol domestique",
      "accommodation": "Mad Monkey Cebu City (dortoir 600 PHP) ou Henry Hotel (1800 PHP)",
      "meals": "Brunch hôtel Manille, snack aéroport, dîner lechon"
    },
    {
      "day": 3,
      "title": "Cebu City → Moalboal — sardine run",
      "activities": [
        {
          "name": "Bus Ceres South Bus Terminal → Moalboal",
          "description": "Lever 6h. Grab vers South Bus Terminal (80-150 PHP). Bus Ceres climatisé toutes les heures vers Bato via Moalboal (~200 PHP, 4h trajet). Demande au chauffeur ''Moalboal junction''. De là, tricycle 50 PHP jusqu''à Panagsama Beach. Apporte snacks, eau, et casque ou sweat — la clim est polaire.",
          "duration": "5h",
          "cost": "300 PHP transport"
        },
        {
          "name": "Sardine run Panagsama (gratuit, depuis la plage)",
          "description": "Le moment magique. À 5 mètres du rivage, un banc de millions de sardines tournoie 24/7. Loue masque/tuba (200 PHP la journée chez n''importe quel dive shop), enfile palmes, jette-toi à l''eau. Tu nages au milieu d''une boule argentée vivante qui forme et déforme. Ne touche pas les sardines, pas de protection solaire chimique. Pic d''activité 7-9h ou 16-18h pour la lumière. Pas de tour à payer, c''est la mer publique.",
          "duration": "1-2h dans l''eau",
          "cost": "200 PHP location masque"
        },
        {
          "name": "Coucher de soleil Three Bears Bar",
          "description": "Three Bears Bar à l''extrémité de Panagsama, perché sur un rocher. San Mig 80 PHP, vue détroit de Tañon, musique reggae. Dîner ensuite au Shaka Café (bowl açaï 350 PHP, healthy) ou Lantaw Floating Restaurant (poisson grillé 400 PHP). Ferme tôt (22h), Moalboal n''est pas fait pour faire la fête.",
          "duration": "3h",
          "cost": "500-700 PHP"
        }
      ],
      "transport": "Bus + tricycle",
      "accommodation": "Chief Mau Backpackers (dortoir 500-700 PHP, piscine, top vibe) ou Moalboal Backpacker Lodge (privée 1500 PHP)",
      "meals": "Petit-déj rapide hôtel, snack bus, dîner Shaka ou Lantaw"
    },
    {
      "day": 4,
      "title": "Canyoneering Kawasan Falls + retour Cebu",
      "activities": [
        {
          "name": "Canyoneering Kawasan",
          "description": "Le must-do absolu. Pickup matinal 7h depuis ton hostel, 1h de route jusqu''au point de départ. Tu fais 3-4h de descente : sauts de cascades (5 à 12m, options selon courage), descentes en rappel, nages dans des bassins turquoise translucides. Casque + gilet fournis. Adrénaline garantie. 1500-1800 PHP tout inclus (transport, équipement, déjeuner). NÉCESSITE de savoir nager. Pas pour vertigineux.",
          "duration": "Matinée 7h-13h",
          "cost": "1500-1800 PHP"
        },
        {
          "name": "Retour Cebu City + nuit avant ferry Bohol",
          "description": "Après-midi : retour Moalboal vers 14h, douche, bus Ceres vers Cebu City (3-4h, 250 PHP). Tu dors une nuit à Cebu City pour catcher le ferry du matin vers Tagbilaran (Bohol). Pikz Hostel ou retour Mad Monkey selon dispo. Dîner rapide à Larsian BBQ (street food, 200-400 PHP) si tu as l''énergie, sinon délivery via Foodpanda à l''hostel.",
          "duration": "4h trajet retour",
          "cost": "300 PHP bus"
        }
      ],
      "transport": "Pickup tour + bus Ceres",
      "accommodation": "Mad Monkey Cebu City (dortoir 600 PHP)",
      "meals": "Petit-déj hostel, déjeuner inclus tour, dîner Larsian ou délivery"
    },
    {
      "day": 5,
      "title": "Cebu → Bohol — Chocolate Hills + tarsiers",
      "activities": [
        {
          "name": "Ferry rapide Cebu → Tagbilaran (Bohol)",
          "description": "Réserve la veille via 12go.asia ou OceanJet directement (oceanjet.net). Départ 6h ou 8h, 2h de traversée, 800-1200 PHP. Ferry climatisé, sièges numérotés. Apporte ton passeport (vérifié à l''embarquement). Arrive 45 min avant le départ au Pier 1 de Cebu Port. À Tagbilaran, prends un trike (200 PHP) ou habal-habal vers ton hôtel à Panglao (la plage), ou direct vers le countryside tour.",
          "duration": "2h ferry + transit",
          "cost": "1000 PHP"
        },
        {
          "name": "Bohol countryside tour",
          "description": "Le tour classique : Loboc River cruise (déjeuner buffet sur bateau-restaurant, 700 PHP), Tarsier Conservation Sanctuary (entrée 120 PHP, voir les plus petits primates du monde — RESPECT total : pas de flash, pas de bruit, pas de toucher), Chocolate Hills viewpoint (1268 collines coniques en cône de chocolat à la saison sèche, 100 PHP), Man-Made Forest (route ombragée mythique). Loue un van privé pour la journée (3000-4500 PHP pour 4-6 personnes) ou rejoins un tour groupé via ton hôtel (1500 PHP/personne).",
          "duration": "Journée complète",
          "cost": "2000 PHP/personne tout inclus"
        },
        {
          "name": "Arrivée Panglao Beach",
          "description": "Fin d''après-midi : transfert vers Panglao Island (île reliée à Bohol par un pont, 30 min de Tagbilaran). Plages d''Alona, Dumaluan, Doljo. Alona = la plus animée, restos et bars. Doljo = plus locale, plus calme. Coucher de soleil sur Alona Beach. Dîner Trudis Place (poisson grillé local 350 PHP) ou Hayahay (resto plage 500 PHP).",
          "duration": "Soirée",
          "cost": "Inclus"
        }
      ],
      "transport": "Ferry + van privé/tour",
      "accommodation": "Bohol Beach House Hostel Alona (dortoir 700 PHP) ou Charl''s Inn (privée 1500 PHP) ou Bee Farm Resort (mid-range 3500 PHP, vraie ferme bio)",
      "meals": "Snack ferry, déjeuner inclus tour, dîner Alona Beach"
    },
    {
      "day": 6,
      "title": "Bohol — plongée Balicasag + plages Panglao",
      "activities": [
        {
          "name": "Tour bateau Balicasag Island",
          "description": "Tour bateau matinal : Balicasag Island à 30 min de Panglao. Snorkeling sur le récif corallien, nage avec les tortues vertes en liberté (très fréquent), Virgin Island sandbar. Tour groupé 1500-2000 PHP/personne. Privé 3500-4500 PHP le bateau. Départ 7h, retour 12-13h. Apporte masque/tuba (location 200 PHP), GoPro, crème reef-safe.",
          "duration": "Demi-journée",
          "cost": "1500 PHP/personne"
        },
        {
          "name": "Alona Beach détente + massage",
          "description": "Après-midi farniente sur Alona Beach. Massage à la plage (400-600 PHP/h), bar de plage, snorkeling depuis la plage si tu veux. Plus tranquille en semaine. Si tu veux explorer : scooter (300 PHP/jour) jusqu''à Hinagdanan Cave (grotte avec lac souterrain, 75 PHP entrée) ou Dumaluan Beach (plage publique gratuite, plus locale).",
          "duration": "Demi-journée",
          "cost": "500-1000 PHP"
        },
        {
          "name": "Coucher de soleil Bohol Bee Farm dinner",
          "description": "Dîner mémorable au Bohol Bee Farm Restaurant (appartient à la ferme bio du même nom). Plats à base de produits locaux, salade de fleurs comestibles, glaces au miel maison. Compte 800-1200 PHP/personne. Réservation conseillée. Vue sur la mer.",
          "duration": "2-3h",
          "cost": "1000 PHP"
        }
      ],
      "transport": "Bateau + scooter",
      "accommodation": "Bohol Beach House (2e nuit)",
      "meals": "Petit-déj hostel, déjeuner inclus tour bateau, dîner Bee Farm"
    },
    {
      "day": 7,
      "title": "Bohol → Manille → El Nido (longue journée)",
      "activities": [
        {
          "name": "Vol Tagbilaran/Cebu → Manille → Puerto Princesa OU vol direct si possible",
          "description": "C''est LE jour transit difficile. Plusieurs options : 1) Vol Bohol-Tagbilaran (TAG) direct vers Manille (1h15) puis Manille → Puerto Princesa (1h30, ~3500 PHP). Compte 6-7h porte à porte avec escale. 2) Ferry retour Cebu (2h) puis vol Cebu → Puerto Princesa (1h30, certains vols directs Cebu Pacific) — compte 7h aussi. 3) Bohol → Cebu → El Nido direct via AirSwift (vols directs Cebu-El Nido, 1h, ~6500 PHP) — le plus rapide MAIS plus cher. Réserve 6+ semaines avant.",
          "duration": "Journée complète",
          "cost": "4000-7000 PHP"
        },
        {
          "name": "Arrivée El Nido (van depuis Puerto Princesa)",
          "description": "Si tu atterris à Puerto Princesa : van Puerto Princesa → El Nido, 5-6h sur route panoramique (mais sinueuse, vomi-friendly). 600-800 PHP via Daytripper, Fortwally, Lexxus Shuttle. Réserve la veille via ton hostel. Si tu atterris à El Nido directement (Lio Airport via AirSwift) : tu es à 15 min en tricycle de la ville (200 PHP). Selon ton timing tu arrives le soir tard.",
          "duration": "5-6h ou 15 min selon vol",
          "cost": "600-800 PHP"
        },
        {
          "name": "Premier dîner à El Nido",
          "description": "Dîner sur Bacuit Bay : Sea Slugs (poisson grillé 400 PHP), Trattoria Altrove (pizza au feu de bois 500 PHP, c''est étonnamment excellent en plein milieu de Palawan), Republica (cuisine philippine moderne 700 PHP). Tu vois les bangkas (bateaux) garés en silhouette devant le coucher de soleil. La fatigue du transit s''envole.",
          "duration": "2h",
          "cost": "500-1000 PHP"
        }
      ],
      "transport": "Vols + van",
      "accommodation": "Spin Designer Hostel (dortoir 1000 PHP, le plus populaire des backpackers à El Nido) ou Casa Kalaw (privée 3500 PHP, mid-range très joli) ou Outpost Beach Hostel (1200 PHP)",
      "meals": "Snacks de transit, dîner El Nido"
    },
    {
      "day": 8,
      "title": "El Nido — Tour A (lagunes mythiques)",
      "activities": [
        {
          "name": "Tour A — Big Lagoon, Small Lagoon, Secret Lagoon",
          "description": "Le tour le plus iconique des Philippines. Tu pars en bangka 8h depuis la plage de Corong-Corong, retour 16h. Big Lagoon : tu rentres en kayak dans une lagune turquoise encerclée de falaises karstiques verticales. Small Lagoon : encore plus encaissé, tu nages à travers un trou pour entrer. Secret Lagoon : grotte cachée. 7 Commandos Beach pour le déjeuner BBQ. Snorkeling à Shimizu Island. 1400-1500 PHP/personne avec déjeuner inclus + 200 PHP environmental fee + 200 PHP location kayak Big Lagoon. Réserve la veille.",
          "duration": "Journée complète 8h-16h",
          "cost": "1800 PHP tout inclus"
        },
        {
          "name": "Conseils max profit",
          "description": "Astuce : prends la 1ère heure d''ouverture à Big Lagoon (8h-9h) pour avoir 30 min sans foule — après c''est blindé de bateaux. Réserve une location de kayak séparée (200 PHP) pour Big Lagoon, c''est la seule façon de l''explorer en profondeur. Crème solaire reef-safe IMPÉRATIVE (les rangers contrôlent et confisquent). Petite étanche pour ton phone, c''est la journée photos de toute ta vie.",
          "duration": "N/A",
          "cost": "Inclus"
        },
        {
          "name": "Coucher de soleil + dîner",
          "description": "Retour vers 16h. Sea Slug Bar pour le coucher de soleil (les bars rivalisent à Corong-Corong Beach). Dîner Trattoria Altrove ou Republica. Soirée tranquille à Pukka Bar (ambiance reggae) ou directement dodo, demain encore une journée pleine.",
          "duration": "Soirée",
          "cost": "500-800 PHP"
        }
      ],
      "transport": "Bangka",
      "accommodation": "Spin Designer Hostel (2e nuit)",
      "meals": "Petit-déj hostel, déjeuner inclus tour, dîner Bacuit Bay"
    },
    {
      "day": 9,
      "title": "El Nido — Tour C (plages cachées) ou Nacpan Beach",
      "activities": [
        {
          "name": "Tour C — Hidden Beach, Helicopter Island, Matinloc Shrine",
          "description": "Tour ''plages'' moins fréquenté que le A : Hidden Beach (plage cachée derrière une fente dans la falaise), Helicopter Island (forme d''hélico), Matinloc Shrine (chapelle abandonnée sur une île, ambiance creepy), Star Beach (snorkeling). 1500 PHP avec déjeuner inclus. Si tu as déjà fait le Tour A, le C complète parfaitement. Plus de plages, moins de lagunes, plus de snorkeling.",
          "duration": "Journée complète",
          "cost": "1500-1800 PHP"
        },
        {
          "name": "ALTERNATIVE non-bateau : Nacpan Beach",
          "description": "Si tu en as marre des bateaux ou si la mer est agitée : Nacpan Beach à 1h en tricycle au nord d''El Nido (1500 PHP A/R privatisé, 300 PHP en groupe). 4 km de sable doré sauvage, presque vide, eau peu profonde, parfaite pour nager. Restos plage simples (poisson grillé 350 PHP). Notre option préférée si tu veux respirer.",
          "duration": "Demi-journée",
          "cost": "500-1500 PHP"
        }
      ],
      "transport": "Bangka ou tricycle",
      "accommodation": "Spin Designer Hostel (3e nuit)",
      "meals": "Petit-déj, déjeuner inclus tour, dîner Republica"
    },
    {
      "day": 10,
      "title": "Ferry El Nido → Coron — épaves japonaises",
      "activities": [
        {
          "name": "Ferry rapide El Nido → Coron",
          "description": "Réserve à l''avance via 12go.asia. Atienza Shipping Lines ou Montenegro Lines. Départ matin 6h-7h, traversée 4h en mer ouverte. 1800 PHP. Pas pour les estomacs fragiles si la mer est agitée (oct-nov). Ils servent un snack à bord. Apporte cachet anti-mal de mer si tu doutes. Arrivée Coron Town vers 11h-12h.",
          "duration": "4h",
          "cost": "1800 PHP"
        },
        {
          "name": "Mont Tapyas viewpoint (700 marches, sunset)",
          "description": "Après-midi tranquille : montée du Mont Tapyas en fin d''après-midi pour le coucher de soleil. 700 marches (compte 30-45 min), vue panoramique sur la baie de Coron et ses pics karstiques. Gratuit. Apporte de l''eau. Au sommet, croix illuminée en croix géante.",
          "duration": "1-2h",
          "cost": "Gratuit"
        },
        {
          "name": "Dîner cuisine de Coron",
          "description": "Dîner Lolo Nonoy''s (philippine traditionnelle, sisig à 220 PHP, sinigang à 300 PHP) ou Levi''s (BBQ local, 350 PHP). Coron Town est plus petite et calme qu''El Nido, ambiance posée.",
          "duration": "2h",
          "cost": "400-700 PHP"
        }
      ],
      "transport": "Ferry rapide",
      "accommodation": "Sea Dive Resort (privée 2500 PHP, vue mer) ou Hop Hostel Coron (dortoir 700 PHP) ou ColayWay Resort (mid-range 4500 PHP)",
      "meals": "Snack ferry, dîner Coron Town"
    },
    {
      "day": 11,
      "title": "Coron — Tour ultime lacs cristallins",
      "activities": [
        {
          "name": "Coron Island Tour : Twin Lagoon, Kayangan Lake, Barracuda Lake",
          "description": "LE tour de Coron. Twin Lagoon : 2 lagunes connectées par un trou — tu nages ou kayakes pour passer (selon marée). Kayangan Lake : élu lac le plus propre des Philippines, vue carte postale absolue (la photo iconique de Coron). Barracuda Lake : phénomène de thermocline (mélange eau douce/salée chaud/froid à différentes profondeurs, sensation bizarre quand tu plonges). Snorkeling à Coral Garden, Banol Beach pour déjeuner BBQ. 1500-2000 PHP groupé. Privé 4500 PHP/bateau. Environmental fee 200 PHP. Compte 8h-16h.",
          "duration": "Journée complète",
          "cost": "1700 PHP/personne"
        },
        {
          "name": "Conseils tour Coron",
          "description": "Réserve la veille via ton hostel ou JY Travel & Tours (réputation solide). Crème solaire reef-safe encore. Apporte du cash en petite coupure pour le BBQ déjeuner et boissons. La marche pour atteindre Kayangan Lake fait 300 marches en pierre — chaussures fermées appréciées. Si tu plonges, mentionne-le à ton dive shop : Barracuda Lake en plongée est une expérience géologique unique au monde.",
          "duration": "N/A",
          "cost": "Inclus"
        }
      ],
      "transport": "Bangka",
      "accommodation": "Sea Dive Resort (2e nuit)",
      "meals": "Petit-déj hostel, déjeuner inclus tour, dîner Lolo Nonoy''s"
    },
    {
      "day": 12,
      "title": "Coron → Cebu → Siargao — transit",
      "activities": [
        {
          "name": "Vol Coron → Manille → Siargao OU Coron → Cebu → Siargao",
          "description": "Encore une journée transit. Coron USU airport est petit mais opérationnel. Options : 1) Coron → Manille (1h15) puis Manille → Siargao (1h45), avec escale 2-4h. 2) Coron → Cebu via Cebgo (1h) puis Cebu → Siargao (1h, vols quotidiens). Total compte 6-8h porte à porte. 3000-5500 PHP selon timing de réservation. Réserve TOUS les vols domestiques en même temps que les vols internationaux (4-6 semaines avant) pour économiser massivement.",
          "duration": "Journée complète",
          "cost": "5000 PHP environ"
        },
        {
          "name": "Arrivée Siargao + premier coucher Cloud 9",
          "description": "Atterrissage Sayak Airport. Van partagé vers General Luna (300-500 PHP, 45 min). Installation hostel, location scooter (350-500 PHP/jour, fais-le dès le jour 1). Coucher de soleil au boardwalk de Cloud 9 — le tube mythique. Dîner Kermit (pizza au feu de bois 450 PHP) ou Bravo Beach Resto (poisson 350 PHP). Tu as quitté l''ambiance ''paysage'' Palawan pour l''ambiance ''vibe'' Siargao — switch radical et bienvenu.",
          "duration": "Soirée",
          "cost": "1000 PHP"
        }
      ],
      "transport": "Vols domestiques + van",
      "accommodation": "Harana Surf Resort (dortoir 800 PHP) ou Bravo Beach Resort (1800 PHP)",
      "meals": "Snacks transit, dîner Kermit"
    },
    {
      "day": 13,
      "title": "Siargao — surf + island hopping Naked/Daku/Guyam",
      "activities": [
        {
          "name": "Cours de surf matinal Jacking Horse",
          "description": "Cours débutant Jacking Horse (1h30, 1000-1200 PHP planche+instructeur inclus). Spot avec fond de sable, vagues douces, idéal pour apprendre. Si tu surfes déjà, location seule 400-600 PHP la session. Le matin, mer plus glassy.",
          "duration": "Matinée",
          "cost": "1000 PHP"
        },
        {
          "name": "Island hopping Naked + Daku + Guyam",
          "description": "Le tour iconique de Siargao l''après-midi. Naked Island (sandbar minuscule sans végétation, photo paradisiaque), Daku Island (déjeuner BBQ inclus, hamacs, palmiers), Guyam Island (snorkeling sympa). 1500 PHP/personne en groupé via ton hostel. Crème solaire reef-safe, chapeau, eau (Naked Island c''est zéro ombre, soleil direct).",
          "duration": "Demi-journée 13h-17h",
          "cost": "1500 PHP"
        },
        {
          "name": "Dernière soirée Siargao",
          "description": "Coucher de soleil au Bravo Sundowner ou Sun Roof, dîner Lobo Siargao (tapas espagnol-philippin, 800-1200 PHP/personne, réserve) ou Mamak Siargao (Malay-indien fusion, 400 PHP). Si tu cherches la fête : Reggae Bar à Cloud 9 ou Sapian Bar live music.",
          "duration": "Soirée",
          "cost": "800-1500 PHP"
        }
      ],
      "transport": "Scooter + bateau",
      "accommodation": "Harana Surf Resort (2e nuit)",
      "meals": "Petit-déj Café Loka, déjeuner inclus tour, dîner Lobo"
    },
    {
      "day": 14,
      "title": "Siargao → Manille → vol international",
      "activities": [
        {
          "name": "Dernière baignade Cloud 9 + souvenirs",
          "description": "Selon ton heure de vol international : dernière baignade au lever du jour à Cloud 9 (lumière magique vers 6h30), petit-déj smoothie bowl Loka, achète quelques souvenirs locaux (Siargao Coffee, miel local, sucre de coco artisanal — pas les T-shirts standardisés).",
          "duration": "2-3h",
          "cost": "500-800 PHP"
        },
        {
          "name": "Vol Siargao → Manille + connexion internationale",
          "description": "Vol Sayak → Manille (1h45), puis transit pour ton vol retour international depuis NAIA. ATTENTION : 4h minimum entre l''arrivée domestique à Manille et ton vol international (NAIA est notoirement chaotique, embouteillages massifs). Si possible, prends un vol Siargao matinal pour avoir une marge confortable. Sinon, dors une nuit à Manille (Z Hostel BGC) pour partir l''esprit tranquille.",
          "duration": "1h45 vol + transit",
          "cost": "3500 PHP vol domestique"
        },
        {
          "name": "Bilan + retour",
          "description": "14 jours, 5 destinations, 5 vols domestiques, 3 ferrys, 2 lagunes mythiques, des sardines à 5m du rivage, des cascades à sauter, du surf à apprendre, des Chocolate Hills. Tu n''as pas tout vu (Bohol mérite plus de temps, Coron aussi, Bantayan, Siquijor n''ont pas été touchés). Mais tu as vraiment goûté aux Philippines en mode contrasté. Beaucoup reviennent. Tu es prévenu.",
          "duration": "N/A",
          "cost": "Inclus"
        }
      ],
      "transport": "Vol domestique + vol international",
      "accommodation": "Vol retour ou nuit Manille selon timing",
      "meals": "Petit-déj final, snacks aéroport"
    }
  ]'::jsonb,
  '[
    {
      "question": "Est-ce que 14 jours suffisent vraiment pour visiter les Philippines ?",
      "answer": "14 jours = best-of intense mais pas relax. Tu vas prendre 5 vols domestiques, 3 ferrys, te lever tôt, vivre par tranches de 2-3 jours par destination. Si tu veux tranquille : reste sur 2-3 destinations max (Palawan + Siargao = parfait à 14 jours). Si tu veux LE mix de tous les paysages : suis cet itinéraire. Pour un voyage complet relax = 21 jours minimum, idéal 28 jours."
    },
    {
      "question": "Quelle est la meilleure saison pour 2 semaines aux Philippines ?",
      "answer": "Janvier à avril sans hésiter. Saison sèche sur tout le pays, mer calme, soleil garanti. Mars-avril c''est le pic chaud (35°C+). Décembre = haute saison + Noël (prix gonflés mais météo OK). Évite juillet-octobre : typhons fréquents, ferrys annulés, vols domestiques perturbés. Mai-juin = saison transition jouable."
    },
    {
      "question": "Quel budget prévoir pour 2 semaines ?",
      "answer": "Backpacker strict : 700-900€ sur place (50-65€/jour) + ~900€ vol international = ~1700€ total. Mid-range confort : 1300-1700€ sur place + vol = 2500€. Compte 200€ environ par vol domestique (5 vols = 1000 PHP en moyenne A/R). Hors vol intl, prévois 60-100€/jour mid-range pour cet itinéraire avec ses 5 vols."
    },
    {
      "question": "Combien de vols domestiques faut-il prendre ?",
      "answer": "5 vols domestiques pour cet itinéraire : Manille → Cebu, Cebu/Bohol → El Nido (avec escale Manille), Coron → Manille/Cebu → Siargao, Siargao → Manille. Réserve TOUS en même temps que ton vol international, 4-6 semaines avant minimum. Cebu Pacific et Philippine Airlines ont les meilleures couvertures domestiques. AirSwift sert les routes Manille-El Nido directes (pratique mais cher)."
    },
    {
      "question": "Comment économiser sur les vols domestiques ?",
      "answer": "1) Réserve tôt (4-6 semaines minimum, idéal 2-3 mois). 2) Sois flexible sur les heures (vols 6h ou 22h moins chers). 3) Skip les bagages soute si possible (Cebu Pacific surfacture le bagage soute, ça peut doubler le prix du billet). 4) Compare Cebu Pacific, PAL, Philippine AirAsia, AirSwift sur kiwi.com ou directement. 5) Évite la haute saison (Pâques, décembre). Compte 30-90€ par vol selon timing."
    },
    {
      "question": "Faut-il faire Boracay ou Siargao ?",
      "answer": "Si tu fais cet itinéraire 14 jours, on a choisi Siargao volontairement. Boracay est trop similaire à El Nido (plage iconique de carte postale) et n''ajoute pas grand chose. Siargao apporte une vibe radicalement différente (surf, digital nomad, food scene) qui complète bien. Si tu préfères Boracay, remplace Siargao par Boracay (4-5 jours) — l''itinéraire fonctionne mais l''expérience est moins variée."
    },
    {
      "question": "Quels scams éviter aux Philippines ?",
      "answer": "Top scams : 1) Taxi ''fixed price'' à NAIA aéroport (toujours Grab) ; 2) Tricycles annoncent un prix puis demandent plus à l''arrivée (négocie ET confirme) ; 3) Black henna tatouage à Boracay/Cebu (encre cancérigène, refuse) ; 4) Tour bateau qui prennent paiement total à l''avance puis ne se présentent pas (paye à l''embarquement) ; 5) Faux change de devise dans la rue (toujours en banque ou Money Changer reconnu)."
    },
    {
      "question": "Faut-il un visa pour les Philippines ?",
      "answer": "Non pour les ressortissants français/belges/suisses/canadiens : tampon gratuit à l''arrivée, séjour 30 jours. Extension possible jusqu''à 59 jours puis jusqu''à 6 mois total via le Bureau of Immigration (~3000 PHP par extension). Passeport valide 6 mois minimum à l''entrée. Billet retour ou continuation demandé à l''embarquement (souvent vérifié)."
    },
    {
      "question": "Faut-il GCash et comment l''activer ?",
      "answer": "GCash = l''app de paiement mobile dominante aux Philippines, utilisable dans 90% des restos, hôtels, magasins. Pour l''activer tu as besoin d''une SIM philippine (Globe ou Smart, 700 PHP pour 50GB sur 30 jours, achète à l''aéroport). Active l''app, vérifie ton identité (passeport scan), recharge via banque ou centres de cash-in. Pratique pour éviter les retraits à frais."
    },
    {
      "question": "Quels sont les meilleurs hostels pour cet itinéraire ?",
      "answer": "Manille : Z Hostel (BGC, dortoir 1200 PHP). Cebu City : Mad Monkey ou Henry Hotel. Moalboal : Chief Mau Backpackers. Bohol : Bohol Beach House Hostel. El Nido : Spin Designer Hostel ou Outpost Beach. Coron : Hop Hostel ou Sea Dive Resort. Siargao : Harana Surf Resort. Tous testés, tous avec ambiance sociale et bon rapport qualité/prix (500-1200 PHP le dortoir)."
    },
    {
      "question": "Combien coûte la nourriture aux Philippines ?",
      "answer": "Local turo-turo (cantine philippine) : 150-250 PHP le plat avec riz. Restau touristique standard : 350-600 PHP le plat. Restau gastronomique : 800-1500 PHP/personne. Street food (BBQ, pancit) : 50-200 PHP. Bière San Mig : 60-90 PHP en sari-sari, 150-250 PHP en bar. Compte 600-1000 PHP/jour pour bien manger en mode local."
    },
    {
      "question": "Faut-il une assurance voyage spéciale ?",
      "answer": "OUI obligatoire. 2 critères : 1) Couverture annulation/évacuation pour les typhons (août-octobre surtout) ; 2) Couverture activités à risque si tu fais de la plongée, du surf, du canyoneering. Chapka Direct ou Heyme sont les références pour les Français/Belges. Compte 80-150€ pour 14 jours. Si tu loues un scooter, vérifie que le permis international est requis dans les conditions."
    },
    {
      "question": "Quel est le décalage horaire France/Philippines ?",
      "answer": "+7h en hiver (FR), +6h en été. Ex : 12h Paris = 19h Manille en hiver, 18h en été. Le jet lag à l''arrivée est rude (vol de 14-16h avec escale). Compte 2-3 jours pour t''adapter — le programme jour 1 (Intramuros + dîner) est volontairement light pour ça."
    },
    {
      "question": "Anglais ou autres langues utiles ?",
      "answer": "L''anglais est largement parlé partout (langue officielle), encore plus dans les destinations touristiques. Pas besoin de tagalog (langue nationale) ou cebuano. Tu te débrouilles très bien en anglais basique. Quelques mots qui font sourire les locaux : ''salamat'' (merci), ''mabuhay'' (bienvenue), ''masarap'' (délicieux)."
    }
  ]'::jsonb,
  ARRAY['palawan', 'cebu', 'siargao', 'boracay'],
  ARRAY[
    'Réserve TOUS tes vols domestiques (5 vols) en même temps que le vol international, 4-6 semaines minimum avant',
    'Vol international : préfère arrivée à Manille (NAIA) plus de connexions internationales, plutôt que Cebu',
    'NAIA aéroport : compte 4h minimum entre vol domestique arrivée et vol international départ',
    'Achète une SIM Globe ou Smart à l''aéroport Manille (700 PHP pour 50GB, indispensable Grab + GCash)',
    'Active GCash dès l''arrivée — paiement mobile dominant, économise les frais ATM',
    'Cash : retire grosses sommes à BPI ou DBP (frais 250 PHP). Évite les ATM en sari-sari (frais 500 PHP)',
    'Saison typhons août-octobre = ferrys annulés et vols décalés. Janvier-avril = optimal',
    'Crème solaire reef-safe obligatoire pour El Nido, Coron, Bohol — les rangers contrôlent et confisquent',
    'Eau du robinet imbuvable partout. Bouteilles 5L en sari-sari 50 PHP, ou gourde filtrante LifeStraw/Grayl',
    'Climatisation des bus et fast ferries SURDIMENSIONNÉE — un sweat ou sarong est obligatoire',
    'Ferry El Nido-Coron : réserve sur 12go.asia 2-3 jours avant minimum, jours haute saison',
    'Si mer agitée prévue (oct-nov surtout), prends un cachet anti-mal de mer pour le ferry El Nido-Coron',
    'Vols domestiques : Cebu Pacific facture brutalement le bagage soute hors-tarif. Lis bien tes options',
    'Assurance voyage avec couverture évacuation typhon ET activités à risque (plongée, surf, canyoneering)',
    'Skippe Oslob whale sharks (éthique discutable, condamné par WWF) — fais Tumalog Falls à la place',
    'Boracay vs Siargao : on a choisi Siargao pour la diversité — vibe radicalement différente d''El Nido'
  ],
  'multi-destination',
  false
)
ON CONFLICT (slug) DO NOTHING;
