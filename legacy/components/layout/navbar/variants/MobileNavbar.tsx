'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Logo } from '../Logo'
import { SearchBar } from '../menus/SearchBar'
import { ThemeSwitcher } from '@/components/layout/theme-switcher'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { ArrowRight, LogIn, Menu } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export function MobileNavbar() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('Navbar')

  const primaryLinks = [
    { label: t('newCars'), href: '/vehicles' as any },
    { label: t('shop'), href: '/shop' as any },
    { label: t('services'), href: '/services' as any },
    { label: t('usedCars'), href: '/used-cars/waitlist' as any }
  ]

  return (
    <nav className='w-full'>
      <div className='flex h-14 w-full items-center justify-between px-4'>
        <Logo />
        <div className='flex items-center gap-2'>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='gap-0'>
              <SheetHeader>
                <SheetTitle className='text-lg'>{t('navigate')}</SheetTitle>
              </SheetHeader>
              <div className='px-4 pb-4'>
                <SearchBar className='w-full' placeholder={t('searchPlaceholder')} />
              </div>
              <div className='flex flex-col divide-y divide-border/60'>
                {primaryLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className='mt-auto flex flex-col gap-3 p-4'>
                <Button asChild variant='outline' className='gap-2'>
                  <Link href={'/auth/login' as any} onClick={() => setOpen(false)}>
                    <LogIn className='h-4 w-4' />
                    {t('login')}
                  </Link>
                </Button>
                <Button asChild className='gap-2'>
                  <Link href={'/auth/sign-up' as any} onClick={() => setOpen(false)}>
                    {t('signUp')}
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
