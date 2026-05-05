-- Seed Cebu : itineraire backpacker 8 jours, hub central des Visayas
-- Couverture SEO : "itineraire cebu", "cebu philippines", "que faire a cebu"
-- Volume estime FR : 500-1500/mois
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
  'cebu',
  'Cebu',
  '/imagesHero/cebu-island-philippines.webp',
  'Cascade de Kawasan Falls et plages de Cebu aux Philippines',
  'Itinéraire Cebu : 8 Jours Backpacker (2026) — Philippineasy',
  'Itinéraire Cebu 8 jours : Moalboal sardines, Kawasan, Bantayan, Malapascua. Budget backpacker, transports, hostels testés. Guide francophone 2026.',
  'Cebu, c''est le hub des Visayas. Tu débarques à l''aéroport de Mactan-Cebu et tu es à 4h de bus de la sardine run de Moalboal, à 5h des cascades turquoise de Kawasan, à un ferry de Bohol et de ses Chocolate Hills, à un autre des thresher sharks de Malapascua. Aucune autre île des Philippines ne te donne autant d''options en si peu de temps. C''est aussi pour ça qu''on la conseille à tous ceux qui ont 1 à 2 semaines : tu peux faire 100% Cebu et avoir l''impression d''avoir vu trois pays différents.

On ne va pas te mentir : Cebu City elle-même est sale, embouteillée, bruyante. La plupart des voyageurs s''y arrêtent juste le temps de prendre un bus vers le sud. Le vrai Cebu commence quand tu sors de la ville. Moalboal pour la sardine run gratuite à 5m du rivage, Oslob pour les whale sharks (sujet éthique on va y revenir), Kawasan Falls pour le canyoneering, Bantayan pour la plage de carte postale sans la foule de Boracay, Malapascua pour les requins-renards. Et entre tout ça, des trajets en bus locaux à 200 PHP, des tricycles à négocier, des sari-sari stores où acheter des Tanduay à 80 PHP la pinte.

