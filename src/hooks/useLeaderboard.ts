import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  total_xp: number;
  course_count: number;
  completed_courses: number;
}

interface UserRank {
  rank: number;
  total_xp: number;
  course_count: number;
  completed_courses: number;
}

export function useLeaderboard(userId?: string, limit: number = 100) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: leaderboardError } = await supabase.rpc('get_leaderboard', {
        p_limit: limit,
        p_offset: 0
      });

      if (leaderboardError) throw leaderboardError;

      setLeaderboard(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const fetchUserRank = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error: rankError } = await supabase.rpc('get_user_rank', {
        p_user_id: userId
      });

      if (rankError) throw rankError;

      if (data && data.length > 0) {
        setUserRank(data[0]);
      }
    } catch (err) {
      console.error('Error fetching user rank:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchLeaderboard();
    if (userId) {
      fetchUserRank();
    }
  }, [fetchLeaderboard, fetchUserRank, userId]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_enrollments'
        },
        () => {
          fetchLeaderboard();
          fetchUserRank();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchLeaderboard, fetchUserRank]);

  return {
    leaderboard,
    userRank,
    loading,
    error,
    refresh: () => {
      fetchLeaderboard();
      if (userId) fetchUserRank();
    }
  };
}
