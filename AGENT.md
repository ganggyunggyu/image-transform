# Image Transform Studio – Project AGENT

_Last reviewed: 2025-03-07_

## 1. Product Snapshot
- **Purpose**: Browser-based workstation for perspective/rotation transforms on uploaded images with instant preview and zipped exports.
- **Audience**: Designers/creatives needing quick skew/warp adjustments without desktop tools.
- **Current Focus**: Completing modern FSD refactor, polishing responsive workspace, wiring download paths for every mode.

## 2. Tech Stack Checklist
- **Runtime**: React 19 + TypeScript 5.8, Vite 7 (ESM only).
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`, all `className` go through `cn()` (`src/shared/lib/cn.ts`).
- **Routing**: React Router DOM v7 (BrowserRouter), two routes (`/`, `/image-transform`).
- **State**: Jotai atoms under `src/shared/stores/atoms.ts` (no Redux). Keep atom side-effects pure and revoke previews on cleanup.
- **Server Comms**: Axios configured ad-hoc when needed. TanStack Query v5 already bootstrapped in `App.tsx`; default options set, but no queries yet.
- **Canvas**: React-Konva + Konva core. `use-image` handles HTMLImage loading.
- **Utilities**: OpenCV.js loaded from CDN (`src/shared/utils/_opencv.ts`), html2canvas & JSZip ready for exports, Fabric.js reserved (unused atm).

## 3. Build & QA Commands
```bash
npm run dev          # Vite dev server (port 6001)
npm run build        # Type-check + production build
npm run preview      # Serve build output
npm run lint         # ESLint w/ typescript-eslint config
```
_Add tests as Vitest/Playwright if coverage work starts; none exist yet._

## 4. FSD Layout (enforced with `@` alias)
```
src/
├── app/            # global providers, config placeholders (currently empty)
├── pages/          # route-level containers (HomePage, ImageProcessorPage)
├── widgets/        # cross-page blocks; `image-processor/` owns desktop/mobile shell
├── features/       # functional slices (free-transform, image-upload)
├── shared/         # lib, utils, stores, types
├── assets/         # static assets
```
- Never climb directories with `../../` — always import via `@/`.
- Widgets may reach into features/entities/shared only; keep business logic inside features.

## 5. Core User Flows
- **Upload** (`features/image-upload`)
  - `ImageUploader` handles drop/click, filters `image/*`, emits `ImageFile` records with `URL.createObjectURL` previews.
  - `ImageList` displays selectable thumbnails, updates `selectedImageAtom`.
  - Remember to call `clearAllImagesAtom` to revoke URLs before unmount to avoid leaks.

- **Transform Workspace** (`widgets/image-processor/components`)
  - `TransformWorkspace` sets Konva stage bounds via `ResizeObserver` (syncs `stageSizeAtom`).
  - `useTransform` (features/free-transform) stores corner/edge positions, offers helpers for presets, edge drags, perspective export (`generatePerspectiveImage`).
  - `PerspectiveTransformImage` invokes `warpImagePerspective` after OpenCV initialisation and clips the transformed bitmap back onto the stage.
  - Desktop shell shows `FileSidebar` + `Workspace` + `SettingsSidebar`; mobile shell collapses into tabbed panels and floating CTA.

- **Download**
  - `downloadWithFolder` / `downloadMultipleWithFolder` wrap JSZip output. Ensure MIME/quality pulled from `_format.ts` before saving in future enhancements.
  - Rotation tab currently surfaces TODO (“준비 중”). Implement pending business logic before claiming parity.

## 6. Global State Map
| Atom | Purpose | Notes |
|------|---------|-------|
| `imageFilesAtom` | Uploaded file list | Use `clearAllImagesAtom` to revoke previews |
| `selectedImageAtom` | Active image metadata | Resets rotation/flip on change |
| `imageElementAtom` | Loaded HTMLImage for Konva/OpenCV | Set via `use-image` hook in desktop workspace |
| `cornerPointsAtom` | `[Point, ...]` for warp polygon | Keep coordinates within `stageSize` bounds |
| `transformBoundsAtom` | Bounding box around original texture | Updated on `resetTransform` |
| `activeTabAtom` | `0`=Transform, `1`=Rotation | Mobile & desktop share |
| `rotationAtom`, `flipHorizontalAtom`, `flipVerticalAtom` | Rotation controls | UI present, export pending |
| `showAlertAtom` + `alertSeverityAtom` | Toast messaging | Use `showAlertMessageAtom` helper |

## 7. Styling Rules of Engagement
- Only Tailwind classes merged through `cn(...)` — never raw template strings.
- React fragments must be the long form `<React.Fragment>` per project convention.
- Keep interactions “modern SaaS”: gradients, glassmorphism touches, but avoid emoji per publishing guide.
- Remove legacy `App.css` scaffolding when redesign stabilises; `#root` styles conflict with fixed header layout.

## 8. External Integrations
- **OpenCV.js**: Lazy-loaded script (`https://docs.opencv.org/4.x/opencv.js`). Check `window.cv?.ready` before triggering warp. When adding features, respect single-flight `cvReadyPromise`.
- **JSZip**: Running in browser; convert base64 payloads using `base64ToBlob` helper before zipping.
- **Fabric.js**: Declared dependency but unused. Confirm need before shipping to reduce bundle size.

## 9. Outstanding Work / Risks
- Rotation tab download flow stubbed — finish image matrix math before release.
- Mobile workspace: drag gestures rely on Konva defaults; test multi-touch to avoid ghost moves.
- OpenCV CDN dependency has no offline fallback; consider bundling WASM or retry logic.
- Memory pressure risk when batching large images; monitor `URL.createObjectURL` usage and add cleanup on atom reset.

## 10. Contribution Playbook
1. Create feature slice under `src/features/<feature-name>` with `model/`, `lib/`, `api/`, `ui/`, `hooks/` subdivisions when it grows.
2. Use Jotai atoms for shared state; derive computed values via getter atoms instead of React state duplication.
3. Wrap network calls with TanStack Query for caching/invalidation (see `App.tsx` provider).
4. Keep per-device logic inside widgets (desktop/mobile components) instead of scattering media queries across feature layers.
5. Respect no-comment policy unless explaining non-obvious math/transforms.

## 11. Quick Reference Snippets
```tsx
// Accessing transform presets inside a widget
actionButton.onClick(() => {
  applyPresetTransform('expand');
  showAlertMessage('프리셋을 적용했어요', 'info');
});
```

```ts
// Loading OpenCV before warp
await loadOpenCV();
const result = await warpImagePerspective({
  imgEl,
  srcSize: { w: imgEl.naturalWidth, h: imgEl.naturalHeight },
  dstStagePoints,
  stageTL: [bounds.x, bounds.y],
  stageSize: bounds,
});
```

---
For anything unclear, audit `src/widgets/image-processor` first; it orchestrates nearly every flow.
