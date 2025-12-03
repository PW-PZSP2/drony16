Module: components

Purpose:

Houses all compoenents

Folders

- base - all dump, not specyfic compoents
- feature - feature based compoents
- ui - compoenents imported from external library(shad cn)

Contents

- Each component in its own folder: `ComponentName/`.
- Typical files:
  - `ComponentName.tsx` or `ComponentName.jsx`: Stateless UI.
  - `ComponentName.styles.ts`: Styles or style helpers.
  - `ComponentName.test.tsx`: Unit tests.
  - `index.ts`: Barrel export.

Conventions

- No business logic; accept props and render.
- Reusable, accessible, and theme-aware.
- Export via barrel to enable clean imports.

Examples

- Button/, Input/, Card/, Layout/

Importing

- Use barrel imports: `import { Button } from '@/components/Button'`
