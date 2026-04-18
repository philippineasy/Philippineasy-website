'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditableWrapper } from '@/components/shared/EditableWrapper';
import { KlookCarousel } from '@/components/affiliate/KlookCarousel';
import {
  palawanActivities,
  cebuActivities,
  siargaoActivities,
} from '@/components/affiliate/klook-activities-data';
import type { Article } from '@/types';

interface BestDealsSectionProps {
  initialDeals: Article[];
}

// Curated mix: top activities across the 3 flagship destinations
const homepageActivities = [
  palawanActivities[0],
  cebuActivities[0],
  siargaoActivities[0],
  palawanActivities[1],
  cebuActivities[1],
  siargaoActivities[1],
].filter(Boolean);

const getSummary = (content: unknown): string => {
  let parsed = content;
  if (typeof content === 'string') {
    try {
      parsed = JSON.parse(content);
    } catch {
      return content;
    }
  }
  const blocks = (parsed as { blocks?: Array<{ type: string; data?: { text?: string } }> })?.blocks;
  return blocks?.find((b) => b.type === 'paragraph')?.data?.text || '';
};

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

export const BestDealsSection = ({ initialDeals }: BestDealsSectionProps) => {
  const [deals, setDeals] = useState(initialDeals);

  const handleDealUpdate = (updatedDeal: Article) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d))
    );
  };

  const handleDealReplace = (newDeal: Article) => {
    setDeals((prev) => {
      const index = prev.findIndex((d) => d.id === newDeal.id);
      if (index !== -1) {
        const next = [...prev];
        next[index] = newDeal;
        return next;
      }
      return prev;
    });
  };

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Nos <span className="text-accent">meilleurs plans</span> du moment
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Hébergements, activités, services — nos sélections pour voyageurs
            et expatriés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {deals.map((deal) => (
            <EditableWrapper
              key={deal.id}
              item={deal}
              type="article"
              onUpdate={handleDealUpdate}
              onReplace={handleDealReplace}
            >
              <Link
                href={`/meilleurs-plans/${deal.category.slug}/${deal.slug}`}
                className="group bg-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  border: '0.5px solid #e5e7eb',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                }}
              >
                <div className="relative h-[180px] overflow-hidden">
                  {deal.image ? (
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-soft-blue" />
                  )}
                </div>
                <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1">
                  {deal.category?.name && (
                    <span
                      className="inline-flex items-center self-start mb-2.5 px-2 py-0.5 rounded"
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: '#F59E0B',
                        backgroundColor: '#FEF3C7',
                      }}
                    >
                      {deal.category.name}
                    </span>
                  )}
                  <h3
                    className="text-foreground mb-2"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.35,
                    }}
                  >
                    {deal.title}
                  </h3>
                  <p
                    className="mb-4 flex-1 line-clamp-3"
                    style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55 }}
                  >
                    {stripHtml(getSummary(deal.content))}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-primary text-sm font-medium"
                    aria-hidden="true"
                  >
                    Voir l&apos;offre
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </EditableWrapper>
          ))}
        </div>

        <div className="mt-10 max-w-md mx-auto">
          <Link
            href="/meilleurs-plans"
            className="group flex items-center gap-4 bg-card rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              border: '0.5px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <span
              className="flex-shrink-0 inline-flex items-center justify-center rounded-xl"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#FEF3C7',
                color: '#F59E0B',
              }}
              aria-hidden="true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </span>
            <span className="flex-1 min-w-0">
              <span
                className="block text-foreground"
                style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                Tous les bons plans
              </span>
              <span
                className="block mt-0.5"
                style={{ fontSize: '12px', color: '#64748b' }}
              >
                Hébergements, services &amp; offres partenaires.
              </span>
            </span>
            <span
              className="flex-shrink-0 text-primary text-sm transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        {/* Klook affiliate carousel — activités à réserver */}
        <div className="max-w-6xl mx-auto mt-20">
          <KlookCarousel
            activities={homepageActivities}
            destination="homepage"
            title="Activités à réserver aux Philippines"
            subtitle="Nos expériences favorites à Palawan, Cebu et Siargao — réservation en 2 clics."
          />
        </div>
      </div>
    </section>
  );
};
