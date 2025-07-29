'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faGraduationCap, faHandshake, faHome } from '@fortawesome/free-solid-svg-icons';
import { SectionClientPage } from '@/components/shared/SectionClientPage';

interface Category {
  id: number;
  heroImage: string;
  name: string;
  description: string;
  slug: string;
}

export const VivreClientPage = ({ initialCategories }: { initialCategories: Category[] }) => {
  const renderCard = (cat: Category) => (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden feature-card h-full">
      <div className="relative w-full h-48">
        <Image src={cat.heroImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'} alt={cat.name} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
        <p className="text-muted-foreground mb-4">{cat.description}</p>
        <Link href={`/vivre-aux-philippines/${cat.slug}`} className="text-primary hover:text-primary/90 font-semibold">
          En savoir plus →
        </Link>
      </div>
    </div>
  );

  return (
    <SectionClientPage initialCategories={initialCategories} renderCard={renderCard}>
      <h1 className="text-4xl font-bold text-center mb-4">Vivre aux <span className="text-primary">Philippines</span></h1>
      <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
        S'installer, travailler, investir... Toutes les clés pour réussir votre projet de vie dans l'archipel.
      </p>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Thématiques <span className="text-primary">Principales</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/vivre-aux-philippines/s-installer" className="block feature-card bg-card rounded-lg shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <FontAwesomeIcon icon={faHome} className="text-primary text-4xl mb-4" />
            <h3 className="text-xl font-bold mb-3">S'installer</h3>
            <p className="text-muted-foreground">Visas, logement, vie quotidienne.</p>
          </Link>
          <Link href="/vivre-aux-philippines/travailler" className="block feature-card bg-card rounded-lg shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <FontAwesomeIcon icon={faBriefcase} className="text-primary text-4xl mb-4" />
            <h3 className="text-xl font-bold mb-3">Travailler</h3>
            <p className="text-muted-foreground">Marché de l'emploi, création d'entreprise.</p>
          </Link>
          <Link href="/vivre-aux-philippines/investir" className="block feature-card bg-card rounded-lg shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <FontAwesomeIcon icon={faHandshake} className="text-primary text-4xl mb-4" />
            <h3 className="text-xl font-bold mb-3">Investir</h3>
            <p className="text-muted-foreground">Opportunités, immobilier, business.</p>
          </Link>
          <Link href="/vivre-aux-philippines/etudier" className="block feature-card bg-card rounded-lg shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <FontAwesomeIcon icon={faGraduationCap} className="text-primary text-4xl mb-4" />
            <h3 className="text-xl font-bold mb-3">Étudier</h3>
            <p className="text-muted-foreground">Universités, écoles internationales.</p>
          </Link>
        </div>
      </div>

      <div id="destination-details" className="pt-10">
        <h2 className="text-3xl font-bold mb-8 text-center">Nos <span className="text-primary">Dossiers</span></h2>
        <p className="text-center text-muted-foreground mb-8">Explorez nos guides complets pour chaque aspect de la vie aux Philippines.</p>
      </div>
    </SectionClientPage>
  );
};
