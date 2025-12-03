Module: services

Purpose

- Global API definitions and cross-feature services (if not scoped to `features/*`).

Contents

- HTTP service functions, adapters, and DTO mappers.

Conventions

- Stateless functions returning data; no UI logic.
- Type-safe requests and responses.

Examples

- `userService.ts`, `healthService.ts`

Importing

- `import { getUser } from '@/services/userService'`
