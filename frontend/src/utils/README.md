Module: utils

Purpose

- Pure helper functions (formatting, validation, parsing) with no side effects.

Contents

- Small, composable functions with tests.

Conventions

- No framework-specific code; keep utilities generic.
- Ensure determinism and clear input/output contracts.

Examples

- `formatDate.ts`, `validateEmail.ts`, `slugify.ts`

Importing

- `import { formatDate } from '@/utils/formatDate'`
