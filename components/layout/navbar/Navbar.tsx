'use client'

import { DesktopNavbar } from './variants/DesktopNavbar'
import { TabletNavbar } from './variants/TabletNavbar'
import { MobileNavbar } from './variants/MobileNavbar'

export function Navbar() {
  return (
    <header
      className='sticky top-0 z-50 w-full border-b border-border/60 shadow-sm'
      style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
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
