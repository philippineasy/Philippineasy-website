'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faLock } from '@fortawesome/free-solid-svg-icons';

interface ModifyButtonProps {
  elementId: string;
  elementType: string;
  canModify: boolean;
  modificationsRemaining: number;
  offerType: string;
  onClick: () => void;
}

export default function ModifyButton({
  canModify,
  modificationsRemaining,
  offerType,
  onClick,
}: ModifyButtonProps) {
  const isUnlimited = offerType === 'conciergerie' && modificationsRemaining === -1;
  const hasQuota = isUnlimited || modificationsRemaining > 0;

  // Si l'offre Express (0 modifications), afficher un bouton special
  if (!canModify || (!hasQuota && offerType === 'express')) {
    return (
      <div className="relative group">
        <button
          disabled
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed text-sm"
        >
          <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
          <span className="hidden sm:inline">Modifier</span>
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          Passez en Premium pour modifier
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    );
  }

  // Si quota epuise (Premium mais plus de modifications)
  if (!hasQuota) {
    return (
      <div className="relative group">
        <button
          disabled
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed text-sm"
        >
          <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
          <span className="hidden sm:inline">Modifier</span>
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          Quota de modifications epuise
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    );
  }

  // Bouton actif
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/20 text-primary hover:bg-accent hover:text-primary transition-colors text-sm font-medium"
    >
      <FontAwesomeIcon icon={faPencil} className="w-3 h-3" />
      <span className="hidden sm:inline">Modifier</span>
    </button>
  );
}
