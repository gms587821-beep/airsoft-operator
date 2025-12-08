import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export type PostType = 'build' | 'game_recap' | 'tech' | 'general';
export type FeedType = 'global' | 'network' | 'saved';

export interface Post {
  id: string;
  author_id: string;
  type: PostType;
  title: string | null;
  body: string;
  site_id: string | null;
  loadout_id: string | null;
  game_session_id: string | null;
  gun_platform: string | null;
  tags: string[] | null;
  media_url: string | null;
  is_public: boolean;
  created_at: string;
}

export interface PostWithDetails extends Post {
  author_name: string | null;
  site_name: string | null;
  loadout_name: string | null;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_saved: boolean;
}

export interface FeedFilters {
  type?: PostType;
  siteId?: string;
  gunPlatform?: string;
  tag?: string;
}

export interface CreatePostData {
  type: PostType;
  title?: string;
  body: string;
  site_id?: string;
  loadout_id?: string;
  game_session_id?: string;
  gun_platform?: string;
  tags?: string[];
  media_url?: string;
  is_public?: boolean;
}

export const useFeedPosts = (feedType: FeedType = 'global', filters: FeedFilters = {}, limit = 20, offset = 0) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['posts', feedType, filters, limit, offset, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.siteId) {
        query = query.eq('site_id', filters.siteId);
      }
      if (filters.gunPlatform) {
        query = query.eq('gun_platform', filters.gunPlatform);
      }
      if (filters.tag) {
        query = query.contains('tags', [filters.tag]);
      }

      const { data: posts, error } = await query;
      if (error) throw error;

      // Get author profiles
      const authorIds = [...new Set(posts?.map(p => p.author_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', authorIds);

      // Get site names
      const siteIds = [...new Set(posts?.filter(p => p.site_id).map(p => p.site_id) || [])];
      const { data: sites } = siteIds.length > 0 
        ? await supabase.from('sites').select('id, name').in('id', siteIds)
        : { data: [] };

      // Get loadout names
      const loadoutIds = [...new Set(posts?.filter(p => p.loadout_id).map(p => p.loadout_id) || [])];
      const { data: loadouts } = loadoutIds.length > 0 && user
        ? await supabase.from('loadouts').select('id, name').in('id', loadoutIds)
        : { data: [] };

      // Get like counts
      const postIds = posts?.map(p => p.id) || [];
      const { data: likes } = postIds.length > 0
        ? await supabase.from('post_likes').select('post_id').in('post_id', postIds)
        : { data: [] };

      // Get comment counts
      const { data: comments } = postIds.length > 0
        ? await supabase.from('post_comments').select('post_id').in('post_id', postIds)
        : { data: [] };

      // Get user's likes and saves
      const { data: userLikes } = user && postIds.length > 0
        ? await supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', postIds)
        : { data: [] };

      const { data: userSaves } = user && postIds.length > 0
        ? await supabase.from('post_saves').select('post_id').eq('user_id', user.id).in('post_id', postIds)
        : { data: [] };

      const profileMap = new Map<string, string | null>(profiles?.map(p => [p.id, p.display_name] as [string, string | null]) || []);
      const siteMap = new Map<string, string>(sites?.map(s => [s.id, s.name] as [string, string]) || []);
      const loadoutMap = new Map<string, string>(loadouts?.map(l => [l.id, l.name] as [string, string]) || []);
      const likeCountMap = new Map<string, number>();
      const commentCountMap = new Map<string, number>();
      const userLikeSet = new Set(userLikes?.map(l => l.post_id) || []);
      const userSaveSet = new Set(userSaves?.map(s => s.post_id) || []);

      likes?.forEach(l => {
        likeCountMap.set(l.post_id, (likeCountMap.get(l.post_id) || 0) + 1);
      });
      comments?.forEach(c => {
        commentCountMap.set(c.post_id, (commentCountMap.get(c.post_id) || 0) + 1);
      });

      const postsWithDetails: PostWithDetails[] = (posts || []).map(post => ({
        ...post,
        type: post.type as PostType,
        author_name: profileMap.get(post.author_id) || 'Unknown Operator',
        site_name: post.site_id ? (siteMap.get(post.site_id) || null) : null,
        loadout_name: post.loadout_id ? (loadoutMap.get(post.loadout_id) || null) : null,
        like_count: likeCountMap.get(post.id) || 0,
        comment_count: commentCountMap.get(post.id) || 0,
        is_liked: userLikeSet.has(post.id),
        is_saved: userSaveSet.has(post.id),
      }));

      return postsWithDetails;
    },
    enabled: feedType !== 'saved' || !!user,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      if (!user) throw new Error('Must be logged in to create a post');

      const { data: post, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          type: data.type,
          title: data.title || null,
          body: data.body,
          site_id: data.site_id || null,
          loadout_id: data.loadout_id || null,
          game_session_id: data.game_session_id || null,
          gun_platform: data.gun_platform || null,
          tags: data.tags || null,
          media_url: data.media_url || null,
          is_public: data.is_public ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: 'Post created!', description: 'Your post has been shared with the community.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Must be logged in to like a post');

      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Must be logged in to unlike a post');

      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Must be logged in to save a post');

      const { error } = await supabase
        .from('post_saves')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: 'Post saved!' });
    },
  });
};

export const useUnsavePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Must be logged in to unsave a post');

      const { error } = await supabase
        .from('post_saves')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author_name?: string;
}

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      const { data: comments, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const authorIds = [...new Set(comments?.map(c => c.author_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', authorIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.display_name]) || []);

      return (comments || []).map(comment => ({
        ...comment,
        author_name: profileMap.get(comment.author_id) || 'Unknown Operator',
      })) as Comment[];
    },
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, body }: { postId: string; body: string }) => {
      if (!user) throw new Error('Must be logged in to comment');

      const { data, error } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, author_id: user.id, body })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, postId }: { commentId: string; postId: string }) => {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      return postId;
    },
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
