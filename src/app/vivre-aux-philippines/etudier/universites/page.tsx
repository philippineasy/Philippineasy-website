import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { GraduationCap, School, DollarSign, FileText } from 'lucide-react';
import { HeroThematic } from '@/components/ui/HeroThematic';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Les Universités de Prestige aux Philippines | Philippineasy",
  description: "Découvrez les meilleures universités des Philippines pour les étudiants internationaux : UP, Ateneo, De La Salle. Programmes, coûts et admission.",
};

const UniversitesPage = () => {
  return (
    <div>
      <HeroThematic
        titlePart1="Les Universités"
        titlePart2="de Prestige"
        subtitle="Un enseignement de qualité en anglais et une expérience culturelle unique pour les étudiants du monde entier."
        imageUrl="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Le "Big Three" des Universités Philippines</h2>
        <p className="text-lg text-center max-w-3xl mx-auto mb-12">Les Philippines comptent plusieurs universités de renommée internationale, dont trois se distinguent particulièrement par leur excellence académique et leur prestige.</p>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><GraduationCap className="text-primary" />University of the Philippines (UP)</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Le système universitaire national des Philippines, avec plusieurs campus à travers le pays. Le campus de Diliman à Quezon City est le plus réputé. Connu pour ses programmes en sciences, droit et arts.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><GraduationCap className="text-primary" />Ateneo de Manila University (ADMU)</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Une université privée jésuite, réputée pour ses programmes en sciences humaines, business et droit. Elle est connue pour son campus verdoyant et sa communauté étudiante active.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><GraduationCap className="text-primary" />De La Salle University (DLSU)</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Une université privée catholique, leader dans les domaines de l'ingénierie, de l'informatique et du commerce. Elle est située au cœur de Manille.</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mt-16 mb-8">Informations Clés pour les Étudiants Étrangers</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><FileText className="text-primary" />Admission et Visa</CardTitle>
            </CardHeader>
            <CardContent>
              <p>La plupart des programmes sont enseignés en anglais. Vous devrez généralement passer un examen d'entrée et prouver votre maîtrise de l'anglais. Une fois accepté, l'université vous aidera à obtenir un <strong>visa étudiant (9F)</strong>. La demande est initiée par l'établissement auprès de la Commission on Higher Education (CHED).</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><DollarSign className="text-primary" />Frais de Scolarité et Coût de la Vie</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les frais de scolarité pour les étrangers varient de <strong>3 000 à 6 000 € par an</strong>. Le coût de la vie étudiante est très abordable, comptez environ <strong>400 à 600 € par mois</strong> pour le logement, la nourriture et les transports.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UniversitesPage;
