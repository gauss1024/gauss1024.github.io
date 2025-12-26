<!-- Copilot / AI agent instructions for contributors -->
# Urodele — AI assistant guide

Purpose: help an AI coding agent be productive in this repo by surfacing the architecture, workflows, conventions and concrete examples.

- Big picture:
  - This is an Astro-based static blog (Urodele). The site is built with `astro` and TipTap editor content is stored as TipTap JSON (not Markdown).
  - Authoring flow: editor -> TipTap JSON -> `posts/*.json` + assets under `public/post-assets/` -> static build.
  - In dev mode the app uses a local FS adapter (API handlers under `src/pages/api/post/*`) to read/write `posts/*.json` and `public/post-assets/`.
  - In production the app uses a GitHub adapter that commits blobs/trees via Octokit (`src/adapter/github/index.ts`). Adapter selection is in `src/adapter/index.ts` (DEV -> FS, PROD -> Github).

- Key files and folders (start here):
  - `urodele.config.ts` — repo / GitHub settings used by the GitHub adapter.
  - `astro.config.mjs` — Astro configuration.
  - `src/adapter/index.ts` — adapter selection (DEV vs PROD).
  - `src/adapter/github/index.ts` — Octokit usage: creates blobs/trees and commits to `main`.
  - `src/pages/api/post/[id].ts` and `src/pages/api/post/list.ts` — local API used in dev to read/write posts.
  - `posts/` — persisted TipTap JSON files (each post is `*.json`).
  - `public/post-assets/` — uploaded images and assets served statically.
  - `src/editor` and `src/components/Editor` — TipTap configuration and SSR helper `getSSRHTML` (used when rendering post previews on the server).
  - `src/shared/transform.ts` — canonical metadata keys and helpers (`toMeta`, `parseMeta`, `pathToId`).

- Important conventions / patterns (concrete):
  - Post files are TipTap JSON with metadata injected by `toMeta()` (see `src/shared/transform.ts`). Meta keys use internal names like `__ud_title`, `__ud_create_time`, etc.
  - Images uploaded are written to `public/post-assets/<name>` and referenced as `/post-assets/<name>` in content.
  - Dev reads/writes use fetch to `/api/post/:id` (see `src/adapter/fs/index.ts`). To reproduce a write locally, inspect `POST` handler in `src/pages/api/post/[id].ts`.
  - Production writes use Octokit and require a GitHub token stored by the app (the GitHub adapter reads token via `getLocalUser()` in `src/shared/storage.ts`).

- Developer workflows (concrete commands):
  - Install: `pnpm install` (pnpm lockfile present).
  - Local dev: `pnpm dev` (aliases `npm run dev` / `pnpm start`) — uses FS adapter and the local API endpoints under `/api/post/*`.
  - Build for production: `pnpm build` (generates static files). Preview: `pnpm preview`.
  - Production deploy: repository uses GitHub Actions to build and produce a `gh-pages` branch for GitHub Pages (see README for fork/deploy flow).

- Debugging tips specific to this repo:
  - To validate the write flow locally: run `pnpm dev`, open the editor, and inspect network calls to `/api/post/:id` and the `public/post-assets` folder contents.
  - To validate the GitHub commit flow: either run in a deployed environment or force the GitHub adapter by changing `src/adapter/index.ts` (temporary change) — review `src/adapter/github/index.ts` for how blobs/trees/commits are constructed.
  - Use `src/shared/transform.ts` when generating or parsing post JSON to ensure meta keys match existing posts.

- When editing code, prefer minimal, focused changes:
  - Preserve the TipTap JSON shape; mutate metadata via `toMeta()` instead of manual key edits.
  - Avoid renaming `posts/*.json` format or metadata keys without updating `src/shared/transform.ts`, the API logic, and adapter code.

If anything is unclear or you want more examples (sample post JSON, example write flow, or a test harness for the GitHub adapter), tell me which part and I will add it.
