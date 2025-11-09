"use client"

import React, { useState } from 'react'
import { Heart, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeroActionButtonsProps {
  className?: string
}

const animateDots = [0, 150, 300]

export default function HeroActionButtons({ className }: HeroActionButtonsProps) {
  const [favoriteState, setFavoriteState] = useState<'default' | 'loading' | 'selected'>('default')
  const [compareState, setCompareState] = useState<'default' | 'loading' | 'selected'>('default')

  const toggleState = (
    current: 'default' | 'selected',
    setState: React.Dispatch<React.SetStateAction<'default' | 'loading' | 'selected'>>
  ) => {
    setState('loading')
    setTimeout(() => {
      setState(current === 'selected' ? 'default' : 'selected')
    }, 800)
  }

  const handleFavoriteClick = () => {
    if (favoriteState === 'loading') return
    toggleState(favoriteState === 'selected' ? 'selected' : 'default', setFavoriteState)
  }

  const handleCompareClick = () => {
    if (compareState === 'loading') return
    toggleState(compareState === 'selected' ? 'selected' : 'default', setCompareState)
  }

  return (
    <div className={cn('w-full flex flex-col sm:flex-row items-center justify-center gap-3', className)}>
      <Button
        onClick={handleFavoriteClick}
        disabled={favoriteState === 'loading'}
        size="lg"
        variant="default"
        className="w-full sm:w-auto rounded-[var(--radius)] font-semibold uppercase tracking-wide text-sm gap-2"
        aria-pressed={favoriteState === 'selected'}
      >
        {favoriteState === 'loading' ? (
          <span className="flex items-center gap-2">
            {animateDots.map((delay) => (
              <span
                key={delay}
                className="size-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
            <span>Adding...</span>
          </span>
        ) : (
          <>
            <span>{favoriteState === 'selected' ? 'Remove from favorites' : 'Add to favorites'}</span>
            <Heart
              className={cn('transition-colors size-5', favoriteState === 'selected' ? 'fill-current text-[hsl(var(--semantic-error))]' : 'text-[hsl(var(--primary-foreground))]')}
              strokeWidth={1.5}
            />
          </>
        )}
      </Button>

      <Button
        onClick={handleCompareClick}
        disabled={compareState === 'loading'}
        size="lg"
        variant={compareState === 'selected' ? 'default' : 'secondary'}
        className="w-full sm:w-auto rounded-[var(--radius)] font-semibold uppercase tracking-wide text-sm gap-2"
        aria-pressed={compareState === 'selected'}
      >
        {compareState === 'loading' ? (
          <span className="flex items-center gap-2">
            {animateDots.map((delay) => (
              <span
                key={delay}
                className="size-1.5 rounded-full bg-[hsl(var(--primary))] animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
            <span>Adding...</span>
          </span>
        ) : (
          <>
            <span>{compareState === 'selected' ? 'Remove from compare' : 'Add to compare'}</span>
            <Scale
              className={cn('transition-colors size-5', compareState === 'selected' ? 'fill-current text-[hsl(var(--semantic-error))]' : 'text-[hsl(var(--foreground))]')}
              strokeWidth={1.5}
            />
          </>
        )}
      </Button>
    </div>
  )
}
