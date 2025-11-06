"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { FavoriteButton, type FavoriteButtonProps } from "./favorite-button"
import { CompareButton, type CompareButtonProps } from "./compare-button"

export interface AgencyActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  favoriteProps?: FavoriteButtonProps
  compareProps?: CompareButtonProps
  showFavorite?: boolean
  showCompare?: boolean
}

const AgencyActions = React.forwardRef<HTMLDivElement, AgencyActionsProps>(
  ({ className, favoriteProps, compareProps, showFavorite = true, showCompare = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-end gap-2", className)}
        role="group"
        aria-label="Agency actions"
        {...props}
      >
        {showFavorite && (
          <FavoriteButton
            {...favoriteProps}
            size="icon"
            className={cn("shadow-lg", favoriteProps?.className)}
          />
        )}
        {showCompare && (
          <CompareButton
            {...compareProps}
            size="icon"
            className={cn("shadow-lg", compareProps?.className)}
          />
        )}
      </div>
    )
  }
)

AgencyActions.displayName = "AgencyActions"

export { AgencyActions }
