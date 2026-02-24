# Image Transform Desktop – AGENTS Guide

Scope: entire repository

Summary
- React 19 + TypeScript + Vite 7 (Tailwind v4, TanStack Query, Jotai).
- Desktop wrappers pre-wired: Tauri 1.x (Rust) and Electron 33 (TypeScript main process).
- Core web UX stays untouched; wrappers just load the existing build.

Rules (carry-overs)
- Absolute imports only (`@` → `src`).
- Wrap every `className` with `cn(...)` from `shared/lib`.
- Prefer `<React.Fragment>` long form.
- Styling = Tailwind + SVG icons, never emoji.
- Comments for non-obvious behaviour only.

Desktop Wrappers
1) Tauri (Rust)
   - Files: `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `src-tauri/src/main.rs`.
   - Config loads Vite dev server at `http://localhost:6001`, bundles `dist/` for release.
   - Scripts:
     - `npm run tauri:dev` → launches Vite then Tauri shell.
     - `npm run tauri:build` → `npm run build` + native bundler (dmg/app/msi/nsis).
   - Allowlist keeps only `shell-open` enabled; expand if native FS/dialog access is required.
   - Prereqs: Rust toolchain (`rustup`), `@tauri-apps/cli` (already in devDeps).

2) Electron (TypeScript main process)
   - Files: `electron/main.ts`, `electron/tsconfig.json` (outputs ESM → `electron/dist/main.js`).
   - Scripts:
     - `npm run electron:dev` → runs Vite + waits for port 6001, compiles main process, then launches Electron.
     - `npm run electron:build` → `npm run build`, compile main process, package via `electron-builder` (mac dmg/zip, win nsis/zip → `release/`).
   - `package.json` `main` points at build output for production; update if you relocate files.
   - Add native bridges with IPC (`contextIsolation: true` in place); keep renderer logic in React.

3) Python wrapper (optional)
   - FastAPI + PyInstaller path still viable for heavy offline transforms.
   - Host API in `src/services`, surface UI with `pywebview`. Keep requests typed with Pydantic models.

Commands Snapshot
```bash
npm run dev               # web only
npm run tauri:dev         # desktop preview (Tauri)
npm run tauri:build       # native bundles
npm run electron:dev      # desktop preview (Electron)
npm run electron:build    # Electron installers
```

Key Files
- `src-tauri/tauri.conf.json` – schema 1 config, devPath `http://localhost:6001`, bundle targets dmg/app/msi/nsis.
- `src-tauri/src/main.rs` – minimal builder; extend with `invoke` handlers when native actions are needed.
- `electron/main.ts` – TypeScript main process, protects external links via `shell.openExternal`.
- `package.json` – new scripts + `build` block (electron-builder) + desktop dependencies.

Ship Checklist
1. Install deps (`npm install`) – lockfile currently needs refresh after adding desktop packages.
2. For Tauri: `rustup target add x86_64-pc-windows-msvc` on mac if building Windows binaries via cross.
3. For Electron: ensure `electron-builder` codesign settings (mac) or NSIS config as needed.
4. Keep Vite port 6001 stable; update both wrappers if you change it.

Notes
- No runtime gating added yet. If desktop-only UI appears, guard with environment flags (`window.__TAURI__`, `window.electron`) via TanStack Query context or custom hooks.
- When adding native APIs, document them here and expose typed wrappers under `shared/api`.
