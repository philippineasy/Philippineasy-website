'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PendingValidationPage = () => {
  const router = useRouter();

  useEffect(() => {
    console.log('PendingValidationPage: Page loaded.');
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <video autoPlay loop muted className="absolute z-0 w-full h-full object-cover">
        <source src="/videos/Beach%20Philippines.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 min-h-screen bg-black/30 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
            <h1 className="text-4xl font-bold text-gray-800">Merci pour votre inscription !</h1>
            <p className="text-gray-600 mt-4 text-lg">
              Votre profil est en cours de validation par notre équipe de modération. Cette étape est nécessaire pour garantir la sécurité et l'authenticité de notre communauté.
            </p>
            <p className="text-gray-600 mt-2">
              Vous recevrez une notification par e-mail dès que votre profil sera approuvé. Cela prend généralement moins de 24 heures.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-8 bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingValidationPage;
