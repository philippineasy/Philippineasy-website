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
        <div className="bg-card rounded-lg shadow-lg overflow-hidden feature-card h-full">
          <div className="relative w-full h-48">
            <Image src={dest.heroImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'} alt={dest.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
            <p className="text-muted-foreground mb-4">{dest.description}</p>
            <Link href={`/voyager-aux-philippines/${dest.slug}`} className="text-primary hover:text-primary/90 font-semibold">
              Explorer {dest.name} →
            </Link>
          </div>
        </div>
      )}
    >
      <h1 className="text-4xl font-bold text-center mb-4">Voyager aux <span className="text-accent">Philippines</span></h1>
      <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
        Explorez la beauté et la diversité de l'archipel, des plages de rêve aux volcans majestueux.
      </p>

      <div className="mb-16 bg-card p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Destinations <span className="text-accent">Incontournables</span></h2>
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
            <Link key={index} href={tip.link || '#'} className="block feature-card bg-card rounded-lg shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-accent text-4xl mb-4"><FontAwesomeIcon icon={tip.icon} /></div>
              <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
              <p className="text-muted-foreground">{tip.text}</p>
              {tip.linkText && (
                <span className="text-primary hover:text-primary/90 font-semibold mt-2 inline-block">
                  {tip.linkText}
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
