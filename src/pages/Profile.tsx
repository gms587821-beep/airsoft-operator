import { User, Settings, LogOut, Shield, Crown, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { startCheckout, manageSubscription } = useSubscription();
  const navigate = useNavigate();
  const [loadoutsCount, setLoadoutsCount] = useState(0);
  const [gunsCount, setGunsCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    if (!user) return;
    
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
    
    setLoadoutsCount(loadoutsCount || 0);
    setGunsCount(gunsCount || 0);
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
    { icon: User, label: "Edit Profile", action: () => {} },
    { icon: Shield, label: "Operator Settings", action: () => navigate("/operators") },
    { icon: Settings, label: "App Settings", action: () => {} },
  ];

  if (authLoading || profileLoading) {
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
              <div className="flex items-center gap-2 justify-center">
                <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
                {profile?.subscription_tier === 'premium' && (
                  <Crown className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <p className="text-muted-foreground">Member since {memberSince}</p>
            </div>
          </div>
        </Card>

        {/* Plan Comparison */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
            onClick={() => navigate("/premium")}
          >
            <Crown className="mr-2 h-4 w-4" />
            View Complete Feature Comparison
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Standard Plan */}
          <Card className={profile?.subscription_tier === 'standard' ? 'border-primary' : ''}>
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold">Standard</h3>
                  {profile?.subscription_tier === 'standard' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">Current</span>
                  )}
                </div>
                <p className="text-2xl font-bold mb-1">Free</p>
                <p className="text-xs text-muted-foreground mb-4">Forever</p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>Up to 3 loadouts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>Up to 5 guns in registry</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>8% marketplace fee</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>Basic diagnostics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>Limited maintenance history</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>Ads included</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                variant={profile?.subscription_tier === 'standard' ? 'outline' : 'default'}
                disabled={profile?.subscription_tier === 'standard'}
              >
                {profile?.subscription_tier === 'standard' ? 'Current Plan' : 'Downgrade'}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={profile?.subscription_tier === 'premium' ? 'border-yellow-500 bg-yellow-500/5' : 'border-yellow-500/50'}>
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold">Premium</h3>
                  {profile?.subscription_tier === 'premium' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500">Current</span>
                  )}
                </div>
                <p className="text-2xl font-bold mb-1">£5.99</p>
                <p className="text-xs text-muted-foreground mb-1">per month</p>
                {profile?.subscription_tier === 'premium' && profile?.subscription_ends_at && (
                  <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Renews {new Date(profile.subscription_ends_at).toLocaleDateString('en-GB')}
                  </p>
                )}
                {profile?.subscription_tier !== 'premium' && <div className="mb-4"></div>}
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span className="font-medium">Unlimited loadouts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span className="font-medium">Unlimited guns in registry</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span className="font-medium">3% marketplace fee</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span className="font-medium">Advanced diagnostics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span className="font-medium">Full maintenance history</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span className="font-medium">No ads</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">✓</span>
                    <span className="font-medium">Exclusive operator skins</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={profile?.subscription_tier === 'premium' ? manageSubscription : startCheckout}
                variant={profile?.subscription_tier === 'premium' ? 'outline' : 'default'}
              >
                {profile?.subscription_tier === 'premium' ? 'Manage Subscription' : 'Upgrade to Premium'}
              </Button>
            </CardContent>
          </Card>
        </div>

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
              onClick={item.action}
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
