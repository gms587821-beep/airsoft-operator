import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Wrench, Trash2, MessageSquare } from "lucide-react";
import { Gun } from "@/hooks/useGuns";
import { useNavigate } from "react-router-dom";

interface GunCardProps {
  gun: Gun;
  onDelete: (id: string) => void;
  onEdit: (gun: Gun) => void;
}

export const GunCard = ({ gun, onDelete, onEdit }: GunCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden bg-card border-border shadow-elegant group hover:border-primary/30 transition-smooth">
      {/* Gun Photo */}
      <div className="relative h-48 bg-gradient-tactical overflow-hidden">
        {gun.photo_url ? (
          <img 
            src={gun.photo_url} 
            alt={gun.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Target className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {gun.gun_type}
          </Badge>
        </div>
      </div>

      {/* Gun Info */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">{gun.name}</h3>
          {gun.brand && gun.model && (
            <p className="text-sm text-muted-foreground">
              {gun.brand} - {gun.model}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {gun.fps && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">FPS</p>
              <p className="text-lg font-bold text-primary">{gun.fps}</p>
            </div>
          )}
          {gun.joules && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Joules</p>
              <p className="text-lg font-bold text-primary">{gun.joules}J</p>
            </div>
          )}
        </div>

        {/* Upgrades */}
        {gun.upgrades && gun.upgrades.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Upgrades</p>
            <div className="flex flex-wrap gap-1">
              {gun.upgrades.slice(0, 3).map((upgrade, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {upgrade}
                </Badge>
              ))}
              {gun.upgrades.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{gun.upgrades.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/operator?gunId=${gun.id}&gunName=${encodeURIComponent(gun.name)}`)}
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Diagnose
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(gun)}
            className="gap-2"
          >
            <Wrench className="w-4 h-4" />
            Edit
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(gun.id)}
          className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
          Remove from Arsenal
        </Button>
      </div>
    </Card>
  );
};
