# Architecture

## The shape of it

```
domain/   pure business rules, no React, no browser
  ↓
state/    client state and interaction rules, React context
  ↓
components/  presentation
  ↓
routes/   URLs and boundaries
```

Dependencies only point downward. `domain/` imports nothing from the layers
above it, which is why it can be unit tested without a DOM and why the pricing
rules can be read in one sitting.

## Why the domain layer exists

The prototype this grew from put the whole Advertise product in one 2,817-line
`@ts-nocheck` file, with prices computed inline in JSX and mock data declared
next to the markup that rendered it. That file was excluded from typechecking,
so nothing verified that the summary rail, the review table and the
confirmation dialog agreed about what a booking cost.

Now there is exactly one function that prices a booking — `quote()` in
`domain/pricing.ts` — and every figure on screen reads from it. The discount
stack is applied in a documented order and covered by tests, so a change to
the rules shows up as a failing test rather than as two panels quietly
disagreeing.

## The pricing model

In order, from `domain/pricing.ts`:

1. **Day rate** — for each date, the sum over selected spaces of
   `round(basePrice × positionMultiplier × dayFactor)`, where `dayFactor` is
   the campaign multiple inside a campaign period, `1.09` at the weekend, and
   `1` otherwise. Rounding happens per space per day so every total is the sum
   of figures an advertiser could check by hand.
2. **Own dates** — the day rates over the range, less the duration deal (5% for
   a full week, 10% for a full month).
3. **Campaign weeks** — the campaign day rate times the days taken, less 15%
   when the whole period is booked.
4. **Bundle** — 5% off all media cost, and only with two or more spaces.
5. **Design fee** — Rs. 12,500 when Koko creates the artwork.
6. **Payment** — +5% on seller credit, +2% on card, −2% on JustPay, applied to
   the subtotal.

Steps 5 and 6 are revealed progressively: `quote()` takes a `QuoteStage`, and
the funnel only switches on the design fee once the Assets step is reached and
the payment adjustment once the advertiser is on Payment. The total never moves
for a reason they have not been shown.

Before any dates exist, `quote()` returns zero rather than guessing, which is
why the summary reads `Rs. 0.00` instead of a speculative figure.

## The funnel

`state/funnel.ts` is the step model. It answers four questions in one place:

- **Which steps exist?** Assets only appears when a selected space needs
  artwork. A booking of store thumbnails goes straight from Positions to
  Payment.
- **Is this step complete?** What gates the primary button.
- **How far can this draft legitimately go?** Deep links beyond it redirect to
  the step that still needs answering, rather than showing a payment page for
  an empty basket.
- **Which parts of the price are live yet?**

Each step is a route under `/book`, sharing one draft held in the authenticated
layout. The draft therefore survives moving between Advertise and the funnel,
and is written to storage so a reload mid-booking does not lose the work.

## State

| Module | Holds |
| --- | --- |
| `state/session.tsx` | Who is signed in. Prototype auth: credentials checked in the browser, session in local storage. The single place to swap for a real identity provider. |
| `state/bookings.tsx` | Bookings the advertiser has made, persisted, merged over the seeded history. |
| `state/booking-draft.tsx` | The draft and every rule for changing it: changing dates clears the duration deal, removing a space cancels the bundle, choosing a campaign replaces the previous one. |
| `state/storage.ts` | Namespaced local storage that never throws — the app is server rendered, and private-mode browsers refuse storage outright. |

Keeping the interaction rules in one reducer is deliberate. Scattered across
the components that trigger them, rules like "changing the dates invalidates
the deal priced off the old ones" are invisible until they are broken.

## Rendering

The app is server rendered by TanStack Start, but the session lives in local
storage, which the server cannot see. Rather than pretending otherwise, the
session has three states — `loading`, `authenticated`, `guest` — and the guard
holds a quiet placeholder through `loading` instead of flashing the sign-in
page at someone who is already signed in.

## Accessibility

The pages pass axe with no violations at WCAG 2.1 AA. The decisions worth
knowing about:

- Placement cards are clickable but carry no role of their own. The Select and
  Details buttons inside them are the accessible controls; making the card a
  button too would nest interactive elements.
- Muted text is darkened within `[data-portal="advertiser"]`
  (`src/advertiser/theme.css`). The inherited grey clears 4.5:1 on white but
  falls to about 3.7:1 on the muted surfaces used for table headers and
  segmented controls. The override is scoped so the merchant portal reference
  renders as exported.
- The small "Your ad" chips use a darker step of the highlight purple. White on
  the brand `#9356ff` is 3.9:1, and these chips are 8 to 9px.
- Phone mockups are marked decorative: the card around them already names the
  space in text.
- Every animation is dropped under `prefers-reduced-motion`, including the
  recap confetti.

## Testing

125 tests, all on `domain/` and `state/`, run with `npm run test`. They cover
the rules where a mistake costs money or trust: rounding, campaign multiples
beating the weekend boost, the order savings stack in, progressive fee reveal,
the breakdown always summing to the total, lead time and occupied dates, the
creative spec boundaries, and the draft reducer's interaction rules.

The UI is verified in a real browser during development rather than through
snapshot tests, which tend to pin markup rather than behaviour.

## Putting this on a real backend

The prototype boundaries were drawn where the real seams are:

| Today | In production |
| --- | --- |
| `domain/inventory.ts`, `domain/campaigns.ts` | An ops-configured inventory and campaign service. |
| `domain/availability.ts` — occupancy simulated at today+7 and today+13 | Real availability per space *and position*, with the 30-minute slot hold enforced server side. |
| `domain/pricing.ts` | The same rules, evaluated on the server. The client may quote; the server must be what charges. |
| `domain/creative.ts` — checks run in the browser | The same checks re-run server side. A client-side pass is a courtesy, not an approval. |
| `domain/performance.ts` | The reporting service. |
| `state/session.tsx` | Real authentication and sessions. |
| `state/bookings.tsx` | The bookings API. |
| Engagement ladder, "9 out of 10 merchants", campaign multiples, `FIRST_TIME_SHARE` | Platform benchmarks. These are prototype placeholders and are marked as such in the code. Shipping them as though they were measured would be dishonest. |

The pricing engine is written as pure functions over plain data specifically so
the same module can run on both sides of that boundary.
