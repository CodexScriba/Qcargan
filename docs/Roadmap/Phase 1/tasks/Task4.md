# Task 4: Vehicle Detail Page Implementation

**Status**: Pending
**Dependencies**: Task 1 (Database Schema), Task 2 (i18n), Task 3 (Data Fetching)
**Estimated Effort**: 4-5 hours

   Complete the vehicle detail page with all components properly integrated, loading states, animations, and polish.

## Key components to integrate/refine:
   •  ImageCarousel (proper implementation needed)
   •  KeySpecification (fix prop contract or create simplified version)
   •  CarActionButtons (add vehicle-specific share/favorite functionality)
   •  FinancingTabs (connect to banks query)
   •  Loading states and skeletons
   •  Animations and transitions
---

## Objective

Create the vehicle detail page (`/vehicles/[slug]`) that displays comprehensive vehicle information, pricing from multiple sellers, specifications, and financing options.

---

## Scope

### Components to Integrate:
- ProductTitle
- ImageCarousel
- KeySpecification cards
- AgencyCard / SellerCard
- FinancingTabs
- TrafficLightReviews (placeholder for Phase 4)
- CarActionButtons
- ServicesShowcase

### Page Features:
- Display vehicle basic info and hero images
- Show detailed specifications
- List pricing from all sellers/agencies
- Display financing options
- SEO-optimized metadata
- Responsive design

---

## Implementation Steps

### 1. Create Page File

**File**: `app/[locale]/vehicles/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getVehicleBySlug } from '@/lib/db/queries/vehicles';
import { getBanks } from '@/lib/db/queries/banks';
import ProductTitle from '@/components/product/product-title';
import ImageCarousel from '@/components/ui/image-carousel';
import KeySpecification from '@/components/product/key-specification';
import AgencyCard from '@/components/product/agency-card';
import SellerCard from '@/components/product/seller-card';
import FinancingTabs from '@/components/product/financing-tabs';
import TrafficLightReviews from '@/components/product/traffic-light-reviews';
import CarActionButtons from '@/components/product/car-action-buttons';
import ServicesShowcase from '@/components/product/services-showcase';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;

  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: 'Vehicle Not Found' };

  const t = await getTranslations({ locale, namespace: 'seo.vehicleDetail' });

  const title = t('titleTemplate', {
    year: vehicle.year,
    brand: vehicle.brand,
    model: vehicle.model,
    variant: vehicle.variant || ''
  }).trim();

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
      images: vehicle.media.images[0]?.url ? [{
        url: vehicle.media.images[0].url,
        alt: vehicle.media.images[0].alt
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: vehicle.media.images[0]?.url ? [vehicle.media.images[0].url] : [],
    }
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const banks = await getBanks();
  const t = await getTranslations({ locale, namespace: 'vehicle' });

  // Build specifications for display
  const specs = vehicle.specifications;

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1600px] space-y-6">
      {/* Hero Section */}
      <div className="card-container rounded-3xl overflow-hidden">
        <div className="space-y-6">
          <ProductTitle
            brand={vehicle.brand}
            model={vehicle.model}
            variant={vehicle.variant}
            year={vehicle.year}
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <ImageCarousel
                images={vehicle.media.images}
                initialIndex={vehicle.media.heroIndex}
                className="w-full"
              />
            </div>

            {/* Action Buttons & Quick Specs */}
            <div className="space-y-4">
              <CarActionButtons vehicleId={vehicle.id} />

              {/* Quick Specs */}
              <div className="space-y-3">
                {specs?.rangeKmCltc && (
                  <KeySpecification
                    icon="battery"
                    label={t('specs.range')}
                    value={`${specs.rangeKmCltc} km`}
                    emphasis="primary"
                  />
                )}
                {specs?.batteryKwh && (
                  <KeySpecification
                    icon="battery"
                    label={t('specs.battery')}
                    value={`${specs.batteryKwh} kWh`}
                  />
                )}
                {specs?.acceleration0To100Sec && (
                  <KeySpecification
                    icon="speed"
                    label={t('specs.acceleration')}
                    value={`${specs.acceleration0To100Sec}s`}
                  />
                )}
                {specs?.powerHp && (
                  <KeySpecification
                    icon="power"
                    label={t('specs.power')}
                    value={`${specs.powerHp} hp`}
                  />
                )}
                {specs?.seats && (
                  <KeySpecification
                    icon="seats"
                    label={t('specs.seats')}
                    value={`${specs.seats}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">{t('pricing.viewDetails')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicle.pricing.map((pricing) => {
            const org = pricing.organization;
            if (!org) return null;

            // Render AgencyCard or SellerCard based on type
            if (org.type === 'AGENCY') {
              return (
                <AgencyCard
                  key={pricing.id}
                  agency={{
                    id: org.id,
                    name: org.name,
                    logo: org.logoUrl || undefined,
                    official: org.official,
                    badges: org.badges,
                  }}
                  price={{
                    amount: Number(pricing.amount),
                    currency: pricing.currency,
                  }}
                  availability={pricing.availability as any}
                  financing={pricing.financing as any}
                  cta={pricing.cta as any}
                  perks={pricing.perks}
                  emphasis={pricing.emphasis as any}
                />
              );
            } else {
              return (
                <SellerCard
                  key={pricing.id}
                  seller={{
                    id: org.id,
                    name: org.name,
                    logo: org.logoUrl || undefined,
                    type: org.type,
                  }}
                  price={{
                    amount: Number(pricing.amount),
                    currency: pricing.currency,
                  }}
                  availability={pricing.availability as any}
                  cta={pricing.cta as any}
                />
              );
            }
          })}
        </div>
      </section>

      {/* Financing Options */}
      {banks.length > 0 && (
        <section className="card-container rounded-3xl space-y-4">
          <h2 className="text-2xl font-bold">{t('financing.title')}</h2>
          <FinancingTabs
            banks={banks.map((bank) => ({
              id: bank.id,
              name: bank.name,
              logo: bank.logoUrl || undefined,
              aprMin: bank.typicalAprMin ? Number(bank.typicalAprMin) : undefined,
              aprMax: bank.typicalAprMax ? Number(bank.typicalAprMax) : undefined,
              terms: bank.typicalTermMonths || [],
            }))}
          />
        </section>
      )}

      {/* Reviews (Placeholder for Phase 4) */}
      <section className="card-container rounded-3xl space-y-4">
        <h2 className="text-2xl font-bold">{t('reviews.title')}</h2>
        <TrafficLightReviews
          positive={0}
          neutral={0}
          negative={0}
          placeholder={true}
        />
        <p className="text-muted-foreground text-sm">
          {t('reviews.noReviews')}
        </p>
      </section>

      {/* Services Showcase */}
      <section>
        <ServicesShowcase />
      </section>
    </div>
  );
}

