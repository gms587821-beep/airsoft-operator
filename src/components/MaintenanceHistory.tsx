import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGunMaintenance, MaintenanceLog } from "@/hooks/useGunMaintenance";
import { MaintenanceForm } from "./MaintenanceForm";
import { Plus, Wrench, Calendar, Trash2, Edit, AlertCircle, Crown, AlertTriangle } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAllMaintenance } from "@/hooks/useAllMaintenance";
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

interface MaintenanceHistoryProps {
  gunId: string;
  gunName: string;
}

export const MaintenanceHistory = ({ gunId, gunName }: MaintenanceHistoryProps) => {
  const { maintenanceLogs, isLoading, addMaintenanceLog, updateMaintenanceLog, deleteMaintenanceLog, upcomingMaintenance } = useGunMaintenance(gunId);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState<MaintenanceLog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { data: profile } = useProfile();
  const { maintenanceLogs: allLogs = [] } = useAllMaintenance();
  const { startCheckout } = useSubscription();
  
  const isStandardUser = profile?.subscription_tier === 'standard';
  const maintenanceLimit = isStandardUser ? 10 : Infinity;
  const currentCount = allLogs.length;
  const atLimit = isStandardUser && currentCount >= maintenanceLimit;
  const slotsRemaining = isStandardUser ? maintenanceLimit - currentCount : Infinity;
  const showProximityWarning = isStandardUser && slotsRemaining > 0 && slotsRemaining <= 3;

  const handleEdit = (log: MaintenanceLog) => {
    setEditingLog(log);
    setShowForm(true);
  };

  const handleSubmit = (data: any) => {
    if (editingLog) {
      updateMaintenanceLog({ ...data, id: editingLog.id });
    } else {
      addMaintenanceLog(data);
    }
    setEditingLog(null);
  };

  const handleOpenChange = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      setEditingLog(null);
    }
  };

  const getMaintenanceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      cleaning: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      part_replacement: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      inspection: 'bg-green-500/10 text-green-500 border-green-500/20',
      lubrication: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      repair: 'bg-red-500/10 text-red-500 border-red-500/20',
      upgrade: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      other: 'bg-muted text-muted-foreground border-border',
    };
    return colors[type] || colors.other;
  };

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">Loading maintenance history...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Proximity Warning */}
      {showProximityWarning && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Only {slotsRemaining} log{slotsRemaining === 1 ? '' : 's'} remaining!</span>
          <span className="text-muted-foreground">({currentCount}/{maintenanceLimit} used)</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Maintenance History</h2>
          <p className="text-muted-foreground mt-1">{gunName}</p>
        </div>
        <Button onClick={() => atLimit ? setShowUpgradeDialog(true) : setShowForm(true)} className="gap-2">
          {atLimit && <Crown className="w-4 h-4" />}
          <Plus className="w-4 h-4" />
          Add Log
        </Button>
      </div>

      {/* Upcoming Maintenance */}
      {upcomingMaintenance.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500">
              <AlertCircle className="w-5 h-5" />
              Upcoming Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingMaintenance.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium">{log.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Due: {format(new Date(log.next_due_date!), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Maintenance Logs */}
      {!maintenanceLogs || maintenanceLogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wrench className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">No maintenance logs yet</p>
            <Button onClick={() => atLimit ? setShowUpgradeDialog(true) : setShowForm(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add First Log
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {maintenanceLogs.map((log) => (
            <Card key={log.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className={getMaintenanceTypeColor(log.maintenance_type)}>
                        {log.maintenance_type.replace('_', ' ')}
                      </Badge>
                      <h3 className="font-semibold text-lg">{log.title}</h3>
                    </div>

                    {log.description && (
                      <p className="text-muted-foreground">{log.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(log.performed_at), 'MMM dd, yyyy')}
                      </div>
                      
                      {log.cost && (
                        <div className="text-muted-foreground">
                          Cost: £{log.cost.toFixed(2)}
                        </div>
                      )}
                      
                      {log.next_due_date && (
                        <div className="text-muted-foreground">
                          Next due: {format(new Date(log.next_due_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>

                    {log.parts_replaced && log.parts_replaced.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-muted-foreground">Parts replaced:</span>
                        {log.parts_replaced.map((part, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {part}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(log)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(log.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MaintenanceForm
        open={showForm}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        initialData={editingLog}
        gunId={gunId}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Maintenance Log</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this maintenance log? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteMaintenanceLog(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upgrade Dialog */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Upgrade to Premium
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-left pt-2">
              <p>You've reached the maintenance log limit for standard accounts ({allLogs.length}/{maintenanceLimit} logs).</p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-foreground">Premium Benefits:</p>
                <ul className="space-y-1 text-sm">
                  <li>✓ Unlimited maintenance logs</li>
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
    </div>
  );
};
