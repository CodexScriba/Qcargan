import { describe, expect, it, expectTypeOf } from 'vitest'
import { InferSelectModel } from 'drizzle-orm'

import {
  vehicles,
  vehicleSpecifications,
  VehicleSpecs,
  LocalizedText
} from '../schema/vehicles'

describe('Database Schema', () => {
  it('exports vehicles schema tables', () => {
    expect(vehicles).toBeDefined()
    expect(vehicleSpecifications).toBeDefined()
  })

  it('infers vehicles select types', () => {
    type Vehicle = InferSelectModel<typeof vehicles>

    expectTypeOf<Vehicle['id']>().toEqualTypeOf<string>()
    expectTypeOf<Vehicle['slug']>().toEqualTypeOf<string>()
    expectTypeOf<Vehicle['variant']>().toEqualTypeOf<string | null>()
    expectTypeOf<Vehicle['specs']>().toEqualTypeOf<VehicleSpecs>()
    expectTypeOf<Vehicle['descriptionI18n']>().toEqualTypeOf<LocalizedText | null>()
  })

  it('infers vehicle specifications select types', () => {
    type VehicleSpecification = InferSelectModel<typeof vehicleSpecifications>

    expectTypeOf<VehicleSpecification['vehicleId']>().toEqualTypeOf<string>()
    expectTypeOf<VehicleSpecification['batteryKwh']>().toEqualTypeOf<number | null>()
    expectTypeOf<VehicleSpecification['bodyType']>().toEqualTypeOf<
      'SEDAN' | 'CITY' | 'SUV' | 'PICKUP_VAN'
    >()
  })
})
