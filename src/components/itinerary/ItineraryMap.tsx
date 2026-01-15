'use client';

import { useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

// Types
export interface MapPoint {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'accommodation' | 'activity' | 'beach';
  coordinates: { lat: number; lng: number };
  day: number;
  period: string;
}

interface ItineraryMapProps {
  points: MapPoint[];
  selectedPointId?: string | null;
  onPointClick?: (pointId: string) => void;
  className?: string;
}

// Couleurs par type
const MARKER_COLORS: Record<string, string> = {
  attraction: '#1e40af', // bleu
  activity: '#1e40af',
  beach: '#0891b2', // cyan
  restaurant: '#ea580c', // orange
  accommodation: '#16a34a', // vert
};

// Icone personnalisee pour les marqueurs
const createCustomIcon = (type: string, index: number, isSelected: boolean) => {
  const color = MARKER_COLORS[type] || '#1e40af';
  const size = isSelected ? 40 : 32;
  const fontSize = isSelected ? 14 : 12;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${fontSize}px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
        ${isSelected ? 'transform: translate(-50%, -50%) scale(1.2);' : ''}
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Composant Map interne (client-side only)
function MapContent({ points, selectedPointId, onPointClick, className }: ItineraryMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Calculer le centre et les bounds
  const { center, bounds } = useMemo(() => {
    if (points.length === 0) {
      // Centre par defaut sur les Philippines
      return {
        center: { lat: 12.8797, lng: 121.7740 } as L.LatLngExpression,
        bounds: null,
      };
    }

    const lats = points.map((p) => p.coordinates.lat);
    const lngs = points.map((p) => p.coordinates.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return {
      center: [(minLat + maxLat) / 2, (minLng + maxLng) / 2] as L.LatLngExpression,
      bounds: L.latLngBounds([minLat, minLng], [maxLat, maxLng]),
    };
  }, [points]);

  useEffect(() => {
    // Initialiser la carte
    if (!mapRef.current) {
      const map = L.map('itinerary-map', {
        center: center,
        zoom: 10,
        scrollWheelZoom: true,
      });

      // Ajouter la couche OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center]);

  // Mettre a jour les marqueurs
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs
    points.forEach((point, index) => {
      const isSelected = point.id === selectedPointId;
      const icon = createCustomIcon(point.type, index, isSelected);

      const marker = L.marker([point.coordinates.lat, point.coordinates.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 150px;">
            <strong>${point.name}</strong><br/>
            <span style="color: #666; font-size: 12px;">Jour ${point.day} - ${getPeriodLabel(point.period)}</span>
          </div>
        `);

      marker.on('click', () => {
        if (onPointClick) {
          onPointClick(point.id);
        }
      });

      markersRef.current.push(marker);
    });

    // Ajouter le trace (polyline)
    if (points.length > 1) {
      const coordinates = points.map((p) => [p.coordinates.lat, p.coordinates.lng] as L.LatLngTuple);
      const polyline = L.polyline(coordinates, {
        color: '#1e40af',
        weight: 3,
        opacity: 0.6,
        dashArray: '10, 10',
      }).addTo(map);

      // Stocker la polyline pour pouvoir la supprimer
      markersRef.current.push(polyline as unknown as L.Marker);
    }

    // Ajuster la vue pour englober tous les points
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, selectedPointId, bounds, onPointClick]);

  // Centrer sur le point selectionne
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPointId) return;

    const selectedPoint = points.find((p) => p.id === selectedPointId);
    if (selectedPoint) {
      map.setView([selectedPoint.coordinates.lat, selectedPoint.coordinates.lng], 14, {
        animate: true,
      });
    }
  }, [selectedPointId, points]);

  return (
    <div
      id="itinerary-map"
      className={`w-full h-[400px] rounded-xl overflow-hidden border-2 border-primary/20 relative z-0 ${className || ''}`}
    />
  );
}

// Helper pour les labels de periode
function getPeriodLabel(period: string): string {
  const labels: Record<string, string> = {
    morning: 'Matin',
    lunch: 'Dejeuner',
    afternoon: 'Apres-midi',
    dinner: 'Diner',
    accommodation: 'Hebergement',
  };
  return labels[period] || period;
}

// Export avec dynamic import pour eviter les erreurs SSR
const ItineraryMap = dynamic(() => Promise.resolve(MapContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-xl bg-gray-100 flex items-center justify-center border-2 border-primary/20">
      <div className="text-muted-foreground">Chargement de la carte...</div>
    </div>
  ),
});

export default ItineraryMap;
