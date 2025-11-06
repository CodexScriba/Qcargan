'use client'

import React from 'react'

export interface ImageCarouselProps {
  images: string[]
  initialIndex?: number
  className?: string
}

export default function ImageCarousel({ images, initialIndex = 0, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

  return (
    <div className={className}>
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Vehicle image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {/* TODO: Implement full carousel with navigation and thumbnails */}
      </div>
    </div>
  )
}
