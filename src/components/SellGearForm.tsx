import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useCreateListing } from "@/hooks/useMarketplaceListings";
import { useGuns } from "@/hooks/useGuns";
import { Loader2 } from "lucide-react";

interface SellGearFormData {
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  location: string;
  image_url: string;
  linked_gun_id?: string;
}

const CATEGORIES = [
  "Rifle",
  "Pistol",
  "SMG",
  "Shotgun",
  "Sniper",
  "Support",
  "Gear",
  "Upgrade",
  "Accessory",
  "Other",
];

const CONDITIONS = ["New", "Like New", "Used", "Heavily Used"];

export const SellGearForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SellGearFormData>();
  const createListing = useCreateListing();
  const { guns = [] } = useGuns();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: SellGearFormData) => {
    setIsSubmitting(true);
    try {
      const listing = await createListing.mutateAsync({
        ...data,
        currency: "GBP",
        is_active: true,
      });
      navigate(`/marketplace/listing/${listing.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Tokyo Marui M4A1 AEG"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select onValueChange={(value) => setValue("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">Condition *</Label>
        <Select onValueChange={(value) => setValue("condition", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {CONDITIONS.map((cond) => (
              <SelectItem key={cond} value={cond}>
                {cond}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.condition && (
          <p className="text-sm text-destructive">{errors.condition.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (£) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Price must be positive" },
          })}
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g., London, UK"
          {...register("location")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe the item's condition, history, any modifications..."
          rows={5}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          type="url"
          placeholder="https://..."
          {...register("image_url")}
        />
      </div>

      {guns.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="linked_gun_id">Link to Arsenal Gun (Optional)</Label>
          <Select onValueChange={(value) => setValue("linked_gun_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a gun from your arsenal" />
            </SelectTrigger>
            <SelectContent>
              {guns.map((gun) => (
                <SelectItem key={gun.id} value={gun.id}>
                  {gun.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => navigate("/marketplace")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Listing
        </Button>
      </div>
    </form>
  );
};
