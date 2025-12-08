import { MapPin, Calendar, Ticket, DollarSign, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface GameSession {
  id: string;
  site_id?: string | null;
  site_name: string;
  site_location: string | null;
  game_date: string;
  is_upcoming: boolean;
  booking_reference: string | null;
  cost: number | null;
  notes: string | null;
  player_class: string | null;
  weapon_used: string | null;
  kills: number | null;
  deaths: number | null;
}

interface GameSessionCardProps {
  session: GameSession;
}

export const GameSessionCard = ({ session }: GameSessionCardProps) => {
  const navigate = useNavigate();

  const handleShare = () => {
    const params = new URLSearchParams({ type: 'game_recap', sessionId: session.id });
    if (session.site_id) params.set('siteId', session.site_id);
    navigate(`/feed/create?${params.toString()}`);
  };

  return (
    <Card className="p-6 bg-card border-border shadow-card hover:shadow-tactical transition-smooth">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground text-xl">{session.site_name}</h3>
            {session.site_location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{session.site_location}</span>
              </div>
            )}
          </div>
          <Badge variant={session.is_upcoming ? "default" : "secondary"}>
            {session.is_upcoming ? "Upcoming" : "Past"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <div className="text-muted-foreground text-xs">Date</div>
              <div className="text-foreground font-medium">
                {format(new Date(session.game_date), "MMM dd, yyyy")}
              </div>
            </div>
          </div>

          {session.cost && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <div className="text-muted-foreground text-xs">Cost</div>
                <div className="text-foreground font-medium">£{session.cost}</div>
              </div>
            </div>
          )}

          {session.booking_reference && (
            <div className="flex items-center gap-2 col-span-2">
              <Ticket className="h-4 w-4 text-primary" />
              <div>
                <div className="text-muted-foreground text-xs">Booking Ref</div>
                <div className="text-foreground font-medium">{session.booking_reference}</div>
              </div>
            </div>
          )}
        </div>

        {(session.player_class || session.weapon_used || (session.kills !== null && session.deaths !== null)) && (
          <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border">
            {session.player_class && (
              <div>
                <div className="text-muted-foreground text-xs">Class</div>
                <div className="text-foreground font-medium">{session.player_class}</div>
              </div>
            )}

            {session.weapon_used && (
              <div>
                <div className="text-muted-foreground text-xs">Weapon</div>
                <div className="text-foreground font-medium">{session.weapon_used}</div>
              </div>
            )}

            {(session.kills !== null && session.deaths !== null) && (
              <div className="col-span-2">
                <div className="text-muted-foreground text-xs">K/D Ratio</div>
                <div className="text-foreground font-medium">
                  {session.kills}/{session.deaths} ({session.deaths > 0 ? (session.kills / session.deaths).toFixed(2) : session.kills})
                </div>
              </div>
            )}
          </div>
        )}

        {session.notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">{session.notes}</p>
          </div>
        )}

        {/* Share Button */}
        <div className="pt-2 border-t border-border">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share as Post
          </Button>
        </div>
      </div>
    </Card>
  );
};
