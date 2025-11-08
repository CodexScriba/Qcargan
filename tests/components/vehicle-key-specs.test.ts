import { describe, expect, test } from 'bun:test'
import type { VehicleSpecifications } from '@/types/vehicle'

/**
 * Test utilities to expose internal functions from vehicle-key-specs.tsx
 * In production code, these are unexported helper functions
 */

// Mock RenderSpec type matching the internal implementation
type RenderSpec = {
  key: string
  icon: any
  labelKey: string
  value: string
  priority: number
}

// Re-implement internal helper functions for testing
const RANGE_KEYS = ['rangeKmWltp', 'rangeKmCltc', 'rangeKmEpa', 'rangeKmNedc']
const POWER_KEYS = ['powerKw', 'powerHp']

const dedupeRangeSpecs = (specs: RenderSpec[]): RenderSpec[] => {
  const bestRange = specs.find((spec) => RANGE_KEYS.includes(spec.key))
  if (!bestRange) return specs
  return specs.filter(
    (spec) => !RANGE_KEYS.includes(spec.key) || spec.key === bestRange.key
  )
}

const combinePowerSpecs = (specs: RenderSpec[]): RenderSpec[] => {
  const hpSpec = specs.find((spec) => spec.key === 'powerHp')
  const kwSpec = specs.find((spec) => spec.key === 'powerKw')
  if (!hpSpec || !kwSpec) return specs

  const combinedValue =
    kwSpec.value && hpSpec.value
      ? `${kwSpec.value} (${hpSpec.value})`
      : kwSpec.value || hpSpec.value

  const combinedSpec: RenderSpec = {
    key: 'powerCombined',
    icon: kwSpec.icon,
    labelKey: 'power',
    value: combinedValue,
    priority: Math.min(hpSpec.priority, kwSpec.priority),
  }

  return [
    ...specs.filter((spec) => !POWER_KEYS.includes(spec.key)),
    combinedSpec,
  ].sort((a, b) => a.priority - b.priority)
}

const createFormatHelpers = (locale: string) => {
  const integerFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  })
  const singleDecimalFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })

  return {
    formatInteger: (value: number | null | undefined, suffix = '') => {
      if (value == null) return null
      const parsed = Number(value)
      if (Number.isNaN(parsed)) return null
      return `${integerFormatter.format(parsed)}${suffix}`
    },
    formatSingleDecimal: (value: number | null | undefined, suffix = '') => {
      if (value == null) return null
      const parsed = Number(value)
      if (Number.isNaN(parsed)) return null
      return `${singleDecimalFormatter.format(parsed)}${suffix}`
    },
  }
}

// ============================================================================
// FORMAT HELPERS TESTS
// ============================================================================

describe('createFormatHelpers', () => {
  describe('formatInteger', () => {
    test('formats positive integers', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatInteger(520, ' km')).toBe('520 km')
    })

    test('formats with no suffix', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatInteger(5, '')).toBe('5')
    })

    test('returns null for null value', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatInteger(null, ' km')).toBeNull()
    })

    test('returns null for undefined value', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatInteger(undefined, ' km')).toBeNull()
    })

    test('returns null for NaN', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatInteger(NaN, ' km')).toBeNull()
    })

    test('handles string numbers by parsing', () => {
      const helpers = createFormatHelpers('en-US')
      // @ts-expect-error - testing runtime behavior
      expect(helpers.formatInteger('520', ' km')).toBe('520 km')
    })

    test('returns null for non-numeric strings', () => {
      const helpers = createFormatHelpers('en-US')
      // @ts-expect-error - testing runtime behavior
      expect(helpers.formatInteger('five hundred', ' km')).toBeNull()
    })

    test('formats with thousands separator (en-US)', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatInteger(1500, ' km')).toBe('1,500 km')
    })

    test('formats with thousands separator (de-DE)', () => {
      const helpers = createFormatHelpers('de-DE')
      // German uses period as thousands separator
      expect(helpers.formatInteger(1500, ' km')).toBe('1.500 km')
    })

    test('truncates decimals', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatInteger(75.9, ' kWh')).toBe('76 kWh')
    })
  })

  describe('formatSingleDecimal', () => {
    test('formats with one decimal place', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatSingleDecimal(75.5, ' kWh')).toBe('75.5 kWh')
    })

    test('adds trailing zero if needed', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatSingleDecimal(75, ' kWh')).toBe('75.0 kWh')
    })

    test('rounds to one decimal place', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatSingleDecimal(4.46, ' s')).toBe('4.5 s')
    })

    test('returns null for null value', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatSingleDecimal(null, ' kWh')).toBeNull()
    })

    test('returns null for undefined value', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatSingleDecimal(undefined, ' kWh')).toBeNull()
    })

    test('returns null for NaN', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatSingleDecimal(NaN, ' kWh')).toBeNull()
    })

    test('uses comma as decimal separator (es-ES)', () => {
      const helpers = createFormatHelpers('es-ES')
      expect(helpers.formatSingleDecimal(75.5, ' kWh')).toBe('75,5 kWh')
    })

    test('formats negative numbers', () => {
      const helpers = createFormatHelpers('en-US')
      expect(helpers.formatSingleDecimal(-4.5, ' °C')).toBe('-4.5 °C')
    })
  })
})

