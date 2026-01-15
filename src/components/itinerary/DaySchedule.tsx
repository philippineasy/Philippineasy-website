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
        className={`p-4 rounded-lg transition-all duration-200 ${
          isHighlighted ? 'bg-primary/10 ring-2 ring-primary' : 'bg-gray-50 hover:bg-gray-100'
        }`}
        onMouseEnter={() => onElementHover?.(elementId)}
        onMouseLeave={() => onElementHover?.(null)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* En-tete de l'element */}
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={period.icon} className={`${period.color} w-4 h-4`} />
              <span className="text-sm text-muted-foreground">{period.label}</span>
            </div>

            {/* Nom */}
            <h4 className="font-semibold text-lg text-foreground">{element.name}</h4>

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
    <div className="border-2 border-primary/20 rounded-xl overflow-hidden">
      {/* Header du jour */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-primary/5 border-l-4 border-primary flex items-center justify-between hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
            Jour {day.day}
          </span>
          <span className="font-semibold text-primary">{day.location}</span>
          {day.date && (
            <span className="text-sm text-muted-foreground">({day.date})</span>
          )}
        </div>
        <FontAwesomeIcon
          icon={isExpanded ? faChevronUp : faChevronDown}
          className="text-primary w-4 h-4"
        />
      </button>

      {/* Contenu du jour */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {PERIODS.map((period) => {
            const element = day[period.key as keyof DayData] as ElementData | undefined;
            return renderElement(period, element);
          })}
        </div>
      )}
    </div>
  );
}
