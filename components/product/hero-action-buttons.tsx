"use client"

import React, { useState } from 'react'
import { Heart, Scale } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeroActionButtonsProps {
  className?: string
}

const animateDots = [0, 150, 300]

const pillBaseClasses =
  'h-12 w-full sm:w-auto rounded-full border transition-all duration-300 uppercase tracking-wide text-xs sm:text-sm font-semibold gap-2 shadow-[0_6px_25px_rgba(15,23,42,0.15)]'

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
    }, 600)
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
        size="lg"
        onClick={handleFavoriteClick}
        disabled={favoriteState === 'loading'}
        aria-pressed={favoriteState === 'selected'}
        className={cn(
          pillBaseClasses,
          'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-transparent hover:scale-[1.01] hover:shadow-[0_12px_35px_rgba(14,217,179,0.45)]',
          favoriteState === 'selected' &&
            'shadow-[0_12px_35px_rgba(14,217,179,0.6)] ring-2 ring-offset-2 ring-[hsl(var(--primary))] ring-offset-[hsl(var(--background))]'
        )}
      >
        {favoriteState === 'loading' ? (
          <span className="flex items-center gap-2">
            {animateDots.map((delay) => (
              <span
                key={delay}
                className="size-1.5 rounded-full bg-white/90 animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
            <span className="tracking-tight">Adding…</span>
          </span>
        ) : (
          <>
            <span>{favoriteState === 'selected' ? 'Remove from favorites' : 'Add to favorites'}</span>
            <Heart
              className={cn(
                'size-5 transition-all',
                favoriteState === 'selected'
                  ? 'fill-current'
                  : 'text-[hsl(var(--primary-foreground))]'
              )}
              strokeWidth={1.5}
            />
          </>
        )}
      </Button>

      <Button
        size="lg"
        variant="secondary"
        onClick={handleCompareClick}
        disabled={compareState === 'loading'}
        aria-pressed={compareState === 'selected'}
        className={cn(
          pillBaseClasses,
          'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-white/20 hover:border-white/40 hover:bg-white/70',
          compareState === 'selected' &&
            'bg-white text-[hsl(var(--primary))] border-white shadow-[0_12px_30px_rgba(148,163,184,0.45)]'
        )}
      >
        {compareState === 'loading' ? (
          <span className="flex items-center gap-2">
            {animateDots.map((delay) => (
              <span
                key={delay}
                className="size-1.5 rounded-full bg-[hsl(var(--foreground))]/80 animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
            <span className="tracking-tight">Adding…</span>
          </span>
        ) : (
          <>
            <span>{compareState === 'selected' ? 'Remove from compare' : 'Add to compare'}</span>
            <Scale
              className={cn(
                'size-5 transition-colors',
                compareState === 'selected'
                  ? 'text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--foreground))]'
              )}
              strokeWidth={1.5}
            />
          </>
        )}
      </Button>
    </div>
  )
}
