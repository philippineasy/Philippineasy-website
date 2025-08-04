'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { DATING_CONFIG } from '@/config/dating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faStar, faCrown } from '@fortawesome/free-solid-svg-icons';

const UserLimits = () => {
  const { user } = useAuth();
  const [limits, setLimits] = useState({
    plan: 'free',
    messagesSent: 0,
    superLikesSentToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchLimits = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('plan, dating_profiles ( message_daily_count, last_super_like_at )')
          .eq('id', user.id)
          .single();

        if (data) {
          const profileData = data as any;
          const datingProfile = profileData.dating_profiles?.[0] || {};
          
          let superLikesToday = 0;
          if (datingProfile.last_super_like_at) {
            const lastDate = new Date(datingProfile.last_super_like_at);
            const now = new Date();
            if (now.getTime() - lastDate.getTime() < 24 * 60 * 60 * 1000) {
              superLikesToday = 1;
            }
          }

          setLimits({
            plan: data.plan,
            messagesSent: datingProfile.message_daily_count || 0,
            superLikesSentToday: superLikesToday,
          });
        }
        setLoading(false);
      };
      fetchLimits();
    }
  }, [user]);

  if (loading) {
    return <div className="bg-white rounded-lg shadow-lg p-6 text-center">Chargement des limites...</div>;
  }

  const currentPlanConfig = limits.plan === 'premium' ? DATING_CONFIG.premium_plan : DATING_CONFIG.free_plan;
  const messagesLeft = currentPlanConfig.daily_message_limit === -1 
    ? 'Illimités' 
    : Math.max(0, currentPlanConfig.daily_message_limit - limits.messagesSent);
    
  const superLikesLeft = Math.max(0, currentPlanConfig.super_likes_per_day - limits.superLikesSentToday);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Vos Limites Aujourd'hui</h2>
      <ul className="space-y-4">
        <li className="flex justify-between items-center">
          <span className="flex items-center"><FontAwesomeIcon icon={faPaperPlane} className="mr-3 text-primary" /> Messages restants</span>
          <span className="font-bold text-primary">{messagesLeft}</span>
        </li>
        <li className="flex justify-between items-center">
          <span className="flex items-center"><FontAwesomeIcon icon={faStar} className="mr-3 text-accent" /> Super Likes restants</span>
          <span className="font-bold text-accent">{superLikesLeft}</span>
        </li>
      </ul>
      {limits.plan === 'free' && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">Passez à la vitesse supérieure pour des conversations sans limites !</p>
          <Link href="/rencontre/premium" className="w-full inline-block bg-gradient-to-r from-accent to-yellow-400 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md">
            <FontAwesomeIcon icon={faCrown} className="mr-2" />
            Passer Premium
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserLimits;
