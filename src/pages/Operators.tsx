import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useOperators } from "@/hooks/useOperators";
import { OperatorPortrait } from "@/components/OperatorPortrait";
import { Check } from "lucide-react";
import { toast } from "sonner";

const OperatorsPage = () => {
  const { operators, activeOperator, operatorsLoading, setActiveOperator } = useOperators();

  const handleSelectOperator = (operatorId: string, operatorName: string) => {
    setActiveOperator(operatorId);
    toast.success(`${operatorName} is now your active mentor`);
  };

  if (operatorsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading operators...</div>
      </div>
    );
  }

  const activeOps = operators?.filter((op) => op.primary_module !== "Future") || [];
  const futureOps = operators?.filter((op) => op.primary_module === "Future") || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">HQ Operators</h1>
          <p className="text-muted-foreground">
            Select your tactical mentor. Each operator specializes in different areas.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Active Operators</h2>
            <div className="grid gap-4">
              {activeOps.map((operator) => (
                <Card
                  key={operator.id}
                  className="p-6 border-2 transition-all hover:shadow-lg"
                  style={{
                    borderColor:
                      activeOperator?.id === operator.id
                        ? operator.accent_color
                        : "hsl(var(--border))",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <OperatorPortrait
                      avatar={operator.default_avatar || "?"}
                      accentColor={operator.accent_color}
                      size="lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {operator.name}
                      </h3>
                      <p
                        className="text-sm font-semibold mb-2"
                        style={{ color: operator.accent_color }}
                      >
                        {operator.role}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {operator.personality_description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleSelectOperator(operator.id, operator.name)}
                          variant={activeOperator?.id === operator.id ? "default" : "outline"}
                          size="sm"
                          style={
                            activeOperator?.id === operator.id
                              ? {
                                  backgroundColor: operator.accent_color,
                                  borderColor: operator.accent_color,
                                }
                              : {}
                          }
                        >
                          {activeOperator?.id === operator.id && (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          {activeOperator?.id === operator.id
                            ? "Active Mentor"
                            : "Set as Active"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {futureOps.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Coming Soon</h2>
              <div className="grid gap-4">
                {futureOps.map((operator) => (
                  <Card key={operator.id} className="p-6 opacity-50">
                    <div className="flex items-start gap-4">
                      <OperatorPortrait
                        avatar={operator.default_avatar || "?"}
                        accentColor={operator.accent_color}
                        size="lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {operator.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{operator.role}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default OperatorsPage;
