// @ts-nocheck
import * as React from "react"
import { cn } from "./utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "destructive" | "ghost"
  size?: "default" | "sm" | "lg"
  state?: "default" | "error" | "success" | "disabled"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", size = "default", state = "default", disabled, ...props }, ref) => {
    const currentState = disabled ? "disabled" : state

    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-lg border transition-colors duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",

          size === "sm" && "h-9 px-3 text-sm",
          size === "default" && "h-10 px-3 text-sm",
          size === "lg" && "h-11 px-4 text-base",

          currentState === "default" && variant === "default" &&
            "bg-input-background border-border/60 hover:border-border/80 focus:border-primary/50 focus:ring-2 focus:ring-primary/8 [&:not(:placeholder-shown)]:bg-white [&:not(:placeholder-shown)]:border-gray-400 [&:not(:placeholder-shown)]:shadow-[inset_0_0_0_1px_rgba(156,163,175,0.45)] dark:[&:not(:placeholder-shown)]:bg-gray-900 dark:[&:not(:placeholder-shown)]:border-gray-500 dark:[&:not(:placeholder-shown)]:shadow-[inset_0_0_0_1px_rgba(107,114,128,0.5)]",
          currentState === "error" &&
            "bg-input-background border-destructive/60 hover:border-destructive/80 focus:border-destructive focus:ring-2 focus:ring-destructive/10",
          currentState === "success" &&
            "bg-input-background border-green-500/60 hover:border-green-500/80 focus:border-green-500 focus:ring-2 focus:ring-green-500/10",
          currentState === "disabled" &&
            "bg-muted border-border/40 text-muted-foreground",
          variant === "ghost" && currentState !== "disabled" &&
            "bg-transparent border-transparent hover:bg-accent focus:border-border/60 focus:ring-2 focus:ring-ring/10",
          variant === "destructive" &&
            "bg-destructive/10 border-destructive/60 text-destructive-foreground focus:ring-2 focus:ring-destructive/10",

          className
        )}
        ref={ref}
        disabled={disabled || currentState === "disabled"}
        data-state={currentState}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
