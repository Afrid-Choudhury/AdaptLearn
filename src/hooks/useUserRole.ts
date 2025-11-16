import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserRole, UserRoleType } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

export function useUserRole() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    fetchUserRole();
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setUserRole(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return userRole?.role === 'admin';
  };

  const isInstructor = () => {
    return userRole?.role === 'instructor';
  };

  const isAdminOrInstructor = () => {
    return userRole?.role === 'admin' || userRole?.role === 'instructor';
  };

  const hasRole = (role: UserRoleType) => {
    return userRole?.role === role;
  };

  return {
    userRole,
    role: userRole?.role || 'student',
    loading,
    error,
    isAdmin: isAdmin(),
    isInstructor: isInstructor(),
    isAdminOrInstructor: isAdminOrInstructor(),
    hasRole,
    refetch: fetchUserRole,
  };
}
