import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Plus, Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { useSites } from "@/hooks/useSites";
import { useIsSiteFavourite, useToggleSiteFavourite } from "@/hooks/useSiteFavourites";
import { useSiteRatingStats } from "@/hooks/useSiteRatings";
import { Skeleton } from "@/components/ui/skeleton";

const FIELD_TYPES = ["All", "CQB", "Woodland", "Indoor", "Mixed", "Milsim"];

const SiteCard = ({ site }: { site: any }) => {
  const navigate = useNavigate();
  const isFavourite = useIsSiteFavourite(site.id);
  const toggleFavourite = useToggleSiteFavourite();
  const { averageOverall, count } = useSiteRatingStats(site.id);

  const handleFavouriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavourite.mutate({ siteId: site.id, isFavourite });
  };

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-tactical transition-smooth group"
      onClick={() => navigate(`/sites/${site.id}`)}
    >
      <div className="space-y-3">
        {site.thumbnail_url && (
          <div className="h-40 bg-secondary rounded-lg overflow-hidden">
            <img
              src={site.thumbnail_url}
              alt={site.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
              {site.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span>
                {[site.city, site.region, site.country].filter(Boolean).join(", ")}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavouriteClick}
            className={isFavourite ? "text-destructive" : ""}
          >
            <Heart className={`w-5 h-5 ${isFavourite ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{site.field_type}</Badge>
            {count > 0 && (
              <span className="text-sm text-primary">
                ★ {averageOverall.toFixed(1)} ({count})
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const Sites = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldType, setFieldType] = useState<string>("All");
  const [favouritesOnly, setFavouritesOnly] = useState(false);

  const { data: sites = [], isLoading } = useSites({
    fieldType: fieldType === "All" ? undefined : fieldType,
    searchTerm: searchTerm || undefined,
    favouritesOnly,
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Airsoft Sites</h1>
          <Button onClick={() => navigate("/sites/add")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Site
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sites by name or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="favourites-only"
              checked={favouritesOnly}
              onCheckedChange={setFavouritesOnly}
            />
            <Label htmlFor="favourites-only" className="text-sm text-muted-foreground">
              Show only my favourites
            </Label>
          </div>
        </div>

        {/* Map Placeholder */}
        <Card className="h-48 bg-secondary border-border flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Interactive map coming soon</p>
          </div>
        </Card>

        {/* Sites List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {favouritesOnly ? "My Favourite Sites" : "Sites"}
          </h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No sites found</h3>
              <p className="text-muted-foreground mb-6">
                {favouritesOnly
                  ? "You haven't favourited any sites yet"
                  : "Try adjusting your filters or add a new site"}
              </p>
              <Button onClick={() => navigate("/sites/add")}>Add a Site</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {sites.map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Sites;
