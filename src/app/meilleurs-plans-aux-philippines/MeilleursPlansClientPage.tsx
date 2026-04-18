'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { SectionClientPage } from '@/components/shared/SectionClientPage';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface Category {
  id: number;
  heroImage: string;
  name: string;
  slug: string;
  description: string;
}

export const MeilleursPlansClientPage = ({ initialCategories, icons }: { initialCategories: Category[], icons: { [key: string]: IconDefinition } }) => {
  return (
    <SectionClientPage<Category>
      initialCategories={initialCategories}
      renderCard={(cat) => (
        <Link
          href={`/meilleurs-plans/${cat.slug}`}
          className="group bg-card rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
        >
          <div className="relative h-[180px] overflow-hidden">
            {cat.heroImage ? (
              <Image
                src={cat.heroImage}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F4F7FE 0%, #dbeafe 100%)' }}
                aria-hidden="true"
              >
                <FontAwesomeIcon
                  icon={icons[cat.slug] || faStar}
                  style={{ fontSize: '48px', color: '#3B5BDB', opacity: 0.25 }}
                />
              </div>
            )}
          </div>
          <div className="px-5 pt-[18px] pb-5 flex flex-col flex-1">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="text-foreground" style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                {cat.name}
              </h3>
              <span
                className="flex-shrink-0 inline-flex items-center justify-center rounded-xl"
                style={{ width: '32px', height: '32px', backgroundColor: '#F4F7FE', color: '#3B5BDB' }}
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={icons[cat.slug] || faStar} style={{ fontSize: '14px' }} />
              </span>
            </div>
            <p className="flex-1 mb-4" style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55 }}>
              {cat.description}
            </p>
            <span className="inline-flex items-center gap-1 text-primary text-sm font-medium" aria-hidden="true">
              Voir les offres
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        </Link>
      )}
    >
      <h1 className="text-4xl font-bold text-center mb-4" style={{ letterSpacing: '-0.02em' }}>
        Meilleurs <span className="text-primary">plans</span> & offres
      </h1>
      <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
        Profitez d&apos;avantages exclusifs négociés pour la communauté Philippin&apos;Easy.
      </p>

      <div
        className="bg-soft-blue rounded-2xl p-8 md:p-10 mt-20 mb-16"
        style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="w-full md:w-2/3">
            <span
              className="inline-flex items-center gap-2 mb-4 uppercase"
              style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#3B5BDB' }}
            >
              <span aria-hidden="true">★</span>
              Programme privilège
            </span>
            <h2
              className="mb-3"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: '#0f172a',
              }}
            >
              <span className="text-primary">Easy+</span>
              <span className="text-foreground"> — débloquez le maximum de votre voyage</span>
            </h2>
            <p
              className="mb-6"
              style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.55 }}
            >
              Devenez membre Easy+ et accédez à des avantages exclusifs pour optimiser votre expérience aux Philippines.
            </p>
            <ul className="space-y-2.5 mb-7">
              {[
                "Jusqu'à -20% chez nos partenaires sélectionnés",
                'Support prioritaire 24/7 (Email, Chat)',
                'Accès aux guides premium et contenus exclusifs',
                'Assistant IA illimité (WhatsApp/Telegram)',
                'Invitations aux événements privés de la communauté',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5"
                  style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5 }}
                >
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center rounded-full mt-0.5"
                    style={{ width: '18px', height: '18px', backgroundColor: '#dbeafe', color: '#3B5BDB' }}
                    aria-hidden="true"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '10px' }} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/connexion"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-lg font-semibold text-sm bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg"
              >
                Rejoindre Easy+
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
              >
                En savoir plus
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div
              className="relative w-full h-auto rounded-xl overflow-hidden"
              style={{ aspectRatio: '1.5/1', boxShadow: '0 8px 24px rgba(59,91,219,0.12)' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1565717432093-1657f46d4fad?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&fit=max"
                alt="Carte privilège"
                fill
                className="object-cover"
              />
            </div>
            <p
              className="text-center mt-3 uppercase"
              style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', color: '#94a3b8' }}
            >
              Votre carte de membre
            </p>
          </div>
        </div>
      </div>
    </SectionClientPage>
  );
};
