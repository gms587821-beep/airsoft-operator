import { useState } from "react";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface GameSessionFormProps {
  onClose: () => void;
}

export const GameSessionForm = ({ onClose }: GameSessionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    site_name: "",
    site_location: "",
    game_date: "",
    is_upcoming: true,
    booking_reference: "",
    cost: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("game_sessions").insert({
        user_id: user.id,
        site_name: formData.site_name,
        site_location: formData.site_location || null,
        game_date: formData.game_date,
        is_upcoming: formData.is_upcoming,
        booking_reference: formData.booking_reference || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast({
        title: "Game session added",
        description: "Your session has been added to your player log",
      });
      onClose();
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-card border-border shadow-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Add Game Session</h3>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name *</Label>
            <Input
              id="site_name"
              required
              value={formData.site_name}
              onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
              placeholder="e.g., Combat South"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_location">Location</Label>
            <Input
              id="site_location"
              value={formData.site_location}
              onChange={(e) => setFormData({ ...formData, site_location: e.target.value })}
              placeholder="e.g., Kent, UK"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="game_date">Game Date *</Label>
            <Input
              id="game_date"
              type="date"
              required
              value={formData.game_date}
              onChange={(e) => setFormData({ ...formData, game_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost (£)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="booking_reference">Booking Reference</Label>
            <Input
              id="booking_reference"
              value={formData.booking_reference}
              onChange={(e) => setFormData({ ...formData, booking_reference: e.target.value })}
              placeholder="e.g., BK12345"
            />
          </div>

          <div className="flex items-center justify-between col-span-2 p-4 bg-secondary rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_upcoming" className="text-base">Upcoming Game</Label>
              <p className="text-sm text-muted-foreground">
                Toggle if this is a future game session
              </p>
            </div>
            <Switch
              id="is_upcoming"
              checked={formData.is_upcoming}
              onCheckedChange={(checked) => setFormData({ ...formData, is_upcoming: checked })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add notes about this game session..."
            rows={3}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Session"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
