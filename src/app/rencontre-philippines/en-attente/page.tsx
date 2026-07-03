'use client';

import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, Mail, ShieldCheck } from 'lucide-react';

const PendingValidationPage = () => {
  const router = useRouter();

  const timeline = [
    {
      icon: CheckCircle,
      title: 'Inscription reçue',
      text: 'Merci ! Votre profil nous est bien parvenu.',
      state: 'done' as const,
    },
    {
      icon: ShieldCheck,
      title: 'Validation en cours',
      text: "Notre équipe de modération vérifie votre profil pour garantir la sécurité et l'authenticité de notre communauté.",
      state: 'active' as const,
    },
    {
      icon: Mail,
      title: 'Notification par e-mail',
      text: 'Vous recevrez un e-mail dès que votre profil sera approuvé. Cela prend généralement moins de 24 heures.',
      state: 'upcoming' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <section className="border-b border-border bg-card px-4 py-12">
        <div className="container mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Rencontre Philippines
          </span>
          <h1 className="text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
            Merci pour votre inscription !
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Votre profil est en route vers notre équipe. Voici les prochaines étapes.
          </p>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="container mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="h-8 w-8" />
            </div>

            {/* Validation timeline */}
            <ol className="relative">
              {timeline.map((step, i) => {
                const Icon = step.icon;
                const isDone = step.state === 'done';
                const isActive = step.state === 'active';
                const isLast = i === timeline.length - 1;
                return (
                  <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* connector line */}
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-5 top-11 h-[calc(100%-2.5rem)] w-px ${isDone ? 'bg-primary/40' : 'bg-border'}`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        isDone
                          ? 'bg-primary text-primary-foreground'
                          : isActive
                          ? 'bg-primary/10 text-primary ring-4 ring-primary/15'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="pt-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-foreground">{step.title}</h3>
                        {isActive && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent-strong">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                            En cours
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 border-t border-border pt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
