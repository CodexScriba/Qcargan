# Task 2: i18n & SEO Strategy Implementation

**Status**: Pending
**Dependencies**: Task 1 (Database Schema)
**Estimated Effort**: 2-3 hours

---

## Objective

Configure next-intl for Next.js 15 compatibility, set up translation keys, implement SEO metadata, and create slug generation utilities.

---

## Scope

### 1. Next.js 15 Compatibility Update
- Update `i18n/request.ts` for Next.js 15
- Verify middleware configuration (no changes needed)

### 2. Translation Keys Setup
- Add vehicle-related translations to `messages/es.json`
- Add vehicle-related translations to `messages/en.json`

### 3. SEO Utilities
- Create slug generation utility
- Document SEO metadata implementation pattern

---

## Implementation Steps

### 1. Update i18n/request.ts for Next.js 15

**File**: `i18n/request.ts`

```typescript
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({
  requestLocale  // ← Changed from 'locale' in Next.js 15
}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;  // ← MUST await

  // Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,  // ← MUST return locale in Next.js 15
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

**Key Changes**:
- `locale` parameter → `requestLocale` (must be awaited)
- Must return `locale` in config object
- Fallback to `defaultLocale` if undefined or invalid

### 2. Verify Middleware (No Changes Needed)

**File**: `middleware.ts` (UNCHANGED - fully compatible with Next.js 15)

```typescript
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*|.*opengraph-image.*).*)'
};
```

### 3. Add Translation Keys

**File**: `messages/es.json`

Add the following keys:

```json
{
  "vehicle": {
    "title": "Vehículos Eléctricos",
    "specs": {
      "range": "Autonomía",
      "battery": "Batería",
      "acceleration": "0-100 km/h",
      "seats": "Asientos",
      "charging": "Carga Rápida",
      "power": "Potencia",
      "topSpeed": "Velocidad Máxima",
      "weight": "Peso",
      "dimensions": "Dimensiones"
    },
    "bodyType": {
      "SEDAN": "Sedán",
      "CITY": "Ciudad",
      "SUV": "SUV",
      "PICKUP_VAN": "Pickup / Van"
    },
    "pricing": {
      "from": "Desde",
      "sellers": "{count, plural, =0 {0 vendedores} one {1 vendedor} other {# vendedores}}",
      "contact": "Contactar",
      "viewDetails": "Ver detalles",
      "getQuote": "Cotizar",
      "checkAvailability": "Consultar disponibilidad"
    },
    "filters": {
      "all": "Todos",
      "priceRange": "Rango de precio",
      "rangeMin": "Autonomía mínima",
      "seatsMin": "Asientos mínimos",
      "bodyType": "Tipo de carrocería",
      "brand": "Marca",
      "sortBy": "Ordenar por",
      "sortPrice": "Precio",
      "sortRange": "Autonomía",
      "sortNewest": "Más recientes"
    },
    "availability": {
      "inStock": "En stock",
      "preOrder": "Pre-orden",
      "availableSoon": "Disponible pronto",
      "contactForAvailability": "Consultar disponibilidad"
    },
    "financing": {
      "title": "Financiamiento",
      "downPayment": "Prima",
      "monthlyPayment": "Cuota mensual",
      "term": "{months} meses",
      "aprRate": "Tasa APR"
    },
    "reviews": {
      "title": "Opiniones de usuarios",
      "positive": "Positivas",
      "neutral": "Neutrales",
      "negative": "Negativas",
      "noReviews": "Aún no hay opiniones"
    }
  },
  "agencyCard": {
    "contact": "Contactar",
    "details": "Ver detalles",
    "officialAgency": "Agencia oficial",
    "warranty": "Garantía",
    "battery": "Batería",
    "freeService": "Servicio gratis",
    "delivery": "Entrega 0 km"
  },
  "seo": {
    "vehicleDetail": {
      "titleTemplate": "{year} {brand} {model} {variant} | QuéCargan",
      "descriptionTemplate": "Explora el {brand} {model} eléctrico {year} en Costa Rica. Especificaciones, precios y disponibilidad de vendedores oficiales."
    },
    "vehicleList": {
      "title": "Vehículos Eléctricos en Costa Rica | QuéCargan",
      "description": "Compara y encuentra el mejor vehículo eléctrico en Costa Rica. Precios, especificaciones, autonomía y vendedores oficiales."
    }
  }
}
```

**File**: `messages/en.json`

Add the following keys:

```json
{
  "vehicle": {
    "title": "Electric Vehicles",
    "specs": {
      "range": "Range",
      "battery": "Battery",
      "acceleration": "0-100 km/h",
      "seats": "Seats",
      "charging": "Fast Charging",
      "power": "Power",
      "topSpeed": "Top Speed",
      "weight": "Weight",
      "dimensions": "Dimensions"
    },
    "bodyType": {
      "SEDAN": "Sedan",
      "CITY": "City Car",
      "SUV": "SUV",
      "PICKUP_VAN": "Pickup / Van"
    },
    "pricing": {
      "from": "From",
      "sellers": "{count, plural, =0 {0 sellers} one {1 seller} other {# sellers}}",
      "contact": "Contact",
      "viewDetails": "View details",
      "getQuote": "Get quote",
      "checkAvailability": "Check availability"
    },
    "filters": {
      "all": "All",
      "priceRange": "Price range",
      "rangeMin": "Minimum range",
      "seatsMin": "Minimum seats",
      "bodyType": "Body type",
      "brand": "Brand",
      "sortBy": "Sort by",
      "sortPrice": "Price",
      "sortRange": "Range",
      "sortNewest": "Newest"
    },
    "availability": {
      "inStock": "In Stock",
      "preOrder": "Pre-Order",
      "availableSoon": "Available Soon",
      "contactForAvailability": "Contact for availability"
    },
    "financing": {
      "title": "Financing",
      "downPayment": "Down payment",
      "monthlyPayment": "Monthly payment",
      "term": "{months} months",
      "aprRate": "APR rate"
    },
    "reviews": {
      "title": "User reviews",
      "positive": "Positive",
      "neutral": "Neutral",
      "negative": "Negative",
      "noReviews": "No reviews yet"
    }
  },
  "agencyCard": {
    "contact": "Contact",
    "details": "View details",
    "officialAgency": "Official agency",
    "warranty": "Warranty",
    "battery": "Battery",
    "freeService": "Free service",
    "delivery": "0 km delivery"
  },
  "seo": {
    "vehicleDetail": {
      "titleTemplate": "{year} {brand} {model} {variant} | QuéCargan",
      "descriptionTemplate": "Explore the {year} electric {brand} {model} in Costa Rica. Specifications, pricing, and availability from official dealers."
    },
    "vehicleList": {
      "title": "Electric Vehicles in Costa Rica | QuéCargan",
      "description": "Compare and find the best electric vehicle in Costa Rica. Prices, specifications, range, and official dealers."
    }
  }
}
```

### 4. Create Slug Generation Utility

**File**: `lib/utils/identifiers.ts`

```typescript
/**
 * Generates a URL-friendly slug for a vehicle
 * Format: brand-model-variant-year (all lowercase, hyphenated)
 *
 * @example
 * generateVehicleSlug("BYD", "Seagull", 2024, "Freedom")
 * // Returns: "byd-seagull-freedom-2024"
 *
 * generateVehicleSlug("Tesla", "Model 3", 2024, "Long Range")
 * // Returns: "tesla-model-3-long-range-2024"
 *
 * generateVehicleSlug("Nissan", "Leaf", 2023, null)
 * // Returns: "nissan-leaf-2023"
 */
