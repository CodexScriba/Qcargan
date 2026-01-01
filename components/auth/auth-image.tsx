import Image from "next/image"
import { cn } from "@/lib/utils"

interface AuthImageProps {
  className?: string
}

export function AuthImage({ className }: AuthImageProps) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      {/* Light Mode Image */}
      <Image
        alt="EV charging station hero"
        src="/images/auth/login_image_light.jpg"
        fill
        className="object-cover object-left rounded-[22px] dark:hidden"
        priority
        sizes="(max-width: 768px) 0vw, 50vw"
      />
      {/* Dark Mode Image */}
      <Image
        alt="EV charging station hero"
        src="/images/auth/login_image_dark.jpg"
        fill
        className="hidden object-cover object-left rounded-[22px] dark:block"
        priority
        sizes="(max-width: 768px) 0vw, 50vw"
      />
      {/* Overlay gradient for better text contrast if needed */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.65)_0%,rgba(0,0,0,.28)_25%,rgba(0,0,0,0)_55%)] rounded-[22px]"
        aria-hidden="true"
      />
    </div>
  )
}
