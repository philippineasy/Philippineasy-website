import React from 'react';
import { Document, Page, View, Text, Link, Image } from '@react-pdf/renderer';
import { styles, COLORS } from './styles';

interface Activity {
  time?: string;
  name: string;
  description?: string;
  cost?: string;
  coordinates?: { lat: number; lng: number };
  google_maps_url?: string;
  google_rating?: number;
}

interface Meal {
  restaurant?: string;
  dish?: string;
  cost?: string;
  coordinates?: { lat: number; lng: number };
  google_maps_url?: string;
  google_rating?: number;
}

interface Accommodation {
  name?: string;
  type?: string;
  cost?: string;
  coordinates?: { lat: number; lng: number };
  google_maps_url?: string;
  google_rating?: number;
}

interface Day {
  day: number;
  title?: string;
  location?: string;
  activities?: Activity[];
  meals?: { breakfast?: Meal; lunch?: Meal; dinner?: Meal };
  accommodation?: Accommodation;
  transport?: { method?: string; from?: string; to?: string; cost?: string; duration?: string };
}

interface ItineraryData {
  title: string;
  description: string;
  days: Day[];
  tips: string[];
  total_budget: string;
  variant: string;
}

interface PDFProps {
  itinerary: ItineraryData;
  userName?: string;
  duration: string;
  offerType: string;
}

function mapsUrl(coords?: { lat: number; lng: number }) {
  if (!coords?.lat) return null;
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
}

function Stars({ rating }: { rating?: number }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
  return <Text style={styles.placeRating}>{stars} {rating.toFixed(1)}</Text>;
}

function PlaceItem({ icon, name, description, time, cost, coordinates, googleMapsUrl, rating, links }: {
  icon: string; name: string; description?: string; time?: string; cost?: string;
  coordinates?: { lat: number; lng: number }; googleMapsUrl?: string; rating?: number;
  links?: { label: string; url: string }[];
}) {
  const mapLink = googleMapsUrl || mapsUrl(coordinates);
  return (
    <View style={styles.placeItem}>
      <View style={styles.placeIcon}>
        <Text style={styles.placeIconText}>{icon}</Text>
      </View>
      <View style={styles.placeContent}>
        {time && <Text style={styles.placeTime}>{time}</Text>}
        <Text style={styles.placeName}>{name}</Text>
        {description && <Text style={styles.placeDescription}>{description}</Text>}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {cost && <Text style={styles.placeCost}>{cost}</Text>}
          <Stars rating={rating} />
        </View>
        <View style={styles.placeLinks}>
          {mapLink && <Link src={mapLink} style={styles.placeLink}>Voir sur Google Maps</Link>}
          {links?.map((l, i) => <Link key={i} src={l.url} style={styles.placeLink}>{l.label}</Link>)}
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function PageFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>Philippineasy — Votre voyage sur mesure aux Philippines</Text>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

function CoverPage({ itinerary, userName, duration, offerType }: PDFProps) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        <Image src="/logo-philippineasy.png" style={styles.coverLogo} />
        <Text style={styles.coverTitle}>{itinerary.title}</Text>
        <Text style={styles.coverSubtitle}>{itinerary.description}</Text>
        <View style={styles.coverDivider} />
        <View style={styles.coverMeta}>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaText}>{itinerary.days.length} jours</Text>
          </View>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaText}>{duration}</Text>
          </View>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaText}>{offerType}</Text>
          </View>
        </View>
        {userName && <Text style={styles.coverName}>Prepare pour {userName}</Text>}
      </View>
    </Page>
  );
}

function DayPage({ day }: { day: Day }) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Day header */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayNumber}>J{day.day}</Text>
        <View>
          <Text style={styles.dayTitle}>{day.title || `Jour ${day.day}`}</Text>
          {day.location && <Text style={styles.dayLocation}>{day.location}</Text>}
        </View>
      </View>

      <View style={styles.content}>
        {/* Transport */}
        {day.transport?.method && (
          <>
            <SectionHeader icon="🚌" title="Transport" />
            <PlaceItem
              icon="🚌"
              name={day.transport.method}
              description={day.transport.from && day.transport.to ? `${day.transport.from} → ${day.transport.to}` : undefined}
              cost={day.transport.cost}
            />
          </>
        )}

        {/* Activities */}
        {day.activities && day.activities.length > 0 && (
          <>
            <SectionHeader icon="🎯" title="Programme" />
            {day.activities.map((act, i) => (
              <PlaceItem
                key={i}
                icon="📍"
                name={act.name}
                description={act.description}
                time={act.time}
                cost={act.cost}
                coordinates={act.coordinates}
                googleMapsUrl={act.google_maps_url}
                rating={act.google_rating}
              />
            ))}
          </>
        )}

        {/* Meals */}
        {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
          <>
            <SectionHeader icon="🍽" title="Restaurants" />
            {day.meals?.breakfast?.restaurant && (
              <PlaceItem
                icon="☀"
                name={day.meals.breakfast.restaurant}
                description={day.meals.breakfast.dish}
                cost={day.meals.breakfast.cost}
                coordinates={day.meals.breakfast.coordinates}
                googleMapsUrl={day.meals.breakfast.google_maps_url}
                rating={day.meals.breakfast.google_rating}
              />
            )}
            {day.meals?.lunch?.restaurant && (
              <PlaceItem
                icon="🌤"
                name={day.meals.lunch.restaurant}
                description={day.meals.lunch.dish}
                cost={day.meals.lunch.cost}
                coordinates={day.meals.lunch.coordinates}
                googleMapsUrl={day.meals.lunch.google_maps_url}
                rating={day.meals.lunch.google_rating}
              />
            )}
            {day.meals?.dinner?.restaurant && (
              <PlaceItem
                icon="🌙"
                name={day.meals.dinner.restaurant}
                description={day.meals.dinner.dish}
                cost={day.meals.dinner.cost}
                coordinates={day.meals.dinner.coordinates}
                googleMapsUrl={day.meals.dinner.google_maps_url}
                rating={day.meals.dinner.google_rating}
              />
            )}
          </>
        )}

        {/* Accommodation */}
        {day.accommodation?.name && (
          <>
            <SectionHeader icon="🏨" title="Hebergement" />
            <PlaceItem
              icon="🏨"
              name={day.accommodation.name}
              description={day.accommodation.type}
              cost={day.accommodation.cost}
              coordinates={day.accommodation.coordinates}
              googleMapsUrl={day.accommodation.google_maps_url}
              rating={day.accommodation.google_rating}
            />
          </>
        )}
      </View>

      <PageFooter />
    </Page>
  );
}

