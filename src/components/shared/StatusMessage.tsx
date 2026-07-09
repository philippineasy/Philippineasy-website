import Link from 'next/link';

interface StatusMessageProps {
  title: string;
  description?: string;
  /** CTA optionnel (libellé + href) sous le message. */
  ctaLabel?: string;
  ctaHref?: string;
  variant?: 'default' | 'error';
}

/**
 * État de page centré (accès refusé, erreur, ressource introuvable) présenté
 * dans une carte tokenisée — remplace les <h1>/<p> nus qui cassaient la
 * cohérence visuelle (et le dark mode) sur les pages vendeur/boutique.
 */
export function StatusMessage({
  title,
  description,
  ctaLabel,
  ctaHref,
  variant = 'default',
}: StatusMessageProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card-rest">
        <h1
          className={`text-2xl font-bold tracking-[-0.01em] ${
            variant === 'error' ? 'text-destructive' : 'text-foreground'
          }`}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
        )}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
