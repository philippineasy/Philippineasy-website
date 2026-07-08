import { StyleSheet } from '@react-pdf/renderer';

// Brand colors (from globals.css HSL values)
export const COLORS = {
  primary: '#4A7FD6',
  primaryDark: '#3566B5',
  accent: '#F0A500',
  accentLight: '#FFF3D6',
  foreground: '#0F172A',
  muted: '#64748B',
  mutedLight: '#F1F5F9',
  white: '#FFFFFF',
  border: '#E2E8F0',
  green: '#16A34A',
  red: '#DC2626',
  starYellow: '#FBBF24',
};

export const styles = StyleSheet.create({
  // Page
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.foreground,
    backgroundColor: COLORS.white,
    // Réserve la zone du footer fixe (position absolute bottom 20) — sans ça
    // le contenu long passe SOUS le footer.
    paddingBottom: 55,
  },

  // Cover
  coverPage: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 60,
    height: '100%',
  },
  coverLogo: {
    width: 120,
    marginBottom: 30,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 1.3,
  },
  coverSubtitle: {
    fontSize: 14,
    color: COLORS.accentLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  coverMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
    maxWidth: 420,
  },
  coverMetaItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  coverMetaText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  coverDivider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.accent,
    marginBottom: 30,
  },
  coverName: {
    fontSize: 13,
    color: COLORS.accentLight,
    textAlign: 'center',
  },

  // Day header
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  dayNumber: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    marginRight: 12,
  },
  dayTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  dayLocation: {
    fontSize: 10,
    color: COLORS.accentLight,
  },

  // Place item
  placeItem: {
    flexDirection: 'row',
    marginBottom: 7,
    paddingBottom: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  placeIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.mutedLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeIconText: {
    fontSize: 14,
  },
  placeContent: {
    flex: 1,
  },
  placeName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.foreground,
    marginBottom: 2,
  },
  placeDescription: {
    fontSize: 9,
    color: COLORS.muted,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  placeLinks: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  placeLink: {
    fontSize: 8,
    color: COLORS.primary,
    textDecoration: 'none',
  },
  placeTime: {
    fontSize: 9,
    color: COLORS.accent,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  placeCost: {
    fontSize: 9,
    color: COLORS.green,
    fontFamily: 'Helvetica-Bold',
  },
  placeRating: {
    fontSize: 8,
    color: COLORS.starYellow,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
  },
  sectionIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.foreground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: COLORS.muted,
  },
  footerLogo: {
    width: 40,
  },
  pageNumber: {
    fontSize: 7,
    color: COLORS.muted,
  },

  // Summary
  summarySection: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.muted,
    width: 100,
  },
  summaryValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.foreground,
    flex: 1,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  tipBullet: {
    fontSize: 10,
    color: COLORS.accent,
    marginRight: 6,
    width: 12,
  },
  tipText: {
    fontSize: 9,
    color: COLORS.foreground,
    flex: 1,
    lineHeight: 1.4,
  },

  // Content padding
  content: {
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 10,
  },
});
