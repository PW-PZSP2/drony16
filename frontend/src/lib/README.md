Module: lib

Purpose

- Third-party library configuration and clients (e.g., `axios`, `firebase`, `queryClient`).

Contents

- Initialization and configuration only; no business logic.

Conventions

- Keep clients single-responsibility and testable.
- Export configured instances and helpers.

Examples

- `axiosClient.ts`, `firebase.ts`, `reactQueryClient.ts`

Importing

- `import { axiosClient } from '@/lib/axiosClient'`
