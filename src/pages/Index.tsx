import { MessageSquare, TrendingUp, Shield, Zap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: "AI Tech Support",
      description: "Get instant diagnostics from The Operator for any gear issue",
      path: "/operator",
    },
    {
      icon: TrendingUp,
      title: "Marketplace",
      description: "Buy, sell, and trade airsoft equipment with verified sellers",
      path: "/marketplace",
    },
    {
      icon: Zap,
      title: "Player Toolkit",
      description: "FPS calculators, loadout builders, and maintenance tracking",
      path: "/tools",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-tactical opacity-50" />
        
        <div className="relative container mx-auto px-4 pt-12 pb-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            {/* The Operator Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">The Operator is Online</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Airsoft</span>
              <span className="text-primary text-glow"> HQ</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your all-in-one tactical platform. Marketplace, diagnostics, site booking, and AI-powered support—all guided by The Operator.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-tactical font-semibold transition-smooth"
                    onClick={() => navigate('/operator')}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Ask The Operator
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/10 transition-smooth"
                    onClick={() => navigate('/marketplace')}
                  >
                    Explore Marketplace
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-tactical font-semibold transition-smooth"
                    onClick={() => navigate('/auth')}
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/10 transition-smooth"
                    onClick={() => navigate('/operator')}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Ask The Operator
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              onClick={() => navigate(feature.path)}
              className="p-6 bg-card border-border shadow-card hover:shadow-tactical transition-smooth cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* The Operator Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="p-8 bg-gradient-tactical border-primary/20 shadow-glow">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                Meet Your AI Mentor
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                The Operator
              </h2>
              <p className="text-muted-foreground text-lg">
                Your elite tactical advisor. From gear diagnostics to loadout optimization, The Operator provides expert guidance backed by decades of airsoft knowledge.
              </p>
              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Instant gear diagnostics</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Personalized upgrade recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>24/7 tactical support</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-gradient-accent opacity-20 blur-3xl absolute inset-0 animate-pulse" />
                <div className="relative w-64 h-64 rounded-full bg-card/50 backdrop-blur border-2 border-primary/30 flex items-center justify-center">
                  <Shield className="w-32 h-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Navigation />
    </div>
  );
};

export default Index;
