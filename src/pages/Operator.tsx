import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { useOperators } from "@/hooks/useOperators";
import { OperatorDialogue } from "@/components/OperatorDialogue";
import { OperatorPortrait } from "@/components/OperatorPortrait";

interface Message {
  role: "user" | "operator";
  content: string;
}

const Operator = () => {
  const { getOperatorForContext } = useOperators();
  const armourer = getOperatorForContext("diagnostics");
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "operator",
      content: "Welcome to the workshop. I'm The Armourer. Tell me what's wrong with your gear, and I'll help you diagnose it.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate armourer response with diagnostic style
    setTimeout(() => {
      const operatorResponse: Message = {
        role: "operator",
        content: "Classic issue. FPS drop? Check your air seal first. Nozzle alignment, piston head O-ring, cylinder head seal. Start there. I'll walk you through each step.",
      };
      setMessages((prev) => [...prev, operatorResponse]);
    }, 1000);

    setInput("");
  };

  if (!armourer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <OperatorPortrait
            avatar={armourer.default_avatar || "🔧"}
            accentColor={armourer.accent_color}
            size="md"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">{armourer.name}</h1>
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: armourer.accent_color }}
              />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {messages.map((message, index) =>
            message.role === "operator" ? (
              <OperatorDialogue
                key={index}
                message={message.content}
                operatorName={armourer.name}
                operatorAvatar={armourer.default_avatar || "🔧"}
                accentColor={armourer.accent_color}
              />
            ) : (
              <div key={index} className="flex justify-end">
                <div className="max-w-[80%] p-4 rounded-lg bg-card border border-border">
                  <p className="text-foreground leading-relaxed">{message.content}</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Input */}
        <div className="pt-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Describe your gear issue..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="bg-card border-border"
            />
            <Button
              onClick={handleSend}
              style={{ backgroundColor: armourer.accent_color }}
              className="hover:opacity-90 transition-smooth"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI-powered diagnostics • Always tactical, never wrong
          </p>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Operator;
