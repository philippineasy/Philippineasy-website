'use client';

import { useState } from 'react';
import Image from 'next/image';

type ProductGalleryProps = {
  images: string[] | null;
  name: string;
};

const PlaceholderIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

export const ProductGallery = ({ images, name }: ProductGalleryProps) => {
  const gallery = (images ?? []).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = gallery.length > 0;
  const active = Math.min(activeIndex, gallery.length - 1);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-[0.5px] border-border bg-muted shadow-card-rest">
        {hasImages ? (
          <Image
            src={gallery[active]}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
            <PlaceholderIcon />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div
          className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {gallery.map((src, i) => {
            const isActive = i === active;
            return (
              <button
                key={src + i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Voir l'image ${i + 1} de ${name}`}
                aria-current={isActive}
                className={
                  'relative h-[68px] w-[68px] flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
                  (isActive
                    ? 'border-primary'
                    : 'border-transparent opacity-70 hover:opacity-100')
                }
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="68px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
