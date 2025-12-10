"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

export type SentimentColor = 'red' | 'yellow' | 'green'

type Props = {
  activeColor: SentimentColor
  onChange: (color: SentimentColor) => void
  className?: string
}

const COLORS: SentimentColor[] = ['red', 'yellow', 'green']

export function TrafficLight({ activeColor, onChange, className }: Props) {
  return (
    <div
      data-testid="traffic-shell"
      className={cn(
        'mx-auto w-[160px] rounded-[22px] p-[16px]',
        'border bg-gradient-to-b',
        'border-border/10 from-secondary to-secondary/80',
        'shadow-lg',
        'dark:border-border/20 dark:from-secondary dark:to-secondary/90',
        className
      )}
      role="group"
      aria-label="Traffic light sentiment selector"
    >
      <div className="flex flex-col items-center gap-[18px]">
        {COLORS.map((c) => (
          <Lamp
            key={c}
            color={c}
            active={activeColor === c}
            onClick={() => onChange(c)}
            ariaLabel={`Show ${c} reviews`}
          />
        ))}
      </div>
    </div>
  )
}

function Lamp({
  color,
  active,
  onClick,
  ariaLabel,
}: {
  color: SentimentColor
  active: boolean
  onClick: () => void
  ariaLabel: string
}) {
  const base = cn(
    'relative grid place-items-center rounded-full size-[96px] select-none outline-none',
    'border border-[rgba(255,255,255,0.18)] font-bold text-[22px] overflow-hidden',
    'shadow-[inset_0_-8px_15px_rgba(0,0,0,0.3),_inset_0_8px_14px_rgba(255,255,255,0.28),_0_12px_24px_rgba(0,0,0,0.12)]',
    'transition-[transform,filter,box-shadow] duration-200 ease-out',
    "after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:[background:radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.65),rgba(255,255,255,0)_42%)] after:mix-blend-screen",
    'hover:-translate-y-[2px] hover:scale-[1.02] hover:saturate-[1.05]',
    'focus-visible:ring-[3px] focus-visible:ring-[rgba(13,148,136,0.4)]'
  )

  const palette = {
    red: cn(
      'text-white',
      'bg-[linear-gradient(180deg,#ff5a6b_0%,_#e11d48_100%)]',
      active &&
        'shadow-[0_0_25px_8px_rgba(239,68,68,0.35),_inset_0_8px_14px_rgba(255,255,255,0.28),_inset_0_-8px_15px_rgba(0,0,0,0.3)]'
    ),
    yellow: cn(
      'text-[#1f2937]',
      'bg-[linear-gradient(180deg,#ffd36b_0%,_#f59e0b_100%)]',
      active &&
        'shadow-[0_0_25px_8px_rgba(245,158,11,0.35),_inset_0_8px_14px_rgba(255,255,255,0.28),_inset_0_-8px_15px_rgba(0,0,0,0.3)]'
    ),
    green: cn(
      'text-[#052e22]',
      'bg-[linear-gradient(180deg,#67f7b7_0%,_#10b981_100%)]',
      active &&
        'shadow-[0_0_25px_8px_rgba(16,185,129,0.35),_inset_0_8px_14px_rgba(255,255,255,0.28),_inset_0_-8px_15px_rgba(0,0,0,0.3)]'
    ),
  } as const

  return (
    <button
      type="button"
      className={cn(base, palette[color])}
      aria-pressed={active}
      aria-label={ariaLabel}
      onClick={onClick}
      data-testid={`lamp-${color}`}
    >
      <span className="count">{color === 'red' ? '3' : color === 'yellow' ? '7' : '10'}</span>
    </button>
  )
}

export default TrafficLight
