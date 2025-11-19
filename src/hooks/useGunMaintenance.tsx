import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface MaintenanceLog {
  id: string;
  gun_id: string;
  user_id: string;
  maintenance_type: 'cleaning' | 'part_replacement' | 'inspection' | 'lubrication' | 'repair' | 'upgrade' | 'other';
  title: string;
  description?: string;
  parts_replaced?: string[];
  cost?: number;
  performed_at: string;
  next_due_date?: string;
  created_at: string;
  updated_at: string;
}

export const useGunMaintenance = (gunId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: maintenanceLogs, isLoading } = useQuery({
    queryKey: ["gun-maintenance", gunId],
    enabled: !!user && !!gunId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gun_maintenance")
        .select("*")
        .eq("gun_id", gunId)
        .order("performed_at", { ascending: false });
      
      if (error) throw error;
      return data as MaintenanceLog[];
    },
  });

  const addMaintenanceLog = useMutation({
    mutationFn: async (logData: Partial<MaintenanceLog> & { gun_id: string }) => {
      if (!user) throw new Error("User not authenticated");

      const insertData: any = {
        ...logData,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("gun_maintenance")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gun-maintenance"] });
      toast.success("Maintenance log added");
    },
    onError: (error) => {
      toast.error("Failed to add maintenance log: " + error.message);
    },
  });

  const updateMaintenanceLog = useMutation({
    mutationFn: async ({ id, ...logData }: Partial<MaintenanceLog> & { id: string }) => {
      const { data, error } = await supabase
        .from("gun_maintenance")
        .update(logData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gun-maintenance"] });
      toast.success("Maintenance log updated");
    },
    onError: (error) => {
      toast.error("Failed to update maintenance log: " + error.message);
    },
  });

  const deleteMaintenanceLog = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from("gun_maintenance")
        .delete()
        .eq("id", logId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gun-maintenance"] });
      toast.success("Maintenance log deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete maintenance log: " + error.message);
    },
  });

  const getUpcomingMaintenance = () => {
    if (!maintenanceLogs) return [];
    
    const today = new Date();
    return maintenanceLogs.filter(log => {
      if (!log.next_due_date) return false;
      const dueDate = new Date(log.next_due_date);
      return dueDate >= today;
    }).sort((a, b) => {
      const dateA = new Date(a.next_due_date!);
      const dateB = new Date(b.next_due_date!);
      return dateA.getTime() - dateB.getTime();
    });
  };

  return {
    maintenanceLogs,
    isLoading,
    addMaintenanceLog: addMaintenanceLog.mutate,
    updateMaintenanceLog: updateMaintenanceLog.mutate,
    deleteMaintenanceLog: deleteMaintenanceLog.mutate,
    upcomingMaintenance: getUpcomingMaintenance(),
  };
};
