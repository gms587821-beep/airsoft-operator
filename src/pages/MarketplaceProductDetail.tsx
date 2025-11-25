import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Package, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/useMarketplaceProducts";
import { AppLayout } from "@/components/AppLayout";

const MarketplaceProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id!);

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

  if (error || !product) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Product not found</h2>
          <Button onClick={() => navigate("/marketplace")} variant="outline">
            Back to Marketplace
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/marketplace")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Product Details</h1>
        </div>

        {/* Product Image */}
        {product.image_url && (
          <Card className="overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
          </Card>
        )}

        {/* Product Info */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
              {product.brand && (
                <p className="text-muted-foreground">by {product.brand}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                £{product.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.role && <Badge variant="outline">{product.role}</Badge>}
            {product.is_affiliate && (
              <Badge className="bg-accent text-accent-foreground">
                Affiliate
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {product.is_affiliate && product.affiliate_url && (
            <div className="pt-4 border-t border-border space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={() => window.open(product.affiliate_url, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View at Retailer
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Affiliate link - no extra cost to you
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default MarketplaceProductDetail;
