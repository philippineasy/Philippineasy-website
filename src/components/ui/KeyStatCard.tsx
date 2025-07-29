import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface KeyStatCardProps {
  icon: IconDefinition;
  value: string;
  label: string;
  color: 'primary' | 'accent';
}

export const KeyStatCard = ({ icon, value, label, color }: KeyStatCardProps) => {
  const textColor = color === 'primary' ? 'text-primary' : 'text-accent';

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg text-center">
      <FontAwesomeIcon icon={icon} className={`text-5xl mb-4 ${textColor}`} />
      <p className="text-4xl font-bold">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
};
