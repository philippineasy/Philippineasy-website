'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { recordArticleView } from '@/services/articleService';
import { supabase } from '@/utils/supabase/client';

interface ViewTrackerProps {
  articleId: number;
}

const ViewTracker = ({ articleId }: ViewTrackerProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (articleId) {
      recordArticleView(supabase, articleId, user?.id || null);
    }
  }, [articleId, user]);

  return null;
};

export default ViewTracker;
