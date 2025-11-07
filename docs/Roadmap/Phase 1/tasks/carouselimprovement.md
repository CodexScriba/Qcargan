# ImageCarousel Implementation - Task 4 Dependency

**Status**: Ready for Implementation  
**Dependencies**: Database schema ✅, Seed script ✅, Storage helper ✅, Query layer ✅  
**Blocking**: Vehicle Detail Page (Task 4)  
**Estimated Effort**: 30-45 minutes

---

## Current State

### ✅ Backend Infrastructure (Complete)

#### 1. Database Schema
**File**: `lib/db/schema/vehicle-images.ts`

The schema is **fully implemented** with two tables:

```typescript
// Primary image metadata
vehicle_images {
  id: uuid (PK)
  vehicleId: uuid (FK → vehicles.id, CASCADE DELETE)
  storagePath: text                    // "vehicles/byd/seagull-freedom-hero.jpg"
  displayOrder: integer                // For carousel ordering
  isHero: boolean                      // Identifies the hero/featured image
  altText: text                        // Accessibility text
  caption: text                        // Optional caption
  uploadedAt: timestamp
}

// Responsive image variants (thumbnails, webp, etc.)
vehicle_image_variants {
  id: uuid (PK)
  sourceImageId: uuid (FK → vehicle_images.id, CASCADE DELETE)
  variantType: 'thumbnail' | 'webp' | '2x' | 'mobile'
  storagePath: text                    // "vehicles/byd/seagull-freedom-hero.webp"
  width: integer
  height: integer
  format: 'webp' | 'avif' | 'jpg'
  createdAt: timestamp
}
```

**Indexes**: Composite index on `(vehicleId, isHero, displayOrder)` for fast carousel queries.

#### 2. Data Seeding
**File**: `scripts/seed-production-vehicles.ts`

The seed script **already creates image records** for each vehicle:

```typescript
// For each vehicle, creates:
1. Hero Image
   - storagePath: "vehicles/{brand}/{model}-{variant}-hero.jpg"
   - displayOrder: 0
   - isHero: true
   - altText: "{Brand} {Model} {Variant}"
   - caption: "Render hero frontal"

2. Gallery Image
   - storagePath: "vehicles/{brand}/{model}-{variant}-interior.jpg"
   - displayOrder: 1
   - isHero: false
   - altText: "{Brand} {Model} interior"
   - caption: "Interior y tecnología"

3. WebP Variant (for hero)
   - variantType: 'webp'
   - storagePath: ".../hero.webp"
   - width: 1600, height: 900
```

**Run command**: `bun run seed:production-vehicles`

#### 3. Storage Helper
**File**: `lib/supabase/storage.ts`

**Fully implemented** with CDN/signed URL conversion:

```typescript
// Single image URL
getPublicImageUrl(storagePath: string): Promise<string>
  → Returns browser-ready signed URL or public URL
  → 7-day expiry on signed URLs
  → Fallback to public URL for public buckets

// Batch conversion (efficient)
getPublicImageUrls(storagePaths: string[]): Promise<string[]>
  → Uses createSignedUrls() for batch processing
  → Maintains order of input array
  → Filters empty paths gracefully

// File validation
imageExists(storagePath: string): Promise<boolean>
  → Checks if file exists in storage bucket
```

**Storage Bucket**: `vehicle-images` (configured in helper)

#### 4. Query Layer
**File**: `lib/db/queries/vehicles.ts`

The `getVehicleBySlug()` query **already fetches and converts images**:

```typescript
// Returns vehicle with:
{
  ...vehicle,
  media: {
    images: VehicleMediaImage[],  // ← Fully converted URLs
    heroIndex: number              // ← Position of hero image
  }
}

// Where VehicleMediaImage is:
{
  id: string
  url: string              // ← Browser-ready signed/public URL
  storagePath: string
  altText: string | null
  caption: string | null
  displayOrder: number
  isHero: boolean
}
```

**N+1 Prevention**: Uses batch `getPublicImageUrls()` to convert all paths in one call.

---

## ⚠️ Missing Piece: Image Files in Storage

### Status: **NOT UPLOADED YET**

The database has image **metadata** (paths, alt text, display order), but the **actual image files** do not exist in Supabase Storage yet.

### Required Action Before Testing Carousel

**Option A: Upload Mock Images**
```bash
# Upload placeholder images to Supabase storage bucket "vehicle-images"
# Required paths (from seed script):
vehicles/byd/seagull-freedom-hero.jpg
vehicles/byd/seagull-freedom-interior.jpg
vehicles/byd/seagull-freedom-hero.webp
vehicles/byd/dolphin-elegance-hero.jpg
vehicles/byd/dolphin-elegance-interior.jpg
vehicles/byd/dolphin-elegance-hero.webp
# ... (continue for all seeded vehicles)
```

