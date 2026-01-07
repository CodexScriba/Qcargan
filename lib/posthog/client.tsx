"use client"

import { useEffect } from "react"
import type { ReactNode } from "react"
import posthog from "posthog-js"
import { PostHogProvider as BasePostHogProvider } from "@posthog/react"

type PostHogProviderProps = {
  children: ReactNode
}

let posthogInitialized = false

const isConfigured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    if (!isConfigured || posthogInitialized) {
      return
    }

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: true,
      autocapture: true,
    })

    posthogInitialized = true
  }, [])

  if (!isConfigured) {
    return children
  }

  return <BasePostHogProvider client={posthog}>{children}</BasePostHogProvider>
}
