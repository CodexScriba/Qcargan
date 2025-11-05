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
import { ArrowRight, CircleDollarSign, Plug, Car, Package } from 'lucide-react'
import { serviceCategories, servicesFeatured, servicesMenuCopy, servicesQuickLinks } from '@/lib/content/navbar/services'
import { Link } from '@/i18n/routing'

const quickLinkIcons = {
  plug: Plug,
  car: Car,
  package: Package,
  circleDollar: CircleDollarSign
} as const

export function ServicesMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{servicesMenuCopy.trigger}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className='w-screen max-w-[1200px] p-4 md:p-6'>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-[1fr_2fr]'>
                <div className='flex flex-col gap-4'>
                  <div className='relative overflow-hidden rounded-lg bg-gradient-to-b from-primary/10 to-primary/5 p-6'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex items-center gap-2'>
                        <Badge variant='secondary' className='px-2 py-1'>
                          Specialists
                        </Badge>
                        <Badge variant='outline' className='px-2 py-1'>
                          Trusted network
                        </Badge>
                      </div>
                      <h3 className='text-xl font-semibold text-foreground'>{servicesMenuCopy.sectionHeading}</h3>
                      <Button asChild size='lg' variant='secondary' className='w-full'>
                        <Link href={servicesMenuCopy.viewAllHref as any} className='flex items-center justify-center gap-2'>
                          <ArrowRight className='h-4 w-4' />
                          {servicesMenuCopy.viewAllButton}
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className='rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-accent p-6 shadow-lg transition-all duration-300 hover:shadow-xl'>
                    <div className='flex flex-col gap-4'>
                      <Badge variant='default' className='px-3 py-1 text-sm font-medium'>
                        {servicesFeatured.badge}
                      </Badge>
                      <h3 className='text-2xl font-bold text-primary'>{servicesFeatured.title}</h3>
                      <p className='text-sm text-muted-foreground'>{servicesFeatured.description}</p>
                      <div className='relative mt-2 h-40 w-full overflow-hidden rounded-lg'>
                        <Image
                          src={servicesFeatured.image}
                          alt={servicesFeatured.title}
                          fill
                          className='object-cover transition-transform hover:scale-105'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                      </div>
                      <Button asChild size='lg' className='mt-2 w-full'>
                        <Link href={servicesFeatured.href as any} className='flex items-center justify-between gap-2'>
                          <span>{servicesFeatured.cta}</span>
                          <ArrowRight className='h-4 w-4' />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-3'>
                    {servicesQuickLinks.map(link => {
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
                  {serviceCategories.map(service => (
                    <NavigationMenuLink asChild key={service.href}>
                      <Link
                        href={service.href as any}
                        className='group block space-y-2 rounded-lg p-4 transition-colors hover:bg-accent hover:text-accent-foreground'
                      >
                        <div className='relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted'>
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className='object-contain transition-transform group-hover:scale-105'
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          />
                        </div>
                        <div>
                          <p className='mb-2 text-lg font-semibold leading-none'>{service.title}</p>
                          <p className='line-clamp-2 text-sm text-muted-foreground'>{service.description}</p>
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
