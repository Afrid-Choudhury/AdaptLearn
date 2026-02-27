import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria_type: string;
  criteria_value: any;
  created_at: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement: Achievement;
}

interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
}

export function useAchievements(userId?: string) {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: true });

      if (achievementsError) throw achievementsError;

      if (!userId) {
        setAchievements(allAchievements?.map(a => ({ ...a, unlocked: false })) || []);
        return;
      }

      const { data: userAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', userId);

      if (userAchievementsError) throw userAchievementsError;

      const unlockedMap = new Map(
        userAchievements?.map(ua => [ua.achievement_id, ua.unlocked_at]) || []
      );

      const achievementsWithStatus: AchievementWithStatus[] = allAchievements?.map(achievement => ({
        ...achievement,
        unlocked: unlockedMap.has(achievement.id),
        unlocked_at: unlockedMap.get(achievement.id)
      })) || [];

      setAchievements(achievementsWithStatus);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('user-achievements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchAchievements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchAchievements]);

  const checkAchievements = useCallback(async () => {
    if (!userId) return;

    try {
      const { error } = await supabase.rpc('check_all_achievements', {
        p_user_id: userId
      });

      if (error) throw error;

      await fetchAchievements();
    } catch (err) {
      console.error('Error checking achievements:', err);
    }
  }, [userId, fetchAchievements]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return {
    achievements,
    loading,
    error,
    unlockedCount,
    totalCount,
    checkAchievements,
    refresh: fetchAchievements
  };
}
