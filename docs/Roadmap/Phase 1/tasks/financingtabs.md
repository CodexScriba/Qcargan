# FinancingTabs Database Integration Plan

**Status**: Ready for Implementation
**Component**: `components/banks/FinancingTabs.tsx`
**Database Query**: `lib/db/queries/banks.ts`
**Target Page**: `app/[locale]/vehicles/[slug]/page.tsx`
**Estimated Time**: 5-10 minutes

---

## Objective

Connect the FinancingTabs component to the Supabase database to display real bank financing options on vehicle detail pages.

---

## Current State Analysis

### FinancingTabs Component Requirements

**File**: `components/banks/FinancingTabs.tsx:15-26`

```typescript
export interface BankTab {
  id: string
  name: string
  logo?: string | null
  aprMin?: number | null
  aprMax?: number | null
  terms?: number[] | null
  websiteUrl?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  description?: string | null
}
```

### Database Schema

**File**: `lib/db/schema/banks.ts`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✅ | Primary key, auto-generated |
| `slug` | text | ✅ | URL-friendly identifier |
| `name` | text | ✅ | Bank name (e.g., "BAC San José") |
| `logoUrl` | text | ⬜ | CDN URL to bank logo |
| `websiteUrl` | text | ⬜ | Bank's main website |
| `contactPhone` | text | ⬜ | Phone number for financing inquiries |
| `contactEmail` | text | ⬜ | Email for financing inquiries |
| `typicalAprMin` | numeric(4,2) | ⬜ | Minimum APR (e.g., 4.99) |
| `typicalAprMax` | numeric(4,2) | ⬜ | Maximum APR (e.g., 12.99) |
| `typicalTermMonths` | integer[] | ⬜ | Available loan terms (e.g., [24, 36, 48, 60, 72]) |
| `description` | text | ⬜ | Brief description of financing offerings |
| `isFeatured` | boolean | ✅ | Featured banks appear first |
| `displayOrder` | integer | ✅ | Manual ordering (lower = earlier) |
| `isActive` | boolean | ✅ | Only active banks displayed |

### Existing Query Function

**File**: `lib/db/queries/banks.ts:9-15`

```typescript
export async function getBanks() {
  return db
    .select()
    .from(banks)
    .where(eq(banks.isActive, true))
    .orderBy(desc(banks.isFeatured), asc(banks.displayOrder), asc(banks.name))
}
```

✅ **Already production-ready** - filters for active banks, orders by featured status, then display order, then name.

---

## Implementation Steps

### Step 1: Import Query Function

**File**: `app/[locale]/vehicles/[slug]/page.tsx`

Add import at the top (around line 3):

```typescript
import { getBanks } from '@/lib/db/queries/banks'
import FinancingTabs from '@/components/banks/FinancingTabs'
```

### Step 2: Fetch Banks Data

**File**: `app/[locale]/vehicles/[slug]/page.tsx:44-56`

Add query call in the component function (after `getVehicleBySlug`):

```typescript
export default async function VehicleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params

  const vehicle: VehicleDetail | null = await getVehicleBySlug(slug)

  if (!vehicle) {
    notFound()
  }

  // Fetch banks for financing section
  const banks = await getBanks()  // ← ADD THIS LINE

  const t = await getTranslations({ locale, namespace: 'vehicle' })

  // ... rest of component
}
```

### Step 3: Replace Placeholder with FinancingTabs

**File**: `app/[locale]/vehicles/[slug]/page.tsx:184-200`

**Before** (placeholder):
```typescript
{/* Financing Section - Placeholder for now */}
<section className="space-y-6">
  <div className="space-y-1">
    <h2 className="text-3xl font-bold tracking-tight">
      {t('financing.title')}
    </h2>
    <p className="text-muted-foreground">
      {t('financing.subtitle')}
    </p>
  </div>

  <div className="rounded-2xl border border-border/60 bg-card/95 p-6">
    <p className="text-sm text-muted-foreground text-center">
      Financing options coming soon
    </p>
  </div>
</section>
```

