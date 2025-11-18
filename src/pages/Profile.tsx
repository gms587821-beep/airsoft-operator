import { User, Settings, LogOut, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loadoutsCount, setLoadoutsCount] = useState(0);
  const [gunsCount, setGunsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    // Fetch loadouts count
    const { count: loadoutsCount } = await supabase
      .from("loadouts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    
    // Fetch guns count
    const { count: gunsCount } = await supabase
      .from("guns")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    
    setProfile(profileData);
    setLoadoutsCount(loadoutsCount || 0);
    setGunsCount(gunsCount || 0);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const stats = [
    { label: "Games Played", value: profile?.games_played || "0" },
    { label: "Loadouts", value: loadoutsCount.toString() },
    { label: "Gear Items", value: gunsCount.toString() },
  ];

  const menuItems = [
    { icon: User, label: "Edit Profile" },
    { icon: Shield, label: "Operator Settings" },
    { icon: Settings, label: "App Settings" },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </Card>
        </div>
        <Navigation />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = profile?.display_name || "Operator";
  const initials = displayName.substring(0, 2).toUpperCase();
  const memberSince = profile?.member_since 
    ? new Date(profile.member_since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : "Recently";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-6 bg-gradient-tactical border-primary/20 shadow-glow">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24 border-2 border-primary">
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
              <p className="text-muted-foreground">Member since {memberSince}</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 bg-card border-border text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="p-4 bg-card border-border hover:border-primary/30 transition-smooth cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary group-hover:bg-primary/20 flex items-center justify-center transition-smooth">
                  <item.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-smooth" />
                </div>
                <span className="text-foreground font-medium">{item.label}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
