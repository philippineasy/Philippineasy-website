'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel, faSwimmer, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { EditableWrapper } from '@/components/shared/EditableWrapper';
import type { Article } from '@/types';

interface BestDealsSectionProps {
  initialDeals: Article[];
}

interface Category {
  id: number;
}

// A simple function to get an icon based on category slug
const getIconBySlug = (slug: string) => {
  switch (slug) {
    case 'hebergements':
      return faHotel;
    case 'activites-excursions':
      return faSwimmer;
    case 'services-expatries':
      return faShieldAlt;
    default:
      return faHotel;
  }
};

export const BestDealsSection = ({ initialDeals }: BestDealsSectionProps) => {
  const [deals, setDeals] = useState(initialDeals);

  const handleDealUpdate = (updatedDeal: Article) => {
    setDeals(prevDeals =>
      prevDeals.map(deal => (deal.id === updatedDeal.id ? updatedDeal : deal))
    );
  };

  const handleDealReplace = (newDeal: Article) => {
    setDeals(prevDeals => {
      const index = prevDeals.findIndex(deal => deal.id === newDeal.id);
      if (index !== -1) {
        const newDeals = [...prevDeals];
        newDeals[index] = newDeal;
        return newDeals;
      }
      return prevDeals;
    });
  };

  // Helper to get the first paragraph from Editor.js content
  const getSummary = (content: any) => {
    if (typeof content === 'string') {
        try {
            content = JSON.parse(content);
        } catch {
            return content; // return as is if not valid JSON
        }
    }
    const firstParagraph = content?.blocks?.find((block: { type: string; }) => block.type === 'paragraph');
    return firstParagraph?.data?.text || '';
  };

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos <span className="text-primary">Meilleurs Plans</span> du Moment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deals.map(deal => (
            <EditableWrapper key={deal.id} item={deal} type="article" onUpdate={handleDealUpdate} onReplace={handleDealReplace}>
              <div className="plan-card bg-card rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <Image 
                    src={deal.image || 'https://via.placeholder.com/300x200'} 
                    alt={deal.title} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">{deal.title}</h3>
                    {deal.category?.slug && <FontAwesomeIcon icon={getIconBySlug(deal.category.slug)} className="text-primary text-2xl" />}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm flex-grow">{getSummary(deal.content)}</p>
                  <Link href={`/meilleurs-plans/${deal.category.slug}/${deal.slug}`} className="text-primary hover:text-primary/90 font-semibold mt-auto">
                    Voir l'offre →
                  </Link>
                </div>
              </div>
            </EditableWrapper>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/meilleurs-plans" className="inline-block px-6 py-3 bg-primary text-card-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold">
            Découvrir tous les Bons Plans
          </Link>
        </div>
      </div>
    </section>
  );
};
