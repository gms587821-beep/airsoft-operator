import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { useCreateSite } from "@/hooks/useSites";

interface AddSiteFormData {
  name: string;
  country: string;
  region: string;
  city: string;
  field_type: string;
  description: string;
  chrono_rules: string;
  website_url: string;
  booking_url: string;
  thumbnail_url: string;
}

const FIELD_TYPES = ["CQB", "Woodland", "Indoor", "Mixed", "Milsim"];

const AddSite = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<AddSiteFormData>();
  const createSite = useCreateSite();

  const onSubmit = async (data: AddSiteFormData) => {
    const site = await createSite.mutateAsync({
      ...data,
      region: data.region || undefined,
      city: data.city || undefined,
      description: data.description || undefined,
      chrono_rules: data.chrono_rules || undefined,
      website_url: data.website_url || undefined,
      booking_url: data.booking_url || undefined,
      thumbnail_url: data.thumbnail_url || undefined,
    });
    navigate(`/sites/${site.id}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/sites")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Add Airsoft Site</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Tactical Warfare"
                {...register("name", { required: "Site name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                placeholder="e.g., United Kingdom"
                {...register("country", { required: "Country is required" })}
              />
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  placeholder="e.g., Surrey"
                  {...register("region")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g., London"
                  {...register("city")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_type">Field Type *</Label>
              <Select onValueChange={(value) => setValue("field_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.field_type && (
                <p className="text-sm text-destructive">{errors.field_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the site, facilities, game modes..."
                rows={4}
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chrono_rules">Chrono Rules</Label>
              <Textarea
                id="chrono_rules"
                placeholder="e.g., CQB: 350 FPS, Woodland: 400 FPS, DMR: 450 FPS..."
                rows={3}
                {...register("chrono_rules")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                type="url"
                placeholder="https://..."
                {...register("website_url")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking_url">Booking URL</Label>
              <Input
                id="booking_url"
                type="url"
                placeholder="https://..."
                {...register("booking_url")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail Image URL</Label>
              <Input
                id="thumbnail_url"
                type="url"
                placeholder="https://..."
                {...register("thumbnail_url")}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/sites")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createSite.isPending}
              >
                Add Site
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AddSite;
