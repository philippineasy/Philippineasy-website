type Props = {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

// Section divider for admin pages — eyebrow + title + actions row.
export function AdminSection({ eyebrow, title, description, actions, children, className = '' }: Props) {
  return (
    <section className={['mb-8', className].join(' ')}>
      {(title || eyebrow || actions) && (
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div className="min-w-0">
            {eyebrow && (
              <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-1">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-[18px] lg:text-[20px] font-bold tracking-[-0.01em] text-ink">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
