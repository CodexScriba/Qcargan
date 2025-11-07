import 'dotenv/config'

import { generateVehicleSlug, slugify } from '@/lib/utils/identifiers'
import {
  banks,
  organizations,
  vehicleImageVariants,
  vehicleImages,
  vehiclePricing,
  vehicleSpecifications,
  vehicles
} from '@/lib/db/schema'
import { createDatabase } from '@/lib/db/client'
import type { VehicleAvailability } from '@/lib/db/schema/vehicle-pricing'
import vehicleDataset from '../cardatasample.json'
import { stableUuid } from './utils/identifiers'

type VehicleBodyType = typeof vehicleSpecifications.$inferInsert.bodyType

type RawVehicle = {
  brand: string
  model: string
  price_cr: string
  variations: Array<{
    name: string
    battery_usable_kWh?: number
    range_km_cltc?: number
    range_km_wltp?: number
    range_km_epa_est?: number
    power_hp?: number
    torque_nm?: number
    acceleration_0_50_s?: number
    acceleration_0_100_s?: number
    drive?: string
    fast_charge_max_kw?: number
    seating_capacity?: number
    dimensions_mm?: {
      length?: number
      width?: number
      height?: number
      wheelbase?: number
    }
    interior_features?: {
      screen_in?: number
      instrument_cluster_in?: number
      wireless_charging?: boolean
    }
    special_features?: string[]
  }>
}

type SeededVehicle = {
  vehicle: typeof vehicles.$inferInsert
  spec: typeof vehicleSpecifications.$inferInsert
  images: Array<typeof vehicleImages.$inferInsert>
  imageVariants: Array<typeof vehicleImageVariants.$inferInsert>
  pricing: Array<typeof vehiclePricing.$inferInsert>
}

const ORGANIZATIONS_SEED = [
  {
    slug: 'byd-experience-store',
    name: 'BYD Experience Store',
    type: 'AGENCY',
    logoUrl: 'https://cdn.qcargan.com/logos/byd.png',
    official: true,
    badges: ['Casa matriz', 'Entrega rápida'],
    description: 'Showroom oficial de BYD con soporte completo y entregas en todo Costa Rica.',
    contact: {
      phone: '+506 4000 1111',
      whatsapp: '+506 4000 1111',
      email: 'ventas@byd.cr',
      address: 'Sabana Norte, San José'
    }
  },
  {
    slug: 'volvo-autostar',
    name: 'Volvo AutoStar',
    type: 'DEALER',
    logoUrl: 'https://cdn.qcargan.com/logos/volvo.png',
    official: true,
    badges: ['Garantía oficial', 'Servicio premium'],
    description: 'Distribuidor autorizado Volvo con inventario electrificado y planes corporativos.',
    contact: {
      phone: '+506 4100 9090',
      whatsapp: '+506 4100 9090',
      email: 'hola@volvocostarica.com',
      address: 'La Uruca, San José'
    }
  },
  {
    slug: 'latam-ev-collective',
    name: 'LATAM EV Collective',
    type: 'IMPORTER',
    logoUrl: 'https://cdn.qcargan.com/logos/latam-ev.png',
    official: false,
    badges: ['Importación directa', 'Conversions support'],
    description: 'Especialistas en importar ediciones especiales de Rivian y otras marcas premium.',
    contact: {
      phone: '+506 7200 6060',
      whatsapp: '+506 7200 6060',
      email: 'sales@latamev.co',
      address: 'Escazú Village, Escazú'
    }
  }
] as const

const BANKS_SEED = [
  {
    slug: 'banco-verde',
    name: 'Banco Verde',
    logoUrl: 'https://cdn.qcargan.com/banks/banco-verde.svg',
    websiteUrl: 'https://bancoverde.example.com/ev',
    contactEmail: 'autos@bancoverde.com',
    contactPhone: '+506 2200 3030',
    typicalAprMin: 4.25,
    typicalAprMax: 6.5,
    typicalTermMonths: [48, 60, 72],
    description: 'Financiamiento especializado para vehículos eléctricos con asesoría energética.',
    isFeatured: true,
    displayOrder: 1
  },
  {
    slug: 'latitude-finance',
    name: 'Latitude Finance',
    logoUrl: 'https://cdn.qcargan.com/banks/latitude.svg',
    websiteUrl: 'https://latitude.cr/green-loans',
    contactEmail: 'green@latitude.cr',
    contactPhone: '+506 2290 5050',
    typicalAprMin: 5.1,
    typicalAprMax: 7.8,
    typicalTermMonths: [60, 72, 84],
    description: 'Banco boutique con planes de leasing operativo y seguro incluido para EVs.',
    isFeatured: true,
    displayOrder: 2
  },
  {
    slug: 'future-charge-bank',
    name: 'FutureCharge Bank',
    logoUrl: 'https://cdn.qcargan.com/banks/future-charge.svg',
    websiteUrl: 'https://futurecharge.bank/e-mobility',
    contactEmail: 'contact@futurecharge.bank',
    contactPhone: '+506 2525 7878',
    typicalAprMin: 4.75,
    typicalAprMax: 6.9,
    typicalTermMonths: [48, 60],
    description: 'Entidad digital con desembolsos rápidos y descuentos si instalás cargador en casa.',
    isFeatured: false,
    displayOrder: 3
  }
] as const

