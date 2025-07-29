'use client';

import { FC, ReactNode } from 'react';
import Modal from '@/components/layout/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} titleCentered>
      <div className="text-center">
        <div className="text-muted-foreground mb-6">
          {children}
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={onClose} variant="outline">
            Annuler
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
