import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Package, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { useMarketplaceListings } from "@/hooks/useMarketplaceListings";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketplaceFilters } from "@/components/MarketplaceFilters";
import { useProfile } from "@/hooks/useProfile";
import { useGuns } from "@/hooks/useGuns";
import { useOperators } from "@/hooks/useOperators";
import { OperatorBanner } from "@/components/OperatorBanner";
import { getOperatorAdviceForPage } from "@/lib/operatorLogic";

const CATEGORIES = ["All", "Rifle", "Pistol", "SMG", "Shotgun", "Sniper", "Support", "Gear", "Upgrade", "Accessory"];

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"all" | "curated" | "listings" | "my-listings">("all");
  const [advancedFilters, setAdvancedFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    location?: string;
  }>({});

  const { data: profile } = useProfile();
  const { guns = [] } = useGuns();
  const { activeOperator } = useOperators();
  
  const operatorAdvice = activeOperator ? getOperatorAdviceForPage(
    "marketplace",
    profile || null,
    guns,
    [],
    [],
    []
  ) : null;

  const {
    data: products = [],
    isLoading: productsLoading,
  } = useMarketplaceProducts({
    category: category === "All" ? undefined : category,
    searchTerm: searchTerm || undefined,
  });

  const {
    data: listings = [],
    isLoading: listingsLoading,
  } = useMarketplaceListings({
    category: category === "All" ? undefined : category,
    searchTerm: searchTerm || undefined,
    myListingsOnly: activeTab === "my-listings",
    ...advancedFilters,
  });

  const isLoading = productsLoading || listingsLoading;

  const displayedProducts = activeTab === "curated" || activeTab === "all" ? products : [];
  const displayedListings =
    activeTab === "listings" || activeTab === "all" || activeTab === "my-listings" ? listings : [];

  // Get role-specific recommendations
  const roleProducts = profile?.primary_role
    ? products.filter(
        (p) =>
          p.role?.toLowerCase() === profile.primary_role?.toLowerCase() ||
          p.tags?.some((tag) => tag.toLowerCase().includes(profile.primary_role?.toLowerCase() || "")) ||
          p.category.toLowerCase().includes(profile.primary_role?.toLowerCase() || "")
      )
    : [];

  // Get arsenal upgrade suggestions
  const arsenalUpgrades = guns.length > 0
    ? products.filter((p) => {
        const gunTypes = guns.map((g) => g.gun_type.toLowerCase());
        return (
          p.category === "Upgrade" ||
          p.category === "Accessory" ||
          gunTypes.some((type) =>
            p.tags?.some((tag) => tag.toLowerCase().includes(type)) ||
            p.name.toLowerCase().includes(type)
          )
        );
      })
    : [];

  // Get operator advice
  const getOperatorAdvice = () => {
    if (!activeOperator || !profile?.primary_role) return null;

    const adviceMap: Record<string, string> = {
      cqb: "Focus on lightweight rifles and high-speed mags for tight corners.",
      dmr: "Prioritise consistency and optics over rate of fire.",
      support: "Look for high-capacity magazines and reliable feeding systems.",
      rifleman: "Balance mobility with firepower for versatile engagements.",
      sniper: "Upgrade triggers and hop-ups for maximum accuracy.",
    };

    return adviceMap[profile.primary_role] || "Choose gear that complements your play style.";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Buy, sell, and trade airsoft gear
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab("my-listings")}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              My Listings
            </Button>
            <Button onClick={() => navigate("/marketplace/sell")}>
              <Plus className="w-4 h-4 mr-2" />
              Sell Gear
            </Button>
          </div>
        </div>

        {/* Operator Banner */}
        {activeOperator && operatorAdvice && (
          <OperatorBanner
            operator={activeOperator}
            message={operatorAdvice.message}
            actionLabel={operatorAdvice.actionLabel}
            actionPath={operatorAdvice.actionPath}
          />
        )}

        {/* Recommended for your role */}
        {roleProducts.length > 0 && (
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Recommended for your {profile?.primary_role?.toUpperCase()} role
              </h2>
              <p className="text-sm text-muted-foreground">
                Gear and upgrades that align with how you play
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {roleProducts.slice(0, 5).map((product) => (
                <Card
                  key={product.id}
                  className="min-w-[280px] p-3 cursor-pointer hover:shadow-tactical transition-smooth group"
                  onClick={() => navigate(`/marketplace/product/${product.id}`)}
                >
                  <div className="space-y-2">
                    {product.image_url && (
                      <div className="h-32 bg-secondary rounded-lg overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-smooth line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">
                        £{product.price.toFixed(2)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upgrades for your arsenal */}
        {arsenalUpgrades.length > 0 && (
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Upgrades for your arsenal
              </h2>
              <p className="text-sm text-muted-foreground">
                Suggestions based on the guns you already own
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {arsenalUpgrades.slice(0, 5).map((product) => (
                <Card
                  key={product.id}
                  className="min-w-[280px] p-3 cursor-pointer hover:shadow-tactical transition-smooth group"
                  onClick={() => navigate(`/marketplace/product/${product.id}`)}
                >
                  <div className="space-y-2">
                    {product.image_url && (
                      <div className="h-32 bg-secondary rounded-lg overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-smooth line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">
                        £{product.price.toFixed(2)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <MarketplaceFilters onFiltersChange={setAdvancedFilters} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="curated">Curated</TabsTrigger>
            <TabsTrigger value="listings">Player Listings</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Curated Products */}
                {displayedProducts.length > 0 && (
                  <div className="space-y-4">
                    {activeTab === "all" && (
                      <h2 className="text-xl font-semibold text-foreground">Curated Products</h2>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {displayedProducts.map((product) => (
                        <Card
                          key={product.id}
                          className="p-4 cursor-pointer hover:shadow-tactical transition-smooth group"
                          onClick={() => navigate(`/marketplace/product/${product.id}`)}
                        >
                          <div className="space-y-3">
                            {product.image_url && (
                              <div className="h-40 bg-secondary rounded-lg overflow-hidden">
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                                  {product.name}
                                </h3>
                                {product.is_affiliate && (
                                  <Badge className="bg-accent text-accent-foreground">
                                    Affiliate
                                  </Badge>
                                )}
                              </div>
                              {product.brand && (
                                <p className="text-sm text-muted-foreground">{product.brand}</p>
                              )}
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-2xl font-bold text-primary">
                                  £{product.price.toFixed(2)}
                                </span>
                                <Badge variant="secondary">{product.category}</Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Player Listings */}
                {displayedListings.length > 0 && (
                  <div className="space-y-4">
                    {activeTab === "all" && (
                      <h2 className="text-xl font-semibold text-foreground">Player Listings</h2>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {displayedListings.map((listing) => (
                        <Card
                          key={listing.id}
                          className="p-4 cursor-pointer hover:shadow-tactical transition-smooth group"
                          onClick={() => navigate(`/marketplace/listing/${listing.id}`)}
                        >
                          <div className="space-y-3">
                            {listing.image_url && (
                              <div className="h-40 bg-secondary rounded-lg overflow-hidden">
                                <img
                                  src={listing.image_url}
                                  alt={listing.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                                  {listing.title}
                                </h3>
                                <Badge variant="outline">{listing.condition}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">by Player</p>
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-2xl font-bold text-primary">
                                  £{listing.price.toFixed(2)}
                                </span>
                                <Badge variant="secondary">{listing.category}</Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {displayedProducts.length === 0 && displayedListings.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters or search terms
                    </p>
                    {activeTab === "my-listings" && (
                      <Button onClick={() => navigate("/marketplace/sell")}>
                        Create Your First Listing
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Marketplace;
