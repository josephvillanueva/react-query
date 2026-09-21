# Backlog Board

A product backlog board built with React and TanStack Query. It demonstrates how a data layer should behave in a real product: instant feedback, safe rollback when the server disagrees, and no wasted requests.

**Live demo:** https://react-query-josephvillanueva.vercel.app

## What to try

1. **Move a story** between columns. The board updates immediately and saves in the background.
2. Turn on **Simulate failures** and move a few more. Rejected saves roll the board back and explain why.
3. **Filter** by priority or epic, then switch back. Each filter combination is cached, so returning is instant.
4. **Open a story.** Its details were prefetched when you hovered, and the dialog renders from cached board data with no spinner.
5. Click **Open Query Devtools** to inspect every cache entry live.

## Architecture

![Backlog Board architecture: React components call query hooks, which patch the QueryClient cache and call a simulated API that persists to localStorage](docs/architecture.svg)

Everything runs in the browser. The cache sits between the UI and the simulated API: writes patch it first and keep a snapshot, and a rejected save restores that snapshot and raises a single toast from the `MutationCache`.

## How it works

| Behaviour | Implementation |
|---|---|
| Per-filter caching | Query keys come from a single factory, and list keys include the filters |
| Optimistic updates with rollback | `onMutate` snapshots every cached list, patches them, and restores the snapshot in `onError` |
| Instant detail view | `initialData` is read from any cached list, marked stale so it refreshes in the background |
| Prefetch on intent | Hovering or focusing a card calls `prefetchQuery` |
| No empty flashes | `placeholderData: keepPreviousData` keeps results visible while a new filter loads |
| Pessimistic create | Creating waits for the server, because the server assigns the ID |
| Central error reporting | A `MutationCache` `onError` raises one toast for any failed save |

The backend is simulated in the browser (`src/api/mockApi.ts`) with 350 to 1100 ms of latency and saves to `localStorage`, so the demo deploys as a static site with no server.

## Stack

React 19, TypeScript, TanStack Query 5, Vite 8. No UI library: dialogs use the native `<dialog>` element for focus trapping and Escape to close.

## Running locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── api/
│   ├── types.ts       domain types and labels
│   ├── seed.ts        sample user stories
│   ├── mockApi.ts     simulated backend
│   └── queries.ts     query keys, queries, and mutations
├── components/        board, cards, dialogs, toolbar, toasts
├── queryClient.ts     client defaults and global error handling
├── toasts.ts          small external store for notifications
└── App.tsx
```
