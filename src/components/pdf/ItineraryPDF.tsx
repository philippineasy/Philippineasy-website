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
  photoUrl?: string;
}

interface Meal {
  restaurant?: string;
  dish?: string;
  cost?: string;
  coordinates?: { lat: number; lng: number };
  google_maps_url?: string;
  google_rating?: number;
  photoUrl?: string;
}

interface Accommodation {
  name?: string;
  type?: string;
  cost?: string;
  coordinates?: { lat: number; lng: number };
  google_maps_url?: string;
  google_rating?: number;
  photoUrl?: string;
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

const DURATION_MAP: Record<string, string> = {
  '3-days': '3 jours', '1-week': '1 semaine', '10-days': '10 jours',
  '2-weeks': '2 semaines', '3-weeks': '3 semaines', '1-month': '1 mois', 'more': '1 mois+',
};

function mapsUrl(coords?: { lat: number; lng: number }) {
  if (!coords?.lat) return null;
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
}

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <Text style={{ fontSize: 8, color: COLORS.accent, fontFamily: 'Helvetica-Bold' }}>
      {rating.toFixed(1)}/5
    </Text>
  );
}

function PlacePhoto({ url }: { url?: string }) {
  if (!url) return null;
  return (
    <Image src={url} style={{ width: 60, height: 40, borderRadius: 4, objectFit: 'cover', marginRight: 8 }} />
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: color }}>
      <View style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: color, marginRight: 6, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 7, color: '#fff', fontFamily: 'Helvetica-Bold' }}>
          {label === 'Transport' ? 'T' : label === 'Programme' ? 'P' : label === 'Restaurants' ? 'R' : 'H'}
        </Text>
      </View>
      <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: COLORS.foreground, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Text>
    </View>
  );
}

function PlaceItem({ label, name, description, time, cost, coordinates, googleMapsUrl, rating, photoUrl }: {
  label?: string; name: string; description?: string; time?: string; cost?: string;
  coordinates?: { lat: number; lng: number }; googleMapsUrl?: string; rating?: number; photoUrl?: string;
}) {
  const mapLink = googleMapsUrl || mapsUrl(coordinates);
  return (
    <View style={styles.placeItem}>
      <PlacePhoto url={photoUrl} />
      <View style={styles.placeContent}>
        {label && <Text style={{ fontSize: 7, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1 }}>{label}</Text>}
        {time && <Text style={styles.placeTime}>{time}</Text>}
        <Text style={styles.placeName}>{name}</Text>
        {description && <Text style={styles.placeDescription}>{description}</Text>}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {cost && <Text style={styles.placeCost}>{cost}</Text>}
          <StarRating rating={rating} />
        </View>
        {mapLink && (
          <Link src={mapLink} style={styles.placeLink}>Voir sur Google Maps</Link>
        )}
      </View>
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
  const durationLabel = DURATION_MAP[duration] || `${itinerary.days.length} jours`;
  const destinations = [...new Set(itinerary.days.map(d => d.location).filter(Boolean))].join(', ');

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        <Text style={styles.coverTitle}>{itinerary.title}</Text>
        <Text style={styles.coverSubtitle}>{itinerary.description}</Text>
        <View style={styles.coverDivider} />
        <View style={styles.coverMeta}>
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaText}>{durationLabel}</Text>
          </View>
          {destinations && (
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaText}>{destinations}</Text>
            </View>
          )}
          <View style={styles.coverMetaItem}>
            <Text style={styles.coverMetaText}>{offerType}</Text>
          </View>
        </View>
        {userName && <Text style={styles.coverName}>Prepare pour {userName}</Text>}
        <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 40 }}>philippineasy.com</Text>
      </View>
    </Page>
  );
}

