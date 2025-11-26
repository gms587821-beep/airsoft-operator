import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useOperators } from "@/hooks/useOperators";
import { useGuns } from "@/hooks/useGuns";
import { useAllMaintenance } from "@/hooks/useAllMaintenance";
import { useGameSessions } from "@/hooks/useGameSessions";
import { useSites } from "@/hooks/useSites";
import { useSiteFavourites } from "@/hooks/useSiteFavourites";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import {
  getGunDiagnosis,
  getUpgradeAdvice,
  getSiteRecommendations,
  getLoadoutSuggestion,
  getPreGameBrief
} from "@/lib/operatorLogic";

interface Message {
  id: string;
  role: "user" | "operator";
  content: string;
  timestamp: Date;
}

const OperatorChat = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: profile } = useProfile();
  const { operators } = useOperators();
  const { guns } = useGuns();
  const { maintenanceLogs } = useAllMaintenance();
  const { gameSessions: sessions } = useGameSessions();
  const { data: sites } = useSites();
  const { data: favourites } = useSiteFavourites();
  const { data: products } = useMarketplaceProducts();

  const activeOperator = operators?.find(
    op => op.id === profile?.active_operator_id
  ) || operators?.[0];

  useEffect(() => {
    if (activeOperator && messages.length === 0) {
      const greeting = `${activeOperator.name} here. ${profile?.display_name || "Operator"}, what do you need?`;
      setMessages([{
        id: Date.now().toString(),
        role: "operator",
        content: greeting,
        timestamp: new Date()
      }]);
      
      // Auto-trigger action if specified
      if (action) {
        setTimeout(() => handleAction(action), 500);
      }
    }
  }, [activeOperator, action, profile]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAction = (actionType: string) => {
    let userMessage = "";
    
    switch (actionType) {
      case "diagnose":
        userMessage = "Diagnose my guns";
        break;
      case "upgrades":
        userMessage = "What upgrades should I get?";
        break;
      case "gear":
        userMessage = "Recommend gear for my playstyle";
        break;
      case "sites":
        userMessage = "Recommend airsoft sites for me";
        break;
      case "loadout":
        userMessage = "Help me build a loadout";
        break;
      case "brief":
        userMessage = "Give me a pre-game brief";
        break;
      default:
        return;
    }
    
    setInput(userMessage);
    setTimeout(() => handleSend(userMessage), 100);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Diagnose
    if (input.includes("diagnose") || input.includes("check my gun") || input.includes("gun problem")) {
      if (!guns || guns.length === 0) {
        return "No guns registered in your arsenal. Add your weapons first so I can analyze them.";
      }
      
      const diagnoses = guns.slice(0, 3).map(gun => 
        getGunDiagnosis(gun, (maintenanceLogs || []) as any)
      );
      
      return diagnoses.join("\n\n");
    }
    
    // Upgrades
    if (input.includes("upgrade") || input.includes("improve") || input.includes("parts")) {
      if (!guns || guns.length === 0) {
        return "Register your weapons first. I need to know what you're running before I can suggest upgrades.";
      }
      
      const advice = guns.slice(0, 2).map(gun => 
        getUpgradeAdvice(gun, products || [])
      );
      
      return advice.join("\n\n");
    }
    
    // Sites
    if (input.includes("site") || input.includes("where") || input.includes("play")) {
      const recommendations = getSiteRecommendations(
        sites || [],
        profile?.primary_role || "Rifleman",
        [] // favourites need to be full Site objects, not just IDs
      );
      
      return recommendations.join("\n\n");
    }
    
    // Loadout
    if (input.includes("loadout") || input.includes("gear") || input.includes("kit")) {
      return getLoadoutSuggestion(
        profile?.primary_role || "Rifleman",
        guns || [],
        products || []
      );
    }
    
    // Brief
    if (input.includes("brief") || input.includes("prepare") || input.includes("ready")) {
      const lastSite = sessions?.[0]?.site_id 
        ? sites?.find(s => s.id === sessions[0].site_id)
        : null;
      
      return getPreGameBrief(
        profile?.primary_role || "Rifleman",
        lastSite || null
      );
    }
    
    // Stats
    if (input.includes("stats") || input.includes("performance") || input.includes("how am i")) {
      return `**Operator Status:**\n\n` +
        `Arsenal: ${guns?.length || 0} weapons\n` +
        `Maintenance logs: ${maintenanceLogs?.length || 0}\n` +
        `Games played: ${sessions?.length || 0}\n` +
        `Favourite sites: ${favourites?.length || 0}\n` +
        `Role: ${profile?.primary_role || "Not set"}\n\n` +
        `You're building a solid foundation. Keep logging sessions and maintaining your gear.`;
    }
    
    // Default
    return `Roger that. I can help with:\n\n` +
      `• "Diagnose my guns" - weapon status check\n` +
      `• "What upgrades should I get?" - performance advice\n` +
      `• "Recommend sites" - find fields\n` +
      `• "Build a loadout" - gear configuration\n` +
      `• "Pre-game brief" - mission prep\n` +
      `• "Show my stats" - operator status\n\n` +
      `What do you need?`;
  };

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    setTimeout(() => {
      const response = generateResponse(messageText);
      const operatorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "operator",
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, operatorMessage]);
      setIsProcessing(false);
    }, 800);
  };

  if (!activeOperator) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Loading operator...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Operator Chat</h1>
          <p className="text-sm text-muted-foreground">
            {activeOperator.name} • {activeOperator.role}
          </p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                    style={
                      message.role === "operator"
                        ? { backgroundColor: `${activeOperator.accent_color}20` }
                        : undefined
                    }
                  >
                    {message.role === "operator" && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">
                          {activeOperator.default_avatar || "🎯"}
                        </span>
                        <span 
                          className="text-xs font-semibold"
                          style={{ color: activeOperator.accent_color }}
                        >
                          {activeOperator.name}
                        </span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div
                    className="rounded-lg p-3 flex items-center gap-2"
                    style={{ backgroundColor: `${activeOperator.accent_color}20` }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Processing...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your operator..."
                disabled={isProcessing}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isProcessing}
                style={{ backgroundColor: activeOperator.accent_color }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default OperatorChat;