const ORGANIZATION_BY_BRAND: Record<string, (typeof ORGANIZATIONS_SEED)[number]['slug']> = {
  BYD: 'byd-experience-store',
  Volvo: 'volvo-autostar',
  Rivian: 'latam-ev-collective'
}

const BODY_TYPE_BY_MODEL: Record<string, VehicleBodyType> = {
  SEAGULL: 'CITY',
  SEAL: 'SEDAN',
  TANG: 'SUV',
  EX90: 'SUV',
  C40: 'SUV',
  EX30: 'CITY',
  R1T: 'PICKUP_VAN'
}

const YEAR_BY_MODEL: Record<string, number> = {
  SEAGULL: 2024,
  SEAL: 2024,
  TANG: 2024,
  EX90: 2025,
  C40: 2024,
  EX30: 2024,
  R1T: 2024
}

const { db, sql } = createDatabase()

function parsePriceUsd(input: string): number {
  const normalized = input.replace(/[^0-9.]/g, '')
  const value = Number.parseFloat(normalized)
  if (Number.isNaN(value)) {
    throw new Error(`Price "${input}" could not be parsed`)
  }
  return value
}

function hpToKw(hp?: number): number | undefined {
  if (!hp) return undefined
  return Math.round(hp * 0.7457)
}

function sanitizePhone(input?: string): string | undefined {
  if (!input) return undefined
  return input.replace(/[^0-9]/g, '')
}

function estimateChargingMinutes(batteryKwh?: number, maxKw?: number): number | undefined {
  if (!batteryKwh || !maxKw || maxKw === 0) return undefined
  return Math.round((batteryKwh / maxKw) * 60)
}

function buildAvailability(model: string): VehicleAvailability {
  if (model === 'EX90' || model === 'R1T') {
    return {
      label: 'Pre-orden',
      tone: 'warning',
      estimated_delivery_days: 120
    }
  }
  return {
    label: 'En stock',
    tone: 'success',
    estimated_delivery_days: 30
  }
}

