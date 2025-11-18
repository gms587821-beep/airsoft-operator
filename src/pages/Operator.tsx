import { useState } from "react";
import { Send, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

interface Message {
  role: "user" | "operator";
  content: string;
}

const Operator = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "operator",
      content: "Welcome to Airsoft HQ. I'm The Operator—your tactical advisor. What gear issue can I assist you with today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate operator response
    setTimeout(() => {
      const operatorResponse: Message = {
        role: "operator",
        content: "I've analyzed your query. Your FPS drop suggests air seal failure. Inspect the nozzle and piston head. I'll guide you through the process.",
      };
      setMessages((prev) => [...prev, operatorResponse]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">The Operator</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "operator"
                    ? "bg-gradient-tactical border-primary/20"
                    : "bg-card border-border"
                }`}
              >
                {message.role === "operator" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      The Operator
                    </span>
                  </div>
                )}
                <p className="text-foreground leading-relaxed">{message.content}</p>
              </Card>
            </div>
          ))}
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
              className="bg-primary hover:bg-primary/90 transition-smooth"
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
