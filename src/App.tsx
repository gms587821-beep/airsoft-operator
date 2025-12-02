import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import MarketplaceProductDetail from "./pages/MarketplaceProductDetail";
import MarketplaceListingDetail from "./pages/MarketplaceListingDetail";
import SellGear from "./pages/SellGear";
import Sites from "./pages/Sites";
import SiteDetail from "./pages/SiteDetail";
import AddSite from "./pages/AddSite";
import Tools from "./pages/Tools";
import Profile from "./pages/Profile";
import Operator from "./pages/Operator";
import OperatorHub from "./pages/OperatorHub";
import OperatorChat from "./pages/OperatorChat";
import OperatorsPage from "./pages/Operators";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Arsenal from "./pages/Arsenal";
import GunMaintenance from "./pages/GunMaintenance";
import MaintenanceDashboard from "./pages/MaintenanceDashboard";
import KitLog from "./pages/KitLog";
import PlayerLog from "./pages/PlayerLog";
import Statistics from "./pages/Statistics";
import LoadoutBuilder from "./pages/LoadoutBuilder";
import LoadoutDetail from "./pages/LoadoutDetail";
import Install from "./pages/Install";
import Premium from "./pages/Premium";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/install" element={<Install />} />
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/marketplace/product/:id" element={<ProtectedRoute><MarketplaceProductDetail /></ProtectedRoute>} />
            <Route path="/marketplace/listing/:id" element={<ProtectedRoute><MarketplaceListingDetail /></ProtectedRoute>} />
            <Route path="/marketplace/sell" element={<ProtectedRoute><SellGear /></ProtectedRoute>} />
            <Route path="/sites" element={<ProtectedRoute><Sites /></ProtectedRoute>} />
            <Route path="/sites/:id" element={<ProtectedRoute><SiteDetail /></ProtectedRoute>} />
            <Route path="/sites/add" element={<ProtectedRoute><AddSite /></ProtectedRoute>} />
            <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
            <Route path="/operator" element={<ProtectedRoute><Operator /></ProtectedRoute>} />
            <Route path="/operator/hub" element={<ProtectedRoute><OperatorHub /></ProtectedRoute>} />
            <Route path="/operator/chat" element={<ProtectedRoute><OperatorChat /></ProtectedRoute>} />
            <Route path="/operators" element={<ProtectedRoute><OperatorsPage /></ProtectedRoute>} />
            <Route path="/arsenal" element={<ProtectedRoute><Arsenal /></ProtectedRoute>} />
            <Route path="/arsenal/:gunId/maintenance" element={<ProtectedRoute><GunMaintenance /></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute><MaintenanceDashboard /></ProtectedRoute>} />
            <Route path="/kit-log" element={<ProtectedRoute><KitLog /></ProtectedRoute>} />
            <Route path="/player-log" element={<ProtectedRoute><PlayerLog /></ProtectedRoute>} />
            <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
            <Route path="/loadout-builder" element={<ProtectedRoute><LoadoutBuilder /></ProtectedRoute>} />
            <Route path="/loadout-builder/:id" element={<ProtectedRoute><LoadoutDetail /></ProtectedRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
