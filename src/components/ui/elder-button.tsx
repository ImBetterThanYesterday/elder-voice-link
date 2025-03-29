
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ElderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "xl";
}

const ElderButton = forwardRef<HTMLButtonElement, ElderButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          
          // Size variants with larger text and padding for elderly users
          {
            "h-16 px-8 py-4 text-elder-lg": size === "default",
            "h-12 px-6 text-elder-base": size === "sm",
            "h-20 px-10 py-6 text-elder-xl": size === "lg",
            "h-24 px-12 py-8 text-elder-2xl": size === "xl",
          },
          
          // Color variants with high contrast for elderly users
          {
            "bg-elder-primary text-white hover:bg-elder-primary/90": variant === "default" || variant === "primary",
            "bg-elder-secondary text-white hover:bg-elder-secondary/90": variant === "secondary",
            "border-2 border-elder-primary bg-transparent text-elder-dark hover:bg-elder-gray": variant === "outline",
            "bg-transparent text-elder-dark hover:bg-elder-gray": variant === "ghost",
            "text-elder-primary underline-offset-4 hover:underline": variant === "link",
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

ElderButton.displayName = "ElderButton";

export { ElderButton };
