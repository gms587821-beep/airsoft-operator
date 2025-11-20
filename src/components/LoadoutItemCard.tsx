import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, ExternalLink, Package, ZoomIn } from "lucide-react";
import { PlannedLoadoutItem } from "@/hooks/usePlannedLoadouts";
import { ImagePreviewDialog } from "@/components/ImagePreviewDialog";

interface LoadoutItemCardProps {
  item: PlannedLoadoutItem;
  onDelete: (id: string) => void;
  onEdit: (item: PlannedLoadoutItem) => void;
}

export const LoadoutItemCard = ({
  item,
  onDelete,
  onEdit,
}: LoadoutItemCardProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:border-primary/50 transition-all">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div 
            className="w-full sm:w-32 h-32 bg-muted flex items-center justify-center overflow-hidden relative group cursor-pointer"
            onClick={() => item.photo_url && setPreviewOpen(true)}
          >
            {item.photo_url ? (
              <>
                <img
                  src={item.photo_url}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <Package className="w-12 h-12 text-muted-foreground" />
            )}
          </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground">{item.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.retailer_name}
              </p>
            </div>
            <p className="text-lg font-bold text-primary shrink-0">
              £{Number(item.price).toFixed(2)}
            </p>
          </div>

          {item.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.notes}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {item.purchase_link && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 flex-1 sm:flex-none"
                onClick={() => window.open(item.purchase_link, "_blank")}
              >
                <ExternalLink className="w-3 h-3" />
                Buy Now
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="hover:border-primary hover:text-primary"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          </div>
        </div>
      </Card>

      {item.photo_url && (
        <ImagePreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          imageUrl={item.photo_url}
          title={item.name}
          description={item.notes}
        />
      )}
    </>
  );
};
