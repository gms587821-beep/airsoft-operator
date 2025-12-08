import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, ShoppingBag, Edit2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { usePlannedLoadouts, useLoadoutItems } from "@/hooks/usePlannedLoadouts";
import { LoadoutItemCard } from "@/components/LoadoutItemCard";
import { LoadoutItemForm } from "@/components/LoadoutItemForm";
import { PlannedLoadoutItem } from "@/hooks/usePlannedLoadouts";

const LoadoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loadouts, updateLoadout } = usePlannedLoadouts();
  const { items, addItem, updateItem, deleteItem } = useLoadoutItems(id || "");
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PlannedLoadoutItem | undefined>();
  const [isEditingLoadout, setIsEditingLoadout] = useState(false);
  const [editedLoadout, setEditedLoadout] = useState({ name: "", description: "" });

  const loadout = loadouts.find((l) => l.id === id);

  if (!loadout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center space-y-4">
          <p className="text-muted-foreground">Loadout not found</p>
          <Button onClick={() => navigate("/loadout-builder")}>
            Back to Loadouts
          </Button>
        </Card>
      </div>
    );
  }

  const handleEditLoadout = () => {
    setEditedLoadout({ name: loadout.name, description: loadout.description || "" });
    setIsEditingLoadout(true);
  };

  const handleSaveLoadout = () => {
    updateLoadout({
      id: loadout.id,
      name: editedLoadout.name,
      description: editedLoadout.description,
    });
    setIsEditingLoadout(false);
  };

  const handleItemSubmit = (item: Omit<PlannedLoadoutItem, "id" | "created_at">) => {
    if (editingItem) {
      updateItem({ ...item, id: editingItem.id });
    } else {
      addItem(item);
    }
    setShowItemForm(false);
    setEditingItem(undefined);
  };

  const handleEditItem = (item: PlannedLoadoutItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const categorizedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PlannedLoadoutItem[]>);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/loadout-builder")}
              className="mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 space-y-2">
              {isEditingLoadout ? (
                <div className="space-y-2">
                  <Input
                    value={editedLoadout.name}
                    onChange={(e) =>
                      setEditedLoadout({ ...editedLoadout, name: e.target.value })
                    }
                    className="text-2xl font-bold"
                  />
                  <Textarea
                    value={editedLoadout.description}
                    onChange={(e) =>
                      setEditedLoadout({ ...editedLoadout, description: e.target.value })
                    }
                    placeholder="Description..."
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveLoadout}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingLoadout(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      {loadout.name}
                    </h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEditLoadout}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {loadout.description && (
                    <p className="text-muted-foreground">{loadout.description}</p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/feed/create?type=build&loadoutId=${loadout.id}`)} 
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button onClick={() => setShowItemForm(true)} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Total Cost Card */}
        <Card className="p-6 bg-gradient-tactical border-primary/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Build Cost</p>
              <p className="text-4xl font-bold text-primary">
                £{Number(loadout.total_cost || 0).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <ShoppingBag className="w-16 h-16 text-primary/30" />
          </div>
        </Card>

        {/* Item Form */}
        {showItemForm && (
          <LoadoutItemForm
            onSubmit={handleItemSubmit}
            onCancel={() => {
              setShowItemForm(false);
              setEditingItem(undefined);
            }}
            loadoutId={loadout.id}
            initialData={editingItem}
          />
        )}

        {/* Items List */}
        {items.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-tactical flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Items Added Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start adding items from shops like Patrol Base or BZ to build your
                dream loadout
              </p>
              <Button onClick={() => setShowItemForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Item
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(categorizedItems).map(([category, categoryItems]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {category}
                  </Badge>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-3">
                  {categoryItems.map((item) => (
                    <LoadoutItemCard
                      key={item.id}
                      item={item}
                      onDelete={deleteItem}
                      onEdit={handleEditItem}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default LoadoutDetail;
