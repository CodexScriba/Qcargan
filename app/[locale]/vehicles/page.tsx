import { getTranslations } from "next-intl/server"
import { getVehicles, getAvailableBrands } from "@/lib/db/queries/vehicles"
import { Link } from "@/i18n/routing"
import Image from "next/image"

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ brand?: string; bodyType?: string; priceMin?: string; priceMax?: string }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params, searchParams }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'vehicle' })

  const title = locale === 'es'
    ? 'Vehículos Eléctricos en Costa Rica | QuéCargan'
    : 'Electric Vehicles in Costa Rica | QuéCargan'

  const description = locale === 'es'
    ? 'Explora nuestra selección de vehículos eléctricos. Compara precios, especificaciones y encuentra el EV perfecto para ti.'
    : 'Explore our selection of electric vehicles. Compare prices, specifications and find the perfect EV for you.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website' as const,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
    }
  }
}

export default async function VehiclesPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const filters = await searchParams
  const t = await getTranslations({ locale, namespace: 'vehicle' })

  // Build filters object
  const vehicleFilters = {
    brand: filters.brand,
    bodyType: filters.bodyType,
    priceMin: filters.priceMin ? parseFloat(filters.priceMin) : undefined,
    priceMax: filters.priceMax ? parseFloat(filters.priceMax) : undefined,
  }

  // Fetch vehicles and brands in parallel
  const [vehicles, brands] = await Promise.all([
    getVehicles(vehicleFilters),
    getAvailableBrands()
  ])

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {vehicles.length} {vehicles.length === 1 ? 'vehículo encontrado' : 'vehículos encontrados'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        {/* All Vehicles */}
        <Link
          href="/vehicles"
          className={`px-4 py-2 rounded-lg border transition-colors ${
            !filters.brand && !filters.bodyType
              ? 'bg-primary text-primary-foreground'
              : 'bg-card hover:bg-muted'
          }`}
        >
          {t('filters.all')}
        </Link>

        {/* Brand Filters */}
        {brands.map((brand) => (
          <Link
            key={brand}
            href={`/vehicles?brand=${encodeURIComponent(brand)}`}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filters.brand === brand
                ? 'bg-primary text-primary-foreground'
                : 'bg-card hover:bg-muted'
            }`}
          >
            {brand}
          </Link>
        ))}

        {/* Body Type Filters */}
        {(['SEDAN', 'CITY', 'SUV', 'PICKUP_VAN'] as const).map((type) => (
          <Link
            key={type}
            href={`/vehicles?bodyType=${type}`}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filters.bodyType === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-card hover:bg-muted'
            }`}
          >
            {t(`bodyType.${type}`)}
          </Link>
        ))}
      </div>

      {/* Vehicle Grid */}
      {vehicles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {locale === 'es'
              ? 'No se encontraron vehículos con estos filtros.'
              : 'No vehicles found with these filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(({ vehicle, specifications, pricing }) => {
            // Get first image
            const heroImage = (vehicle.media as any)?.images?.[0]?.url || '/placeholder-car.jpg'
            const minPrice = pricing.minPrice ? parseFloat(pricing.minPrice) : null

            return (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.slug}`}
                className="group block rounded-xl overflow-hidden bg-card border hover:border-primary transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <Image
                    src={heroImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Badges */}
                  {vehicle.badges && vehicle.badges.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {vehicle.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    {vehicle.variant && (
                      <p className="text-sm text-muted-foreground">{vehicle.variant} • {vehicle.year}</p>
                    )}
                  </div>

                  {/* Specs */}
                  {specifications && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {specifications.rangeKmCltc && (
                        <span>{specifications.rangeKmCltc} km</span>
                      )}
                      {specifications.batteryKwh && (
                        <span>{specifications.batteryKwh} kWh</span>
                      )}
                      {specifications.seats && (
                        <span>{specifications.seats} {t('specs.seats').toLowerCase()}</span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  {minPrice && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">{t('pricing.from')}</p>
                      <p className="text-2xl font-bold">
                        ${minPrice.toLocaleString()}
                      </p>
                      {pricing.sellerCount > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {pricing.sellerCount} {locale === 'es' ? 'vendedores' : 'sellers'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
