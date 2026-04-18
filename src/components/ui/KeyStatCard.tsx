import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface KeyStatCardProps {
  icon: IconDefinition;
  value: string;
  label: string;
  color: 'primary' | 'accent';
}

export const KeyStatCard = ({ icon, value, label, color }: KeyStatCardProps) => {
  const iconBg = color === 'primary' ? '#F4F7FE' : '#FEF3C7';
  const iconColor = color === 'primary' ? '#3B5BDB' : '#F59E0B';

  return (
    <div
      className="bg-card rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
    >
      <span
        className="inline-flex items-center justify-center rounded-xl mb-3"
        style={{ width: '52px', height: '52px', backgroundColor: iconBg, color: iconColor }}
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={icon} style={{ fontSize: '22px' }} />
      </span>
      <p
        className="text-foreground tabular-nums"
        style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}
      >
        {value}
      </p>
      <p
        className="mt-1.5"
        style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, letterSpacing: '0.02em' }}
      >
        {label}
      </p>
    </div>
  );
};
