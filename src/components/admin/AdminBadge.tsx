type Tone = 'neutral' | 'primary' | 'accent' | 'emerald' | 'rose' | 'amber' | 'sky' | 'violet';

const TONES: Record<Tone, string> = {
  neutral: 'bg-muted text-foreground/80 border-border/60',
  primary: 'bg-primary/10 text-primary border-primary/20',
  accent: 'bg-accent/15 text-accent border-accent/30',
  emerald: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  rose: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  amber: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  sky: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
  violet: 'bg-violet-500/10 text-violet-700 border-violet-500/20',
};

type Props = {
  tone?: Tone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function AdminBadge({ tone = 'neutral', dot = false, children, className = '' }: Props) {
  return (
    <span className={['inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold tracking-[0.02em]', TONES[tone], className].join(' ')}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}
