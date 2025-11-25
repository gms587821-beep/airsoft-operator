import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { Site } from "@/hooks/useSites";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Vite
// We use CDN URLs so we don't have to rely on asset bundling quirks
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface SitesMapProps {
  sites: Site[];
  onSiteClick?: (siteId: string) => void;
}

export const SitesMap = ({ sites, onSiteClick }: SitesMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  // Filter sites that have coordinates
  const sitesWithCoords = sites.filter(
    (site) => site.latitude && site.longitude
  );

  // Calculate center based on sites or default to UK
  const centerLat =
    sitesWithCoords.length > 0
      ?
        sitesWithCoords.reduce((sum, site) => sum + Number(site.latitude), 0) /
        sitesWithCoords.length
      : 54.5;

  const centerLng =
    sitesWithCoords.length > 0
      ?
        sitesWithCoords.reduce((sum, site) => sum + Number(site.longitude), 0) /
        sitesWithCoords.length
      : -3;

  useEffect(() => {
    if (!mapRef.current) return;

    // If map already initialised, just update view and markers
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom: sitesWithCoords.length === 1 ? 12 : 6,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMapRef.current);
    } else {
      leafletMapRef.current.setView([centerLat, centerLng], sitesWithCoords.length === 1 ? 12 : 6);
    }

    // Clear existing markers
    leafletMapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        leafletMapRef.current?.removeLayer(layer);
      }
    });

    // Add markers for each site
    sitesWithCoords.forEach((site) => {
      const marker = L.marker([
        Number(site.latitude),
        Number(site.longitude),
      ]).addTo(leafletMapRef.current!);

      const address = [site.city, site.region, site.country]
        .filter(Boolean)
        .join(", ");

      const popupHtml = `
        <div class="p-2 min-w-[200px] text-left">
          <h3 class="font-semibold text-sm mb-1">${site.name}</h3>
          <p class="text-xs text-muted-foreground mb-2">${address}</p>
          <p class="text-xs mb-1"><span class="font-medium">Type:</span> ${
            site.field_type
          }</p>
          ${
            onSiteClick
              ? `<button data-site-id="${site.id}" class="mt-2 text-xs text-primary underline cursor-pointer">View Details</button>`
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupHtml);

      if (onSiteClick) {
        marker.on("popupopen", (e) => {
          const popup = e.popup as L.Popup;
          const container = popup.getElement();
          if (!container) return;

          const button = container.querySelector<HTMLButtonElement>(
            "button[data-site-id]"
          );
          if (!button) return;

          button.onclick = () => {
            const siteId = button.getAttribute("data-site-id");
            if (siteId) onSiteClick(siteId);
          };
        });
      }
    });

    return () => {
      // Clean up map on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [centerLat, centerLng, sitesWithCoords, onSiteClick]);

  if (sitesWithCoords.length === 0) {
    return (
      <div className="h-48 bg-secondary border-border rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            No sites with locations to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden border border-border shadow-tactical">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

