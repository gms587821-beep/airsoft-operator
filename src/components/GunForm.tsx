import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, X } from "lucide-react";
import { Gun } from "@/hooks/useGuns";
import { Badge } from "@/components/ui/badge";

interface GunFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: Gun | null;
}

export const GunForm = ({ open, onOpenChange, onSubmit, initialData }: GunFormProps) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo_url || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [upgradeInput, setUpgradeInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUpgrade = () => {
    if (upgradeInput.trim()) {
      setFormData({
        ...formData,
        upgrades: [...(formData.upgrades || []), upgradeInput.trim()],
      });
      setUpgradeInput("");
    }
  };

  const handleRemoveUpgrade = (index: number) => {
    setFormData({
      ...formData,
      upgrades: formData.upgrades.filter((_: string, i: number) => i !== index),
    });
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      photo: photoFile,
    });
    onOpenChange(false);
    setFormData({});
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {initialData ? "Update Gun" : "Add to Arsenal"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative h-48 border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-smooth bg-gradient-tactical"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Camera className="w-12 h-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Tap to add photo</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Primary AEG"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gun_type">Type *</Label>
              <Select
                value={formData.gun_type || ""}
                onValueChange={(value) => setFormData({ ...formData, gun_type: value })}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AEG">AEG</SelectItem>
                  <SelectItem value="GBB">GBB</SelectItem>
                  <SelectItem value="HPA">HPA</SelectItem>
                  <SelectItem value="Sniper">Sniper</SelectItem>
                  <SelectItem value="Pistol">Pistol</SelectItem>
                  <SelectItem value="LMG">LMG</SelectItem>
                  <SelectItem value="SMG">SMG</SelectItem>
                  <SelectItem value="Shotgun">Shotgun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand || ""}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="G&G, Tokyo Marui, etc."
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model || ""}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="CM16 Raider"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fps">FPS</Label>
              <Input
                id="fps"
                type="number"
                value={formData.fps || ""}
                onChange={(e) => setFormData({ ...formData, fps: parseInt(e.target.value) || null })}
                placeholder="350"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="joules">Joules</Label>
              <Input
                id="joules"
                type="number"
                step="0.01"
                value={formData.joules || ""}
                onChange={(e) => setFormData({ ...formData, joules: parseFloat(e.target.value) || null })}
                placeholder="1.14"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          {/* Upgrades */}
          <div className="space-y-2">
            <Label>Upgrades & Attachments</Label>
            <div className="flex gap-2">
              <Input
                value={upgradeInput}
                onChange={(e) => setUpgradeInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddUpgrade()}
                placeholder="e.g., Tight Bore Barrel, Red Dot Sight"
                className="bg-secondary border-border"
              />
              <Button type="button" onClick={handleAddUpgrade} variant="outline">
                Add
              </Button>
            </div>
            {formData.upgrades && formData.upgrades.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.upgrades.map((upgrade: string, i: number) => (
                  <Badge key={i} variant="secondary" className="gap-2">
                    {upgrade}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleRemoveUpgrade(i)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details, maintenance history, etc."
              className="bg-secondary border-border min-h-[100px]"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.name || !formData.gun_type}
              className="bg-primary hover:bg-primary/90"
            >
              {initialData ? "Update" : "Add to Arsenal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