**After** (connected to database):
```typescript
{/* Financing Section */}
{banks.length > 0 && (
  <section className="space-y-6">
    <div className="space-y-1">
      <h2 className="text-3xl font-bold tracking-tight">
        {t('financing.title')}
      </h2>
      <p className="text-muted-foreground">
        {t('financing.subtitle')}
      </p>
    </div>

    <FinancingTabs
      banks={banks.map((bank) => ({
        id: bank.id,
        name: bank.name,
        logo: bank.logoUrl,
        aprMin: bank.typicalAprMin,
        aprMax: bank.typicalAprMax,
        terms: bank.typicalTermMonths,
        websiteUrl: bank.websiteUrl,
        contactPhone: bank.contactPhone,
        contactEmail: bank.contactEmail,
        description: bank.description,
      }))}
    />
  </section>
)}
```

---

## Field Mapping

| Database Field | Component Prop | Type Conversion | Notes |
|----------------|----------------|-----------------|-------|
| `id` | `id` | ✅ Direct | UUID to string automatic |
| `name` | `name` | ✅ Direct | Both text/string |
| `logoUrl` | `logo` | ✅ Direct | Optional in both |
| `typicalAprMin` | `aprMin` | ✅ Auto | `.$type<number>()` handles numeric→number |
| `typicalAprMax` | `aprMax` | ✅ Auto | Same as above |
| `typicalTermMonths` | `terms` | ✅ Direct | Both number[] |
| `websiteUrl` | `websiteUrl` | ✅ Direct | Both optional string |
| `contactPhone` | `contactPhone` | ✅ Direct | Both optional string |
| `contactEmail` | `contactEmail` | ✅ Direct | Both optional string |
| `description` | `description` | ✅ Direct | Both optional string |

**✅ No type conversion needed** - Schema already configured for automatic conversion.

---

## Component Display Behavior

### Tab Headers
- Bank logo (or initials fallback if missing)
- Bank name in uppercase

### Tab Content
**Bank Information**:
- Avatar + Name
- Description text (if provided)

**Badges**:
- APR Range Badge: "4.99% – 12.99% APR" (only if aprMin or aprMax exists)
- Term Range Badge: "24 – 72 months" (only if terms array exists)

**Call-to-Action Buttons**:
- "Visit site" → Opens websiteUrl in new tab
- "Call {phone}" → `tel:` link to contactPhone
- "Email advisor" → `mailto:` link to contactEmail

### Empty States
- **No banks**: "Financing partners will appear here once they are added to Supabase."
- **Loading**: Shows skeleton placeholders (not used in SSR, but available for client components)

---

## Data Requirements for Display

### Minimum Required Fields
To display a meaningful financing tab, each bank should have:

1. ✅ **Required**:
   - `id` (auto-generated)
   - `slug` (for future direct linking)
   - `name` (displayed in UI)
   - `isActive = true` (to appear in queries)

2. ⚠️ **At least ONE of**:
   - `aprMin` and/or `aprMax` (for rate badge)
   - `typicalTermMonths` (for term badge)
   - `websiteUrl`, `contactPhone`, or `contactEmail` (for actionable CTAs)

3. 🎨 **Recommended for Polish**:
   - `logoUrl` (improves visual appeal)
   - `description` (provides context to users)
   - Complete APR range (both min and max)
   - Multiple contact methods

### Example Bank Records

#### Full-Featured Bank
```json
{
  "slug": "bac-san-jose",
  "name": "BAC San José",
  "logoUrl": "https://example.com/logos/bac.png",
  "websiteUrl": "https://www.bac.cr/vehiculos-electricos",
  "contactPhone": "+506 2295-9797",
  "contactEmail": "vehiculos@bac.cr",
  "typicalAprMin": 4.99,
  "typicalAprMax": 12.99,
  "typicalTermMonths": [24, 36, 48, 60, 72],
  "description": "Financiamiento especializado para vehículos eléctricos con tasas preferenciales",
  "isFeatured": true,
  "displayOrder": 0,
  "isActive": true
}
```