export function generateVehicleSlug(
  brand: string,
  model: string,
  year: number,
  variant?: string | null
): string {
  const parts = [
    brand,
    model,
    variant || '',
    year.toString()
  ].filter(Boolean);

  return parts
    .join('-')
    .toLowerCase()
    .normalize('NFD')                    // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '')     // Remove diacritics (é → e, ñ → n)
    .replace(/[™®©]/g, '')               // Remove trademark symbols
    .replace(/[^\w\s-]/g, '')            // Remove special characters
    .replace(/\s+/g, '-')                // Spaces to hyphens
    .replace(/-+/g, '-')                 // Collapse multiple hyphens
    .replace(/^-|-$/g, '');              // Trim leading/trailing hyphens
}

/**
 * Validates if a slug matches the expected format
 * Format: lowercase letters, numbers, and hyphens only
 */
export function isValidVehicleSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/**
 * Example slugs for testing:
 */
export const EXAMPLE_SLUGS = {
  withVariant: 'byd-seagull-freedom-2025',
  withoutVariant: 'nissan-leaf-2023',
  multiWordVariant: 'tesla-model-3-long-range-2024',
  multiWordModel: 'ford-f-150-lightning-2024',
} as const;
```

### 5. URL Structure Documentation

**URL Pattern** (next-intl configured with NO PREFIX for default Spanish):

```
Spanish (default, no locale prefix):
  /vehiculos                             → Listings page
  /vehiculos/byd-seagull-freedom-2025    → Vehicle detail

