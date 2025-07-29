'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="text-sm mb-12 breadcrumb-container" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex items-center">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="text-muted-foreground hover:text-orange-500">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5 mx-3 text-primary" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
