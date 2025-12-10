import Image from 'next/image'
import { Link } from '@/i18n/routing'

export function Logo() {
  return (
    <Link href='/' className='group flex items-center gap-2'>
      <Image
        src='/Logo.jpg'
        alt='Qcargan logo'
        height={40}
        width={40}
        className='transition group-hover:opacity-80'
        priority
      />
      <span className='hidden text-base font-semibold text-foreground md:inline'>Qcargan</span>
    </Link>
  )
}
