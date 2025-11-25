import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListing } from "@/hooks/useMarketplaceListings";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "@/hooks/use-toast";

const MarketplaceListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: listing, isLoading, error } = useListing(id!);

  if (isLoading) {
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

  if (error || !listing) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Listing not found</h2>
          <Button onClick={() => navigate("/marketplace")} variant="outline">
            Back to Marketplace
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleContactSeller = () => {
    toast({
      title: "Coming soon",
      description: "Messaging feature will be available in a future update.",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/marketplace")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Listing Details</h1>
        </div>

        {/* Listing Image */}
        {listing.image_url && (
          <Card className="overflow-hidden">
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-64 object-cover"
            />
          </Card>
        )}

        {/* Listing Info */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{listing.title}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>by Player</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                £{listing.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{listing.category}</Badge>
            <Badge variant="outline">{listing.condition}</Badge>
            {listing.location && (
              <Badge variant="outline">
                <MapPin className="w-3 h-3 mr-1" />
                {listing.location}
              </Badge>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          )}

          {/* Contact Seller */}
          <div className="pt-4 border-t border-border">
            <Button
              className="w-full"
              size="lg"
              onClick={handleContactSeller}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Seller
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Messaging feature coming soon
            </p>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-border text-xs text-muted-foreground">
            <p>Listed on {new Date(listing.created_at).toLocaleDateString()}</p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MarketplaceListingDetail;
