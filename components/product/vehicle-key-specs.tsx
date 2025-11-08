import type { LucideIcon } from 'lucide-react'
import { Gauge, Navigation, PlugZap, Timer, Users, Zap } from 'lucide-react'

import type { VehicleSpecifications } from '@/types/vehicle'
import KeySpecification from './key-specification'

type SpecificationField = keyof VehicleSpecifications

type SupportedSpecKey = Extract<
SpecificationField,
| 'rangeKmWltp'
| 'rangeKmCltc'
| 'rangeKmEpa'
| 'rangeKmNedc'
| 'batteryKwh'
| 'chargingDcKw'
| 'chargingTimeDcMin'
| 'acceleration0To100Sec'
| 'topSpeedKmh'
| 'powerHp'
| 'powerKw'
| 'seats'
>

type SpecLabelKey =
  | 'range'
  | 'battery'
  | 'dcChargingPower'
  | 'dcChargingTime'
  | 'acceleration'
  | 'topSpeed'
  | 'power'
  | 'seats'

type SpecConfig<T extends SupportedSpecKey = SupportedSpecKey> = {
  key: T
  icon: LucideIcon
  labelKey: SpecLabelKey
  formatter: (value: VehicleSpecifications[T], helpers: FormatHelpers) => string | null
  priority: number
}

type FormatHelpers = {
  formatInteger: (value: number | null | undefined, suffix?: string) => string | null
  formatSingleDecimal: (value: number | null | undefined, suffix?: string) => string | null
}

type RenderSpec = {
  key: string
  icon: LucideIcon
  labelKey: SpecLabelKey
  value: string
  priority: number
}

const RANGE_KEYS: SupportedSpecKey[] = ['rangeKmWltp', 'rangeKmCltc', 'rangeKmEpa', 'rangeKmNedc']
const POWER_KEYS: SupportedSpecKey[] = ['powerKw', 'powerHp']

const DEFAULT_LABELS: Record<SpecLabelKey, string> = {
  range: 'Range',
  battery: 'Battery',
  dcChargingPower: 'DC Charging',
  dcChargingTime: 'DC Charge Time',
  acceleration: '0-100 km/h',
  topSpeed: 'Top Speed',
  power: 'Power',
  seats: 'Seats',
}

const SPEC_CONFIGS: SpecConfig[] = [
  {
    key: 'rangeKmWltp',
    icon: Navigation,
    labelKey: 'range',
    formatter: (value, helpers) => helpers.formatInteger(value, ' km WLTP'),
    priority: 1,
  },
  {
    key: 'rangeKmCltc',
    icon: Navigation,
    labelKey: 'range',
    formatter: (value, helpers) => helpers.formatInteger(value, ' km CLTC'),
    priority: 2,
  },
  {
    key: 'rangeKmEpa',
    icon: Navigation,
    labelKey: 'range',
    formatter: (value, helpers) => helpers.formatInteger(value, ' km EPA'),
    priority: 3,
  },
  {
    key: 'rangeKmNedc',
    icon: Navigation,
    labelKey: 'range',
    formatter: (value, helpers) => helpers.formatInteger(value, ' km NEDC'),
    priority: 4,
  },
  {
    key: 'batteryKwh',
    icon: Zap,
    labelKey: 'battery',
    formatter: (value, helpers) => helpers.formatSingleDecimal(value, ' kWh'),
    priority: 5,
  },
  {
    key: 'chargingDcKw',
    icon: PlugZap,
    labelKey: 'dcChargingPower',
    formatter: (value, helpers) => helpers.formatInteger(value, ' kW'),
    priority: 6,
  },
  {
    key: 'chargingTimeDcMin',
    icon: Timer,
    labelKey: 'dcChargingTime',
    formatter: (value, helpers) => helpers.formatInteger(value, ' min'),
    priority: 7,
  },
  {
    key: 'acceleration0To100Sec',
    icon: Timer,
    labelKey: 'acceleration',
    formatter: (value, helpers) => helpers.formatSingleDecimal(value, ' s'),
    priority: 8,
  },
  {
    key: 'topSpeedKmh',
    icon: Gauge,
    labelKey: 'topSpeed',
    formatter: (value, helpers) => helpers.formatInteger(value, ' km/h'),
    priority: 9,
  },
  {
    key: 'powerHp',
    icon: Gauge,
    labelKey: 'power',
    formatter: (value, helpers) => helpers.formatInteger(value, ' hp'),
    priority: 10,
  },
  {
    key: 'powerKw',
    icon: Gauge,
    labelKey: 'power',
    formatter: (value, helpers) => helpers.formatInteger(value, ' kW'),
    priority: 11,
  },
  {
    key: 'seats',
    icon: Users,
    labelKey: 'seats',
    formatter: (value, helpers) => helpers.formatInteger(value, ''),
    priority: 12,
  },
] satisfies SpecConfig[]