English (with /en/ prefix):
  /en/vehicles                           → Listings page
  /en/vehicles/byd-seagull-freedom-2025  → Vehicle detail (same slug!)
```

**Rationale**:
- ✅ SEO-optimized: Default Spanish URLs are cleaner (`/vehiculos` vs `/es/vehiculos`)
- ✅ User-friendly: Costa Rican users see short URLs without language prefix
- ✅ Language-neutral slugs: Same vehicle slug works across locales
- ✅ No duplicate content: Different paths per locale
- ✅ Easy expansion: Add new languages with prefix (e.g., `/pt/veiculos/`)

---

## SEO Metadata Pattern

### Example generateMetadata Implementation

**File**: `app/[locale]/vehicles/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getVehicleBySlug } from '@/lib/db/queries/vehicles';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params; // ← MUST await in Next.js 15

  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: 'Vehicle Not Found' };

  const t = await getTranslations({ locale, namespace: 'seo.vehicleDetail' });

  // Build title
  const title = t('titleTemplate', {
    year: vehicle.year,
    brand: vehicle.brand,
    model: vehicle.model,
    variant: vehicle.variant || ''
  }).trim();

  // Build description (Spanish-first, fallback for English)
  const description = locale === 'es'
    ? vehicle.description || t('descriptionTemplate', {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year
      })
    : vehicle.descriptionI18n?.en || t('descriptionTemplate', {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year
      });

  // Canonical path
  const canonicalPath = locale === 'es'
    ? `/vehiculos/${slug}`
    : `/en/vehicles/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'es': `/vehiculos/${slug}`,
        'en': `/en/vehicles/${slug}`,
      }
    },
    openGraph: {
      title,
      description,
      type: 'product',
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      images: vehicle.media.images[0]?.url ? [{ url: vehicle.media.images[0].url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: vehicle.media.images[0]?.url ? [vehicle.media.images[0].url] : [],
    }
  };
}
```

---

## Testing Checklist

- [ ] Update `i18n/request.ts` with Next.js 15 pattern
- [ ] Add Spanish translation keys to `messages/es.json`
- [ ] Add English translation keys to `messages/en.json`
- [ ] Create slug utility function in `lib/utils/identifiers.ts`
- [ ] Test slug generation with various inputs (special chars, multi-word, null variant)
- [ ] Verify slug validation function works correctly
- [ ] Document SEO metadata pattern for pages
- [ ] Test translation keys in components with `useTranslations('vehicle')`

---

## Success Criteria

✅ i18n/request.ts updated for Next.js 15
✅ All vehicle translation keys added to both locales
✅ Slug generation utility working correctly
✅ SEO metadata pattern documented
✅ URL structure follows next-intl convention (no prefix for Spanish)

---

## Next Steps

After completing this task, proceed to:
- **Task 3**: Data Fetching Architecture
- **Task 4**: Vehicle Detail Page Implementation