function DayPage({ day }: { day: Day }) {
  const isAccommodationValid = day.accommodation?.name && day.accommodation.name !== 'N/A' && day.accommodation.name !== 'n/a';

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayNumber}>J{day.day}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.dayTitle}>{day.title || `Jour ${day.day}`}</Text>
          {day.location && <Text style={styles.dayLocation}>{day.location}</Text>}
        </View>
      </View>

      <View style={styles.content}>
        {/* Transport */}
        {day.transport?.method && (
          <>
            <SectionLabel label="Transport" color={COLORS.primary} />
            <PlaceItem
              name={day.transport.method}
              description={day.transport.from && day.transport.to ? `${day.transport.from} → ${day.transport.to}` : undefined}
              cost={day.transport.cost}
            />
          </>
        )}

        {/* Activities */}
        {day.activities && day.activities.length > 0 && (
          <>
            <SectionLabel label="Programme" color={COLORS.accent} />
            {day.activities.map((act, i) => (
              <PlaceItem
                key={i}
                name={act.name}
                description={act.description}
                time={act.time}
                cost={act.cost}
                coordinates={act.coordinates}
                googleMapsUrl={act.google_maps_url}
                rating={act.google_rating}
                photoUrl={act.photoUrl}
              />
            ))}
          </>
        )}

        {/* Meals */}
        {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
          <>
            <SectionLabel label="Restaurants" color="#E67E22" />
            {day.meals?.breakfast?.restaurant && (
              <PlaceItem
                label="Petit-dejeuner"
                name={day.meals.breakfast.restaurant}
                description={day.meals.breakfast.dish}
                cost={day.meals.breakfast.cost}
                coordinates={day.meals.breakfast.coordinates}
                googleMapsUrl={day.meals.breakfast.google_maps_url}
                rating={day.meals.breakfast.google_rating}
                photoUrl={day.meals.breakfast.photoUrl}
              />
            )}
            {day.meals?.lunch?.restaurant && (
              <PlaceItem
                label="Dejeuner"
                name={day.meals.lunch.restaurant}
                description={day.meals.lunch.dish}
                cost={day.meals.lunch.cost}
                coordinates={day.meals.lunch.coordinates}
                googleMapsUrl={day.meals.lunch.google_maps_url}
                rating={day.meals.lunch.google_rating}
                photoUrl={day.meals.lunch.photoUrl}
              />
            )}
            {day.meals?.dinner?.restaurant && (
              <PlaceItem
                label="Diner"
                name={day.meals.dinner.restaurant}
                description={day.meals.dinner.dish}
                cost={day.meals.dinner.cost}
                coordinates={day.meals.dinner.coordinates}
                googleMapsUrl={day.meals.dinner.google_maps_url}
                rating={day.meals.dinner.google_rating}
                photoUrl={day.meals.dinner.photoUrl}
              />
            )}
          </>
        )}

        {/* Accommodation */}
        {isAccommodationValid && (
          <>
            <SectionLabel label="Hebergement" color={COLORS.primaryDark} />
            <PlaceItem
              name={day.accommodation!.name!}
              description={day.accommodation!.type}
              cost={day.accommodation!.cost}
              coordinates={day.accommodation!.coordinates}
              googleMapsUrl={day.accommodation!.google_maps_url}
              rating={day.accommodation!.google_rating}
              photoUrl={day.accommodation!.photoUrl}
            />
          </>
        )}
      </View>

      <PageFooter />
    </Page>
  );
}

function SummaryPage({ itinerary, userName }: { itinerary: ItineraryData; userName?: string }) {
  const allPlaces: { name: string; type: string; url?: string }[] = [];
  for (const day of itinerary.days) {
    if (day.accommodation?.name && day.accommodation.name !== 'N/A') {
      allPlaces.push({
        name: day.accommodation.name,
        type: 'Hebergement',
        url: day.accommodation.google_maps_url || mapsUrl(day.accommodation.coordinates) || undefined,
      });
    }
    for (const mt of ['breakfast', 'lunch', 'dinner'] as const) {
      const meal = day.meals?.[mt];
      if (meal?.restaurant && meal.restaurant !== 'N/A') {
        allPlaces.push({
          name: meal.restaurant,
          type: 'Restaurant',
          url: meal.google_maps_url || mapsUrl(meal.coordinates) || undefined,
        });
      }
    }
  }
  const uniquePlaces = allPlaces.filter((p, i) => allPlaces.findIndex(q => q.name === p.name) === i);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>Recapitulatif</Text>
      </View>

      <View style={styles.content}>
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