/**
 * Creates locale-aware number formatters with NaN protection
 * @param locale - Locale string for Intl.NumberFormat (e.g., 'en-US', 'es-ES')
 * @returns Object with formatInteger and formatSingleDecimal functions
 */
const createFormatHelpers = (locale: string): FormatHelpers => {
  const integerFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  const singleDecimalFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })

  return {
    /**
     * Formats a number as an integer with optional suffix
     * @returns Formatted string or null if value is null/undefined/NaN
     */
    formatInteger: (value, suffix = '') => {
      if (value == null) return null
      const parsed = Number(value)
      if (Number.isNaN(parsed)) return null
      return `${integerFormatter.format(parsed)}${suffix}`
    },
    /**
     * Formats a number with one decimal place and optional suffix
     * @returns Formatted string or null if value is null/undefined/NaN
     */
    formatSingleDecimal: (value, suffix = '') => {
      if (value == null) return null
      const parsed = Number(value)
      if (Number.isNaN(parsed)) return null
      return `${singleDecimalFormatter.format(parsed)}${suffix}`
    },
  }
}

/**
 * Deduplicates range specifications by keeping only the highest priority range spec
 * Priority order: WLTP > CLTC > EPA > NEDC
 * @param specs - Array of renderable specs (must be pre-sorted by priority)
 * @returns Filtered array with only one range spec
 */
const dedupeRangeSpecs = (specs: RenderSpec[]): RenderSpec[] => {
  const bestRange = specs.find((spec) => RANGE_KEYS.includes(spec.key as SupportedSpecKey))
  if (!bestRange) return specs
  return specs.filter(
    (spec) =>
      !RANGE_KEYS.includes(spec.key as SupportedSpecKey) || spec.key === bestRange.key,
  )
}

/**
 * Combines power specifications (kW and HP) into a single spec
 * If both exist: displays as "261 kW (350 hp)"
 * If only one exists: displays that value
 * @param specs - Array of renderable specs
 * @returns Array with combined power spec, re-sorted by priority
 */
const combinePowerSpecs = (specs: RenderSpec[]): RenderSpec[] => {
  const hpSpec = specs.find((spec) => spec.key === 'powerHp')
  const kwSpec = specs.find((spec) => spec.key === 'powerKw')
  if (!hpSpec || !kwSpec) return specs

  const combinedValue =
    kwSpec.value && hpSpec.value ? `${kwSpec.value} (${hpSpec.value})` : kwSpec.value || hpSpec.value
  const combinedSpec: RenderSpec = {
    key: 'powerCombined',
    icon: kwSpec.icon,
    labelKey: 'power',
    value: combinedValue,
    priority: Math.min(hpSpec.priority, kwSpec.priority),
  }

  return [...specs.filter((spec) => !POWER_KEYS.includes(spec.key as SupportedSpecKey)), combinedSpec].sort(
    (a, b) => a.priority - b.priority,
  )
}

/**
 * Props for VehicleKeySpecs component
 */
export interface VehicleKeySpecsProps {
  /**
   * Vehicle specifications object from database
   * If null, component returns null
   */
  specifications: VehicleSpecifications | null

