'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, Mail } from 'lucide-react';

const PendingValidationPage = () => {
  const router = useRouter();

  useEffect(() => {
    console.log('PendingValidationPage: Page loaded.');
  }, []);

  return (
    <div className="min-h-screen bg-muted">
      <section className="bg-card border-b border-border py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Rencontre Philippines
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Merci pour votre inscription !</h1>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border text-left">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Profil en cours de validation</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Notre équipe de modération vérifie votre profil pour garantir la sécurité et l&apos;authenticité de notre communauté.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border text-left">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Notification par e-mail</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Vous recevrez un e-mail dès que votre profil sera approuvé. Cela prend généralement moins de 24 heures.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retour à l&apos;accueil
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PendingValidationPage;
