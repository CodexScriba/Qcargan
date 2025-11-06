import { asc, eq } from "drizzle-orm"
import { db } from "@/lib/db/client"
import { vehicleImages, vehicles } from "@/lib/db/schema"

export type VehicleWithImages = Awaited<ReturnType<typeof getVehicleBySlug>>

export type VehicleImageSummary = {
  id: string
  storagePath: string
  altText: string | null
  caption: string | null
  displayOrder: number
  isHero: boolean
}

export async function getVehicleBySlug(slug: string) {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.slug, slug))
    .limit(1)

  if (!vehicle) return null

  const images = await db
    .select({
      id: vehicleImages.id,
      storagePath: vehicleImages.storagePath,
      altText: vehicleImages.altText,
      caption: vehicleImages.caption,
      displayOrder: vehicleImages.displayOrder,
      isHero: vehicleImages.isHero,
    })
    .from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, vehicle.id))
    .orderBy(asc(vehicleImages.displayOrder))

  return {
    ...vehicle,
    images,
  }
}
