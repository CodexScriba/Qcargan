---
stage: audit
agent: auditor
tags: []
contexts:
  - skills/nextjs-core-skills
  - skills/skill-next-intl
skills: []
---

# translation bug

Couldn't find next-intl config file. Please follow the instructions at https://next-intl.dev/docs/getting-started/app-router
app/[locale]/page.tsx (10:34) @ HomePage


   8 |   const { locale } = await params
   9 |   setRequestLocale(locale)
> 10 |   const t = await getTranslations("Home")
     |                                  ^
  11 |
  12 |   return (
  13 |     <div className="flex min-h-[calc(100vh-(--spacing(16)))] flex-col items-center justify-center p-8 text-center">

## Refined Prompt

Objective: Wire next-intl plugin into next.config.ts to enable getTranslations server functions.

Implementation approach:
1. Import `createNextIntlPlugin` from `next-intl/plugin` in next.config.ts
2. Call the plugin with the path to the request config file (`./i18n/request.ts`)
3. Wrap the nextConfig export with the plugin wrapper

Key decisions:
- Use explicit path `./i18n/request.ts` rather than relying on default locations, since the project already has this file in place with proper `getRequestConfig` export

Edge cases:
- None - this is a straightforward configuration fix

## Context

### Relevant Code
- [next.config.ts:1-7](next.config.ts#L1-L7) - Currently empty config, missing next-intl plugin wrapper
- [i18n/request.ts:1-17](i18n/request.ts#L1-L17) - Request config already exists with proper `getRequestConfig` export
- [lib/i18n/routing.ts](lib/i18n/routing.ts) - Routing config with locales `["es", "en"]`

### Patterns to Follow
Standard next-intl v4 plugin setup pattern:
```typescript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl(nextConfig);
```

### Test Patterns
Manual verification: run `bun run dev` and navigate to `/` or `/en` - page should render without the "Couldn't find next-intl config file" error.

### Dependencies
- `next-intl@^4.6.1` - Already installed in package.json

### Gotchas
- The path passed to `createNextIntlPlugin()` must be relative from project root (not absolute)
- The i18n/request.ts file must export `getRequestConfig` as default export (already correct)

## Audit
/home/cynic/workspace/Qcargan/next.config.ts
