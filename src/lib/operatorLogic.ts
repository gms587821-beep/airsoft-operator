import { Tables } from "@/integrations/supabase/types";
import { Gun } from "@/hooks/useGuns";
import { Site } from "@/hooks/useSites";
import { Product } from "@/hooks/useMarketplaceProducts";

type MaintenanceRecord = Tables<"gun_maintenance">;
type GameSession = Tables<"game_sessions">;
type Profile = Tables<"profiles">;

function orEmpty<T>(arr: T[] | null | undefined): T[] {
  return arr || [];
}

export interface OperatorAdvice {
  message: string;
  actionLabel?: string;
  actionPath?: string;
}

export function getOperatorAdviceForPage(
  page: "home" | "marketplace" | "sites" | "arsenal" | "maintenance" | "loadout",
  profile: Profile | null,
  arsenal: Gun[],
  maintenanceLogs: MaintenanceRecord[],
  sessions: GameSession[],
  favouriteSites: Site[]
): OperatorAdvice {
  const role = profile?.primary_role || "Rifleman";
  
  switch (page) {
    case "home":
      if (arsenal.length === 0) {
        return {
          message: "Welcome, operator. Let's get your arsenal registered.",
          actionLabel: "Add Your First Gun",
          actionPath: "/arsenal"
        };
      }
      if (sessions.length === 0) {
        return {
          message: `Ready for deployment? Log your first game session.`,
          actionLabel: "Log Session",
          actionPath: "/player-log"
        };
      }
      return {
        message: `${sessions.length} missions logged. Your ${role} skills are developing well.`,
        actionLabel: "View Stats",
        actionPath: "/statistics"
      };

    case "marketplace":
      if (role === "CQB") {
        return {
          message: "For close-quarters, prioritize lightweight rifles and quick-draw sidearms.",
          actionLabel: "View CQB Gear",
          actionPath: "/marketplace?category=Primary"
        };
      }
      return {
        message: `${role} gear recommendations available. Browse what fits your playstyle.`,
        actionLabel: "Explore",
        actionPath: "/marketplace"
      };

    case "sites":
      if (favouriteSites.length > 0) {
        return {
          message: `${favouriteSites.length} favourite sites marked. Time to expand your territory?`,
          actionLabel: "Find Sites",
          actionPath: "/sites"
        };
      }
      return {
        message: "Diverse terrain builds versatile operators. Explore new sites.",
        actionLabel: "View Map",
        actionPath: "/sites"
      };

    case "arsenal":
      const dueForMaintenance = arsenal.filter(gun => {
        const lastMaintenance = maintenanceLogs
          .filter(log => log.gun_id === gun.id)
          .sort((a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime())[0];
        
        if (!lastMaintenance) return arsenal.length > 0;
        
        const daysSince = Math.floor(
          (Date.now() - new Date(lastMaintenance.performed_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSince > 30;
      });

      if (dueForMaintenance.length > 0) {
        return {
          message: `${dueForMaintenance.length} weapon${dueForMaintenance.length > 1 ? 's' : ''} due for maintenance.`,
          actionLabel: "Check Maintenance",
          actionPath: "/maintenance-dashboard"
        };
      }
      return {
        message: "Arsenal status: green. All weapons maintained and ready.",
      };

    default:
      return { message: "Standing by for orders, operator." };
  }
}

export function getGunDiagnosis(gun: Gun, maintenanceLogs: MaintenanceRecord[]): string {
  const gunLogs = maintenanceLogs.filter(log => log.gun_id === gun.id);
  if (gunLogs.length === 0) {
    return `${gun.name}: No maintenance history. Recommend immediate inspection.`;
  }
  const lastMaintenance = gunLogs.sort((a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime())[0];
  const daysSince = Math.floor((Date.now() - new Date(lastMaintenance.performed_at).getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSince > 60) {
    return `${gun.name}: ${daysSince} days since service. Overdue for cleaning.`;
  }
  return `${gun.name}: Recently serviced. Status: operational.`;
}

export function getUpgradeAdvice(gun: Gun, products: Product[]): string {
  return `${gun.name}: Consider tight-bore barrel for accuracy, upgraded hop-up for range. Current FPS: ${gun.fps || "unknown"}.`;
}

export function getSiteRecommendations(sites: Site[], role: string, favourites: Site[]): string[] {
  const recommendations: string[] = [];
  sites.slice(0, 3).forEach(site => {
    recommendations.push(`${site.name}: ${site.field_type} - suitable for tactical training.`);
  });
  return recommendations.length > 0 ? recommendations : ["No sites available."];
}

export function getLoadoutSuggestion(role: string, guns: Gun[], products: Product[]): string {
  return `**${role} Loadout:**\n\nPrimary: ${guns[0]?.name || "[Required]"}\nSidearm: ${guns[1]?.name || "[Recommended]"}\n\nGear: Tactical vest, magazines, eye protection, hydration.`;
}

export function getPreGameBrief(role: string, site: Site | null): string {
  return `**Pre-Game Brief - ${site?.name || "AO"}**\n\nRole: ${role}\nTerrain: ${site?.field_type || "Mixed"}\n\nObjectives: Execute mission with precision. Honor hit calls. Respect marshals.\n\nEquipment Check: Verify battery/gas, check mags, confirm FPS limits.`;
}
