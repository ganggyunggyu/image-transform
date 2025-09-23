# image-transform AGENT

## Repository Snapshot
- React 19 + TypeScript + Vite 7 single-page app under `src/`
- UI stack mixes Tailwind CSS 4.x utility classes with MUI 7 components
- Image workflow relies on Konva/react-konva, Fabric, html2canvas, react-dropzone, and JSZip
- Global state currently handled via local component hooks and plain Jotai atoms in `src/shared/stores`
- No backend / Python layer checked in; any future server must mirror the shared FSD guidance below

## Current FSD Layout (front-end)
```
src/
├── App.tsx                // entry shell with tabbed layout
├── assets/                // static assets (images, fonts)
├── features/              // domain-specific logic blocks
│   ├── free-transform/    // transformation hooks (useTransform)
│   └── image-upload/      // drag and drop uploader + list UI
├── shared/                // types, atoms, utils (opencv, download)
├── widgets/               // page-level compositions
│   ├── content-generator/ // AI copy pipeline UI
│   └── image-processor/   // Konva canvas workspace
└── main.tsx               // React bootstrap
```
- `app/`, `entities/`, `pages/`, `widgets/…/components/` have gaps; fill them as the project grows but keep import rules aligned with the provided hierarchy

## Front-End Conventions To Enforce
- Introduce absolute import aliases (`@/shared`, `@/features`, …) in `tsconfig.app.json` and `vite.config.ts`; eliminate deep relative paths
- Add a dedicated `cn` helper under `src/shared/lib/cn` (clsx + tailwind-merge) and wrap every `className` binding with it
- Use `React.Fragment` (no shorthand) when grouping siblings without a container
- Keep state colocated in Jotai atoms; when atoms feed multiple domains, expose selector hooks inside `features/*/hooks`
- Integrate TanStack Query v5 (`@tanstack/react-query`) with a QueryClient wired in the top-level provider layer; prefer it for async fetch/mutation workflows instead of manual axios calls in components
- Maintain Tailwind 4 usage via the Vite plugin; avoid inline styles unless Material UI demands `sx`
- Prefer icon libraries (MUI icons) over emoji for UI affordances to satisfy publishing guidance

## Styling & Design Notes
- Target a modern, clean surface: layered gradients (`bg-gradient-to-br`), subtle shadows, and large hit areas already in use should remain consistent
- When mixing MUI with Tailwind, keep typography and spacing coherent by mapping token sizes (e.g., Tailwind `text-base` ≈ MUI `1rem`)
- Avoid obvious AI phrasing in UI copy; keep Korean prompts conversational and concise

## State & Data Flow
- `widgets/image-processor` drives most interactions; Konva stage dimensions derive from `useTransform`
- `shared/utils/download.ts` bundles processed canvases via JSZip; ensure any new async steps surface progress indicators through Jotai or TanStack Query observers
- Introduce centralized API clients (`src/shared/api`) once backend endpoints exist; wrap axios instances with interceptors in `src/app/provider`

## Build & QA Commands
```bash
npm run dev       # Vite dev server (leave stopped unless explicitly requested)
npm run build     # Type-check + bundle
npm run lint      # ESLint flat config
npm run preview   # Serve production build
```
- Add Vitest or Playwright suites under `tests/` when regression coverage becomes necessary

## Immediate Backlog
1. Path alias + absolute imports
2. Shared `cn` helper + Tailwind class normalization
3. TanStack Query setup with provider scaffold (query client, suspense boundaries)
4. Split mixed concerns in `ImageProcessor.tsx` into sub-features/widgets for maintainability

## Python Track Reminder
- No Python code currently present; if a FastAPI/Django/Flask backend is added, enforce the provided FSD directory contract under `src/` (e.g., `src/app`, `src/entities`, `src/features`, `src/shared`, `src/services`)
- Use absolute imports from `src.*`, Pydantic models for any data schema, and type hint every function (Python 3.8+ target)
- Centralize settings via `pydantic-settings` and register global exception handlers mirroring the shared blueprint

## Coordination Tips
- Default to ASCII in source files; only keep non-ASCII characters when translating user-facing copy
- Do not start local servers unless the user explicitly asks
- Comments should stay minimal—only clarify complex logic or non-obvious trade-offs
