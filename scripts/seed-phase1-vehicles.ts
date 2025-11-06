#!/usr/bin/env tsx

/**
 * Phase 1 Vehicle Seeding Script
 *
 * Seeds the database with:
 * - 6 vehicles from 2 brands (BYD and Tesla)
 * - 2 organizations (dealers/agencies)
 * - Vehicle specifications
 * - Vehicle images
 * - Pricing information
 * - 2 banks for financing options
 *
 * Run with: npx tsx scripts/seed-phase1-vehicles.ts
 */

import { createDatabase } from '../lib/db/client'
import * as schema from '../drizzle/schema'
import { generateVehicleSlug, stableUuid } from './utils/identifiers'
import { eq } from 'drizzle-orm'

const { db, sql: sqlClient } = createDatabase()

const PLACEHOLDER_IMAGE = '/placeholder-car.svg'

// Helper to generate stable UUIDs for seed data
const uuid = (namespace: string, key: string) => stableUuid(namespace, key)

// Organizations
const organizations = [
  {
    id: uuid('org', 'byd-costa-rica'),
    slug: 'byd-costa-rica',
    name: 'BYD Costa Rica',
    type: 'AGENCY' as const,
    logoUrl: '/logos/byd-logo.png',
    contact: {
      phone: '+506-2222-3333',
      email: 'ventas@byd.cr',
      whatsapp: '+506-8888-9999',
      address: 'San José, Costa Rica'
    },
    official: true,
    badges: ['Agencia Oficial', 'Garantía de Fábrica'],
    description: 'Agencia oficial de BYD en Costa Rica. Vehículos eléctricos de calidad con garantía de fábrica.',
    isActive: true,
  },
  {
    id: uuid('org', 'tesla-costa-rica'),
    slug: 'tesla-costa-rica',
    name: 'Tesla Costa Rica',
    type: 'DEALER' as const,
    logoUrl: '/logos/tesla-logo.png',
    contact: {
      phone: '+506-2100-5000',
      email: 'info@tesla.cr',
      whatsapp: '+506-8700-8700',
      address: 'Escazú, San José, Costa Rica'
    },
    official: true,
    badges: ['Distribuidor Autorizado', 'Servicio Certificado'],
    description: 'Distribuidor autorizado de Tesla en Costa Rica. Tecnología de punta en movilidad eléctrica.',
    isActive: true,
  }
]

// Banks
const banks = [
  {
    id: uuid('bank', 'banco-nacional'),
    slug: 'banco-nacional-cr',
    name: 'Banco Nacional de Costa Rica',
    logoUrl: '/logos/bncr-logo.png',
    websiteUrl: 'https://www.bncr.fi.cr',
    contactPhone: '+506-2212-2000',
    contactEmail: 'servicios@bncr.fi.cr',
    typicalAprMin: '8.50',
    typicalAprMax: '12.50',
    typicalTermMonths: [36, 48, 60, 72],
    description: 'Banco líder en Costa Rica con opciones de financiamiento competitivas para vehículos eléctricos.',
    isFeatured: true,
    displayOrder: 1,
    isActive: true,
  },
  {
    id: uuid('bank', 'bac-credomatic'),
    slug: 'bac-credomatic',
    name: 'BAC Credomatic',
    logoUrl: '/logos/bac-logo.png',
    websiteUrl: 'https://www.baccredomatic.com',
    contactPhone: '+506-2295-9595',
    contactEmail: 'info@bac.cr',
    typicalAprMin: '7.99',
    typicalAprMax: '11.99',
    typicalTermMonths: [48, 60, 72, 84],
    description: 'Financiamiento flexible para vehículos eléctricos con tasas preferenciales.',
    isFeatured: true,
    displayOrder: 2,
    isActive: true,
  }
]

