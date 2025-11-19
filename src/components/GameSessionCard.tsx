import { MapPin, Calendar, Ticket, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface GameSession {
  id: string;
  site_name: string;
  site_location: string | null;
  game_date: string;
  is_upcoming: boolean;
  booking_reference: string | null;
  cost: number | null;
  notes: string | null;
}

interface GameSessionCardProps {
  session: GameSession;
}

export const GameSessionCard = ({ session }: GameSessionCardProps) => {
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

        {session.notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">{session.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
