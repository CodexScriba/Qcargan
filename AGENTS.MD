# Project Context for Agents

## Required Next.js 16 Preparation
Before writing or modifying any Next.js code in this repository:
1. Use the Context7 MCP integration to retrieve the latest Next.js 16 upgrade and proxy documentation (`/vercel/next.js`, focus topics: `version-16`, `proxy`, `middleware-to-proxy`).
2. Review changes that affect middleware (now `proxy`), config fields like `skipProxyUrlNormalize`, and other breaking updates noted in the upgrade guide.
3. Confirm any code edits align with these documented changes prior to implementation.

## Context
When receiving a new task, please make sure you read: architecture.md 
/home/cynic/workspace/Qcargan/docs/architecture.md
It contains file tree, structure and current stage of this project. 

## Avoid (do not)
**do not use type **any**

Produce typestrict code. 