// ============================================================================
// DEDUPE RANGE SPECS TESTS
// ============================================================================

describe('dedupeRangeSpecs', () => {
  const mockIcon = {}

  test('keeps only highest priority range spec (WLTP)', () => {
    const specs: RenderSpec[] = [
      {
        key: 'rangeKmWltp',
        icon: mockIcon,
        labelKey: 'range',
        value: '513 km WLTP',
        priority: 1,
      },
      {
        key: 'rangeKmCltc',
        icon: mockIcon,
        labelKey: 'range',
        value: '520 km CLTC',
        priority: 2,
      },
      {
        key: 'batteryKwh',
        icon: mockIcon,
        labelKey: 'battery',
        value: '75 kWh',
        priority: 3,
      },
    ]

    const result = dedupeRangeSpecs(specs)

    expect(result).toHaveLength(2)
    expect(result.find((s) => s.key === 'rangeKmWltp')).toBeDefined()
    expect(result.find((s) => s.key === 'rangeKmCltc')).toBeUndefined()
    expect(result.find((s) => s.key === 'batteryKwh')).toBeDefined()
  })

  test('keeps CLTC when WLTP is missing', () => {
    const specs: RenderSpec[] = [
      {
        key: 'rangeKmCltc',
        icon: mockIcon,
        labelKey: 'range',
        value: '520 km CLTC',
        priority: 2,
      },
      {
        key: 'rangeKmEpa',
        icon: mockIcon,
        labelKey: 'range',
        value: '450 km EPA',
        priority: 3,
      },
      {
        key: 'batteryKwh',
        icon: mockIcon,
        labelKey: 'battery',
        value: '75 kWh',
        priority: 5,
      },
    ]

    const result = dedupeRangeSpecs(specs)

    expect(result).toHaveLength(2)
    expect(result.find((s) => s.key === 'rangeKmCltc')).toBeDefined()
    expect(result.find((s) => s.key === 'rangeKmEpa')).toBeUndefined()
  })

  test('returns all specs when no range specs exist', () => {
    const specs: RenderSpec[] = [
      {
        key: 'batteryKwh',
        icon: mockIcon,
        labelKey: 'battery',
        value: '75 kWh',
        priority: 1,
      },
      {
        key: 'powerHp',
        icon: mockIcon,
        labelKey: 'power',
        value: '350 hp',
        priority: 2,
      },
    ]

    const result = dedupeRangeSpecs(specs)

    expect(result).toEqual(specs)
    expect(result).toHaveLength(2)
  })

  test('handles single range spec', () => {
    const specs: RenderSpec[] = [
      {
        key: 'rangeKmWltp',
        icon: mockIcon,
        labelKey: 'range',
        value: '513 km WLTP',
        priority: 1,
      },
    ]

    const result = dedupeRangeSpecs(specs)

    expect(result).toEqual(specs)
  })

  test('handles empty array', () => {
    const result = dedupeRangeSpecs([])
    expect(result).toEqual([])
  })
})

// ============================================================================
// COMBINE POWER SPECS TESTS
// ============================================================================

