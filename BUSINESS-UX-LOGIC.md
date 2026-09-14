# Advertise with Koko — Business & UX Logic

This document records every business rule, pricing formula, and UX decision built into the
Advertise with Koko prototype (`src/merchant/components/AdvertiseWithKoko.tsx`), so the flow can
be replicated, reviewed, or handed to engineering without reading the source.

Product context: Koko is a BNPL platform (Sri Lanka, Pakistan-ready). This module sells the
consumer app's fixed promotional real estate to merchants as bookable calendar inventory.
Fixed prices, first come first served, no auctions. All numbers below are prototype data and
must be wired to real platform benchmarks before launch.

---

## 1. The funnel

Landing (Advertise tab) → Positions → Period → Assets (banner spaces only) → Payment → Thank you

- The whole tab lives inside the merchant portal, on a white canvas, using the portal design
  system (Plus Jakarta Sans, gray-900 primary, #BDDCEE brand accent, #9356ff ad-highlight purple).
- A clickable stepper shows progress. Completed steps can be revisited. The Assets step only
  exists when at least one selected space requires banner artwork.
- A sticky summary rail (desktop) and a sticky bottom total bar (small screens) update live with
  every selection. The primary CTA lives in the rail.

## 2. Landing page

- Header: "Advertise with Koko" / "Your store, inside the Koko shopper app". No booking CTA in
  the header; the funnel starts by selecting spaces.
- Value is carried by marketing metrics, not feature tags: 2.5M app downloads, 600K active
  shoppers every month, 3.8M app opens last month, with the line "Every estimate below comes
  from this live shopper traffic." Never use "fixed price" or "no auction" style tags.
- Copy rules: plain language, short sentences, no em dashes or hyphens-as-dashes anywhere in
  merchant-facing prose.
- Six placement cards ("Where you can appear"), multi-select:
  - Hero banner (480K est. views/wk, Rs. 129,500/wk), Secondary banner (295K, 78,400),
    Trending (210K, 53,200), Empty search (96K, 24,900), Shop page banner (140K, 38,700),
    Post-checkout card (72K, 19,500).
  - Each card: animated mock phone preview (real app screenshot with a purple "Your ad"
    highlight that reveals and pulses on hover), description, est. views before price
    (value anchors price, never the reverse), View details link, Select toggle.
  - View details opens a modal: larger preview, plain-language explainer, Est. views/week and
    Impressions/month (≈ views × 4.33), from-price, select CTA.
  - No availability claims on the landing: availability is date-dependent and only appears in
    the calendar.
- Selecting one or more cards shows a sticky selection bar: count, combined views/week,
  combined from-price, Clear, and "Continue to positions".

## 3. Positions step

- Progressive disclosure: one accordion per selected space, one open at a time. Picking a
  position keeps the panel open (so the merchant can compare and watch the preview animate) and
  offers an explicit "Next: {space}" button. Nothing is pre-selected; the Continue CTA stays
  disabled until every space has a position; the rail shows "Position not chosen yet".
- Position preview: a mock dark app UI (not a brand screenshot). The carousel slides
  (500 ms) to the picked position, pagination dots follow, and a "Typical engagement by
  position" bar meter animates. Engagement ladder: 3.0×, 2.1×, 1.6×, 1.3×, 1.15×, 1.1×,
  1.05×, 1.0× by position. Caption: "≈X.X× typical engagement at {position}".
- All positions are selectable (no "booked" states here; the user has no dates yet).
- Position 1 of every space carries a "Most popular" badge (#BDDCEE brand pill).
- Hero pricing multipliers: position 1 = 1.35×, position 2 = 1.15×, others 1.0×. Other spaces
  are flat. Options with a multiplier show their weekly price (position 1 = Rs. 174,825/wk,
  position 2 = Rs. 148,925/wk). Until a position is chosen, estimates use a neutral 1.0×.
- Bundle deal: when exactly one space is selected, a "Koko recommends" card offers a partner
  space at 5% off the whole booking (partner map: hero→post-checkout, secondary→trending,
  trending→post-checkout, search→trending, shop→trending, checkout→hero). Shows slashed
  combined weekly price. Accepting adds the partner and applies the 5% bundle saving to media
  cost; removing a space clears the bundle.
- "+ Add another space" expands an inline list of unselected spaces (name, views, price, Add)
  so merchants extend the booking without leaving the flow. There is no add/change link in the
  summary rail.

## 4. Period step

Order: campaign upsell first, own dates below.

### Campaign weeks (pre-set dates)
- 10 campaign periods, uniform cards with solid colour bands, shown 6 at a time with a
  "See more campaign weeks" extension (+6 per click).
- Card content, value first: fixed dates, big traffic multiple (2.4× etc.), "Up to X views over
  the period" computed from the merchant's actual selection (sum of vpd × position multiplier ×
  period days × multiple), "guaranteed slot", early-bird note where active.
- Selecting a campaign opens its fixed-date chip calendar (dates are pre-set by Koko; chips
  roll over month boundaries correctly).
  - Partial selection: "Add N days · price" plus a full-period upsell with slashed price and a
    "Save 15%" pill, and a line quantifying the saving. Full period price =
    per-day-at-multiple × periodDays × 0.85.
  - Multiple campaign weeks can be stacked, and combined with own dates. Each selected campaign
    shows as a removable row with slashed pricing where discounted.
- Campaign price per day per space = round(basePrice × positionMultiplier × campaignMultiple).

### Own dates
- A 30-day window starting today. The first cell is labelled TODAY. Day / Month / Year selects
  jump the window to any anchor date (clamped to today at the earliest).
- Lead time: the first 3 days from today are disabled ("Lead time") because creative approval
  needs 3 days.
- Simulated occupancy: today+7 and today+13 are "Booked". Picking one, or a range crossing one,
  shows a recovery hint pointing to dates around it or a campaign week.
- Weekend boost: Saturdays and Sundays cost ×1.09 and carry a purple "Boost" tag.
- Campaign dates appear as blocks in this calendar too: tinted cells labelled with the campaign
  name and multiple (e.g. "Black Friday 2.4×"); those dates price at the campaign multiple.
- Range selection: tap start, tap end. Selected summary reads
  "From 30th December 2026 to 12th January 2027" (ordinal day, full month, year), shown under
  the calendar and in the rail.
- Duration upsells with slashed prices:
  - Fewer than 7 days selected → "Make it a full week and save 5%" (extends to 7 days).
  - 7 to 21 days → "Make it a full month and save 10%" (extends to 30 days).
  - Changing dates afterwards clears the applied deal.

## 5. Assets step (banner spaces only)

- Skipped entirely when no selected space needs artwork (thumbnail-only spaces).
- Social proof strip: "9 out of 10 merchants let Koko design their first ad."
- Two options, subscription-page style (patterns from Mobbin: floating Most-popular ribbon,
  heavier border on the recommended card, feature checklists, Selected state chip, per-day
  price anchoring):
  - "Let Koko create your assets": ribbon "Most popular · Fastest approval", + Rs. 12,500 one
    time ("About Rs. 1,800 a day on a week booking"), checklist: designed by Koko's team,
    approval in minutes, brand rules handled, nothing to upload.
  - "Upload my own asset": Free, "the slower option", amber caveats: review up to 2 business
    days, booking confirms only after approval, must pass the spec check.
- Own upload runs a live spec check on the real file, sequentially with a tick or cross per
  rule: size ≤ 5 MB, format JPG/PNG, resolution ≥ 1600 × 640. Any failure shows a red result
  and "Try another file"; the Continue CTA is locked until Koko-designs is chosen or all checks
  pass.

## 6. Payment step

- Review rows: spaces with positions, own dates (long format, day count), each campaign week
  (with "saved 15%" where full), duration deal, bundle deal, estimated views over total days,
  media cost, design service.
- Payment methods (radio cards with logos and a Selected chip):
  - Koko seller credit (Koko logo): deducted from the next payout, +5% processing fee, with a
    payout before/after box.
  - Card (Visa and Mastercard marks): no adjustment.
  - JustPay (wordmark): 2% discount, shown as a green savings row.
  - Fees/discounts apply to the total only from the payment step onward.
- Finality notice, twice (body and rail): "This booking is final. No cancellations and no
  refunds. Your slots are reserved just for you."
- Confirm → thank-you screen: reference KAD-1084, paid total, creative status (queued for
  review up to 2 business days for uploads, near-instant for Koko-designed), and "Check My
  bookings to see when your creative is approved and your ad goes live", with a button that
  navigates to My campaigns.

## 7. Pricing model (single source of truth)

- basePrice per day per space: hero 18,500 · secondary 11,200 · trending 7,600 · search 3,560 ·
  shop 5,530 · checkout 2,790 (LKR).
- vpd (views per day): 68,600 · 42,100 · 30,000 · 13,700 · 20,000 · 10,300.
- Day price for a date = Σ over selected spaces of round(basePrice × positionMultiplier ×
  dateFactor), where dateFactor = campaignMultiple if the date is inside a campaign period,
  else 1.09 on Sat/Sun, else 1.
- Discount stack: duration deal (5% week / 10% month) applies to own-dates cost; full-period
  campaign discount (15%) applies per campaign; bundle saving (5%) applies to all media cost;
  design fee (Rs. 12,500) added when Koko designs; then payment adjustment (+5% credit / −2%
  JustPay).
- Views = Σ vpd × positionMultiplier × days (× campaignMultiple for campaign days). Before any
  period is chosen, the rail quotes a 7-day baseline.
- Number formats: money "Rs. n,nnn"; compact views "480K"/"552.2K" style; dates in summaries as
  "From {ordinal day} {full month} {year} to ...".

## 8. Cross-cutting UX rules

- Value before price, everywhere: views/engagement render before any price.
- Honest persuasion: scarcity and metrics must come from real data in production (the
  engagement ladder, marketing metrics, "9 out of 10", and boost/campaign multipliers here are
  prototype placeholders for the platform benchmarks service).
- One "Most popular" style badge per decision, maximum.
- Every selected option states "Selected" (chip) across positions, campaigns, creative, and
  payment.
- Progressive disclosure to limit cognitive load: spaces → positions one at a time → period →
  assets → payment.
- Live totals always visible (rail or sticky bar). 30-minute slot hold at checkout.
- Plain language, no dashes, no ad-tech jargon; "views" glossed as how many times shoppers see
  you.
- Accessibility: aria-labels on calendar cells and remove buttons, keyboard toggling on landing
  cards, aria-pressed on multi-select cards, reduced-motion respected on all animations.

## 9. Known prototype simplifications

- All data is mock and deterministic; there is no backend. Prices, availability, engagement,
  and metrics must come from the ops-configured backend described in the original briefs
  (`advertise-with-koko-00-foundation.md`, `advertise-with-koko-brief-b-merchant-portal.md`).
- Booked-date simulation is fixed at today+7 and today+13.
- Upload spec checks run client-side only; production needs a server-side re-check.
- Seller-credit payout figures are hardcoded (Rs. 486,200, 31 Aug).
- My campaigns and Performance tabs are earlier portal-standard implementations and were not
  part of the funnel redesign.
