import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus, UserMinus, Calendar, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsFollowing, useFollowUser, useUnfollowUser, useFollowers, useFollowing } from "@/hooks/useFollows";
import { useFeedPosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/social/PostCard";
import { format } from "date-fns";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get like counts
      const postIds = posts?.map(p => p.id) || [];
      const { data: likes } = postIds.length > 0
        ? await supabase.from('post_likes').select('post_id').in('post_id', postIds)
        : { data: [] };

      const { data: comments } = postIds.length > 0
        ? await supabase.from('post_comments').select('post_id').in('post_id', postIds)
        : { data: [] };

      const { data: userLikes } = user && postIds.length > 0
        ? await supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', postIds)
        : { data: [] };

      const { data: userSaves } = user && postIds.length > 0
        ? await supabase.from('post_saves').select('post_id').eq('user_id', user.id).in('post_id', postIds)
        : { data: [] };

      const likeCountMap = new Map<string, number>();
      const commentCountMap = new Map<string, number>();
      likes?.forEach(l => likeCountMap.set(l.post_id, (likeCountMap.get(l.post_id) || 0) + 1));
      comments?.forEach(c => commentCountMap.set(c.post_id, (commentCountMap.get(c.post_id) || 0) + 1));
      const userLikeSet = new Set(userLikes?.map(l => l.post_id) || []);
      const userSaveSet = new Set(userSaves?.map(s => s.post_id) || []);

      return (posts || []).map(post => ({
        ...post,
        author_name: profile?.display_name || 'Unknown Operator',
        site_name: null,
        loadout_name: null,
        like_count: likeCountMap.get(post.id) || 0,
        comment_count: commentCountMap.get(post.id) || 0,
        is_liked: userLikeSet.has(post.id),
        is_saved: userSaveSet.has(post.id),
      }));
    },
    enabled: !!userId && !!profile,
  });

  const { data: followers } = useFollowers(userId);
  const { data: following } = useFollowing();
  const { data: isFollowing, isLoading: isFollowingLoading } = useIsFollowing(userId || '');
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const handleFollow = () => {
    if (!userId) return;
    if (isFollowing) {
      unfollowUser.mutate(userId);
    } else {
      followUser.mutate(userId);
    }
  };

  const isFollowPending = followUser.isPending || unfollowUser.isPending;
  const isOwnProfile = user?.id === userId;

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Operator not found</p>
          <p className="text-sm">This profile doesn't exist or has been removed.</p>
        </div>
      </AppLayout>
    );
  }

  // Get following count for this user
  const { data: userFollowingList } = useQuery({
    queryKey: ['user-following-count', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  return (
    <AppLayout>
      <div className="space-y-6 pb-20">
        {/* Profile Header */}
        <div className="bg-card/50 border border-border/50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {profile.display_name?.slice(0, 2).toUpperCase() || 'OP'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{profile.display_name}</h1>
                  {profile.primary_role && (
                    <Badge variant="secondary" className="mt-1">
                      {profile.primary_role}
                    </Badge>
                  )}
                </div>

                {!isOwnProfile && user && (
                  <Button
                    onClick={handleFollow}
                    disabled={isFollowPending || isFollowingLoading}
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    className="gap-2"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {profile.member_since ? format(new Date(profile.member_since), 'MMM yyyy') : 'Unknown'}
                </div>
              </div>

              <div className="flex items-center gap-6 mt-3">
                <div className="text-center">
                  <p className="font-bold text-foreground">{followers?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground">{userFollowingList?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground">{profile.games_played || 0}</p>
                  <p className="text-xs text-muted-foreground">Games</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Posts</h2>
          
          {postsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : userPosts && userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
              <p className="font-medium">No posts yet</p>
              <p className="text-sm">This operator hasn't shared anything yet.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UserProfile;