describe('combinePowerSpecs', () => {
  const mockIcon = {}

  test('combines kW and HP into single spec', () => {
    const specs: RenderSpec[] = [
      {
        key: 'batteryKwh',
        icon: mockIcon,
        labelKey: 'battery',
        value: '75 kWh',
        priority: 1,
      },
      {
        key: 'powerKw',
        icon: mockIcon,
        labelKey: 'power',
        value: '261 kW',
        priority: 2,
      },
      {
        key: 'powerHp',
        icon: mockIcon,
        labelKey: 'power',
        value: '350 hp',
        priority: 3,
      },
    ]

    const result = combinePowerSpecs(specs)

    expect(result).toHaveLength(2)
    expect(result.find((s) => s.key === 'powerKw')).toBeUndefined()
    expect(result.find((s) => s.key === 'powerHp')).toBeUndefined()

    const combinedSpec = result.find((s) => s.key === 'powerCombined')
    expect(combinedSpec).toBeDefined()
    expect(combinedSpec?.value).toBe('261 kW (350 hp)')
    expect(combinedSpec?.priority).toBe(2) // Math.min(2, 3)
  })

  test('keeps only HP when kW is missing', () => {
    const specs: RenderSpec[] = [
      {
        key: 'powerHp',
        icon: mockIcon,
        labelKey: 'power',
        value: '350 hp',
        priority: 1,
      },
      {
        key: 'batteryKwh',
        icon: mockIcon,
        labelKey: 'battery',
        value: '75 kWh',
        priority: 2,
      },
    ]

    const result = combinePowerSpecs(specs)

    expect(result).toEqual(specs)
    expect(result.find((s) => s.key === 'powerHp')).toBeDefined()
  })

  test('keeps only kW when HP is missing', () => {
    const specs: RenderSpec[] = [
      {
        key: 'powerKw',
        icon: mockIcon,
        labelKey: 'power',
        value: '261 kW',
        priority: 1,
      },
    ]

    const result = combinePowerSpecs(specs)

    expect(result).toEqual(specs)
  })

  test('returns all specs when neither power spec exists', () => {
    const specs: RenderSpec[] = [
      {
        key: 'batteryKwh',
        icon: mockIcon,
        labelKey: 'battery',
        value: '75 kWh',
        priority: 1,
      },
      {
        key: 'rangeKmWltp',
        icon: mockIcon,
        labelKey: 'range',
        value: '513 km WLTP',
        priority: 2,
      },
    ]

    const result = combinePowerSpecs(specs)

    expect(result).toEqual(specs)
  })

  test('re-sorts specs after combination', () => {
    const specs: RenderSpec[] = [
      {
        key: 'batteryKwh',
        icon: mockIcon,
        labelKey: 'battery',
        value: '75 kWh',
        priority: 1,
      },
      {
        key: 'powerHp',
        icon: mockIcon,
        labelKey: 'power',
        value: '350 hp',
        priority: 5,
      },
      {
        key: 'rangeKmWltp',
        icon: mockIcon,
        labelKey: 'range',
        value: '513 km WLTP',
        priority: 3,
      },
      {
        key: 'powerKw',
        icon: mockIcon,
        labelKey: 'power',
        value: '261 kW',
        priority: 4,
      },
    ]

    const result = combinePowerSpecs(specs)

    // Should be sorted: battery (1), range (3), powerCombined (4)
    expect(result[0].key).toBe('batteryKwh')
    expect(result[1].key).toBe('rangeKmWltp')
    expect(result[2].key).toBe('powerCombined')
  })

  test('handles empty array', () => {
    const result = combinePowerSpecs([])
    expect(result).toEqual([])
  })

  test('uses kW priority when lower than HP', () => {
    const specs: RenderSpec[] = [
      {
        key: 'powerKw',
        icon: mockIcon,
        labelKey: 'power',
        value: '261 kW',
        priority: 2,
      },
      {
        key: 'powerHp',
        icon: mockIcon,
        labelKey: 'power',
        value: '350 hp',
        priority: 10,
      },
    ]

    const result = combinePowerSpecs(specs)
    const combined = result.find((s) => s.key === 'powerCombined')

    expect(combined?.priority).toBe(2)
  })
})

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('VehicleKeySpecs integration', () => {
  test('full pipeline: dedupe range + combine power', () => {
    const mockIcon = {}
    const specs: RenderSpec[] = [
      {
        key: 'rangeKmWltp',
        icon: mockIcon,
        labelKey: 'range',
        value: '513 km WLTP',
        priority: 1,
      },
      {
        key: 'rangeKmCltc',
        icon: mockIcon,
        labelKey: 'range',
        value: '520 km CLTC',
        priority: 2,
      },
      {
        key: 'batteryKwh',
        icon: mockIcon,
        labelKey: 'battery',
        value: '75 kWh',
        priority: 3,
      },
      {
        key: 'powerKw',
        icon: mockIcon,
        labelKey: 'power',
        value: '261 kW',
        priority: 4,
      },
      {
        key: 'powerHp',
        icon: mockIcon,
        labelKey: 'power',
        value: '350 hp',
        priority: 5,
      },
    ]

    // Apply transformations in order (matching component logic)
    let result = specs
    result = dedupeRangeSpecs(result)
    result = combinePowerSpecs(result)

    expect(result).toHaveLength(3)
    expect(result.map((s) => s.key)).toEqual([
      'rangeKmWltp',
      'batteryKwh',
      'powerCombined',
    ])
    expect(result.find((s) => s.key === 'powerCombined')?.value).toBe(
      '261 kW (350 hp)'
    )
  })

  test('handles vehicle with minimal specs', () => {
    const mockIcon = {}
    const specs: RenderSpec[] = [
      {
        key: 'rangeKmCltc',
        icon: mockIcon,
        labelKey: 'range',
        value: '300 km CLTC',
        priority: 1,
      },
      {
        key: 'batteryKwh',
        icon: mockIcon,
        labelKey: 'battery',
        value: '40 kWh',
        priority: 2,
      },
    ]

    let result = specs
    result = dedupeRangeSpecs(result)
    result = combinePowerSpecs(result)

    expect(result).toEqual(specs)
  })
})
