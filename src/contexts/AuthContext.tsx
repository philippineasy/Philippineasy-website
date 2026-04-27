'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Profile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isVendor: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  updateLocalProfile: (updates: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
  initialProfile?: Profile | null;
  initialIsVendor?: boolean;
}

export const AuthProvider = ({
  children,
  initialUser = null,
  initialProfile = null,
  initialIsVendor = false,
}: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [isVendor, setIsVendor] = useState(initialIsVendor);
  const [isAdmin, setIsAdmin] = useState(
    initialProfile?.role === 'super_admin' || initialProfile?.role === 'editor'
  );
  // Si on a deja la session SSR, on n'est jamais en "loading" cote client.
  const [loading, setLoading] = useState(initialUser === null && initialProfile === null);

  // Garde-fou : on ne re-fetch pas le profil sur chaque rerender / remount.
  const lastFetchedUserId = useRef<string | null>(initialUser?.id ?? null);
  const profileRef = useRef<Profile | null>(initialProfile);
  useEffect(() => { profileRef.current = profile; }, [profile]);

  const fetchUserData = useCallback(async (currentUser: User) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      setProfile(profileData as Profile);

      if (profileData) {
        setIsAdmin(profileData.role === 'super_admin' || profileData.role === 'editor');
        const { data: vendorData } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', currentUser.id)
          .eq('status', 'approved')
          .maybeSingle();
        setIsVendor(!!vendorData);
      } else {
        setIsVendor(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const clearUserData = useCallback(() => {
    setUser(null);
    setProfile(null);
    setIsVendor(false);
    setIsAdmin(false);
    lastFetchedUserId.current = null;
  }, []);

  useEffect(() => {
    // onAuthStateChange fire immediatement INITIAL_SESSION en @supabase/ssr 0.10+
    // (bug fix depuis 0.6). Plus besoin du hack setTimeout(500).
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;

      if (currentUser) {
        // Skip refetch si meme user que celui hydrate par le SSR
        if (currentUser.id === lastFetchedUserId.current && profileRef.current) {
          setUser(currentUser);
          setLoading(false);
          return;
        }
        lastFetchedUserId.current = currentUser.id;
        setUser(currentUser);
        await fetchUserData(currentUser);
      } else if (event === 'SIGNED_OUT') {
        clearUserData();
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserData, clearUserData]);

  const signOut = async () => {
    router.push('/');
    await supabase.auth.signOut();
  };

  const updateLocalProfile = (updates: Partial<Profile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const value = {
    user,
    profile,
    isAdmin,
    isVendor,
    loading,
    signOut,
    updateLocalProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
