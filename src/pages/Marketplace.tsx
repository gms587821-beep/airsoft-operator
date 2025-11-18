import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useState } from "react";

const Marketplace = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const mockListings = [
    {
      id: 1,
      title: "Tokyo Marui AEG M4A1",
      price: "£249",
      condition: "Used",
      fps: "340 FPS",
      image: "🔫",
      seller: "TacticalPlayer99",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Krytac Trident MK2 CRB",
      price: "£389",
      condition: "New",
      fps: "350 FPS",
      image: "🔫",
      seller: "AirsoftPro",
      rating: 5.0,
    },
    {
      id: 3,
      title: "G&G CM16 Raider",
      price: "£145",
      condition: "Used",
      fps: "330 FPS",
      image: "🔫",
      seller: "GearHead420",
      rating: 4.5,
    },
    {
      id: 4,
      title: "ASG CZ Scorpion EVO",
      price: "£325",
      condition: "Like New",
      fps: "360 FPS",
      image: "🔫",
      seller: "CQBMaster",
      rating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
          
          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button variant="outline" size="icon" className="border-border">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="flex gap-1 bg-card rounded-lg p-1 border border-border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "space-y-4"}>
          {mockListings.map((listing) => (
            <Card
              key={listing.id}
              className="p-4 bg-card border-border shadow-card hover:shadow-tactical transition-smooth cursor-pointer group"
            >
              <div className={viewMode === "grid" ? "space-y-3" : "flex gap-4"}>
                {/* Product Image */}
                <div className={`bg-secondary rounded-lg flex items-center justify-center ${
                  viewMode === "grid" ? "h-40" : "h-24 w-24 flex-shrink-0"
                }`}>
                  <span className="text-5xl">{listing.image}</span>
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                      {listing.title}
                    </h3>
                    <Badge
                      variant={listing.condition === "New" ? "default" : "secondary"}
                      className="flex-shrink-0"
                    >
                      {listing.condition}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-mono text-accent">{listing.fps}</span>
                    <span>•</span>
                    <span>{listing.seller}</span>
                    <span>•</span>
                    <span className="text-primary">★ {listing.rating}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-2xl font-bold text-foreground">
                      {listing.price}
                    </span>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 transition-smooth"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Marketplace;
