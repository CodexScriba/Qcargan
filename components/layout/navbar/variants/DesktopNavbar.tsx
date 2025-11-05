'use client'

import { Button } from '@/components/ui/button'
import { Logo } from '../Logo'
import { NewCarsMenu } from '../menus/NewCarsMenu'
import { UsedCarsMenu } from '../menus/UsedCarsMenu'
import { ServicesMenu } from '../menus/ServicesMenu'
import { TiendaMenu } from '../menus/TiendaMenu'
import { SearchBar } from '../menus/SearchBar'
import { ThemeSwitcher } from '@/components/layout/theme-switcher'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { ArrowRight, LogIn } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export function DesktopNavbar() {
  const t = useTranslations('Navbar')
  return (
    <nav className='w-full'>
      <div className='mx-auto flex h-20 w-full max-w-[1600px] items-center gap-6 px-6'>
        <Logo />

        <div className='flex items-center gap-4'>
          <NewCarsMenu />
          <UsedCarsMenu />
          <ServicesMenu />
          <TiendaMenu />
        </div>

        <div className='mx-6 flex flex-1 justify-center'>
          <SearchBar className='w-full max-w-md' placeholder={t('searchPlaceholder')} />
        </div>

        <div className='flex items-center gap-4'>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button asChild variant='ghost' className='gap-2'>
            <Link href={'/auth/login' as any}>
              <LogIn className='h-4 w-4' />
              {t('login')}
            </Link>
          </Button>
          <Button asChild className='gap-2'>
            <Link href={'/auth/sign-up' as any}>
              {t('signUp')}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
