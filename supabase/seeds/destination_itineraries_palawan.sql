-- Seed Palawan : exemple skeleton pour valider le pipeline programmatique BLOC 6.2
-- Contenu PROVISOIRE — Hugo doit reecrire l'intro, l'itineraire jour/jour, FAQ avec contenu unique terrain
-- Une fois Hugo a relu et complete : passer published = true

INSERT INTO destination_itineraries (
  slug, name, hero_image, hero_image_alt,
  meta_title, meta_description,
  intro_text,
  recommended_days, best_season, how_to_get_there,
  budget_backpacker, budget_midrange, budget_luxury,
  itinerary, faq, related_destinations, practical_tips,
  category, published
) VALUES (
  'palawan',
  'Palawan',
  '/imagesHero/comment-voyager-aux-philippines.webp',
  'Lagune turquoise et karst calcaire de Palawan',
  'Itinéraire Palawan : Guide Jour par Jour (2026) — Philippineasy',
  'Découvrez notre itinéraire Palawan complet : El Nido, Coron, Puerto Princesa. Planning jour par jour, budget et conseils d''un expatrié français.',
  'Palawan est régulièrement élue plus belle île du monde, et ce n''est pas pour rien. Entre les lagons turquoise d''El Nido, les épaves japonaises de Coron et la rivière souterraine UNESCO de Puerto Princesa, l''île concentre certains des plus beaux paysages des Philippines. Cet itinéraire de 7 jours combine les trois zones incontournables avec un rythme soutenu mais réaliste, basé sur notre expérience terrain et celle de plus de 10 000 voyageurs accompagnés depuis 2020. [TODO Hugo : reecrire avec ton ton perso et ajouter anecdote terrain]',
  7,
  'Novembre à Mai (saison sèche)',
  'Vol direct Manille → Puerto Princesa (1h30) ou Manille → Busuanga/Coron (1h)',
  35,
  70,
  180,
  '[
    {
      "day": 1,
      "title": "Arrivée à Puerto Princesa",
      "activities": [
        {
          "name": "Rivière souterraine UNESCO",
          "description": "Excursion à la rivière souterraine de Puerto Princesa, classée UNESCO. Réservation impérative via l''hôtel.",
          "duration": "Demi-journée",
          "cost": "1500 PHP (~25€)"
        }
      ],
      "transport": "Transfert aéroport (van privé ~500 PHP)",
      "accommodation": "Hôtel Puerto Princesa centre — 1500-3000 PHP/nuit",
      "meals": "Dîner au Kinabuch''s Grill & Bar (cuisine locale + bières)"
    },
    {
      "day": 2,
      "title": "Trajet vers El Nido",
      "activities": [
        {
          "name": "Van Puerto Princesa → El Nido",
          "description": "Trajet 5-6h sur route panoramique. Privilégier départ matinal pour profiter du coucher de soleil à l''arrivée.",
          "duration": "5-6h",
          "cost": "600-800 PHP"
        }
      ],
      "accommodation": "Casa Kalaw ou Spin Designer Hostel — 1500-3500 PHP",
      "meals": "Dîner sur la plage de Bacuit Bay"
    },
    {
      "day": 3,
      "title": "El Nido — Tour A (Lagunes)",
      "activities": [
        {
          "name": "Big Lagoon, Small Lagoon, Secret Lagoon",
          "description": "Le tour le plus emblématique. Kayak dans les lagunes encaissées, snorkeling à 7 Commandos Beach.",
          "duration": "Journée complète",
          "cost": "1400 PHP (~25€) repas inclus"
        }
      ]
    },
    {
      "day": 4,
      "title": "El Nido — Tour C (Plages)",
      "activities": [
        {
          "name": "Hidden Beach, Helicopter Island, Matinloc Shrine",
          "description": "Plages cachées et snorkeling sur des récifs préservés. Souvent moins fréquenté que le Tour A.",
          "duration": "Journée complète",
          "cost": "1400 PHP"
        }
      ]
    },
    {
      "day": 5,
      "title": "Ferry El Nido → Coron",
      "activities": [
        {
          "name": "Ferry rapide Atienza ou Montenegro Lines",
          "description": "Traversée 4h en mer ouverte. Réserver à l''avance en haute saison.",
          "duration": "4h",
          "cost": "1800 PHP (~30€)"
        }
      ],
      "accommodation": "Coron centre — Two Seasons ou Sea Dive Resort"
    },
    {
      "day": 6,
      "title": "Coron — Island hopping ultime",
      "activities": [
        {
          "name": "Twin Lagoon, Kayangan Lake, Barracuda Lake",
          "description": "Les lacs cristallins de Coron, parmi les plus beaux d''Asie. Eau d''une transparence irréelle.",
          "duration": "Journée complète",
          "cost": "1500-2500 PHP selon le tour"
        }
      ]
    },
    {
      "day": 7,
      "title": "Coron — Plongée sur épaves japonaises",
      "activities": [
        {
          "name": "Wreck diving WWII",
          "description": "Plongée sur 11 épaves japonaises de la Seconde Guerre mondiale. Site mondialement reconnu.",
          "duration": "Demi-journée à journée",
          "cost": "4500-6500 PHP (PADI requis)"
        }
      ],
      "transport": "Vol Coron → Manille (1h)"
    }
  ]'::jsonb,
  '[
    {
      "question": "Combien de jours faut-il pour visiter Palawan ?",
      "answer": "7 jours est le minimum pour combiner Puerto Princesa, El Nido et Coron sans courir. 10 jours est l''idéal si vous voulez plus de temps de plage et de plongée."
    },
    {
      "question": "Quelle est la meilleure saison pour Palawan ?",
      "answer": "De novembre à mai (saison sèche). Janvier-mars sont les mois les plus secs et les moins ventés. Évitez juillet-octobre (typhons possibles)."
    },
    {
      "question": "Quel budget prévoir pour Palawan ?",
      "answer": "Backpacker : ~35€/jour. Mid-range : ~70€/jour. Luxe : 180€+/jour. Ces budgets incluent hébergement, repas, transport et activités."
    },
    {
      "question": "Faut-il privilégier El Nido ou Coron ?",
      "answer": "Les deux ! El Nido pour les lagunes karstiques iconiques. Coron pour la plongée sur épaves et les lacs cristallins. Si vous devez choisir, El Nido est plus accessible aux non-plongeurs."
    },
    {
      "question": "Comment se déplacer entre Puerto Princesa, El Nido et Coron ?",
      "answer": "Van Puerto Princesa → El Nido (5-6h). Ferry El Nido → Coron (4h, mer agitée parfois). Vol Coron → Manille (1h). Évitez les vans de nuit pour la sécurité."
    }
  ]'::jsonb,
  ARRAY['cebu', 'siargao', 'philippines-2-semaines'],
  ARRAY[
    'Réservez les vols domestiques 4-6 semaines à l''avance, surtout en haute saison',
    'L''eau du robinet n''est pas potable. Achetez des bouteilles ou apportez un filtre LifeStraw',
    'GCash est l''app de paiement mobile dominante. Activez-la avec un numéro philippin (SIM Globe ou Smart)',
    'Les pourboires ne sont pas obligatoires mais 10% est apprécié au restaurant',
    'Apportez du cash : beaucoup d''hôtels et tours d''îles n''acceptent pas la carte'
  ],
  'destination',
  false
)
ON CONFLICT (slug) DO NOTHING;
