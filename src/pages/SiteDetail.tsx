import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ExternalLink, Star, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppLayout } from "@/components/AppLayout";
import { useSite } from "@/hooks/useSites";
import { useSiteRatings, useSiteRatingStats, useUserSiteRating } from "@/hooks/useSiteRatings";
import { useIsSiteFavourite, useToggleSiteFavourite } from "@/hooks/useSiteFavourites";
import { useGameSessions } from "@/hooks/useGameSessions";
import { SiteRatingForm } from "@/components/SiteRatingForm";

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRatingForm, setShowRatingForm] = useState(false);

  const { data: site, isLoading: siteLoading } = useSite(id!);
  const { data: ratings = [] } = useSiteRatings(id!);
  const { data: userRating } = useUserSiteRating(id!);
  const ratingStats = useSiteRatingStats(id!);
  const isFavourite = useIsSiteFavourite(id!);
  const toggleFavourite = useToggleSiteFavourite();
  const { gameSessions } = useGameSessions();

  const sessionsAtSite = gameSessions.filter((session) => session.site_id === id);

  if (siteLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!site) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Site not found</h2>
          <Button onClick={() => navigate("/sites")} variant="outline">
            Back to Sites
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/sites")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground flex-1">{site.name}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavourite.mutate({ siteId: site.id, isFavourite })}
            className={isFavourite ? "text-destructive" : ""}
          >
            <Heart className={`w-5 h-5 ${isFavourite ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Site Image */}
        {site.thumbnail_url && (
          <Card className="overflow-hidden">
            <img
              src={site.thumbnail_url}
              alt={site.name}
              className="w-full h-64 object-cover"
            />
          </Card>
        )}

        {/* Site Info */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Badge variant="secondary">{site.field_type}</Badge>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {[site.city, site.region, site.country].filter(Boolean).join(", ")}
                </span>
              </div>
            </div>
            {ratingStats.count > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                  <Star className="w-6 h-6 fill-current" />
                  {ratingStats.averageOverall.toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">{ratingStats.count} ratings</p>
              </div>
            )}
          </div>

          {/* Description */}
          {site.description && (
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-2">About</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{site.description}</p>
            </div>
          )}

          {/* Contact & Hours */}
          {(site.phone || site.opening_hours) && (
            <div className="pt-4 border-t border-border space-y-2">
              <h3 className="font-semibold text-foreground mb-2">Contact & Hours</h3>
              {site.phone && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground w-24">Phone:</span>
                  <span className="text-sm text-foreground">{site.phone}</span>
                </div>
              )}
              {site.opening_hours && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground w-24">Hours:</span>
                  <span className="text-sm text-foreground whitespace-pre-wrap">{site.opening_hours}</span>
                </div>
              )}
            </div>
          )}

          {/* Chrono Rules */}
          {site.chrono_rules && (
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-2">FPS/Joule Limits</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{site.chrono_rules}</p>
            </div>
          )}

          {/* Links */}
          {(site.website_url || site.booking_url) && (
            <div className="pt-4 border-t border-border flex gap-3">
              {site.website_url && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(site.website_url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Website
                </Button>
              )}
              {site.booking_url && (
                <Button
                  className="flex-1"
                  onClick={() => window.open(site.booking_url, "_blank")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Detailed Ratings */}
        {ratingStats.count > 0 && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Ratings Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Safety</p>
                <p className="text-lg font-bold text-primary">
                  {ratingStats.averageSafety.toFixed(1)} ★
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marshals</p>
                <p className="text-lg font-bold text-primary">
                  {ratingStats.averageMarshal.toFixed(1)} ★
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gameplay</p>
                <p className="text-lg font-bold text-primary">
                  {ratingStats.averageGameplay.toFixed(1)} ★
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* User Rating */}
        <Card className="p-6">
          <Button
            className="w-full"
            variant={userRating ? "outline" : "default"}
            onClick={() => setShowRatingForm(true)}
          >
            <Star className="w-4 h-4 mr-2" />
            {userRating ? "Update Your Rating" : "Rate This Site"}
          </Button>
        </Card>

        {/* Your Sessions */}
        {sessionsAtSite.length > 0 && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Your Sessions at This Site</h3>
            <div className="space-y-2">
              {sessionsAtSite.map((session) => (
                <div
                  key={session.id}
                  className="p-3 bg-secondary rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(session.game_date).toLocaleDateString()}
                    </p>
                    {session.weapon_used && (
                      <p className="text-sm text-muted-foreground">{session.weapon_used}</p>
                    )}
                  </div>
                  <Badge variant="outline">{session.player_class || "General"}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Ratings */}
        {ratings.length > 0 && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Recent Reviews</h3>
            <div className="space-y-4">
              {ratings.slice(0, 5).map((rating) => (
                <div key={rating.id} className="pb-4 border-b border-border last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-primary">
                      {[...Array(rating.overall_rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-muted-foreground">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Rating Form Dialog */}
        <Dialog open={showRatingForm} onOpenChange={setShowRatingForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate {site.name}</DialogTitle>
            </DialogHeader>
            <SiteRatingForm
              siteId={site.id}
              existingRating={userRating || undefined}
              onSuccess={() => setShowRatingForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default SiteDetail;
