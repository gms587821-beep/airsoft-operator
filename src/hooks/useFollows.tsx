import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export const useFollowing = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['following', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_follows')
        .select('*')
        .eq('follower_id', user.id);

      if (error) throw error;
      return data as Follow[];
    },
    enabled: !!user,
  });
};

export const useFollowers = (userId?: string) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_follows')
        .select('*')
        .eq('following_id', userId);

      if (error) throw error;
      return data as Follow[];
    },
    enabled: !!userId,
  });
};

export const useIsFollowing = (targetUserId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is-following', user?.id, targetUserId],
    queryFn: async () => {
      if (!user || !targetUserId || user.id === targetUserId) return false;

      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!targetUserId && user.id !== targetUserId,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('Must be logged in to follow');
      if (user.id === targetUserId) throw new Error('Cannot follow yourself');

      const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: user.id, following_id: targetUserId });

      if (error) throw error;
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['is-following'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: 'Following!', description: 'You are now following this operator.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('Must be logged in to unfollow');

      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) throw error;
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['is-following'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: 'Unfollowed', description: 'You are no longer following this operator.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
