import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Bookmark, MapPin, Crosshair, Clock, UserPlus, UserMinus } from "lucide-react";
import { PostWithDetails, useLikePost, useUnlikePost, useSavePost, useUnsavePost } from "@/hooks/usePosts";
import { useIsFollowing, useFollowUser, useUnfollowUser } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { CommentsDrawer } from "./CommentsDrawer";

interface PostCardProps {
  post: PostWithDetails;
}

const postTypeConfig = {
  build: { label: 'Build', color: 'bg-primary text-primary-foreground' },
  game_recap: { label: 'Game Recap', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  tech: { label: 'Tech', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  general: { label: 'General', color: 'bg-muted text-muted-foreground' },
};

export const PostCard = ({ post }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const { data: isFollowing, isLoading: isFollowingLoading } = useIsFollowing(post.author_id);

  const handleLike = () => {
    if (post.is_liked) {
      unlikePost.mutate(post.id);
    } else {
      likePost.mutate(post.id);
    }
  };

  const handleSave = () => {
    if (post.is_saved) {
      unsavePost.mutate(post.id);
    } else {
      savePost.mutate(post.id);
    }
  };

  const handleFollow = () => {
    if (isFollowing) {
      unfollowUser.mutate(post.author_id);
    } else {
      followUser.mutate(post.author_id);
    }
  };

  const isLiking = likePost.isPending || unlikePost.isPending;
  const isSaving = savePost.isPending || unsavePost.isPending;
  const isFollowingPending = followUser.isPending || unfollowUser.isPending;
  const showFollowButton = user && user.id !== post.author_id;

  const typeConfig = postTypeConfig[post.type];
  const shouldTruncate = post.body.length > 200 && !isExpanded;
  const displayBody = shouldTruncate ? post.body.slice(0, 200) + '...' : post.body;

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {post.author_name?.slice(0, 2).toUpperCase() || 'OP'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{post.author_name}</p>
                  {showFollowButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFollow}
                      disabled={isFollowingPending || isFollowingLoading}
                      className={cn(
                        "h-6 px-2 text-xs",
                        isFollowing 
                          ? "text-muted-foreground hover:text-destructive" 
                          : "text-primary hover:text-primary"
                      )}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="h-3 w-3 mr-1" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3 w-3 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <Badge variant="outline" className={cn("text-xs", typeConfig.color)}>
              {typeConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {post.title && (
            <h3 className="font-semibold text-lg text-foreground">{post.title}</h3>
          )}

          <p className="text-foreground/90 whitespace-pre-wrap">
            {displayBody}
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-primary hover:underline ml-1"
              >
                Read more
              </button>
            )}
          </p>

          {post.media_url && (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={post.media_url}
                alt="Post media"
                className="w-full max-h-80 object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {post.site_name && (
              <Badge variant="secondary" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {post.site_name}
              </Badge>
            )}
            {post.loadout_name && (
              <Badge variant="secondary" className="text-xs">
                <Crosshair className="h-3 w-3 mr-1" />
                {post.loadout_name}
              </Badge>
            )}
            {post.gun_platform && (
              <Badge variant="outline" className="text-xs">
                {post.gun_platform}
              </Badge>
            )}
            {post.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="border-t border-border/50 pt-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={cn(
                  "gap-1.5 px-2",
                  post.is_liked && "text-red-500 hover:text-red-600"
                )}
              >
                <Heart className={cn("h-4 w-4", post.is_liked && "fill-current")} />
                <span className="text-sm">{post.like_count}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(true)}
                className="gap-1.5 px-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{post.comment_count}</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "px-2",
                post.is_saved && "text-primary"
              )}
            >
              <Bookmark className={cn("h-4 w-4", post.is_saved && "fill-current")} />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CommentsDrawer
        post={post}
        open={showComments}
        onOpenChange={setShowComments}
      />
    </>
  );
};
