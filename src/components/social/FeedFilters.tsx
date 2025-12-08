import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostType, FeedFilters as FilterType } from "@/hooks/usePosts";
import { useSites } from "@/hooks/useSites";
import { Filter, X } from "lucide-react";

interface FeedFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const postTypes: { value: PostType; label: string }[] = [
  { value: 'build', label: 'Builds' },
  { value: 'game_recap', label: 'Game Recaps' },
  { value: 'tech', label: 'Tech' },
  { value: 'general', label: 'General' },
];

const gunPlatforms = [
  'AEG', 'GBB', 'GBBR', 'DMR', 'Sniper', 'HPA', 'Shotgun', 'Pistol'
];

export const FeedFilters = ({ filters, onFiltersChange }: FeedFiltersProps) => {
  const { data: sites } = useSites();

  const hasActiveFilters = filters.type || filters.siteId || filters.gunPlatform;

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.type || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, type: value === "all" ? undefined : value as PostType })}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Post Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {postTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.gunPlatform || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, gunPlatform: value === "all" ? undefined : value })}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {gunPlatforms.map(platform => (
              <SelectItem key={platform} value={platform}>{platform}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.siteId || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, siteId: value === "all" ? undefined : value })}
        >
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            {sites?.slice(0, 20).map(site => (
              <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
