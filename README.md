# Koko Advertiser Portal

A self-serve portal where merchants buy advertising space inside the Koko
shopper app. Pick a space, choose your dates, pay the price on screen. Fixed
prices, no bidding, first come first served.

This is a **prototype**: there is no backend. All inventory, pricing, campaign
and reporting data is defined in `src/advertiser/domain/`, and bookings the
advertiser makes persist in the browser rather than on a server. The code is
written the way a production app would be — strictly typed, tested, and with
the business rules kept out of the UI — so the data layer can be swapped for
real services without rewriting the product.

## Running it

```bash
npm install
npm run dev          # http://localhost:8080
```

Sign in with `test` / `test`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build into `.output/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Unit tests |
| `npm run lint` | ESLint |
| `npm run check` | Typecheck, lint and tests together |

## What is in here

| Path | What it is |
| --- | --- |
| `src/advertiser/domain/` | The business rules. Pure, typed, no React. Inventory, campaigns, pricing, availability, creative spec, payment, bookings, reporting. |
| `src/advertiser/state/` | Client state: session, persisted bookings, the booking draft reducer, and the funnel step model. |
| `src/advertiser/components/` | The product UI, grouped by surface. |
| `src/routes/` | File-based routes (TanStack Router). |
| `src/components/ui/` | shadcn/ui primitives. |
| `src/merchant/` | The original Koko merchant portal export, kept verbatim at `/merchant` as a design reference. Not part of the product, and excluded from linting so it stays as exported. |

## Routes

| Route | Surface |
| --- | --- |
| `/login` | Sign in |
| `/` | Advertise: the six bookable spaces |
| `/book/dates` | Campaign weeks or your own dates |
| `/book/positions` | Where in each rotation |
| `/book/assets` | Artwork, when a banner space is booked |
| `/book/payment` | Review and pay |
| `/book/confirmation` | Thank you |
| `/bookings` | Everything you have booked |
| `/performance` | What your advertising returned |
| `/merchant` | The original merchant portal, for reference |

Each funnel step has its own URL, so the browser back button works and steps
are linkable. A deep link further ahead than the draft supports redirects to
the step that still needs answering.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the layers fit together
  and why, plus what has to change to put this on a real backend.
- [`BUSINESS-UX-LOGIC.md`](BUSINESS-UX-LOGIC.md) — the original business brief:
  every pricing rule and UX decision, written before the build.
- [`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md) — context for the merchant portal
  prototype this grew out of.

## Stack

Vite 8 · TanStack Start and Router (SSR) · React 19 · Tailwind CSS v4 ·
shadcn/ui · Recharts · Vitest. Builds to a Cloudflare Worker via nitro.
