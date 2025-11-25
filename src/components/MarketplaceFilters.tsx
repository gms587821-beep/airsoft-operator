import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface MarketplaceFiltersProps {
  onFiltersChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    location?: string;
  }) => void;
}

const CONDITIONS = ["All", "New", "Like New", "Good", "Fair", "For Parts"];

export const MarketplaceFilters = ({ onFiltersChange }: MarketplaceFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [condition, setCondition] = useState<string>("All");
  const [location, setLocation] = useState<string>("");

  const activeFiltersCount = [
    priceRange[0] > 0 || priceRange[1] < 1000,
    condition !== "All",
    location !== "",
  ].filter(Boolean).length;

  const handleApplyFilters = () => {
    onFiltersChange({
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
      condition: condition !== "All" ? condition : undefined,
      location: location || undefined,
    });
  };

  const handleClearFilters = () => {
    setPriceRange([0, 1000]);
    setCondition("All");
    setLocation("");
    onFiltersChange({});
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="default" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge 
                variant="default" 
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <CollapsibleContent className="mt-4">
        <div className="border border-border rounded-lg p-4 space-y-6 bg-card">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Price Range</Label>
            <div className="px-2">
              <Slider
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>£{priceRange[0]}</span>
              <span>£{priceRange[1]}{priceRange[1] === 1000 ? "+" : ""}</span>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm font-semibold">
              Condition
            </Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger id="condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((cond) => (
                  <SelectItem key={cond} value={cond}>
                    {cond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Enter city or postcode..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Apply Button */}
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
