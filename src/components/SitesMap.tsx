import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import { Site } from "@/hooks/useSites";
import L from "leaflet";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface SitesMapProps {
  sites: Site[];
  onSiteClick?: (siteId: string) => void;
}

export const SitesMap = ({ sites, onSiteClick }: SitesMapProps) => {
  // Filter sites that have coordinates
  const sitesWithCoords = sites.filter(
    (site) => site.latitude && site.longitude
  );

  // Calculate center based on sites or default to UK
  const centerLat =
    sitesWithCoords.length > 0
      ? sitesWithCoords.reduce((sum, site) => sum + Number(site.latitude), 0) /
        sitesWithCoords.length
      : 54.5;

  const centerLng =
    sitesWithCoords.length > 0
      ? sitesWithCoords.reduce((sum, site) => sum + Number(site.longitude), 0) /
        sitesWithCoords.length
      : -3;

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

  const zoomLevel = sitesWithCoords.length === 1 ? 12 : 6;

  return (
    <div className="h-96 rounded-lg overflow-hidden border border-border shadow-tactical">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sitesWithCoords.map((site) => (
          <Marker
            key={site.id}
            position={[Number(site.latitude), Number(site.longitude)]}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">{site.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {[site.city, site.region, site.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-xs">
                  <span className="font-medium">Type:</span> {site.field_type}
                </p>
                {onSiteClick && (
                  <button
                    onClick={() => onSiteClick(site.id)}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    View Details
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
