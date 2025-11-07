# Task 5: Vehicle Listings Page Implementation

**Status**: Pending
**Dependencies**: Task 1 (Database Schema), Task 2 (i18n), Task 3 (Data Fetching)
**Estimated Effort**: 4-5 hours

---

## Objective

Create the vehicle listings page (`/vehicles`) that displays a filterable, sortable grid of all available vehicles with search and pagination capabilities.

---

## Scope

### Page Features:
- Grid layout of vehicle cards
- Filtering by:
  - Brand
  - Body type
  - Price range
  - Minimum range
  - Minimum seats
- Sorting by:
  - Price (low to high, high to low)
  - Range (low to high, high to low)
  - Newest first
- Responsive design (grid/list views)
- SEO-optimized metadata
- Pagination

---

## Implementation Steps

### 1. Create Page File

**File**: `app/[locale]/vehicles/page.tsx`

```typescript
import { getTranslations } from 'next-intl/server';
import { getVehicles, getBrands } from '@/lib/db/queries/vehicles';
import VehicleCard from '@/components/product/vehicle-card';
import VehicleFilters from '@/components/product/vehicle-filters';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.vehicleList' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'es' ? '/vehiculos' : '/en/vehicles',
      languages: {
        'es': '/vehiculos',
        'en': '/en/vehicles',
      }
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'es' ? 'es_CR' : 'en_US',
    },
  };
}

export default async function VehiclesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const urlParams = await searchParams;

  const t = await getTranslations({ locale, namespace: 'vehicle' });

  // Parse filters from URL params
  const filters = {
    brand: typeof urlParams.brand === 'string' ? urlParams.brand : undefined,
    bodyType: typeof urlParams.bodyType === 'string' ? urlParams.bodyType : undefined,
    priceMin: urlParams.priceMin ? Number(urlParams.priceMin) : undefined,
    priceMax: urlParams.priceMax ? Number(urlParams.priceMax) : undefined,
    rangeMin: urlParams.rangeMin ? Number(urlParams.rangeMin) : undefined,
    seatsMin: urlParams.seatsMin ? Number(urlParams.seatsMin) : undefined,
    sortBy: (urlParams.sortBy as 'price' | 'range' | 'newest') || 'newest',
    sortOrder: (urlParams.sortOrder as 'asc' | 'desc') || 'desc',
  };

  const page = urlParams.page ? Number(urlParams.page) : 1;

  // Fetch data
  const { vehicles, pagination } = await getVehicles(filters, { page, limit: 12 });
  const brands = await getBrands();

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1600px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('filters.all')}: {pagination.total} {t('title').toLowerCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Suspense fallback={<FiltersSkeleton />}>
            <VehicleFilters
              brands={brands}
              currentFilters={filters}
            />
          </Suspense>
        </aside>

        {/* Vehicle Grid */}
        <main className="lg:col-span-3">
          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              {pagination.total} {t('title').toLowerCase()}
            </p>
            <div className="flex gap-2">
              {/* Sort dropdown */}
              <SortDropdown currentSort={filters.sortBy} currentOrder={filters.sortOrder} />
            </div>
          </div>

          {/* Vehicle Grid */}
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('filters.noResults')}</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.hasMore && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                hasMore={pagination.hasMore}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// For Phase 1: Dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

### 2. Create VehicleCard Component

**File**: `components/product/vehicle-card.tsx`

```typescript
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VehicleCardProps {
  vehicle: {
    id: string;
    slug: string;
    brand: string;
    model: string;
    year: number;
    variant: string | null;
    heroImage: {
      url: string;
      alt: string;
    } | null;
    specifications?: {
      rangeKmCltc?: number | null;
      batteryKwh?: number | null;
      seats?: number | null;
      bodyType: string;
    };
    pricing: {
      minPrice: number;
      sellerCount: number;
    };
  };
  locale: string;
}

