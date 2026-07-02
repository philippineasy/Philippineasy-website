'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faLightbulb,
  faHome,
  faChartLine,
  faGraduationCap,
  faSchool,
} from '@fortawesome/free-solid-svg-icons';
import { SectionClientPage } from '@/components/shared/SectionClientPage';

interface Category {
  id: number;
  heroImage: string;
  name: string;
  description: string;
  slug: string;
}

const guides = [
  { href: '/vivre-aux-philippines/travailler/emploi-salarie', icon: faBriefcase, title: 'Trouver un emploi', desc: 'Marché du travail, secteurs qui recrutent, salaires.' },
  { href: '/vivre-aux-philippines/travailler/creer-entreprise', icon: faLightbulb, title: 'Créer son entreprise', desc: 'Statuts, démarches SEC/DTI, restrictions étrangères.' },
  { href: '/vivre-aux-philippines/investir/immobilier', icon: faHome, title: 'Immobilier locatif', desc: 'Investir pour louer : rendements, condos, règles.' },
  { href: '/vivre-aux-philippines/investir/bourse-et-entreprises', icon: faChartLine, title: 'Bourse & entreprises', desc: 'PSE, actions locales, participations en société.' },
  { href: '/vivre-aux-philippines/etudier/universites', icon: faGraduationCap, title: 'Universités', desc: 'Étudier aux Philippines : cursus, admissions, coûts.' },
  { href: '/vivre-aux-philippines/etudier/ecoles-internationales', icon: faSchool, title: 'Écoles internationales', desc: 'Scolariser ses enfants : écoles françaises et internationales.' },
];

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
          src={cat.heroImage || '/imagesHero/nouveau-depart-aux-philippines.webp'}
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
    <SectionClientPage
      initialCategories={initialCategories}
      renderCard={renderCard}
      footer={
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-3 text-center">Guides <span className="text-primary">pratiques</span></h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nos dossiers de fond pour aller plus loin, rédigés pour les francophones.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex items-start gap-4 bg-card rounded-2xl px-5 py-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
              >
                <span
                  className="inline-flex shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
                  style={{ width: '44px', height: '44px', backgroundColor: '#F4F7FE', color: '#3B5BDB' }}
                  aria-hidden="true"
                >
                  <FontAwesomeIcon icon={guide.icon} style={{ fontSize: '18px' }} />
                </span>
                <span>
                  <h3 className="text-foreground mb-1" style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>{guide.title}</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.55 }}>{guide.desc}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      }
    >
      <h1 className="text-4xl font-bold text-center mb-4">Vivre aux <span className="text-primary">Philippines</span></h1>
      <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
        S'installer, travailler, investir... Toutes les clés pour réussir votre projet de vie dans l'archipel.
      </p>

      <div className="pb-10">
        <h2 className="text-3xl font-bold mb-2 text-center">Les 6 sujets <span className="text-primary">clés</span></h2>
        <p className="text-center text-muted-foreground mb-6">Chaque sujet regroupe le guide de référence et tous nos articles.</p>
      </div>
    </SectionClientPage>
  );
};
