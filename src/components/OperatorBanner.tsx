import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Operator } from "@/hooks/useOperators";

interface OperatorBannerProps {
  operator: Operator;
  message: string;
  actionLabel?: string;
  actionPath?: string;
}

export const OperatorBanner = ({ operator, message, actionLabel, actionPath }: OperatorBannerProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="p-4 mb-6 border-l-4 cursor-pointer hover:shadow-lg transition-all"
      style={{ borderLeftColor: operator.accent_color }}
      onClick={() => navigate("/operator/hub")}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${operator.accent_color}20` }}
        >
          {operator.default_avatar || "🎯"}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm" style={{ color: operator.accent_color }}>
              {operator.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {operator.role}
            </span>
          </div>
          
          <p className="text-sm text-foreground leading-relaxed">
            {message}
          </p>
          
          {actionLabel && actionPath && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 p-0 h-auto text-xs"
              style={{ color: operator.accent_color }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(actionPath);
              }}
            >
              {actionLabel}
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