export default function VehicleCard({ vehicle, locale }: VehicleCardProps) {
  const t = useTranslations('vehicle');

  const href = locale === 'es'
    ? `/vehiculos/${vehicle.slug}`
    : `/en/vehicles/${vehicle.slug}`;

  return (
    <Link href={href}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full">
        {/* Image */}
        <div className="relative aspect-video bg-muted">
          {vehicle.heroImage ? (
            <Image
              src={vehicle.heroImage.url}
              alt={vehicle.heroImage.alt}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{t('noImage')}</p>
            </div>
          )}

          {/* Body Type Badge */}
          {vehicle.specifications?.bodyType && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2"
            >
              {t(`bodyType.${vehicle.specifications.bodyType}`)}
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-bold text-lg">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.variant && (
              <p className="text-sm text-muted-foreground">{vehicle.variant}</p>
            )}
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {vehicle.specifications?.rangeKmCltc && (
              <div>
                <p className="text-muted-foreground">{t('specs.range')}</p>
                <p className="font-semibold">{vehicle.specifications.rangeKmCltc} km</p>
              </div>
            )}
            {vehicle.specifications?.batteryKwh && (
              <div>
                <p className="text-muted-foreground">{t('specs.battery')}</p>
                <p className="font-semibold">{vehicle.specifications.batteryKwh} kWh</p>
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{t('pricing.from')}</p>
            <p className="text-xl font-bold">
              ${vehicle.pricing.minPrice.toLocaleString()}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {t('pricing.sellers', { count: vehicle.pricing.sellerCount })}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
```

### 3. Create VehicleFilters Component

**File**: `components/product/vehicle-filters.tsx`

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface VehicleFiltersProps {
  brands: string[];
  currentFilters: {
    brand?: string;
    bodyType?: string;
    priceMin?: number;
    priceMax?: number;
    rangeMin?: number;
    seatsMin?: number;
  };
}

export default function VehicleFilters({ brands, currentFilters }: VehicleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('vehicle.filters');

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(window.location.pathname);
  };

  return (
    <div className="space-y-6 card-container p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">{t('title')}</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          {t('clear')}
        </Button>
      </div>

      {/* Brand Filter */}
      <div className="space-y-2">
        <Label>{t('brand')}</Label>
        <Select
          value={currentFilters.brand || ''}
          onValueChange={(value) => updateFilter('brand', value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('all')}</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body Type Filter */}
      <div className="space-y-2">
        <Label>{t('bodyType')}</Label>
        <Select
          value={currentFilters.bodyType || ''}
          onValueChange={(value) => updateFilter('bodyType', value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('all')}</SelectItem>
            <SelectItem value="SEDAN">{t('bodyTypes.SEDAN')}</SelectItem>
            <SelectItem value="CITY">{t('bodyTypes.CITY')}</SelectItem>
            <SelectItem value="SUV">{t('bodyTypes.SUV')}</SelectItem>
            <SelectItem value="PICKUP_VAN">{t('bodyTypes.PICKUP_VAN')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>{t('priceRange')}</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder={t('min')}
            value={currentFilters.priceMin || ''}
            onChange={(e) => updateFilter('priceMin', e.target.value)}
          />
          <Input
            type="number"
            placeholder={t('max')}
            value={currentFilters.priceMax || ''}
            onChange={(e) => updateFilter('priceMax', e.target.value)}
          />
        </div>
      </div>

      {/* Range Filter */}
      <div className="space-y-2">
        <Label>{t('rangeMin')}</Label>
        <Input
          type="number"
          placeholder="300 km"
          value={currentFilters.rangeMin || ''}
          onChange={(e) => updateFilter('rangeMin', e.target.value)}
        />
      </div>

      {/* Seats Filter */}
      <div className="space-y-2">
        <Label>{t('seatsMin')}</Label>
        <Select
          value={currentFilters.seatsMin?.toString() || ''}
          onValueChange={(value) => updateFilter('seatsMin', value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('all')}</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
            <SelectItem value="7">7+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
```

### 4. Create SortDropdown Component

**File**: `components/product/sort-dropdown.tsx`

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortDropdownProps {
  currentSort: string;
  currentOrder: string;
}

export default function SortDropdown({ currentSort, currentOrder }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('vehicle.filters');

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    const [sortBy, sortOrder] = value.split('-');
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    router.push(`?${params.toString()}`);
  };

  const currentValue = `${currentSort}-${currentOrder}`;

  return (
    <Select value={currentValue} onValueChange={updateSort}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={t('sortBy')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest-desc">{t('sortNewest')}</SelectItem>
        <SelectItem value="price-asc">{t('sortPrice')} (↑)</SelectItem>
        <SelectItem value="price-desc">{t('sortPrice')} (↓)</SelectItem>
        <SelectItem value="range-asc">{t('sortRange')} (↑)</SelectItem>
        <SelectItem value="range-desc">{t('sortRange')} (↓)</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### 5. Create Pagination Component

**File**: `components/ui/pagination.tsx`

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
}

export default function Pagination({ currentPage, hasMore }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        onClick={() => updatePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="px-4">Page {currentPage}</span>
      <Button
        variant="outline"
        onClick={() => updatePage(currentPage + 1)}
        disabled={!hasMore}
      >
        Next
      </Button>
    </div>
  );
}
```

---

## Translation Keys Required

Add to `messages/es.json` and `messages/en.json`:

```json
{
  "vehicle": {
    "filters": {
      "title": "Filtros",
      "clear": "Limpiar",
      "noResults": "No se encontraron vehículos con estos filtros",
      "bodyTypes": {
        "SEDAN": "Sedán",
        "CITY": "Ciudad",
        "SUV": "SUV",
        "PICKUP_VAN": "Pickup / Van"
      },
      "min": "Mín",
      "max": "Máx"
    },
    "noImage": "Sin imagen"
  }
}
```

---

## Testing Checklist

- [ ] Page renders with all vehicles
- [ ] Brand filter works
- [ ] Body type filter works
- [ ] Price range filter works (min and max)
- [ ] Range filter works
- [ ] Seats filter works
- [ ] Sort by price works (ascending and descending)
- [ ] Sort by range works (ascending and descending)
- [ ] Sort by newest works
- [ ] Pagination works (next/previous)
- [ ] Clear filters button works
- [ ] Vehicle cards link to detail pages
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] SEO metadata is correct
- [ ] Empty state shows when no results
- [ ] URL params persist on page refresh

---

## Responsive Design Considerations

### Mobile (< 768px):
- Filters collapse to accordion/drawer
- Show 1 vehicle card per row
- Stack filters above grid

### Tablet (768px - 1024px):
- Show 2 vehicle cards per row
- Filters in sidebar or drawer

### Desktop (> 1024px):
- Show 3 vehicle cards per row
- Filters in left sidebar (always visible)

---

## Success Criteria

✅ Vehicle listings page displays all vehicles
✅ All filters work correctly
✅ Sorting works for price, range, and newest
✅ Pagination works
✅ Vehicle cards link to detail pages
✅ Responsive design works on all devices
✅ SEO metadata is complete
✅ Performance is acceptable (< 2s load time)
✅ Empty state shows when no results

---

## Next Steps

After completing all Phase 1 tasks:
- Test end-to-end flow
- Conduct QA review
- Prepare for Phase 0 (database seeding)
- Document any issues or improvements for Phase 2
