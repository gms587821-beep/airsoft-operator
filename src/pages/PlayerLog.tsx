import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, MapPin, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { GameSessionCard } from "@/components/GameSessionCard";
import { GameSessionForm } from "@/components/GameSessionForm";
import { useGameSessions } from "@/hooks/useGameSessions";
import { format } from "date-fns";

const PlayerLog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gameSessions, upcomingSessions, pastSessions, isLoading } = useGameSessions();
  const [showForm, setShowForm] = useState(false);
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [weaponFilter, setWeaponFilter] = useState<string>("all");

  // Extract unique sites and weapons for filters
  const uniqueSites = useMemo(() => {
    const sites = new Set(pastSessions.map(s => s.site_name));
    return Array.from(sites);
  }, [pastSessions]);

  const uniqueWeapons = useMemo(() => {
    const weapons = new Set(pastSessions.filter(s => s.weapon_used).map(s => s.weapon_used!));
    return Array.from(weapons);
  }, [pastSessions]);

  // Filter and group past sessions by month
  const groupedPastSessions = useMemo(() => {
    let filtered = pastSessions;
    if (siteFilter !== "all") {
      filtered = filtered.filter(s => s.site_name === siteFilter);
    }
    if (weaponFilter !== "all") {
      filtered = filtered.filter(s => s.weapon_used === weaponFilter);
    }

    const grouped: Record<string, typeof filtered> = {};
    filtered.forEach(session => {
      const monthKey = format(new Date(session.game_date), 'MMMM yyyy');
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(session);
    });
    
    return Object.entries(grouped).sort((a, b) => 
      new Date(b[1][0].game_date).getTime() - new Date(a[1][0].game_date).getTime()
    );
  }, [pastSessions, siteFilter, weaponFilter]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <Card className="p-8 text-center space-y-4">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Please sign in to access your player log</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading your sessions...</div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 py-2">
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
              <h1 className="text-3xl font-bold text-foreground">Player Log</h1>
              <p className="text-sm text-muted-foreground">Track where you've played and plan upcoming games</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Game
          </Button>
        </div>

        {showForm && (
          <GameSessionForm onClose={() => setShowForm(false)} />
        )}

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              <MapPin className="h-4 w-4" />
              Past Games ({pastSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingSessions.length === 0 ? (
              <Card className="p-12 text-center space-y-4">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Upcoming Games</h3>
                  <p className="text-muted-foreground mb-4">
                    Plan your next airsoft session or log a booking
                  </p>
                  <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule Game
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {upcomingSessions.map((session) => (
                  <GameSessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {pastSessions.length === 0 ? (
              <Card className="p-12 text-center space-y-4">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Past Games</h3>
                  <p className="text-muted-foreground mb-4">
                    Start logging your airsoft sessions to track your game history and stats
                  </p>
                  <Button onClick={() => setShowForm(true)} size="lg" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Log Past Game
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                {/* Filters */}
                <Card className="p-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Filters:</span>
                    </div>
                    <Select value={siteFilter} onValueChange={setSiteFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Sites" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sites</SelectItem>
                        {uniqueSites.map(site => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={weaponFilter} onValueChange={setWeaponFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Weapons" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Weapons</SelectItem>
                        {uniqueWeapons.map(weapon => (
                          <SelectItem key={weapon} value={weapon}>{weapon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(siteFilter !== "all" || weaponFilter !== "all") && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSiteFilter("all");
                          setWeaponFilter("all");
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Grouped Sessions */}
                <div className="space-y-6">
                  {groupedPastSessions.map(([month, sessions]) => (
                    <div key={month} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{month}</h3>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="grid gap-4">
                        {sessions.map((session) => (
                          <GameSessionCard key={session.id} session={session} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default PlayerLog;
