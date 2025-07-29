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
        <div className="plan-card bg-card rounded-lg shadow-lg overflow-hidden h-full">
          <div className="relative h-48">
            <Image src={cat.heroImage || 'https://images.unsplash.com/photo-1536483354957-c927a88c1bc0'} alt={cat.name} fill className="object-cover"/>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{cat.name}</h3>
              <FontAwesomeIcon icon={icons[cat.slug] || faStar} className="text-primary text-2xl" />
            </div>
            <p className="text-muted-foreground mb-4 text-sm">{cat.description}</p>
            <Link href={`/meilleurs-plans/${cat.slug}`} className="text-primary hover:text-primary/90 font-semibold">Voir les offres →</Link>
          </div>
        </div>
      )}
    >
      <h1 className="text-4xl font-bold text-center mb-4">Meilleurs <span className="text-primary">Plans</span> & Offres</h1>
      <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">Profitez d'avantages exclusifs négociés pour la communauté Philippin'Easy.</p>
      
      <div className="bg-primary/10 rounded-xl p-8 md:p-12 shadow-lg mt-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-2/3 md:pr-10 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 text-primary/90">Programme Privilège <span className="text-accent">Easy+</span></h2>
            <p className="text-foreground mb-6">Devenez membre Easy+ et accédez à des avantages exclusifs pour optimiser votre expérience aux Philippines.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-primary mr-2" /><span>Jusqu'à -20% chez nos partenaires sélectionnés</span></li>
              <li className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-primary mr-2" /><span>Support prioritaire 24/7 (Email, Chat)</span></li>
              <li className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-primary mr-2" /><span>Accès aux guides premium et contenus exclusifs</span></li>
              <li className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-primary mr-2" /><span>Assistant IA illimité (WhatsApp/Telegram)</span></li>
              <li className="flex items-center"><FontAwesomeIcon icon={faCheckCircle} className="text-primary mr-2" /><span>Invitations aux événements privés de la communauté</span></li>
            </ul>
            <Link href="/connexion" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold">Rejoindre Easy+</Link>
            <a href="#" className="ml-4 text-primary hover:underline">En savoir plus sur les avantages</a>
          </div>
          <div className="w-full md:w-1/3">
            <div className="relative w-full h-auto" style={{ aspectRatio: '1.5/1' }}>
              <Image src="https://images.unsplash.com/photo-1565717432093-1657f46d4fad?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&fit=max" alt="Carte privilège" fill className="rounded-lg shadow-lg object-cover" />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">Votre carte de membre virtuelle</p>
          </div>
        </div>
      </div>
    </SectionClientPage>
  );
};
