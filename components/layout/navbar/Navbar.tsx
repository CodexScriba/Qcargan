'use client'

import { useLayoutEffect, useRef } from 'react'

import { DesktopNavbar } from './variants/DesktopNavbar'
import { TabletNavbar } from './variants/TabletNavbar'
import { MobileNavbar } from './variants/MobileNavbar'

export function Navbar() {
  const headerRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const element = headerRef.current
    if (!element) return

    const update = () => {
      const { height } = element.getBoundingClientRect()
      document.documentElement.style.setProperty('--navbar-height', `${Math.round(height)}px`)
    }

    update()

    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update)
      observer.observe(element)
    }

    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      observer?.disconnect()
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className='sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] text-foreground shadow-[0_12px_36px_hsl(var(--shadow-soft))] transition-colors supports-[backdrop-filter]:bg-[hsl(var(--background))] supports-[backdrop-filter]:backdrop-blur'
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