function SummaryPage({ itinerary, userName }: { itinerary: ItineraryData; userName?: string }) {
  // Collect all unique places for the directory
  const allPlaces: { name: string; type: string; url?: string }[] = [];
  for (const day of itinerary.days) {
    if (day.accommodation?.name) {
      allPlaces.push({
        name: day.accommodation.name,
        type: 'Hebergement',
        url: day.accommodation.google_maps_url || mapsUrl(day.accommodation.coordinates) || undefined,
      });
    }
    for (const mt of ['breakfast', 'lunch', 'dinner'] as const) {
      const meal = day.meals?.[mt];
      if (meal?.restaurant) {
        allPlaces.push({
          name: meal.restaurant,
          type: 'Restaurant',
          url: meal.google_maps_url || mapsUrl(meal.coordinates) || undefined,
        });
      }
    }
  }

  // Deduplicate
  const uniquePlaces = allPlaces.filter((p, i) => allPlaces.findIndex(q => q.name === p.name) === i);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>Recapitulatif</Text>
      </View>

      <View style={styles.content}>
        {/* Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Votre voyage en resume</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duree</Text>
            <Text style={styles.summaryValue}>{itinerary.days.length} jours</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Destinations</Text>
            <Text style={styles.summaryValue}>
              {[...new Set(itinerary.days.map(d => d.location).filter(Boolean))].join(', ') || 'Philippines'}
            </Text>
          </View>
          {itinerary.total_budget && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Budget estime</Text>
              <Text style={styles.summaryValue}>{itinerary.total_budget}</Text>
            </View>
          )}
        </View>

        {/* Tips */}
        {itinerary.tips.length > 0 && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Conseils pratiques</Text>
            {itinerary.tips.map((tip, i) => (
              <View key={i} style={styles.tipItem}>
                <Text style={styles.tipBullet}>{i + 1}.</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Places directory */}
        {uniquePlaces.length > 0 && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Annuaire des etablissements</Text>
            {uniquePlaces.map((place, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 4, alignItems: 'center' }}>
                <Text style={{ fontSize: 8, color: COLORS.muted, width: 80 }}>{place.type}</Text>
                {place.url ? (
                  <Link src={place.url} style={{ fontSize: 9, color: COLORS.primary, textDecoration: 'none' }}>{place.name}</Link>
                ) : (
                  <Text style={{ fontSize: 9, color: COLORS.foreground }}>{place.name}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Thank you */}
        <View style={{ marginTop: 30, padding: 20, backgroundColor: COLORS.mutedLight, borderRadius: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: COLORS.primary, marginBottom: 6 }}>
            Merci{userName ? ` ${userName}` : ''} !
          </Text>
          <Text style={{ fontSize: 10, color: COLORS.muted, textAlign: 'center', lineHeight: 1.5 }}>
            Nous vous souhaitons un merveilleux voyage aux Philippines.{'\n'}
            Pour toute question, contactez-nous sur philippineasy.com
          </Text>
        </View>
      </View>

      <PageFooter />
    </Page>
  );
}

export function ItineraryPDF({ itinerary, userName, duration, offerType }: PDFProps) {
  return (
    <Document
      title={`Philippineasy - ${itinerary.title}`}
      author="Philippineasy"
      subject="Itineraire de voyage aux Philippines"
    >
      <CoverPage itinerary={itinerary} userName={userName} duration={duration} offerType={offerType} />
      {itinerary.days.map((day) => (
        <DayPage key={day.day} day={day} />
      ))}
      <SummaryPage itinerary={itinerary} userName={userName} />
    </Document>
  );
}
