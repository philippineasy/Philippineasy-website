'use client';

import { motion } from 'framer-motion';
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

  if (!canModify || (!hasQuota && offerType === 'express')) {
    return (
      <div className="relative group">
        <button
          disabled
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-muted-foreground cursor-not-allowed text-sm"
        >
          <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
          <span className="hidden sm:inline">Modifier</span>
        </button>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          Passez en Premium pour modifier
          <div className="absolute top-full right-4 border-4 border-transparent border-t-foreground" />
        </div>
      </div>
    );
  }

  if (!hasQuota) {
    return (
      <div className="relative group">
        <button
          disabled
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-muted-foreground cursor-not-allowed text-sm"
        >
          <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
          <span className="hidden sm:inline">Modifier</span>
        </button>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          Quota de modifications epuise
          <div className="absolute top-full right-4 border-4 border-transparent border-t-foreground" />
        </div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/15 text-primary hover:bg-accent/25 transition-colors text-sm font-medium"
    >
      <FontAwesomeIcon icon={faPencil} className="w-3 h-3" />
      <span className="hidden sm:inline">Modifier</span>
    </motion.button>
  );
}
