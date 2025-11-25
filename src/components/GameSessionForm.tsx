import { useState, useEffect } from "react";
import { X, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSites } from "@/hooks/useSites";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GameSessionFormProps {
  onClose: () => void;
}

export const GameSessionForm = ({ onClose }: GameSessionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: sites = [] } = useSites();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteSearchOpen, setSiteSearchOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    site_name: "",
    site_location: "",
    game_date: "",
    is_upcoming: true,
    booking_reference: "",
    cost: "",
    notes: "",
    player_class: "",
    weapon_used: "",
    kills: "",
    deaths: "",
  });

  // Auto-populate location when site is selected
  useEffect(() => {
    if (selectedSiteId) {
      const site = sites.find(s => s.id === selectedSiteId);
      if (site) {
        setFormData(prev => ({
          ...prev,
          site_name: site.name,
          site_location: [site.city, site.region, site.country].filter(Boolean).join(", "),
        }));
      }
    }
  }, [selectedSiteId, sites]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("game_sessions").insert({
        user_id: user.id,
        site_id: selectedSiteId || null,
        site_name: formData.site_name,
        site_location: formData.site_location || null,
        game_date: formData.game_date,
        is_upcoming: formData.is_upcoming,
        booking_reference: formData.booking_reference || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        notes: formData.notes || null,
        player_class: formData.player_class || null,
        weapon_used: formData.weapon_used || null,
        kills: formData.kills ? parseInt(formData.kills) : 0,
        deaths: formData.deaths ? parseInt(formData.deaths) : 0,
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
          <div className="space-y-2 col-span-2">
            <Label htmlFor="site_name">Site Name *</Label>
            <Popover open={siteSearchOpen} onOpenChange={setSiteSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={siteSearchOpen}
                  className="w-full justify-between"
                >
                  {formData.site_name || "Select a site or enter custom name..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search sites..." 
                    onValueChange={(value) => {
                      if (value && !sites.some(s => s.name === value)) {
                        setFormData({ ...formData, site_name: value });
                      }
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <div className="p-2 text-sm">
                        <p className="text-muted-foreground mb-2">No site found.</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSiteSearchOpen(false);
                            setSelectedSiteId(null);
                          }}
                        >
                          Use Custom Name
                        </Button>
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {sites.map((site) => (
                        <CommandItem
                          key={site.id}
                          value={site.name}
                          onSelect={() => {
                            setSelectedSiteId(site.id);
                            setSiteSearchOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{site.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {[site.city, site.region, site.country].filter(Boolean).join(", ")}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {!selectedSiteId && (
              <Input
                id="site_name"
                required
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="Or type a custom site name..."
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="site_location">Location</Label>
            <Input
              id="site_location"
              value={formData.site_location}
              onChange={(e) => setFormData({ ...formData, site_location: e.target.value })}
              placeholder="e.g., Kent, UK"
              disabled={!!selectedSiteId}
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

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="player_class">Class/Role</Label>
            <Input
              id="player_class"
              value={formData.player_class}
              onChange={(e) => setFormData({ ...formData, player_class: e.target.value })}
              placeholder="e.g., Sniper, Assault, Support"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weapon_used">Weapon Used</Label>
            <Input
              id="weapon_used"
              value={formData.weapon_used}
              onChange={(e) => setFormData({ ...formData, weapon_used: e.target.value })}
              placeholder="e.g., M4 Carbine, AK-47"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kills">Kills</Label>
            <Input
              id="kills"
              type="number"
              value={formData.kills}
              onChange={(e) => setFormData({ ...formData, kills: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deaths">Deaths</Label>
            <Input
              id="deaths"
              type="number"
              value={formData.deaths}
              onChange={(e) => setFormData({ ...formData, deaths: e.target.value })}
              placeholder="0"
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