**Option B: Update Seed Script to Use Placeholder URLs**
```typescript
// Modify seed script to use external placeholder images
const heroPath = `https://placehold.co/1600x900/png?text=${brand}+${model}`
```

**Option C: Defer Image Display**
```typescript
// Show "No images available" state until images are uploaded
{media.images.length === 0 && (
  <div className="aspect-video bg-muted flex items-center justify-center">
    <p className="text-muted-foreground">Images coming soon</p>
  </div>
)}
```

### How to Check if Images Exist

Run the seed script and then query Supabase Storage:

```typescript
import { imageExists } from '@/lib/supabase/storage'

// Check if hero image exists
const exists = await imageExists('vehicles/byd/seagull-freedom-hero.jpg')
console.log('Hero image exists:', exists) // false = need to upload
```

---

## ❌ Frontend Component (Incomplete)

### Current Implementation
**File**: `components/ui/image-carousel.tsx`

```typescript
// Current state: BASIC STUB
export interface ImageCarouselProps {
  images: string[]          // ← Wrong type! Should be VehicleMediaImage[]
  initialIndex?: number
  className?: string
}

// Only shows single static image, no navigation
<img src={images[currentIndex]} alt={`Vehicle image ${currentIndex + 1}`} />
// TODO: Implement full carousel with navigation and thumbnails
```

### Required Implementation

#### 1. Fix Type Interface ✅ Priority
```typescript
import type { VehicleMediaImage } from '@/types/vehicle'

export interface ImageCarouselProps {
  images: VehicleMediaImage[]  // ← Use proper type
  initialIndex?: number
  className?: string
}
```

#### 2. Integrate Embla Carousel ✅ Priority
**Library**: Already installed (`embla-carousel-react ^8.6.0`)

```typescript
import useEmblaCarousel from 'embla-carousel-react'

const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: false,
  startIndex: initialIndex
})
```

#### 3. Core Features ✅ Must Have

**a) Previous/Next Navigation**
```typescript
- Previous button (disabled at start)
- Next button (disabled at end)
- onClick handlers using emblaApi.scrollPrev() / scrollNext()
- Keyboard support: Arrow Left/Right keys
```

**b) Thumbnail Strip**
```typescript
- Scrollable thumbnail bar below main image
- Active thumbnail highlighted
- Click thumbnail to jump to image
- Uses emblaApi.scrollTo(index)
```

**c) Proper Image Display**
```typescript
- Use VehicleMediaImage.url (already converted by query)
- Use VehicleMediaImage.altText for accessibility
- Display VehicleMediaImage.caption if present
- Responsive aspect-ratio (aspect-video)
```

**d) Edge Cases**
```typescript
- Hide navigation when images.length === 1
- Empty state when images.length === 0
- Handle missing URLs gracefully (show placeholder)
```

#### 4. Optional Enhancements ⏳ Nice to Have
```typescript
- Image counter: "3 / 7"
- Autoplay with pause button
- Fullscreen/lightbox mode
- Pinch-to-zoom on mobile
- Lazy loading for thumbnails
```

---

## Implementation Checklist

### Phase 1: Type Safety & Data Flow ✅
- [ ] Update `ImageCarouselProps` interface to use `VehicleMediaImage[]`
- [ ] Update page usage to pass `vehicle.media.images` instead of string array
- [ ] Verify TypeScript compiles without errors

### Phase 2: Embla Integration ✅
- [ ] Import and initialize `useEmblaCarousel` hook
- [ ] Set `startIndex: initialIndex` in config
- [ ] Wire emblaRef to viewport div
- [ ] Test basic swipe/drag functionality

### Phase 3: Navigation Controls ✅
- [ ] Add Previous/Next buttons with Lucide icons
- [ ] Implement click handlers using emblaApi
- [ ] Add disabled states at boundaries
- [ ] Implement keyboard arrow key support

### Phase 4: Thumbnail Strip ✅
- [ ] Create thumbnail container below main image
- [ ] Map over images to render thumbnail grid
- [ ] Highlight active thumbnail based on emblaApi scroll position
- [ ] Implement click-to-jump with emblaApi.scrollTo()

### Phase 5: Polish & Edge Cases ✅
- [ ] Hide nav buttons when only 1 image
- [ ] Show empty state when 0 images
- [ ] Handle missing image URLs (show placeholder)
- [ ] Add smooth transitions with CSS
- [ ] Test on mobile/tablet/desktop

### Phase 6: Data Prerequisites ⏳
- [ ] Run seed script: `bun run seed:production-vehicles`
- [ ] Upload actual image files to Supabase Storage bucket "vehicle-images"
- [ ] Or: Temporarily use placeholder images
- [ ] Verify images load in browser using signed URLs

---

## Example Usage in Vehicle Detail Page

### Before (Current - Broken)
```tsx
import ImageCarousel from '@/components/ui/image-carousel'

// ❌ Wrong: Passes string array, expects objects
<ImageCarousel
  images={vehicle.media.images.map(img => img.url)}
  initialIndex={vehicle.media.heroIndex}
/>
```

### After (Correct)
```tsx
import ImageCarousel from '@/components/ui/image-carousel'
import type { VehicleMediaImage } from '@/types/vehicle'

