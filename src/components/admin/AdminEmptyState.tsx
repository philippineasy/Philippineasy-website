type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

export function AdminEmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      {icon && (
        <span className="w-14 h-14 rounded-full bg-muted/50 text-muted-foreground flex items-center justify-center mb-4" aria-hidden="true">
          {icon}
        </span>
      )}
      <strong className="text-[16px] font-semibold text-ink mb-1">{title}</strong>
      {description && (
        <p className="text-[13px] text-muted-foreground leading-[1.55] max-w-[42ch] mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