// Vehicles data
const vehicles = [
  // BYD Vehicles
  {
    id: uuid('vehicle', 'byd-seagull-2025'),
    slug: generateVehicleSlug('BYD', 'Seagull', 2025, 'Freedom'),
    brand: 'BYD',
    model: 'Seagull',
    year: 2025,
    variant: 'Freedom',
    badges: ['Nuevo 2025', 'Más Vendido'],
    description: 'El BYD Seagull es el auto eléctrico urbano perfecto. Compacto, eficiente y con tecnología de última generación.',
    descriptionI18n: {
      en: 'The BYD Seagull is the perfect urban electric car. Compact, efficient, and with cutting-edge technology.'
    },
    variantI18n: {
      en: 'Freedom'
    },
    isPublished: true,
    specs: {
      torque: { nm: 135, lbft: 100 },
      dimensions: {
        length: 3780,
        width: 1715,
        height: 1540,
        wheelbase: 2500
      },
      features: ['Sistema de Infoentretenimiento', 'Control Crucero', 'Asistente de Estacionamiento'],
      warranty: {
        vehicle: '6 años / 150,000 km',
        battery: '8 años / 150,000 km'
      },
      charging: {
        ac: { kW: 6.6, time: '6 horas' },
        dc: { kW: 40, time: '30 min a 80%' }
      }
    },
    media: {
      images: [
        { url: '/vehicles/byd-seagull/hero.jpg', alt: 'BYD Seagull vista frontal', isHero: true },
        { url: '/vehicles/byd-seagull/interior.jpg', alt: 'Interior BYD Seagull', isHero: false },
        { url: '/vehicles/byd-seagull/side.jpg', alt: 'BYD Seagull vista lateral', isHero: false },
      ],
      heroIndex: 0
    }
  },
  {
    id: uuid('vehicle', 'byd-dolphin-2024'),
    slug: generateVehicleSlug('BYD', 'Dolphin', 2024, 'Comfort'),
    brand: 'BYD',
    model: 'Dolphin',
    year: 2024,
    variant: 'Comfort',
    badges: ['Mejor Valor'],
    description: 'BYD Dolphin combina estilo, espacio y eficiencia. Ideal para familias que buscan un vehículo eléctrico confiable.',
    descriptionI18n: {
      en: 'BYD Dolphin combines style, space, and efficiency. Ideal for families looking for a reliable electric vehicle.'
    },
    variantI18n: {
      en: 'Comfort'
    },
    isPublished: true,
    specs: {
      torque: { nm: 180, lbft: 133 },
      dimensions: {
        length: 4290,
        width: 1770,
        height: 1570,
        wheelbase: 2700
      },
      features: ['Pantalla Táctil 12.8"', 'Cámara 360°', 'Techo Panorámico'],
      warranty: {
        vehicle: '6 años / 150,000 km',
        battery: '8 años / 150,000 km'
      },
      charging: {
        ac: { kW: 7, time: '7 horas' },
        dc: { kW: 60, time: '30 min a 80%' }
      }
    },
    media: {
      images: [
        { url: '/vehicles/byd-dolphin/hero.jpg', alt: 'BYD Dolphin vista frontal', isHero: true },
        { url: '/vehicles/byd-dolphin/interior.jpg', alt: 'Interior BYD Dolphin', isHero: false },
      ],
      heroIndex: 0
    }
  },
  {
    id: uuid('vehicle', 'byd-seal-2024'),
    slug: generateVehicleSlug('BYD', 'Seal', 2024, 'Premium'),
    brand: 'BYD',
    model: 'Seal',
    year: 2024,
    variant: 'Premium',
    badges: ['Mejor Calificado', 'Premium'],
    description: 'BYD Seal es el sedán eléctrico premium que redefine el lujo sostenible. Rendimiento excepcional y tecnología avanzada.',
    descriptionI18n: {
      en: 'BYD Seal is the premium electric sedan that redefines sustainable luxury. Exceptional performance and advanced technology.'
    },
    variantI18n: {
      en: 'Premium'
    },
    isPublished: true,
    specs: {
      torque: { nm: 360, lbft: 266 },
      dimensions: {
        length: 4800,
        width: 1875,
        height: 1460,
        wheelbase: 2920
      },
      features: ['Asientos Ventilados', 'Sistema de Sonido Premium', 'Piloto Automático', 'Suspensión Adaptativa'],
      warranty: {
        vehicle: '6 años / 150,000 km',
        battery: '8 años / 150,000 km'
      },
      charging: {
        ac: { kW: 11, time: '8 horas' },
        dc: { kW: 150, time: '30 min a 80%' }
      }
    },
    media: {
      images: [
        { url: '/vehicles/byd-seal/hero.jpg', alt: 'BYD Seal vista frontal', isHero: true },
        { url: '/vehicles/byd-seal/interior.jpg', alt: 'Interior BYD Seal', isHero: false },
        { url: '/vehicles/byd-seal/rear.jpg', alt: 'BYD Seal vista trasera', isHero: false },
      ],
      heroIndex: 0
    }
  },

  // Tesla Vehicles
  {
    id: uuid('vehicle', 'tesla-model-3-2024'),
    slug: generateVehicleSlug('Tesla', 'Model 3', 2024, 'Long Range'),
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    variant: 'Long Range',
    badges: ['Más Vendido', 'Autopilot'],
    description: 'Tesla Model 3 Long Range ofrece autonomía excepcional y tecnología líder. El sedán eléctrico más popular del mundo.',
    descriptionI18n: {
      en: 'Tesla Model 3 Long Range offers exceptional range and leading technology. The world\'s most popular electric sedan.'
    },
    variantI18n: {
      en: 'Long Range'
    },
    isPublished: true,
    specs: {
      torque: { nm: 493, lbft: 364 },
      dimensions: {
        length: 4694,
        width: 1849,
        height: 1443,
        wheelbase: 2875
      },
      features: ['Autopilot', 'Pantalla Táctil 15"', 'Techo de Vidrio', 'Actualización OTA'],
      warranty: {
        vehicle: '4 años / 80,000 km',
        battery: '8 años / 192,000 km'
      },
      charging: {
        ac: { kW: 11, time: '8-10 horas' },
        dc: { kW: 250, time: '20 min a 80%' }
      }
    },
    media: {
      images: [
        { url: '/vehicles/tesla-model3/hero.jpg', alt: 'Tesla Model 3 vista frontal', isHero: true },
        { url: '/vehicles/tesla-model3/interior.jpg', alt: 'Interior Tesla Model 3', isHero: false },
        { url: '/vehicles/tesla-model3/charging.jpg', alt: 'Tesla Model 3 cargando', isHero: false },
      ],
      heroIndex: 0
    }
  },
  {
    id: uuid('vehicle', 'tesla-model-y-2024'),
    slug: generateVehicleSlug('Tesla', 'Model Y', 2024, 'Long Range'),
    brand: 'Tesla',
    model: 'Model Y',
    year: 2024,
    variant: 'Long Range',
    badges: ['SUV Eléctrico', 'Más Espacioso'],
    description: 'Tesla Model Y es el SUV eléctrico que combina espacio, seguridad y rendimiento. Perfecto para familias activas.',
    descriptionI18n: {
      en: 'Tesla Model Y is the electric SUV that combines space, safety, and performance. Perfect for active families.'
    },
    variantI18n: {
      en: 'Long Range'
    },
    isPublished: true,
    specs: {
      torque: { nm: 493, lbft: 364 },
      dimensions: {
        length: 4751,
        width: 1921,
        height: 1624,
        wheelbase: 2890
      },
      features: ['Autopilot', '7 Asientos Opcionales', 'Techo Panorámico', 'Maletero Eléctrico'],
      warranty: {
        vehicle: '4 años / 80,000 km',
        battery: '8 años / 192,000 km'
      },
      charging: {
        ac: { kW: 11, time: '10 horas' },
        dc: { kW: 250, time: '25 min a 80%' }
      }
    },
    media: {
      images: [
        { url: '/vehicles/tesla-modely/hero.jpg', alt: 'Tesla Model Y vista frontal', isHero: true },
        { url: '/vehicles/tesla-modely/interior.jpg', alt: 'Interior Tesla Model Y', isHero: false },
      ],
      heroIndex: 0
    }
  },
  {
    id: uuid('vehicle', 'tesla-model-s-2024'),
    slug: generateVehicleSlug('Tesla', 'Model S', 2024, 'Plaid'),
    brand: 'Tesla',
    model: 'Model S',
    year: 2024,
    variant: 'Plaid',
    badges: ['Máximo Rendimiento', 'Lujo Premium'],
    description: 'Tesla Model S Plaid es el sedán eléctrico más rápido del mundo. Lujo, tecnología y rendimiento sin compromiso.',
    descriptionI18n: {
      en: 'Tesla Model S Plaid is the world\'s fastest electric sedan. Luxury, technology, and uncompromising performance.'
    },
    variantI18n: {
      en: 'Plaid'
    },
    isPublished: true,
    specs: {
      torque: { nm: 1420, lbft: 1047 },
      dimensions: {
        length: 5021,
        width: 1987,
        height: 1431,
        wheelbase: 2960
      },
      features: ['Tri-Motor AWD', 'Pantalla 17" + 8" Trasera', 'Volante Yoke', 'Modo Plaid'],
      warranty: {
        vehicle: '4 años / 80,000 km',
        battery: '8 años / 240,000 km'
      },
      charging: {
        ac: { kW: 11, time: '12 horas' },
        dc: { kW: 250, time: '30 min a 80%' }
      }
    },
    media: {
      images: [
        { url: '/vehicles/tesla-models/hero.jpg', alt: 'Tesla Model S Plaid vista frontal', isHero: true },
        { url: '/vehicles/tesla-models/interior.jpg', alt: 'Interior Tesla Model S', isHero: false },
        { url: '/vehicles/tesla-models/rear.jpg', alt: 'Tesla Model S vista trasera', isHero: false },
      ],
      heroIndex: 0
    }
  }
]

