import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Download, Check } from "lucide-react";
import { toast } from "sonner";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast.info("Install option not available", {
        description: "Try adding to home screen from your browser menu"
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success("App installed successfully!");
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Install Airsoft HQ</h1>
          <p className="text-muted-foreground">
            Get the full app experience on your device
          </p>
        </div>

        {/* Install Card */}
        <Card className="p-6 bg-card border-border">
          {isInstalled ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  App Already Installed
                </h2>
                <p className="text-muted-foreground">
                  Airsoft HQ is already installed on your device. You can launch it from your home screen.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Install for the Best Experience
                </h2>
                <p className="text-muted-foreground">
                  Install Airsoft HQ to your device for:
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Faster loading</p>
                    <p className="text-sm text-muted-foreground">Access your arsenal instantly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Offline access</p>
                    <p className="text-sm text-muted-foreground">View your gear even without internet</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Home screen access</p>
                    <p className="text-sm text-muted-foreground">Launch like a native app</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleInstall} className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Install Airsoft HQ
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                On iOS: Tap <span className="font-semibold">Share</span> → <span className="font-semibold">Add to Home Screen</span>
                <br />
                On Android: Tap <span className="font-semibold">Menu</span> → <span className="font-semibold">Install App</span>
              </p>
            </div>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          "Every operator needs reliable tools. Install for maximum readiness."
        </p>
      </div>
    </div>
  );
};

export default Install;
