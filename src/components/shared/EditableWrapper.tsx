'use client';

import { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { EditCategoryModal } from './EditCategoryModal';
import { EditArticleModal } from './EditArticleModal';
import { ReplaceArticleModal } from './ReplaceArticleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

interface BaseItem {
  id: number;
  name?: string;
  title?: string;
}

import { Article } from '@/types';

type EditableWrapperProps<T extends BaseItem> = {
  item: T;
  children: React.ReactNode;
} & (
  | {
      type: 'category';
      onUpdate: (updatedItem: T) => void;
      onReplace?: never;
    }
  | {
      type: 'article';
      onUpdate: (updatedItem: Article) => void;
      onReplace?: (itemToReplace: Article) => void;
    }
);

export const EditableWrapper = <T extends BaseItem>({ item, type, onUpdate, onReplace, children }: EditableWrapperProps<T>) => {
  const { editMode } = useEditMode();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);

  if (!editMode) {
    return <>{children}</>;
  }

  const handleOpenEditModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleOpenReplaceModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onReplace) {
      setIsReplaceModalOpen(true);
    }
  };

  return (
    <div className="relative group">
      {children}
      <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={handleOpenEditModal}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          aria-label={`Modifier ${item.name || item.title}`}
        >
          <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
        </button>
        {onReplace && type === 'article' && (
          <button
            onClick={handleOpenReplaceModal}
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
            aria-label={`Remplacer ${item.name || item.title}`}
          >
            <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4" />
          </button>
        )}
      </div>
      {isEditModalOpen && type === 'category' && (
        <EditCategoryModal
          category={item as any}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={onUpdate as any}
        />
      )}
      {isEditModalOpen && type === 'article' && (
        <EditArticleModal
          article={item as any}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={onUpdate as any}
        />
      )}
      {isReplaceModalOpen && type === 'article' && onReplace && (
        <ReplaceArticleModal
          isOpen={isReplaceModalOpen}
          onClose={() => setIsReplaceModalOpen(false)}
          onReplace={(newArticle) => {
            if (onReplace) {
              onReplace(newArticle);
            }
            setIsReplaceModalOpen(false);
          }}
          currentArticleId={item.id}
        />
      )}
    </div>
  );
};
