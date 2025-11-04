# Project Context for Agents

## Background
- The legacy project is named `quecargan`: /home/cynic/workspace/quecargan
- A new project `qcargan` has been created on Next.js 16 with only the basic configuration.
- `qcargan` is already linked to Coolify for deployments; the plan is to migrate functionality from `quecargan` into `qcargan`, taking the opportunity to clean up code and align with Next.js 16 conventions.

## Workflow Expectations
- Treat `qcargan` as the target codebase; migrate features from `quecargan` incrementally and refactor them to follow current best practices.
- Keep both projects building until each migrated feature is stable under Next.js 16 before deprecating the original implementation.
- Use the Coolify connection on `qcargan` for frequent smoke deployments to catch regressions early.

## Required Next.js 16 Preparation
Before writing or modifying any Next.js code in this repository:
1. Use the Context7 MCP integration to retrieve the latest Next.js 16 upgrade and proxy documentation (`/vercel/next.js`, focus topics: `version-16`, `proxy`, `middleware-to-proxy`).
2. Review changes that affect middleware (now `proxy`), config fields like `skipProxyUrlNormalize`, and other breaking updates noted in the upgrade guide.
3. Confirm any code edits align with these documented changes prior to implementation.

Following this process ensures every agent is working with the most recent framework guidance and avoids reintroducing deprecated patterns during the migration.
