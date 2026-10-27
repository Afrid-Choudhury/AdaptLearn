import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface PlatformStats {
  totalUsers: number;
  avgRating: number;
  completionRate: number;
}

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.rpc('get_platform_stats');

      if (!error && data) {
        // get_platform_stats returns a json object (see its migration).
        const stats = data as { total_users: number; avg_rating: number; completion_rate: number };
        setStats({
          totalUsers: stats.total_users,
          avgRating: stats.avg_rating,
          completionRate: stats.completion_rate,
        });
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
