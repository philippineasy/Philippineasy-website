'use client';

import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Lock, BedDouble, UtensilsCrossed, Bus, ArrowDown } from 'lucide-react';
import { PlacePhoto } from './PlacePhoto';

interface SampleActivity {
  time?: string;
  name: string;
  description?: string;
  cost?: string;
}

interface SampleMeal {
  restaurant?: string;
  dish?: string;
  cost?: string;
}

interface SampleDay {
  day: number;
  title?: string;
  location?: string;
  transport?: { method?: string; from?: string; to?: string; cost?: string; duration?: string };
  activities?: SampleActivity[];
  meals?: { breakfast?: SampleMeal; lunch?: SampleMeal; dinner?: SampleMeal };
  accommodation?: { name?: string; type?: string; cost?: string };
}

interface RoutePlanStep { day: number; location: string }

interface SampleDayPreviewProps {
  variantTitle: string;
  sampleDay: SampleDay;
  routePlan: RoutePlanStep[];
}

const microLabel: CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'hsl(var(--muted-foreground))',
};

const MEAL_LABELS: Record<'breakfast' | 'lunch' | 'dinner', string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
};

// Jour 1 de l'itinéraire sélectionné, montré EN ENTIER comme preuve de
// qualité avant paiement, suivi du plan de route verrouillé (jours 2..N).
// L'aperçu une-ligne ne suffisait pas à prouver la valeur du produit :
// 71 % des utilisateurs quittaient après les previews (audit 2026-07-08).
export function SampleDayPreview({ variantTitle, sampleDay, routePlan }: SampleDayPreviewProps) {
  const lockedDays = routePlan.filter((s) => s.day > 1);
  const meals = sampleDay.meals || {};
  const mealEntries = (['breakfast', 'lunch', 'dinner'] as const)
    .map((key) => ({ key, meal: meals[key] }))
    .filter((m): m is { key: 'breakfast' | 'lunch' | 'dinner'; meal: SampleMeal } => !!m.meal?.restaurant);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-10"
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-foreground">Votre jour 1, en entier</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Extrait réel de « {variantTitle} » — chaque jour débloqué a ce niveau de détail.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        {/* En-tête du jour */}
        <div className="flex items-center gap-3 border-b border-border bg-primary/[0.06] px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-[15px] font-bold text-primary-foreground">
            J1
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-foreground">
              {sampleDay.title || 'Jour 1'}
            </p>
            {sampleDay.location && (
              <p className="flex items-center gap-1 text-[12.5px] text-muted-foreground">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {sampleDay.location}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-5 p-5">
          {/* Transport */}
          {sampleDay.transport?.method && (
            <div>
              <p className="mb-2" style={microLabel}>Transport</p>
              <div className="flex items-start gap-2.5 text-[13.5px] text-foreground/85">
                <Bus className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p>
                  <span className="font-medium">{sampleDay.transport.method}</span>
                  {sampleDay.transport.from && sampleDay.transport.to && (
                    <> — {sampleDay.transport.from} → {sampleDay.transport.to}</>
                  )}
                  {sampleDay.transport.duration && <> · {sampleDay.transport.duration}</>}
                  {sampleDay.transport.cost && (
                    <span className="text-muted-foreground"> · {sampleDay.transport.cost}</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Programme — vraies photos Google Places : le lieu existe, on le montre */}
          {(sampleDay.activities?.length ?? 0) > 0 && (
            <div>
              <p className="mb-2" style={microLabel}>Programme</p>
              <ul className="space-y-3">
                {sampleDay.activities!.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <PlacePhoto
                      name={act.name}
                      searchQuery={`${act.name} ${sampleDay.location || ''} Philippines`}
                      className="h-14 w-14 shrink-0 rounded-xl"
                      fallbackIcon={<MapPin className="h-4 w-4 text-muted-foreground/30" aria-hidden="true" />}
                    />
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-2 text-[13.5px] font-medium leading-snug text-foreground">
                        <span className="inline-flex h-5 items-center gap-1 rounded-md bg-primary/10 px-1.5 text-[10.5px] font-semibold tabular-nums text-primary">
                          <Clock className="h-2.5 w-2.5" aria-hidden="true" />
                          {act.time || '—'}
                        </span>
                        {act.name}
                        {act.cost && (
                          <span className="font-normal text-muted-foreground">{act.cost}</span>
                        )}
                      </p>
                      {act.description && (
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{act.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Repas */}
          {mealEntries.length > 0 && (
            <div>
              <p className="mb-2" style={microLabel}>Restaurants</p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {mealEntries.map(({ key, meal }) => (
                  <div key={key} className="rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                      <UtensilsCrossed className="h-3 w-3" aria-hidden="true" />
                      {MEAL_LABELS[key]}
                    </p>
                    <p className="mt-1 text-[13px] font-medium leading-snug text-foreground">{meal.restaurant}</p>
                    {(meal.dish || meal.cost) && (
                      <p className="text-[12px] text-muted-foreground">
                        {meal.dish}{meal.dish && meal.cost ? ' · ' : ''}{meal.cost}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hébergement */}
          {sampleDay.accommodation?.name && (
            <div>
              <p className="mb-2" style={microLabel}>Hébergement</p>
              <div className="flex items-start gap-3">
                <PlacePhoto
                  name={sampleDay.accommodation.name}
                  searchQuery={`${sampleDay.accommodation.name} ${sampleDay.location || ''} Philippines`}
                  className="h-14 w-14 shrink-0 rounded-xl"
                  fallbackIcon={<BedDouble className="h-4 w-4 text-muted-foreground/30" aria-hidden="true" />}
                />
                <p className="pt-1 text-[13.5px] text-foreground/85">
                  <span className="font-medium">{sampleDay.accommodation.name}</span>
                  {sampleDay.accommodation.type && (
                    <span className="text-muted-foreground"> · {sampleDay.accommodation.type}</span>
                  )}
                  {sampleDay.accommodation.cost && (
                    <span className="text-muted-foreground"> · {sampleDay.accommodation.cost}</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Jours verrouillés — le plan de route est réel, le détail est payant */}
        {lockedDays.length > 0 && (
          <div className="relative border-t border-border">
            <div className="space-y-0 px-5 py-4">
              {lockedDays.slice(0, 4).map((step) => (
                <div
                  key={step.day}
                  className="flex items-center gap-3 border-b border-dashed border-border/60 py-2.5 last:border-b-0"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold text-muted-foreground">
                    J{step.day}
                  </span>
                  <span className="text-[13px] font-medium text-foreground/70">{step.location}</span>
                  <span className="ml-auto flex items-center gap-1.5 select-none text-[12px] text-muted-foreground/80 blur-[3px]" aria-hidden="true">
                    Programme, restaurants, hébergement
                  </span>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
                </div>
              ))}
            </div>
            {lockedDays.length > 4 && (
              <p className="px-5 pb-4 text-[12.5px] text-muted-foreground">
                + {lockedDays.length - 4} autres jours détaillés jusqu&apos;au retour
              </p>
            )}
            <div className="border-t border-border bg-muted/30 px-5 py-3.5 text-center">
              <a
                href="#offer-selection"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                Débloquer les {lockedDays.length + 1} jours en détail
              </a>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
