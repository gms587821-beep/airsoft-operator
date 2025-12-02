import { useState } from "react";
import { Plus, Target, ArrowLeft, Crown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import { useGuns, Gun } from "@/hooks/useGuns";
import { GunCard } from "@/components/GunCard";
import { GunForm } from "@/components/GunForm";
import { useNavigate } from "react-router-dom";
import { useOperators } from "@/hooks/useOperators";
import { useProfile } from "@/hooks/useProfile";
import { useAllMaintenance } from "@/hooks/useAllMaintenance";
import { OperatorBanner } from "@/components/OperatorBanner";
import { getOperatorAdviceForPage } from "@/lib/operatorLogic";
import { useSubscription } from "@/hooks/useSubscription";
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

const Arsenal = () => {
  const navigate = useNavigate();
  const { guns, isLoading, addGun, updateGun, deleteGun } = useGuns();
  const [showForm, setShowForm] = useState(false);
  const [editingGun, setEditingGun] = useState<Gun | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { activeOperator } = useOperators();
  const { data: profile } = useProfile();
  const { maintenanceLogs = [] } = useAllMaintenance();
  const { startCheckout } = useSubscription();
  
  const isStandardUser = profile?.subscription_tier === 'standard';
  const gunLimit = isStandardUser ? 5 : Infinity;
  const currentCount = guns?.length || 0;
  const atLimit = isStandardUser && currentCount >= gunLimit;
  const slotsRemaining = isStandardUser ? gunLimit - currentCount : Infinity;
  const showProximityWarning = isStandardUser && slotsRemaining > 0 && slotsRemaining <= 2;
  
  const operatorAdvice = activeOperator ? getOperatorAdviceForPage(
    "arsenal",
    profile || null,
    guns || [],
    maintenanceLogs,
    [],
    []
  ) : null;

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
    <AppLayout>
      <div className="space-y-6 py-2">
        {/* Operator Banner */}
        {activeOperator && operatorAdvice && guns && guns.length > 0 && (
          <OperatorBanner
            operator={activeOperator}
            message={operatorAdvice.message}
            actionLabel={operatorAdvice.actionLabel}
            actionPath={operatorAdvice.actionPath}
          />
        )}

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Arsenal</h1>
          </div>
          <p className="text-muted-foreground">
            Track all your guns, key details and performance here
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
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              {guns?.length || 0} {guns?.length === 1 ? 'weapon' : 'weapons'} in your loadout
              {isStandardUser && ` (${guns?.length || 0}/${gunLimit} used)`}
            </p>
            <Button
              onClick={() => atLimit ? setShowUpgradeDialog(true) : setShowForm(true)}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {atLimit && <Crown className="w-4 h-4" />}
              <Plus className="w-5 h-5" />
              Add Gun
            </Button>
          </div>
        </div>

        {/* Gun Grid or Empty State */}
        {!guns || guns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center space-y-2 max-w-md">
              <h3 className="text-xl font-semibold text-foreground">No Guns in Arsenal</h3>
              <p className="text-muted-foreground">
                Start building your loadout by adding your first gun. Track specs, upgrades, maintenance history, and get AI-powered diagnostics from The Armourer.
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
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

      {/* Upgrade Dialog */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Upgrade to Premium
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-left pt-2">
              <p>You've reached the gun limit for standard accounts (5 guns).</p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-foreground">Premium Benefits:</p>
                <ul className="space-y-1 text-sm">
                  <li>✓ Unlimited guns in your arsenal</li>
                  <li>✓ Unlimited loadouts</li>
                  <li>✓ No marketplace fees (save 8%)</li>
                  <li>✓ Advanced operator diagnostics</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
              <p className="text-sm font-semibold text-primary">Just £5.99/month</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction onClick={startCheckout} className="bg-primary hover:bg-primary/90">
              Upgrade Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Arsenal;