// Vehicle specifications
const vehicleSpecifications = [
  // BYD Seagull
  {
    vehicleId: uuid('vehicle', 'byd-seagull-2025'),
    rangeKmCltc: 305,
    rangeKmWltp: 280,
    batteryKwh: '30.1',
    acceleration0100Sec: '10.9',
    topSpeedKmh: 130,
    powerKw: 55,
    powerHp: 75,
    chargingDcKw: 40,
    chargingTimeDcMin: 30,
    seats: 4,
    weightKg: 1240,
    bodyType: 'CITY' as const,
  },
  // BYD Dolphin
  {
    vehicleId: uuid('vehicle', 'byd-dolphin-2024'),
    rangeKmCltc: 427,
    rangeKmWltp: 380,
    batteryKwh: '44.9',
    acceleration0100Sec: '10.5',
    topSpeedKmh: 150,
    powerKw: 70,
    powerHp: 95,
    chargingDcKw: 60,
    chargingTimeDcMin: 30,
    seats: 5,
    weightKg: 1405,
    bodyType: 'CITY' as const,
  },
  // BYD Seal
  {
    vehicleId: uuid('vehicle', 'byd-seal-2024'),
    rangeKmCltc: 650,
    rangeKmWltp: 570,
    rangeKmEpa: 520,
    batteryKwh: '82.5',
    acceleration0100Sec: '3.8',
    topSpeedKmh: 180,
    powerKw: 390,
    powerHp: 530,
    chargingDcKw: 150,
    chargingTimeDcMin: 30,
    seats: 5,
    weightKg: 2150,
    bodyType: 'SEDAN' as const,
  },
  // Tesla Model 3
  {
    vehicleId: uuid('vehicle', 'tesla-model-3-2024'),
    rangeKmCltc: 678,
    rangeKmWltp: 629,
    rangeKmEpa: 568,
    batteryKwh: '75.0',
    acceleration0100Sec: '4.4',
    topSpeedKmh: 201,
    powerKw: 340,
    powerHp: 462,
    chargingDcKw: 250,
    chargingTimeDcMin: 20,
    seats: 5,
    weightKg: 1844,
    bodyType: 'SEDAN' as const,
  },
  // Tesla Model Y
  {
    vehicleId: uuid('vehicle', 'tesla-model-y-2024'),
    rangeKmCltc: 565,
    rangeKmWltp: 533,
    rangeKmEpa: 507,
    batteryKwh: '75.0',
    acceleration0100Sec: '5.0',
    topSpeedKmh: 217,
    powerKw: 340,
    powerHp: 462,
    chargingDcKw: 250,
    chargingTimeDcMin: 25,
    seats: 5,
    weightKg: 1979,
    bodyType: 'SUV' as const,
  },
  // Tesla Model S
  {
    vehicleId: uuid('vehicle', 'tesla-model-s-2024'),
    rangeKmCltc: 637,
    rangeKmWltp: 600,
    rangeKmEpa: 576,
    batteryKwh: '100.0',
    acceleration0100Sec: '2.1',
    topSpeedKmh: 322,
    powerKw: 750,
    powerHp: 1020,
    chargingDcKw: 250,
    chargingTimeDcMin: 30,
    seats: 5,
    weightKg: 2265,
    bodyType: 'SEDAN' as const,
  }
]

