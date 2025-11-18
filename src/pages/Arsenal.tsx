import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useGuns, Gun } from "@/hooks/useGuns";
import { GunCard } from "@/components/GunCard";
import { GunForm } from "@/components/GunForm";

const Arsenal = () => {
  const { guns, isLoading, addGun, updateGun, deleteGun } = useGuns();
  const [showForm, setShowForm] = useState(false);
  const [editingGun, setEditingGun] = useState<Gun | null>(null);

  const handleEdit = (gun: Gun) => {
    setEditingGun(gun);
    setShowForm(true);
  };

  const handleSubmit = (data: any) => {
    if (editingGun) {
      updateGun({ ...data, id: editingGun.id });
    } else {
      addGun(data);
    }
    setEditingGun(null);
  };

  const handleOpenChange = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      setEditingGun(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading arsenal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gun Arsenal</h1>
            <p className="text-muted-foreground mt-1">
              {guns?.length || 0} {guns?.length === 1 ? 'weapon' : 'weapons'} in your loadout
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-5 h-5" />
            Add Gun
          </Button>
        </div>

        {/* Gun Grid */}
        {!guns || guns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-tactical flex items-center justify-center">
              <Plus className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">No guns in arsenal</h3>
              <p className="text-muted-foreground max-w-md">
                Start building your loadout by adding your first gun. Track specs, upgrades, and get AI-powered diagnostics.
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-5 h-5" />
              Add Your First Gun
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guns.map((gun) => (
              <GunCard
                key={gun.id}
                gun={gun}
                onDelete={deleteGun}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      <GunForm
        open={showForm}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        initialData={editingGun}
      />

      <Navigation />
    </div>
  );
};

export default Arsenal;