Cet itinéraire de 8 jours est calibré pour un voyageur backpacker ou flashpacker qui veut maximiser sans courir. On a accompagné plus de 10 000 voyageurs depuis 2020 et on revient régulièrement sur Cebu : ce planning est le distillat de cette expérience. Tu restes libre de réserver tes vols et hébergements où tu veux — on te donne juste les noms qu''on connaît et qui tiennent la route.',
  8,
  'Janvier à Mai (saison sèche, mer calme). Éviter août-octobre (typhons fréquents sur la côte est)',
  'Vol direct Manille → Cebu (Mactan-Cebu Intl Airport, 1h15). Cebu Pacific et Philippine Airlines ~50€ A/R si réservé tôt. Aussi accessible en ferry depuis Manille (22h, à éviter sauf budget extrême)',
  35,
  75,
  200,
  '[
    {
      "day": 1,
      "title": "Arrivée à Cebu City — décompression",
      "activities": [
        {
          "name": "Récupération + transfert centre-ville",
          "description": "Tu atterris à Mactan-Cebu, l''aéroport est sur une île reliée par deux ponts à Cebu City. Compte 30 à 60 min de trajet selon le trafic (qui peut être brutal en fin de journée). Un Grab depuis l''aéroport coûte 250-400 PHP, le taxi compteur 200-350 PHP. Évite les rabatteurs ''fixed price'' du hall arrivée — c''est toujours plus cher.",
          "duration": "1h",
          "cost": "250-400 PHP"
        },
        {
          "name": "Balade Colon Street + Magellan''s Cross",
          "description": "Si tu arrives en début d''après-midi, file à Colon Street (la plus vieille rue des Philippines), Magellan''s Cross et la basilique du Santo Niño. C''est l''ADN historique du pays — c''est ici que la christianisation a commencé en 1521. Pas spectaculaire visuellement mais culturellement important. 1h grand max, c''est gratuit.",
          "duration": "1-2h",
          "cost": "Gratuit"
        },
        {
          "name": "Dîner street food au Larsian BBQ",
          "description": "Larsian Fuente, c''est LE marché de barbecue de Cebu. Tu pointes ton brochette (porc, poulet, foie, intestin si tu te sens aventureux), ils grillent devant toi, tu payes 30-80 PHP par brochette. Riz à part. Bière San Mig grande à 90 PHP. Ambiance bruyante, fumée, locale — tu manges littéralement à côté des gars qui grillent. Premier vrai repas philippin, on adore.",
          "duration": "1h",
          "cost": "200-400 PHP/personne"
        }
      ],
      "transport": "Grab depuis aéroport ou taxi compteur",
      "accommodation": "Mad Monkey Hostel Cebu City (dortoir 600-900 PHP, ambiance backpacker) ou Henry Hotel (chambre privée 1800 PHP, plus calme)",
      "meals": "Petit-déj inclus à l''hostel, déjeuner SM Mall food court, dîner Larsian"
    },
    {
      "day": 2,
      "title": "Cebu City → Moalboal (4h de bus)",
      "activities": [
        {
          "name": "Bus Ceres South Bus Terminal → Moalboal",
          "description": "Tu pars de South Bus Terminal (Grab depuis ton hostel 80-150 PHP). Bus Ceres climatisé toutes les heures jusqu''à Bato via Moalboal, ~200 PHP. Demande au chauffeur ''Moalboal junction'' — l''arrêt est sur la nationale, pas dans le village. De là, tricycle 50 PHP jusqu''à Panagsama Beach. Trajet total avec attente : 4-5h. Bring snacks et casque — la clim du bus est toujours surdimensionnée.",
          "duration": "4-5h",
          "cost": "250 PHP transport + 50 PHP tricycle"
        },
        {
          "name": "Sardine run Panagsama (gratuit)",
          "description": "Et c''est là que tu réalises pourquoi tu es venu. À 5 mètres du rivage de Panagsama Beach, un banc de millions de sardines tournoie en permanence. Tu mets palmes, masque, tuba (location 200 PHP la journée chez n''importe quel dive shop), tu te jettes à l''eau, et tu nages au milieu. Pas d''entrée à payer, pas de tour à réserver, juste la plage publique. Le matin (7-9h) ou en fin d''après-midi pour la lumière. Sois respectueux : ne touche pas les sardines, pas de protection solaire chimique (tue les coraux).",
          "duration": "1-2h dans l''eau",
          "cost": "Gratuit (200 PHP location masque/tuba)"
        },
        {
          "name": "Coucher de soleil au Three Bears",
          "description": "Three Bears, c''est un petit bar surf perché sur un rocher au bout de Panagsama. Tu prends un San Mig à 80 PHP, tu regardes le soleil tomber sur le détroit de Tañon. C''est un classique. Pas de chichis, tables en bois, musique reggae. Ferme tôt (22h).",
          "duration": "2h",
          "cost": "200-400 PHP (boissons)"
        }
      ],
      "transport": "Bus Ceres + tricycle",
      "accommodation": "Chief Mau Backpackers (dortoir 500-700 PHP, l''ambiance est top, piscine, propre) ou Moalboal Backpacker Lodge (privée 1500 PHP)",
      "meals": "Snack en route, dîner au Shaka Café (bowl açaï 350 PHP) ou Lantaw Floating Native Restaurant (poisson grillé 400 PHP)"
    },
    {
      "day": 3,
      "title": "Moalboal — Pescador Island + canyoneering Kawasan",
      "activities": [
        {
          "name": "Tour bateau Pescador Island + tortues",
          "description": "Tour bateau classique : Pescador Island pour le mur de plongée (snorkeling possible mais c''est profond), turtle point pour nager avec des tortues vertes en liberté, sardine run depuis le bateau. La plupart des dive shops proposent ça à 1500-2000 PHP/personne, repas inclus. Si tu négocies en groupe (4-6 personnes) tu descends à 1200 PHP. Départ 8h, retour 14h.",
          "duration": "Demi-journée",
          "cost": "1200-2000 PHP"
        },
        {
          "name": "Canyoneering Kawasan Falls (option journée complète)",
          "description": "ALTERNATIVE qui remplace le tour bateau : canyoneering Kawasan. Tu sautes de cascades, tu descends en rappel, tu nages dans les bassins turquoise. 3-4h d''adrénaline pour 1500-1800 PHP tout inclus (transport, équipement, casque, gilet, déjeuner). Hostels et dive shops de Moalboal organisent le pickup. Si tu ne sais pas nager c''est non. Si tu as peur du vide aussi (sauts jusqu''à 12m mais options 5m). Le must-do de Cebu pour la plupart des voyageurs.",
          "duration": "Journée complète",
          "cost": "1500-1800 PHP tout inclus"
        },
        {
          "name": "Massage thaï 1h après l''effort",
          "description": "Sur Panagsama, des dizaines de salons proposent des massages à 350-500 PHP/heure. Le thaï traditionnel après le canyoneering, c''est obligatoire. Évite les ''spa'' touristiques aux prix gonflés.",
          "duration": "1h",
          "cost": "400 PHP"
        }
      ],
      "transport": "Pickup depuis hostel pour les tours",
      "accommodation": "Chief Mau Backpackers (2e nuit)",
      "meals": "Petit-déj hostel, déjeuner inclus dans le tour, dîner Ven''z Kitchen (philippin, sisig à 220 PHP)"
    },
    {
      "day": 4,
      "title": "Moalboal → Oslob (whale sharks, sujet éthique) ou Donsol",
      "activities": [
        {
          "name": "Question éthique whale sharks Oslob",
          "description": "On va être direct. Oslob, c''est nager avec des requins-baleines à 5m du rivage. Mais : les baleines sont nourries quotidiennement par les pêcheurs (krill artificiel), ce qui altère leur comportement migratoire et les expose aux bateaux. WWF, Marine Megafauna Foundation et la majorité des biologistes marins déconseillent. Si l''éthique compte pour toi, va plutôt à Donsol (Sorsogon, île de Luzon, 350km au sud de Manille) : whale sharks sauvages non nourris, saison nov-juin. Pour Oslob, l''expérience reste impressionnante (1000 PHP entrée + 200 PHP location équipement), mais tu sais maintenant.",
          "duration": "Demi-journée si tu y vas",
          "cost": "1200 PHP (Oslob) — Donsol nécessite un autre voyage"
        },
        {
          "name": "ALTERNATIVE : Tumalog Falls + Sumilon Island",
          "description": "Si tu skippe Oslob (notre recommandation), reste à Moalboal une journée de plus ou pousse jusqu''à Sumilon Island. Tumalog Falls est à 30 min en moto depuis Oslob, c''est un voile d''eau qui tombe d''une falaise dans une piscine de jade. Sumilon Island est un sandbar paradisiaque (entrée 600 PHP). Un combo Tumalog + Sumilon = journée magnifique sans toucher aux baleines.",
          "duration": "Journée complète",
          "cost": "1500 PHP transport + entrées"
        },
        {
          "name": "Retour vers Cebu City (transit)",
          "description": "En fin de journée, bus retour vers Cebu City (3-4h, 250 PHP). Tu dors une nuit à Cebu City pour catcher le ferry de bonne heure le lendemain matin vers Bantayan ou Malapascua.",
          "duration": "3-4h",
          "cost": "250 PHP"
        }
      ],
      "transport": "Bus + tricycle + bus retour",
      "accommodation": "Mad Monkey Cebu City (2e passage, dortoir 600 PHP)",
      "meals": "Déjeuner local Oslob (500 PHP), dîner Cebu City (Abuhan Tres pour le lechon, 350 PHP)"
    },
    {
      "day": 5,
      "title": "Cebu → Bantayan Island (la plage chill)",
      "activities": [
        {
          "name": "Bus + ferry vers Bantayan",
          "description": "Lever à 5h (oui). Bus Ceres North Bus Terminal vers Hagnaya (3h30, 200 PHP). De Hagnaya, ferry vers Santa Fe sur Bantayan (1h, 200 PHP). Total : compte 6h porte à porte. ALTERNATIVE : van direct depuis Cebu City (paquet bus+ferry combo, 600 PHP, plus rapide). Réserve la veille auprès de ton hostel.",
          "duration": "5-6h",
          "cost": "400-600 PHP"
        },
        {
          "name": "Plage Santa Fe + scooter exploration",
          "description": "Bantayan, c''est l''opposé de Boracay : sable blanc tout aussi beau, mais zéro foule, zéro vendeur de bracelets, zéro DJ qui hurle. Loue un scooter (300-400 PHP/jour, demande à ton hostel) et roule jusqu''à Paradise Beach au nord (entrée 50 PHP, plage sauvage), Ogtong Cave (piscine naturelle dans une grotte 100 PHP), Sugar Beach. Toute l''île se fait en scooter, c''est petit et plat.",
          "duration": "Demi-journée",
          "cost": "400 PHP scooter + 200 PHP entrées"
        },
        {
          "name": "Coucher de soleil + dîner poisson grillé",
          "description": "Direction Sugar Beach Bar pour le coucher de soleil, puis dîner sur la plage de Santa Fe. Plusieurs restos de poisson grillé en bord de mer : tu choisis ton poisson au marché du jour, ils le grillent (250-400 PHP selon la taille), riz et veggies à part. La spécialité locale c''est le danggit séché et l''espada (poisson sabre) frit.",
          "duration": "3h",
          "cost": "400-600 PHP"
        }
      ],
      "transport": "Bus + ferry + scooter sur place",
      "accommodation": "Kota Beach Resort (chambre 1500 PHP face mer) ou HM Riviera Resort Bantayan (1000 PHP, simple mais propre, dortoirs aussi 500 PHP)",
      "meals": "Snack en transit, dîner poisson grillé Santa Fe"
    },
    {
      "day": 6,
      "title": "Bantayan — journée farniente + island hopping local",
      "activities": [
        {
          "name": "Island hopping Virgin Island + Hilantagaan",
          "description": "Tour bateau privé ou groupé vers Virgin Island (sandbar isolée), Hilantagaan Island (snorkeling), Kota Beach. 1500-2500 PHP le bateau pour 4 personnes (négocie sur la plage, demande 4-5h). Apporte ton propre masque/tuba, l''eau est cristalline. Pas de coraux fous comme à Moalboal mais c''est tropical, tranquille, avec des familles philippines en weekend.",
          "duration": "Demi-journée",
          "cost": "400-600 PHP/personne en groupe"
        },
        {
          "name": "Hammac + livre + bière",
          "description": "Voilà. Tu as fait le canyoneering, la sardine run, les bus, les ferrys. Aujourd''hui c''est journée hammac. Bantayan c''est exactement ça. Plein d''hostels ont des hamacs en bord de plage. Prix d''une bière fraîche : 80 PHP. Investissement minimum, retour maximum.",
          "duration": "Le reste de la journée",
          "cost": "300 PHP boissons"
        }
      ],
      "transport": "Bateau local + scooter",
      "accommodation": "Kota Beach Resort (2e nuit)",
      "meals": "Petit-déj hostel, déjeuner sur le bateau (apporter snacks), dîner BBQ plage"
    },
    {
      "day": 7,
      "title": "Bantayan → Malapascua (thresher sharks) — option avancée",
      "activities": [
        {
          "name": "Trajet vers Malapascua",
          "description": "Trajet pas direct entre Bantayan et Malapascua : retour ferry vers Hagnaya (1h), bus vers Maya (2h), ferry vers Malapascua (30 min). Compte 5-6h porte à porte. Réservable en combo via les hostels (700-900 PHP). Pour les non-plongeurs, Malapascua peut se sauter et tu rentres direct sur Cebu City (sauf si tu veux des plages non touristiques).",
          "duration": "5-6h",
          "cost": "700-900 PHP"
        },
        {
          "name": "Plongée thresher sharks Kimud Shoal (PADI/SSI requis)",
          "description": "C''est LE site mondial pour voir des requins-renards (thresher sharks). Depuis 2022 les threshers ont migré de Monad Shoal vers Kimud Shoal — la plongée est devenue plus accessible : profondeur 15-20m au cleaning station (parfois plus haut), Open Water suffit avec un instructeur. Pour les plongées traditionnelles à Monad Shoal (25-30m, threshers plus rares maintenant + tiger/bull sharks occasionnels), Advanced Open Water requis. Plongée à 5h du matin (oui, 5h), 30 min en bateau de Malapascua. Les threshers viennent se faire nettoyer par les poissons-pilotes — tu les vois à 5-10m de toi, immobiles, ces queues immenses qui les rendent uniques. 4500-6000 PHP la plongée. Thresher Shark Divers et Évangelista Dive Center sont les deux références.",
          "duration": "Matinée 4h-10h",
          "cost": "5500 PHP environ"
        },
        {
          "name": "ALTERNATIVE non-plongeurs : Bounty Beach + Kalanggaman",
          "description": "Si tu ne plonges pas, Malapascua a quand même Bounty Beach (sable blanc, parfait), et tu peux faire un tour bateau vers Kalanggaman Island (sandbar mythique en forme de S, 1500 PHP/personne le tour journée). Snorkeling correct sur les récifs autour de l''île.",
          "duration": "Journée complète",
          "cost": "1500 PHP"
        }
      ],
      "transport": "Ferry + bus + ferry",
      "accommodation": "Tepanee Beach Resort (1500 PHP) ou Mr. Kwiiboo''s Hostel (dortoir 500 PHP, l''ambiance plongeurs)",
      "meals": "Petit-déj hostel, déjeuner local, dîner Craic House (cuisine irlando-philippine, sympa)"
    },
    {
      "day": 8,
      "title": "Retour Cebu City + vol",
      "activities": [
        {
          "name": "Trajet retour",
          "description": "Ferry Malapascua → Maya (30 min, 200 PHP) puis bus Maya → Cebu City North Bus Terminal (3-4h, 250 PHP). Pars tôt (premier ferry 7h) si ton vol est l''après-midi. Sinon réserve une dernière nuit à Cebu City pour relax avant le vol.",
          "duration": "5-6h",
          "cost": "500 PHP"
        },
        {
          "name": "Last bites + souvenirs",
          "description": "Si tu as 2-3h à Cebu City avant l''aéroport : déjeuner lechon chez House of Lechon (Cebu est mondialement connue pour son cochon de lait grillé, à raison), passage à Tabo-an Market pour acheter danggit séché (souvenir pour les gourmands), mangues séchées (50 PHP le sachet). Évite les marchés ''souvenirs'' standardisés.",
          "duration": "2-3h",
          "cost": "500-1000 PHP repas + souvenirs"
        }
      ],
      "transport": "Ferry + bus + Grab vers aéroport (300 PHP)",
      "accommodation": "Vol retour ou prochaine destination",
      "meals": "Lechon obligatoire avant de partir"
    }
  ]'::jsonb,
  '[
    {
      "question": "Combien de jours faut-il pour visiter Cebu correctement ?",
      "answer": "8 jours est le sweet spot pour combiner Moalboal + Bantayan + Malapascua sans courir. 5-6 jours minimum si tu te limites à Moalboal + Kawasan. 10 jours si tu veux y ajouter Bohol (à 2h de ferry depuis Cebu City) ou prendre du temps pour la plongée."
    },
    {
      "question": "Quelle est la meilleure saison pour Cebu ?",
      "answer": "Janvier à mai pour la mer calme et le soleil. Décembre est jouable mais peut être pluvieux. Évite août à octobre : saison des typhons, beaucoup de tours bateau annulés, ferrys suspendus. Le typhon Odette de décembre 2021 a ravagé Cebu — c''est un risque réel."
    },
    {
      "question": "Quel budget backpacker strict prévoir à Cebu ?",
      "answer": "30-35€/jour est faisable : dortoir 500-700 PHP (~10€), 3 repas locaux 600 PHP (~10€), 1 activité 1000 PHP (~17€), bus locaux. Si tu plonges ou fais beaucoup de tours, monte à 50-60€/jour. Pour un voyage 8 jours backpacker strict : compte 280€ hors vol."
    },
    {
      "question": "Faut-il aller voir les whale sharks à Oslob ?",
      "answer": "Question éthique délicate. Les baleines sont nourries quotidiennement, ce qui altère leur comportement migratoire — pratique condamnée par WWF et la communauté scientifique. Si tu y tiens, l''expérience est impressionnante (1200 PHP). Mais on conseille plutôt Donsol (Sorsogon, Luzon) où les whale sharks sont sauvages et non nourris, ou simplement de skipper et de profiter de Tumalog Falls à la place."
    },
    {
      "question": "Peut-on louer un scooter à Cebu ?",
      "answer": "Sur les îles oui (Bantayan, Malapascua, Moalboal) : 300-500 PHP/jour, permis international demandé en théorie. Dans Cebu City c''est déconseillé : trafic chaotique, pollution, risque accident élevé. Privilégie Grab et tricycles en ville."
    },
    {
      "question": "Quels scams éviter à Cebu ?",
      "answer": "Trois grands classiques : taxis sans compteur à l''aéroport (refuse, prends Grab), tricycles qui annoncent un prix puis demandent ''plus'' à l''arrivée (négocie ET confirme avant de monter), et les ''tours bateau'' sur la plage qui te demandent l''argent à l''avance puis ne se présentent pas (paye sur place ou via une agence reconnue). Sur Bantayan et Moalboal c''est globalement sûr."
    },
    {
      "question": "Faut-il réserver les hostels et tours à l''avance ?",
      "answer": "Décembre-février et Pâques : oui, surtout Bantayan et Moalboal qui se remplissent. Le reste de l''année tu peux improviser à 1-2 jours d''avance via Booking, Hostelworld ou directement WhatsApp. Réserve les ferrys (12go.asia, easyway.ph) à 2-3 jours minimum en saison haute."
    },
    {
      "question": "Le wifi est-il correct à Cebu ?",
      "answer": "Cebu City : très bon (fibre dans la plupart des cafés, coworkings type The Company, Acceler8). Moalboal : correct dans les hostels et cafés, faible en bord de plage. Bantayan : médiocre, prends une SIM Globe ou Smart avec data 50GB pour 30 jours (~700 PHP). Malapascua : sketchy, pas d''internet stable, prévois de te déconnecter."
    },
    {
      "question": "Faut-il un visa pour les Philippines ?",
      "answer": "Pour les Français/Belges/Suisses/Canadiens : pas de visa pour les séjours jusqu''à 30 jours. Tu obtiens un tampon à l''arrivée gratuitement. Tu peux étendre à 59 jours puis 6 mois total via le Bureau of Immigration (~3000 PHP par extension). Passeport valide 6 mois minimum. Billet retour ou de continuation demandé à l''embarquement."
    },
    {
      "question": "Combien coûte un vol Manille-Cebu ?",
      "answer": "Cebu Pacific et Philippine Airlines : 2000-4500 PHP A/R (40-90€) si réservé 4-6 semaines à l''avance. Last minute ça monte à 6000-8000 PHP. Vols quotidiens nombreux, durée 1h15. Évite les vols 6h du matin si tu peux : aéroport de Manille est un cauchemar à cette heure (bouchons depuis le centre)."
    },
    {
      "question": "Cebu ou Palawan, lequel choisir si je n''ai qu''une semaine ?",
      "answer": "Palawan pour les paysages de carte postale les plus impressionnants (lagunes El Nido, lacs Coron). Cebu pour la diversité d''activités (sardines, plongée requin, cascades, plages chill) et l''accessibilité. Si c''est ton premier voyage aux Philippines : Palawan. Si tu reviens ou veux une expérience plus locale et moins touristique : Cebu."
    },
    {
      "question": "L''eau du robinet est-elle potable à Cebu ?",
      "answer": "Non, ni à Cebu City ni sur les îles. L''eau du robinet est potentiellement contaminée et a un goût bizarre même quand elle ne te rend pas malade. Achète des bouteilles 5L à 50 PHP en sari-sari store, ou apporte une gourde filtrante (LifeStraw, Grayl). Beaucoup d''hostels ont des fontaines à eau filtrée gratuites — réutilise ta bouteille."
    }
  ]'::jsonb,
  ARRAY['palawan', 'siargao', 'boracay', 'philippines-2-semaines'],
  ARRAY[
    'Aéroport de Mactan-Cebu : prends un Grab, jamais un taxi à prix fixe — économie 50%',
    'Bus Ceres : achète ton billet directement au chauffeur, pas besoin de réserver. Garde toujours de la monnaie (billets 100/50)',
    'Sardine run Moalboal : gratuite, pas besoin de tour. Loue masque/tuba 200 PHP la journée et marche jusqu''à la plage',
    'Whale sharks Oslob : sujet éthique. WWF déconseille. Donsol est l''alternative responsable (mais demande un autre voyage)',
    'GCash est indispensable : active-le avec une SIM Globe ou Smart à l''arrivée (Mactan ou SM Cebu)',
    'Cash : retire au DBP ou BPI, frais ~250 PHP par retrait. Évite les ATM en sari-sari (frais 500 PHP)',
    'Eau du robinet imbuvable. Bouteilles 5L à 50 PHP en sari-sari, ou gourde filtrante',
    'Climatisation des bus surdimensionnée — un sweat ou un sarong est obligatoire',
    'Saison des typhons août-octobre : assurance voyage avec couverture annulation indispensable',
    'Lechon de Cebu (cochon grillé) : la spécialité. House of Lechon ou Rico''s Lechon. Réserve à l''avance',
    'Plongée Malapascua threshers : à Kimud Shoal depuis 2022 (Open Water suffit avec instructeur). Pour Monad Shoal traditionnel 25-30m, Advanced Open Water requis. Plongée à 5h du matin, prévois ton sommeil',
    'Bantayan Island : retire ton cash AVANT d''y aller, peu d''ATM et souvent vides',
    'Tricycles : négocie le prix AVANT de monter. ''How much to X?'' puis confirme. Sinon facture x3 à l''arrivée',
    'San Miguel Light en grande bouteille : 80-100 PHP en sari-sari, 150-200 PHP en bar. Bois en sari-sari quand possible',
    'Saison de Sinulog (3e weekend de janvier) : Cebu City explose, festival immense, hostels x3 prix. Réserve 2 mois avant ou évite'
  ],
  'destination',
  false
)
ON CONFLICT (slug) DO NOTHING;
