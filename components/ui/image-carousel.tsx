'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { X } from 'lucide-react'
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
  const [modalImage, setModalImage] = useState<VehicleMediaImage | null>(null)
  const openModal = useCallback((image: VehicleMediaImage) => {
    if (!image.url) return
    setModalImage(image)
  }, [])
  const closeModal = useCallback(() => setModalImage(null), [])

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

  // Keyboard navigation - only when not in form fields and carousel has multiple images
  useEffect(() => {
    // Don't attach listener if only 0 or 1 image
    if (images.length <= 1) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, select, or contenteditable
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }

      // Only handle arrow keys
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
  }, [scrollPrev, scrollNext, images.length])

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
                    <button
                      type="button"
                      onClick={() => openModal(image)}
                      aria-label={`View ${image.altText || `image ${index + 1}`} in a larger view`}
                      className="w-full h-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `Vehicle image ${index + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      <span className="sr-only">Click to open enlarged view</span>
                    </button>
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
            </button>
          ))}
        </div>
      )}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
          aria-modal="true"
          role="dialog"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-[90vw] max-h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 rounded-full bg-[hsl(var(--primary))] p-2.5 text-[hsl(var(--primary-foreground))] shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--primary))]"
              aria-label="Close full image view"
            >
              <X className="size-6" />
            </button>
            <img
              src={modalImage.url}
              alt={modalImage.altText || 'Enlarged vehicle image'}
              className="w-full h-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
