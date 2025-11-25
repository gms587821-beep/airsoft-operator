import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { useOperators } from "@/hooks/useOperators";
import { useGuns } from "@/hooks/useGuns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, User, Target, CheckCircle2, Loader2, Plus } from "lucide-react";
import { OperatorPortrait } from "@/components/OperatorPortrait";
import { GunForm } from "@/components/GunForm";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { operators } = useOperators();
  const { addGun } = useGuns();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [playStyle, setPlayStyle] = useState<string>("");
  const [selectedOperator, setSelectedOperator] = useState<string>("");
  const [showGunForm, setShowGunForm] = useState(false);

  const playStyles = [
    { value: "cqb", label: "CQB Specialist", description: "Close-quarters combat expert" },
    { value: "dmr", label: "DMR Marksman", description: "Precision long-range shooter" },
    { value: "support", label: "Support Gunner", description: "Heavy firepower and suppression" },
    { value: "rifleman", label: "Rifleman", description: "All-around tactical player" },
    { value: "sniper", label: "Sniper", description: "Stealth and precision eliminations" },
  ];

  useEffect(() => {
    // Check if onboarding is already complete
    const checkOnboarding = async () => {
      if (!user) return;
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("active_operator_id")
        .eq("id", user.id)
        .single();

      const { data: guns } = await supabase
        .from("guns")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (profile?.active_operator_id && guns && guns.length > 0) {
        // Onboarding already complete
        navigate("/");
      }
    };

    checkOnboarding();
  }, [user, navigate]);

  const handlePlayStyleSubmit = async () => {
    if (!playStyle) {
      toast.error("Please select your play style");
      return;
    }
    setStep(2);
  };

  const handleOperatorSubmit = async () => {
    if (!selectedOperator) {
      toast.error("Please select an operator");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ active_operator_id: selectedOperator })
        .eq("id", user?.id);

      if (error) throw error;
      
      setStep(3);
    } catch (error: any) {
      toast.error("Failed to save operator: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGunSubmit = async (gunData: any) => {
    addGun(gunData, {
      onSuccess: () => {
        toast.success("Welcome to Airsoft HQ!");
        // Small delay to ensure queries are invalidated before navigation
        setTimeout(() => navigate("/"), 100);
      },
    });
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`flex items-center ${num < 3 ? "flex-1" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step >= num
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
              {num < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    step > num ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Play Style */}
        {step === 1 && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome, Operator</CardTitle>
              <CardDescription>Choose your primary play style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={playStyle} onValueChange={setPlayStyle}>
                {playStyles.map((style) => (
                  <Label
                    key={style.value}
                    htmlFor={style.value}
                    className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent"
                  >
                    <RadioGroupItem value={style.value} id={style.value} />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{style.label}</p>
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
              <Button
                onClick={handlePlayStyleSubmit}
                className="w-full"
                disabled={!playStyle}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Choose Operator */}
        {step === 2 && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Choose Your Operator</CardTitle>
              <CardDescription>Select your AI tactical advisor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedOperator} onValueChange={setSelectedOperator}>
                {operators.map((operator) => (
                  <Label
                    key={operator.id}
                    htmlFor={operator.id}
                    className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent"
                  >
                    <RadioGroupItem value={operator.id} id={operator.id} />
                    <div className="w-12 h-12 flex-shrink-0">
                      <OperatorPortrait 
                        avatar={operator.default_avatar || "🎯"} 
                        accentColor={operator.accent_color}
                        size="md"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{operator.name}</p>
                      <p className="text-sm text-muted-foreground">{operator.role}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {operator.personality_description}
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleOperatorSubmit}
                  className="flex-1"
                  disabled={!selectedOperator || loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Add First Gun */}
        {step === 3 && (
          <>
            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                onClick={() => setStep(2)}
                disabled={loading}
              >
                Back
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate("/")}
                disabled={loading}
                className="ml-auto"
              >
                Skip for now
              </Button>
            </div>
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Build Your Arsenal</CardTitle>
                <CardDescription>Add your first gun to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg"
                  className="w-full"
                  onClick={() => setShowGunForm(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Gun
                </Button>
              </CardContent>
            </Card>

            <GunForm
              open={showGunForm}
              onOpenChange={setShowGunForm}
              onSubmit={handleGunSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
