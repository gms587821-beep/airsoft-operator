import { cn } from "@/lib/utils";

interface OperatorDialogueProps {
  message: string;
  operatorName: string;
  operatorAvatar: string;
  accentColor: string;
  className?: string;
}

export const OperatorDialogue = ({
  message,
  operatorName,
  operatorAvatar,
  accentColor,
  className,
}: OperatorDialogueProps) => {
  return (
    <div className={cn("flex gap-3 items-start animate-fade-in", className)}>
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
      >
        {operatorAvatar}
      </div>
      <div 
        className="flex-1 p-4 rounded-lg border-l-4"
        style={{ 
          borderLeftColor: accentColor,
          backgroundColor: 'hsl(var(--card))',
          borderTop: '1px solid hsl(var(--border))',
          borderRight: '1px solid hsl(var(--border))',
          borderBottom: '1px solid hsl(var(--border))',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span 
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {operatorName}
          </span>
        </div>
        <p className="text-foreground leading-relaxed text-sm">{message}</p>
      </div>
    </div>
  );
};