// For Phase 1: Dynamic rendering (no static generation)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

### 2. Update routing.ts (if needed)

**File**: `i18n/routing.ts`

Ensure the vehicle routes are configured:

```typescript
export const routing = {
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed', // No prefix for default Spanish
  pathnames: {
    '/vehiculos': {
      es: '/vehiculos',
      en: '/vehicles',
    },
    '/vehiculos/[slug]': {
      es: '/vehiculos/[slug]',
      en: '/vehicles/[slug]',
    },
  },
};
```

### 3. Create Type Definitions

**File**: `types/vehicle.ts`

```typescript
export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  variant: string | null;
  description: string | null;
  descriptionI18n?: {
    en?: string;
    [locale: string]: string | undefined;
  };
  specs: any; // JSONB field
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  specifications?: VehicleSpecifications;
  media: {
    images: Array<{
      url: string;
      alt: string;
      isHero: boolean;
    }>;
    heroIndex: number;
  };
  pricing: VehiclePricing[];
}

export interface VehicleSpecifications {
  rangeKmCltc?: number | null;
  rangeKmWltp?: number | null;
  rangeKmEpa?: number | null;
  rangeKmNedc?: number | null;
  rangeKmClcReported?: number | null;
  batteryKwh?: number | null;
  acceleration0To100Sec?: number | null;
  topSpeedKmh?: number | null;
  powerKw?: number | null;
  powerHp?: number | null;
  chargingDcKw?: number | null;
  chargingTimeDcMin?: number | null;
  seats?: number | null;
  weightKg?: number | null;
  bodyType: 'SEDAN' | 'CITY' | 'SUV' | 'PICKUP_VAN';
  sentimentPositivePercent?: number | null;
  sentimentNeutralPercent?: number | null;
  sentimentNegativePercent?: number | null;
}

export interface VehiclePricing {
  id: string;
  amount: number;
  currency: 'USD' | 'CRC';
  availability?: any;
  financing?: any;
  cta?: any;
  perks: string[];
  emphasis: 'none' | 'teal-border' | 'teal-glow';
  displayOrder: number;
  organization?: Organization;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  type: 'AGENCY' | 'DEALER' | 'IMPORTER';
  logoUrl?: string | null;
  contact?: any;
  official: boolean;
  badges: string[];
  description?: string | null;
}
```

### 4. Add Breadcrumbs (Optional Enhancement)

**File**: `components/ui/breadcrumbs.tsx`

```typescript
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
```

Add breadcrumbs to the page:

```typescript
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

// In the page component:
<Breadcrumbs
  items={[
    { label: t('title'), href: '/vehiculos' },
    { label: `${vehicle.brand} ${vehicle.model}` },
  ]}
/>
```

---

