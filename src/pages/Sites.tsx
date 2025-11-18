import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

const Sites = () => {
  const mockSites = [
    {
      id: 1,
      name: "Tactical Warfare",
      location: "London, UK",
      type: "CQB",
      distance: "2.3 miles",
      rating: 4.7,
      fpsLimit: "350 FPS",
    },
    {
      id: 2,
      name: "Woodland Combat Zone",
      location: "Surrey, UK",
      type: "Woodland",
      distance: "8.1 miles",
      rating: 4.9,
      fpsLimit: "400 FPS",
    },
    {
      id: 3,
      name: "Urban Ops Arena",
      location: "Manchester, UK",
      type: "Indoor",
      distance: "15.4 miles",
      rating: 4.5,
      fpsLimit: "340 FPS",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Airsoft Sites</h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sites by name or location..."
              className="pl-10 bg-card border-border"
            />
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
          <h2 className="text-xl font-semibold text-foreground">Nearby Sites</h2>
          {mockSites.map((site) => (
            <Card
              key={site.id}
              className="p-4 bg-card border-border shadow-card hover:shadow-tactical transition-smooth cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                      {site.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{site.location}</span>
                      <span>•</span>
                      <span>{site.distance}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{site.type}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      Max: <span className="text-accent font-mono">{site.fpsLimit}</span>
                    </span>
                    <span className="text-primary">★ {site.rating}</span>
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

export default Sites;
