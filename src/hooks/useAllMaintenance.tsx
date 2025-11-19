import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { MaintenanceLog } from "./useGunMaintenance";

export const useAllMaintenance = () => {
  const { user } = useAuth();

  const { data: maintenanceLogs, isLoading } = useQuery({
    queryKey: ["all-maintenance"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gun_maintenance")
        .select(`
          *,
          guns (
            name,
            photo_url
          )
        `)
        .eq("user_id", user!.id)
        .order("performed_at", { ascending: false });
      
      if (error) throw error;
      return data as (MaintenanceLog & { guns: { name: string; photo_url?: string } })[];
    },
  });

  const getUpcomingMaintenance = () => {
    if (!maintenanceLogs) return [];
    
    const today = new Date();
    return maintenanceLogs
      .filter(log => {
        if (!log.next_due_date) return false;
        const dueDate = new Date(log.next_due_date);
        return dueDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.next_due_date!);
        const dateB = new Date(b.next_due_date!);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const getRecentMaintenance = () => {
    if (!maintenanceLogs) return [];
    return maintenanceLogs.slice(0, 10);
  };

  const getCostAnalytics = () => {
    if (!maintenanceLogs) return { total: 0, byType: {}, byMonth: [] };

    const total = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

    const byType = maintenanceLogs.reduce((acc, log) => {
      const type = log.maintenance_type;
      acc[type] = (acc[type] || 0) + (log.cost || 0);
      return acc;
    }, {} as Record<string, number>);

    const byMonth = maintenanceLogs.reduce((acc, log) => {
      const date = new Date(log.performed_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = acc.find(item => item.month === monthKey);
      
      if (existing) {
        existing.cost += log.cost || 0;
      } else {
        acc.push({ month: monthKey, cost: log.cost || 0 });
      }
      
      return acc;
    }, [] as { month: string; cost: number }[]);

    return { total, byType, byMonth: byMonth.sort((a, b) => a.month.localeCompare(b.month)).slice(-6) };
  };

  return {
    maintenanceLogs,
    isLoading,
    upcomingMaintenance: getUpcomingMaintenance(),
    recentMaintenance: getRecentMaintenance(),
    costAnalytics: getCostAnalytics(),
  };
};
