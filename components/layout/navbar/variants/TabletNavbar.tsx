'use client'

import { Button } from '@/components/ui/button'
import { Logo } from '../Logo'
import { NewCarsMenu } from '../menus/NewCarsMenu'
import { TiendaMenu } from '../menus/TiendaMenu'
import { ServicesMenu } from '../menus/ServicesMenu'
import { UsedCarsMenu } from '../menus/UsedCarsMenu'
import { ThemeSwitcher } from '@/components/layout/theme-switcher'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { ArrowRight, LogIn } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export function TabletNavbar() {
  const t = useTranslations('Navbar')
  return (
    <nav className='w-full'>
      <div className='flex h-16 w-full items-center justify-between gap-4 px-4'>
        <div className='flex items-center gap-4'>
          <Logo />
          <NewCarsMenu />
          <TiendaMenu />
          <ServicesMenu />
          <UsedCarsMenu />
        </div>
        <div className='flex items-center gap-3'>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button asChild variant='ghost' size='sm' className='gap-2'>
            <Link href={'/auth/login' as any}>
              <LogIn className='h-4 w-4' />
              {t('login')}
            </Link>
          </Button>
          <Button asChild size='sm' className='gap-2'>
            <Link href={'/auth/sign-up' as any}>
              {t('join')}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
