import { type QuickLink, type ShopCard } from './types'

type ShopQuickLink = Omit<QuickLink, 'icon'> & { icon: 'plug' | 'package' | 'circleDollar' }

export const shopMenuCopy = {
  trigger: 'Shop',
  sectionHeading: 'Shop all accessories',
  viewAllButton: 'Explore the store',
  viewAllHref: '/shop'
}

export const shopQuickLinks: ShopQuickLink[] = [
  {
    title: 'Portable Chargers',
    description: 'Charge wherever you go with compact EV chargers.',
    href: '/shop/portable-chargers',
    icon: 'plug',
    className: 'cursor-pointer'
  },
  {
    title: 'Wall Chargers',
    description: 'Reliable home or office charging installations.',
    href: '/shop/wall-chargers',
    icon: 'plug',
    className: 'cursor-pointer'
  },
  {
    title: 'Accessories',
    description: 'Upgrade your ride with curated accessories.',
    href: '/shop/accessories',
    icon: 'package',
    className: 'cursor-pointer'
  },
  {
    title: 'Tires',
    description: 'EV-optimized tires for every terrain.',
    href: '/shop/tires',
    icon: 'circleDollar',
    className: 'cursor-pointer'
  }
]

export const shopCards: ShopCard[] = [
  {
    title: 'Portable Chargers',
    description: 'Bring backup power anywhere with compact chargers.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/cargador-portatil.webp',
    href: '/shop/portable-chargers'
  },
  {
    title: 'Wall Chargers',
    description: 'Fixed chargers with fast, safe energy delivery.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/cargador%20de%20pared.jpg',
    href: '/shop/wall-chargers'
  },
  {
    title: 'Accessories',
    description: 'Personalize the experience with organizers and more.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/llavero.webp',
    href: '/shop/accessories'
  },
  {
    title: 'Tires',
    description: 'Performance-ready tires selected for EVs.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/llantas.png',
    href: '/shop/tires'
  }
]