  /**
   * Maximum number of specifications to display
   * Applied AFTER deduplication and power combination
   * @default 6
   * @example
   * // Display only top 4 specs
   * <VehicleKeySpecs specifications={data} maxDisplay={4} />
   */
  maxDisplay?: number

  /**
   * Locale string for Intl.NumberFormat
   * Used for locale-aware number formatting
   * @default 'en-US'
   * @example
   * // Spanish locale formatting
   * <VehicleKeySpecs specifications={data} locale="es-ES" />
   */
  locale?: string

  /**
   * Custom label overrides for i18n support
   * Merges with DEFAULT_LABELS
   * @example
   * // With next-intl
   * const t = await getTranslations('vehicle.specs')
   * <VehicleKeySpecs
   *   specifications={data}
   *   labels={{
   *     range: t('range'),
   *     battery: t('battery'),
   *     power: t('power')
   *   }}
   * />
   */
  labels?: Partial<Record<SpecLabelKey, string>>

  /**
   * Override default priority order
   * Specs in this array are shown first, in order provided
   * @example
   * // Show battery and range first, regardless of default priority
   * <VehicleKeySpecs
   *   specifications={data}
   *   priorityKeys={['batteryKwh', 'rangeKmWltp']}
   * />
   */
  priorityKeys?: SupportedSpecKey[]
}

/**
 * VehicleKeySpecs - Container component that renders vehicle specifications
 *
 * Features:
 * - Automatically selects best range spec (WLTP > CLTC > EPA > NEDC)
 * - Combines power metrics (kW and HP) into single display
 * - Locale-aware number formatting
 * - i18n-ready with label override support
 * - Type-safe mapping from database schema to UI
 *
 * @example
 * // Basic usage
 * <VehicleKeySpecs specifications={vehicle.specifications} />
 *
 * @example
 * // With i18n (next-intl)
 * const t = await getTranslations('vehicle.specs')
 * <VehicleKeySpecs
 *   specifications={vehicle.specifications}
 *   locale={locale}
 *   labels={{
 *     range: t('range'),
 *     battery: t('battery'),
 *     power: t('power')
 *   }}
 * />
 *
 * @example
 * // Custom priority order
 * <VehicleKeySpecs
 *   specifications={vehicle.specifications}
 *   priorityKeys={['batteryKwh', 'rangeKmWltp', 'acceleration0To100Sec']}
 *   maxDisplay={4}
 * />
 */
export default function VehicleKeySpecs ({
  specifications,
  maxDisplay = 6,
  locale = 'en-US',
  labels,
  priorityKeys,
}: VehicleKeySpecsProps) {
  if (!specifications) return null

  const labelMap = { ...DEFAULT_LABELS, ...labels }
  const formatters = createFormatHelpers(locale)
  const priorityOverride = priorityKeys?.reduce<Map<SupportedSpecKey, number>>((map, key, index) => {
    map.set(key, index + 1)
    return map
  }, new Map())
  const overrideOffset = priorityOverride?.size ?? 0

  let renderableSpecs = SPEC_CONFIGS.map((config) => {
    const rawValue = specifications[config.key]
    const formatted = config.formatter(rawValue, formatters)
    if (!formatted) return null

    return {
      key: config.key,
      icon: config.icon,
      labelKey: config.labelKey,
      value: formatted,
      priority: priorityOverride?.get(config.key) ?? overrideOffset + config.priority,
    } as RenderSpec
  }).filter((spec): spec is RenderSpec => Boolean(spec))

  renderableSpecs.sort((a, b) => a.priority - b.priority)
  renderableSpecs = dedupeRangeSpecs(renderableSpecs)
  renderableSpecs = combinePowerSpecs(renderableSpecs)
  renderableSpecs = renderableSpecs.slice(0, maxDisplay)

  if (!renderableSpecs.length) return null

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
      {renderableSpecs.map((spec, index) => (
        <KeySpecification
          key={`${spec.key}-${index}`}
          icon={spec.icon}
          title={labelMap[spec.labelKey]}
          value={spec.value}
        />
      ))}
    </div>
  )
}
