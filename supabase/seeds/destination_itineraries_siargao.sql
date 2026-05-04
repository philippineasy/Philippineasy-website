-- Seed Siargao : itineraire backpacker 7 jours, surf capital + digital nomad vibe
-- Couverture SEO : "siargao", "que faire siargao", "siargao surf"
-- Volume estime FR : 300-800/mois
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
  'siargao',
  'Siargao',
  '/imagesHero/siargao-surf-philippines.webp',
  'Plage de Cloud 9 à Siargao, capitale du surf des Philippines',
  'Itinéraire Siargao : 7 Jours Surf (2026) — Philippineasy',
  'Itinéraire Siargao 7 jours : Cloud 9, Magpupungko, island hopping, vie de digital nomad. Hostels, scooter, food. Guide francophone backpacker 2026.',
  'Siargao, c''est la plus petite des grandes îles philippines mais probablement celle avec le caractère le plus marqué. Une île en forme de larme, posée à l''est de Mindanao, où on est arrivé pour la première fois en 2019 — et où on retourne au moins une fois par an depuis. Pourquoi ? Parce qu''ici, tout fonctionne à l''envers du reste du pays. Pas de jeepney qui klaxonnent, pas de mall, pas de touristes en T-shirt all-inclusive. À la place : des cocotiers à perte de vue, une seule route principale (le ''boulevard'' qui relie General Luna à Cloud 9), des hostels en bambou, des cafés-coworking où des freelances de Berlin ou Sydney bossent en short, et la meilleure scène food des Philippines hors Manille.

Le surf, c''est l''ADN. Cloud 9 est mondialement réputée pour sa droite tubulaire — pas pour les débutants. Mais Siargao a aussi Quiksilver, Jacking Horse, Stimpy''s : des spots pour tous les niveaux. Septembre à novembre = saison la plus puissante (compétition internationale Siargao Cup en septembre). Mai-juillet = swell régulier, eau chaude, parfait pour apprendre. Décembre à avril c''est plus calme, plus chill — le bon moment si tu viens pour la vibe et pas pour ripper.

