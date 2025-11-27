import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Plus, Heart, Filter, Trophy, Calendar } from "lucide-react";
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
import { useIsSiteFavourite, useToggleSiteFavourite, useSiteFavourites } from "@/hooks/useSiteFavourites";
import { useSiteRatingStats } from "@/hooks/useSiteRatings";
import { Skeleton } from "@/components/ui/skeleton";
import { SitesMap } from "@/components/SitesMap";
import { useGameSessions } from "@/hooks/useGameSessions";
import { useOperators } from "@/hooks/useOperators";
import { useProfile } from "@/hooks/useProfile";
import { OperatorBanner } from "@/components/OperatorBanner";
import { getOperatorAdviceForPage } from "@/lib/operatorLogic";

const FIELD_TYPES = ["All", "CQB", "Woodland", "Indoor", "Mixed", "Milsim", "Shop"];
const LOCATION_TYPES = ["All", "Playing Sites", "Shops"];

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
  const [locationType, setLocationType] = useState<string>("All");
  const [favouritesOnly, setFavouritesOnly] = useState(false);

  const { data: sites = [], isLoading } = useSites({
    fieldType: fieldType === "All" ? undefined : fieldType,
    searchTerm: searchTerm || undefined,
    favouritesOnly,
    locationType: locationType === "All" ? undefined : locationType,
  });

  const { gameSessions } = useGameSessions();
  const { data: favourites = [] } = useSiteFavourites();
  const { activeOperator } = useOperators();
  const { data: profile } = useProfile();
  
  const favouriteSites = sites.filter(s => favourites.some(f => f.site_id === s.id));
  const operatorAdvice = activeOperator ? getOperatorAdviceForPage(
    "sites",
    profile || null,
    [],
    [],
    gameSessions,
    favouriteSites
  ) : null;

  // Calculate activity stats
  const activityStats = useMemo(() => {
    const totalSessions = gameSessions.length;
    const uniqueSites = new Set(gameSessions.map((s) => s.site_id).filter(Boolean));
    const uniqueSiteCount = uniqueSites.size;

    // Find most played site
    const siteCounts = gameSessions.reduce((acc, session) => {
      if (session.site_id) {
        acc[session.site_id] = (acc[session.site_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostPlayedSiteId = Object.entries(siteCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    const mostPlayedSite = sites.find((s) => s.id === mostPlayedSiteId);

    // Get most recent favourite
    const recentFavourite = favourites.length > 0
      ? sites.find((s) => s.id === favourites[0]?.site_id)
      : null;

    return {
      totalSessions,
      uniqueSiteCount,
      mostPlayedSite,
      recentFavourite,
    };
  }, [gameSessions, sites, favourites]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Operator Banner */}
        {activeOperator && operatorAdvice && locationType !== "Shops" && (
          <OperatorBanner
            operator={activeOperator}
            message={operatorAdvice.message}
            actionLabel={operatorAdvice.actionLabel}
            actionPath={operatorAdvice.actionPath}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">
            {locationType === "Shops" ? "Airsoft Shops" : locationType === "Playing Sites" ? "Airsoft Sites" : "Sites & Shops"}
          </h1>
          <Button onClick={() => navigate("/sites/add")}>
            <Plus className="w-4 h-4 mr-2" />
            Add {locationType === "Shops" ? "Shop" : "Site"}
          </Button>
        </div>

        {/* Your Activity Summary */}
        {locationType !== "Shops" && (
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Your Activity</h3>
                {activityStats.totalSessions > 0 ? (
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      You've logged <strong className="text-foreground">{activityStats.totalSessions}</strong>{" "}
                      sessions across <strong className="text-foreground">{activityStats.uniqueSiteCount}</strong>{" "}
                      sites.
                    </p>
                    {activityStats.mostPlayedSite && (
                      <p className="text-muted-foreground">
                        Most played:{" "}
                        <strong className="text-foreground">{activityStats.mostPlayedSite.name}</strong>
                      </p>
                    )}
                    {activityStats.recentFavourite && (
                      <p className="text-muted-foreground">
                        Favourite site:{" "}
                        <strong className="text-foreground">{activityStats.recentFavourite.name}</strong>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You haven't logged any sessions yet.
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/player-log")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Log Session
              </Button>
            </div>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={locationType === "Shops" ? "Search shops by name or location..." : "Search sites by name or location..."}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger className="w-[170px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Playing Sites">🪖 Playing Sites</SelectItem>
                <SelectItem value="Shops">🛒 Shops & Retail</SelectItem>
              </SelectContent>
            </Select>
            {locationType !== "Shops" && (
              <Select value={fieldType} onValueChange={setFieldType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.filter(t => t !== "Shop").map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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

        {/* Interactive Map */}
        <SitesMap sites={sites} onSiteClick={(siteId) => navigate(`/sites/${siteId}`)} />

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
