import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaintenanceLog } from "@/hooks/useGunMaintenance";
import { Plus, X } from "lucide-react";

interface MaintenanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: MaintenanceLog | null;
  gunId: string;
}

export const MaintenanceForm = ({ open, onOpenChange, onSubmit, initialData, gunId }: MaintenanceFormProps) => {
  const [formData, setFormData] = useState({
    maintenance_type: initialData?.maintenance_type || 'cleaning',
    title: initialData?.title || '',
    description: initialData?.description || '',
    parts_replaced: initialData?.parts_replaced || [],
    cost: initialData?.cost || '',
    performed_at: initialData?.performed_at ? new Date(initialData.performed_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    next_due_date: initialData?.next_due_date || '',
  });

  const [newPart, setNewPart] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      gun_id: gunId,
      cost: formData.cost ? parseFloat(formData.cost as string) : null,
      parts_replaced: formData.parts_replaced.length > 0 ? formData.parts_replaced : null,
      next_due_date: formData.next_due_date || null,
    });
    onOpenChange(false);
  };

  const addPart = () => {
    if (newPart.trim()) {
      setFormData({
        ...formData,
        parts_replaced: [...formData.parts_replaced, newPart.trim()],
      });
      setNewPart('');
    }
  };

  const removePart = (index: number) => {
    setFormData({
      ...formData,
      parts_replaced: formData.parts_replaced.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add'} Maintenance Log</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maintenance_type">Maintenance Type</Label>
            <Select
              value={formData.maintenance_type}
              onValueChange={(value) => setFormData({ ...formData, maintenance_type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="part_replacement">Part Replacement</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="lubrication">Lubrication</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="upgrade">Upgrade</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Cleaned and lubricated gearbox"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Detailed notes about the maintenance..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="performed_at">Performed Date</Label>
              <Input
                id="performed_at"
                type="date"
                value={formData.performed_at}
                onChange={(e) => setFormData({ ...formData, performed_at: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_due_date">Next Due Date</Label>
              <Input
                id="next_due_date"
                type="date"
                value={formData.next_due_date}
                onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost (£)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label>Parts Replaced</Label>
            <div className="flex gap-2">
              <Input
                value={newPart}
                onChange={(e) => setNewPart(e.target.value)}
                placeholder="Enter part name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPart())}
              />
              <Button type="button" onClick={addPart} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.parts_replaced.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.parts_replaced.map((part, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                  >
                    <span>{part}</span>
                    <button
                      type="button"
                      onClick={() => removePart(index)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? 'Update' : 'Add'} Log</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