// Vehicle Images
const vehicleImages: any[] = []
vehicles.forEach((vehicle) => {
  const rawImages = Array.isArray((vehicle as any)?.media?.images)
    ? (vehicle as any).media.images
    : []

  const heroIndex = typeof (vehicle as any)?.media?.heroIndex === 'number'
    ? (vehicle as any).media.heroIndex
    : 0

  const candidateImages = rawImages.length > 0
    ? rawImages
    : [{ url: PLACEHOLDER_IMAGE, alt: `${vehicle.brand} ${vehicle.model}`, isHero: true }]

  const sanitizedImages = candidateImages.map((img: any, index: number) => {
    const storagePath = img?.url || PLACEHOLDER_IMAGE
    const altText = img?.alt || `${vehicle.brand} ${vehicle.model}`
    const isHero = index === heroIndex || Boolean(img?.isHero)

    vehicleImages.push({
      id: uuid('image', `${vehicle.slug}-${index}`),
      vehicleId: vehicle.id,
      storagePath,
      displayOrder: index,
      isHero,
      altText,
    })

    return {
      ...img,
      url: storagePath,
      alt: altText,
      isHero,
    }
  })

  ;(vehicle as any).media = {
    ...(vehicle as any).media,
    images: sanitizedImages,
    heroIndex: sanitizedImages.findIndex((img: any) => img.isHero) ?? 0,
  }
})

