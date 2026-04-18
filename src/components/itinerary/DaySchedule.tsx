'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faUtensils,
  faCloudSun,
  faMoon,
  faHotel,
  faChevronDown,
  faChevronUp,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import ModifyButton from './ModifyButton';

// Types pour les donnees d'une journee
export interface ElementData {
  name: string;
  type?: string;
  description?: string;
  cuisine?: string;
  priceRange?: string;
  coordinates?: { lat: number; lng: number };
  duration?: string;
  tips?: string[];
  specialties?: string[];
  amenities?: string[];
}

export interface DayData {
  day: number;
  date?: string;
  location: string;
  morning?: ElementData;
  lunch?: ElementData;
  afternoon?: ElementData;
  dinner?: ElementData;
  accommodation?: ElementData;
}

interface DayScheduleProps {
  day: DayData;
  dayNumber: number;
  canModify: boolean;
  modificationsRemaining: number;
  offerType: string;
  onModifyClick: (elementId: string, elementType: string, elementName: string) => void;
  onElementHover?: (elementId: string | null) => void;
  highlightedElementId?: string | null;
}

// Configuration des periodes
const PERIODS = [
  { key: 'morning', label: 'Matin', icon: faSun, color: 'text-yellow-500' },
  { key: 'lunch', label: 'Dejeuner', icon: faUtensils, color: 'text-orange-500' },
  { key: 'afternoon', label: 'Apres-midi', icon: faCloudSun, color: 'text-blue-400' },
  { key: 'dinner', label: 'Diner', icon: faMoon, color: 'text-indigo-500' },
  { key: 'accommodation', label: 'Hebergement', icon: faHotel, color: 'text-green-500' },
] as const;

export default function DaySchedule({
  day,
  dayNumber,
  canModify,
  modificationsRemaining,
  offerType,
  onModifyClick,
  onElementHover,
  highlightedElementId,
}: DayScheduleProps) {
  const [isExpanded, setIsExpanded] = useState(dayNumber === 1);

  const generateElementId = (period: string) => `day-${day.day}-${period}`;

  const renderElement = (
    period: typeof PERIODS[number],
    element: ElementData | undefined
  ) => {
    if (!element) return null;

    const elementId = generateElementId(period.key);
    const isHighlighted = highlightedElementId === elementId;

    return (
      <div
        key={period.key}
        id={elementId}
        className="p-4 rounded-xl transition-all duration-200 bg-card hover:-translate-y-0.5 hover:shadow-md"
        style={{
          border: isHighlighted ? '1.5px solid #3B5BDB' : '0.5px solid #e5e7eb',
          boxShadow: isHighlighted
            ? '0 4px 12px rgba(59,91,219,0.12)'
            : '0 1px 2px rgba(0,0,0,0.03)',
        }}
        onMouseEnter={() => onElementHover?.(elementId)}
        onMouseLeave={() => onElementHover?.(null)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-2" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8' }}>
              <FontAwesomeIcon icon={period.icon} className={`${period.color} w-3 h-3`} />
              <span>{period.label}</span>
            </div>

            <h4 className="text-foreground" style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{element.name}</h4>

            {/* Type ou cuisine */}
            {(element.type || element.cuisine) && (
              <p className="text-sm text-muted-foreground mt-1">
                {element.type || element.cuisine}
                {element.priceRange && ` - ${element.priceRange}`}
              </p>
            )}

            {/* Description */}
            {element.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {element.description}
              </p>
            )}

            {/* Duree */}
            {element.duration && (
              <p className="text-xs text-muted-foreground mt-2">
                Duree : {element.duration}
              </p>
            )}

            {/* Coordonnees */}
            {element.coordinates && (
              <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                <span>
                  {element.coordinates.lat.toFixed(4)}, {element.coordinates.lng.toFixed(4)}
                </span>
              </div>
            )}

            {/* Tips ou specialites */}
            {element.tips && element.tips.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">Conseils :</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {element.tips.slice(0, 2).map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bouton modifier */}
          <ModifyButton
            elementId={elementId}
            elementType={period.key}
            canModify={canModify}
            modificationsRemaining={modificationsRemaining}
            offerType={offerType}
            onClick={() => onModifyClick(elementId, period.key, element.name)}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden"
      style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between transition-colors hover:bg-soft-blue"
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center rounded-full tabular-nums"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: '#3B5BDB',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {day.day}
          </span>
          <span
            className="text-foreground"
            style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            {day.location}
          </span>
          {day.date && (
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>· {day.date}</span>
          )}
        </div>
        <FontAwesomeIcon
          icon={isExpanded ? faChevronUp : faChevronDown}
          style={{ color: '#94a3b8', fontSize: '12px' }}
        />
      </button>

      {isExpanded && (
        <div className="px-5 pt-1 pb-5 space-y-3" style={{ borderTop: '0.5px solid #f1f5f9' }}>
          <div className="h-1" />
          {PERIODS.map((period) => {
            const element = day[period.key as keyof DayData] as ElementData | undefined;
            return renderElement(period, element);
          })}
        </div>
      )}
    </div>
  );
}
