"use client"

import React, { useState } from 'react'
import { Heart, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CarActionButtonsProps {
  className?: string
}

export const CarActionButtons: React.FC<CarActionButtonsProps> = ({ className }) => {
  const [favoriteState, setFavoriteState] = useState<'default' | 'loading' | 'selected'>('default')
  const [compareState, setCompareState] = useState<'default' | 'loading' | 'selected'>('default')

  const handleFavoriteClick = () => {
    if (favoriteState === 'loading') return

    const currentState = favoriteState
    setFavoriteState('loading')
    setTimeout(() => {
      setFavoriteState(currentState === 'selected' ? 'default' : 'selected')
    }, 800)
  }

  const handleCompareClick = () => {
    if (compareState === 'loading') return

    const currentState = compareState
    setCompareState('loading')
    setTimeout(() => {
      setCompareState(currentState === 'selected' ? 'default' : 'selected')
    }, 800)
  }

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
      {/* Favorite Button */}
      <Button
        onClick={handleFavoriteClick}
        disabled={favoriteState === 'loading'}
        size="lg"
        variant="default"
        className={cn('w-full sm:w-auto rounded-[var(--radius)] font-semibold', className)}
        aria-pressed={favoriteState === 'selected'}
      >
        {favoriteState === 'loading' ? (
          <>
            <span className="flex items-center gap-1" aria-hidden="true">
              <span className="size-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="size-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="size-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span className="font-medium text-sm">Adding...</span>
          </>
        ) : (
          <>
            <span className="font-medium text-sm">
              {favoriteState === 'selected' ? 'Remove from favorites' : 'Add to favorites'}
            </span>
            <span className={favoriteState === 'selected' ? 'text-[hsl(var(--semantic-error))]' : undefined}>
              <Heart
                className={cn('transition-colors', 'size-4', favoriteState === 'selected' ? 'fill-current' : 'fill-none')}
                strokeWidth={1.5}
              />
            </span>
          </>
        )}
      </Button>

      {/* Compare Button */}
      <Button
        onClick={handleCompareClick}
        disabled={compareState === 'loading'}
        size="lg"
        variant={compareState === 'selected' ? 'default' : 'secondary'}
        className="w-full sm:w-auto rounded-[var(--radius)] font-semibold sm:mt-0 sm:ml-3"
        aria-pressed={compareState === 'selected'}
      >
        {compareState === 'loading' ? (
          <>
            <span className="flex items-center gap-1" aria-hidden="true">
              <span className="size-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="size-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="size-1.5 bg-[hsl(var(--primary))] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span className="font-medium text-sm">Adding...</span>
          </>
        ) : (
          <>
            <span className="font-medium text-sm">
              {compareState === 'selected' ? 'Remove from compare' : 'Add to compare'}
            </span>
            <Scale
              className={cn('transition-colors', 'size-4', compareState === 'selected' ? 'fill-current' : 'fill-none')}
              strokeWidth={1.5}
            />
          </>
        )}
      </Button>
    </div>
  )
}

export { CarActionButtons }
export default CarActionButtons
