'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { Calendar, Car, Tag } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export function UsedCarsMenu() {
  const t = useTranslations('Navbar')
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t('usedCars')}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className='w-screen max-w-[900px] p-6'>
              <div className='flex flex-col items-center gap-6 text-center'>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className='px-3 py-1'>
                    Coming soon
                  </Badge>
                  <Badge variant='outline' className='px-3 py-1'>
                    <Calendar className='mr-1 h-3 w-3' />
                    Q3 2025
                  </Badge>
                </div>
                <h2 className='text-2xl font-semibold text-primary'>{t('usedMarketplace')}</h2>
                <p className='max-w-2xl text-muted-foreground'>
                  {t('usedMarketplaceDesc')}
                </p>
                <div className='grid w-full gap-4 text-left sm:grid-cols-3'>
                  <div className='flex flex-col items-center gap-2 rounded-lg border bg-background/60 p-4 text-center'>
                    <Car className='h-8 w-8 text-primary' />
                    <p className='font-medium'>List your vehicle</p>
                    <p className='text-sm text-muted-foreground'>Guided listing workflow with all EV-specific fields.</p>
                  </div>
                  <div className='flex flex-col items-center gap-2 rounded-lg border bg-background/60 p-4 text-center'>
                    <Tag className='h-8 w-8 text-primary' />
                    <p className='font-medium'>Transparent pricing</p>
                    <p className='text-sm text-muted-foreground'>Market insights help you set the right price.</p>
                  </div>
                  <div className='flex flex-col items-center gap-2 rounded-lg border bg-background/60 p-4 text-center'>
                    <Calendar className='h-8 w-8 text-primary' />
                    <p className='font-medium'>Schedule viewings</p>
                    <p className='text-sm text-muted-foreground'>Coordinate visits with verified buyers in one place.</p>
                  </div>
                </div>
                <Button asChild size='lg' variant='outline'>
                  <Link href={'/used-cars/waitlist' as any}>
                    {t('joinWaitlist')}
                  </Link>
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
