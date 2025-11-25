import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import { SellGearForm } from "@/components/SellGearForm";

const SellGear = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/marketplace")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Sell Your Gear</h1>
        </div>

        <Card className="p-6">
          <SellGearForm />
        </Card>
      </div>
    </AppLayout>
  );
};

export default SellGear;
