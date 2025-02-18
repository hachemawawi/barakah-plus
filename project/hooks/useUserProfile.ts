import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth';
import { getUserProfile, createUserProfile } from '../lib/db';
import type { UserProfile } from '../types/database';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        let userProfile = await getUserProfile(user.uid);
        
        if (!userProfile) {
          // Create profile if it doesn't exist
          await createUserProfile(user.uid, {
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
          });
          userProfile = await getUserProfile(user.uid);
        }

        setProfile(userProfile);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
}