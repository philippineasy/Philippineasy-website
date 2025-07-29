'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { EditHeroModal } from './EditHeroModal';

interface Page {
    id: number;
    slug: string;
    title: string;
    hero_image_url: string | null;
}

interface HeroCardProps {
    page: Page;
}

export const HeroCard = ({ page }: HeroCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full h-48">
                <Image
                    src={page.hero_image_url || 'https://via.placeholder.com/600x400'}
                    alt={page.title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4 flex justify-between items-center">
                <h3 className="font-bold">{page.title}</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-primary text-white rounded-full hover:bg-primary/90"
                >
                    <FontAwesomeIcon icon={faEdit} />
                </button>
            </div>
            <EditHeroModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pageSlug={page.slug}
                currentImageUrl={page.hero_image_url || ''}
            />
        </div>
    );
};
