Module: store

Purpose
- Global application state (Redux, Zustand, Context API).

Contents
- Stores, slices, actions, selectors.

Conventions
- Keep feature-specific state in `features/*` when possible.
- Derive state via selectors; avoid duplication.

Examples
- `themeStore.ts`, `authSlice.ts`

Importing
- `import { useThemeStore } from '@/store/themeStore'`