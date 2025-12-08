import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommunityGuidelines = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6 pb-20">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="text-center space-y-2">
          <Shield className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Safe Zone Community Guidelines</h1>
          <p className="text-muted-foreground">
            Keep our community safe, respectful, and focused on the airsoft hobby
          </p>
        </div>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              What's Allowed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Sharing your airsoft builds, loadouts, and gear setups</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Game day recaps and highlights from your airsoft sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Tech questions about airsoft replicas and gear maintenance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Site reviews and recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Safety tips and best practices for the sport</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Constructive feedback and helpful advice to other players</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              What's NOT Allowed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>Any content related to real firearms or weapons</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>Harassment, hate speech, or discrimination</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>Content promoting unsafe gameplay or removing safety gear</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>Modifications that exceed legal FPS/joule limits</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>Spam, scams, or misleading information</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>Sales or trades outside the designated Marketplace</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Safety First
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Airsoft is a sport that requires responsibility and respect for safety rules:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Always wear eye protection</strong> - full-seal goggles or masks rated for airsoft</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Respect site rules</strong> - follow FPS limits, MED rules, and marshal instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Call your hits</strong> - fair play makes the game better for everyone</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Transport safely</strong> - always use gun bags and follow local laws</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Violations of these guidelines may result in content removal or account suspension.
          </p>
          <p className="mt-2">
            Help keep Safe Zone a welcoming community for all airsoft enthusiasts.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default CommunityGuidelines;
