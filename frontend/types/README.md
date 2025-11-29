Module: types

Purpose

- Global TypeScript types shared across features.

Contents

- Common interfaces, enums, utility types.

Conventions

- Domain-specific types should live under `features/*/types`.
- Keep stable, versioned types and document breaking changes.

Examples

- `User.ts`, `ApiError.ts`, `Pagination.ts`

Importing

- `import type { User } from '@/types/User'`