Cet itinéraire 7 jours est pensé pour un voyageur jeune (mais pas que), curieux, qui veut goûter au surf, faire l''island hopping iconique Naked/Daku/Guyam, explorer en scooter les rock pools de Magpupungko, et vivre la nightlife de General Luna. On a accompagné plus de 10 000 voyageurs depuis 2020 et Siargao revient comme la destination ''coup de cœur surprise'' la plus citée. Tu restes libre de réserver tes vols et hébergements où tu veux — on te donne ce qu''on connaît et qui marche.',
  7,
  'Mai à Novembre (saison de surf, septembre = pic). Décembre à Avril : météo plus calme, moins de vagues, plus chill',
  'Vol direct Manille → Sayak Airport (Siargao) avec Cebu Pacific et Philippine Airlines, 1h45, ~70-100€ A/R si réservé 1 mois avant. Aussi accessible Cebu → Siargao (1h, vols quotidiens). Possible en ferry depuis Surigao (Mindanao, 2h30) si déjà sur place',
  35,
  75,
  200,
  '[
    {
      "day": 1,
      "title": "Arrivée Sayak Airport — installation General Luna",
      "activities": [
        {
          "name": "Transfert aéroport → General Luna",
          "description": "Sayak est un mini aéroport au nord-ouest de l''île. Tu sors, tu négocies un van partagé avec d''autres voyageurs (300 PHP/personne, 45 min de route) ou tricycle privé (1500 PHP). General Luna (''GL'' pour les locaux) est LE village surf au sud-est. La route traverse l''île par le centre, entre les cocotiers — déjà tu sens que tu n''es pas dans un autre Boracay.",
          "duration": "45 min",
          "cost": "300-1500 PHP"
        },
        {
          "name": "Repérage du village + location scooter",
          "description": "Loue un scooter le jour 1, c''est obligatoire ici : 350-500 PHP/jour selon la saison. Demande à ton hostel, ils ont tous des partenariats. Permis international demandé en théorie (rarement contrôlé). Casque obligatoire. Si tu n''as jamais conduit de scooter, fais 30 min sur le parking avant de te lancer sur la route — la circulation est calme mais les routes ont des trous.",
          "duration": "1h",
          "cost": "350-500 PHP/jour"
        },
        {
          "name": "Coucher de soleil Cloud 9 + premier dîner",
          "description": "Direction Cloud 9 (10 min en scooter depuis GL). Tu marches sur le boardwalk en bois jusqu''à la tour d''observation. Si c''est saison de surf, tu vois les locaux ripper sur la droite mythique. Sinon c''est juste une plage sauvage à couper le souffle. Coucher de soleil derrière les cocotiers vers 17h30. Dîner ensuite chez Kermit (oui, Kermit), le restau italien fondateur de la scène food de Siargao — pizzas au feu de bois, 380-500 PHP. Réserve, c''est plein tous les soirs.",
          "duration": "3h",
          "cost": "500-800 PHP"
        }
      ],
      "transport": "Van partagé puis scooter",
      "accommodation": "Bravo Beach Resort (chambre 1800 PHP) ou Harana Surf Resort (dortoir 800 PHP, l''ambiance backpacker la plus populaire) ou Lampara Boutique Hostel (1500 PHP)",
      "meals": "Snack en route, dîner Kermit ou alternative Bulan Villas Asian Bistro (asiat moderne, 400 PHP)"
    },
    {
      "day": 2,
      "title": "Première leçon de surf + Magpupungko Rock Pools",
      "activities": [
        {
          "name": "Cours de surf débutant à Jacking Horse",
          "description": "Jacking Horse, c''est le spot de référence pour apprendre — vagues gentilles, fond de sable, eau peu profonde. Cours de 1h30 avec instructeur philippin certifié : 800-1200 PHP planche + instructeur inclus. Demande à Harana ou directement aux écoles sur la plage (Tuason Surf Academy, Lapu Lapu Surf School). Si tu surfes déjà, location planche seule 400-600 PHP la session. Idéal le matin (mer plus glassy).",
          "duration": "1h30 + 1h dans l''eau",
          "cost": "1000 PHP cours"
        },
        {
          "name": "Magpupungko Rock Pools (à marée basse)",
          "description": "Magpupungko c''est une rangée de piscines naturelles taillées dans le rocher, accessibles SEULEMENT à marée basse. Ton hostel a un calendrier des marées — vérifie avant de partir. 45 min de scooter au nord de GL via Pilar (route entre cocotiers et rizières, splendide). Entrée 50 PHP. Tu marches sur les rochers jusqu''aux pools, tu te baignes dans une eau turquoise transparente, tu sautes dans la grande piscine (4-5m). À marée haute c''est juste de la mer, ça vaut zéro.",
          "duration": "Demi-journée",
          "cost": "50 PHP entrée + essence scooter ~150 PHP"
        },
        {
          "name": "Dîner Bravo + bar coucher de soleil Reggae Bar",
          "description": "Retour GL pour dîner au Bravo (poisson grillé 350 PHP, ambiance familiale) ou Shaka Café (smoothie bowls, kombucha — c''est l''adresse healthy de l''île). Soir : Reggae Bar à Cloud 9 ou Sapian Bar (live music certains soirs). Bières à 100 PHP. Vibe relax, pas de Ibiza.",
          "duration": "3h",
          "cost": "500-800 PHP"
        }
      ],
      "transport": "Scooter",
      "accommodation": "Harana Surf Resort (2e nuit)",
      "meals": "Petit-déj hostel ou Café Loka (œufs brouillés sur sourdough 280 PHP, oui c''est ça la scène food ici), déjeuner sandwich snack à Magpupungko, dîner Bravo"
    },
    {
      "day": 3,
      "title": "Island hopping Naked/Daku/Guyam — le must-do",
      "activities": [
        {
          "name": "Tour bateau 3 îles : Naked, Daku, Guyam",
          "description": "Le tour iconique de Siargao. Naked Island = sandbar minuscule sans aucune végétation, juste du sable blanc et de l''océan turquoise (cliché Instagram total mais sincèrement magnifique). Daku Island = plus grande, cocotiers, déjeuner barbecue inclus, hamacs. Guyam Island = la plus jolie, palmiers penchés, snorkeling sympa. Tour départ 8h30 depuis GL Boulevard, retour 16h. Prix : 1500 PHP/personne avec déjeuner inclus si tu prends un tour groupé via ton hostel ou directement sur le port. Bateau privé 4000-5000 PHP négociable.",
          "duration": "Journée complète 8h-16h",
          "cost": "1500 PHP/personne tour groupé"
        },
        {
          "name": "Conseil maximisation",
          "description": "Réserve la veille via ton hostel. Apporte serviette, crème solaire reef-safe (les autres tuent les coraux), masque/tuba si tu en as, petite étanche pour ton phone. Naked Island est BRÛLANT à midi (zéro ombre), couvre-toi. Sur Daku, achète des fruits frais aux locaux (mangue/pastèque ~50 PHP).",
          "duration": "N/A",
          "cost": "Inclus"
        },
        {
          "name": "Retour + dîner street food au Boardwalk",
          "description": "Retour à GL vers 16h. Massage (350-500 PHP/h, des dizaines de salons en bord de route). Dîner street food au Boardwalk de Cloud 9 ou GL : grilled liempo (poitrine de porc 150 PHP), barbecue squid 200 PHP, pancit canton 100 PHP. Authentique et bon marché.",
          "duration": "2h",
          "cost": "300-500 PHP"
        }
      ],
      "transport": "Bateau (depuis port GL)",
      "accommodation": "Harana Surf Resort (3e nuit)",
      "meals": "Petit-déj hostel, déjeuner BBQ inclus sur Daku, dîner street food"
    },
    {
      "day": 4,
      "title": "Tour nord : Sugba Lagoon + Sohoton Cove",
      "activities": [
        {
          "name": "Sugba Lagoon (Del Carmen)",
          "description": "Sugba, c''est une lagune turquoise entourée de mangrove, à 1h30 de scooter depuis GL (route correcte mais quelques tronçons cassés). Tu arrives à Del Carmen, tu prends un bateau local (500 PHP/groupe pour 1h aller-retour) qui t''emmène sur la lagune. Sur place : plateforme avec un saut de 5m dans une eau turquoise, kayak (200 PHP/h), paddle, juste te baigner. Plus tranquille en semaine. Entrée 50 PHP. Si tu veux moins de scooter, des tours groupés (1500 PHP) font le combo Sugba + Maasin River + cocotier de la mort à 12h.",
          "duration": "Demi-journée",
          "cost": "800-1500 PHP"
        },
        {
          "name": "Maasin River + ''cocotier penché''",
          "description": "Sur la route du retour, arrête-toi à Maasin River, où un cocotier mythique se penche au-dessus de la rivière (c''est LE spot Instagram cliché de Siargao). 30 PHP entrée, 50 PHP location bouée. Pas une activité en soi mais ça vaut 1h sur le chemin.",
          "duration": "1h",
          "cost": "80 PHP"
        },
        {
          "name": "Dîner Lobo + after au Cabaña",
          "description": "Lobo Siargao : un des restaurants au top de l''île, tapas espagnols revisités philippin, tartare poulpe à 480 PHP, jamón à 380 PHP. Compte 800-1200 PHP/personne avec une bouteille de vin. Réservation conseillée. After : Cabaña Surf Bar à Cloud 9, le bar à pieds dans le sable, cocktails 300 PHP.",
          "duration": "3h",
          "cost": "1000-1500 PHP"
        }
      ],
      "transport": "Scooter (longue route, fais le plein avant)",
      "accommodation": "Harana Surf Resort (4e nuit)",
      "meals": "Petit-déj hostel, déjeuner local Del Carmen (300 PHP), dîner Lobo"
    },
    {
      "day": 5,
      "title": "Surf serieux + journée digital nomad",
      "activities": [
        {
          "name": "Surf intermédiaire à Stimpy''s ou Quiksilver",
          "description": "Si tu progresses, sors de Jacking Horse et passe à Stimpy''s ou Quiksilver (vagues plus puissantes, fond de récif, pas pour débutants). Location planche 600-800 PHP, prends une heure avec un local (500 PHP) qui te montre où entrer/sortir — important parce que les récifs ne pardonnent pas. Saison juin-novembre = vrais swells. Hors saison : conditions minimum mais surfables.",
          "duration": "2-3h",
          "cost": "1000-1500 PHP"
        },
        {
          "name": "Journée coworking + chill",
          "description": "Siargao est devenue une vraie destination digital nomad. Coworking Lampara (300 PHP/jour, café/eau inclus), Café Loka (4G fibre, prises partout), Shaka. Wifi 30-50 Mbps en moyenne, suffisant pour calls Zoom ou dev. Si tu travailles, c''est ici. Sinon : journée farniente sur la plage de Tuason Point ou Pacifico (à 30 min de GL, plage moins fréquentée).",
          "duration": "Le reste de la journée",
          "cost": "300-500 PHP"
        },
        {
          "name": "Soirée Bravo Sundowner ou Sun Roof",
          "description": "Coucher de soleil au Bravo (rooftop, cocktails 250 PHP) ou au Sun Roof (vue panoramique GL, ambiance lounge). Soir : si tu cherches la fête, Reggae Bar fait des soirées thématiques jeudi/samedi. Sinon : marché de nuit GL le mercredi (street food + artisans).",
          "duration": "Soirée",
          "cost": "500-1000 PHP"
        }
      ],
      "transport": "Scooter",
      "accommodation": "Harana ou switch vers Bravo Beach Resort si tu veux upgrade (1800 PHP)",
      "meals": "Petit-déj Loka, déjeuner Mama''s Grill (chicken inasal 250 PHP), dîner Mamak Siargao (Malay-Indien fusion, 400 PHP)"
    },
    {
      "day": 6,
      "title": "Pacifico Beach + cascade Tak-Tak",
      "activities": [
        {
          "name": "Route nord vers Pacifico",
          "description": "1h de scooter au nord, route entre cocotiers et rizières, on s''arrête tous les 5 km pour photographier. Pacifico Beach est moins développée que GL, plus sauvage, sable doré, vagues parfaites pour intermédiaires. Quelques cafés cools (Pacifico Coffee Shop, Bay-ang). 50 PHP entrée plage. Tu peux louer une planche sur place (500 PHP).",
          "duration": "Matinée",
          "cost": "200 PHP"
        },
        {
          "name": "Tak-Tak Falls",
          "description": "Cascade de 30m de haut au cœur de la jungle, accessible par un chemin de 10 min. 50 PHP entrée. Eau froide, baignade possible dans le bassin. Pas un must absolu mais une bonne activité midi pour s''éloigner de la plage. Combine avec déjeuner local au village d''à côté.",
          "duration": "1-2h",
          "cost": "100 PHP avec déjeuner"
        },
        {
          "name": "Dernière soirée — choix mode",
          "description": "Si tu veux fête : Reggae Bar puis after sur la plage avec les locaux. Si tu veux dîner mémorable : Hawaiian Poke ou Bulan Villas. Si tu veux tranquille : tasse de chocolat tablea (cacao local) au coucher de soleil, lit tôt parce que demain réveil avion.",
          "duration": "Soirée",
          "cost": "500-1500 PHP selon mode"
        }
      ],
      "transport": "Scooter",
      "accommodation": "Hostel (5e nuit)",
      "meals": "Petit-déj plage, déjeuner Pacifico Coffee Shop (350 PHP), dîner selon humeur"
    },
    {
      "day": 7,
      "title": "Matinée chill + vol retour",
      "activities": [
        {
          "name": "Dernière baignade Cloud 9 ou massage",
          "description": "Selon ton heure de vol : dernière baignade Cloud 9 au lever du jour (vers 6h30, lumière magique), massage 1h (400 PHP), petit-déj smoothie bowl à Loka. Achète quelques souvenirs locaux : Siargao Coffee, miel local, sucre de coco (artisans dans GL).",
          "duration": "2-3h",
          "cost": "500-1000 PHP"
        },
        {
          "name": "Transfert aéroport Sayak",
          "description": "Réserve ton transfert la veille via l''hostel (300-500 PHP partagé). Compte 1h porte à porte. Sayak est minuscule — arrive 1h30 avant le vol et c''est large. Cebu Pacific et Philippine Airlines opèrent les vols vers Manille et Cebu.",
          "duration": "1h",
          "cost": "300-500 PHP"
        }
      ],
      "transport": "Van partagé vers Sayak",
      "accommodation": "Vol retour ou prochaine destination",
      "meals": "Petit-déj final, snacks à l''aéroport (limités, prends de quoi grignoter)"
    }
  ]'::jsonb,
  '[
    {
      "question": "Combien de jours faut-il pour Siargao ?",
      "answer": "7 jours est le minimum pour faire le tour de l''île correctement. 10-14 jours si tu veux apprendre le surf sérieusement, profiter de la vie nomade, faire toutes les plages secondaires (Pacifico, Burgos, Alegria). Beaucoup de voyageurs prévoient 5 jours et finissent par rester 3 semaines — c''est une île qui scotche."
    },
    {
      "question": "Quelle est la meilleure saison pour Siargao ?",
      "answer": "Pour le surf : juin à novembre (septembre = pic, Siargao Cup). Pour la vibe chill et météo douce : décembre à avril (moins de vagues mais soleil et eau chaude). Évite le typhon Odette qui a ravagé l''île en décembre 2021 — l''île s''est reconstruite mais reste exposée aux typhons saison août-octobre."
    },
    {
      "question": "Faut-il savoir surfer pour aller à Siargao ?",
      "answer": "Pas du tout. Jacking Horse est un spot débutant idéal (fond de sable, vagues gentilles), des dizaines d''écoles donnent des cours à 800-1200 PHP. Tu peux apprendre les bases en 3-4 sessions. Et si tu ne veux pas surfer du tout, l''île offre island hopping, scooter, food, lagunes, jungle. Le surf est central mais pas obligatoire."
    },
    {
      "question": "Quel budget backpacker à Siargao ?",
      "answer": "Compte 35-45€/jour en mode backpacker : dortoir 700-1000 PHP (12-17€), 3 repas 600-800 PHP (10-13€), scooter 400 PHP (7€), 1 activité ou cours surf 800-1500 PHP (14-25€). Siargao est un peu plus cher que la moyenne philippine à cause de l''isolement (transport coûte plus, produits importés)."
    },
    {
      "question": "Le scooter est-il obligatoire à Siargao ?",
      "answer": "Quasi obligatoire pour profiter. L''île fait 80km de long, les sites sont dispersés (Magpupungko, Sugba, Pacifico, Cloud 9 sont tous à 30-90 min en scooter de GL). Sans scooter tu dépends des tricycles (chers) ou des tours groupés (moins de liberté). Loue dès le jour 1, 350-500 PHP/jour. Permis international demandé en théorie."
    },
    {
      "question": "Peut-on aller à Siargao depuis Cebu ?",
      "answer": "Oui, vols directs Cebu → Sayak (Siargao) avec Cebu Pacific et Philippine Airlines, 1h, ~50€ A/R réservé tôt. Vols quotidiens. C''est même plus pratique que de passer par Manille pour beaucoup d''itinéraires. Alternative : ferry Cebu → Surigao (12h, 1200 PHP) puis ferry court Surigao → Dapa (Siargao, 2h30, 500 PHP) — long et lent, à éviter sauf budget extrême."
    },
    {
      "question": "Quels scams éviter à Siargao ?",
      "answer": "L''île reste très safe et locale, pas de gros scams. Petites arnaques classiques : tricycles qui annoncent un prix puis demandent plus à l''arrivée (négocie ET confirme avant), location scooter qui te facture des dégâts inexistants au retour (prends des photos détaillées avant de partir, vidéo si possible), tour bateau qui demandent paiement intégral à l''avance puis ne se présentent pas (paye à l''embarquement)."
    },
    {
      "question": "Wifi à Siargao : suffisant pour télétravailler ?",
      "answer": "Oui, c''est devenu une vraie destination digital nomad. Coworking Lampara, Café Loka, Shaka : 30-50 Mbps en moyenne, suffisant pour calls Zoom et dev. Hostels : variable, demande avant de réserver. Hors GL/Cloud 9 (à Pacifico ou nord de l''île) : ça devient sketchy. Achète une SIM Globe ou Smart en arrivant (Mactan ou aéroport Manille), forfait 50GB pour 30 jours ~700 PHP."
    },
    {
      "question": "Faut-il réserver les hostels à l''avance ?",
      "answer": "Septembre (Siargao Cup) et décembre-janvier : oui, l''île se remplit, prix x2-3. Réserve 4-6 semaines avant. Reste de l''année : 1 semaine d''avance suffit, voire walk-in possible. Les meilleurs hostels (Harana, Lampara, Bravo) tournent à plein dès la saison de surf — réserve si tu veux y être."
    },
    {
      "question": "Combien coûte un cours de surf à Siargao ?",
      "answer": "800-1200 PHP (14-20€) pour 1h30 avec instructeur certifié et planche fournie. Tuason Surf Academy, Lapu Lapu Surf School, Harana Academy sont les références. Pack 5 cours : ~5000 PHP. Location planche seule : 400-600 PHP la session. Compétition correcte avec d''autres destinations surf comme Bali."
    },
    {
      "question": "Faut-il éviter Siargao pendant la saison des typhons ?",
      "answer": "Le typhon Odette de décembre 2021 a détruit 80% des structures. L''île s''est reconstruite mais reste géographiquement exposée. Septembre-novembre c''est la pleine saison de surf MAIS aussi le pic typhon. Garde une assurance voyage avec annulation/évacuation. Suis PAGASA (météo locale) avant de réserver. Janvier-mai = saison la plus stable météo."
    },
    {
      "question": "Siargao ou Cebu/Palawan : lequel choisir ?",
      "answer": "Siargao pour : surf, vibe digital nomad/jeune, food scene, ambiance posée. Palawan pour : paysages les plus spectaculaires, plages cinématographiques, lagunes. Cebu pour : diversité d''activités (sardines, plongée, cascades, multiple îles). Si tu as 2 semaines : combine deux des trois (Palawan + Siargao est un super combo)."
    }
  ]'::jsonb,
  ARRAY['palawan', 'cebu', 'boracay', 'philippines-2-semaines'],
  ARRAY[
    'Loue ton scooter dès le jour 1 — quasi obligatoire pour profiter (350-500 PHP/jour)',
    'Permis international demandé en théorie pour le scooter, contrôlé rarement mais ton assurance voyage l''exige en cas d''accident',
    'Photographie ton scooter à la location (toutes les rayures, en détail) — anti-arnaque dégâts au retour',
    'Magpupungko Rock Pools : visite à marée BASSE uniquement. Vérifie le calendrier des marées avant de partir',
    'Crème solaire reef-safe obligatoire (les autres tuent les coraux). Achète chez Lola Cooks ou Shaka',
    'Cloud 9 : pas pour débutants. Va à Jacking Horse pour apprendre, fond de sable',
    'Saison typhon août-octobre : assurance voyage avec annulation INDISPENSABLE',
    'Cash : retire à GL avant de partir explorer — peu d''ATM ailleurs sur l''île, et souvent vides',
    'GCash fonctionne dans la plupart des cafés et restos GL',
    'SIM mobile : Globe couvre mieux que Smart à Siargao. Forfait 50GB ~700 PHP',
    'Évite la pleine saison de surf (septembre) si tu n''es pas surfer — île blindée, prix gonflés',
    'Réserve la Siargao Cup (sept) ou les fêtes (décembre) 2 mois minimum à l''avance',
    'Boardwalk de Cloud 9 : check les horaires de marée pour les meilleures vagues',
    'Eau du robinet imbuvable. Bouteilles 5L à 50 PHP, gourde filtrante recommandée',
    'Vol Manille-Sayak : réserve 1 mois avant pour 70-100€ A/R, last minute monte vite à 200€'
  ],
  'destination',
  false
)
ON CONFLICT (slug) DO NOTHING;
