import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Site } from "@/hooks/useSites";

interface SitesMapProps {
  sites: Site[];
  onSiteClick?: (siteId: string) => void;
}

export const SitesMap = ({ sites, onSiteClick }: SitesMapProps) => {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Filter sites that have coordinates
  const sitesWithCoords = sites.filter(
    (site) => site.latitude && site.longitude
  );

  // Calculate center based on sites or default to UK
  const center =
    sitesWithCoords.length > 0
      ? {
          lat: sitesWithCoords.reduce((sum, site) => sum + Number(site.latitude), 0) / sitesWithCoords.length,
          lng: sitesWithCoords.reduce((sum, site) => sum + Number(site.longitude), 0) / sitesWithCoords.length,
        }
      : { lat: 54.5, lng: -3 }; // UK center

  if (!apiKey) {
    return (
      <div className="h-48 bg-secondary border-border rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2 p-4">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-sm">
            Google Maps API key not configured
          </p>
        </div>
      </div>
    );
  }

  if (sitesWithCoords.length === 0) {
    return (
      <div className="h-48 bg-secondary border-border rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No sites with locations to display</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-96 rounded-lg overflow-hidden border border-border shadow-tactical">
        <Map
          mapId="airsoft-sites-map"
          defaultCenter={center}
          defaultZoom={sitesWithCoords.length === 1 ? 12 : 6}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {sitesWithCoords.map((site) => (
            <AdvancedMarker
              key={site.id}
              position={{
                lat: Number(site.latitude),
                lng: Number(site.longitude),
              }}
              onClick={() => setSelectedSite(site)}
            >
              <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Navigation className="w-4 h-4 fill-current" />
              </div>
            </AdvancedMarker>
          ))}

          {selectedSite && (
            <InfoWindow
              position={{
                lat: Number(selectedSite.latitude),
                lng: Number(selectedSite.longitude),
              }}
              onCloseClick={() => setSelectedSite(null)}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">{selectedSite.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {[selectedSite.city, selectedSite.region, selectedSite.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-xs">
                  <span className="font-medium">Type:</span> {selectedSite.field_type}
                </p>
                {onSiteClick && (
                  <button
                    onClick={() => onSiteClick(selectedSite.id)}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    View Details
                  </button>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};
