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
- **Styling** — All component styles live in `src/index.css` as plain CSS classes, grouped by component under labelled section comments (e.g. `/* ============ USER MENU ============ */`). Do not use inline styles or CSS modules — always add new styles to `index.css` and reference them via `className`.

## Interfaces convention

**Required:** Every **shared or reusable** interface or type alias lives in its own file under `src/interfaces/` (e.g. `src/interfaces/Fuse.ts`). File names do not carry the `I` prefix — only the interface name inside does. `src/interfaces/index.ts` is a barrel that re-exports everything — it must never contain type definitions directly. When adding a new type, create its file first, then add the `export type { … } from './…'` line to the barrel.

**Exception:** Component-local props interfaces may be co-located in their component file (e.g. `IFuseCardProps` inside `FuseCard.tsx`), since they are never reused elsewhere. They must still use the `I` prefix.

**Required:** All interfaces must be prefixed with `I` (e.g. `IFuse`, `IPanel`, `IDragState`). The `I` prefix applies only to the interface name — not to function names, variable names, component names, or UI text.

## Domain model

Defined in `src/interfaces/` (barrel at `src/interfaces/index.ts`):

- **`IFuse`** — a breaker slot: `id`, `pos` (slot number), `label`, `amp` (`number | 'GFCI'`)
- **`IPanel`** — a physical fuse panel with a name and location (reserved for multi-panel support)
- **`IDragState`** — `{ draggingId, overPos }` passed down to `Slot` and `FuseCard`
- **`AmpValue`** — `number | 'GFCI'`; amp metadata and helpers live in `src/constants/amps.ts`
- **`IAmpRating`** — amp display metadata (color, label, tone); used by `AMP_RATINGS` in `src/constants/amps.ts`
- **`IPanelBody`** — HTTP request shape for create/update panel API calls
- **`IFuseBoxState`** — Zustand store shape for `useFuseBoxStore`

## Translations (i18n)

**Required:** All user-visible strings must be translated. Never hard-code UI text in components.

- Library: `i18next` + `react-i18next`; configured in `src/i18n/index.ts`
- Translation files: `src/i18n/en.json` (English) and `src/i18n/bg.json` (Bulgarian)
- Use the `useTranslation` hook and the `t()` function: `const { t } = useTranslation()`
- Keys are namespaced by component/page (e.g. `fuseForm.cancel`, `panelPage.print`)
- When adding a new string: add the key to **both** `en.json` and `bg.json` under the appropriate namespace
- For plurals use the `_one` / `_other` suffix convention (e.g. `slotsAvailable_one`, `slotsAvailable_other`)
- For interpolated values use `{{variable}}` syntax (e.g. `"installInSlot": "Install in Slot {{slot}}"`)
- Language preference is stored in `localStorage` under the key `fuse-box-lang`; supported locales are `en` and `bg`

## Accessibility

**Required:** All UI changes must meet WCAG 2.1 AA. Before marking a UI task done, verify these:

- **Semantic HTML** — use the correct element for the job (`<button>` for actions, `<a>` for navigation, `<label>` for form fields). Never make a `<div>` or `<span>` interactive without `role` + `tabIndex`.
- **ARIA labels** — every interactive element without visible text needs `aria-label` or `aria-labelledby`. Icon-only buttons must have an `aria-label`.
- **Keyboard navigation** — all interactive elements must be reachable and operable via keyboard. Focus order must follow visual order.
- **Color contrast** — text and interactive elements must meet 4.5:1 contrast ratio (3:1 for large text). Never rely on color alone to convey meaning (e.g. amp ratings in `Legend` must also use text labels).
- **Focus indicators** — never remove the default outline without replacing it with a visible custom style.
- **Form fields** — every `<input>` and `<select>` must have an associated `<label>` (via `htmlFor` / `id` or `aria-label`).
- **Images / SVG icons** — decorative icons get `aria-hidden="true"`; meaningful icons need `aria-label` or a visually-hidden text sibling.

Run a Lighthouse accessibility audit (`F12 → Lighthouse → Accessibility`) on any page touched by a UI change and resolve issues with a score below 90.

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
