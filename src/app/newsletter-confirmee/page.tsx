import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, CircleAlert, Download, MapPinned, Home, Sparkles } from 'lucide-react';
import ResubscribeForm from './ResubscribeForm';

export const metadata: Metadata = {
  title: 'Inscription confirmée',
  robots: { index: false, follow: false },
};

const guides: { title: string; description: string; file: string }[] = [
  {
    title: '7 jours à Palawan',
    description: 'El Nido, Coron, plages secrètes & budget détaillé.',
    file: '/lead-magnets/palawan-7-jours.pdf',
  },
  {
    title: 'Checklist Visa SRRV',
    description: 'Documents, étapes, coûts — tout pour votre visa retraite.',
    file: '/lead-magnets/checklist-visa-srrv.pdf',
  },
  {
    title: 'Budget 3 semaines',
    description: 'Vols, hébergement, nourriture, transport — guide complet.',
    file: '/lead-magnets/budget-3-semaines.pdf',
  },
];

const guideLinks = [
  { label: 'Guides de voyage', description: 'Palawan, Cebu, Siargao et plus', href: '/voyager-aux-philippines', icon: MapPinned },
  { label: "S'installer aux Philippines", description: 'Visas, logement, travail', href: '/vivre-aux-philippines', icon: Home },
  { label: 'Itinéraire IA', description: 'Créez votre voyage sur mesure', href: '/itineraire-personnalise-pour-les-philippines', icon: Sparkles },
];

const wrapperClass =
  'flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-16 md:py-24';
const cardClass = 'w-full max-w-xl rounded-2xl border border-border/60 bg-card p-7 shadow-card sm:p-9';

export default async function NewsletterConfirmeePage({
  searchParams,
}: {
  searchParams: Promise<{ etat?: string }>;
}) {
  const { etat } = await searchParams;

  if (etat === 'invalide') {
    return (
      <main className={wrapperClass}>
        <div className={`${cardClass} text-center`}>
          <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive" aria-hidden="true">
            <CircleAlert className="h-6 w-6" />
          </span>
          <h1 className="text-[clamp(1.375rem,3vw,1.75rem)] font-bold tracking-[-0.02em] text-ink">
            Ce lien n&apos;est plus valide
          </h1>
          <p className="mx-auto mt-3 max-w-[42ch] text-[14.5px] leading-relaxed text-muted-foreground">
            Il a peut-être déjà été utilisé ou a expiré. Entrez à nouveau votre adresse email pour recevoir
            un nouveau lien de confirmation.
          </p>
          <ResubscribeForm />
        </div>
      </main>
    );
  }

  return (
    <main className={wrapperClass}>
      <div className={cardClass}>
        <div className="text-center">
          <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]" aria-hidden="true">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <h1 className="text-[clamp(1.375rem,3vw,1.75rem)] font-bold tracking-[-0.02em] text-ink">
            Inscription confirmée !
          </h1>
          <p className="mx-auto mt-3 max-w-[44ch] text-[14.5px] leading-relaxed text-muted-foreground">
            Merci ! Vous recevrez désormais nos meilleurs conseils, bons plans et actualités sur les
            Philippines. En attendant, voici vos guides gratuits.
          </p>
        </div>

        <div className="mt-7 space-y-2.5">
          {guides.map((guide) => (
            <a
              key={guide.file}
              href={guide.file}
              download
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3.5 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent-strong">
                <Download className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[14px] font-semibold text-foreground">{guide.title}</span>
                <span className="block text-[12.5px] text-muted-foreground">{guide.description}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-7 border-t border-border/60 pt-6">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            À découvrir aussi
          </span>
          <div className="space-y-2">
            {guideLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="flex-1 min-w-0">
                  <span className="block text-[13.5px] font-medium text-foreground group-hover:text-primary">{item.label}</span>
                  <span className="block text-[12px] text-muted-foreground">{item.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-7 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[14px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Explorer le site
          </Link>
        </div>
      </div>
    </main>
  );
}
