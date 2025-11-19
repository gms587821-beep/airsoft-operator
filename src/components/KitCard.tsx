import { Package2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KitItem {
  id: string;
  name: string;
  item_type: string;
  brand: string | null;
  model: string | null;
  condition: string | null;
  purchase_price: number | null;
  photo_url: string | null;
}

interface KitCardProps {
  item: KitItem;
}

export const KitCard = ({ item }: KitCardProps) => {
  return (
    <Card className="p-4 bg-card border-border shadow-card hover:shadow-tactical transition-smooth">
      <div className="space-y-4">
        {item.photo_url ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
            <img
              src={item.photo_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-secondary flex items-center justify-center">
            <Package2 className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
            {item.condition && (
              <Badge variant="outline" className="text-xs">
                {item.condition}
              </Badge>
            )}
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="text-foreground font-medium">{item.item_type}</span>
            </div>
            {item.brand && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span className="text-foreground">{item.brand}</span>
              </div>
            )}
            {item.model && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span className="text-foreground">{item.model}</span>
              </div>
            )}
            {item.purchase_price && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="text-foreground font-medium">£{item.purchase_price}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