#### Minimal Bank (still functional)
```json
{
  "slug": "banco-popular",
  "name": "Banco Popular",
  "websiteUrl": "https://www.bancopopular.fi.cr/",
  "typicalAprMin": 5.5,
  "typicalAprMax": 14.0,
  "isFeatured": false,
  "displayOrder": 10,
  "isActive": true
}
```

---

## Translation Keys Required

Check that these keys exist in `messages/en.json` and `messages/es.json`:

```json
{
  "vehicle": {
    "financing": {
      "title": "Financing Options",
      "subtitle": "Explore pre-approved financing from our partner banks"
    }
  }
}
```

**Spanish** (`messages/es.json`):
```json
{
  "vehicle": {
    "financing": {
      "title": "Opciones de Financiamiento",
      "subtitle": "Explora financiamiento pre-aprobado de nuestros bancos aliados"
    }
  }
}
```

---

## Testing Checklist

### Functional Testing
- [ ] Page loads without errors when banks exist in database
- [ ] Page loads without errors when no banks exist (empty state)
- [ ] Bank tabs render correctly with proper styling
- [ ] Tab switching works (click between banks)
- [ ] APR range displays correctly (e.g., "4.99% – 12.99% APR")
- [ ] Term range displays correctly (e.g., "24 – 72 months")
- [ ] "Visit site" button opens in new tab
- [ ] "Call" button triggers phone dialer
- [ ] "Email advisor" button opens email client

### Edge Cases
- [ ] Bank with no logo (fallback to initials)
- [ ] Bank with no description (no description text shown)
- [ ] Bank with only aprMin (displays "X% APR")
- [ ] Bank with only aprMax (displays "X% APR")
- [ ] Bank with identical aprMin/aprMax (displays "X% APR" not range)
- [ ] Bank with no APR data (no APR badge)
- [ ] Bank with no terms (no terms badge)
- [ ] Bank with no contact methods (no CTA buttons)
- [ ] Single bank (should show tabs with one option)
- [ ] Multiple banks (featured banks appear first)

### Visual Testing
- [ ] Responsive on mobile (320px width)
- [ ] Responsive on tablet (768px width)
- [ ] Responsive on desktop (1024px+ width)
- [ ] Bank logos display correctly
- [ ] Badges render with proper colors
- [ ] Hover states work on buttons
- [ ] Focus states visible for accessibility

---

## Performance Considerations

### Current Approach
- **Query**: Single `getBanks()` call per page load
- **Expected Volume**: <10 banks typically
- **Performance**: Negligible overhead

### Future Optimization (Phase 2+)
If bank data rarely changes, add Next.js caching:

```typescript
import { unstable_cache } from 'next/cache'

const banks = await unstable_cache(
  getBanks,
  ['banks-active'],
  {
    revalidate: 3600, // 1 hour
    tags: ['banks']
  }
)()
```

---

## Known Limitations & Future Enhancements

### Current Limitations
1. **Hardcoded English text**: Component has English-only text in line 136-137
2. **No vehicle-specific rates**: Shows generic APR ranges, not vehicle-specific offers
3. **No rate calculator**: Users can't estimate monthly payments

### Future Enhancements (Phase 3+)
- [ ] Extract hardcoded strings to i18n translation keys
- [ ] Add monthly payment calculator with down payment slider
- [ ] Store vehicle-specific financing offers in junction table
- [ ] Add "Get Pre-Approved" CTA with lead capture form
- [ ] Track which banks users engage with (analytics)

---

## Database Seeding Guide

### Required Sample Banks for Costa Rica Market

**Recommendation**: Add 3-5 banks initially with complete data.

#### Suggested Costa Rican Banks
1. **BAC San José** - Major auto lender, EV-focused programs
2. **Banco Nacional** - Government bank, green financing
3. **Scotiabank Costa Rica** - International bank with EV loans
4. **Banco Popular** - Popular choice for auto financing
5. **Coopealianza** - Cooperative with competitive rates

