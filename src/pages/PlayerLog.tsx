import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { GameSessionCard } from "@/components/GameSessionCard";
import { GameSessionForm } from "@/components/GameSessionForm";
import { useGameSessions } from "@/hooks/useGameSessions";

const PlayerLog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gameSessions, upcomingSessions, pastSessions, isLoading } = useGameSessions();
  const [showForm, setShowForm] = useState(false);

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
              <h1 className="text-3xl font-bold text-foreground">Player Log</h1>
              <p className="text-sm text-muted-foreground">Track where you've played and upcoming games</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Game Session
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
                  <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Upcoming Game
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
                    Start logging your airsoft sessions to track your game history
                  </p>
                  <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Past Game
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pastSessions.map((session) => (
                  <GameSessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </div>
  );
};

export default PlayerLog;
