# Koko Merchant Portal — Project Context

> This document exists so that any developer or LLM opening this zip cold can understand
> what the project is, how it is structured, and the intent behind the logic. Read this
> before editing. Companion docs: `BUSINESS-UX-LOGIC.md` (original business brief) and
> `AGENTS.md` (agent instructions from the original Lovable export).

## What this is

A **prototype merchant portal for Koko**, a Sri Lankan BNPL / shopper app
(prices in LKR, "Rs."). Merchants log in to manage orders, QR payments, finance —
and, the main focus of recent work, **"Advertise with Koko"**: a self-serve flow where
merchants buy fixed-price ad placements inside the Koko shopper app.

This is a demo/prototype: there is no backend. All data is mocked in the components.
Login is `test` / `test`. The default landing page after login is **Advertise with Koko**,
and every other sidebar item is intentionally disabled (greyed out) for demo focus.

## Stack

- **Vite 8 + TanStack Start/Router (SSR) + React 19**, deployed as a Cloudflare Worker
  via nitro (`npm run build` produces `.output/`). Dev: `npm install && npm run dev`
  (or the `.claude/launch.json` config, port 3200).
- **Tailwind CSS v4** (config-less, `src/styles.css` imports), shadcn/ui components in
  `src/merchant/components/ui/`, Recharts for charts, Heroicons + Lucide icons.
- Font: Plus Jakarta Sans (global). Assets resolve via a custom `figma:asset/<file>`
  alias → `src/figma-assets/` (see `vite.config.ts`).

## Key files

| File | What it is |
|---|---|
| `src/merchant/components/AdvertiseWithKoko.tsx` | **The whole Advertise product**: landing, booking flow, My advertisements, Performance, recap. ~2600 lines, all mock data at top of relevant sections. |
| `src/merchant/components/MerchantPortal.tsx` | App shell: sidebar, nav, page switching, and the **demo tooling** (Flows / Alternate UI / Simulator / Demo switcher buttons + overlays). |
| `src/merchant/components/Login.tsx` | Login page. Source of the **pastel gradient** used across the design (see Design language). |
| `src/merchant/components/NavigationData.ts` | Sidebar items. Advertise uses `DevicePhoneMobileIcon`. |
| `src/_globals.css` | Global styles + custom keyframes: `adpulse` (ad-highlight pulse), `badgeShine` (badge shine swipe), `confettiFall` (recap confetti). |
| `src/figma-assets/` | App screenshots for phone mockups, metric GIFs (`metric-*.gif`), Koko logo (`09ac28…png`) and pastel KOKO wordmark (`2fb784…png`). |

## Design language (unified across the Advertise flows)

- **CTAs**: `rounded-lg`, `font-medium`; primary = `bg-gray-900` (hover 800), secondary =
  bordered outline. No pill buttons except the floating selection bar (deliberate).
- **Selection states**: dark `border-gray-900` + subtle ring; radio dots
  (`Radio` component) — never "Selected ✓" text chips.
- **Badges**: `Tag` component (11px bold uppercase, `px-3 py-1.5`, rounded-full).
  Tones: blue `#BDDCEE` (recommendation), emerald (success/status), amber (attention).
- **Hero badges**: `ShinyTag` — pastel gradient + animated shine swipe. Used for
  "Most popular" (campaign card) and "Fastest approval" (assets card).
- **`PASTEL_GRADIENT`** constant = the login page gradient
  (`#BDDCEE → lavender → pink`). Used by ShinyTag, the selected "✓ Selected" card
  button, and the recap modal background.
- **Semantics**: green = something the user confirmed; blue = something Koko recommends;
  amber = needs attention; dark blue text = fees; green text = discounts.
- **Animation**: `Collapse` component (grid-rows 0fr→1fr transition) for all
  expand/collapse; entry animations via tw-animate-css; everything respects
  `prefers-reduced-motion`.

## The Advertise with Koko product logic

### Landing page (`ExploreView` + `PlacementPicker`)
Header → intro → three metric cards (animated GIF icons: people 2.5M, shoppers 600K/mo,
new users 35K/mo) → **"Choose where you want to be seen"**: 6 placement cards
(hero banner, secondary banner, trending, empty search, shop page, post-checkout).
Each card shows a real app screenshot in a phone mockup with a purple **"Your ad"**
highlight that is always visible and glows/pulses on hover (zone tints `#BDDCEE`).
Multi-select; a floating dark bar summarizes the selection and starts a booking.

Two landing variants (see Alternate UI below): **no-price (default)** — no prices,
stat labelled "estimated store visits / 7 days", stacked full-width CTAs (Select space
above Details), no sort toggle; **priced (alternate)** — weekly prices, discounts,
Most viewed / Cheapest sort.

### Booking flow (`BookingFlow`)
Steps: **Select dates → (Spaces, flow 2 only) → Positions → Assets (only if a banner
placement is selected) → Payment**. Stepper is left-aligned; content in a centred
`max-w-4xl` column; **booking summary lives at the bottom** (deliberate hierarchy:
content → totals → CTA).

