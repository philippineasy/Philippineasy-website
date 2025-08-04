import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Profile } from '@/types';

export const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (profile) {
          setIsPremium(profile.plan === 'premium');
        }
      }
      setLoading(false);
    };

    checkPremiumStatus();
  }, []);

  return { isPremium, loading };
};
