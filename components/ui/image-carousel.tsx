'use client'

import React from 'react'

export interface ImageCarouselProps {
  images: Array<{ url: string; alt?: string | null }>
  initialIndex?: number
  className?: string
}

export default function ImageCarousel({ images, initialIndex = 0, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

  const boundedIndex = React.useMemo(() => {
    if (images.length === 0) return 0
    return Math.max(0, Math.min(currentIndex, images.length - 1))
  }, [currentIndex, images.length])

  React.useEffect(() => {
    setCurrentIndex((index) => Math.min(index, Math.max(images.length - 1, 0)))
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className={className}>
        <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed bg-muted/40 text-sm text-muted-foreground">
          Sin imágenes disponibles
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[boundedIndex]?.url ?? ''}
          alt={images[boundedIndex]?.alt ?? `Imagen ${boundedIndex + 1}`}
          className="h-full w-full object-cover"
          loading={boundedIndex === 0 ? 'eager' : 'lazy'}
        />

        {images.length > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => (index === 0 ? images.length - 1 : index - 1))}
              className="rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
            >
              ←
            </button>
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {boundedIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1))}
              className="rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
            >
              →
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image.url ?? index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={[
                'h-12 w-16 overflow-hidden rounded-md border',
                index === boundedIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt ?? `Miniatura ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
