# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (Vite HMR)
npm run build      # tsc type-check + Vite production build
npm run lint       # ESLint
npm run preview    # serve the production build locally
```

There is no test runner configured yet.

## Architecture

This is a React 19 + TypeScript SPA built with Vite. The stack:

- **Routing** — React Router v7 (file: `src/App.tsx` is the root, pages live in `src/pages/`)
- **Server state** — TanStack Query v5; all fetching goes through `src/api/`, consumed via hooks in `src/hooks/`
- **Client state** — Zustand store at `src/store/fusebox.store.ts`; a single store holds `panels` and `selectedPanelId`
- **Drag and drop** — `@dnd-kit/core` + `@dnd-kit/sortable`; wrap sortable lists in `DndContext` + `SortableContext`
- **HTTP** — Axios; instantiate a configured client in `src/api/` (base URL, auth headers, interceptors)
- **Styling** — Bootstrap 5 utility classes; imported globally in `src/main.tsx`; `src/App.css` is intentionally empty

## Domain model

Defined in `src/types/index.ts`:

- **`Fuse`** — a breaker slot: `id`, `pos` (slot number), `label`, `amp` (`number | 'GFCI'`), `tripped?`
- **`Panel`** — a physical fuse panel with a name and location (reserved for multi-panel support)
- **`DragState`** — `{ draggingId, overPos }` passed down to `Slot` and `FuseCard`
- **`AmpValue`** — `number | 'GFCI'`; amp metadata and helpers live in `src/constants/amps.ts`

## Component tree

```
App                        ← all panel state lives here (no Zustand yet)
  Topbar (inline JSX)
  Configbar
    Stepper                ← ±1 stepper control
  MainBreaker              ← toggle switch + rating display
  Slot[]                   ← one per panel position
    FuseCard               ← filled slot; draggable
      AmpBadge             ← color-coded amp label
    (empty slot button)
  FuseForm                 ← add / edit sidebar card
  StatsCard                ← installed / tripped / load / utilization
  Legend                   ← amp color key
```

Shared SVG icons are named exports from `src/components/Icons.tsx`. Drag-and-drop uses the native HTML5 API (not dnd-kit).
