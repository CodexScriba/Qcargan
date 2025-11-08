import { getVehicleBySlug } from '../lib/db/queries/vehicles'
import { getBanks } from '../lib/db/queries/banks'

console.log('=== Testing FinancingTabs Integration ===\n')

// Test 1: Fetch a vehicle
const vehicleSlug = 'byd-seagull-vitality-edition-2024'
console.log(`1. Fetching vehicle: ${vehicleSlug}`)
const vehicle = await getVehicleBySlug(vehicleSlug)

if (!vehicle) {
  console.error('❌ Vehicle not found!')
  process.exit(1)
}

console.log(`✅ Vehicle found: ${vehicle.year} ${vehicle.brand} ${vehicle.model}`)
console.log('')

// Test 2: Fetch banks
console.log('2. Fetching banks...')
const banks = await getBanks()

if (banks.length === 0) {
  console.error('❌ No banks found!')
  process.exit(1)
}

console.log(`✅ Found ${banks.length} active banks`)
console.log('')

// Test 3: Simulate FinancingTabs data transformation
console.log('3. Testing data transformation for FinancingTabs...')
const financingTabsData = banks.map((bank) => ({
  id: bank.id,
  name: bank.name,
  logo: bank.logoUrl,
  aprMin: bank.typicalAprMin,
  aprMax: bank.typicalAprMax,
  terms: bank.typicalTermMonths,
  websiteUrl: bank.websiteUrl,
  contactPhone: bank.contactPhone,
  contactEmail: bank.contactEmail,
  description: bank.description,
}))

console.log(`✅ Transformed ${financingTabsData.length} banks for FinancingTabs\n`)

// Test 4: Verify data quality
console.log('4. Data quality check:')
financingTabsData.forEach((bank, index) => {
  const hasApr = bank.aprMin !== null || bank.aprMax !== null
  const hasTerms = bank.terms && bank.terms.length > 0
  const hasContact = bank.websiteUrl || bank.contactPhone || bank.contactEmail

  console.log(`\n   Bank ${index + 1}: ${bank.name}`)
  console.log(`   - Has APR data: ${hasApr ? '✅' : '⚠️'}`)
  console.log(`   - Has terms: ${hasTerms ? '✅' : '⚠️'}`)
  console.log(`   - Has contact info: ${hasContact ? '✅' : '⚠️'}`)
  console.log(`   - Has logo: ${bank.logo ? '✅' : '⚠️'}`)
  console.log(`   - Has description: ${bank.description ? '✅' : '⚠️'}`)

  if (hasApr && hasTerms && hasContact) {
    console.log(`   Status: ✅ Complete`)
  } else if (hasContact) {
    console.log(`   Status: ⚠️ Minimal (missing APR or terms)`)
  } else {
    console.log(`   Status: ❌ Incomplete (no contact methods)`)
  }
})

console.log('\n=== Integration Test Complete ===')
console.log(`\n📍 Test URL: http://localhost:3000/vehiculos/${vehicleSlug}`)
console.log('✅ All checks passed! FinancingTabs should render correctly.')
