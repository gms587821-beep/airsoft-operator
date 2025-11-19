import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Send, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { useOperators } from "@/hooks/useOperators";
import { OperatorDialogue } from "@/components/OperatorDialogue";
import { OperatorPortrait } from "@/components/OperatorPortrait";
import { useToast } from "@/hooks/use-toast";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Message {
  role: "user" | "operator";
  content: string;
}

const Operator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getOperatorForContext } = useOperators();
  const armourer = getOperatorForContext("diagnostics");
  const { toast } = useToast();
  const { saveDiagnostic } = useDiagnostics();
  
  const gunId = searchParams.get("gunId");
  const gunName = searchParams.get("gunName");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "operator",
      content: "Welcome to the workshop. I'm The Armourer. Tell me what's wrong with your gear, and I'll help you diagnose it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-diagnostics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role === "operator" ? "assistant" : "user",
            content: m.content
          }))
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";
      let streamDone = false;

      // Add placeholder for assistant message
      setMessages((prev) => [...prev, { role: "operator", content: "" }]);

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
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "operator",
                  content: assistantContent
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get diagnostic response. Please try again.",
        variant: "destructive",
      });
      // Remove the empty assistant message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConversation = () => {
    if (!saveTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for this diagnostic",
        variant: "destructive",
      });
      return;
    }

    saveDiagnostic({
      title: saveTitle,
      conversation: messages,
      gunId: gunId || undefined,
      operatorName: armourer?.name || "The Armourer",
    });

    toast({
      title: "Diagnostic Saved",
      description: gunName 
        ? `This conversation has been saved to ${gunName}`
        : "This conversation has been saved to your diagnostics history",
    });

    setShowSaveDialog(false);
    setSaveTitle("");
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/arsenal')}
            className="flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
          <OperatorPortrait
            avatar={armourer.default_avatar || "🔧"}
            accentColor={armourer.accent_color}
            size="md"
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{armourer.name}</h1>
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: armourer.accent_color }}
              />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
          {messages.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          )}
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
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: `${armourer.accent_color}20`, color: armourer.accent_color }}
              >
                {armourer.default_avatar || "🔧"}
              </div>
              <div className="flex gap-1 items-center p-4">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
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
              disabled={isLoading}
              style={{ backgroundColor: armourer.accent_color }}
              className="hover:opacity-90 transition-smooth disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI-powered diagnostics • Always tactical, never wrong
          </p>
        </div>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Diagnostic Conversation</DialogTitle>
            <DialogDescription>
              Save this diagnostic conversation for future reference in your maintenance history.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Diagnostic Title</Label>
              <Input
                id="title"
                placeholder="e.g., AEG misfeed troubleshooting"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConversation}>Save Diagnostic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  );
};

export default Operator;
