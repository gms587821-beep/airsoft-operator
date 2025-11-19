import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { KitCard } from "@/components/KitCard";
import { KitForm } from "@/components/KitForm";
import { useKitItems } from "@/hooks/useKitItems";

const KitLog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { kitItems, isLoading } = useKitItems();
  const [showForm, setShowForm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <Card className="p-8 text-center space-y-4">
          <Package2 className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Please sign in to access your kit log</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading your kit...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/tools")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Kit Log</h1>
              <p className="text-sm text-muted-foreground">Track your airsoft gear and equipment</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Kit Item
          </Button>
        </div>

        {showForm && (
          <KitForm onClose={() => setShowForm(false)} />
        )}

        {kitItems.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <Package2 className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Kit Items Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your gear collection by adding your first kit item
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Kit Item
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitItems.map((item) => (
              <KitCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default KitLog;