// Vehicle Pricing
const vehiclePricing = [
  // BYD Seagull pricing
  {
    id: uuid('pricing', 'byd-seagull-byd-cr'),
    vehicleId: uuid('vehicle', 'byd-seagull-2025'),
    organizationId: uuid('org', 'byd-costa-rica'),
    amount: '21990.00',
    currency: 'USD',
    availability: {
      label: 'En Stock',
      tone: 'success',
      estimatedDeliveryDays: 15
    },
    financing: {
      downPayment: 4398,
      monthlyPayment: 350,
      termMonths: 60,
      aprPercent: 9.5,
      displayCurrency: 'USD'
    },
    cta: {
      label: 'Contactar Agencia',
      href: 'https://wa.me/50688889999?text=Interesado%20en%20BYD%20Seagull'
    },
    perks: ['Garantía de Fábrica 6 años', 'Mantenimiento Gratis 1 año', 'Cargador Incluido'],
    emphasis: 'teal-glow',
    displayOrder: 1,
    isActive: true,
  },
  // BYD Dolphin pricing
  {
    id: uuid('pricing', 'byd-dolphin-byd-cr'),
    vehicleId: uuid('vehicle', 'byd-dolphin-2024'),
    organizationId: uuid('org', 'byd-costa-rica'),
    amount: '32990.00',
    currency: 'USD',
    availability: {
      label: 'Disponible',
      tone: 'success'
    },
    financing: {
      downPayment: 6598,
      monthlyPayment: 520,
      termMonths: 60,
      aprPercent: 9.5,
      displayCurrency: 'USD'
    },
    cta: {
      label: 'Contactar Agencia',
      href: 'https://wa.me/50688889999?text=Interesado%20en%20BYD%20Dolphin'
    },
    perks: ['Garantía 6 años', 'Servicio Incluido', 'Cargador de Regalo'],
    emphasis: 'none',
    displayOrder: 1,
    isActive: true,
  },
  // BYD Seal pricing
  {
    id: uuid('pricing', 'byd-seal-byd-cr'),
    vehicleId: uuid('vehicle', 'byd-seal-2024'),
    organizationId: uuid('org', 'byd-costa-rica'),
    amount: '52990.00',
    currency: 'USD',
    availability: {
      label: 'Pre-Orden',
      tone: 'info'
    },
    financing: {
      downPayment: 10598,
      monthlyPayment: 850,
      termMonths: 60,
      aprPercent: 8.99,
      displayCurrency: 'USD'
    },
    cta: {
      label: 'Reservar Ahora',
      href: 'https://wa.me/50688889999?text=Interesado%20en%20BYD%20Seal'
    },
    perks: ['Garantía Premium 6 años', 'Mantenimiento VIP', 'Wallbox Incluido'],
    emphasis: 'teal-border',
    displayOrder: 1,
    isActive: true,
  },
  // Tesla Model 3 pricing
  {
    id: uuid('pricing', 'tesla-model3-tesla-cr'),
    vehicleId: uuid('vehicle', 'tesla-model-3-2024'),
    organizationId: uuid('org', 'tesla-costa-rica'),
    amount: '47490.00',
    currency: 'USD',
    availability: {
      label: 'En Stock',
      tone: 'success'
    },
    financing: {
      downPayment: 9498,
      monthlyPayment: 750,
      termMonths: 60,
      aprPercent: 8.5,
      displayCurrency: 'USD'
    },
    cta: {
      label: 'Agendar Test Drive',
      href: 'https://wa.me/50687008700?text=Interesado%20en%20Tesla%20Model%203'
    },
    perks: ['Supercharger Gratis 1 año', 'Seguro Incluido 3 meses', 'FSD Trial'],
    emphasis: 'teal-glow',
    displayOrder: 1,
    isActive: true,
  },
  // Tesla Model Y pricing
  {
    id: uuid('pricing', 'tesla-modely-tesla-cr'),
    vehicleId: uuid('vehicle', 'tesla-model-y-2024'),
    organizationId: uuid('org', 'tesla-costa-rica'),
    amount: '52490.00',
    currency: 'USD',
    availability: {
      label: 'Disponible',
      tone: 'success'
    },
    financing: {
      downPayment: 10498,
      monthlyPayment: 850,
      termMonths: 60,
      aprPercent: 8.5,
      displayCurrency: 'USD'
    },
    cta: {
      label: 'Agendar Test Drive',
      href: 'https://wa.me/50687008700?text=Interesado%20en%20Tesla%20Model%20Y'
    },
    perks: ['Supercharger Gratis 1 año', '7 Asientos Disponibles', 'Carga Gratis 6 meses'],
    emphasis: 'none',
    displayOrder: 1,
    isActive: true,
  },
  // Tesla Model S pricing
  {
    id: uuid('pricing', 'tesla-models-tesla-cr'),
    vehicleId: uuid('vehicle', 'tesla-model-s-2024'),
    organizationId: uuid('org', 'tesla-costa-rica'),
    amount: '108490.00',
    currency: 'USD',
    availability: {
      label: 'Orden Especial',
      tone: 'warning'
    },
    financing: {
      downPayment: 21698,
      monthlyPayment: 1750,
      termMonths: 60,
      aprPercent: 7.99,
      displayCurrency: 'USD'
    },
    cta: {
      label: 'Consultar Disponibilidad',
      href: 'https://wa.me/50687008700?text=Interesado%20en%20Tesla%20Model%20S%20Plaid'
    },
    perks: ['Supercharger Ilimitado 2 años', 'Servicio Premium', 'Full Self-Driving Incluido'],
    emphasis: 'teal-border',
    displayOrder: 1,
    isActive: true,
  }
]

