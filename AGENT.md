# image-transform AGENT

## Stack Signals
- React 19 + TypeScript + Vite 7 entry via `src/main.tsx`
- Styling blends Tailwind CSS 4 utility tokens (`@tailwindcss/vite`) with MUI 7 components; `src/shared/lib/cn.ts` (clsx + tailwind-merge) already enforces class composition
- State providers bootstrapped in `src/App.tsx`: TanStack Query 5 `QueryClientProvider`, Jotai atom root, React Router v7 shell
- Image workflow anchored on Konva/react-konva, Fabric, html2canvas, JSZip, and custom perspective math under `src/shared/utils`
- Absolute imports resolved through `@/*` path mapping defined in `tsconfig.app.json` and consumed throughout widgets/features

## Source Topology
```
src/
├── app/                      # (vacant) reserve for providers/config
├── assets/                   # static images
├── features/
│   ├── free-transform/       # hooks + logic for corner/edge manipulation
│   └── image-upload/         # drag & drop uploader + list UI
├── pages/
│   ├── home/                 # landing hero + CTA cards
│   └── image-processor/      # wraps ImageProcessor widget for routing
├── shared/
│   ├── lib/                  # cn helper, reaction utilities
│   ├── stores/               # jotai atoms (selection, modal state)
│   ├── types/                # ImageFile, transform typings
│   └── utils/                # download helpers, math, fabric, konva bridges
├── widgets/
│   └── image-processor/      # Konva canvas, presets, controls
├── App.tsx                   # provider shell + top nav
└── main.tsx                  # StrictMode root
```
- `app/` and `entities/` folders remain empty placeholders; populate when config or domain models mature, keeping FSD import direction intact (`pages` consumes `widgets/features/entities/shared` only)

## Front-End Guardrails
- Keep every `className` routed through `cn(...)`; favor Tailwind tokens over inline styles, pair with MUI `sx` only when unavoidable
- Maintain React.Fragment verbosity (`<React.Fragment>`)—no shorthand fragments per project mandate
- Centralize async ops with TanStack Query; expose mutations/queries as domain hooks under `features/*/hooks`
- Persist shared state through Jotai atoms inside `src/shared/stores`, but surface domain-aware selectors inside `features`
- Prefer icon libraries (MUI Icons, react-icons) rather than emoji for affordances to meet publishing rules
- Avoid spinning up Vite dev server unless the request is explicit

## Build & QA Commands
```bash
npm run dev       # Vite dev server (keep stopped by default)
npm run build     # Type-check + production bundle
npm run lint      # ESLint flat config
npm run preview   # Preview production build
```
- Adopt Vitest/React Testing Library under `tests/` when regression coverage becomes critical

## Immediate Backlog Radar
1. Extract provider wiring (Router, QueryClient, Jotai) into `src/app/providers` for reuse/testing
2. Continue refining `widgets/image-processor` composition for performance (memoization, suspense states)
3. Add persisted storage/replay for transform presets using Jotai atoms + TanStack Query infinite queries when backend endpoints arrive
4. Harden download pipeline with progress UI (JSZip) and failure notifications via MUI `Alert`

## Python Track Placeholder
- No backend present; when introducing FastAPI/Django/Flask, obey the supplied Python FSD directory contract under `src/` (`app/`, `entities/`, `features/`, `shared/`, `services/`, etc.)
- Enforce absolute imports (`from src.entities.user import User`), Pydantic models for every DTO, and exhaustive typing (`from __future__ import annotations`)
- Register global exception handlers, logging setup, and dependency injection modules mirroring the shared blueprint to keep parity with the front-end structure
