import { createHash } from 'crypto'
import { slugify } from '../../lib/utils/identifiers'

export { slugify }

export function stableUuid(namespace: string, value: string): string {
  const hash = createHash('sha256')
    .update(namespace)
    .update(':')
    .update(value)
    .digest('hex')

  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`
}