async function main() {
  console.log('🌱 Starting Phase 1 vehicle seeding...')

  try {
    // Seed Organizations
    console.log('\n📦 Seeding organizations...')
    for (const org of organizations) {
      await db.insert(schema.organizations)
        .values(org)
        .onConflictDoNothing()
      console.log(`  ✅ ${org.name}`)
    }

    // Seed Banks
    console.log('\n🏦 Seeding banks...')
    for (const bank of banks) {
      await db.insert(schema.banks)
        .values(bank)
        .onConflictDoNothing()
      console.log(`  ✅ ${bank.name}`)
    }

    // Seed Vehicles
    console.log('\n🚗 Seeding vehicles...')
    for (const vehicle of vehicles) {
      await db.insert(schema.vehicles)
        .values(vehicle)
        .onConflictDoNothing()
      console.log(`  ✅ ${vehicle.brand} ${vehicle.model} ${vehicle.year} ${vehicle.variant || ''}`)
    }

    // Seed Vehicle Specifications
    console.log('\n📊 Seeding vehicle specifications...')
    for (const spec of vehicleSpecifications) {
      await db.insert(schema.vehicleSpecifications)
        .values(spec)
        .onConflictDoNothing()
      const vehicle = vehicles.find(v => v.id === spec.vehicleId)
      if (vehicle) {
        console.log(`  ✅ Specs for ${vehicle.brand} ${vehicle.model}`)
      }
    }

    // Seed Vehicle Images
    console.log('\n🖼️  Seeding vehicle images...')
    for (const image of vehicleImages) {
      await db.insert(schema.vehicleImages)
        .values(image)
        .onConflictDoNothing()
    }
    console.log(`  ✅ ${vehicleImages.length} images seeded`)

    // Seed Vehicle Pricing
    console.log('\n💰 Seeding vehicle pricing...')
    for (const pricing of vehiclePricing) {
      await db.insert(schema.vehiclePricing)
        .values(pricing)
        .onConflictDoNothing()
      const vehicle = vehicles.find(v => v.id === pricing.vehicleId)
      const org = organizations.find(o => o.id === pricing.organizationId)
      if (vehicle && org) {
        console.log(`  ✅ ${vehicle.brand} ${vehicle.model} @ ${org.name}`)
      }
    }

    console.log('\n✨ Phase 1 seeding completed successfully!')
    console.log('\n📈 Summary:')
    console.log(`  - ${organizations.length} organizations`)
    console.log(`  - ${banks.length} banks`)
    console.log(`  - ${vehicles.length} vehicles`)
    console.log(`  - ${vehicleSpecifications.length} vehicle specifications`)
    console.log(`  - ${vehicleImages.length} vehicle images`)
    console.log(`  - ${vehiclePricing.length} pricing entries`)

  } catch (error) {
    console.error('\n❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await sqlClient.end()
  }
}

// Run the seeding
main()
