import { db } from '../lib/db/client'
import { vehicles } from '../lib/db/schema/vehicles'
import { eq } from 'drizzle-orm'

const allVehicles = await db
  .select({
    id: vehicles.id,
    slug: vehicles.slug,
    brand: vehicles.brand,
    model: vehicles.model,
    year: vehicles.year,
    variant: vehicles.variant,
    isPublished: vehicles.isPublished,
  })
  .from(vehicles)
  .where(eq(vehicles.isPublished, true))
  .limit(5)

console.log(`Found ${allVehicles.length} published vehicles\n`)

allVehicles.forEach((vehicle, index) => {
  console.log(`${index + 1}. ${vehicle.year} ${vehicle.brand} ${vehicle.model}${vehicle.variant ? ` ${vehicle.variant}` : ''}`)
  console.log(`   Slug: /vehiculos/${vehicle.slug}`)
  console.log('')
})
