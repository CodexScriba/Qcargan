'use client'

import React from 'react'
import type { LucideIcon } from 'lucide-react'

export interface ShowcaseItem {
  id: string
  name: string
  eyebrow?: string
  description: string
  image: string
  alt: string
  badges?: string[]
  ctaLabel: string
  ctaHref: string
  metaLabel?: string
  icon?: LucideIcon
}

export interface ShowcaseCarouselProps {
  title: string | null
  descriptionFallback?: string
  items: ShowcaseItem[]
}

export function ShowcaseCarousel({ title, descriptionFallback, items }: ShowcaseCarouselProps) {
  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {descriptionFallback && <p className="text-sm text-muted-foreground">{descriptionFallback}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="aspect-video bg-muted rounded-md mb-2" />
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {/* TODO: Implement full showcase carousel UI */}
          </div>
        ))}
      </div>
    </div>
  )
}
