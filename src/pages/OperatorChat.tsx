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
import { useGameSessions } from "@/hooks/useGameSessions";
import { useSites } from "@/hooks/useSites";
import { useSiteFavourites } from "@/hooks/useSiteFavourites";

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
  const { gameSessions: sessions } = useGameSessions();
  const { data: sites } = useSites();
  const { data: favourites } = useSiteFavourites();

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

  const generateResponse = async (userInput: string) => {
    if (!activeOperator) return;

    const userContext = {
      primaryRole: profile?.primary_role,
      arsenalCount: guns?.length || 0,
      gamesPlayed: sessions?.length || 0,
      favoriteSites: favourites?.map(f => sites?.find(s => s.id === f.site_id)?.name).filter(Boolean).join(", "),
      recentGuns: guns?.slice(0, 2).map(g => g.name).join(", "),
    };

    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/operator-chat`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messages
            .filter(m => m.role !== "operator" || m.content)
            .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.content })),
          operatorName: activeOperator.name,
          operatorRole: activeOperator.role,
          operatorPersonality: activeOperator.personality_description || "Professional, tactical, and knowledgeable. Uses military terminology naturally.",
          userContext,
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = "Rate limit reached. Please try again in a moment.";
            return updated;
          });
          return;
        }
        if (resp.status === 402) {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = "AI service requires additional credits. Please contact support.";
            return updated;
          });
          return;
        }
        throw new Error("Failed to get response");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let fullResponse = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullResponse += content;
              setMessages(prev => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && lastMsg.role === "operator") {
                  lastMsg.content = fullResponse;
                }
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error calling operator chat:", error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = "I'm having trouble connecting right now. Please try again.";
        return updated;
      });
    }
  };

  const handleSend = async (text?: string) => {
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

    // Add empty operator message that will be filled by streaming
    const operatorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "operator",
      content: "",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, operatorMessage]);

    try {
      await generateResponse(messageText);
    } finally {
      setIsProcessing(false);
    }
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
