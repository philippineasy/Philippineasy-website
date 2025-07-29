import Image from 'next/image';
import { ReactNode } from 'react';

interface AlternatingContentProps {
  imageUrl: string;
  imageAlt: string;
  children: ReactNode;
  reverse?: boolean;
}

export const AlternatingContent = ({ imageUrl, imageAlt, children, reverse = false }: AlternatingContentProps) => {
  const imageOrder = reverse ? 'md:order-last' : '';
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className={`relative w-full h-96 rounded-lg overflow-hidden shadow-lg ${imageOrder}`}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};
