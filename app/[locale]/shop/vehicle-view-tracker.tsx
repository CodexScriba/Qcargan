"use client"

import "client-only"
import { useEffect } from "react"
import { usePostHog } from "@posthog/react"

type VehicleViewTrackerProps = {
  locale: string
}

export function VehicleViewTracker({ locale }: VehicleViewTrackerProps) {
  const posthog = usePostHog()

  useEffect(() => {
    if (!posthog) {
      return
    }

    posthog.capture("vehicle viewed", {
      source: "client",
      app: "web",
      router: "app",
      locale,
    })
  }, [posthog, locale])

  return null
}
