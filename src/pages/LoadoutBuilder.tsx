import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, ShoppingCart, Crown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePlannedLoadouts } from "@/hooks/usePlannedLoadouts";
import { LoadoutCard } from "@/components/LoadoutCard";
import { useOperators } from "@/hooks/useOperators";
import { useProfile } from "@/hooks/useProfile";
import { AppLayout } from "@/components/AppLayout";
import { OperatorBanner } from "@/components/OperatorBanner";
import { getOperatorAdviceForPage } from "@/lib/operatorLogic";
import { useSubscription } from "@/hooks/useSubscription";

const LoadoutBuilder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadouts, isLoading, createLoadout, deleteLoadout } =
    usePlannedLoadouts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [newLoadout, setNewLoadout] = useState({
    name: "",
    description: "",
  });
  const { activeOperator } = useOperators();
  const { data: profile } = useProfile();
  const { startCheckout } = useSubscription();
  
  const isStandardUser = profile?.subscription_tier === 'standard';
  const loadoutLimit = isStandardUser ? 3 : Infinity;
  const currentCount = loadouts.length;
  const atLimit = currentCount >= loadoutLimit;
  const slotsRemaining = isStandardUser ? loadoutLimit - currentCount : Infinity;
  const showProximityWarning = isStandardUser && slotsRemaining > 0 && slotsRemaining <= 1;
  
  const operatorAdvice = activeOperator && loadouts.length > 0 ? {
    message: "Need help optimizing this loadout? I can suggest improvements based on your play style.",
    actionLabel: "Get Advice",
    actionPath: "/operator/chat?action=loadout"
  } : null;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <Card className="p-8 text-center space-y-4">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Please sign in to access the loadout builder
          </p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading your builds...
        </div>
      </div>
    );
  }

  const handleCreateLoadout = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLoadout.name.trim()) {
      createLoadout(newLoadout);
      setNewLoadout({ name: "", description: "" });
      setShowCreateForm(false);
    }
  };

  const handleNewBuildClick = () => {
    if (atLimit) {
      setShowUpgradeDialog(true);
    } else {
      setShowCreateForm(true);
    }
  };

  const handleUpgrade = () => {
    setShowUpgradeDialog(false);
    startCheckout();
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">
        {/* Operator Banner */}
        {activeOperator && operatorAdvice && (
          <OperatorBanner
            operator={activeOperator}
            message={operatorAdvice.message}
            actionLabel={operatorAdvice.actionLabel}
            actionPath={operatorAdvice.actionPath}
          />
        )}

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
              <h1 className="text-3xl font-bold text-foreground">
                Loadout Builder
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure your dream loadout and save it for later
                {isStandardUser && ` (${currentCount}/${loadoutLimit} used)`}
              </p>
              {showProximityWarning && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Only {slotsRemaining} slot{slotsRemaining === 1 ? '' : 's'} remaining!</span>
                  <Button variant="link" size="sm" className="text-amber-500 p-0 h-auto" onClick={() => navigate('/premium')}>
                    Upgrade
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Button onClick={handleNewBuildClick} className="gap-2">
            <Plus className="h-4 w-4" />
            New Build
            {atLimit && <Crown className="h-3 w-3 text-yellow-500" />}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="p-6 border-primary/50">
            <form onSubmit={handleCreateLoadout} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Create New Loadout
              </h3>

              <div className="space-y-2">
                <Label htmlFor="name">Loadout Name *</Label>
                <Input
                  id="name"
                  value={newLoadout.name}
                  onChange={(e) =>
                    setNewLoadout({ ...newLoadout, name: e.target.value })
                  }
                  placeholder="e.g., CQB Dream Build, Woodland Setup"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newLoadout.description}
                  onChange={(e) =>
                    setNewLoadout({
                      ...newLoadout,
                      description: e.target.value,
                    })
                  }
                  placeholder="What's this loadout for?"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Create Loadout
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewLoadout({ name: "", description: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loadouts.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-tactical flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Loadouts Yet
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Start building your dream airsoft loadout. Add items from shops
                like Patrol Base or BZ, track costs, and save for later
                purchase.
              </p>
              <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Build
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadouts.map((loadout) => (
              <LoadoutCard
                key={loadout.id}
                loadout={loadout}
                onDelete={deleteLoadout}
              />
            ))}
          </div>
        )}

        {/* Upgrade Dialog */}
        <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Upgrade to Premium
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  You've reached the limit of {loadoutLimit} loadouts on the Standard plan.
                </p>
                <p className="font-medium text-foreground">
                  Upgrade to Premium for:
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span>Unlimited loadouts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span>Unlimited guns in registry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span>Lower marketplace fees (3% vs 8%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span>Advanced diagnostics & no ads</span>
                  </li>
                </ul>
                <p className="text-sm font-medium">Only £5.99/month</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Maybe Later</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpgrade}>
                Upgrade Now
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default LoadoutBuilder;