function buildVehicleSeeds(): SeededVehicle[] {
  const rawVehicles = (vehicleDataset as { vehicles: RawVehicle[] }).vehicles

  return rawVehicles.flatMap((entry) => {
    return entry.variations.map((variant, variantIdx) => {
      const normalizedModel = entry.model.toUpperCase()
      const year = YEAR_BY_MODEL[normalizedModel] ?? 2024
      const slug = generateVehicleSlug(entry.brand, entry.model, year, variant.name)
      const vehicleId = stableUuid('vehicle', slug)
      const variantSlug = slugify(variant.name)
      const brandSlug = slugify(entry.brand)
      const modelSlug = slugify(entry.model)
      const heroPath = `vehicles/${brandSlug}/${modelSlug}-${variantSlug}-hero.jpg`
      const galleryPath = `vehicles/${brandSlug}/${modelSlug}-${variantSlug}-interior.jpg`
      const amount = parsePriceUsd(entry.price_cr)
      const batteryKwh = variant.battery_usable_kWh
      const fastChargeKw = variant.fast_charge_max_kw
      const chargingTime = estimateChargingMinutes(batteryKwh, fastChargeKw)
      const acceleration = variant.acceleration_0_100_s ?? (variant.acceleration_0_50_s ? variant.acceleration_0_50_s * 2 : undefined)

      const vehicle: typeof vehicles.$inferInsert = {
        id: vehicleId,
        slug,
        brand: entry.brand,
        model: entry.model,
        year,
        variant: variant.name,
        specs: {
          torque: { nm: variant.torque_nm },
          dimensions: variant.dimensions_mm,
          features: [
            variant.drive ? `Tracción ${variant.drive}` : null,
            ...(variant.special_features ?? []),
            variant.interior_features?.screen_in
              ? `Pantalla central de ${variant.interior_features.screen_in}"`
              : null,
            variant.interior_features?.wireless_charging ? 'Cargador inalámbrico' : null
          ].filter((item): item is string => Boolean(item)),
          charging: {
            dc: fastChargeKw
              ? {
                  kW: fastChargeKw,
                  time: chargingTime ? `${chargingTime} min (10-80%)` : undefined
                }
              : undefined
          }
        },
        description: `${variant.name} combina la propuesta ${entry.brand} con ${variant.drive ?? 'configuración urbana'} pensada para Costa Rica.`,
        isPublished: true
      }

      const spec: typeof vehicleSpecifications.$inferInsert = {
        vehicleId,
        rangeKmCltc: variant.range_km_cltc,
        rangeKmWltp: variant.range_km_wltp,
        rangeKmEpa: variant.range_km_epa_est,
        batteryKwh,
        acceleration0To100Sec: acceleration,
        topSpeedKmh: undefined,
        powerKw: hpToKw(variant.power_hp),
        powerHp: variant.power_hp,
        chargingDcKw: fastChargeKw,
        chargingTimeDcMin: chargingTime,
        seats: variant.seating_capacity,
        bodyType: BODY_TYPE_BY_MODEL[normalizedModel] ?? 'SUV'
      }

      const heroImageId = stableUuid('vehicle-image', `${vehicleId}:hero`)
      const galleryImageId = stableUuid('vehicle-image', `${vehicleId}:gallery`)

      const images: Array<typeof vehicleImages.$inferInsert> = [
        {
          id: heroImageId,
          vehicleId,
          storagePath: heroPath,
          displayOrder: 0,
          isHero: true,
          altText: `${entry.brand} ${entry.model} ${variant.name}`,
          caption: 'Render hero frontal'
        },
        {
          id: galleryImageId,
          vehicleId,
          storagePath: galleryPath,
          displayOrder: 1,
          isHero: false,
          altText: `${entry.brand} ${entry.model} interior`,
          caption: 'Interior y tecnología'
        }
      ]

      const imageVariants: Array<typeof vehicleImageVariants.$inferInsert> = [
        {
          id: stableUuid('vehicle-image-variant', `${heroImageId}:webp`),
          sourceImageId: heroImageId,
          variantType: 'webp',
          storagePath: heroPath.replace(/\\.jpg$/i, '.webp'),
          width: 1600,
          height: 900,
          format: 'webp'
        }
      ]

      const organizationSlug = ORGANIZATION_BY_BRAND[entry.brand]
      if (!organizationSlug) {
        throw new Error(`Missing organization mapping for brand ${entry.brand}`)
      }

      const pricing: Array<typeof vehiclePricing.$inferInsert> = [
        {
          id: stableUuid('vehicle-pricing', `${vehicleId}:${organizationSlug}`),
          vehicleId,
          organizationId: stableUuid('org', organizationSlug),
          amount,
          currency: 'USD',
          availability: buildAvailability(entry.model),
          financing: {
            down_payment: Math.round(amount * 0.2),
            monthly_payment: Math.round(((amount * 0.8) / 60) * 100) / 100,
            term_months: 60,
            apr_percent: 4.9,
            display_currency: 'USD'
          },
          cta: {
            label: 'Solicitar cotización',
            href: buildCtaUrl(entry, variant, organizationSlug)
          },
          perks: [
            'Garantía de batería 8 años',
            fastChargeKw ? `Carga rápida hasta ${fastChargeKw} kW` : 'Incluye instalación de cargador',
            variant.drive ? `${variant.drive} de fábrica` : 'Asesoría de manejo eficiente'
          ],
          emphasis: variantIdx === 0 ? 'teal-glow' : 'teal-border',
          displayOrder: variantIdx,
          isActive: true
        }
      ]

      return { vehicle, spec, images, imageVariants, pricing }
    })
  })
}

