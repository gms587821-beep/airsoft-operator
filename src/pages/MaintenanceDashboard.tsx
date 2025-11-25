import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, TrendingUp, Wrench, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/AppLayout";
import { useAllMaintenance } from "@/hooks/useAllMaintenance";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const MaintenanceDashboard = () => {
  const navigate = useNavigate();
  const { upcomingMaintenance, recentMaintenance, costAnalytics, isLoading } = useAllMaintenance();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const getMaintenanceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      cleaning: "bg-blue-500/10 text-blue-500",
      part_replacement: "bg-red-500/10 text-red-500",
      inspection: "bg-green-500/10 text-green-500",
      lubrication: "bg-yellow-500/10 text-yellow-500",
      repair: "bg-orange-500/10 text-orange-500",
      upgrade: "bg-purple-500/10 text-purple-500",
      other: "bg-gray-500/10 text-gray-500",
    };
    return colors[type] || colors.other;
  };

  const typeChartData = Object.entries(costAnalytics.byType).map(([type, cost]) => ({
    name: type.replace(/_/g, ' '),
    value: cost,
  }));

  const monthChartData = costAnalytics.byMonth.map(item => ({
    month: format(new Date(item.month + '-01'), 'MMM yyyy'),
    cost: item.cost,
  }));

  return (
    <AppLayout>
      <div className="space-y-6 py-2">
        <Button
          onClick={() => navigate('/tools')}
          variant="ghost"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Maintenance Dashboard</h1>
          <p className="text-muted-foreground">Track service history and costs across your entire arsenal</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Maintenance Cost</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{costAnalytics.total.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Services</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingMaintenance.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled maintenance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Records</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentMaintenance.length}</div>
              <p className="text-xs text-muted-foreground">Total logs</p>
            </CardContent>
          </Card>
        </div>

        {/* ... keep existing code ... */}

        {/* Upcoming Maintenance */}
        {upcomingMaintenance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Upcoming Maintenance
              </CardTitle>
              <CardDescription>Services scheduled for your guns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMaintenance.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/arsenal/${log.gun_id}/maintenance`)}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getMaintenanceTypeColor(log.maintenance_type)}>
                        {log.maintenance_type.replace(/_/g, ' ')}
                      </Badge>
                      <span className="font-semibold">{log.guns.name}</span>
                    </div>
                    <p className="text-sm font-medium">{log.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Due: {format(new Date(log.next_due_date!), 'PPP')}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Cost Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost by Type</CardTitle>
              <CardDescription>Maintenance expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              {typeChartData.length > 0 ? (
                <ChartContainer
                  config={{}}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {typeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No cost data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Over Time</CardTitle>
              <CardDescription>Monthly maintenance expenses (last 6 months)</CardDescription>
            </CardHeader>
            <CardContent>
              {monthChartData.length > 0 ? (
                <ChartContainer
                  config={{}}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No cost data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Maintenance</CardTitle>
            <CardDescription>Latest service records across all guns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMaintenance.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">No maintenance logs yet</p>
                <p className="text-sm mb-4">Start tracking service history for your guns</p>
                <Button
                  onClick={() => navigate('/arsenal')}
                  variant="outline"
                >
                  Go to Arsenal
                </Button>
              </div>
            ) : (
              recentMaintenance.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/arsenal/${log.gun_id}/maintenance`)}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getMaintenanceTypeColor(log.maintenance_type)}>
                        {log.maintenance_type.replace(/_/g, ' ')}
                      </Badge>
                      <span className="font-semibold">{log.guns.name}</span>
                    </div>
                    <p className="text-sm font-medium">{log.title}</p>
                    {log.description && (
                      <p className="text-sm text-muted-foreground">{log.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{format(new Date(log.performed_at), 'PPP')}</span>
                      {log.cost && <span>£{log.cost.toFixed(2)}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MaintenanceDashboard;
