Module: hooks

Purpose
- Global React hooks shared across features (e.g., `useTheme`, `useMediaQuery`).

Contents
- One hook per file or folder depending on complexity.
- Keep hooks generic and reusable across domains.

Conventions
- Prefix with `use`.
- Side-effect safe; document dependencies.
- Avoid business/domain logic—put that in `features/*`.

Examples
- `useTheme.ts`, `useMediaQuery.ts`, `useDebounce.ts`

Importing
- `import { useTheme } from '@/hooks/useTheme'`