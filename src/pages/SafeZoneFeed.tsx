import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Globe, Users, Bookmark, Shield, AlertCircle } from "lucide-react";
import { useFeedPosts, FeedType, FeedFilters as FilterType } from "@/hooks/usePosts";
import { PostCard } from "@/components/social/PostCard";
import { FeedFilters } from "@/components/social/FeedFilters";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const SafeZoneFeed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedType, setFeedType] = useState<FeedType>('global');
  const [filters, setFilters] = useState<FilterType>({});

  const { data: posts, isLoading, error } = useFeedPosts(feedType, filters);

  return (
    <AppLayout>
      <div className="space-y-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Safe Zone</h1>
            <p className="text-sm text-muted-foreground">Community posts from airsoft operators</p>
          </div>
          {user && (
            <Button onClick={() => navigate('/feed/create')} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Post
            </Button>
          )}
        </div>

        {/* Community Guidelines Link */}
        <Link 
          to="/community-guidelines" 
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Shield className="h-3 w-3" />
          Community Guidelines
        </Link>

        {/* Feed Tabs */}
        <Tabs value={feedType} onValueChange={(v) => setFeedType(v as FeedType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global" className="gap-2">
              <Globe className="h-4 w-4" />
              Global
            </TabsTrigger>
            <TabsTrigger value="network" className="gap-2">
              <Users className="h-4 w-4" />
              Network
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2" disabled={!user}>
              <Bookmark className="h-4 w-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <FeedFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          <TabsContent value="global" className="mt-4 space-y-4">
            <FeedContent posts={posts} isLoading={isLoading} error={error} />
          </TabsContent>

          <TabsContent value="network" className="mt-4 space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Network feed coming soon</p>
              <p className="text-sm">Follow other operators to see their posts here</p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-4 space-y-4">
            <FeedContent posts={posts} isLoading={isLoading} error={error} emptyMessage="No saved posts yet" />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

interface FeedContentProps {
  posts: ReturnType<typeof useFeedPosts>['data'];
  isLoading: boolean;
  error: Error | null;
  emptyMessage?: string;
}

const FeedContent = ({ posts, isLoading, error, emptyMessage = "No posts yet" }: FeedContentProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Error loading posts</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">{emptyMessage}</p>
        <p className="text-sm mb-4">Be the first to share something with the community</p>
        {user && (
          <Button onClick={() => navigate('/feed/create')} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default SafeZoneFeed;