// ✅ Correct: Passes full objects
<ImageCarousel
  images={vehicle.media.images}  // Already has urls, altText, captions
  initialIndex={vehicle.media.heroIndex}
  className="rounded-3xl overflow-hidden"
/>
```

---

## Data Flow Diagram

```
Database (vehicle_images table)
  ↓ storagePath: "vehicles/byd/seagull-freedom-hero.jpg"
Query Layer (lib/db/queries/vehicles.ts)
  ↓ Calls getPublicImageUrls(storagePaths)
Storage Helper (lib/supabase/storage.ts)
  ↓ Converts to signed URLs
Query Result (vehicle.media.images)
  ↓ url: "https://.../storage/v1/object/sign/vehicle-images/...?token=..."
ImageCarousel Component
  ↓ <img src={image.url} alt={image.altText} />
Browser
  ✅ Displays image from Supabase CDN
```

---

## Testing Strategy

### 1. Unit Tests (Optional)
```typescript
// tests/components/image-carousel.test.tsx
describe('ImageCarousel', () => {
  it('renders empty state when no images', () => {})
  it('hides navigation when single image', () => {})
  it('shows prev/next buttons for multiple images', () => {})
  it('highlights correct thumbnail', () => {})
  it('starts at initialIndex', () => {})
})
```

### 2. Visual Testing (Required)
```bash
# 1. Seed database
bun run seed:production-vehicles

# 2. Start dev server
bun run dev

# 3. Navigate to any vehicle detail page
# Example: http://localhost:3000/vehiculos/byd-seagull-freedom-2025

# 4. Verify:
# - Main image displays
# - Can click prev/next buttons
# - Can click thumbnails to jump
# - Keyboard arrows work
# - Touch swipe works on mobile
```

### 3. Edge Case Testing
```typescript
// Test with different data scenarios
- Zero images: Should show "No images available"
- One image: Should hide navigation buttons
- Multiple images: Should show full carousel
- Missing URLs: Should show placeholder
- First image: Prev button disabled
- Last image: Next button disabled
```

---

## Success Criteria

✅ Component accepts `VehicleMediaImage[]` type  
✅ Embla Carousel integrated for smooth navigation  
✅ Previous/Next buttons work correctly  
✅ Thumbnail strip shows all images with active state  
✅ Keyboard arrow keys navigate carousel  
✅ Touch swipe works on mobile devices  
✅ Empty state displays when no images  
✅ Single image hides navigation controls  
✅ Proper alt text from database used for accessibility  
✅ Image captions display if present  
✅ TypeScript compiles without errors  
✅ Visual testing confirms proper display  

---

## Dependencies Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Database Schema | ✅ Complete | `vehicle_images` and `vehicle_image_variants` tables |
| Seed Script | ✅ Complete | Creates 2 images per vehicle (hero + gallery) |
| Storage Helper | ✅ Complete | URL conversion working with signed URLs |
| Query Layer | ✅ Complete | Fetches and converts image URLs in batch |
| Type Definitions | ✅ Complete | `VehicleMediaImage` type in `types/vehicle.ts` |
| Embla Library | ✅ Installed | `embla-carousel-react ^8.6.0` |
| **Image Files** | ❌ **Missing** | Need to upload to Supabase Storage |
| **Carousel Component** | ❌ **Incomplete** | Only basic stub exists |

---

## Next Steps

1. **Implement ImageCarousel Component** (30-45 minutes)
   - Follow implementation checklist above
   - Test with mock data first

2. **Upload Image Files** (or use placeholders)
   - Create/upload actual images to `vehicle-images` bucket
   - Or modify seed script to use placeholder URLs
   - Verify images load in browser

3. **Integrate into Vehicle Detail Page**
   - Update page to use proper `VehicleMediaImage[]` type
   - Test with seeded data
   - Verify all navigation works

4. **Visual QA**
   - Test on mobile, tablet, desktop
   - Verify keyboard navigation
   - Confirm touch swipe on mobile
   - Check empty and single-image states

---

## Related Files

**Schema & Types**:
- `lib/db/schema/vehicle-images.ts` - Database schema
- `types/vehicle.ts` - TypeScript type definitions

**Query Layer**:
- `lib/db/queries/vehicles.ts` - Vehicle queries with image fetching
- `lib/supabase/storage.ts` - URL conversion helper

**Data Seeding**:
- `scripts/seed-production-vehicles.ts` - Seeds image metadata

**Component**:
- `components/ui/image-carousel.tsx` - Component to implement

**Page Usage**:
- `app/[locale]/vehicles/[slug]/page.tsx` - Vehicle detail page

**Documentation**:
- `docs/architecture.md` - Overall architecture
- `docs/Roadmap/Phase 1/completed/phase1-handsoff.md` - Phase 1 completion status
- `docs/Roadmap/Phase 1/tasks/Task4.md` - Vehicle detail page task

---

**Created**: 2025-11-07  
**Author**: Droid (Factory AI)  
**Last Updated**: 2025-11-07
