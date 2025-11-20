import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, ShoppingCart, PackageOpen } from "lucide-react";
import { PlannedLoadout } from "@/hooks/usePlannedLoadouts";
import { useNavigate } from "react-router-dom";

interface LoadoutCardProps {
  loadout: PlannedLoadout;
  onDelete: (id: string) => void;
}

export const LoadoutCard = ({ loadout, onDelete }: LoadoutCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 hover:border-primary/50 transition-all group">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {loadout.name}
            </h3>
            {loadout.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {loadout.description}
              </p>
            )}
          </div>
          <PackageOpen className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="text-2xl font-bold text-primary">
              £{Number(loadout.total_cost || 0).toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/loadout-builder/${loadout.id}`)}
              className="hover:border-primary hover:text-primary"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(loadout.id)}
              className="hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          className="w-full gap-2"
          onClick={() => navigate(`/loadout-builder/${loadout.id}`)}
        >
          <ShoppingCart className="w-4 h-4" />
          View & Edit Build
        </Button>
      </div>
    </Card>
  );
};
