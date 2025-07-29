'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const EditArticleButton = ({ articleSlug }: { articleSlug: string }) => {
  const { isAdmin, loading } = useAuth();

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <Link href={`/admin/articles/edit/${articleSlug}`} className="ml-4 px-4 py-2 bg-accent text-card-foreground rounded-lg hover:bg-accent/90 transition duration-300 text-sm font-semibold self-start flex-shrink-0">
      <FontAwesomeIcon icon={faEdit} className="mr-2" />
      Modifier
    </Link>
  );
};

export default EditArticleButton;
