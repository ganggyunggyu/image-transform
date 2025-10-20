# Image Transform Studio – Project AGENT

_Last reviewed: 2025-10-20_

## 1. Product Snapshot
- **Purpose**: Browser workstation for perspective transforms, batch exports, and now frame styling on warped shots.
- **Audience**: Designers/marketers needing quick hero-angle tweaks without desktop apps.
- **Current Focus**: Ship frame presets, stabilise free-transform ergonomics, and prep rotation revamp for later.

## 2. Tech Stack Checklist
- **Runtime**: React 19 + TypeScript 5.8 on Vite 7 (ESM only).
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`; every `className` funnels through `cn()` (`src/shared/lib/cn`).
- **Routing**: React Router DOM v7 (BrowserRouter) with `HomePage` → `/` and `ImageProcessorPage` → `/image-transform`.
- **State**: Jotai atoms in `src/shared/stores/atoms.ts`. Keep atoms serialisable and side-effect free.
- **Data**: TanStack Query v5 provider lives in `App.tsx`; ready for network work.
- **Canvas**: React-Konva + Konva, `use-image` for preloading. Perspective math via OpenCV.js.

## 3. Build & QA Commands
```bash
npm run dev          # Vite dev server (port 6001)
npm run build        # Type-check + production build
npm run preview      # Serve build output
npm run lint         # ESLint w/ typescript-eslint config
```
_Add Vitest/Playwright harnesses when automated coverage starts._

## 4. FSD Layout (alias `@/` enforced)
```
src/
├── app/            # Providers, query client, global wiring
├── pages/          # Route containers (HomePage, ImageProcessorPage)
├── widgets/        # Cross-page shells (image-processor desktop shell)
├── features/       # Business logic (free-transform, upload, presets)
├── entities/       # Domain types/formatters
├── shared/         # UI, lib, stores, utils, types
├── assets/         # Static artwork
```
- Never walk folders with `../../`; stay on `@/` imports.
- Widgets may depend on features/entities/shared only; keep business rules under features.

## 5. Core User Flows (2025-10 update)
- **Upload Panel** (`features/image-upload` + `widgets/image-processor/components/FileSidebar`)
  - Dropzone pushes `ImageFile` objects into `imageFilesAtom`; selecting sets `selectedImageAtom` and triggers Konva preload.
  - Remember to call `clearAllImagesAtom` before unmounting long-lived views to revoke object URLs.

- **Transform Workspace** (`widgets/image-processor/components/TransformWorkspace`)
  - `useTransform` governs stage bounds, corner drag maths, presets, and exposes helpers for direction nudges.
  - `PerspectiveTransformImage` now chains `warpImagePerspective` → `applyFrameToImage` so frame selection affects live preview.
  - Desktop shell only (mobile view removed); zoom + reset controls hug workspace footer.

- **Frame Styling** (NEW)
  - `frameOptionsAtom` stores shape + padding + pending style knobs.
  - `FrameSelector` offers `none | rectangle | rounded | circle | polaroid`; updates cascade to preview/export.
  - `applyFrameToImage` builds a temporary canvas, draws padding/background, and clips per shape.

- **Download** (`shared/utils/download.ts`)
  - Single export uses `downloadWithFolder`; batch path loops with `downloadMultipleWithFolder`.
  - Both utilities fallback to raw downloads if JSZip chokes; revisit error UX once telemetry exists.

## 6. Global State Map
| Atom | Purpose | Notes |
|------|---------|-------|
| `imageFilesAtom` | Uploaded files list | Revoke previews via `clearAllImagesAtom` |
| `selectedImageAtom` | Active file metadata | Resets `imageElementAtom` for fresh preload |
| `imageElementAtom` | Loaded HTMLImage for Konva/OpenCV | Set by `use-image` hook |
| `stageSizeAtom` | Workspace pixel bounds | `ResizeObserver` updates via workspace wrapper |
| `transformBoundsAtom` | Bounding box for original image | Seeds corner points on reset |
| `cornerPointsAtom` | `[Point, Point, Point, Point]` | Use `useTransform` helpers for nudges |
| `transformModeAtom` | `'free' | 'perspective' | 'distort' | 'skew'` | Drives drag behaviour |
| `frameOptionsAtom` | Frame styling config | Default shape `none`; update padding/border when UI unlocks |
| `showAlertAtom` + `alertSeverityAtom` | Status toast | Autoclear after 3s via `showAlertMessageAtom` |
| `canvasScaleAtom` | Zoom percentage | Clamped between 0.2 and 3 in workspace |

## 7. Styling Rules
- Tailwind classes must pass through `cn(...)` utilities; never concatenate strings manually.
- Use long-form `<React.Fragment>` per project style.
- Keep visuals “modern SaaS”: soft gradients, rounded cards, no emoji; reach for SVG/icon components instead.
- Respect default padding/radius scale when extending frame tooling to avoid mismatched spacing.

## 8. External Integrations
- **OpenCV.js** (`shared/utils/_opencv.ts`): lazy loads CDN script once. Always `await loadOpenCV()` before warp and guard `window.cv`.
- **JSZip** (`shared/utils/download.ts`): builds ZIP payloads for single + batch exports; fallback path uses anchors.
- **Fabric.js**: dependency present but unused; remove when bundle trimming becomes priority.

## 9. Outstanding Work / Risks
- Rotation tab + atoms removed; future rotation feature needs fresh design (no accidental reimport of legacy hooks).
- Frame styles currently lack UI for border color/opacity/shadows—when exposing, update `applyFrameToImage` to honour each field.
- OpenCV CDN has no retry/backoff. Add resilience or local bundling before offline-critical release.
- Batch processing loads each image into memory sequentially. Monitor leaks when scaling beyond a few dozen files.

## 10. Contribution Playbook
1. Add new UI under `widgets/image-processor/components` when it orchestrates workspace shell; keep heavy math inside features.
2. Extend Jotai atoms carefully—prefer derived atoms for computed values instead of repeating logic in components.
3. Wrap any async image processing in `try/catch` with toast feedback via `showAlertMessageAtom`.
4. Ensure new downloads route through ZIP helpers for folder naming consistency.
5. Maintain minimal comments; only retain ones explaining non-obvious transforms or math.

## 11. Quick Reference
```tsx
import { applyFrameToImage } from '@/shared/utils';
import { frameOptionsAtom } from '@/shared/stores/atoms';

const dataUrl = await warpImagePerspective({
  imgEl,
  srcSize: { w: imgEl.naturalWidth, h: imgEl.naturalHeight },
  dstStagePoints,
  stageTL: [bounds.x, bounds.y],
  stageSize: bounds,
});
const framed = await applyFrameToImage(dataUrl, frameOptions);
```

```ts
import { frameOptionsAtom } from '@/shared/stores/atoms';

const defaultOptions = getDefaultStoreValue(frameOptionsAtom);
// { shape: 'none', padding: 48, borderWidth: 24, ... }
```

Stay anchored to `widgets/image-processor` for orchestration; most flows originate there.
