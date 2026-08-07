import * as React from "react"
import { cn } from "../../lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:     "bg-primary text-white hover:bg-primary/90 shadow-sm",
  ghost:       "text-foreground hover:bg-secondary hover:text-foreground",
  outline:     "border border-border bg-transparent hover:bg-secondary",
  secondary:   "bg-secondary text-foreground hover:bg-secondary/80",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  link:        "text-primary underline-offset-4 hover:underline p-0 h-auto",
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-9 px-4 py-2 text-sm",
  sm:      "h-8 px-3 py-1 text-sm",
  lg:      "h-11 px-6 py-2 text-base",
  icon:    "h-9 w-9 p-0",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