function buildCtaUrl(entry: RawVehicle, variant: RawVehicle['variations'][number], orgSlug: string): string {
  const organization = ORGANIZATIONS_SEED.find((org) => org.slug === orgSlug)
  const rawPhone = sanitizePhone(organization?.contact.whatsapp ?? organization?.contact.phone)
  const normalized = rawPhone
    ? rawPhone.startsWith('506') && rawPhone.length >= 11
      ? rawPhone
      : `506${rawPhone.slice(-8)}`
    : undefined
  const base = normalized ? `https://wa.me/${normalized}` : 'https://qcargan.com/contact'
  const message = encodeURIComponent(
    `Hola, me interesa ${entry.brand} ${entry.model} ${variant.name} que vi en Qcargan.`
  )
  return `${base}?text=${message}`
}

async function seedBanks(transaction: typeof db) {
  const bankRows = BANKS_SEED.map((bank) => ({
    id: stableUuid('bank', bank.slug),
    ...bank,
    isActive: true
  }))

  for (const bank of bankRows) {
    const { id, ...updates } = bank
    await transaction
      .insert(banks)
      .values(bank)
      .onConflictDoUpdate({
        target: banks.id,
        set: updates
      })
  }

  console.log(`[seed] Banks upserted: ${bankRows.length}`)
}

async function seedOrganizations(transaction: typeof db) {
  for (const org of ORGANIZATIONS_SEED) {
    const row = {
      id: stableUuid('org', org.slug),
      slug: org.slug,
      name: org.name,
      type: org.type,
      logoUrl: org.logoUrl,
      contact: org.contact,
      official: org.official,
      badges: org.badges,
      description: org.description,
      isActive: true
    } satisfies typeof organizations.$inferInsert

    const { id, ...updates } = row
    await transaction
      .insert(organizations)
      .values(row)
      .onConflictDoUpdate({
        target: organizations.id,
        set: updates
      })
  }

  console.log(`[seed] Organizations upserted: ${ORGANIZATIONS_SEED.length}`)
}

async function seedVehiclesBundle(transaction: typeof db, seeds: SeededVehicle[]) {
  for (const seed of seeds) {
    const { vehicle } = seed
    const { id, ...updates } = vehicle
    await transaction
      .insert(vehicles)
      .values(vehicle)
      .onConflictDoUpdate({
        target: vehicles.id,
        set: updates
      })
  }
  console.log(`[seed] Vehicles upserted: ${seeds.length}`)

  for (const seed of seeds) {
    await transaction
      .insert(vehicleSpecifications)
      .values(seed.spec)
      .onConflictDoUpdate({
        target: vehicleSpecifications.vehicleId,
        set: (({ vehicleId, ...rest }) => rest)(seed.spec)
      })
  }
  console.log(`[seed] Vehicle specs upserted: ${seeds.length}`)
}

async function seedImages(transaction: typeof db, seeds: SeededVehicle[]) {
  const imageRows = seeds.flatMap((seed) => seed.images)
  for (const image of imageRows) {
    const { id, ...updates } = image
    await transaction
      .insert(vehicleImages)
      .values(image)
      .onConflictDoUpdate({
        target: vehicleImages.id,
        set: updates
      })
  }
  console.log(`[seed] Vehicle images upserted: ${imageRows.length}`)

  const variantRows = seeds.flatMap((seed) => seed.imageVariants)
  for (const variant of variantRows) {
    const { id, ...updates } = variant
    await transaction
      .insert(vehicleImageVariants)
      .values(variant)
      .onConflictDoUpdate({
        target: vehicleImageVariants.id,
        set: updates
      })
  }
  console.log(`[seed] Vehicle image variants upserted: ${variantRows.length}`)
}

async function seedPricing(transaction: typeof db, seeds: SeededVehicle[]) {
  const pricingRows = seeds.flatMap((seed) => seed.pricing)
  for (const row of pricingRows) {
    const { id, ...updates } = row
    await transaction
      .insert(vehiclePricing)
      .values(row)
      .onConflictDoUpdate({
        target: vehiclePricing.id,
        set: updates
      })
  }
  console.log(`[seed] Vehicle pricing upserted: ${pricingRows.length}`)
}

async function main() {
  const seeds = buildVehicleSeeds()
  await db.transaction(async (tx) => {
    await seedBanks(tx)
    await seedOrganizations(tx)
    await seedVehiclesBundle(tx, seeds)
    await seedImages(tx, seeds)
    await seedPricing(tx, seeds)
  })
  console.log('[seed] Production vehicle dataset ready ✅')
}

main()
  .catch((error) => {
    console.error('[seed] Failed to seed data', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await sql.end({ timeout: 5 })
  })
