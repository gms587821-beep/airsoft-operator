import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Sites from "./pages/Sites";
import Tools from "./pages/Tools";
import Profile from "./pages/Profile";
import Operator from "./pages/Operator";
import OperatorsPage from "./pages/Operators";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Arsenal from "./pages/Arsenal";
import GunMaintenance from "./pages/GunMaintenance";
import MaintenanceDashboard from "./pages/MaintenanceDashboard";
import KitLog from "./pages/KitLog";
import PlayerLog from "./pages/PlayerLog";
import Statistics from "./pages/Statistics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/operator" element={<Operator />} />
            <Route path="/operators" element={<OperatorsPage />} />
            <Route path="/arsenal" element={<Arsenal />} />
            <Route path="/arsenal/:gunId/maintenance" element={<GunMaintenance />} />
            <Route path="/maintenance" element={<MaintenanceDashboard />} />
            <Route path="/kit-log" element={<KitLog />} />
            <Route path="/player-log" element={<PlayerLog />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
