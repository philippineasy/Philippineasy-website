import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * ForumStatePanel — the shared empty / error / not-found state for the forum.
 * Replaces the off-system `text-3xl font-bold` centred headings with a proper
 * card in the design language: token surface, rounded icon chip, a supporting
 * line and one or two clear actions. Renders an <h2> — every caller pairs it
 * with a hero (or page <h1>) above, so the heading order stays valid.
 */

interface StateAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface ForumStatePanelProps {
  icon: ReactNode;
  title: string;
  description: string;
  actions: StateAction[];
}

export const ForumStatePanel = ({ icon, title, description, actions }: ForumStatePanelProps) => (
  <div className="mx-auto max-w-lg rounded-3xl border-[0.5px] border-border bg-card p-8 text-center shadow-card-rest md:p-10">
    <span
      className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
      aria-hidden="true"
    >
      {icon}
    </span>
    <h2 className="text-[20px] font-bold text-foreground" style={{ letterSpacing: '-0.01em' }}>
      {title}
    </h2>
    <p className="mx-auto mt-2 max-w-sm text-[14px] leading-[1.6] text-muted-foreground">
      {description}
    </p>
    {actions.length > 0 && (
      <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
        {actions.map((action) =>
          action.variant === 'secondary' ? (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {action.label}
            </Link>
          ) : (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {action.label}
            </Link>
          )
        )}
      </div>
    )}
  </div>
);

export default ForumStatePanel;
