'use client'

import { useCallback, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SearchBarProps = {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ placeholder = 'Search vehicles, services...', className, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!query.trim()) return
      onSearch?.(query.trim())
    },
    [onSearch, query]
  )

  return (
    <form role='search' onSubmit={handleSubmit} className={cn('relative', className)}>
      <span className='pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground'>
        <Search className='h-5 w-5' aria-hidden='true' />
      </span>
      <Input
        type='search'
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder={placeholder}
        className='h-12 w-full rounded-full border-border bg-background pl-11 pr-4 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-primary'
        aria-label={placeholder}
      />
    </form>
  )
}
