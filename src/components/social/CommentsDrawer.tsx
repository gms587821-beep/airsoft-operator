import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, Trash2 } from "lucide-react";
import { PostWithDetails, usePostComments, useCreateComment, useDeleteComment, Comment } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface CommentsDrawerProps {
  post: PostWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommentsDrawer = ({ post, open, onOpenChange }: CommentsDrawerProps) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = usePostComments(post.id);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    createComment.mutate(
      { postId: post.id, body: newComment.trim() },
      {
        onSuccess: () => setNewComment(""),
      }
    );
  };

  const handleDelete = (comment: Comment) => {
    deleteComment.mutate({ commentId: comment.id, postId: post.id });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Comments ({post.comment_count})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Original post preview */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {post.author_name?.slice(0, 2).toUpperCase() || 'OP'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{post.author_name}</span>
            </div>
            {post.title && <h4 className="font-semibold mb-1">{post.title}</h4>}
            <p className="text-sm text-muted-foreground line-clamp-3">{post.body}</p>
          </div>

          {/* Comments list */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No comments yet</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">
                      {comment.author_name?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.author_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                      {user?.id === comment.author_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(comment)}
                          disabled={deleteComment.isPending}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment input */}
        {user ? (
          <div className="border-t border-border pt-4 flex gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  handleSubmit();
                }
              }}
            />
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || createComment.isPending}
              size="icon"
              className="shrink-0"
            >
              {createComment.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <div className="border-t border-border pt-4 text-center text-muted-foreground">
            <p className="text-sm">Log in to comment</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
