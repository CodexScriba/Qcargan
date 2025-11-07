import type { Metadata } from 'next'
import type { VehicleDetail } from '@/types/vehicle'

interface VehicleMetadataParams {
  vehicle: NonNullable<VehicleDetail>
  locale: 'es' | 'en'
  translations?: {
    titleTemplate?: string
    descriptionTemplate?: string
  }
}

/**
 * Generate complete metadata for vehicle detail page
 * Includes title, description, Open Graph, Twitter Card, and alternates
 */
export function buildVehicleMetadata({
  vehicle,
  locale,
  translations,
}: VehicleMetadataParams): Metadata {
  const { brand, model, year, variant, specifications, media } = vehicle

  // Build title
  const variantPart = variant ? ` ${variant}` : ''
  const title = translations?.titleTemplate
    ?.replace('{year}', String(year))
    .replace('{brand}', brand)
    .replace('{model}', model)
    .replace('{variant}', variantPart.trim())
    || `${year} ${brand} ${model}${variantPart} | Qcargan`

  // Build description
  let description: string
  if (locale === 'en' && vehicle.descriptionI18n?.en) {
    description = vehicle.descriptionI18n.en
  } else if (vehicle.description) {
    description = vehicle.description
  } else {
    const rangePart = specifications?.rangeKmCltc
      ? ` with up to ${specifications.rangeKmCltc}km range`
      : ''
    const batteryPart = specifications?.batteryKwh
      ? ` and ${specifications.batteryKwh}kWh battery`
      : ''
    description = translations?.descriptionTemplate
      ?.replace('{year}', String(year))
      .replace('{brand}', brand)
      .replace('{model}', model)
      .replace('{variant}', variantPart.trim())
      .replace('{range}', rangePart)
      .replace('{battery}', batteryPart)
      || `Explore the ${year} ${brand} ${model}${variantPart}${rangePart}${batteryPart}. Compare prices, specifications, and dealers in Costa Rica.`
  }

  // Get hero image or first image
  const heroImage = media.images[media.heroIndex] || media.images[0]
  const imageUrl = heroImage?.url || undefined

  // Build canonical and alternate URLs
  const basePathEs = `/vehiculos/${vehicle.slug}`
  const basePathEn = `/en/vehicles/${vehicle.slug}`
  
  const canonical = locale === 'es' ? basePathEs : basePathEn
  const alternateEs = basePathEs
  const alternateEn = basePathEn

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: alternateEs,
        en: alternateEn,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: heroImage.altText || `${year} ${brand} ${model}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

/**
 * Get canonical URL for a vehicle
 */
export function getVehicleCanonical(locale: 'es' | 'en', slug: string): string {
  return locale === 'es' ? `/vehiculos/${slug}` : `/en/vehicles/${slug}`
}

/**
 * Get alternate URLs for a vehicle
 */
export function getVehicleAlternates(slug: string): Record<string, string> {
  return {
    es: `/vehiculos/${slug}`,
    en: `/en/vehicles/${slug}`,
  }
}

/**
 * Generate structured data (JSON-LD) for vehicle
 */
export function buildVehicleStructuredData(vehicle: NonNullable<VehicleDetail>) {
  const { brand, model, year, variant, specifications, media, pricing } = vehicle

  const minPrice = pricing.length > 0
    ? Math.min(...pricing.map((p) => p.amount))
    : undefined

  const heroImage = media.images[media.heroIndex] || media.images[0]

  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${year} ${brand} ${model}${variant ? ` ${variant}` : ''}`,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    model: model,
    vehicleModelDate: year,
    fuelType: 'Electric',
    ...(minPrice && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: minPrice,
        offerCount: pricing.length,
      },
    }),
    ...(heroImage && {
      image: heroImage.url,
    }),
    ...(specifications?.rangeKmCltc && {
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: specifications.rangeKmCltc,
        unitCode: 'KMT',
      },
    }),
    ...(specifications?.batteryKwh && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'Battery Capacity',
        value: specifications.batteryKwh,
        unitCode: 'KWH',
      },
    }),
  }
}
