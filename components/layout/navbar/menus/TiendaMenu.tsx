'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { CircleDollarSign, Package, Plug, ShoppingBag } from 'lucide-react'
import { shopCards, shopMenuCopy, shopQuickLinks } from '@/lib/content/navbar/shop'
import { Link } from '@/i18n/routing'

const quickLinkIcons = {
  plug: Plug,
  package: Package,
  circleDollar: CircleDollarSign
} as const

export function TiendaMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{shopMenuCopy.trigger}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className='w-screen max-w-[1200px] p-4 md:p-6'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_2fr]'>
                <div className='flex flex-col gap-4'>
                  <div className='relative overflow-hidden rounded-lg bg-gradient-to-b from-primary/10 to-primary/5 p-6'>
                    <div className='flex flex-col gap-4'>
                      <h3 className='text-xl font-semibold text-foreground'>{shopMenuCopy.sectionHeading}</h3>
                      <Button asChild size='lg' variant='secondary' className='w-full'>
                        <Link href={shopMenuCopy.viewAllHref as any} className='flex items-center justify-center gap-2'>
                          <ShoppingBag className='h-4 w-4' />
                          {shopMenuCopy.viewAllButton}
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-3'>
                    {shopQuickLinks.map(link => {
                      const Icon = quickLinkIcons[link.icon]
                      return (
                        <Link
                          key={link.href}
                          href={link.href as any}
                          className='flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground'
                        >
                          <Icon className='h-5 w-5' />
                          <div>
                            <p className='font-medium'>{link.title}</p>
                            <p className='text-sm text-muted-foreground'>{link.description}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                  {shopCards.map(card => (
                    <NavigationMenuLink asChild key={card.href}>
                      <Link
                        href={card.href as any}
                        className='group block space-y-2 rounded-lg p-4 transition-colors hover:bg-accent hover:text-accent-foreground'
                      >
                        <div className='relative aspect-video overflow-hidden rounded-lg'>
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className='object-contain transition-transform group-hover:scale-105'
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          />
                        </div>
                        <div>
                          <p className='text-lg font-semibold leading-none mb-2'>{card.title}</p>
                          <p className='line-clamp-2 text-sm text-muted-foreground'>{card.description}</p>
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
