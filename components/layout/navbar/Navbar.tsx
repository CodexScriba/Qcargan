'use client'

import { DesktopNavbar } from './variants/DesktopNavbar'
import { TabletNavbar } from './variants/TabletNavbar'
import { MobileNavbar } from './variants/MobileNavbar'

export function Navbar() {
  return (
    <header
      className='sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] text-foreground shadow-[0_12px_36px_hsl(var(--shadow-soft))] transition-colors'
    >
      <div className='hidden lg:block'>
        <DesktopNavbar />
      </div>
      <div className='hidden md:block lg:hidden'>
        <TabletNavbar />
      </div>
      <div className='block md:hidden'>
        <MobileNavbar />
      </div>
    </header>
  )
}
