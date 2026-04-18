'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SectionClientPage } from '@/components/shared/SectionClientPage';
import slugify from 'slugify';

interface Destination {
  id: number;
  heroImage: string;
  name: string;
  description: string;
  slug: string;
}

interface PracticalTip {
  icon: IconDefinition;
  title: string;
  text: string;
  link?: string;
  linkText?: string;
}

export const VoyagerClientPage = ({ initialDestinations, practicalTips }: { initialDestinations: Destination[], practicalTips: PracticalTip[] }) => {
  return (
    <SectionClientPage
      initialCategories={initialDestinations}
      renderCard={(dest: Destination) => (
        <Link
          href={`/voyager-aux-philippines/${dest.slug}`}
          className="group bg-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          style={{
            border: '0.5px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <div className="relative w-full h-[180px] overflow-hidden">
            <Image
              src={dest.heroImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
              alt={dest.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1">
            <h3
              className="text-foreground mb-2"
              style={{
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
              }}
            >
              {dest.name}
            </h3>
            <p
              className="mb-4 flex-1 line-clamp-3"
              style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55 }}
            >
              {dest.description}
            </p>
            <span
              className="inline-flex items-center gap-1 text-primary text-sm font-medium"
              aria-hidden="true"
            >
              Explorer {dest.name}
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </Link>
      )}
    >
      <h1 className="text-4xl font-bold text-center mb-4">Voyager aux <span className="text-accent">Philippines</span></h1>
      <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
        Explorez la beauté et la diversité de l'archipel, des plages de rêve aux volcans majestueux.
      </p>

      <div
        className="mb-16 bg-card rounded-2xl p-6 md:p-8"
        style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ letterSpacing: '-0.02em' }}>Destinations <span className="text-accent">Incontournables</span></h2>
        <div className="flex flex-wrap -mx-4 items-center">
          <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
            <div className="relative w-full h-auto" style={{ aspectRatio: '1.5/1' }}>
              <Image 
                src="/images/voyager/iles-philippines-aeriennes.webp" 
                alt="Plage Philippines" 
                fill 
                className="rounded-lg shadow-lg object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <div>
              <h3 className="text-2xl font-bold mb-4">Un archipel aux mille visages</h3>
              <p className="text-muted-foreground mb-6">
                Des plages paradisiaques de Palawan aux rizières en terrasse de Banaue, en passant par le surf à Siargao ou la vie urbaine de Manille, les Philippines offrent une diversité incroyable.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-accent mr-2" /><span>Palawan (El Nido, Coron)</span></div>
                <div className="flex items-center"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-accent mr-2" /><span>Visayas (Cebu, Bohol, Siquijor)</span></div>
                <div className="flex items-center"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-accent mr-2" /><span>Siargao</span></div>
                <div className="flex items-center"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-accent mr-2" /><span>Boracay</span></div>
                <div className="flex items-center"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-accent mr-2" /><span>Luzon Nord (Banaue, Sagada)</span></div>
                <div className="flex items-center"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-accent mr-2" /><span>Manille</span></div>
              </div>
              <Link href="#destination-details" className="inline-block px-5 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/90 transition duration-300">
                Explorer par île
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Conseils Pratiques pour <span className="text-accent">Voyager</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {practicalTips.map((tip, index) => (
            <Link
              key={index}
              href={tip.link || '#'}
              className="group bg-card rounded-2xl p-6 flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
            >
              <span
                className="inline-flex items-center justify-center rounded-xl mb-4"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#FEF3C7',
                  color: '#F59E0B',
                }}
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={tip.icon} style={{ fontSize: '20px' }} />
              </span>
              <h3 className="text-foreground mb-2" style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                {tip.title}
              </h3>
              <p className="flex-1" style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55 }}>
                {tip.text}
              </p>
              {tip.linkText && (
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3" aria-hidden="true">
                  {tip.linkText}
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div id="destination-details" className="pt-10">
        <h2 className="text-3xl font-bold mb-8 text-center">Explorez les <span className="text-accent">Régions</span></h2>
        <p className="text-center text-muted-foreground mb-8">Cliquez sur une région pour découvrir ses trésors.</p>
      </div>
    </SectionClientPage>
  );
};
