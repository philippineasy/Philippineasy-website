'use client';

import { useState, type ReactNode } from 'react';
import { EditableWrapper } from '@/components/shared/EditableWrapper';

interface BaseItem {
  id: number;
}

interface SectionClientPageProps<T extends BaseItem> {
  initialCategories: T[];
  children: ReactNode;
  renderCard: (category: T) => ReactNode;
}

export const SectionClientPage = <T extends BaseItem>({ initialCategories, children, renderCard }: SectionClientPageProps<T>) => {
  const [categories, setCategories] = useState<T[]>(initialCategories);

  const handleCategoryUpdate = (updatedCategory: T) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  };

  return (
    <main className="container mx-auto px-4 py-16">
      {children}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <EditableWrapper<T> key={cat.id} item={cat} type="category" onUpdate={handleCategoryUpdate}>
            {renderCard(cat)}
          </EditableWrapper>
        ))}
      </div>
    </main>
  );
};
