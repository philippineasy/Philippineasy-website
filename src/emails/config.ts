// ---------------------------------------------------------------------------
// Email system configuration — Philippineasy
// ---------------------------------------------------------------------------

export const BRAND = {
  primaryBlue: '#4A7FD6',
  accentOrange: '#F5A623',
  background: '#F1F5F9',
  cardBg: '#FFFFFF',
  footerBg: '#F8FAFC',
  text: '#0F172A',
  muted: '#64748B',
  mutedLight: '#94A3B8',
  border: '#E2E8F0',
  success: '#2CB67D',
  error: '#EF4444',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://philippineasy.com',
  siteName: "Philippin'Easy",
  logoUrl: 'https://philippineasy.com/logo-512.png',
} as const;

export const EMAIL_FROM = {
  bienvenue: `Philippin'Easy <bienvenue@philippineasy.com>`,
  contact: `Philippin'Easy <contact@philippineasy.com>`,
  commandes: `Philippin'Easy <commandes@philippineasy.com>`,
  communaute: `Philippin'Easy Communaute <communaute@philippineasy.com>`,
  newsletter: `Philippin'Easy <newsletter@philippineasy.com>`,
  equipe: `Equipe Philippin'Easy <equipe@philippineasy.com>`,
  itineraire: `Philippin'Easy <itineraire@philippineasy.com>`,
  noreply: `Philippin'Easy <noreply@philippineasy.com>`,
} as const;

export type EmailFromKey = keyof typeof EMAIL_FROM;