## Supabase Financing Data (FinancingTabs)

To make the FinancingTabs component production-ready, supply it with real bank data from Supabase.

### Banks Table / Supabase Requirements
- **Table**: `banks` (see `lib/db/schema/banks.ts`) – includes `id`, `slug`, `name`, `logoUrl`, `websiteUrl`, `contactPhone`, `contactEmail`, `typicalAprMin`, `typicalAprMax`, `typicalTermMonths`, `description`, `isFeatured`, `displayOrder`, `isActive`.
- **Query**: Reuse `getBanks()` from `lib/db/queries/banks.ts` (active, ordered, featured-first). Import it into `app/[locale]/vehicles/[slug]/page.tsx` to load banks during SSR.
- **Field Mapping**: Pass each row to `<FinancingTabs … />` with `logoUrl`, `typicalAprMin/Max`, `typicalTermMonths`, and optional contact fields so badges and CTA links render correctly.

### Data Quality & Seeding
- Seed the table with 3–5 Costa Rican finance partners (BAC, Banco Nacional, Scotiabank, Banco Popular, Coopealianza). Include APR ranges, terms, descriptions, and contact URLs to avoid empty badges.
- Sample SQL is provided in `docs/Roadmap/Phase 1/tasks/financingtabs.md` (“Database Seeding Guide”) – run it against the Supabase project or add via the Supabase SQL editor.
- Logos can be uploaded to Supabase Storage; store the CDN URL in `logoUrl` once available.
- Keep `isActive = true` for partners you want to show and order them via `displayOrder` (featured ones should have lower values).

### Translation Keys
- Confirm `messages/es.json` and `messages/en.json` both define `vehicle.financing.title` and `vehicle.financing.subtitle` so the Financing section heading is localized.
- Add any helper copies used inside `FinancingTabs` (e.g., button labels) to the same locales if they are introduced later.

### Testing Impact
- When banks exist, the Financing section should render tabs with APR/term badges, logos (or initials fallback), and CTA buttons.
- When the table is empty (or all rows `isActive = false`), the section should hide gracefully (no FinancingTabs).
- Ensure requests to Supabase during SSR do not timeout (banks list is small, cacheable).

---

## Component Props Mapping

### ProductTitle
```typescript
<ProductTitle
  brand={vehicle.brand}
  model={vehicle.model}
  variant={vehicle.variant}
  year={vehicle.year}
/>
```

### ImageCarousel
```typescript
<ImageCarousel
  images={vehicle.media.images}
  initialIndex={vehicle.media.heroIndex}
/>
```

### AgencyCard
```typescript
<AgencyCard
  agency={{
    id: org.id,
    name: org.name,
    logo: org.logoUrl,
    official: org.official,
    badges: org.badges,
  }}
  price={{
    amount: pricing.amount,
    currency: pricing.currency,
  }}
  availability={pricing.availability}
  financing={pricing.financing}
  cta={pricing.cta}
  perks={pricing.perks}
  emphasis={pricing.emphasis}
/>
```

### FinancingTabs
```typescript
<FinancingTabs
  banks={banks.map((bank) => ({
    id: bank.id,
    name: bank.name,
    logo: bank.logoUrl,
    aprMin: bank.typicalAprMin,
    aprMax: bank.typicalAprMax,
    terms: bank.typicalTermMonths,
  }))}
/>
```

---

## Testing Checklist

- [ ] Page renders correctly with vehicle data
- [ ] SEO metadata is correct (title, description, OG tags)
- [ ] Breadcrumbs navigation works
- [ ] Image carousel displays all images
- [ ] Hero image is correctly set
- [ ] All specifications display correctly
- [ ] Pricing cards render for all sellers/agencies
- [ ] Financing tabs show bank information
- [ ] Reviews section shows placeholder (Phase 4)
- [ ] Page is responsive on mobile/tablet/desktop
- [ ] 404 page shows for invalid slug
- [ ] Translation keys work in both locales (es, en)
- [ ] Canonical URLs are correct
- [ ] hreflang tags are present

---

## Responsive Design Considerations

### Mobile (< 768px):
- Stack image carousel and specs vertically
- Show 1 pricing card per row
- Collapse financing tabs to accordion

### Tablet (768px - 1024px):
- Show 2 pricing cards per row
- Keep image carousel and specs side-by-side

### Desktop (> 1024px):
- Show 3 pricing cards per row
- Full layout as designed

---

## Success Criteria

✅ Vehicle detail page displays all vehicle information
✅ SEO metadata is complete and correct
✅ All components integrated and working
✅ Responsive design works on all devices
✅ Translations work in both locales
✅ 404 page shows for invalid vehicles
✅ Performance is acceptable (< 2s load time)

---

## Next Steps

After completing this task, proceed to:
- **Task 5**: Vehicle Listings Page Implementation
