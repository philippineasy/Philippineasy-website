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
    <Link
      href={`/vivre-aux-philippines/${cat.slug}`}
      className="group bg-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        border: '0.5px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <div className="relative w-full h-[180px] overflow-hidden">
        <Image
          src={cat.heroImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
          alt={cat.name}
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
          {cat.name}
        </h3>
        <p
          className="mb-4 flex-1 line-clamp-3"
          style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55 }}
        >
          {cat.description}
        </p>
        <span
          className="inline-flex items-center gap-1 text-primary text-sm font-medium"
          aria-hidden="true"
        >
          En savoir plus
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );

  return (
    <SectionClientPage initialCategories={initialCategories} renderCard={renderCard}>
      <h1 className="text-4xl font-bold text-center mb-4">Vivre aux <span className="text-primary">Philippines</span></h1>
      <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
        S'installer, travailler, investir... Toutes les clés pour réussir votre projet de vie dans l'archipel.
      </p>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Thématiques <span className="text-primary">Principales</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { href: '/vivre-aux-philippines/s-installer', icon: faHome, title: "S'installer", desc: 'Visas, logement, vie quotidienne.' },
            { href: '/vivre-aux-philippines/travailler', icon: faBriefcase, title: 'Travailler', desc: "Marché de l'emploi, création d'entreprise." },
            { href: '/vivre-aux-philippines/investir', icon: faHandshake, title: 'Investir', desc: 'Opportunités, immobilier, business.' },
            { href: '/vivre-aux-philippines/etudier', icon: faGraduationCap, title: 'Étudier', desc: 'Universités, écoles internationales.' },
          ].map((theme) => (
            <Link
              key={theme.href}
              href={theme.href}
              className="group flex flex-col items-center text-center bg-card rounded-2xl px-5 py-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
            >
              <span
                className="inline-flex items-center justify-center rounded-xl mb-3 transition-transform duration-200 group-hover:scale-105"
                style={{ width: '48px', height: '48px', backgroundColor: '#F4F7FE', color: '#3B5BDB' }}
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={theme.icon} style={{ fontSize: '20px' }} />
              </span>
              <h3 className="text-foreground mb-1.5" style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em' }}>{theme.title}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.55 }}>{theme.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div id="destination-details" className="pt-10">
        <h2 className="text-3xl font-bold mb-8 text-center">Nos <span className="text-primary">Dossiers</span></h2>
        <p className="text-center text-muted-foreground mb-8">Explorez nos guides complets pour chaque aspect de la vie aux Philippines.</p>
      </div>
    </SectionClientPage>
  );
};
