"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const favoriteButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--ring))] focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        default: "bg-white/90 text-[hsl(var(--primary))] border border-white/20 backdrop-blur-sm hover:bg-white hover:scale-[1.02] shadow-sm hover:shadow-md transition-all duration-200",
      },
      size: {
        default: "min-h-[44px] px-4 py-2 text-sm font-medium",
        compact: "h-8 px-2 py-1 text-xs font-medium",
        icon: "h-10 w-10 p-2",
      },
      state: {
        default: "",
        loading: "pointer-events-none",
        selected: "aria-pressed-true",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
)

export interface FavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof favoriteButtonVariants> {
  isActive?: boolean
  loading?: boolean
  onToggle?: () => void
}

const FavoriteButton = React.forwardRef<HTMLButtonElement, FavoriteButtonProps>(
  ({ className, variant, size, isActive = false, loading = false, onToggle, disabled, ...props }, ref) => {
    const state = loading ? "loading" : isActive ? "selected" : "default"
    
    const handleClick = () => {
      if (loading || disabled) return
      onToggle?.()
      // TODO: Connect to favorites API in Phase 3
      console.log("Favorite button toggled:", !isActive)
    }

    return (
      <button
        className={cn(favoriteButtonVariants({ variant, size, state, className }))}
        ref={ref}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isActive}
        {...props}
      >
        {size === "icon" ? (
          <Heart
            className={cn(
              "size-5 transition-colors",
              isActive
                ? "text-[hsl(var(--semantic-error))] fill-current"
                : "text-[hsl(var(--primary))] fill-none stroke-current"
            )}
            strokeWidth={1.5}
          />
        ) : (
          <>
            {loading ? (
              <>
                <span className="flex items-center gap-1" aria-hidden="true">
                  <span className="size-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="size-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="size-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                <span className={cn("font-medium", size === "compact" ? "text-xs" : "text-sm")}>Add to favorites</span>
              </>
            ) : (
              <>
                <span className={cn("font-medium", size === "compact" ? "text-xs" : "text-sm")}>Add to favorites</span>
              </>
            )}
            
            <Heart
              className={cn(
                "transition-colors",
                size === "compact" ? "size-3.5" : "size-4",
                isActive
                  ? "text-[hsl(var(--semantic-error))] fill-current"
                  : "text-[hsl(var(--primary))] fill-none stroke-current"
              )}
              strokeWidth={1.5}
            />
          </>
        )}
      </button>
    )
  }
)

FavoriteButton.displayName = "FavoriteButton"

export { FavoriteButton, favoriteButtonVariants }
