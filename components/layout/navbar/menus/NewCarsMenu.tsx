'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { Clock, DollarSign, List, Star } from 'lucide-react'
import { vehicleCategories } from '@/lib/content/navbar/new-cars'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

const quickLinkIcons = {
  clock: Clock,
  dollar: DollarSign,
  star: Star,
  list: List
} as const

export function NewCarsMenu() {
  const t = useTranslations('Navbar')
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t('newCars')}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className='w-screen max-w-[1200px] p-4 md:p-6'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_2fr]'>
                <div className='flex flex-col gap-4'>
                  <div className='relative overflow-hidden rounded-lg bg-gradient-to-b from-primary/10 to-primary/5 p-6'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex items-center gap-2'>
                        <Badge variant='secondary' className='px-2 py-1'>
                          2025 Lineup
                        </Badge>
                        <Badge variant='outline' className='px-2 py-1'>
                          Fresh Inventory
                        </Badge>
                      </div>
                      <h3 className='text-xl font-semibold text-foreground'>{t('exploreModels')}</h3>
                      <Button asChild size='lg' variant='secondary' className='w-full'>
                        <Link href={'/vehicles' as any} className='flex items-center justify-center gap-2'>
                          <List className='h-4 w-4' />
                          {t('browseAll')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-3'>
                    <Link
                      href={'/vehicles/newest' as any}
                      data-slot='card'
                      className='flex items-center gap-3 p-4 transition-all duration-220 ease-out'
                    >
                      <Clock className='h-5 w-5 text-[hsl(var(--accent))]' />
                      <div>
                        <p className='font-medium text-[hsl(var(--card-foreground))]'>{t('newest')}</p>
                        <p className='text-sm text-[hsl(var(--muted-foreground))]'>{t('newestDesc')}</p>
                      </div>
                    </Link>
                    <Link
                      href={'/vehicles/best-value' as any}
                      data-slot='card'
                      className='flex items-center gap-3 p-4 transition-all duration-220 ease-out'
                    >
                      <DollarSign className='h-5 w-5 text-[hsl(var(--accent))]' />
                      <div>
                        <p className='font-medium text-[hsl(var(--card-foreground))]'>{t('bestValue')}</p>
                        <p className='text-sm text-[hsl(var(--muted-foreground))]'>{t('bestValueDesc')}</p>
                      </div>
                    </Link>
                    <Link
                      href={'/vehicles/top-rated' as any}
                      data-slot='card'
                      className='flex items-center gap-3 p-4 transition-all duration-220 ease-out'
                    >
                      <Star className='h-5 w-5 text-[hsl(var(--accent))]' />
                      <div>
                        <p className='font-medium text-[hsl(var(--card-foreground))]'>{t('topRated')}</p>
                        <p className='text-sm text-[hsl(var(--muted-foreground))]'>{t('topRatedDesc')}</p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                  {vehicleCategories.map(vehicle => (
                    <NavigationMenuLink asChild key={vehicle.href}>
                      <Link
                        href={vehicle.href as any}
                        data-slot='card'
                        className='group block space-y-3 p-4'
                      >
                        <div className='relative aspect-video overflow-hidden rounded-lg'>
                          <Image
                            src={vehicle.image}
                            alt={vehicle.title}
                            fill
                            className='object-cover transition-transform duration-300 group-hover:scale-105'
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          />
                        </div>
                        <div>
                          <p className='text-lg font-semibold leading-none mb-2 text-[hsl(var(--card-foreground))]'>{vehicle.title}</p>
                          <p className='line-clamp-2 text-sm text-[hsl(var(--muted-foreground))]'>{vehicle.description}</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
