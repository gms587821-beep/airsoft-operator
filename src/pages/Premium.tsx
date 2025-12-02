import { Crown, Check, X, Shield, Zap, Target, TrendingUp, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";

const Premium = () => {
  const { data: profile } = useProfile();
  const { startCheckout, manageSubscription } = useSubscription();
  const navigate = useNavigate();
  const isPremium = profile?.subscription_tier === 'premium';

  const features = [
    {
      category: "Loadout Management",
      icon: Target,
      items: [
        { name: "Loadout Builder Access", standard: true, premium: true },
        { name: "Number of Loadouts", standard: "Up to 3", premium: "Unlimited" },
        { name: "Loadout Cost Tracking", standard: true, premium: true },
        { name: "Loadout Photo Upload", standard: true, premium: true },
      ]
    },
    {
      category: "Gun Registry",
      icon: Shield,
      items: [
        { name: "Gun Registry Access", standard: true, premium: true },
        { name: "Number of Guns", standard: "Up to 5", premium: "Unlimited" },
        { name: "Photo & Serial Tracking", standard: true, premium: true },
        { name: "Upgrades & Receipts Log", standard: true, premium: true },
      ]
    },
    {
      category: "Maintenance Tracking",
      icon: TrendingUp,
      items: [
        { name: "Maintenance Log Access", standard: true, premium: true },
        { name: "Number of Maintenance Logs", standard: "Up to 10", premium: "Unlimited" },
        { name: "Service Reminders", standard: true, premium: true },
        { name: "Cost Analytics", standard: true, premium: true },
      ]
    },
    {
      category: "Marketplace",
      icon: Zap,
      items: [
        { name: "Browse Products & Listings", standard: true, premium: true },
        { name: "Create Listings", standard: true, premium: true },
        { name: "Marketplace Fee", standard: "8%", premium: "3%" },
        { name: "Listing Boost Priority", standard: false, premium: true },
      ]
    },
    {
      category: "AI Diagnostics",
      icon: Shield,
      items: [
        { name: "Access to The Armourer", standard: true, premium: true },
        { name: "Diagnostic Conversations", standard: "Basic", premium: "Advanced" },
        { name: "Save Diagnostic History", standard: true, premium: true },
        { name: "Priority Response Time", standard: false, premium: true },
      ]
    },
    {
      category: "Experience",
      icon: Crown,
      items: [
        { name: "Ad-Free Experience", standard: false, premium: true },
        { name: "Exclusive Operator Skins", standard: false, premium: true },
        { name: "Priority Support", standard: false, premium: true },
        { name: "Early Access to Features", standard: false, premium: true },
      ]
    }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/profile")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>

        {/* Hero Section */}
        <Card className="bg-gradient-tactical border-yellow-500/20 shadow-glow">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Crown className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Airsoft HQ Premium</h1>
            <p className="text-muted-foreground mb-6">
              Unlock unlimited gear tracking, advanced diagnostics, and exclusive features
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-4xl font-bold">£5.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            {isPremium ? (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                <Crown className="h-3 w-3 mr-1" />
                Current Plan
              </Badge>
            ) : (
              <Button size="lg" onClick={startCheckout} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Quick Comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Standard (Free)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">3</span>
                </div>
                <span>Loadouts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">5</span>
                </div>
                <span>Guns in Registry</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">10</span>
                </div>
                <span>Maintenance Logs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">8%</span>
                </div>
                <span>Marketplace Fee</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-yellow-500">∞</span>
                </div>
                <span className="font-medium">Unlimited Loadouts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-yellow-500">∞</span>
                </div>
                <span className="font-medium">Unlimited Guns</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-yellow-500">∞</span>
                </div>
                <span className="font-medium">Unlimited Maintenance</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-yellow-500">3%</span>
                </div>
                <span className="font-medium">Lower Marketplace Fee</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feature Comparison */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Complete Feature Comparison</h2>
          
          {features.map((section, idx) => (
            <Card key={idx} className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-primary" />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="grid grid-cols-[1fr,auto,auto] gap-4 px-6 py-3 items-center hover:bg-muted/30 transition-colors">
                      <span className="text-sm">{item.name}</span>
                      
                      {/* Standard */}
                      <div className="text-center w-20">
                        {typeof item.standard === 'boolean' ? (
                          item.standard ? (
                            <Check className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-muted-foreground">{item.standard}</span>
                        )}
                      </div>
                      
                      {/* Premium */}
                      <div className="text-center w-20">
                        {typeof item.premium === 'boolean' ? (
                          item.premium ? (
                            <Check className="h-5 w-5 text-yellow-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-medium text-yellow-500">{item.premium}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className="bg-gradient-tactical border-primary/20">
          <CardHeader>
            <CardTitle>Why Go Premium?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track Everything</h3>
                <p className="text-sm text-muted-foreground">
                  No limits on loadouts, guns, or maintenance logs. Build your complete airsoft arsenal.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Save on Fees</h3>
                <p className="text-sm text-muted-foreground">
                  Pay only 3% marketplace fee instead of 8%. Saves you money on every sale.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Exclusive Access</h3>
                <p className="text-sm text-muted-foreground">
                  Ad-free experience, exclusive operator skins, and early access to new features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to upgrade?</h3>
            <p className="text-muted-foreground mb-6">
              {isPremium 
                ? "You're already enjoying all premium benefits"
                : "Join thousands of players with unlimited access"}
            </p>
            {isPremium ? (
              <Button variant="outline" onClick={manageSubscription}>
                Manage Subscription
              </Button>
            ) : (
              <Button size="lg" onClick={startCheckout} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Premium Now
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Premium;
