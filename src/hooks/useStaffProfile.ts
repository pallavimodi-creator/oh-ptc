import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StaffProfile {
  id: string;
  full_name: string;
  role: 'admin' | 'cd' | 'educator' | 'centre';
  centre_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useStaffProfile() {
  const { user } = useAuth();
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStaffProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('staff_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching staff profile:', error);
      }
      setStaffProfile(data as StaffProfile | null);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  return { staffProfile, loading };
}
