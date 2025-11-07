'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { VehicleMediaImage } from '@/types/vehicle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ImageCarouselProps {
  images: VehicleMediaImage[]
  initialIndex?: number
  className?: string
}

export default function ImageCarousel({
  images,
  initialIndex = 0,
  className
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: initialIndex,
    skipSnaps: false,
  })

  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  // Update scroll state
  const updateScrollState = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  // Initialize embla and setup listeners
  useEffect(() => {
    if (!emblaApi) return

    updateScrollState()
    emblaApi.on('select', updateScrollState)
    emblaApi.on('reInit', updateScrollState)

    return () => {
      emblaApi.off('select', updateScrollState)
      emblaApi.off('reInit', updateScrollState)
    }
  }, [emblaApi, updateScrollState])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [scrollPrev, scrollNext])

  // Handle empty state
  if (images.length === 0) {
    return (
      <div className={className}>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No images available</p>
        </div>
      </div>
    )
  }

  // Single image - no navigation needed
  const showNavigation = images.length > 1

  return (
    <div className={className}>
      {/* Main carousel */}
      <div className="relative">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="flex-[0_0_100%] min-w-0"
              >
                <div className="aspect-video bg-muted relative">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.altText || `Vehicle image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">Image not available</p>
                    </div>
                  )}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-4 py-2 text-sm">
                      {image.caption}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        {showNavigation && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg disabled:opacity-30"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg disabled:opacity-30"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {showNavigation && (
          <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {showNavigation && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => scrollTo(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all',
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-muted-foreground/30'
              )}
              aria-label={`Go to image ${index + 1}`}
            >
              {image.url ? (
                <img
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">N/A</span>
                </div>
              )}
              {image.isHero && (
                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                  Hero
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
