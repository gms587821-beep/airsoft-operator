import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Target, TrendingUp, Award, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGameSessions } from "@/hooks/useGameSessions";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Statistics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gameSessions, isLoading } = useGameSessions();

  const stats = useMemo(() => {
    const completed = gameSessions.filter(s => !s.is_upcoming);
    
    const totalGames = completed.length;
    const totalSpent = completed.reduce((sum, s) => sum + (s.cost || 0), 0);
    const totalKills = completed.reduce((sum, s) => sum + (s.kills || 0), 0);
    const totalDeaths = completed.reduce((sum, s) => sum + (s.deaths || 0), 0);
    const kd = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills;

    // Favorite site
    const siteCounts: Record<string, number> = {};
    completed.forEach(s => {
      siteCounts[s.site_name] = (siteCounts[s.site_name] || 0) + 1;
    });
    const favoriteSite = Object.entries(siteCounts).sort((a, b) => b[1] - a[1])[0];

    // Favorite class
    const classCounts: Record<string, number> = {};
    completed.forEach(s => {
      if (s.player_class) {
        classCounts[s.player_class] = (classCounts[s.player_class] || 0) + 1;
      }
    });
    const favoriteClass = Object.entries(classCounts).sort((a, b) => b[1] - a[1])[0];

    // Favorite weapon
    const weaponCounts: Record<string, number> = {};
    completed.forEach(s => {
      if (s.weapon_used) {
        weaponCounts[s.weapon_used] = (weaponCounts[s.weapon_used] || 0) + 1;
      }
    });
    const favoriteWeapon = Object.entries(weaponCounts).sort((a, b) => b[1] - a[1])[0];

    // Class distribution for chart
    const classData = Object.entries(classCounts).map(([name, value]) => ({ name, value }));
    
    // Spending by month
    const spendingByMonth: Record<string, number> = {};
    completed.forEach(s => {
      if (s.cost) {
        const month = new Date(s.game_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        spendingByMonth[month] = (spendingByMonth[month] || 0) + s.cost;
      }
    });
    const spendingData = Object.entries(spendingByMonth).map(([month, amount]) => ({ month, amount }));

    // Calculate level (10 games per level)
    const level = Math.floor(totalGames / 10) + 1;
    const levelProgress = (totalGames % 10) * 10;

    // Calculate streaks
    const sortedGames = [...completed].sort((a, b) => 
      new Date(b.game_date).getTime() - new Date(a.game_date).getTime()
    );
    let currentStreak = 0;
    let today = new Date();
    for (const game of sortedGames) {
      const gameDate = new Date(game.game_date);
      const daysDiff = Math.floor((today.getTime() - gameDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 30) {
        currentStreak++;
        today = gameDate;
      } else {
        break;
      }
    }

    return {
      totalGames,
      totalSpent,
      totalKills,
      totalDeaths,
      kd,
      favoriteSite,
      favoriteClass,
      favoriteWeapon,
      classData,
      spendingData,
      level,
      levelProgress,
      currentStreak
    };
  }, [gameSessions]);

  const achievements = [
    { id: 1, name: "First Blood", description: "Play your first game", earned: stats.totalGames >= 1, icon: "🎯" },
    { id: 2, name: "Veteran", description: "Play 10 games", earned: stats.totalGames >= 10, icon: "🏆" },
    { id: 3, name: "Elite Operator", description: "Play 50 games", earned: stats.totalGames >= 50, icon: "⭐" },
    { id: 4, name: "Big Spender", description: "Spend £500 on games", earned: stats.totalSpent >= 500, icon: "💰" },
    { id: 5, name: "Sharp Shooter", description: "Achieve 2.0 K/D ratio", earned: parseFloat(stats.kd as string) >= 2.0, icon: "🎖️" },
    { id: 6, name: "Regular", description: "Play 3 games in 30 days", earned: stats.currentStreak >= 3, icon: "🔥" },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <Card className="p-8 text-center space-y-4">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Please sign in to view statistics</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/tools")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Player Statistics</h1>
            <p className="text-sm text-muted-foreground">Your airsoft journey</p>
          </div>
        </div>

        {/* Player Level Card */}
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Level {stats.level}</h2>
                <p className="text-sm text-muted-foreground">Operator Rank</p>
              </div>
              <Zap className="h-12 w-12 text-primary" />
            </div>
            <Progress value={stats.levelProgress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {10 - (stats.totalGames % 10)} games until level {stats.level + 1}
            </p>
          </CardContent>
        </Card>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.totalGames}</p>
              <p className="text-xs text-muted-foreground">Games Played</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-secondary mb-2" />
              <p className="text-2xl font-bold text-foreground">£{stats.totalSpent.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Award className="h-8 w-8 text-accent mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.kd}</p>
              <p className="text-xs text-muted-foreground">K/D Ratio</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Star className="h-8 w-8 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Monthly Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Favorites */}
        <Card>
          <CardHeader>
            <CardTitle>Your Favorites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Favorite Site</span>
              <Badge variant="secondary">{stats.favoriteSite?.[0] || "N/A"} ({stats.favoriteSite?.[1] || 0} games)</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Favorite Class</span>
              <Badge variant="secondary">{stats.favoriteClass?.[0] || "N/A"} ({stats.favoriteClass?.[1] || 0} games)</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Favorite Weapon</span>
              <Badge variant="secondary">{stats.favoriteWeapon?.[0] || "N/A"} ({stats.favoriteWeapon?.[1] || 0} games)</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        {stats.classData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Class Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.classData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {stats.classData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {stats.spendingData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Spending Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.spendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.earned 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-muted/20 border-border opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge variant="secondary" className="mt-2">Unlocked</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
};

export default Statistics;
