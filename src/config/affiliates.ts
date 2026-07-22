// Liens partenaires centralisés — SOURCE UNIQUE pour tout le site.
// Quand un programme d'affiliation est validé, remplacer ICI l'URL nue par le
// lien tracké fourni par le réseau : toutes les pages (partenaires, budget,
// communication, carte-sim, santé, banque…) sont mises à jour d'un coup.
//
// État au 2026-07-22 :
//   - klook  : AFFILIÉ (aid=118789) — géré séparément dans
//              src/components/affiliate/klook-activities-data.ts (deep links par activité).
//   - wise   : AFFILIÉ Partnerize (camref:1011l5L36L, 10€ CPA par 1er transfert particulier).
//   - booking/chapka : à candidater via Awin.
//   - airalo : à candidater via Impact.
//   - nordvpn: candidature CJ en attente (avril) — sinon Impact.
// Tant qu'un lien n'est pas tracké, l'URL nue reste : le site fonctionne,
// simplement sans commission.

export const AFFILIATE_LINKS = {
  /** Transferts d'argent — Partnerize (deep link tracké, redirige vers wise.com/fr/send-money/send-money-to-philippines) */
  wise: 'https://wise.prf.hn/click/camref:1011l5L36L/destination:https%3A%2F%2Fwise.com%2Ffr%2Fsend-money%2Fsend-money-to-philippines',

  /** Hôtels Philippines — Awin (programme Booking.com) */
  booking: 'https://www.booking.com/country/ph.fr.html',

  /** Assurance voyage — Awin (programme Chapka) */
  chapka: 'https://www.chapkadirect.fr/assurance-voyage.html',

  /** eSIM Philippines — Impact (programme Airalo) */
  airalo: 'https://www.airalo.com/philippines-esim',

  /** VPN — CJ ou Impact (programme NordVPN) */
  nordvpn: 'https://nordvpn.com/fr/',
} as const;

export type AffiliatePartner = keyof typeof AFFILIATE_LINKS;
