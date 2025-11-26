import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Wrench, 
  TrendingUp, 
  Package, 
  MapPin, 
  Layers,
  Activity,
  Zap
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useOperators } from "@/hooks/useOperators";
import { useGuns } from "@/hooks/useGuns";
import { useAllMaintenance } from "@/hooks/useAllMaintenance";
import { useGameSessions } from "@/hooks/useGameSessions";
import { useSiteFavourites } from "@/hooks/useSiteFavourites";

const OperatorHub = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { operators } = useOperators();
  const { guns } = useGuns();
  const { maintenanceLogs } = useAllMaintenance();
  const { gameSessions: sessions } = useGameSessions();
  const { data: favourites } = useSiteFavourites();

  const activeOperator = operators?.find(
    op => op.id === profile?.active_operator_id
  ) || operators?.[0];

  const quickActions = [
    {
      icon: MessageSquare,
      label: "Diagnose My Gun",
      description: "Get expert analysis",
      path: "/operator/chat?action=diagnose"
    },
    {
      icon: TrendingUp,
      label: "Recommend Upgrades",
      description: "Improve performance",
      path: "/operator/chat?action=upgrades"
    },
    {
      icon: Package,
      label: "Recommend Gear",
      description: "Build optimal loadout",
      path: "/operator/chat?action=gear"
    },
    {
      icon: MapPin,
      label: "Find Sites",
      description: "Match your playstyle",
      path: "/operator/chat?action=sites"
    },
    {
      icon: Layers,
      label: "Build Loadout",
      description: "Complete configuration",
      path: "/operator/chat?action=loadout"
    },
    {
      icon: Zap,
      label: "Pre-Game Brief",
      description: "Mission preparation",
      path: "/operator/chat?action=brief"
    }
  ];

  const insights = [];
  
  if (guns && guns.length > 0) {
    const maintenanceDue = guns.filter(gun => {
      const gunLogs = maintenanceLogs?.filter(log => log.gun_id === gun.id) || [];
      if (gunLogs.length === 0) return true;
      
      const lastMaintenance = gunLogs.sort((a, b) => 
        new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
      )[0];
      
      const daysSince = Math.floor(
        (Date.now() - new Date(lastMaintenance.performed_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSince > 30;
    });
    
    if (maintenanceDue.length > 0) {
      insights.push({
        icon: Wrench,
        text: `${maintenanceDue.length} weapon${maintenanceDue.length > 1 ? 's' : ''} due for maintenance`,
        priority: "high"
      });
    }
  }
  
  if (sessions && sessions.length > 0) {
    const thisMonth = sessions.filter(s => {
      const sessionDate = new Date(s.game_date);
      const now = new Date();
      return sessionDate.getMonth() === now.getMonth() && 
             sessionDate.getFullYear() === now.getFullYear();
    });
    
    insights.push({
      icon: Activity,
      text: `${thisMonth.length} game${thisMonth.length !== 1 ? 's' : ''} logged this month`,
      priority: "normal"
    });
  }
  
  if (favourites && favourites.length > 0) {
    insights.push({
      icon: MapPin,
      text: `${favourites.length} favourite site${favourites.length !== 1 ? 's' : ''} marked`,
      priority: "normal"
    });
  }

  if (!activeOperator) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Loading operator data...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Operator Hub</h1>
            <p className="text-muted-foreground">Your tactical command center</p>
          </div>
          <Button onClick={() => navigate("/operators")}>
            Change Operator
          </Button>
        </div>

        {/* Active Operator Card */}
        <Card 
          className="border-l-4"
          style={{ borderLeftColor: activeOperator.accent_color }}
        >
          <CardHeader>
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
                style={{ backgroundColor: `${activeOperator.accent_color}20` }}
              >
                {activeOperator.default_avatar || "🎯"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle>{activeOperator.name}</CardTitle>
                  <Badge variant="outline" style={{ borderColor: activeOperator.accent_color, color: activeOperator.accent_color }}>
                    {activeOperator.role}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  {activeOperator.personality_description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Card 
                key={action.label}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${activeOperator.accent_color}20` }}
                    >
                      <action.icon 
                        className="w-5 h-5" 
                        style={{ color: activeOperator.accent_color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Operator Insights */}
        {insights.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Operator Insights</h2>
            <Card>
              <CardContent className="p-4 space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <insight.icon 
                      className="w-5 h-5 mt-0.5 flex-shrink-0" 
                      style={{ 
                        color: insight.priority === "high" ? "#ef4444" : activeOperator.accent_color 
                      }}
                    />
                    <p className="text-sm">{insight.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat Button */}
        <Button 
          size="lg"
          className="w-full"
          style={{ backgroundColor: activeOperator.accent_color }}
          onClick={() => navigate("/operator/chat")}
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Start Conversation
        </Button>
      </div>
    </AppLayout>
  );
};

export default OperatorHub;
