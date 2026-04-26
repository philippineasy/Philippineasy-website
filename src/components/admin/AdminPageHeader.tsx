type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};

// Editorial header for admin pages — proto-strict 2026 (matches Hero/ArticleHero pattern).
export function AdminPageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <header className="mb-8 lg:mb-10">
      {eyebrow && (
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent mb-2">
          {eyebrow}
        </span>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.02em] leading-[1.15] text-ink text-balance">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-[14px] text-muted-foreground leading-[1.55] max-w-[60ch]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </header>
  );
}
