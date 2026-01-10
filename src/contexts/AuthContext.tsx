'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile and vendor status for a user
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
      setProfile(null);
      setIsVendor(false);
      setIsAdmin(false);
    }
  }, []);

  // Clear user data
  const clearUserData = useCallback(() => {
    setUser(null);
    setProfile(null);
    setIsVendor(false);
    setIsAdmin(false);
  }, []);

  useEffect(() => {
    // Get initial session on mount
    const initializeAuth = async () => {
      try {
        const { data: { user: initialUser } } = await supabase.auth.getUser();

        if (initialUser) {
          setUser(initialUser);
          await fetchUserData(initialUser);
        } else {
          clearUserData();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearUserData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;

      // Skip INITIAL_SESSION as we handle it above
      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser);
      } else {
        clearUserData();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUserData, clearUserData]);

  const signOut = async () => {
    // Navigate away first to avoid a flash of logged-out content
    router.push('/');
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle the state update
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
