---
stage: completed
agent: "01-\U0001F5FA️roadmapper"
tags: [roadmap-complete]
contexts:
  - ai-guide
  - architecture
skills: []
---

# Car-Listing-Page

/home/cynic/workspace/Qcargan/car_page_example.png

I need to create the new car listing page at:
/home/cynic/workspace/Qcargan/app/[locale]/cars/[slug]/page.tsx

I'd like to split the development into a title, carousel, seller's cards, bank cards, review system display, car specs, etc. Generate all the components needed one by one and build the page little by little. 

## Refined Prompt
Build a modular Car Listing Page for the **BYD Seagull** using **Next.js 16** (App Router), Tailwind CSS, and Shadcn UI. 

**Key Requirements:**
- **Data Fetching:** Sync real-time data from Supabase. The page should fetch vehicle details, seller information, and reviews for the BYD Seagull slug.
- **Localization:** Implement multi-language support using `next-intl`, referencing keys from `/home/cynic/workspace/Qcargan/messages/en.json`.
- **Architecture:** The page at `app/[locale]/cars/[slug]/page.tsx` will act as the container, composed of the modular components listed below. **Do not use or reference the /legacy folder.**
- **Design:** Follow the layout from `car_page_example.png` with modern cosmetic improvements using Shadcn UI.
- **Workflow:** For each component, use legacy files only as a reference for logic/structure. Present a draft for review and wait for confirmation or requested changes before finalizing the file.

## Component Map
To maintain clarity, each section of the page is mapped to a specific component file:

| Component | Responsibility | Reference File Path |
| :--- | :--- | :--- |
| **VehicleHeader** | Title, Year, Share/Favorite actions | `@/components/vehicles/vehicle-header.tsx` |
| **VehicleGallery** | Interactive Image Carousel | `@/components/vehicles/vehicle-gallery.tsx` |
| **VehicleQuickSpecs** | Summary bar (Range, Battery, 0-100) | `@/components/vehicles/vehicle-quick-specs.tsx` |
| **VehicleDetailedSpecs** | Technical specifications grid | `@/components/vehicles/vehicle-detailed-specs.tsx` |
| **PricingCard** | Price display and availability status | `@/components/vehicles/pricing-card.tsx` |
| **SellerCard** | Seller info and contact (WhatsApp/Email) | `@/components/vehicles/seller-card.tsx` |
| **FinancingSection** | Bank cards and monthly calculator | `@/components/vehicles/financing-section.tsx` |
| **ReviewSummary** | User reviews and sentiment breakdown | `@/components/vehicles/review-summary.tsx` |
| **VehicleDescription** | Detailed text description | `@/components/vehicles/vehicle-description.tsx` |

## Data Schema Reference (Supabase)
The components should expect data structured according to the `vehicles` table, including joined relations for:
- `sellers` (name, contact, rating)
- `reviews` (rating, comment, user)
- `specs` (jsonb field or related table)

## Progress Tracking
- [ ] Setup Page Container & Supabase Fetching
- [ ] Draft & Review: VehicleHeader
- [ ] Draft & Review: VehicleGallery
- [ ] Draft & Review: VehicleQuickSpecs
