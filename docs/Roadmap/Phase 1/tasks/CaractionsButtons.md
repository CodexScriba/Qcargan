# CarActionButtons Component Implementation Plan

**Status**: 🔨 In Progress
**Priority**: High (Required for Task 4 completion)
**Estimated Effort**: 2-3 hours
**Dependencies**: FavoriteButton, CompareButton (already implemented)

---

## Executive Summary

The `CarActionButtons` component is a critical piece of the vehicle detail page that provides primary user actions for engaging with vehicle listings. Currently, it's a basic placeholder that needs to be enhanced with vehicle-specific functionality, share capabilities, contact seller features, and integration with existing agency components (favorites and compare).

This plan outlines a comprehensive implementation strategy that balances Phase 1 requirements (display and basic functionality) with Phase 3+ preparedness (backend integration hooks).

---

## Current State Analysis

### Existing Component
**File**: [components/product/car-action-buttons.tsx:1-17](components/product/car-action-buttons.tsx#L1-L17)

```tsx
'use client'

import React from 'react'

export function CarActionButtons() {
  return (
    <div className="flex gap-2">
      <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
        Contact Seller
      </button>
      <button className="px-4 py-2 border rounded-lg">
        Share
      </button>
    </div>
  )
}
```

### ❌ Current Issues

1. **No vehicle context**: Component doesn't accept vehicle ID or data
2. **Missing share functionality**: Share button has no implementation
3. **Missing favorites/compare integration**: Doesn't use existing agency components
4. **Not i18n-ready**: Hardcoded English strings
5. **No responsive variants**: Same layout on all screen sizes
6. **Missing accessibility**: No ARIA labels or semantic HTML
7. **No type safety**: No TypeScript interface for props
8. **Contact seller not implemented**: No actual contact mechanism

---

## Problem Statement

### 🎯 Core Requirements from Task 4

From [docs/Roadmap/Phase 1/tasks/Task4.md:12](docs/Roadmap/Phase 1/tasks/Task4.md#L12):
> •  CarActionButtons (add vehicle-specific share/favorite functionality)

### 🏗️ Architecture Context

From [docs/architecture.md:108](docs/architecture.md#L108):
> ├─ car-action-buttons.tsx – CarActionButtons client component providing primary actions (contact, share) for vehicle listings.

### 🧩 Related Components Available

From [docs/architecture.md:113-122](docs/architecture.md#L113-L122):
```
components/agency/
├─ favorite-button.tsx – FavoriteButton client component with heart icon
├─ compare-button.tsx – CompareButton client component with scale icon
├─ agency-actions.tsx – AgencyActions container component that groups buttons
└─ agency-card.tsx – AgencyCard displays official dealer pricing
```

**Key Insight**: We already have polished `FavoriteButton` and `CompareButton` components that support:
- Multiple sizes (default, compact, icon)
- Loading states
- Active/inactive states
- Accessibility (ARIA labels)
- Animations and transitions
- CVA-based variants

### 📝 Usage Context

From [app/[locale]/vehicles/[slug]/page.tsx:103](app/[locale]/vehicles/[slug]/page.tsx#L103):
```tsx
{/* Action Buttons */}
<CarActionButtons />
```

**Current limitation**: No vehicle ID or context passed to component.

---

## Design Goals

### ✅ Phase 1 Requirements (This Implementation)

1. **Accept vehicle context** - Component should receive vehicle ID, brand, model, year for share URLs
2. **Integrate favorites & compare** - Use existing agency components for consistency
3. **Implement share functionality** - Native Web Share API with fallback
4. **Add contact seller action** - Primary CTA with proper routing
5. **i18n support** - All strings from translation files
6. **Responsive design** - Adapt layout for mobile/tablet/desktop
7. **Type safety** - Full TypeScript interface
8. **Accessibility** - ARIA labels, keyboard navigation, semantic HTML

### 🚀 Phase 3+ Preparedness

1. **API integration hooks** - Pass vehicleId to favorites/compare for future backend
2. **Contact seller routing** - Prepare for contact form/modal integration
3. **Analytics hooks** - Prepare for tracking share/contact events
4. **Authentication awareness** - Design for future auth-gated features

---

## Proposed Solution

### Strategy: Smart Container with Action Composition

We'll create a **container component** that orchestrates multiple action types:

```
CarActionButtons (container)
  ├─ Primary Actions Row
  │  ├─ Contact Seller (primary CTA)
  │  └─ Share Button (secondary action)
  └─ Secondary Actions Row
     ├─ FavoriteButton (from agency components)
     └─ CompareButton (from agency components)
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│              CarActionButtons                       │
│  ┌───────────────────────┬──────────────────────┐  │
│  │  Contact Seller       │  Share               │  │  ← Primary Row
│  │  (Phone/WhatsApp)     │  (Web Share API)     │  │
│  └───────────────────────┴──────────────────────┘  │
│  ┌───────────────────────┬──────────────────────┐  │
│  │  ❤ Add to Favorites  │  ⚖ Add to Compare   │  │  ← Secondary Row
│  │  (FavoriteButton)     │  (CompareButton)     │  │
│  └───────────────────────┴──────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Responsive Behavior

#### Desktop (> 1024px)
```
┌─────────────────────┬──────────┬─────────────────┬─────────────────┐
│  Contact Seller     │  Share   │  Add Favorites  │  Add Compare    │
└─────────────────────┴──────────┴─────────────────┴─────────────────┘
```

#### Mobile (< 768px)
```
┌──────────────────────────────────────────┐
│         Contact Seller                   │  ← Full width primary
└──────────────────────────────────────────┘
┌────────────────┬──────────────────────────┐
│  Share         │  ❤ Favorites  │ ⚖ Compare  │  ← Row with icons
└────────────────┴──────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Core Component Refactor

#### Step 1: Define TypeScript Interface

**File**: `components/product/car-action-buttons.tsx`

```typescript
import type { VehicleDetail } from '@/types/vehicle'

export interface CarActionButtonsProps {
  // Vehicle identification (required for share, contact, favorites)
  vehicleId: string
  vehicleSlug: string

  // Display metadata (for share and contact context)
  brand: string
  model: string
  year: number
  variant?: string | null

  // Pricing context (for contact seller CTA)
  primarySellerContact?: {
    phone?: string
    whatsapp?: string
    email?: string
  }

  // Optional customization
  showFavorites?: boolean // Default: true
  showCompare?: boolean   // Default: true
  showShare?: boolean     // Default: true
  className?: string

  // Phase 3+ hooks
  onContactSeller?: (vehicleId: string) => void
  onShareSuccess?: (method: string) => void
  onShareError?: (error: Error) => void
}
```

**Alternative simpler interface (if we don't have contact info yet)**:
```typescript
export interface CarActionButtonsProps {
  vehicleId: string
  vehicleSlug: string
  brand: string
  model: string
  year: number
  variant?: string | null
  className?: string
}
```

#### Step 2: Implement Share Functionality

**Feature**: Native Web Share API with fallback to clipboard copy

```typescript
const handleShare = async () => {
  const shareUrl = `${window.location.origin}/${locale}/vehicles/${vehicleSlug}`
  const shareTitle = `${year} ${brand} ${model}${variant ? ` ${variant}` : ''}`
  const shareText = t('share.text', { brand, model, year })

  // Try native Web Share API first (mobile-friendly)
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      })
      onShareSuccess?.('native')
      toast.success(t('share.success'))
    } catch (error) {
      if (error.name !== 'AbortError') {
        // User cancelled - not an error
        onShareError?.(error as Error)
      }
    }
  } else {
    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success(t('share.copiedToClipboard'))
      onShareSuccess?.('clipboard')
    } catch (error) {
      toast.error(t('share.error'))
      onShareError?.(error as Error)
    }
  }
}
```

**Required dependencies**:
- `sonner` toast notifications (already in project)
- `useLocale()` from next-intl
- `useTranslations('vehicle')` for i18n strings

#### Step 3: Implement Contact Seller CTA

**Phase 1 Implementation**: Direct WhatsApp/Phone link

```typescript
const handleContactSeller = () => {
  const message = t('contact.whatsappMessage', {
    brand,
    model,
    year,
    url: `${window.location.origin}/${locale}/vehicles/${vehicleSlug}`
  })

  // Phase 1: Direct WhatsApp link (most common in Costa Rica)
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`

  // Open in new window
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

  onContactSeller?.(vehicleId)
}
```

**Phase 3+ Implementation**: Modal with contact form or seller selection
```typescript
const handleContactSeller = () => {
  // Open contact modal with vehicle context
  openContactModal({ vehicleId, vehicleSlug })
  onContactSeller?.(vehicleId)
}
```

#### Step 4: Integrate Agency Components

**Import existing components**:
```typescript
import { FavoriteButton } from '@/components/agency/favorite-button'
import { CompareButton } from '@/components/agency/compare-button'
```

**Wire up with vehicle context**:
```typescript
// Phase 1: Client-side state only (no backend)
const [isFavorite, setIsFavorite] = useState(false)
const [isComparing, setIsComparing] = useState(false)

const handleFavoriteToggle = () => {
  setIsFavorite(!isFavorite)
  // Phase 3: Add API call with vehicleId
  // await toggleFavorite(vehicleId)
}

const handleCompareToggle = () => {
  setIsComparing(!isComparing)
  // Phase 3: Add API call with vehicleId
  // await toggleCompare(vehicleId)
}
```

#### Step 5: Build Responsive Layout

**Mobile-first approach with Tailwind**:
```tsx
<div className={cn("space-y-3", className)}>
  {/* Primary Action Row */}
  <div className="flex gap-2">
    {/* Contact Seller - Full width on mobile, flex-1 on desktop */}
    <Button
      onClick={handleContactSeller}
      className="flex-1 min-h-[48px]"
      size="lg"
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      {t('actions.contactSeller')}
    </Button>

    {/* Share - Compact on mobile */}
    {showShare && (
      <Button
        onClick={handleShare}
        variant="outline"
        className="min-h-[48px] px-4 md:px-6"
        size="lg"
      >
        <Share2 className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">{t('actions.share')}</span>
      </Button>
    )}
  </div>

  {/* Secondary Action Row */}
  <div className="grid grid-cols-2 gap-2">
    {showFavorites && (
      <FavoriteButton
        isActive={isFavorite}
        onToggle={handleFavoriteToggle}
        size="default"
      />
    )}

    {showCompare && (
      <CompareButton
        isActive={isComparing}
        onToggle={handleCompareToggle}
        size="default"
      />
    )}
  </div>
</div>
```

---

## Component Variants

### Variant A: Standard Layout (Recommended)
**Best for**: Vehicle detail pages with ample space

```
┌─────────────────────────────────────────────────────┐
│  📞 Contact Seller          │  🔗 Share             │
├─────────────────────────────┴───────────────────────┤
│  ❤ Add to Favorites         │  ⚖ Add to Compare    │
└─────────────────────────────────────────────────────┘
```

### Variant B: Compact Layout
**Best for**: Vehicle cards in listings

```
┌──────────────┬──────┬──────┬──────┐
│  Contact     │  🔗  │  ❤   │  ⚖   │
└──────────────┴──────┴──────┴──────┘
```

### Variant C: Minimal Layout
**Best for**: Quick actions overlay on images

```
┌──────┬──────┬──────┐
│  🔗  │  ❤   │  ⚖   │
└──────┴──────┴──────┘
```

**Implementation**: Add `variant` prop to interface
```typescript
export interface CarActionButtonsProps {
  // ... other props
  variant?: 'standard' | 'compact' | 'minimal'
}
```

---

## i18n Translation Keys

**File**: `messages/es.json` and `messages/en.json`

### Spanish (es.json)
```json
{
  "vehicle": {
    "actions": {
      "contactSeller": "Contactar vendedor",
      "share": "Compartir",
      "addToFavorites": "Agregar a favoritos",
      "addToCompare": "Agregar a comparación",
      "removeFromFavorites": "Quitar de favoritos",
      "removeFromCompare": "Quitar de comparación"
    },
    "share": {
      "text": "Mira este {brand} {model} {year} en Qcargan",
      "success": "¡Compartido exitosamente!",
      "copiedToClipboard": "Enlace copiado al portapapeles",
      "error": "No se pudo compartir. Por favor intenta de nuevo."
    },
    "contact": {
      "whatsappMessage": "Hola, estoy interesado en el {brand} {model} {year}. Más información: {url}"
    }
  }
}
```

### English (en.json)
```json
{
  "vehicle": {
    "actions": {
      "contactSeller": "Contact seller",
      "share": "Share",
      "addToFavorites": "Add to favorites",
      "addToCompare": "Add to compare",
      "removeFromFavorites": "Remove from favorites",
      "removeFromCompare": "Remove from compare"
    },
    "share": {
      "text": "Check out this {brand} {model} {year} on Qcargan",
      "success": "Shared successfully!",
      "copiedToClipboard": "Link copied to clipboard",
      "error": "Could not share. Please try again."
    },
    "contact": {
      "whatsappMessage": "Hi, I'm interested in the {brand} {model} {year}. More info: {url}"
    }
  }
}
```

---

## Integration with Vehicle Detail Page

### Current Usage
**File**: `app/[locale]/vehicles/[slug]/page.tsx:103`
```tsx
{/* Action Buttons */}
<CarActionButtons />
```

### ✅ Updated Usage
```tsx
{/* Action Buttons */}
<CarActionButtons
  vehicleId={vehicle.id}
  vehicleSlug={slug}
  brand={brand}
  model={model}
  year={year}
  variant={variant}
/>
```

**With optional seller contact** (if we add this to query later):
```tsx
<CarActionButtons
  vehicleId={vehicle.id}
  vehicleSlug={slug}
  brand={brand}
  model={model}
  year={year}
  variant={variant}
  primarySellerContact={
    pricing[0]?.organization?.contact
      ? {
          phone: pricing[0].organization.contact.phone,
          whatsapp: pricing[0].organization.contact.whatsapp,
          email: pricing[0].organization.contact.email,
        }
      : undefined
  }
/>
```

---

## Accessibility Checklist

- [ ] **Keyboard Navigation**: All buttons focusable and operable with keyboard
- [ ] **ARIA Labels**: Descriptive labels for icon-only buttons
- [ ] **ARIA Live Regions**: Toast notifications announce to screen readers
- [ ] **Focus Management**: Focus returns to trigger after modal/share closes
- [ ] **Semantic HTML**: Use `<button>` elements (not divs)
- [ ] **Touch Targets**: Minimum 44x44px tap areas on mobile
- [ ] **Color Contrast**: Meet WCAG AA standards (4.5:1 for text)
- [ ] **Loading States**: Communicate loading to assistive tech
- [ ] **Error Messages**: Screen reader accessible error announcements

---

## Testing Strategy

### Unit Tests (Bun)
**File**: `tests/components/car-action-buttons.test.tsx`

```typescript
describe('CarActionButtons', () => {
  it('renders all action buttons when enabled', () => {
    // Test rendering
  })

  it('hides favorites when showFavorites=false', () => {
    // Test conditional rendering
  })

  it('calls onContactSeller when contact button clicked', () => {
    // Test callbacks
  })

  it('handles share with Web Share API', async () => {
    // Mock navigator.share
  })

  it('falls back to clipboard when Web Share unavailable', async () => {
    // Mock navigator.clipboard
  })

  it('toggles favorite state correctly', () => {
    // Test state management
  })

  it('toggles compare state correctly', () => {
    // Test state management
  })
})
```

### Manual Testing Checklist

**Desktop**:
- [ ] All buttons render correctly
- [ ] Contact seller opens WhatsApp with pre-filled message
- [ ] Share button copies link to clipboard
- [ ] Favorite button toggles heart icon fill
- [ ] Compare button toggles scale icon fill
- [ ] Buttons have hover states
- [ ] Keyboard navigation works (Tab, Enter, Space)

**Mobile**:
- [ ] Layout adapts to small screen
- [ ] Share button uses native share sheet (iOS/Android)
- [ ] Buttons are large enough to tap (44x44px minimum)
- [ ] Touch feedback works correctly

**Accessibility**:
- [ ] Screen reader announces all buttons correctly
- [ ] Focus visible on keyboard navigation
- [ ] ARIA labels present for icon-only buttons
- [ ] Toast notifications announced to screen readers

---

## Edge Cases

| Scenario | Behavior | Implementation |
|----------|----------|----------------|
| No vehicle data | Show placeholder or hide component | Early return with null |
| Share API unavailable | Fall back to clipboard copy | Check `navigator.share` availability |
| Clipboard API blocked | Show manual copy instructions | Try/catch with fallback message |
| No seller contact info | Generic contact CTA | Check for contact data, use fallback |
| User not authenticated (Phase 3+) | Prompt login for favorites/compare | Auth gate with modal |
| Offline mode | Disable share, queue favorites locally | Service worker integration |

---

## Performance Considerations

### Optimizations

1. **Lazy load icons**: Use dynamic imports for Lucide icons
2. **Debounce favorites/compare**: Prevent rapid toggling API spam
3. **Memoize callbacks**: Use `useCallback` for stable references
4. **Toast throttling**: Limit toast notifications to avoid spam

### Bundle Size Impact

| Component | Size (minified) | Notes |
|-----------|-----------------|-------|
| CarActionButtons | ~3-4 KB | Main component |
| FavoriteButton | Shared | Already loaded |
| CompareButton | Shared | Already loaded |
| Lucide icons | ~1 KB | MessageCircle, Share2 |
| **Total** | **~4-5 KB** | Minimal impact |

---

## Phase 3+ Enhancement Roadmap

### Backend Integration

1. **Favorites API**
   - POST `/api/favorites` - Add vehicle to favorites
   - DELETE `/api/favorites/{vehicleId}` - Remove from favorites
   - GET `/api/favorites` - List user's favorites
   - Real-time sync across devices

2. **Compare API**
   - POST `/api/compare` - Add vehicle to comparison (max 3-4)
   - DELETE `/api/compare/{vehicleId}` - Remove from comparison
   - GET `/api/compare` - Get comparison list
   - Persist in localStorage + database

3. **Contact Seller**
   - Modal with contact form
   - Email/WhatsApp/Phone options
   - Lead tracking for analytics
   - CAPTCHA for spam prevention

### Advanced Features

4. **Social Sharing**
   - Facebook/Twitter/LinkedIn specific shares
   - Custom Open Graph images per vehicle
   - Share analytics tracking

5. **Analytics**
   - Track share method usage (native vs clipboard)
   - Track favorite/compare conversion rates
   - Track contact seller clicks
   - A/B test button labels/layouts

---

## Implementation Checklist

### Phase 1: Core Functionality
- [ ] Create TypeScript interface with vehicle context props
- [ ] Implement Web Share API with clipboard fallback
- [ ] Integrate FavoriteButton and CompareButton components
- [ ] Implement contact seller WhatsApp action
- [ ] Add i18n strings to translation files
- [ ] Build responsive layout (mobile/desktop)
- [ ] Add proper ARIA labels and accessibility
- [ ] Handle loading and error states
- [ ] Update vehicle detail page to pass vehicle props
- [ ] Write unit tests for component logic

### Phase 1.5: Polish
- [ ] Add toast notifications (sonner)
- [ ] Add hover/focus animations
- [ ] Implement button loading states
- [ ] Add keyboard shortcuts (optional)
- [ ] Test on real mobile devices
- [ ] Test with screen readers
- [ ] Cross-browser testing

### Phase 2: Documentation
- [ ] Update architecture.md with new component details
- [ ] Update Task4.md checklist
- [ ] Create usage examples in Storybook (optional)
- [ ] Document props and types in JSDoc comments

### Phase 3: Backend Integration (Future)
- [ ] Create favorites API endpoints
- [ ] Create compare API endpoints
- [ ] Add authentication gates
- [ ] Implement contact seller modal
- [ ] Add analytics tracking
- [ ] Add social share metadata

---

## Success Criteria

### ✅ Component Implementation Complete When:

1. **Functional**:
   - ✅ Accepts vehicle ID, slug, brand, model, year as props
   - ✅ Share button works on desktop (clipboard) and mobile (native share)
   - ✅ Contact seller opens WhatsApp with pre-filled message
   - ✅ Favorite button toggles state correctly
   - ✅ Compare button toggles state correctly

2. **Design**:
   - ✅ Responsive layout adapts to mobile/tablet/desktop
   - ✅ Uses existing FavoriteButton and CompareButton styles
   - ✅ Follows design system (shadcn/Radix UI)
   - ✅ Proper spacing and alignment

3. **Code Quality**:
   - ✅ Full TypeScript type safety
   - ✅ i18n strings from translation files
   - ✅ Proper error handling
   - ✅ Clean, readable code with comments
   - ✅ No console errors or warnings

4. **Accessibility**:
   - ✅ Keyboard navigation works correctly
   - ✅ ARIA labels present and correct
   - ✅ Screen reader friendly
   - ✅ Minimum touch target sizes (44x44px)

5. **Testing**:
   - ✅ Manual testing on desktop (Chrome, Firefox, Safari)
   - ✅ Manual testing on mobile (iOS Safari, Chrome Android)
   - ✅ Unit tests pass (bun test)
   - ✅ TypeScript compiles without errors

6. **Integration**:
   - ✅ Vehicle detail page uses component with proper props
   - ✅ Build passes (`bun run build`)
   - ✅ No runtime errors in development server

---

## Files to Create/Modify

### Create/Modify
1. **`components/product/car-action-buttons.tsx`** - Main component implementation (~200 lines)
2. **`messages/es.json`** - Add Spanish translation keys (~15 lines)
3. **`messages/en.json`** - Add English translation keys (~15 lines)

### Modify
4. **`app/[locale]/vehicles/[slug]/page.tsx`** - Update component usage (~5 lines)
5. **`components/product/index.ts`** - Update barrel export (if needed)

### Optional
6. **`tests/components/car-action-buttons.test.tsx`** - Unit tests (~150 lines)
7. **`docs/architecture.md`** - Update component documentation (~10 lines)

---

## Estimated Timeline

| Task | Duration | Notes |
|------|----------|-------|
| Component implementation | 1.5 hours | Core logic, layout, integration |
| i18n strings | 15 minutes | Translation keys |
| Testing (manual) | 30 minutes | Desktop + mobile testing |
| Testing (automated) | 30 minutes | Unit tests |
| Documentation | 15 minutes | Update docs |
| **Total** | **3 hours** | Includes buffer time |

---

## Dependencies & Blockers

### ✅ Available Now
- FavoriteButton component
- CompareButton component
- Sonner toast library
- next-intl for translations
- Lucide React icons
- Vehicle type definitions

### ⚠️ Nice to Have (Not blocking)
- Seller contact info in database (can use generic WhatsApp for now)
- Authentication system (can defer to Phase 3)
- Analytics tracking (can defer to Phase 3)

### ❌ Not Needed for Phase 1
- Favorites/compare backend API
- Contact seller modal
- Social share metadata optimization

---

## Open Questions

1. **Q**: Should contact seller require selecting a specific seller, or use a generic contact?
   **A**: Phase 1 can use generic WhatsApp share. Phase 3+ add seller selection.

2. **Q**: Should favorites/compare be persisted in localStorage for Phase 1?
   **A**: Yes, use localStorage for now. Migrate to API in Phase 3.

3. **Q**: Should we add social share buttons (Facebook, Twitter)?
   **A**: Not for Phase 1. Native share API handles this on mobile.

4. **Q**: What happens if user clicks favorites/compare without auth?
   **A**: Phase 1: Works with localStorage. Phase 3: Show login modal.

5. **Q**: Should we track analytics events for button clicks?
   **A**: Add hooks for Phase 3, but don't implement tracking yet.

---

## Security Considerations

### ✅ Safe Practices

1. **XSS Protection**: All user input sanitized by React
2. **URL Generation**: Use window.location.origin (no hardcoded domains)
3. **External Links**: Use `noopener,noreferrer` for window.open
4. **Clipboard Access**: Graceful fallback if permission denied
5. **localStorage**: Don't store sensitive data (just vehicle IDs)

### ⚠️ Future Considerations (Phase 3+)

1. **CSRF Protection**: Add tokens for API calls
2. **Rate Limiting**: Prevent favorite/compare spam
3. **Authentication**: Validate user session for backend calls
4. **Input Validation**: Sanitize contact form submissions
5. **Spam Prevention**: Add CAPTCHA to contact forms

---

## Final Notes

This implementation balances **immediate functionality** (Phase 1) with **future scalability** (Phase 3+). The component is designed to work standalone with localStorage for favorites/compare, making it production-ready without backend dependencies.

The use of existing `FavoriteButton` and `CompareButton` components ensures **design consistency** and reduces duplicate code. The i18n-first approach ensures the component works seamlessly across Spanish and English locales.

**Recommendation**: Start with the standard variant (Variant A) for the vehicle detail page. Variants B and C can be added later for vehicle listings and card overlays.

---

**Document Created**: 2025-11-08
**Created By**: Claude (AI Assistant)
**Review Status**: ⏳ Awaiting review
**Implementation Status**: 🔨 Ready to implement

---

## Sign-Off

**Planning Complete**: ✅
**Ready for Implementation**: ✅
**Estimated Completion**: 3 hours from start
**Dependencies Resolved**: ✅
**Blockers**: None

---

*This plan provides a comprehensive blueprint for implementing the CarActionButtons component. All requirements from Task 4, architecture.md, and Phase 1 hand-off documentation have been incorporated.*
