import "server-only"
import { PostHog } from "posthog-node"

export const runtime = "nodejs"

const serverKey = process.env.POSTHOG_SERVER_KEY
const serverHost = process.env.POSTHOG_SERVER_HOST

export function getPostHogServer() {
  if (!serverKey || !serverHost) {
    return null
  }

  return new PostHog(serverKey, {
    host: serverHost,
    flushAt: 1,
    flushInterval: 0,
  })
}
