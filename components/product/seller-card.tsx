import React from 'react'

export type SellerType = 'AGENCY' | 'DEALER' | 'IMPORTER'

export interface SellerCardProps {
  seller: {
    id: string
    name: string
    type: SellerType
    logoUrl?: string | null
    badges?: string[] | null
    isOfficial?: boolean | null
  }
  pricing: {
    amount: number
    currency: 'USD' | 'CRC'
    availability?: {
      label?: string
      tone?: 'neutral' | 'info' | 'success' | 'warning'
    } | null
    financing?: {
      downPayment?: number | null
      monthlyPayment?: number | null
      termMonths?: number | null
      currency?: string | null
    } | null
    cta?: {
      label: string
      href: string
    } | null
    perks?: string[] | null
    emphasis?: 'teal-border' | 'teal-glow'
  }
}

const toneStyles: Record<string, string> = {
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
}

export function SellerCard({ seller, pricing }: SellerCardProps) {
  const { name, type, logoUrl, badges, isOfficial } = seller
  const { amount, currency, availability, financing, cta, perks, emphasis } = pricing

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

  const badgeList = badges?.filter(Boolean) ?? []
  const hasPerks = Array.isArray(perks) && perks.length > 0

  return (
    <div
      className={[
        'flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        emphasis === 'teal-border' && 'border-primary/60',
        emphasis === 'teal-glow' && 'border-primary/60 shadow-[0_0_25px_rgba(20,184,166,0.25)]',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={name}
              className="h-10 w-10 rounded-md border bg-white object-contain p-1"
              loading="lazy"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-sm font-semibold uppercase">
              {name.slice(0, 2)}
            </div>
          )}
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{type}</p>
            <p className="text-lg font-semibold text-foreground">{name}</p>
          </div>
        </div>
        {isOfficial && (
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Oficial
          </span>
        )}
      </header>

      {badgeList.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
          {badgeList.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-muted px-2 py-1"
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      <section className="space-y-2">
        <p className="text-sm text-muted-foreground">Precio desde</p>
        <p className="text-3xl font-semibold text-foreground">{formattedPrice}</p>
        {availability?.label && (
          <span
            className={[
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
              toneStyles[availability.tone ?? 'neutral'] ?? toneStyles.neutral,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {availability.label}
          </span>
        )}
      </section>

      {financing && (financing.downPayment || financing.monthlyPayment) && (
        <section className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Financiamiento</p>
          <ul className="mt-2 space-y-1">
            {financing.downPayment && (
              <li>Entrada: {financing.downPayment.toLocaleString()} {financing.currency ?? currency}</li>
            )}
            {financing.monthlyPayment && financing.termMonths && (
              <li>
                Cuotas: {financing.monthlyPayment.toLocaleString()} {financing.currency ?? currency} × {financing.termMonths} meses
              </li>
            )}
          </ul>
        </section>
      )}

      {hasPerks && (
        <section className="space-y-2 text-sm">
          <p className="font-semibold text-foreground">Beneficios</p>
          <ul className="list-inside list-disc text-muted-foreground">
            {perks!.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </section>
      )}

      {cta && (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {cta.label}
        </a>
      )}
    </div>
  )
}
