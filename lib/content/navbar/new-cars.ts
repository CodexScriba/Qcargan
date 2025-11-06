import { type QuickLink, type VehicleCategory } from './types'

type VehicleQuickLink = Omit<QuickLink, 'icon'> & { icon: 'clock' | 'dollar' | 'star' }

export const vehicleCategories: VehicleCategory[] = [
  {
    title: 'Sedan',
    href: '/vehicles/sedan',
    description: 'Comfortable, elegant and built for long-distance travel with a dedicated trunk.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/Sedan.png',
    className: 'cursor-pointer'
  },
  {
    title: 'SUV (Compact & Large)',
    href: '/vehicles/suv',
    description: 'Spacious and versatile, perfect for families or weekend adventures.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/SUV.png',
    className: 'cursor-pointer'
  },
  {
    title: 'City (Hatchback & Compact)',
    href: '/vehicles/city',
    description: 'Agile and easy to park, ideal for dense urban living.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/compact.png',
    className: 'cursor-pointer'
  },
  {
    title: 'Pickups & Vans',
    href: '/vehicles/pickups',
    description: 'Ready for work or cargo with flexible interior layouts.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/pickup.png',
    className: 'cursor-pointer'
  }
]

export const vehicleQuickLinks: VehicleQuickLink[] = [
  {
    title: 'Newest Arrivals',
    description: 'Explore the latest electric releases',
    href: '/vehicles/newest',
    icon: 'clock'
  },
  {
    title: 'Best Value',
    description: 'Great pricing across every category',
    href: '/vehicles/best-value',
    icon: 'dollar'
  },
  {
    title: 'Top Rated',
    description: 'Customer favorites with stellar reviews',
    href: '/vehicles/top-rated',
    icon: 'star'
  }
]

export const browseAllVehiclesCta = {
  label: 'Browse All Vehicles',
  href: '/vehicles'
}
