import type { LucideIcon } from 'lucide-react'

export interface KeySpecificationProps {
  icon: LucideIcon
  title: string
  value: string
  ariaLabel?: string
}

export default function KeySpecification ({ icon: Icon, title, value, ariaLabel }: KeySpecificationProps) {
  return (
    <div
      role='group'
      aria-label={ariaLabel ?? `${title}: ${value}`}
      title={ariaLabel ?? `${title}: ${value}`}
      tabIndex={0}
      className='
        group flex items-center gap-3 p-4 rounded-xl
        border-l-4 border-l-[hsl(var(--brand))]
        bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]
        shadow-[0_6px_18px_hsl(219_18%_20%/0.06)]
        transition-all duration-200 ease-out
        hover:translate-y-[-2px]
        hover:shadow-[0_10px_24px_hsl(219_18%_20%/0.10)]
        focus-visible:outline-2 focus-visible:outline-[hsl(var(--ring))] focus-visible:outline-offset-2
        motion-reduce:transform-none motion-reduce:transition-none
      '
    >
      <div
        aria-hidden
        className='
          grid place-items-center shrink-0 w-11 h-11 rounded-full
          bg-[hsl(var(--primary))]
        '
      >
        <Icon className='w-[22px] h-[22px] text-[hsl(var(--accent))]' />
      </div>
      <div className='grid gap-1'>
        <div className='font-bold text-base leading-tight text-[hsl(var(--card-foreground))]'>{title}</div>
        <div className='text-sm text-[hsl(var(--muted-foreground))] leading-tight'>{value}</div>
      </div>
    </div>
  )
}
