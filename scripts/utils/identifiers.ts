import { createHash } from 'crypto'

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .trim()
}

export function stableUuid(namespace: string, value: string): string {
  const hash = createHash('sha256')
    .update(namespace)
    .update(':')
    .update(value)
    .digest('hex')

  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`
}