### Sample SQL Insert

```sql
INSERT INTO banks (slug, name, logo_url, website_url, contact_phone, contact_email, typical_apr_min, typical_apr_max, typical_term_months, description, is_featured, display_order, is_active)
VALUES
  (
    'bac-san-jose',
    'BAC San José',
    NULL, -- Add logo URL after uploading to Supabase Storage
    'https://www.bac.cr/vehiculos-electricos',
    '+506 2295-9797',
    'vehiculos@bac.cr',
    4.99,
    12.99,
    ARRAY[24, 36, 48, 60, 72],
    'Financiamiento especializado para vehículos eléctricos con tasas preferenciales',
    true,
    0,
    true
  ),
  (
    'banco-nacional',
    'Banco Nacional de Costa Rica',
    NULL,
    'https://www.bncr.fi.cr/creditos/credito-vehiculo',
    '+506 2212-2000',
    'creditos@bncr.fi.cr',
    5.50,
    14.00,
    ARRAY[24, 36, 48, 60, 72, 84],
    'Crédito verde para vehículos eléctricos con condiciones preferenciales',
    true,
    1,
    true
  ),
  (
    'scotiabank-cr',
    'Scotiabank Costa Rica',
    NULL,
    'https://www.scotiabankcr.com/prestamos-personales/prestamo-de-auto',
    '+506 2287-8700',
    'creditos@scotiabank.cr',
    6.00,
    15.00,
    ARRAY[36, 48, 60, 72],
    'Préstamo de auto con tasas competitivas y aprobación rápida',
    false,
    2,
    true
  );
```

---

## Implementation Checklist

- [ ] Add `getBanks()` import to vehicle detail page
- [ ] Call `getBanks()` in server component
- [ ] Replace placeholder with `<FinancingTabs />` component
- [ ] Map database fields to component props
- [ ] Verify translation keys exist (`financing.title`, `financing.subtitle`)
- [ ] Seed database with 3-5 sample banks
- [ ] Test with seeded data (all fields populated)
- [ ] Test with minimal data (missing logos, descriptions)
- [ ] Test empty state (no banks in database)
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Verify all CTA links work (website, phone, email)
- [ ] Test tab switching functionality
- [ ] Verify APR and term formatting displays correctly
- [ ] Check accessibility (keyboard navigation, ARIA labels)

---

## Success Criteria

✅ **Component Integration Complete When**:
1. FinancingTabs displays real data from Supabase
2. Bank logos, names, and descriptions render correctly
3. APR ranges and term badges display when data exists
4. All CTA buttons function (website, phone, email)
5. Empty state shows when no banks exist
6. Featured banks appear first in tab order
7. No TypeScript errors or runtime errors
8. Responsive design works on all screen sizes
9. Component gracefully handles missing optional fields

---

## Estimated Timeline

- **Code Changes**: 5-10 minutes
- **Database Seeding**: 10-15 minutes (including logo upload)
- **Testing**: 15-20 minutes
- **Total**: ~30-45 minutes

---

## Dependencies

✅ **Ready**:
- Database schema (`banks` table)
- Query function (`getBanks()`)
- Component (`FinancingTabs.tsx`)
- TypeScript types (auto-inferred from schema)

⏳ **Pending**:
- Seeded bank data in Supabase
- Bank logo images uploaded to Supabase Storage (optional but recommended)

---

## Next Steps After Implementation

1. Gather real bank data for Costa Rican market
2. Upload bank logos to Supabase Storage
3. Update logo URLs in database
4. Test with real-world data
5. Add analytics tracking for bank engagement
6. Consider adding monthly payment calculator (Phase 3)

---

**Status**: ✅ Ready for immediate implementation
**Blockers**: None (can implement with empty banks table, will show empty state)
**Recommended**: Seed 3-5 banks first for meaningful testing

---

**Last Updated**: 2025-11-08
**Author**: Claude (AI Assistant)
**Review Status**: Pending human review
