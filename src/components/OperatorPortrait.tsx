import { cn } from "@/lib/utils";

interface OperatorPortraitProps {
  avatar: string;
  accentColor: string;
  variant?: "circular" | "square" | "banner";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const OperatorPortrait = ({
  avatar,
  accentColor,
  variant = "circular",
  size = "md",
  className,
}: OperatorPortraitProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-2xl",
    lg: "w-20 h-20 text-4xl",
  };

  const variantClasses = {
    circular: "rounded-full",
    square: "rounded-lg",
    banner: "rounded-xl",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center border-2 transition-all duration-300",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={{
        backgroundColor: `${accentColor}20`,
        borderColor: accentColor,
        color: accentColor,
      }}
    >
      {avatar}
    </div>
  );
};
