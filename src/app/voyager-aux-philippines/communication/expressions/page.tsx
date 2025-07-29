import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageCircle, Smile, ShoppingCart, HelpCircle } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Expressions Utiles en Tagalog | Philippineasy",
  description: "Apprenez les bases du Tagalog pour votre voyage aux Philippines. Salutations, formules de politesse, chiffres et expressions pratiques.",
};

const ExpressionsPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Expressions"
        titlePart2="Utiles"
        subtitle="Quelques mots de Tagalog pour briser la glace et enrichir votre expérience."
        imageUrl="/images/communication/dialogue-interculturel.webp"
      />
      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">L'anglais est parlé quasi partout, mais connaître quelques mots de Tagalog vous ouvrira bien des portes et des sourires. Voici les bases pour bien commencer.</p>

        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><Smile className="text-primary" />Salutations et Politesse</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li><strong>Salamat</strong> - Merci</li>
                <li><strong>Magandang umaga / hapon / gabi</strong> - Bonjour (matin / après-midi / soir)</li>
                <li><strong>Paalam</strong> - Au revoir</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><ShoppingCart className="text-primary" />Au Marché</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li><strong>Magkano po?</strong> - Combien ça coûte ? (le "po" est une marque de respect)</li>
                <li><strong>Isa / Dalawa / Tatlo</strong> - Un / Deux / Trois</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><HelpCircle className="text-primary" />Questions Pratiques</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li><strong>Saan ang CR?</strong> - Où sont les toilettes ? (CR = Comfort Room)</li>
                <li><strong>Ingat</strong> - Prends soin de toi / Fais attention</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpressionsPage;
