'use client';

import { FC, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  titleCentered?: boolean;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, titleCentered = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-card p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className={`flex justify-between items-center mb-6 ${titleCentered ? 'text-center' : ''}`}>
          <h3 className={`text-2xl font-semibold text-foreground ${titleCentered ? 'w-full' : ''}`}>{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground">
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
