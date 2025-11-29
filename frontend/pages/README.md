Module: pages

Purpose
- Routing layer (React Router/Next.js), composes UI from `features/*` and `components/*`.

Contents
- Route components only; minimal logic.

Conventions
- Connect routes to features; avoid embedding feature logic here.
- Keep loaders and guards thin—delegate to services/features.

Examples
- `HomePage.tsx`, `LoginPage.tsx`, `DashboardPage.tsx`

Importing
- `import { DashboardPage } from '@/pages/DashboardPage'`