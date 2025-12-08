import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Crosshair, MapPin, Gamepad2, Wrench, X } from "lucide-react";
import { useCreatePost, PostType } from "@/hooks/usePosts";
import { useSites } from "@/hooks/useSites";
import { useGuns } from "@/hooks/useGuns";
import { usePlannedLoadouts } from "@/hooks/usePlannedLoadouts";
import { useGameSessions } from "@/hooks/useGameSessions";

const postTypeOptions: { value: PostType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'build', label: 'Build', icon: <Crosshair className="h-5 w-5" />, description: 'Share your loadout or gear setup' },
  { value: 'game_recap', label: 'Game Recap', icon: <Gamepad2 className="h-5 w-5" />, description: 'Share highlights from a game day' },
  { value: 'tech', label: 'Tech Question', icon: <Wrench className="h-5 w-5" />, description: 'Ask for help with gear issues' },
  { value: 'general', label: 'General', icon: <MapPin className="h-5 w-5" />, description: 'General airsoft discussion' },
];

const gunPlatforms = ['AEG', 'GBB', 'GBBR', 'DMR', 'Sniper', 'HPA', 'Shotgun', 'Pistol'];

const CreatePost = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const prefillType = searchParams.get('type') as PostType | null;
  const prefillSiteId = searchParams.get('siteId');
  const prefillLoadoutId = searchParams.get('loadoutId');
  const prefillSessionId = searchParams.get('sessionId');

  const [type, setType] = useState<PostType | null>(prefillType);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [siteId, setSiteId] = useState<string>(prefillSiteId || "");
  const [loadoutId, setLoadoutId] = useState<string>(prefillLoadoutId || "");
  const [sessionId, setSessionId] = useState<string>(prefillSessionId || "");
  const [gunPlatform, setGunPlatform] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { data: sites } = useSites();
  const { guns } = useGuns();
  const { loadouts } = usePlannedLoadouts();
  const { gameSessions: sessions } = useGameSessions();

  const createPost = useCreatePost();

  const handleSubmit = () => {
    if (!type || !body.trim()) return;

    createPost.mutate(
      {
        type,
        title: title.trim() || undefined,
        body: body.trim(),
        site_id: siteId || undefined,
        loadout_id: loadoutId || undefined,
        game_session_id: sessionId || undefined,
        gun_platform: gunPlatform || undefined,
        tags: tags.length > 0 ? tags : undefined,
      },
      {
        onSuccess: () => navigate('/feed'),
      }
    );
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  if (!type) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate('/feed')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>

          <h1 className="text-2xl font-bold">Create Post</h1>
          <p className="text-muted-foreground">What would you like to share?</p>

          <div className="grid gap-3">
            {postTypeOptions.map(option => (
              <Card 
                key={option.value}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setType(option.value)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{option.label}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  const selectedTypeOption = postTypeOptions.find(o => o.value === type);

  return (
    <AppLayout>
      <div className="space-y-4 pb-20">
        <Button variant="ghost" onClick={() => setType(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Change Type
        </Button>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                {selectedTypeOption?.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{selectedTypeOption?.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedTypeOption?.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title - optional for some types */}
            {(type === 'general' || type === 'tech') && (
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Give your post a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>
            )}

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">
                {type === 'game_recap' ? 'What happened?' : 
                 type === 'tech' ? 'Describe the issue' : 
                 type === 'build' ? 'Tell us about your build' : 'Content'} *
              </Label>
              <Textarea
                id="body"
                placeholder={
                  type === 'game_recap' ? 'How did the game go? Any highlights or memorable moments?' :
                  type === 'tech' ? 'Describe the problem you\'re having with your gear...' :
                  type === 'build' ? 'Share the details of your loadout setup...' :
                  'Share your thoughts with the community...'
                }
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[120px]"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">{body.length}/2000</p>
            </div>

            {/* Site selector */}
            {(type === 'game_recap' || type === 'build') && (
              <div className="space-y-2">
                <Label>Site (optional)</Label>
                <Select value={siteId} onValueChange={setSiteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No site</SelectItem>
                    {sites?.slice(0, 30).map(site => (
                      <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Loadout selector for build posts */}
            {type === 'build' && (
              <div className="space-y-2">
                <Label>Loadout (optional)</Label>
                <Select value={loadoutId} onValueChange={setLoadoutId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a loadout..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No loadout</SelectItem>
                    {loadouts?.map(loadout => (
                      <SelectItem key={loadout.id} value={loadout.id}>{loadout.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Game session selector for recap posts */}
            {type === 'game_recap' && (
              <div className="space-y-2">
                <Label>Game Session (optional)</Label>
                <Select value={sessionId} onValueChange={setSessionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a session..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No session</SelectItem>
                    {sessions?.slice(0, 20).map(session => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.site_name} - {new Date(session.game_date).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Gun platform for tech posts */}
            {type === 'tech' && (
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={gunPlatform} onValueChange={setGunPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not specified</SelectItem>
                    {gunPlatforms.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Gun selector for tech posts */}
            {type === 'tech' && guns && guns.length > 0 && (
              <div className="space-y-2">
                <Label>Your Gun (optional)</Label>
                <Select onValueChange={(value) => {
                  const gun = guns.find(g => g.id === value);
                  if (gun?.gun_type) setGunPlatform(gun.gun_type);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select from your arsenal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {guns.map(gun => (
                      <SelectItem key={gun.id} value={gun.id}>{gun.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags (optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  maxLength={20}
                />
                <Button type="button" variant="outline" onClick={addTag} disabled={tags.length >= 5}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">{tags.length}/5 tags</p>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={!body.trim() || createPost.isPending}
              className="w-full"
            >
              {createPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post to Safe Zone'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreatePost;
