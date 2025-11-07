import { describe, expect, test } from "bun:test"

import {
  getVehicleBySlug,
  getVehiclePricing,
} from "@/lib/db/queries/vehicles"
import type { db as DbInstance } from "@/lib/db/client"

type DbClient = typeof DbInstance

type SelectResponse = any

type MockDb = {
  select: (columns?: unknown) => MockQueryBuilder
}

type MockQueryBuilder = {
  from: (...args: any[]) => MockQueryBuilder
  where: (...args: any[]) => MockQueryBuilder
  limit: (...args: any[]) => MockQueryBuilder
  orderBy: (...args: any[]) => MockQueryBuilder
  innerJoin: (...args: any[]) => MockQueryBuilder
  leftJoin: (...args: any[]) => MockQueryBuilder
  as: (...args: any[]) => MockQueryBuilder
  then: (
    onFulfilled: (value: SelectResponse) => void,
    onRejected?: (reason?: unknown) => void
  ) => Promise<void>
}

function createQueryBuilder(result: SelectResponse): MockQueryBuilder {
  return {
    from() {
      return this
    },
    where() {
      return this
    },
    limit() {
      return this
    },
    orderBy() {
      return this
    },
    innerJoin() {
      return this
    },
    leftJoin() {
      return this
    },
    as() {
      return this
    },
    then(onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected)
    },
  }
}

function createDbMock(responses: SelectResponse[]): MockDb {
  let callIndex = 0

  return {
    select() {
      const response =
        callIndex < responses.length ? responses[callIndex++] : []
      return createQueryBuilder(response)
    },
  }
}

const storageStub = {
  getPublicImageUrls: async (paths: string[]) =>
    paths.map((path) =>
      path ? `https://cdn.example.com/${path.replace(/\//g, "-")}` : ""
    ),
}

const baseVehicle = {
  id: "v1",
  slug: "byd-seagull-2025",
  brand: "BYD",
  model: "Seagull",
  year: 2025,
  variant: "Freedom",
  description: "Test",
  specs: {},
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const specs = {
  vehicleId: "v1",
  rangeKmCltc: 300,
  seats: 4,
  batteryKwh: "40",
}

const images = [
  {
    id: "img1",
    vehicleId: "v1",
    storagePath: "vehicles/byd/hero.jpg",
    altText: "hero",
    caption: null,
    displayOrder: 0,
    isHero: true,
  },
  {
    id: "img2",
    vehicleId: "v1",
    storagePath: "vehicles/byd/side.jpg",
    altText: "side",
    caption: null,
    displayOrder: 1,
    isHero: false,
  },
]

const activePricing = {
  id: "p1",
  vehicleId: "v1",
  amount: "35000.00",
  currency: "USD",
  availability: { label: "In stock" },
  financing: null,
  cta: null,
  perks: [],
  emphasis: "none",
  displayOrder: 0,
  isActive: true,
  organization: {
    id: "org1",
    slug: "dealer-active",
    name: "Active Dealer",
    type: "DEALER",
    logoUrl: null,
    contact: {},
    official: true,
    badges: [],
    isActive: true,
  },
}

const inactivePricing = {
  ...activePricing,
  id: "p2",
  amount: "34000.00",
  isActive: false,
}

const inactiveOrgPricing = {
  ...activePricing,
  id: "p3",
  organization: {
    ...activePricing.organization,
    id: "org2",
    isActive: false,
  },
}

describe("getVehicleBySlug", () => {
  test("returns null when vehicle not found", async () => {
    const dbClient = createDbMock([[]]) as unknown as DbClient

    const result = await getVehicleBySlug("missing", { dbClient })

    expect(result).toBeNull()
  })

  test("returns null when vehicle is unpublished", async () => {
    const dbClient = createDbMock([
      [{ ...baseVehicle, isPublished: false }],
    ]) as unknown as DbClient

    const result = await getVehicleBySlug("hidden", { dbClient })

    expect(result).toBeNull()
  })

  test("filters inactive pricing and converts URLs", async () => {
    const dbClient = createDbMock([
      [baseVehicle],
      [specs],
      images,
      [activePricing, inactivePricing, inactiveOrgPricing],
    ]) as unknown as DbClient

    const result = await getVehicleBySlug("byd-seagull-2025", {
      dbClient,
      storage: storageStub,
    })

    expect(result).not.toBeNull()
    expect(result?.pricing).toHaveLength(1)
    expect(result?.pricing[0].amount).toBe(35000)
    expect(result?.media.images.every((img) => img.url.startsWith("https://"))).toBe(
      true
    )
    expect(result?.media.images[0].isHero).toBe(true)
  })
})

describe("getVehiclePricing", () => {
  test("filters inactive pricing rows", async () => {
    const dbClient = createDbMock([[activePricing, inactivePricing, inactiveOrgPricing]]) as unknown as DbClient

    const result = await getVehiclePricing("v1", { dbClient })

    expect(result).toHaveLength(1)
    expect(result[0].amount).toBe(35000)
    expect(result[0].organization.id).toBe("org1")
  })
})
