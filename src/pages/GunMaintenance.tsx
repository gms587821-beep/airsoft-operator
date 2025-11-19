import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { MaintenanceHistory } from "@/components/MaintenanceHistory";
import { useGuns } from "@/hooks/useGuns";

const GunMaintenance = () => {
  const { gunId } = useParams();
  const navigate = useNavigate();
  const { guns, isLoading } = useGuns();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const gun = guns?.find(g => g.id === gunId);

  if (!gun) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Gun not found</p>
          <Button onClick={() => navigate('/arsenal')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Arsenal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Button
          onClick={() => navigate('/arsenal')}
          variant="ghost"
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Arsenal
        </Button>

        <MaintenanceHistory gunId={gun.id} gunName={gun.name} />
      </div>

      <Navigation />
    </div>
  );
};

export default GunMaintenance;
