import { useState, useEffect } from "react";
import { Calculator, Package, Wrench, AlertCircle, Target, MapPin, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useOperators } from "@/hooks/useOperators";
import { OperatorDialogue } from "@/components/OperatorDialogue";

const Tools = () => {
  const { getOperatorForContext } = useOperators();
  const armourer = getOperatorForContext("tools");
  const navigate = useNavigate();
  
  const [weight, setWeight] = useState("");
  const [fps, setFps] = useState("");
  const [joules, setJoules] = useState<string | null>(null);
  const [showAdvice, setShowAdvice] = useState(false);

  const calculateJoules = () => {
    const w = parseFloat(weight);
    const f = parseFloat(fps);
    if (w && f) {
      const j = (0.5 * (w / 1000) * Math.pow(f * 0.3048, 2)).toFixed(2);
      setJoules(j);
      setShowAdvice(true);
    }
  };

  useEffect(() => {
    if (showAdvice) {
      const timer = setTimeout(() => setShowAdvice(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showAdvice]);

  const getAdviceMessage = () => {
    if (!joules) return "";
    const j = parseFloat(joules);
    if (j < 1.0) return "Low power. Safe for CQB. Limited range though.";
    if (j <= 1.3) return "Standard AEG range. Legal for most UK sites. Solid.";
    if (j <= 1.5) return "Getting hot. Check site limits. Some CQB sites won't allow this.";
    if (j <= 2.3) return "DMR territory. MEDs apply. Know your rules.";
    return "Sniper power. Strict MEDs required. Double-check site limits.";
  };

  const toolCards = [
    {
      icon: Target,
      title: "Gun Arsenal",
      description: "Manage your loadout with photos, specs, and AI diagnostics",
      badge: "Active",
      onClick: () => navigate("/arsenal"),
      active: true,
    },
    {
      icon: ShoppingCart,
      title: "Loadout Builder",
      description: "Build your dream loadout from shops like Patrol Base & BZ",
      badge: "New",
      onClick: () => navigate("/loadout-builder"),
      active: true,
    },
    {
      icon: Wrench,
      title: "Maintenance Tracking",
      description: "Track service history, part replacements, and scheduled maintenance",
      badge: "Active",
      onClick: () => navigate("/maintenance"),
      active: true,
    },
    {
      icon: Package,
      title: "Kit Log",
      description: "Track your airsoft gear and equipment inventory",
      badge: "Active",
      onClick: () => navigate("/kit-log"),
      active: true,
    },
    {
      icon: MapPin,
      title: "Player Log",
      description: "Record game sessions, bookings, and site visits",
      badge: "Active",
      onClick: () => navigate("/player-log"),
      active: true,
    },
    {
      icon: Calculator,
      title: "Statistics",
      description: "View your stats, achievements, and progress",
      badge: "New",
      onClick: () => navigate("/statistics"),
      active: true,
    },
  ];

  if (!armourer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Player Toolkit</h1>

        {/* FPS/Joule Calculator */}
        <Card className="p-6 bg-card border-border shadow-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">FPS/Joule Calculator</h2>
                <p className="text-sm text-muted-foreground">Calculate energy output of your gear</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">BB Weight (grams)</Label>
                <div className="flex gap-2 mb-2">
                  {["0.20", "0.25", "0.28", "0.30", "0.32"].map((w) => (
                    <Button
                      key={w}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setWeight(w)}
                      className={weight === w ? "bg-primary text-primary-foreground" : ""}
                    >
                      {w}g
                    </Button>
                  ))}
                </div>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  placeholder="0.20"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fps">FPS (Feet Per Second)</Label>
                <Input
                  id="fps"
                  type="number"
                  placeholder="350"
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <Button
              onClick={calculateJoules}
              className="w-full bg-primary hover:bg-primary/90 transition-smooth"
            >
              Calculate
            </Button>

            {joules && (
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-tactical border-primary/20">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Energy Output</p>
                    <p className="text-4xl font-bold text-primary">{joules} J</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      <span>Check your site's FPS limits before play</span>
                    </div>
                  </div>
                </Card>
                
                {showAdvice && (
                  <OperatorDialogue
                    message={getAdviceMessage()}
                    operatorName={armourer.name}
                    operatorAvatar={armourer.default_avatar || "🔧"}
                    accentColor={armourer.accent_color}
                  />
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Other Tools */}
        <div className="grid md:grid-cols-2 gap-4">
          {toolCards.map((tool, index) => (
            <Card
              key={index}
              onClick={tool.onClick}
              className={`p-6 bg-card border-border shadow-card transition-smooth ${
                tool.active
                  ? "cursor-pointer hover:border-primary/50 hover:shadow-card-hover"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tool.active ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <tool.icon className={`w-5 h-5 ${
                      tool.active ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tool.active
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {tool.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Tools;