1. **Select dates**: chooser cards (radio) — "Koko campaign week" (KOKO wordmark image
   in the title, ShinyTag "Most popular", green benefit ticks, selected by default) vs
   "Custom dates". Campaign: grid of ~10 campaign weeks; **one campaign per booking** —
   selecting focuses that card (others hide), chunked with its fixed-date picker
   (day counter chip: amber 0/N alert → green N/N), "Book full period" saves 15%.
   Unselect button restores the grid. Custom dates: 30-day window calendar (month/year
   selects only), lead-time (3 days) and already-booked dates blocked, weekend +9%,
   campaign-tinted days; "Currently selected" emerald bar; **one upsell at a time** —
   1–6 days → full-week (−5%), 8–21 days → full-month (−10%).
2. **Positions**: accordion per selected space (amber alert icon until picked → green
   check), position options with engagement multipliers (hero slide 1 = 1.35× price),
   phone preview with carousel. **Bundle upsell** (pair a second space, −5% on
   everything) shows **only** when exactly one space is selected AND its position is
   picked, and disappears once taken (green confirmation banner replaces it).
   Edit + red Remove links per space.
3. **Assets**: Koko designs it (Rs. 12,500, ShinyTag "Fastest approval", default) vs
   own upload (spec-checked client-side: ≤5MB, JPG/PNG, ≥1600×640). The design fee
   only enters the summary once this step is reached.
4. **Payment**: review rows with per-row **Edit** links (jump back to the right step);
   methods — Koko seller credit (default, "Fastest & most convenient" tag,
   **+5% convenience fee**), Card (+2% fee), JustPay (−2% discount). Fee lines are
   dark blue, discounts green, with computed amounts when selected.
   **Confirm and pay opens an "Are you sure?" recap dialog** (space, dates, method,
   total, no-cancellation warning) before anything "charges".

Pricing model: per-day base price × position multiplier × day factor (campaign multiple
or weekend 1.09) summed over days; savings = duration deals + bundle; summary shows
**Rs. 0.00 until dates are picked** and "Slot charge" only after positions are chosen.

### My advertisements (`CampaignsView`)
Stats strip + bookings table (desktop) / cards (mobile). The **campaign recap**
(`CampaignRecap` + `Confetti`) is a Spotify-Wrapped-style celebration modal on the
pastel gradient with falling confetti, four stat tiles, a dark sales panel (8.1× ROAS),
and "Book this space again". Triggered via the Simulator (see below).

### Performance (`PerformanceView`)
- Granularity filter: **Day / Week / Month / Year**.
- Five clickable metric cards — **Store visits, Total orders, Order value for period,
  Average order value, Total spent on advertising** — with trend chips; **the active
  card decides what the chart plots**, so cards and chart always agree.
- Data (`PERF_BUCKETS`) is deliberately realistic mock data: irregular curves, weekend
  bumps, an April (Avurudu) spike, ad spend that steps as slots start, calendar-true
  labels ending "today" (24 Aug 2026), and a partial "2026 YTD" year. All totals are
  sums of the plotted buckets; orders ≈ 0.07% of visits; AOV ≈ Rs. 13–15K.
- **My advertisements table**: rows are clickable → `BookingDetail` dialog with six
  stat tiles (incl. ROAS) and a dual-axis visits/orders daily chart.

## Demo tooling (sidebar, above the campaign banner)

Four dashed buttons, top to bottom (desktop sidebar only):

1. **Flows** — overlay with links to the two Figma boards (UX logic flow, merchant
   user flow). Open in new tabs.
2. **Alternate UI** — switches landing design: `nopriced` (default) vs `priced`.
   Persisted in `localStorage['koko-ui-variant']`, passed as `showPrices` prop.
3. **Simulator** — demo state triggers. Currently one: **"Advertisement period ended"**
   → jumps to My advertisements and fires the confetti recap. Implemented as an
   incrementing counter prop (`simulateRecap`) so it can fire repeatedly.
4. **Demo switcher** — flow variant: `default` (Flow 1: landing cards → book) vs
   `cta` (Flow 2: landing shows one big CTA; the placement cards become a "Spaces"
   step inside the booking flow). Persisted in `localStorage['koko-demo-flow']`,
   passed as `flow` prop. **Flow and UI variant are independent** (4 combinations).

Switching either remounts `AdvertiseWithKoko` (key includes both values).

## Responsiveness

Desktop is the primary design. Mobile (375px) and tablet (768px) adjustments:
- Placement/metric grids use `minmax(min(100%,Npx),1fr)` so they can't overflow.
- The floating selection bar stacks vertically (rounded-2xl, full-width CTA) under `sm`.
- Flow 2 big CTA, week/month upsell CTAs: full-width on mobile.
- Payment review rows wrap; perf metric values scale down (`text-xl sm:text-[26px]`).
- Tables scroll horizontally inside `overflow-x-auto` (intentional pattern).
- My advertisements has a dedicated mobile card layout (`md:hidden`).

## Gotchas for future editors

- `figma:asset/…` imports are resolved by a custom plugin in `vite.config.ts`;
  files must exist in `src/figma-assets/`.
- Most components are in the **single large file** `AdvertiseWithKoko.tsx` on purpose
  (prototype speed). Mock data lives at the top of each section.
- `positionsComplete` requires ≥1 space (`[].every` is true — guarded).
- The campaign picker content stays mounted inside `Collapse` while a campaign is
  focused, so closing animates; visibility checks in tests must use bounding rects.
- Dark mode classes exist throughout but the demo is light-mode-first.
- Dates in mock data assume "today" ≈ 24 Aug 2026 (calendar lead-time logic uses the
  real system clock; performance labels are static strings).
