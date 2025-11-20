import { useState, useEffect } from "react";
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
import { X, Plus, Package, ZoomIn } from "lucide-react";
import { PlannedLoadoutItem } from "@/hooks/usePlannedLoadouts";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { Switch } from "@/components/ui/switch";
import { ImagePreviewDialog } from "@/components/ImagePreviewDialog";

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
  const [useCatalog, setUseCatalog] = useState(!initialData);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const {
    products,
    getProductsByCategory,
    getSuppliersByProduct,
    categories,
    isLoading,
  } = useProductCatalog();

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    photo_url: initialData?.photo_url || "",
    price: initialData?.price?.toString() || "",
    retailer_name: initialData?.retailer_name || "",
    purchase_link: initialData?.purchase_link || "",
    notes: initialData?.notes || "",
  });

  // Auto-populate form when product is selected
  useEffect(() => {
    if (selectedProductId && useCatalog) {
      const product = products.find((p) => p.id === selectedProductId);
      if (product) {
        setFormData((prev) => ({
          ...prev,
          name: product.name,
          category: product.category,
          photo_url: product.photo_url || "",
          notes: product.description || "",
        }));
      }
    }
  }, [selectedProductId, products, useCatalog]);

  // Auto-populate price and retailer when supplier is selected
  useEffect(() => {
    if (selectedSupplierId && selectedProductId && useCatalog) {
      const suppliers = getSuppliersByProduct(selectedProductId);
      const supplier = suppliers.find((s) => s.id === selectedSupplierId);
      if (supplier) {
        setFormData((prev) => ({
          ...prev,
          price: supplier.price.toString(),
          retailer_name: supplier.supplier_name,
          purchase_link: supplier.purchase_link || "",
        }));
      }
    }
  }, [selectedSupplierId, selectedProductId, getSuppliersByProduct, useCatalog]);

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

        {!initialData && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Select from Catalog</p>
                <p className="text-xs text-muted-foreground">
                  Choose popular items with pre-filled details
                </p>
              </div>
            </div>
            <Switch
              checked={useCatalog}
              onCheckedChange={setUseCatalog}
              disabled={isLoading}
            />
          </div>
        )}

        {useCatalog && !initialData && (
          <>
            <div className="space-y-2">
              <Label htmlFor="catalog-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData({ ...formData, category: value });
                  setSelectedProductId("");
                  setSelectedSupplierId("");
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.category && (
              <div className="space-y-2">
                <Label htmlFor="catalog-product">Product *</Label>
                <Select
                  value={selectedProductId}
                  onValueChange={(value) => {
                    setSelectedProductId(value);
                    setSelectedSupplierId("");
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {getProductsByCategory(formData.category).map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedProductId && (
              <>
                {selectedProduct?.photo_url && (
                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <div className="relative group">
                      <img
                        src={selectedProduct.photo_url}
                        alt={selectedProduct.name}
                        className="w-full h-48 object-cover rounded-lg border border-border cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => setPreviewOpen(true)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                        <div className="bg-background/90 px-4 py-2 rounded-full flex items-center gap-2">
                          <ZoomIn className="w-4 h-4" />
                          <span className="text-sm font-medium">Click to zoom</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="catalog-supplier">Supplier *</Label>
                  <Select
                    value={selectedSupplierId}
                    onValueChange={setSelectedSupplierId}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSuppliersByProduct(selectedProductId).map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.supplier_name} - £{supplier.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        )}

        {selectedProduct && (
          <ImagePreviewDialog
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            imageUrl={selectedProduct.photo_url || ""}
            title={selectedProduct.name}
            description={selectedProduct.description}
          />
        )}

        {(!useCatalog || initialData) && (
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
        )}

        {useCatalog && !initialData && selectedSupplierId && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
            <p className="text-sm font-semibold text-foreground">Preview</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Item:</span>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium">{formData.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Price:</span>
                <p className="font-medium">£{formData.price}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Retailer:</span>
                <p className="font-medium">{formData.retailer_name}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            type="submit" 
            className="flex-1 gap-2"
            disabled={useCatalog && !initialData && !selectedSupplierId}
          >
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
