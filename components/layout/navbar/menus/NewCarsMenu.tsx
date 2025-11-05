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
                      className='flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground'
                    >
                      <Clock className='h-5 w-5' />
                      <div>
                        <p className='font-medium'>{t('newest')}</p>
                        <p className='text-sm text-muted-foreground'>{t('newestDesc')}</p>
                      </div>
                    </Link>
                    <Link
                      href={'/vehicles/best-value' as any}
                      className='flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground'
                    >
                      <DollarSign className='h-5 w-5' />
                      <div>
                        <p className='font-medium'>{t('bestValue')}</p>
                        <p className='text-sm text-muted-foreground'>{t('bestValueDesc')}</p>
                      </div>
                    </Link>
                    <Link
                      href={'/vehicles/top-rated' as any}
                      className='flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground'
                    >
                      <Star className='h-5 w-5' />
                      <div>
                        <p className='font-medium'>{t('topRated')}</p>
                        <p className='text-sm text-muted-foreground'>{t('topRatedDesc')}</p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                  {vehicleCategories.map(vehicle => (
                    <NavigationMenuLink asChild key={vehicle.href}>
                      <Link
                        href={vehicle.href as any}
                        className='group block space-y-2 rounded-lg p-4 transition-colors hover:bg-accent hover:text-accent-foreground'
                      >
                        <div className='relative aspect-video overflow-hidden rounded-lg'>
                          <Image
                            src={vehicle.image}
                            alt={vehicle.title}
                            fill
                            className='object-cover transition-transform group-hover:scale-105'
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          />
                        </div>
                        <div>
                          <p className='text-lg font-semibold leading-none mb-2'>{vehicle.title}</p>
                          <p className='line-clamp-2 text-sm text-muted-foreground'>{vehicle.description}</p>
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
