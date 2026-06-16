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
        setStats({
          totalUsers: data.total_users,
          avgRating: data.avg_rating,
          completionRate: data.completion_rate,
        });
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
