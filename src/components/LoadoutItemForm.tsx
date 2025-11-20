import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { PlannedLoadoutItem } from "@/hooks/usePlannedLoadouts";

interface LoadoutItemFormProps {
  onSubmit: (item: Omit<PlannedLoadoutItem, "id" | "created_at">) => void;
  onCancel: () => void;
  loadoutId: string;
  initialData?: PlannedLoadoutItem;
}

const ITEM_CATEGORIES = [
  "Primary Gun",
  "Secondary Gun",
  "Sight/Optic",
  "Magazine",
  "Vest/Plate Carrier",
  "Helmet",
  "Holster",
  "Pouch",
  "Battery",
  "Accessory",
  "Other",
];

export const LoadoutItemForm = ({
  onSubmit,
  onCancel,
  loadoutId,
  initialData,
}: LoadoutItemFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    photo_url: initialData?.photo_url || "",
    price: initialData?.price?.toString() || "",
    retailer_name: initialData?.retailer_name || "",
    purchase_link: initialData?.purchase_link || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      loadout_id: loadoutId,
      name: formData.name,
      category: formData.category,
      photo_url: formData.photo_url || undefined,
      price: parseFloat(formData.price) || 0,
      retailer_name: formData.retailer_name,
      purchase_link: formData.purchase_link || undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <Card className="p-6 border-primary/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {initialData ? "Edit Item" : "Add New Item"}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., CM16 Raider 2.0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {ITEM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (£) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="199.99"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retailer">Retailer *</Label>
            <Input
              id="retailer"
              value={formData.retailer_name}
              onChange={(e) =>
                setFormData({ ...formData, retailer_name: e.target.value })
              }
              placeholder="e.g., Patrol Base, BZ Paintball"
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="photo_url">Photo URL</Label>
            <Input
              id="photo_url"
              type="url"
              value={formData.photo_url}
              onChange={(e) =>
                setFormData({ ...formData, photo_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="purchase_link">Purchase Link</Label>
            <Input
              id="purchase_link"
              type="url"
              value={formData.purchase_link}
              onChange={(e) =>
                setFormData({ ...formData, purchase_link: e.target.value })
              }
              placeholder="https://shop.com/product"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any additional information..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 gap-2">
            <Plus className="w-4 h-4" />
            {initialData ? "Update Item" : "Add Item"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
