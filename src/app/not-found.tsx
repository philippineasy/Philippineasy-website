import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Home, Map, BookOpen, MessageSquare, ShoppingBag, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page non trouvée - 404 | Philippin\'Easy',
  description: 'La page que vous cherchez n\'existe pas ou a été déplacée. Découvrez nos guides sur les Philippines, le forum, la marketplace et plus.',
  alternates: {
    canonical: 'https://philippineasy.com/404',
  },
};

export default function NotFound() {
  const popularSections = [
    {
      icon: Home,
      title: 'Accueil',
      description: 'Retour à la page d\'accueil',
      href: '/',
      color: 'text-blue-600',
    },
    {
      icon: Map,
      title: 'Voyager',
      description: 'Guides de voyage aux Philippines',
      href: '/voyager-aux-philippines',
      color: 'text-green-600',
    },
    {
      icon: BookOpen,
      title: 'Vivre',
      description: 'S\'installer et vivre aux Philippines',
      href: '/vivre-aux-philippines',
      color: 'text-purple-600',
    },
    {
      icon: MessageSquare,
      title: 'Forum',
      description: 'Posez vos questions à la communauté',
      href: '/forum-sur-les-philippines',
      color: 'text-orange-600',
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Achetez et vendez aux Philippines',
      href: '/marketplace-aux-philippines',
      color: 'text-pink-600',
    },
    {
      icon: Heart,
      title: 'Rencontre',
      description: 'Trouvez l\'amour aux Philippines',
      href: '/rencontre-philippines',
      color: 'text-red-600',
    },
  ];

  return (
    <main className="container mx-auto px-4 py-16 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Page non trouvée</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {popularSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group p-6 border rounded-lg hover:border-primary hover:shadow-lg transition-all duration-300 text-left"
              >
                <Icon className={`w-8 h-8 mb-3 ${section.color} group-hover:scale-110 transition-transform`} />
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/actualites-sur-les-philippines">
              <BookOpen className="mr-2 h-5 w-5" />
              Lire les actualités
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-12 text-sm text-muted-foreground">
          Si vous pensez qu'il s'agit d'une erreur, veuillez{' '}
          <Link href="/forum-sur-les-philippines" className="text-primary hover:underline">
            nous contacter via le forum
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
