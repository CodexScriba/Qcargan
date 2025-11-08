import { db } from '../lib/db/client'
import { banks } from '../lib/db/schema/banks'

const allBanks = await db.select().from(banks)

console.log('Total banks in database:', allBanks.length)
console.log('\n=== Bank Records ===\n')

allBanks.forEach((bank, index) => {
  console.log(`${index + 1}. ${bank.name}`)
  console.log(`   Slug: ${bank.slug}`)
  console.log(`   Active: ${bank.isActive}`)
  console.log(`   Featured: ${bank.isFeatured}`)
  console.log(`   APR: ${bank.typicalAprMin ?? 'N/A'} - ${bank.typicalAprMax ?? 'N/A'}%`)
  console.log(`   Terms: ${bank.typicalTermMonths?.join(', ') ?? 'N/A'} months`)
  console.log(`   Website: ${bank.websiteUrl ?? 'N/A'}`)
  console.log(`   Phone: ${bank.contactPhone ?? 'N/A'}`)
  console.log(`   Email: ${bank.contactEmail ?? 'N/A'}`)
  console.log(`   Logo: ${bank.logoUrl ?? 'N/A'}`)
  console.log(`   Description: ${bank.description ?? 'N/A'}`)
  console.log(`   Display Order: ${bank.displayOrder}`)
  console.log('')
})
