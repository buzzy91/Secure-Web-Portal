# Crypto.com Dashboard

A React dashboard for viewing cryptocurrency markets, portfolio activity, transactions, community content, and recovery tools.

## Run & Operate

- Start or restart the managed `artifacts/crypto-dashboard: web` workflow to run the app.
- `pnpm --filter @workspace/crypto-dashboard run typecheck` — typecheck the dashboard.
- `pnpm install --filter @workspace/crypto-dashboard... --frozen-lockfile` — install the dashboard and its required workspace dependencies.
- The workflow supplies `PORT` and `BASE_PATH`; no user-provided environment variables are currently required.

## Stack

- pnpm workspaces, TypeScript 5.9
- React 19 + Vite 7
- Tailwind CSS 4
- Wouter routing, TanStack Query, Recharts, and Radix UI

## Where things live

- `artifacts/crypto-dashboard/` — the dashboard web app.
- `artifacts/crypto-dashboard/src/pages/` — route-level screens.
- `artifacts/crypto-dashboard/src/components/` — shared UI.
- `artifacts/crypto-dashboard/src/context/` — local authentication and transaction state.
- `artifacts/crypto-dashboard/src/services/` — external market-data access.

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
