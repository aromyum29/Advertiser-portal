// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  ImageIcon,
  LayoutPanelTop,
  Rocket,
  Search,
  ShoppingBag,
  Store,
  TrendingUp,
  TrendingDown,
  Upload,
  UploadCloud,
  X,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { cn } from "./ui/utils"
import kokoLogo from "figma:asset/09ac28c5614ff62377e494f60366a17f58f0e925.png"
import kokoWordmark from "figma:asset/2fb784bf4eb111e438185f3f72d368e7963516ad.png"
import metricPeopleGif from "figma:asset/metric-people.gif"
import metricShoppersGif from "figma:asset/metric-shoppers.gif"
import metricNewUsersGif from "figma:asset/metric-new-users.gif"
import appHome from "figma:asset/app-home.png"
import appShopDetails from "figma:asset/app-shop-details.png"
import appSale from "figma:asset/app-sale.png"
import appSearch from "figma:asset/app-search.png"

// ── Inventory & mock data (read from the Brief A backend config) ─────────

const placements = [
  {
    id: "hero",
    details: "The hero banner is the full-width carousel at the very top of the Koko home screen. It is the single most seen surface in the app. Every shopper who opens Koko sees it before anything else, which makes it the strongest space for launches and big offers.",
    name: "Hero banner",
    unit: "Slide",
    location: "Top of the Koko home screen",
    description: "The first thing shoppers see when they open Koko.",
    weeklyImpressions: 480000,
    basePrice: 18500,
    vpd: 68600,
    weekly: 129500,
    hasSlides: true,
    positionCount: 5,
    availablePositions: [1, 2, 5],
    creative: "banner",
    Icon: ImageIcon,
    tag: "Most popular",
    tagStyle: "dark",
  },
  {
    id: "secondary",
    details: "The secondary banner sits a few scrolls down the home page, after the featured stores. It reaches shoppers who are already browsing with intent, at a noticeably lower price than the hero.",
    name: "Secondary banner",
    unit: "Slide",
    location: "Koko home, below featured stores",
    description: "Same size as the hero, a few scrolls down the home page.",
    weeklyImpressions: 295000,
    basePrice: 11200,
    vpd: 42100,
    weekly: 78400,
    hasSlides: false,
    positionCount: 5,
    availablePositions: [1, 2, 3, 4, 5],
    creative: "banner",
    Icon: LayoutPanelTop,
    discount: "5% off",
    wasPrice: 82500,
  },
  {
    id: "trending",
    details: "Trending places your existing store card in the row shoppers browse when they want what is popular right now. No artwork needed, your store thumbnail is the creative.",
    name: "Trending",
    unit: "Card",
    location: "Trending stores on home",
    description: "Your existing store card, placed where shoppers browse what is popular.",
    weeklyImpressions: 210000,
    basePrice: 7600,
    vpd: 30000,
    weekly: 53200,
    hasSlides: false,
    positionCount: 20,
    availablePositions: Array.from({ length: 12 }, (_, i) => i + 1),
    creative: "existing",
    Icon: TrendingUp,
    tag: "Best value",
    tagStyle: "green",
  },
  {
    id: "search",
    details: "When a search returns no results, Koko suggests stores instead. Your store appears in that suggestion row, reaching shoppers at the exact moment they are looking for something to buy.",
    name: "Empty search",
    unit: "Slot",
    location: "Shown when a search finds nothing",
    description: "Your store suggested when a search comes up empty.",
    weeklyImpressions: 96000,
    basePrice: 3560,
    vpd: 13700,
    weekly: 24900,
    hasSlides: false,
    positionCount: 4,
    availablePositions: [1, 2, 3, 4],
    creative: "existing",
    Icon: Search,
    discount: "10% off",
    wasPrice: 27700,
  },
  {
    id: "shop",
    details: "A banner shown inside other shop pages in your category. Shoppers comparing similar stores see your banner while they browse, which is ideal for winning over undecided buyers.",
    name: "Shop page banner",
    unit: "Slot",
    location: "Inside other shop pages",
    description: "A banner inside shop pages in your category.",
    weeklyImpressions: 140000,
    basePrice: 5530,
    vpd: 20000,
    weekly: 38700,
    hasSlides: false,
    positionCount: 10,
    availablePositions: [1, 4, 6, 9],
    creative: "banner",
    Icon: Store,
  },
  {
    id: "checkout",
    details: "Shown right after a shopper completes an order, when they are most engaged. Your store card appears in the post-checkout row and catches shoppers at their highest buying momentum.",
    name: "Post-checkout card",
    unit: "Card",
    location: "After a completed order",
    description: "Reach shoppers right when they finish buying.",
    weeklyImpressions: 72000,
    basePrice: 2790,
    vpd: 10300,
    weekly: 19500,
    hasSlides: false,
    positionCount: 20,
    availablePositions: Array.from({ length: 20 }, (_, i) => i + 1),
    creative: "existing",
    Icon: ShoppingBag,
  },
]

const campaignPeriods = [
  { id: "black-friday", name: "Black Friday", dates: "23 to 30 Nov 2026", multiple: 2.4, note: "Early-bird rate ends 15 Oct", earlyBird: true, band: "#12281a", ink: "#eef4ee", periodDays: 8, periodStart: 23, periodMonth: "Nov", startISO: "2026-11-23" },
  { id: "christmas", name: "Christmas", dates: "15 to 31 Dec 2026", multiple: 2.1, note: "Priority slots now open", earlyBird: false, band: "#dcd3ec", ink: "#241a38", periodDays: 17, periodStart: 15, periodMonth: "Dec", startISO: "2026-12-15" },
  { id: "avurudu", name: "Avurudu 2027", dates: "5 to 18 Apr 2027", multiple: 2.7, note: "Book early for slide choice", earlyBird: false, band: "#33421f", ink: "#f0f4e8", periodDays: 14, periodStart: 5, periodMonth: "Apr", startISO: "2027-04-05" },
  { id: "diwali", name: "Diwali", dates: "29 Oct to 4 Nov 2026", multiple: 1.9, note: "Strong week for fashion and gifting", earlyBird: false, band: "#3d2914", ink: "#f4e3c1", periodDays: 7, periodStart: 29, periodMonth: "Oct", startISO: "2026-10-29" },
  { id: "year-end", name: "Year-end clearance", dates: "27 Dec 2026 to 3 Jan 2027", multiple: 1.7, note: "Shoppers hunting deals after Christmas", earlyBird: false, band: "#1d3a4a", ink: "#dcecf4", periodDays: 8, periodStart: 27, periodMonth: "Dec", startISO: "2026-12-27" },
  { id: "back-to-school", name: "Back to school", dates: "4 to 17 Jan 2027", multiple: 1.5, note: "Two-week window, families stocking up", earlyBird: false, band: "#2a2f4a", ink: "#dfe3f4", periodDays: 14, periodStart: 4, periodMonth: "Jan", startISO: "2027-01-04" },
  { id: "independence", name: "Independence week", dates: "1 to 7 Feb 2027", multiple: 1.4, note: "Long-weekend shopping bump", earlyBird: false, band: "#4a1d1d", ink: "#f4dcdc", periodDays: 7, periodStart: 1, periodMonth: "Feb", startISO: "2027-02-01" },
  { id: "ramadan-eid", name: "Ramadan & Eid", dates: "10 Mar to 10 Apr 2027", multiple: 2.2, note: "Early-bird rate ends 1 Feb", earlyBird: true, band: "#1d4a3a", ink: "#dcf4e8", periodDays: 32, periodStart: 10, periodMonth: "Mar", startISO: "2027-03-10" },
  { id: "vesak", name: "Vesak week", dates: "17 to 23 May 2027", multiple: 1.6, note: "Holiday week, high evening traffic", earlyBird: false, band: "#4a3a1d", ink: "#f4ecd0", periodDays: 7, periodStart: 17, periodMonth: "May", startISO: "2027-05-17" },
  { id: "koko-birthday", name: "Koko Birthday", dates: "5 to 12 Jul 2027", multiple: 1.8, note: "Platform-wide birthday promotions", earlyBird: false, band: "#3a1d4a", ink: "#ecdcf4", periodDays: 8, periodStart: 5, periodMonth: "Jul", startISO: "2027-07-05" },
]

const dateOptions = [
  ["24", "Mon", "2026-08-24"],
  ["25", "Tue", "2026-08-25"],
  ["26", "Wed", "2026-08-26"],
  ["27", "Thu", "2026-08-27"],
  ["28", "Fri", "2026-08-28"],
  ["29", "Sat", "2026-08-29"],
  ["30", "Sun", "2026-08-30"],
  ["31", "Mon", "2026-08-31"],
  ["01", "Tue", "2026-09-01"],
  ["02", "Wed", "2026-09-02"],
  ["03", "Thu", "2026-09-03"],
  ["04", "Fri", "2026-09-04"],
  ["05", "Sat", "2026-09-05"],
  ["06", "Sun", "2026-09-06"],
].map(([day, weekday, iso], index) => ({
  day,
  weekday,
  iso,
  price: index > 6 ? 20100 : 18500,
  campaign: index > 10 ? "Weekend boost" : null,
}))

const performanceData = [
  { day: "Mon", impressions: 44000 },
  { day: "Tue", impressions: 51000 },
  { day: "Wed", impressions: 58000 },
  { day: "Thu", impressions: 69000 },
  { day: "Fri", impressions: 78000 },
  { day: "Sat", impressions: 92000 },
  { day: "Sun", impressions: 88000 },
]

const bookings = [
  { id: "KAD-1048", placement: "Hero banner · Slide 2", dates: "10 – 16 Aug 2026", status: "live", spend: 129500, result: "128 orders so far · Rs. 1.86M in sales" },
  { id: "KAD-0987", placement: "Trending · Card 4", dates: "20 – 26 Jul 2026", status: "completed", spend: 53200, result: "Drove 214 orders · Rs. 3.12M in sales" },
  { id: "KAD-1061", placement: "Push notification · Window 2", dates: "28 Aug 2026", status: "pending", spend: 9800, result: "Waiting on template review" },
]

const money = (value: number) => `Rs. ${Math.round(value).toLocaleString()}`
const compact = (value: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)

const showToast = (type, title, description) =>
  window.dispatchEvent(new CustomEvent("show-toast", { detail: { type, title, description } }))

// ── Shared portal patterns ───────────────────────────────────────────────

function StatusPill({ status }) {
  const map = {
    live: ["Live", "bg-emerald-500", "bg-emerald-50 text-emerald-700 border-emerald-200"],
    completed: ["Completed", "bg-blue-500", "bg-blue-50 text-blue-700 border-blue-200"],
    pending: ["Pending approval", "bg-amber-500", "bg-amber-50 text-amber-700 border-amber-200"],
    confirmed: ["Confirmed", "bg-emerald-500", "bg-emerald-50 text-emerald-700 border-emerald-200"],
  }
  const [label, dot, tone] = map[status] || map.pending
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium", tone)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  )
}

function RecommendedPill({ children = "Recommended" }) {
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#BDDCEE] text-gray-800">{children}</span>
  )
}

function TrendPill({ up = true, children }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
      up ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200",
    )}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {children}
    </span>
  )
}

function IconTile({ Icon }) {
  return (
    <div className="h-10 w-10 rounded-lg bg-[#BDDCEE]/30 flex items-center justify-center flex-shrink-0">
      <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
    </div>
  )
}

// ── Real Koko app screenshots ────────────────────────────────────────────


// Placement preview: real app screen in a 138×282 phone; the bookable surface
// is highlighted in purple, revealed on card hover with a pulse (per design).
const SHOT_CONFIG = {
  hero: { img: appHome, hl: { left: "4%", top: "25%", width: "92%", height: "16%" } },
  secondary: { img: appHome, hl: { left: "4%", top: "46%", width: "92%", height: "21%" } },
  trending: { img: appSale, hl: { left: "4%", top: "56%", width: "92%", height: "23%" } },
  search: { img: appSearch, hl: { left: "3%", top: "68%", width: "94%", height: "19%" } },
  shop: { img: appShopDetails, hl: { left: "4%", top: "39.5%", width: "92%", height: "15%" } },
  checkout: { img: null, hl: { left: "10%", top: "30%", width: "80%", height: "25%" } },
}

const PHONE_EASE = "ease-[cubic-bezier(0.2,0.8,0.2,1)]"

function PlacementMockup({ id, width = 138, height = 282, revealed = false }) {
  const cfg = SHOT_CONFIG[id]
  return (
    <div
      style={{ width, height }}
      className={cn(
        "relative rounded-t-[18px] overflow-hidden bg-[#1c1c1f] shadow-[0_10px_36px_rgba(0,0,0,0.18)]",
        // Sits 8px below the zone edge so the hover lift never opens a gap under the phone
        "-mb-2 transition-transform duration-[400ms] group-hover:-translate-y-2 motion-reduce:transition-none motion-reduce:transform-none",
        PHONE_EASE,
      )}
    >
      {cfg.img ? (
        <img src={cfg.img} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
      ) : (
        /* Post-checkout: no screenshot exists yet — minimal order-confirmation mock */
        <div className="absolute inset-0 p-2.5 space-y-2">
          <div className="flex items-center justify-between pt-1">
            <span className="text-[8px] font-semibold text-white/70">9:41</span>
            <span className="flex gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="h-1 w-1 rounded-full bg-white/30" />)}</span>
          </div>
          <div className="rounded-lg bg-[#3ec97e]/20 py-4 flex flex-col items-center gap-1.5 mt-3">
            <span className="h-6 w-6 rounded-full bg-[#3ec97e]/80 flex items-center justify-center"><Check className="h-3.5 w-3.5 text-white stroke-[3]" /></span>
            <span className="text-[9px] font-bold text-[#7de0a9]">Order confirmed</span>
          </div>
          <div className="h-1.5 w-16 rounded-full bg-white/25 mt-3" />
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1].map((i) => <div key={i} className="h-16 rounded-lg bg-white/5" />)}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1].map((i) => <div key={i} className="h-16 rounded-lg bg-white/5" />)}
          </div>
        </div>
      )}
      {cfg.hl && (
        /* Always visible; glows and pulses when the card is hovered */
        <div
          className={cn(
            "absolute pointer-events-none rounded-lg border-2 border-[#9356ff] bg-[#9356ff]/15",
            "transition-shadow duration-300",
            "group-hover:shadow-[0_0_20px_rgba(147,86,255,0.7)] group-hover:animate-[adpulse_1.6s_ease_infinite]",
            "motion-reduce:transition-none motion-reduce:animate-none",
            revealed && "shadow-[0_0_20px_rgba(147,86,255,0.7)] animate-[adpulse_1.6s_ease_infinite]",
            PHONE_EASE,
          )}
          style={cfg.hl}
        >
          <span className="absolute -top-[9px] left-1.5 bg-[#9356ff] text-white text-[9px] font-bold px-[7px] py-px rounded-full whitespace-nowrap">
            Your ad
          </span>
        </div>
      )}
    </div>
  )
}

// ── Explore ──────────────────────────────────────────────────────────────

// Placement cards + details dialog, shared by the landing page (flow 1)
// and the "Spaces" booking step (flow 2)
function PlacementPicker({ selectedIds, onToggle, heading, showPrices = false }) {
  const [detailId, setDetailId] = useState(null)
  const [sort, setSort] = useState("views")
  const detail = placements.find((p) => p.id === detailId)
  const sortedPlacements = [...placements].sort((a, b) =>
    sort === "price" ? a.weekly - b.weekly : b.weeklyImpressions - a.weeklyImpressions,
  )
  return (
    <div>
      <div>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          {heading}
          {showPrices && (
          <div className="flex gap-1 bg-muted rounded-full p-[3px] flex-shrink-0" role="tablist" aria-label="Sort spaces">
            {[
              ["views", "Most viewed"],
              ["price", "Cheapest"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSort(id)}
                aria-pressed={sort === id}
                className={cn(
                  "text-[13px] font-semibold px-4.5 py-2 rounded-full transition-colors cursor-pointer",
                  sort === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          )}
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))] gap-6 mt-7">
          {sortedPlacements.map((placement) => {
            const isSelected = selectedIds.includes(placement.id)
            return (
              <div
                key={placement.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onToggle(placement.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(placement.id) } }}
                className={cn(
                  "group relative bg-card rounded-[22px] overflow-hidden flex flex-col cursor-pointer border-2 transition-[border-color,box-shadow] duration-150 shadow-sm",
                  isSelected
                    ? "border-gray-900 dark:border-gray-200 ring-4 ring-gray-900/10 dark:ring-gray-100/15 shadow-[0_8px_28px_rgba(13,15,20,0.14)]"
                    : "border-border/60 hover:border-gray-900 dark:hover:border-gray-200 hover:shadow-[0_8px_24px_rgba(13,15,20,0.08)]",
                )}
              >
                {/* In-app placement preview: phone lifts, zone tints, and highlight glows on hover */}
                <div className="relative h-[300px] bg-muted/60 transition-colors duration-300 group-hover:bg-[#BDDCEE]/30 dark:group-hover:bg-[#BDDCEE]/10 flex items-end justify-center overflow-hidden">
                  {placement.tag && (
                    <span
                      className={cn(
                        "absolute top-4 left-4 z-10 text-[11px] font-bold uppercase tracking-[0.04em] px-3 py-1.5 rounded-full whitespace-nowrap shadow-md",
                        placement.tagStyle === "green"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-[#BDDCEE] text-gray-800",
                      )}
                    >
                      {placement.tag}
                    </span>
                  )}
                  <PlacementMockup id={placement.id} />
                </div>
                <div className="px-7 pt-6 pb-7 flex flex-col flex-1">
                  <div>
                    <p className="text-lg font-bold leading-tight tracking-tight">{placement.name}</p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{placement.location}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground mt-3">{placement.description}</p>
                  <div className="flex items-baseline gap-2 mt-5">
                    <span className="text-[28px] font-extrabold tabular-nums tracking-tight leading-none">{compact(placement.weeklyImpressions)}</span>
                    <span className="text-[13px] text-muted-foreground">{showPrices ? "est. views / 7 days" : "estimated store visits / 7 days"}</span>
                  </div>
                  <div className="h-px bg-border/60 my-4.5 mt-auto" />
                  <div className={cn("flex items-end gap-3 flex-wrap", showPrices ? "justify-between" : "justify-start")}>
                    {showPrices && (
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      {placement.discount && (
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <span className="text-xs text-muted-foreground line-through tabular-nums whitespace-nowrap">{money(placement.wasPrice)}</span>
                          <span className="text-[11px] font-medium text-amber-800 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full whitespace-nowrap">{placement.discount}</span>
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">From</span>
                      <span className="text-lg font-bold tabular-nums tracking-tight leading-tight whitespace-nowrap">
                        {money(placement.weekly)}<span className="text-[13px] font-normal text-muted-foreground"> / week</span>
                      </span>
                    </div>
                    )}
                    {/* No-price cards stack full-width CTAs so both edges line up with the divider */}
                    <div className={cn("flex gap-2.5", showPrices ? "items-center" : "flex-col w-full")}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggle(placement.id) }}
                        style={isSelected ? { backgroundImage: PASTEL_GRADIENT } : undefined}
                        className={cn(
                          "rounded-lg px-4.5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer",
                          showPrices ? "flex-shrink-0 order-2" : "w-full",
                          isSelected
                            ? "border-[1.5px] border-gray-900 dark:border-gray-200 text-gray-900"
                            : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 shadow-sm",
                        )}
                      >
                        {isSelected ? "✓ Selected" : "Select space"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDetailId(placement.id) }}
                        className={cn(
                          "rounded-lg border-[1.5px] border-border bg-card px-4.5 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer",
                          showPrices ? "order-1" : "w-full",
                        )}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Space details modal */}
      <Dialog open={!!detail} onOpenChange={(o) => { if (!o) setDetailId(null) }}>
        {detail && (
          <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
            <div className="grid sm:grid-cols-[280px_minmax(0,1fr)]">
              <div className="bg-muted/60 hidden sm:flex items-end justify-center pt-8 px-6 overflow-hidden">
                <PlacementMockup id={detail.id} width={220} height={430} revealed />
              </div>
              <div className="p-6 sm:p-7 flex flex-col gap-4">
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight">{detail.name}</DialogTitle>
                  <p className="text-[13px] text-muted-foreground mt-0.5">{detail.location}</p>
                </div>
                <DialogDescription className="text-sm leading-relaxed text-foreground/80">{detail.details}</DialogDescription>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Est. views / week</p>
                    <p className="text-2xl font-bold tabular-nums tracking-tight mt-1">{compact(detail.weeklyImpressions)}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Times shoppers see you</p>
                  </div>
                  <div className="rounded-xl border border-border/60 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Impressions / month</p>
                    <p className="text-2xl font-bold tabular-nums tracking-tight mt-1">{compact(Math.round(detail.weeklyImpressions * 4.33))}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Rendered in shoppers' view</p>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">From <span className="font-bold text-foreground tabular-nums">{money(detail.weekly)}</span> / week</p>
                </div>
                <button
                  onClick={() => { onToggle(detail.id); setDetailId(null) }}
                  className={cn(
                    "w-full rounded-lg px-6 py-3 text-sm font-medium transition-colors cursor-pointer mt-auto",
                    selectedIds.includes(detail.id)
                      ? "border-[1.5px] border-gray-900 dark:border-gray-200 text-foreground bg-card"
                      : "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200",
                  )}
                >
                  {selectedIds.includes(detail.id) ? "Remove from selection" : "Select this space"}
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

function ExploreView({ selectedIds, onToggle, onClear, onContinue, flow, showPrices }) {
  const selected = placements.filter((p) => selectedIds.includes(p.id))
  const sumViews = selected.reduce((a, p) => a + p.weeklyImpressions, 0)
  const sumWeekly = selected.reduce((a, p) => a + p.weekly, 0)
  return (
    <div className="space-y-12 pb-8">
      {/* Intro: plain language + metric band that carries the value */}
      <section className="pt-2">
        <p className="text-lg font-bold tracking-tight max-w-2xl">You already sell on Koko. Now get seen on it.</p>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl mt-1.5">
          Pick a space, choose your dates, pay the price on screen. No bidding. The slot is yours for the full period.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 mt-7">
          {[
            ["People using Koko", "2.5M", "Installed on iOS and Android", metricPeopleGif],
            ["Average number of shoppers every month", "600K", "Active and browsing", metricShoppersGif],
            ["New users every month", "35K", "Fresh shoppers every month, on average", metricNewUsersGif],
          ].map(([label, value, note, gif]) => (
            <div key={label} className="bg-card border border-border/60 rounded-[20px] px-6 py-5 flex flex-col gap-2.5 shadow-sm">
              <img src={gif} alt="" aria-hidden="true" className="w-10 h-10 object-contain flex-shrink-0 select-none pointer-events-none" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/80 leading-snug text-balance">{label}</span>
              <p className="text-3xl font-extrabold tabular-nums tracking-tight leading-none">{value}</p>
              <p className="text-[13px] text-muted-foreground/80 leading-snug">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {flow === "cta" ? (
        /* Flow 2: the space grid moves into the booking flow; a single big CTA starts it */
        <div className="flex justify-center py-16">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto rounded-xl bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-6 sm:px-12 py-5 text-lg font-bold shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 dark:hover:bg-gray-200 active:scale-[0.98] cursor-pointer"
          >
            Choose where you want to be seen →
          </button>
        </div>
      ) : (
        <div id="choose-spaces" className="scroll-mt-6">
          <PlacementPicker
            selectedIds={selectedIds}
            onToggle={onToggle}
            showPrices={showPrices}
            heading={
              <div>
                <h3 className="text-[26px] font-extrabold tracking-tight">Choose where you want to be seen</h3>
                <p className="text-[15px] text-muted-foreground mt-1.5 max-w-3xl">Pick one space or a few. One booking covers all of them for the same dates.</p>
              </div>
            }
          />

          {/* Floating selection bar */}
          {selectedIds.length > 0 && (
            <div className="fixed left-1/2 bottom-4 sm:bottom-7 -translate-x-1/2 z-50 w-[calc(100vw-32px)] sm:w-auto sm:max-w-[calc(100vw-48px)]">
              <div className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-2xl sm:rounded-full shadow-[0_20px_48px_-8px_rgba(13,15,20,0.55),0_8px_20px_-6px_rgba(13,15,20,0.4)] ring-1 ring-white/10 p-4 sm:py-4 sm:pl-8 sm:pr-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-8">
                <div className="flex items-baseline gap-2.5 flex-wrap whitespace-nowrap">
                  <span className="text-[15px] font-bold">{selectedIds.length} space{selectedIds.length > 1 ? "s" : ""} selected</span>
                  {showPrices && (
                    <>
                      <span className="text-sm text-gray-500 dark:text-gray-400">·</span>
                      <span className="text-[15px] tabular-nums">{money(sumWeekly)} <span className="font-bold">/ week</span></span>
                    </>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">·</span>
                  <span className="text-sm text-gray-300 dark:text-gray-600 tabular-nums">~{compact(sumViews)} {showPrices ? "views" : "store visits"} / 7 days</span>
                  <button onClick={onClear} className="text-sm font-semibold underline underline-offset-2 text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 cursor-pointer ml-1.5">
                    Clear
                  </button>
                </div>
                <button
                  onClick={onContinue}
                  className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-xl sm:rounded-full px-7 py-3 text-[15px] font-bold shadow-md transition-all hover:bg-gray-100 hover:shadow-lg dark:hover:bg-gray-800 active:scale-[0.98] cursor-pointer flex-shrink-0 whitespace-nowrap w-full sm:w-auto"
                >
                  Start a booking →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Booking flow: Positions → Period → Assets → Payment ─────────────────
// Real-date 30-day calendar with day/month/year filters, weekend boost,
// campaign date blocks, lead time, week/month upsells, bundle deals,
// inline add-space, 6-at-a-time campaign extension, and a Mobbin-inspired
// assets upsell (Most popular ribbon, checklists, Selected states).

const LEAD_DAYS = 3
const MS_DAY = 86400000
const pad2 = (n) => String(n).padStart(2, "0")
const localISO = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const fromISO = (s) => { const [y, m, dd] = s.split("-").map(Number); return new Date(y, m - 1, dd) }
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
const startOfToday = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t }
const diffDays = (a, b) => Math.round((fromISO(b) - fromISO(a)) / MS_DAY)
const DOW3 = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
const MON3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const MONFULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const ordinal = (n) => { const sfx = ["th", "st", "nd", "rd"], v = n % 100; return n + (sfx[(v - 20) % 10] || sfx[v] || sfx[0]) }
const longDate = (isoStr) => { const d = fromISO(isoStr); return `${ordinal(d.getDate())} ${MONFULL[d.getMonth()]} ${d.getFullYear()}` }

const MONTH_DAYS = { Jan: 31, Feb: 28, Mar: 31, Apr: 30, May: 31, Jun: 30, Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31 }
const MONTH_NEXT = { Jan: "Feb", Feb: "Mar", Mar: "Apr", Apr: "May", May: "Jun", Jun: "Jul", Jul: "Aug", Aug: "Sep", Sep: "Oct", Oct: "Nov", Nov: "Dec", Dec: "Jan" }
const campaignDayLabel = (c, i) => {
  let day = c.periodStart + i
  let m = c.periodMonth
  while (day > MONTH_DAYS[m]) { day -= MONTH_DAYS[m]; m = MONTH_NEXT[m] }
  return { day, m }
}

const short = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : Math.round(n / 100) / 10 + "K")

const POSITION_LABEL = { hero: "Hero banner", secondary: "Banner", trending: "Card", search: "Slot", shop: "Slot", checkout: "Card" }
const posMult = (pid, n) => (pid === "hero" ? (n === 1 ? 1.35 : n === 2 ? 1.15 : 1.0) : 1.0)
const posInfo = (pid, n) => ({
  tag: n === 1 ? "Most popular" : null,
  eng: engagementOf(n),
  note: n === 1 ? "seen first by every shopper" : n === 2 ? "second in view" : `position ${n} in the rotation`,
})
const FULL_PERIOD_DISCOUNT = 0.15
const BUNDLE_PARTNER = { hero: "checkout", secondary: "trending", trending: "checkout", search: "trending", shop: "trending", checkout: "hero" }
const BUNDLE_DISCOUNT = 0.05

function Stepper({ steps, step, onGo }) {
  return (
    <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap" aria-label={`Step ${step} of ${steps.length}`}>
      {steps.map((label, index) => {
        const n = index + 1
        const done = step > n
        const active = step === n
        return (
          <div key={label} className="flex items-center gap-2.5">
            <button
              onClick={() => { if (n < step) onGo(n) }}
              className={cn("flex items-center gap-2 bg-transparent", n < step ? "cursor-pointer" : "cursor-default")}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold border-[1.5px]",
                  active || done
                    ? "bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100"
                    : "bg-card text-muted-foreground border-border",
                )}
              >
                {done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : n}
              </span>
              <span className={cn("text-[13px]", active ? "font-bold" : "font-semibold text-muted-foreground")}>{label}</span>
            </button>
            {index < steps.length - 1 && <span className="w-6 h-[1.5px] bg-border" />}
          </div>
        )
      })}
    </div>
  )
}

function VisaMark() {
  return <span className="text-[13px] font-black italic tracking-tight text-[#1A1F71]">VISA</span>
}
function MastercardMark() {
  return (
    <span className="flex items-center" aria-hidden="true">
      <span className="w-4 h-4 rounded-full bg-[#EB001B]" />
      <span className="w-4 h-4 rounded-full bg-[#F79E1B]/90 -ml-1.5" />
    </span>
  )
}
function JustPayMark() {
  return <span className="text-[13px] font-black lowercase tracking-tight text-[#2b3ce0]">justpay</span>
}

// Koko pastel gradient (login page palette): light blue → lavender → pink
const PASTEL_GRADIENT = "linear-gradient(149.739deg, rgb(189, 220, 238) 0%, rgb(224, 231, 255) 35%, rgb(243, 232, 255) 70%, rgb(252, 231, 243) 100%)"

// Unified booking badge: same shape as the landing card tags ("Most popular" etc.)
function Tag({ children, tone = "blue", className }) {
  const tones = {
    blue: "bg-[#BDDCEE] text-gray-800",
    emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    dark: "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
  }
  return (
    <span className={cn("inline-flex items-center text-[11px] font-bold uppercase tracking-[0.04em] px-3 py-1.5 rounded-full whitespace-nowrap leading-none", tones[tone], className)}>
      {children}
    </span>
  )
}

// Pastel pink-to-blue gradient badge (login page palette) with a recurring shine swipe
function ShinyTag({ children, className }) {
  return (
    <span
      className={cn(
        "relative overflow-hidden inline-flex items-center text-[11px] font-bold uppercase tracking-[0.04em] px-3.5 py-1.5 rounded-full whitespace-nowrap leading-none text-gray-900 shadow-sm",
        className,
      )}
      style={{ backgroundImage: PASTEL_GRADIENT }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-[badgeShine_2.8s_ease-in-out_infinite] motion-reduce:animate-none"
      />
      <span className="relative">{children}</span>
    </span>
  )
}

// Smooth two-way expand/collapse: animates open and closed via grid-rows,
// so content slides in and out instead of popping
function Collapse({ open, children }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  )
}

// Portal-standard radio dot, same look as the payment and position options
function Radio({ on }) {
  return (
    <span
      className={cn(
        "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0",
        on
          ? "border-gray-900 bg-gray-900 shadow-[inset_0_0_0_3px_#fff] dark:border-gray-100 dark:bg-gray-100 dark:shadow-[inset_0_0_0_3px_#1D232A]"
          : "border-border bg-card",
      )}
    />
  )
}

const CREATIVE_CHECKS = [
  { id: "size", label: "File size under 5 MB" },
  { id: "format", label: "JPG or PNG format" },
  { id: "res", label: "Resolution at least 1600 × 640 px" },
]

function CheckRow({ label, state }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      {state === undefined ? (
        <span className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
      ) : state === "running" ? (
        <span className="w-5 h-5 rounded-full border-2 border-border border-t-gray-900 dark:border-t-gray-100 animate-spin flex-shrink-0" />
      ) : state ? (
        <span className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white stroke-[3]" /></span>
      ) : (
        <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0"><X className="w-3 h-3 text-white stroke-[3]" /></span>
      )}
      <span className={cn("text-sm", state === false ? "font-semibold text-red-700 dark:text-red-400" : state === true ? "text-foreground" : "text-muted-foreground")}>{label}</span>
    </div>
  )
}

// Mock-app position preview with sliding carousel + engagement meter
const ENGAGEMENT_LADDER = [3.0, 2.1, 1.6, 1.3, 1.15, 1.1, 1.05, 1.0]
const engagementOf = (n) => ENGAGEMENT_LADDER[Math.min(n - 1, ENGAGEMENT_LADDER.length - 1)]

function PositionPreview({ placement, position }) {
  const count = Math.min(placement.positionCount, 8)
  const active = position || null
  const shift = (active || 1) - 1
  const maxEng = engagementOf(1)
  return (
    <div className="bg-muted/50 rounded-xl flex flex-col items-center justify-center gap-3 overflow-hidden px-5 py-6">
      <div className="w-[180px] rounded-[20px] bg-[#17171c] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.18)] overflow-hidden flex-shrink-0">
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
          <span className="text-[8px] font-semibold text-white/70">9:41</span>
          <span className="flex gap-0.5">{[0, 1, 2].map((i) => <span key={i} className="h-1 w-1 rounded-full bg-white/30" />)}</span>
        </div>
        <div className="px-2.5 pb-3 space-y-2">
          {placement.id === "checkout" ? (
            <div className="rounded-lg bg-[#3ec97e]/20 py-1.5 text-center text-[8px] font-bold text-[#7de0a9]">Order confirmed ✓</div>
          ) : placement.id === "search" ? (
            <>
              <div className="h-3.5 rounded-full bg-white/10 border border-white/15" />
              <p className="text-center text-[8px] font-semibold text-white/60 py-0.5">No results found.</p>
            </>
          ) : (
            <div className="h-3.5 rounded-full bg-white/10 border border-white/15" />
          )}
          {placement.id === "secondary" && <div className="h-8 rounded-lg bg-white/10" />}
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex gap-1.5 transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(calc(${-shift} * (100% + 6px)))` }}
            >
              {Array.from({ length: count }, (_, i) => i + 1).map((n) => {
                const isActive = n === active
                return (
                  <div
                    key={n}
                    className={cn(
                      "relative h-16 w-full flex-shrink-0 rounded-lg border-2 flex items-end p-1.5 transition-colors duration-300",
                      isActive ? "border-[#9356ff] bg-[#9356ff]/20" : "border-white/20 border-dashed bg-white/5",
                    )}
                  >
                    {isActive ? (
                      <span className="bg-[#9356ff] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">Your ad</span>
                    ) : (
                      <span className="text-[8px] font-bold text-white/50 leading-none">{POSITION_LABEL[placement.id]} {n}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex justify-center gap-1">
            {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
              <span key={n} className={cn("h-1 rounded-full transition-all duration-500", n === active ? "w-3 bg-[#9356ff]" : "w-1 bg-white/25")} />
            ))}
          </div>
          <div className="rounded-lg bg-white/5 px-2 pt-1.5 pb-2">
            <p className="text-[7px] font-bold uppercase tracking-wider text-white/50">Typical engagement by position</p>
            <div className="flex items-end gap-1 h-9 mt-1">
              {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
                <div key={n} className="flex-1 flex flex-col items-center gap-0.5 self-stretch justify-end">
                  <div
                    className={cn("w-full rounded-sm transition-all duration-500", n === active ? "bg-[#9356ff]" : "bg-white/20")}
                    style={{ height: `${Math.round((engagementOf(n) / maxEng) * 100)}%` }}
                  />
                  <span className={cn("text-[7px] font-bold leading-none", n === active ? "text-[#9356ff]" : "text-white/40")}>{n}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => <div key={i} className="h-7 rounded-md bg-white/5" />)}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-[210px]">
        {active ? (
          <>≈<span className="font-bold text-foreground tabular-nums">{engagementOf(active).toFixed(1)}×</span> typical engagement at {POSITION_LABEL[placement.id].toLowerCase()} {active}</>
        ) : (
          "Earlier positions usually get more engagement."
        )}
      </p>
    </div>
  )
}

function BookingFlow({ ids, onToggle, onRemove, onAdd, campaignId, onExit, onViewBookings, flow = "default", showPrices }) {
  const selected = placements.filter((p) => ids.includes(p.id))
  // Flow 2 starts with no spaces; they get picked in the Spaces step
  const placementsSel = selected.length ? selected : flow === "cta" ? [] : [placements[0]]
  const multi = placementsSel.length > 1
  const needsCreative = placementsSel.some((p) => p.creative === "banner")

  const hasSpacesStep = flow === "cta"
  const spacesStep = hasSpacesStep ? 2 : null
  const positionsStep = hasSpacesStep ? 3 : 2
  const assetsStep = needsCreative ? positionsStep + 1 : null
  const paymentStep = needsCreative ? positionsStep + 2 : positionsStep + 1
  const steps = ["Select dates", ...(hasSpacesStep ? ["Spaces"] : []), "Positions", ...(needsCreative ? ["Assets"] : []), "Payment"]

  const TODAY = startOfToday()
  const todayISO = localISO(TODAY)
  const bookedISO = [localISO(addDays(TODAY, 7)), localISO(addDays(TODAY, 13))]

  const [step, setStep] = useState(1)
  const [positions, setPositions] = useState({})
  const [posOpen, setPosOpen] = useState(placementsSel[0]?.id || null)
  const [addOpen, setAddOpen] = useState(false)
  const [bundleApplied, setBundleApplied] = useState(false)
  const [anchor, setAnchor] = useState(todayISO)
  const [startISO, setStartISO] = useState(null)
  const [endISO, setEndISO] = useState(null)
  const [deal, setDeal] = useState(null) // { label, pct }
  const [blockedHint, setBlockedHint] = useState(null)
  const [campaignSel, setCampaignSel] = useState([])
  const [campaignOpen, setCampaignOpen] = useState(campaignId || null)
  const [campStart, setCampStart] = useState(null)
  const [campEnd, setCampEnd] = useState(null)
  const [campVisible, setCampVisible] = useState(6)
  const [periodMode, setPeriodMode] = useState("campaign")
  const [bundleDetailsId, setBundleDetailsId] = useState(null)
  const [creative, setCreative] = useState("koko")
  const [upload, setUpload] = useState(null)
  const [payment, setPayment] = useState("credit")
  const [confirmed, setConfirmed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // ── date window ──
  const anchorDate = (() => { const a = fromISO(anchor); return a < TODAY ? TODAY : a })()
  const campaignForISO = (s) => campaignPeriods.find((c) => s >= c.startISO && diffDays(c.startISO, s) < c.periodDays)
  const windowDays = Array.from({ length: 30 }, (_, i) => {
    const d = addDays(anchorDate, i)
    const s = localISO(d)
    const dow = d.getDay()
    const camp = campaignForISO(s)
    return {
      iso: s,
      day: d.getDate(),
      dow: DOW3[dow],
      mon: MON3[d.getMonth()],
      isToday: s === todayISO,
      lead: diffDays(todayISO, s) >= 0 && diffDays(todayISO, s) < LEAD_DAYS,
      booked: bookedISO.includes(s),
      boost: (dow === 0 || dow === 6) && !camp,
      camp,
    }
  })

  // ── pricing ──
  const positionOf = (p) => positions[p.id] || 1
  const multOf = (p) => (positions[p.id] ? posMult(p.id, positions[p.id]) : 1)
  const sumVpd = placementsSel.reduce((a, p) => a + p.vpd * multOf(p), 0)
  const perDayBase = placementsSel.reduce((a, p) => a + Math.round(p.basePrice * multOf(p)), 0)
  const factorFor = (s) => {
    const c = campaignForISO(s)
    if (c) return c.multiple
    const dw = fromISO(s).getDay()
    return dw === 0 || dw === 6 ? 1.09 : 1
  }
  const priceForISO = (s) => placementsSel.reduce((a, p) => a + Math.round(p.basePrice * multOf(p) * factorFor(s)), 0)
  const rawRangeCost = (aISO, bISO) => {
    let total = 0
    for (let i = 0; i <= diffDays(aISO, bISO); i++) total += priceForISO(localISO(addDays(fromISO(aISO), i)))
    return total
  }
  const hasRange = !!(startISO && endISO)
  const rangeDays = hasRange ? diffDays(startISO, endISO) + 1 : 0
  const manualRaw = hasRange ? rawRangeCost(startISO, endISO) : 0
  const manualCost = deal ? Math.round(manualRaw * (1 - deal.pct)) : manualRaw
  const campPerDay = (c) => placementsSel.reduce((a, p) => a + Math.round(p.basePrice * multOf(p) * c.multiple), 0)
  const campPrice = (c, days, full) => (full ? Math.round(campPerDay(c) * c.periodDays * (1 - FULL_PERIOD_DISCOUNT)) : campPerDay(c) * days)
  const campaignsCost = campaignSel.reduce((a, sel) => {
    const c = campaignPeriods.find((x) => x.id === sel.id)
    return a + campPrice(c, sel.days, sel.full)
  }, 0)
  const hasPeriod = hasRange || campaignSel.length > 0
  const mediaRaw = manualCost + campaignsCost
  const bundleActive = bundleApplied && multi
  const bundleSaving = bundleActive ? Math.round(mediaRaw * BUNDLE_DISCOUNT) : 0
  const mediaCost = mediaRaw - bundleSaving
  // Design fee only enters once the user reaches the assets step
  const reachedAssets = assetsStep ? step >= assetsStep || confirmed : false
  const designFee = needsCreative && creative === "koko" && reachedAssets ? 12500 : 0
  const positionsComplete = placementsSel.length > 0 && placementsSel.every((p) => positions[p.id])
  const subtotal = hasPeriod ? mediaCost + designFee : 0
  const onPaymentStep = step === paymentStep || confirmed
  const processingFee = onPaymentStep ? (payment === "credit" ? Math.round(subtotal * 0.05) : payment === "card" ? Math.round(subtotal * 0.02) : 0) : 0
  const feeLabel = payment === "credit" ? "Convenience fee (5%)" : "Card fee (2%)"
  const justpayDiscount = onPaymentStep && payment === "justpay" ? Math.round(subtotal * 0.02) : 0
  const total = subtotal + processingFee - justpayDiscount
  const manualViews = hasRange ? sumVpd * rangeDays : 0
  const campaignViews = campaignSel.reduce((a, sel) => {
    const c = campaignPeriods.find((x) => x.id === sel.id)
    return a + sumVpd * sel.days * c.multiple
  }, 0)
  const periodViews = manualViews + campaignViews
  const totalDays = rangeDays + campaignSel.reduce((a, s) => a + s.days, 0)
  const spacesLabel = placementsSel.map((p) => `${p.id === "hero" ? "" : p.name + " "}${POSITION_LABEL[p.id]} ${positionOf(p)}`).join(", ")
  const rangeText = hasRange ? `From ${longDate(startISO)} to ${longDate(endISO)}` : null
  const dateText = hasPeriod
    ? [rangeText, ...campaignSel.map((sel) => campaignPeriods.find((x) => x.id === sel.id).name)].filter(Boolean).join(" + ")
    : "Not chosen yet"
  const shortRange = hasRange
    ? `${fromISO(startISO).getDate()} ${MON3[fromISO(startISO).getMonth()]} to ${fromISO(endISO).getDate()} ${MON3[fromISO(endISO).getMonth()]}`
    : null
  const shortDateText = [
    shortRange,
    ...campaignSel.map((sel) => {
      const c = campaignPeriods.find((x) => x.id === sel.id)
      return sel.full ? `${c.name} (${c.dates})` : `${c.name} (${sel.days} of ${c.periodDays} days)`
    }),
  ].filter(Boolean).join(" + ")

  // ── upsell candidates for own dates ──
  const weekEndISO = hasRange && rangeDays < 7 ? localISO(addDays(fromISO(startISO), 6)) : null
  const weekRaw = weekEndISO ? rawRangeCost(startISO, weekEndISO) : 0
  const weekPrice = Math.round(weekRaw * 0.95)
  // One upsell at a time: 1-6 days gets the week nudge; only 8-21 days gets the month nudge
  const monthEndISO = hasRange && rangeDays >= 8 && rangeDays <= 21 ? localISO(addDays(fromISO(startISO), 29)) : null
  const monthRaw = monthEndISO ? rawRangeCost(startISO, monthEndISO) : 0
  const monthPrice = Math.round(monthRaw * 0.9)

  // ── interactions ──
  const pickDay = (cell) => {
    if (cell.lead) {
      setBlockedHint(`Bookings need ${LEAD_DAYS} days for approval. Earliest start: ${longDate(localISO(addDays(TODAY, LEAD_DAYS)))}.`)
      return
    }
    if (cell.booked) {
      setBlockedHint(`${longDate(cell.iso)} is already booked. Pick around it.`)
      return
    }
    setBlockedHint(null)
    setDeal(null)
    if (!startISO || endISO) { setStartISO(cell.iso); setEndISO(null); return }
    if (cell.iso < startISO) { setStartISO(cell.iso); setEndISO(null); return }
    for (let i = 0; i <= diffDays(startISO, cell.iso); i++) {
      const s = localISO(addDays(fromISO(startISO), i))
      if (bookedISO.includes(s)) {
        setBlockedHint("That range crosses a booked date. Pick around it.")
        return
      }
    }
    setEndISO(cell.iso)
  }

  // Month/year picker: the 30 day window starts at the 1st of the chosen month, never in the past
  const anchorToMonth = (y, m) => {
    const first = new Date(y, m, 1)
    setAnchor(localISO(first < TODAY ? TODAY : first))
  }

  const openCampaign = (id) => { setCampaignOpen(id); setCampStart(null); setCampEnd(null) }
  const campDayPick = (i) => {
    if (campStart === null || campEnd !== null) { setCampStart(i); setCampEnd(null); return }
    if (i < campStart) { setCampStart(i); setCampEnd(null); return }
    setCampEnd(i)
  }
  // One campaign per booking: picking a campaign replaces any previous pick
  const addCampaign = (c, full) => {
    const days = full ? c.periodDays : (campEnd !== null ? campEnd - campStart + 1 : 1)
    setCampaignSel([{ id: c.id, days, full }])
    setCampaignOpen(null)
  }
  const removeCampaign = (id) => setCampaignSel((prev) => prev.filter((x) => x.id !== id))

  const removeSpace = (id) => { setBundleApplied(false); onRemove(id) }
  const addSpace = (id) => { onAdd(id); setAddOpen(false) }

  const runChecks = (file) => {
    setUpload({ name: file.name, states: ["running", undefined, undefined], done: false, passed: false })
    const sizeOk = file.size <= 5 * 1024 * 1024
    const formatOk = ["image/jpeg", "image/png"].includes(file.type)
    const finish = (resOk) => {
      setTimeout(() => setUpload({ name: file.name, states: [sizeOk, "running", undefined], done: false, passed: false }), 500)
      setTimeout(() => setUpload({ name: file.name, states: [sizeOk, formatOk, "running"], done: false, passed: false }), 1000)
      setTimeout(() => {
        const passed = sizeOk && formatOk && resOk
        setUpload({ name: file.name, states: [sizeOk, formatOk, resOk], done: true, passed })
        if (passed) showToast("success", "Creative checks passed", "Your asset meets the spec and is queued for review.")
      }, 1600)
    }
    if (formatOk) {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => { finish(img.width >= 1600 && img.height >= 640); URL.revokeObjectURL(url) }
      img.onerror = () => { finish(false); URL.revokeObjectURL(url) }
      img.src = url
    } else {
      finish(false)
    }
  }

  const stepReady =
    step === 1 ? hasPeriod
    : step === spacesStep ? placementsSel.length > 0
    : step === positionsStep ? placementsSel.length > 0 && placementsSel.every((p) => positions[p.id])
    : step === assetsStep ? (creative === "koko" || (upload && upload.passed))
    : true
  const primaryLabel = confirmed
    ? "Booking confirmed ✓"
    : step === 1 ? (hasSpacesStep ? "Continue to spaces" : "Continue to positions")
    : step === spacesStep ? "Continue to positions"
    : step === positionsStep ? (needsCreative ? "Continue to assets" : "Continue to payment")
    : step === assetsStep ? "Continue to payment"
    : "Confirm and pay"
  const primaryDisabled = !stepReady || confirmed
  const onPrimary = () => {
    if (primaryDisabled) return
    if (step < paymentStep) {
      const next = step + 1
      // Entering positions from the spaces step: open the first unpicked space
      if (hasSpacesStep && next === positionsStep) {
        setPosOpen(placementsSel.find((p) => !positions[p.id])?.id || placementsSel[0]?.id || null)
      }
      setStep(next)
    } else {
      // Final step: ask for explicit confirmation before charging
      setConfirmOpen(true)
    }
  }
  const doConfirm = () => {
    setConfirmOpen(false)
    setConfirmed(true)
    showToast("success", "Booking confirmed", `${spacesLabel}. We'll take it from here.`)
  }

  const paymentOptions = [
    { id: "credit", label: "Koko seller credit", base: "Deducted from your payout", feeLine: "+5% convenience fee", feeKind: "fee", feePct: 0.05, tag: "Fastest & most convenient", mark: <img src={kokoLogo} alt="Koko" className="h-6 w-6 object-contain" /> },
    { id: "card", label: "Card", base: "Visa or Mastercard", feeLine: "+2% card fee", feeKind: "fee", feePct: 0.02, mark: <span className="flex items-center gap-2"><VisaMark /><MastercardMark /></span> },
    { id: "justpay", label: "JustPay", base: "Pay from your bank account", feeLine: "2% discount", feeKind: "discount", feePct: 0.02, mark: <JustPayMark /> },
  ]

  const unselectedSpaces = placements.filter((p) => !ids.includes(p.id))
  // Bundle offers: the recommended partner first, then the biggest audiences, up to 4
  const recommendedPartnerId = placementsSel[0] ? BUNDLE_PARTNER[placementsSel[0].id] : null
  const bundleOffers = [...unselectedSpaces]
    .sort((a, b) => (a.id === recommendedPartnerId ? -1 : b.id === recommendedPartnerId ? 1 : b.weeklyImpressions - a.weeklyImpressions))
    .slice(0, 4)
  const selWeekly = placementsSel.reduce((a, p) => a + p.weekly, 0)

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="p-8 sm:p-10 text-center space-y-5">
            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Thank you. Your booking is confirmed</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Booking <span className="font-mono font-medium text-foreground">KAD-1084</span> · {money(total)} · {spacesLabel}.
                {" "}{creative === "upload" && needsCreative
                  ? "Your creative passed the spec checks and is queued for review, which takes up to 2 business days."
                  : needsCreative
                    ? "Koko's design team is creating your assets now. Approval is near-instant."
                    : "Your store thumbnail is the creative, so there is nothing more to do."}
              </p>
              <p className="text-sm font-semibold">Check <span className="underline underline-offset-2">My advertisements</span> to see when your creative is approved and your ad goes live.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-2 pt-1">
              <button onClick={onViewBookings} className="rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-7 py-3 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors cursor-pointer">
                Check My advertisements
              </button>
              <button onClick={onExit} className="rounded-lg border border-border px-7 py-3 text-sm font-medium hover:border-gray-900 dark:hover:border-gray-200 transition-colors cursor-pointer">
                Back to Advertise
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={onExit}
          aria-label="Back to Advertise"
          className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center flex-shrink-0 transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-[26px] font-bold tracking-tight leading-tight">New booking</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {multi ? `${placementsSel.length} spaces · ` : ""}Pick dates, choose positions, then pay.
          </p>
        </div>
      </div>
      <div className="flex">
        <Stepper steps={steps} step={step} onGo={setStep} />
      </div>

      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-7">
          {/* ── FLOW 2 STEP 2: SPACES ── */}
          {hasSpacesStep && step === spacesStep && (
            <section>
              <PlacementPicker
                selectedIds={ids}
                onToggle={onToggle}
                showPrices={showPrices}
                heading={
                  <div>
                    <h3 className="text-[19px] font-bold tracking-tight">Choose where you want to be seen</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Pick one space or a few. One booking covers all of them.</p>
                  </div>
                }
              />
            </section>
          )}

          {/* ── POSITIONS ── */}
          {step === positionsStep && (
            <section className="flex flex-col gap-3">
              <div>
                <h3 className="text-[19px] font-bold tracking-tight">Pick your positions</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Earlier positions get more engagement.</p>
              </div>
              {bundleActive && (
                <div className="rounded-[14px] border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-5 py-3.5 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </span>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold">{placementsSel.map((p) => p.name).join(" + ")} bundle.</span> You're saving {BUNDLE_DISCOUNT * 100}% on this bundle.
                  </p>
                </div>
              )}
              {placementsSel.map((p) => {
                const open = posOpen === p.id
                const chosen = positions[p.id]
                const optCount = Math.min(p.positionCount, 8)
                return (
                  <div key={p.id} className="bg-card border border-border/60 rounded-[18px] overflow-hidden">
                    <div className="w-full flex items-center justify-between gap-4 px-6 py-4">
                      <button
                        onClick={() => setPosOpen(open ? null : p.id)}
                        className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                      >
                        <span className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0", chosen ? "bg-emerald-600" : "bg-amber-100 dark:bg-amber-900/40")}>
                          {chosen
                            ? <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            : <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold">{p.name}</span>
                          <span className={cn("block text-xs", chosen ? "text-muted-foreground" : "font-semibold text-amber-700 dark:text-amber-400")}>
                            {chosen ? `${POSITION_LABEL[p.id]} ${chosen} selected` : "Select a position to continue"}
                          </span>
                        </span>
                      </button>
                      <span className="flex items-center gap-4 flex-shrink-0">
                        <button
                          onClick={() => setPosOpen(open ? null : p.id)}
                          className="text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground cursor-pointer"
                        >
                          {open ? "Collapse" : "Edit"}
                        </button>
                        {multi && (
                          <button
                            onClick={() => removeSpace(p.id)}
                            aria-label={`Remove ${p.name}`}
                            className="text-xs font-semibold text-red-600 dark:text-red-400 underline underline-offset-2 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </span>
                    </div>
                    <Collapse open={open}>
                      <div className="px-6 pb-6 grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)] items-start">
                        <PositionPreview placement={p} position={chosen} />
                        <div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Array.from({ length: optCount }, (_, i) => i + 1).map((n) => {
                              const isSel = chosen === n
                              const info = posInfo(p.id, n)
                              const weeklyAt = Math.round(p.basePrice * posMult(p.id, n)) * 7
                              const priceDiffers = posMult(p.id, n) !== 1
                              return (
                                <button
                                  key={n}
                                  onClick={() => setPositions((prev) => ({ ...prev, [p.id]: n }))}
                                  className={cn(
                                    "flex items-start gap-3 text-left rounded-xl border-[1.5px] px-4 py-3.5 transition-colors duration-150 cursor-pointer",
                                    isSel ? "bg-card border-gray-900 dark:border-gray-200" : "bg-card border-border hover:border-gray-400",
                                  )}
                                >
                                  <span className={cn(
                                    "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5",
                                    isSel
                                      ? "border-gray-900 bg-gray-900 shadow-[inset_0_0_0_3px_#fff] dark:border-gray-100 dark:bg-gray-100 dark:shadow-[inset_0_0_0_3px_#1D232A]"
                                      : "border-border bg-card",
                                  )} />
                                  <span className="min-w-0 flex-1">
                                    <span className="flex items-center gap-2 text-sm font-bold flex-wrap">
                                      {POSITION_LABEL[p.id]} {n}
                                      {info.tag && <Tag>{info.tag}</Tag>}
                                      
                                    </span>
                                    <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                                      <span className="font-bold text-foreground tabular-nums">≈{info.eng.toFixed(1)}×</span> engagement · {info.note}
                                    </span>
                                    {priceDiffers && <span className="block text-xs font-semibold tabular-nums mt-1">{money(weeklyAt)} / week</span>}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                          {p.positionCount > optCount && (
                            <p className="text-xs text-muted-foreground mt-2.5">+{p.positionCount - optCount} more positions available through your Koko manager.</p>
                          )}
                          {chosen && (() => {
                            const nextUnchosen = placementsSel.find((x) => x.id !== p.id && !positions[x.id])
                            return nextUnchosen ? (
                              <button
                                onClick={() => setPosOpen(nextUnchosen.id)}
                                className="mt-4 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer"
                              >
                                Next: {nextUnchosen.name} →
                              </button>
                            ) : (
                              <p className="mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">All positions picked. You're good to continue.</p>
                            )
                          })()}
                        </div>
                      </div>
                    </Collapse>
                  </div>
                )
              })}

              {/* Bundle deals: only offered when exactly one space is selected, after positions are picked. */}
              {placementsSel.length === 1 && positionsComplete && !bundleActive && bundleOffers.length > 0 && (
                <div className="rounded-[18px] border-[1.5px] border-[#BDDCEE] bg-[#BDDCEE]/10 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <Tag>Koko recommends</Tag>
                      <h4 className="text-base font-bold mt-2.5">Bundle another space, save 5%</h4>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        Add a second space. The 5% comes off your whole booking.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {bundleOffers.map((partner) => {
                      const combined = selWeekly + partner.weekly
                      const detailsOpen = bundleDetailsId === partner.id
                      return (
                        <div key={partner.id} className="relative bg-card border-[1.5px] border-border rounded-[14px] overflow-hidden flex flex-col">
                          {partner.id === recommendedPartnerId && (
                            <Tag className="absolute top-3 right-3 z-10">Best match</Tag>
                          )}
                          {/* The two placements, side by side in the app */}
                          <div className="bg-muted/50 h-[120px] flex items-end justify-center gap-3 overflow-hidden pt-4">
                            <PlacementMockup id={placementsSel[0].id} width={72} height={104} revealed />
                            <span className="self-center text-base font-bold text-muted-foreground pb-8">+</span>
                            <PlacementMockup id={partner.id} width={72} height={104} revealed />
                          </div>
                          <div className="p-4 flex flex-col gap-2 flex-1">
                            <p className="text-sm font-bold leading-snug">{placementsSel[0].name} + {partner.name}</p>
                            <div className="flex items-center justify-between gap-3 flex-wrap mt-auto">
                              <button
                                onClick={() => setBundleDetailsId(detailsOpen ? null : partner.id)}
                                className="text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground cursor-pointer whitespace-nowrap"
                              >
                                {detailsOpen ? "Hide details" : "More details"}
                              </button>
                              <button
                                onClick={() => { addSpace(partner.id); setBundleApplied(true) }}
                                className="rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:bg-gray-800 hover:shadow-md hover:-translate-y-px dark:hover:bg-gray-200 active:scale-[0.98] cursor-pointer whitespace-nowrap flex-shrink-0"
                              >
                                Add bundle · save 5%
                              </button>
                            </div>
                            <Collapse open={detailsOpen}>
                              <div className="border-t border-border/40 pt-2.5 mt-1 flex flex-col gap-1">
                                <p className="text-xs text-muted-foreground">{partner.description}</p>
                                <p className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">Adds ~{compact(partner.weeklyImpressions)} views / week</p>
                                <p className="text-sm tabular-nums whitespace-nowrap">
                                  <span className="line-through text-muted-foreground mr-1.5">{money(combined)}</span>
                                  <span className="font-bold">{money(Math.round(combined * (1 - BUNDLE_DISCOUNT)))}</span>
                                  <span className="text-muted-foreground"> / week together</span>
                                </p>
                              </div>
                            </Collapse>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Add spaces without leaving the flow */}
              {unselectedSpaces.length > 0 && (
                <div>
                  <button
                    onClick={() => setAddOpen(!addOpen)}
                    className="w-full sm:w-auto rounded-lg border-[1.5px] border-gray-400 dark:border-gray-500 bg-card px-8 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:border-gray-900 hover:bg-muted/40 dark:hover:border-gray-200 cursor-pointer"
                  >
                    {addOpen ? "Close" : "+ Add another space"}
                  </button>
                  <Collapse open={addOpen}>
                    <div className="mt-3 rounded-[18px] border border-border/60 bg-card divide-y divide-border/40">
                      {unselectedSpaces.map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                          <div className="min-w-0">
                            <p className="text-sm font-bold">{p.name}</p>
                            <p className="text-xs text-muted-foreground tabular-nums">{compact(p.weeklyImpressions)} views / week · from {money(p.weekly)} / week</p>
                          </div>
                          <button
                            onClick={() => addSpace(p.id)}
                            className="rounded-lg border-[1.5px] border-gray-900 dark:border-gray-200 px-4 py-1.5 text-xs font-medium transition-colors hover:bg-gray-900 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 cursor-pointer flex-shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </Collapse>
                </div>
              )}
            </section>
          )}

          {/* ── STEP 1: PERIOD ── */}
          {step === 1 && (
            <>
              {/* First choice: campaign week or own dates. Content follows the pick. */}
              <section className="flex flex-col gap-3">
                <div>
                  <h3 className="text-[19px] font-bold tracking-tight">When do you want to grow your brand on Koko?</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2 items-stretch mt-2">
                  <button
                    onClick={() => setPeriodMode("campaign")}
                    className={cn(
                      "relative text-left rounded-2xl border-2 p-6 pt-8 transition-colors duration-150 cursor-pointer flex flex-col",
                      periodMode === "campaign" ? "border-gray-900 dark:border-gray-200 shadow-md" : "border-border hover:border-gray-400",
                    )}
                  >
                    <ShinyTag className="absolute -top-3.5 left-5">Most popular</ShinyTag>
                    <span className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-base font-bold">
                        <img src={kokoWordmark} alt="Koko" className="h-4 w-auto select-none" /> campaign week
                      </span>
                      <Radio on={periodMode === "campaign"} />
                    </span>
                    <span className="flex flex-col gap-2 mt-4">
                      {["Up to 3x the usual audience", "Guaranteed slot for the period", "Fixed dates, zero guesswork"].map((f) => (
                        <span key={f} className="flex items-center gap-2.5 text-sm">
                          <span className="w-[18px] h-[18px] rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0"><Check className="w-2.5 h-2.5 text-white stroke-[3]" /></span>
                          {f}
                        </span>
                      ))}
                    </span>
                    {campaignSel.length > 0 && (
                      <span className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-3">Selected: {campaignPeriods.find((x) => x.id === campaignSel[0].id)?.name}</span>
                    )}
                  </button>
                  <button
                    onClick={() => setPeriodMode("own")}
                    className={cn(
                      "relative text-left rounded-2xl border-2 p-6 transition-colors duration-150 cursor-pointer flex flex-col",
                      periodMode === "own" ? "border-gray-900 dark:border-gray-200 shadow-md" : "border-border hover:border-gray-400",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-base font-bold">Custom dates</span>
                      <Radio on={periodMode === "own"} />
                    </span>
                    <span className="flex flex-col gap-2 mt-4">
                      {["Any start and end date", "30 day window", "Needs 3 days for approval"].map((f) => (
                        <span key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <span className="w-[18px] h-[18px] rounded-full border-2 border-amber-400 flex items-center justify-center flex-shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /></span>
                          {f}
                        </span>
                      ))}
                    </span>
                    {hasRange && (
                      <span className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-3">Selected: {rangeDays} day{rangeDays > 1 ? "s" : ""}</span>
                    )}
                  </button>
                </div>
              </section>

              {/* Campaign upsell, 6 at a time */}
              {periodMode === "campaign" && (
              <section className="bg-card border border-border/60 rounded-[18px] p-6 sm:p-7 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-end justify-between gap-5 flex-wrap">
                  <div>
                    <h3 className="text-[19px] font-bold tracking-tight">Pick a campaign week</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">The year's biggest audiences. One campaign per booking.</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap pb-1">First come, first served</span>
                </div>
                {(() => {
                  // Once a campaign is opened or selected, the rest disappear and the
                  // card is chunked with its day picker. Remove brings the grid back.
                  const activeCampaign = campaignPeriods.find((x) => x.id === (campaignOpen || campaignSel[0]?.id))
                  const visibleCampaigns = activeCampaign ? [activeCampaign] : campaignPeriods.slice(0, campVisible)
                  const clearCampaign = () => { setCampaignSel([]); setCampaignOpen(null) }
                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        {visibleCampaigns.map((c) => {
                          const added = campaignSel.find((x) => x.id === c.id)
                          const isOpen = campaignOpen === c.id
                          return (
                            <div
                              key={c.id}
                              className={cn(
                                "relative text-left rounded-[14px] border-[1.5px] overflow-hidden bg-card transition-colors duration-150 flex flex-col",
                                added || isOpen ? "border-gray-900 dark:border-gray-200" : "border-border hover:border-gray-400",
                              )}
                            >
                              <span className="h-12 px-4 flex items-center" style={{ background: c.band, color: c.ink }}>
                                <span className="text-sm font-bold leading-tight">{c.name}</span>
                              </span>
                              <span className="flex flex-col flex-1 px-4 py-3.5">
                                <span className="text-xs font-bold tabular-nums">{c.dates}</span>
                                <span className="flex items-baseline gap-1.5 mt-2">
                                  <span className="text-2xl font-bold tabular-nums tracking-tight leading-none">{c.multiple}×</span>
                                  <span className="text-xs text-muted-foreground">normal traffic</span>
                                </span>
                                <span className="block text-xs text-foreground/80 mt-1.5">
                                  Up to <span className="font-bold tabular-nums">{short(sumVpd * c.periodDays * c.multiple)}</span> views over the period · guaranteed slot
                                </span>
                                <span className={cn("block text-[11px] mt-1.5", c.earlyBird ? "font-bold text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>
                                  {added ? (added.full ? `Selected · full period · saved ${FULL_PERIOD_DISCOUNT * 100}%` : `Selected · ${added.days} of ${c.periodDays} days`) : c.note}
                                </span>
                                <button
                                  onClick={() => (activeCampaign ? clearCampaign() : openCampaign(c.id))}
                                  className={cn(
                                    "mt-3 self-start rounded-lg px-4 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap",
                                    activeCampaign
                                      ? "border-[1.5px] border-gray-900 dark:border-gray-200 text-foreground bg-card hover:bg-muted/40"
                                      : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 shadow-sm",
                                  )}
                                >
                                  {activeCampaign ? "Unselect" : "Select"}
                                </button>
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      {!activeCampaign && campaignPeriods.length > 6 && (
                        <div className="flex justify-center mt-4">
                          {campVisible < campaignPeriods.length ? (
                            <button
                              onClick={() => setCampVisible(campVisible + 6)}
                              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
                            >
                              See more campaign weeks ({campaignPeriods.length - campVisible})
                            </button>
                          ) : (
                            <button
                              onClick={() => setCampVisible(6)}
                              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
                            >
                              See fewer campaign weeks
                            </button>
                          )}
                        </div>
                      )}

                      <Collapse open={!!(campaignOpen && activeCampaign)}>
                      {activeCampaign && (() => {
                        const c = activeCampaign
                        const partialDays = campEnd !== null ? campEnd - campStart + 1 : campStart !== null ? 1 : 0
                        const fullRaw = campPerDay(c) * c.periodDays
                        const fullPrice = Math.round(fullRaw * (1 - FULL_PERIOD_DISCOUNT))
                        return (
                          <div className="mt-4 rounded-[14px] border border-border/60 bg-muted/20 p-5">
                            <p className="text-sm font-bold">{c.name}. Fixed dates, {c.dates}</p>
                            <p className="text-xs text-muted-foreground mt-1">Tap your days, or book the full period and save {FULL_PERIOD_DISCOUNT * 100}%.</p>
                            <div className="mt-3">
                              {partialDays === 0 ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-full px-2.5 py-1 leading-none whitespace-nowrap">
                                  <AlertCircle className="w-3 h-3" />0/{c.periodDays} days selected. Tap the dates below
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-1 leading-none whitespace-nowrap">
                                  <Check className="w-3 h-3 stroke-[3]" />{partialDays}/{c.periodDays} days selected
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {Array.from({ length: c.periodDays }, (_, i) => i).map((i) => {
                                const lbl = campaignDayLabel(c, i)
                                const inR = campStart !== null && (campEnd !== null ? i >= campStart && i <= campEnd : i === campStart)
                                return (
                                  <button
                                    key={i}
                                    onClick={() => campDayPick(i)}
                                    className={cn(
                                      "w-11 rounded-lg border-[1.5px] px-0 py-2 text-center transition-colors duration-150 cursor-pointer",
                                      inR ? "bg-gray-900 border-gray-900 text-white dark:bg-gray-100 dark:border-gray-100 dark:text-gray-900" : "bg-card border-border hover:border-gray-900 dark:hover:border-gray-200",
                                    )}
                                  >
                                    <span className="block text-sm font-bold tabular-nums">{lbl.day}</span>
                                    <span className={cn("block text-[9px] font-semibold", inR ? "opacity-70" : "text-muted-foreground")}>{lbl.m}</span>
                                  </button>
                                )
                              })}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-5">
                              {partialDays > 0 && partialDays < c.periodDays && (
                                <button
                                  onClick={() => addCampaign(c, false)}
                                  className="rounded-lg border-[1.5px] border-gray-900 dark:border-gray-200 px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-900 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 cursor-pointer"
                                >
                                  Add {partialDays} day{partialDays > 1 ? "s" : ""} · {money(campPerDay(c) * partialDays)}
                                </button>
                              )}
                              <button
                                onClick={() => addCampaign(c, true)}
                                className="w-full sm:w-auto rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-6 py-3 text-sm font-medium shadow-sm transition-all hover:bg-gray-800 hover:shadow-md dark:hover:bg-gray-200 active:scale-[0.98] cursor-pointer"
                              >
                                Book full period · <span className="line-through opacity-60 tabular-nums">{money(fullRaw)}</span> <span className="font-bold tabular-nums">{money(fullPrice)}</span>
                                <span className="ml-2 text-[11px] font-bold bg-emerald-500 text-white rounded-full px-2.5 py-1 align-middle">Save {FULL_PERIOD_DISCOUNT * 100}%</span>
                              </button>
                            </div>
                            {partialDays > 0 && partialDays < c.periodDays && (
                              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-3">
                                The full period saves you {money(campPerDay(c) * c.periodDays - fullPrice)}.
                              </p>
                            )}
                          </div>
                        )
                      })()}
                      </Collapse>

                      {campaignSel.length > 0 && (() => {
                        const sel = campaignSel[0]
                        const c = campaignPeriods.find((x) => x.id === sel.id)
                        const raw = campPerDay(c) * (sel.full ? c.periodDays : sel.days)
                        const price = campPrice(c, sel.days, sel.full)
                        return (
                          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Currently selected: {c.name}</p>
                                <p className="text-xs text-emerald-700 dark:text-emerald-400 tabular-nums">
                                  {sel.full ? `Full period, ${c.periodDays} days` : `${sel.days} of ${c.periodDays} days`} ·{" "}
                                  {sel.full && <span className="line-through opacity-60 mr-1">{money(raw)}</span>}
                                  <span className="font-bold">{money(price)}</span>
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={clearCampaign}
                              className="rounded-lg border border-emerald-300 dark:border-emerald-700 px-4 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer flex-shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      })()}

                    </>
                  )
                })()}
              </section>
              )}

              {/* Own dates: 30-day window with day/month/year filter */}
              {periodMode === "own" && (
              <section className="bg-card border border-border/60 rounded-[18px] p-6 sm:p-7 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-end justify-between gap-5 flex-wrap">
                  <div>
                    <h3 className="text-[19px] font-bold tracking-tight">Pick your dates</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Tap a start date, then an end date. Bookings need {LEAD_DAYS} days for approval.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      aria-label="Month"
                      value={anchorDate.getMonth()}
                      onChange={(e) => anchorToMonth(anchorDate.getFullYear(), Number(e.target.value))}
                      className="h-9 rounded-lg border border-border bg-card px-2.5 text-sm font-semibold cursor-pointer"
                    >
                      {MON3.map((m, i) => <option key={m} value={i}>{m}</option>)}
                    </select>
                    <select
                      aria-label="Year"
                      value={anchorDate.getFullYear()}
                      onChange={(e) => anchorToMonth(Number(e.target.value), anchorDate.getMonth())}
                      className="h-9 rounded-lg border border-border bg-card px-2.5 text-sm font-semibold cursor-pointer"
                    >
                      {[2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-1.5 mt-5">
                  {windowDays.map((cell) => {
                    const inRange = startISO && (endISO ? cell.iso >= startISO && cell.iso <= endISO : cell.iso === startISO)
                    const disabled = cell.lead || cell.booked
                    return (
                      <button
                        key={cell.iso}
                        onClick={() => pickDay(cell)}
                        aria-label={cell.lead ? `${cell.day} ${cell.mon}, within approval lead time` : cell.booked ? `${cell.day} ${cell.mon}, booked` : `${cell.day} ${cell.mon}, ${money(priceForISO(cell.iso))} per day`}
                        className={cn(
                          "flex flex-col gap-0.5 text-left min-w-0 rounded-lg border-[1.5px] px-2 py-2 transition-colors duration-150",
                          disabled
                            ? "bg-muted/50 border-dashed border-border cursor-not-allowed"
                            : inRange
                              ? "bg-gray-900 border-gray-900 dark:bg-gray-100 dark:border-gray-100 cursor-pointer"
                              : cell.camp
                                ? "bg-[#BDDCEE]/25 border-[#BDDCEE] hover:border-[#7DB1D5] cursor-pointer"
                                : "bg-card border-border hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer",
                        )}
                      >
                        <span className={cn("text-[8px] font-bold tracking-[0.06em]", cell.isToday ? "text-[#9356ff]" : inRange ? "text-gray-400 dark:text-gray-500" : "text-muted-foreground")}>
                          {cell.isToday ? "TODAY" : cell.dow}
                        </span>
                        <span className={cn("text-base font-bold tabular-nums tracking-tight leading-none", disabled ? "text-muted-foreground" : inRange ? "text-white dark:text-gray-900" : "text-foreground")}>
                          {cell.day}<span className="text-[8px] font-semibold ml-0.5 align-top">{cell.mon}</span>
                        </span>
                        <span className={cn("text-[9px] font-semibold tabular-nums leading-tight", inRange ? "text-gray-300 dark:text-gray-600" : "text-muted-foreground")}>
                          {cell.lead ? "Lead time" : cell.booked ? "Booked" : short(priceForISO(cell.iso))}
                        </span>
                        {!disabled && !inRange && cell.camp && (
                          <span className="text-[8px] font-bold text-[#1f5f7a] dark:text-[#7DB1D5] leading-tight truncate w-full">{cell.camp.name} {cell.camp.multiple}×</span>
                        )}
                        {!disabled && !inRange && !cell.camp && cell.boost && (
                          <span className="text-[8px] font-bold text-[#9356ff] leading-tight">Boost</span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {(blockedHint || !hasRange) && (
                  <p className={cn("text-[13px] mt-4", blockedHint ? "font-semibold text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>
                    {blockedHint
                      || (!startISO
                        ? "Tap a start date. Dashed days are unavailable."
                        : "Now tap your end date.")}
                  </p>
                )}
                {hasRange && !blockedHint && (
                  <div className="mt-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3.5 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </span>
                    <p className="text-sm text-emerald-900 dark:text-emerald-200">
                      <span className="font-bold">Currently selected:</span> {longDate(startISO)} to {longDate(endISO)} · {rangeDays} day{rangeDays > 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                {/* Week / month upsells with slashed prices */}
                {weekEndISO && (
                  <div className="mt-4 rounded-xl border-[1.5px] border-[#BDDCEE] bg-[#BDDCEE]/10 p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <Tag>Save 5%</Tag>
                      <p className="text-base font-bold mt-2.5">Make it a full week</p>
                      <p className="text-sm text-muted-foreground tabular-nums mt-0.5">
                        7 days to {longDate(weekEndISO)} · <span className="line-through opacity-60">{money(weekRaw)}</span> <span className="font-bold text-foreground">{money(weekPrice)}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => { setEndISO(weekEndISO); setDeal({ label: "Full week", pct: 0.05 }) }}
                      className="w-full sm:w-auto rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-6 py-3 text-sm font-medium shadow-sm transition-all hover:bg-gray-800 hover:shadow-md dark:hover:bg-gray-200 active:scale-[0.98] cursor-pointer"
                    >
                      Book the week
                    </button>
                  </div>
                )}
                {monthEndISO && (
                  <div className="mt-4 rounded-xl border-[1.5px] border-[#BDDCEE] bg-[#BDDCEE]/10 p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <Tag>Save 10%</Tag>
                      <p className="text-base font-bold mt-2.5">Make it a full month</p>
                      <p className="text-sm text-muted-foreground tabular-nums mt-0.5">
                        30 days to {longDate(monthEndISO)} · <span className="line-through opacity-60">{money(monthRaw)}</span> <span className="font-bold text-foreground">{money(monthPrice)}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => { setEndISO(monthEndISO); setDeal({ label: "Full month", pct: 0.1 }) }}
                      className="w-full sm:w-auto rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-6 py-3 text-sm font-medium shadow-sm transition-all hover:bg-gray-800 hover:shadow-md dark:hover:bg-gray-200 active:scale-[0.98] cursor-pointer"
                    >
                      Book the month
                    </button>
                  </div>
                )}
              </section>
              )}
            </>
          )}

          {/* ── STEP 3: ASSETS ── */}
          {step === assetsStep && (
            <section className="bg-card border border-border/60 rounded-[18px] p-6 sm:p-7">
              <h3 className="text-[19px] font-bold tracking-tight">Your ad creative</h3>
              <p className="text-sm text-muted-foreground mt-0.5">One set of artwork covers all your banner spaces.</p>
              <div className="rounded-lg bg-[#BDDCEE]/20 px-3.5 py-2.5 mt-4 text-xs font-semibold text-foreground/80">
                9 of 10 merchants let Koko design their first ad.
              </div>
              <div className="grid gap-4 md:grid-cols-2 items-stretch mt-6">
                {/* Recommended: Koko designs it */}
                <button
                  onClick={() => setCreative("koko")}
                  className={cn(
                    "relative text-left rounded-2xl border-2 p-6 pt-8 transition-colors duration-150 cursor-pointer flex flex-col",
                    creative === "koko" ? "border-gray-900 dark:border-gray-200 shadow-md" : "border-border hover:border-gray-400",
                  )}
                >
                  <ShinyTag className="absolute -top-3.5 left-5">Fastest approval</ShinyTag>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold">Let Koko create your assets</span>
                    <Radio on={creative === "koko"} />
                  </span>
                  <span className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-xl font-bold tabular-nums">+ {money(12500)}</span>
                    <span className="text-xs text-muted-foreground">one time</span>
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">About Rs. 1,800 a day on a week booking</span>
                  <span className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/40">
                    {["Designed by Koko's own team", "Approval in minutes, not days", "Koko brand rules handled for you", "Nothing to upload or fix"].map((f) => (
                      <span key={f} className="flex items-center gap-2.5 text-sm">
                        <span className="w-[18px] h-[18px] rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0"><Check className="w-2.5 h-2.5 text-white stroke-[3]" /></span>
                        {f}
                      </span>
                    ))}
                  </span>
                </button>
                {/* Own upload */}
                <button
                  onClick={() => setCreative("upload")}
                  className={cn(
                    "relative text-left rounded-2xl border p-5 transition-colors duration-150 cursor-pointer flex flex-col",
                    creative === "upload" ? "border-gray-900 dark:border-gray-200 border-2" : "border-border hover:border-gray-400",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold">Upload my own asset</span>
                    <Radio on={creative === "upload"} />
                  </span>
                  <span className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-xl font-bold">Free</span>
                    <span className="text-xs text-muted-foreground">no design fee</span>
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">The slower option</span>
                  <span className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/40">
                    {["Review takes up to 2 business days", "Booking confirms only after approval", "Must pass the spec check below"].map((f) => (
                      <span key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <span className="w-[18px] h-[18px] rounded-full border-2 border-amber-400 flex items-center justify-center flex-shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /></span>
                        {f}
                      </span>
                    ))}
                  </span>
                </button>
              </div>

              {creative === "upload" && (
                <div className="mt-4">
                  {!upload && (
                    <label className="border-2 border-dashed border-border rounded-lg p-6 hover:bg-muted/30 transition-colors text-center cursor-pointer block">
                      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <UploadCloud className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium mt-3">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-0.5">JPG or PNG · at least 1600 × 640 px · max 5 MB</p>
                      <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => e.target.files?.[0] && runChecks(e.target.files[0])} />
                    </label>
                  )}
                  {upload && (
                    <div className="rounded-xl border border-border/60 p-5">
                      <p className="text-sm font-bold truncate">{upload.name}</p>
                      <div className="mt-2 divide-y divide-border/40">
                        {CREATIVE_CHECKS.map((c, i) => (
                          <CheckRow key={c.id} label={c.label} state={upload.states[i]} />
                        ))}
                      </div>
                      {upload.done && upload.passed && (
                        <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3">
                          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">All checks passed. Your creative is ready for review.</p>
                        </div>
                      )}
                      {upload.done && !upload.passed && (
                        <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Your file did not pass the spec. Fix the failed check and try again.</p>
                          <label className="rounded-lg border-[1.5px] border-red-600 text-red-700 dark:text-red-400 px-4 py-1.5 text-xs font-medium cursor-pointer hover:bg-red-600 hover:text-white transition-colors">
                            Try another file
                            <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => e.target.files?.[0] && runChecks(e.target.files[0])} />
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ── FINAL STEP: PAYMENT ── */}
          {step === paymentStep && (
            <>
              <section className="bg-card border border-border/60 rounded-[18px] p-6 sm:p-7 flex flex-col gap-5">
                <div>
                  <h3 className="text-[19px] font-bold tracking-tight">Review your booking</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Nothing is charged until you confirm.</p>
                </div>
                <div className="flex flex-col">
                  {[
                    [multi ? "Spaces" : "Space", spacesLabel, hasSpacesStep ? spacesStep : positionsStep],
                    hasRange && ["Custom dates", `${rangeText} (${rangeDays} days)`, 1],
                    ...campaignSel.map((sel) => {
                      const c = campaignPeriods.find((x) => x.id === sel.id)
                      return [c.name, sel.full ? `Full period · ${c.periodDays} days · saved ${FULL_PERIOD_DISCOUNT * 100}%` : `${sel.days} of ${c.periodDays} days`, 1]
                    }),
                    deal && ["Duration deal", `${deal.label} · saved ${deal.pct * 100}%`, 1],
                    bundleActive && ["Bundle deal", `Spaces booked together · saved ${BUNDLE_DISCOUNT * 100}%`, positionsStep],
                    ["Estimated engagement", `${short(periodViews)} over ${totalDays} days`, null],
                    ["Slot charge", money(mediaCost), null],
                    needsCreative && ["Design service", creative === "koko" ? money(12500) : "Own upload, spec checked", assetsStep],
                  ].filter(Boolean).map(([label, value, editStep]) => (
                    <div key={label} className="flex items-center justify-between gap-3 sm:gap-5 py-3.5 border-b border-border/40 last:border-0 flex-wrap">
                      <span className="text-sm text-muted-foreground flex-shrink-0">{label}</span>
                      <span className="flex items-center gap-3 min-w-0 ml-auto">
                        <span className="text-sm font-bold text-right break-words min-w-0">{value}</span>
                        {editStep && (
                          <button
                            onClick={() => setStep(editStep)}
                            aria-label={`Edit ${label}`}
                            className="text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground cursor-pointer flex-shrink-0"
                          >
                            Edit
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-card border border-border/60 rounded-[18px] p-6 sm:p-7">
                <h3 className="text-[19px] font-bold tracking-tight">How would you like to pay?</h3>
                <div className="space-y-2.5 mt-4">
                  {paymentOptions.map((opt) => {
                    const isSel = payment === opt.id
                    const amount = Math.round(subtotal * opt.feePct)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setPayment(opt.id)}
                        className={cn(
                          "w-full flex items-start gap-3.5 rounded-xl border-[1.5px] p-5 text-left transition-colors duration-150 cursor-pointer",
                          isSel ? "border-gray-900 dark:border-gray-200" : "border-border hover:border-gray-400",
                        )}
                      >
                        <span className={cn(
                          "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5",
                          isSel
                            ? "border-gray-900 bg-gray-900 shadow-[inset_0_0_0_3px_#fff] dark:border-gray-100 dark:bg-gray-100 dark:shadow-[inset_0_0_0_3px_#1D232A]"
                            : "border-border bg-card",
                        )} />
                        <span className="min-w-0 flex-1 flex flex-col gap-1.5">
                          <span className="flex items-center gap-2.5 text-sm font-bold flex-wrap">
                            {opt.label}
                            {opt.tag && <Tag>{opt.tag}</Tag>}
                          </span>
                          <span className="block text-xs text-muted-foreground">{opt.base}</span>
                          <span
                            className={cn(
                              "block text-xs font-semibold tabular-nums",
                              opt.feeKind === "discount"
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-[#1A3A6B] dark:text-blue-300",
                            )}
                          >
                            {opt.feeLine}
                            {isSel && ` · ${opt.feeKind === "discount" ? "−" : "+"} ${money(amount)}`}
                          </span>
                        </span>
                        <span className="flex-shrink-0 flex items-center mt-0.5">{opt.mark}</span>
                      </button>
                    )
                  })}
                </div>
                {payment === "credit" && (
                  <div className="rounded-lg bg-muted/30 border border-border/40 p-4 mt-3 text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Upcoming payout · 31 Aug</span><span className="font-medium tabular-nums">{money(486200)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Convenience fee (5%)</span><span className="font-medium tabular-nums">+ {money(processingFee)}</span></div>
                    <div className="flex justify-between border-t border-border/40 pt-2"><span className="text-muted-foreground">After this booking</span><span className="font-semibold tabular-nums">{money(486200 - total)}</span></div>
                  </div>
                )}
                {payment === "justpay" && (
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 mt-3 text-sm">
                    <div className="flex justify-between"><span className="text-emerald-800 dark:text-emerald-300 font-semibold">JustPay discount (2%)</span><span className="font-bold tabular-nums text-emerald-800 dark:text-emerald-300">− {money(justpayDiscount)}</span></div>
                  </div>
                )}
              </section>

              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-5 py-4">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  This booking is final. No cancellations and no refunds. Your slots are reserved just for you.
                </p>
              </div>
            </>
          )}

        </div>

        {/* Booking summary: prices totalled up at the bottom of the flow */}
        <aside>
          <div className="bg-card border border-border/60 rounded-[18px] p-6 flex flex-col gap-[18px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Booking summary</p>
            <div className="flex flex-col gap-2.5">
              {placementsSel.length === 0 && (
                <p className="text-sm text-muted-foreground">No spaces picked yet</p>
              )}
              {placementsSel.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold leading-tight truncate">{p.name}</p>
                  <span className="flex items-center gap-2 flex-shrink-0">
                    {/* Position status only matters once the user reaches the positions step */}
                    {positions[p.id] ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-1 leading-none whitespace-nowrap">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />{POSITION_LABEL[p.id]} {positions[p.id]}
                      </span>
                    ) : step >= positionsStep ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-full px-2.5 py-1 leading-none whitespace-nowrap">
                        <AlertCircle className="w-2.5 h-2.5" />No position
                      </span>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 border-t border-border/40 pt-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Dates</span>
                <span className="font-bold text-right">{hasPeriod ? shortDateText : "Not picked"}</span>
              </div>
              {hasPeriod && positionsComplete && (
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Slot charge</span>
                  <span className="font-bold tabular-nums">{money(mediaRaw)}</span>
                </div>
              )}
              {(bundleSaving > 0 || (deal && manualRaw - manualCost > 0)) && (
                <div className="flex justify-between gap-3 text-sm text-emerald-700 dark:text-emerald-400">
                  <span>Savings</span>
                  <span className="font-bold tabular-nums">− {money(bundleSaving + (deal ? manualRaw - manualCost : 0))}</span>
                </div>
              )}
              {needsCreative && reachedAssets && (
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Design</span>
                  <span className="font-bold tabular-nums">{creative === "koko" ? `+ ${money(12500)}` : "Own upload"}</span>
                </div>
              )}
              {processingFee > 0 && (
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{feeLabel}</span>
                  <span className="font-bold tabular-nums">+ {money(processingFee)}</span>
                </div>
              )}
              {justpayDiscount > 0 && (
                <div className="flex justify-between gap-3 text-sm text-emerald-700 dark:text-emerald-400">
                  <span>JustPay discount (2%)</span>
                  <span className="font-bold tabular-nums">− {money(justpayDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Engagement</span>
                <span className="font-bold tabular-nums">{hasPeriod ? short(periodViews) : `${short(sumVpd * 7)} / week`}</span>
              </div>
            </div>
            <div className="border-t border-border/40 pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">Total</p>
              {hasPeriod ? (
                <>
                  <p className="text-[30px] font-bold tabular-nums tracking-tight mt-0.5 whitespace-nowrap">{money(total)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{totalDays} day{totalDays > 1 ? "s" : ""}{designFee ? " + design" : ""}</p>
                </>
              ) : (
                <>
                  <p className="text-[30px] font-bold tabular-nums tracking-tight mt-0.5 whitespace-nowrap">Rs. 0.00</p>
                  <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">Updates when you pick your dates</p>
                </>
              )}
            </div>
            {step === paymentStep && (
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 leading-relaxed">
                Final sale. No cancellations or refunds.
              </p>
            )}
            <button
              onClick={onPrimary}
              disabled={primaryDisabled}
              className={cn(
                "w-full rounded-lg px-6 py-3.5 text-[15px] font-bold text-white transition-colors whitespace-nowrap",
                primaryDisabled
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 cursor-pointer",
              )}
            >
              {primaryLabel}
            </button>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-full rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
              >
                Back
              </button>
            )}
            <p className="text-xs text-muted-foreground/70 text-center">Held for 30 min · KAD-1084</p>
          </div>
        </aside>

        {/* Final confirmation: recap + explicit accept before anything is charged */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="text-lg font-bold tracking-tight">Confirm and pay?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              One last look before we charge you.
            </DialogDescription>
            <div className="flex flex-col rounded-xl border border-border/60 divide-y divide-border/40 text-sm">
              {[
                [multi ? "Spaces" : "Space", spacesLabel],
                ["Dates", shortDateText],
                ["Payment", paymentOptions.find((o) => o.id === payment)?.label],
                ["Total", money(total)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <span className="text-muted-foreground flex-shrink-0">{label}</span>
                  <span className={cn("font-bold text-right", label === "Total" && "tabular-nums text-base")}>{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 leading-relaxed">
              This booking is final. No cancellations and no refunds.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={doConfirm}
                className="w-full rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-6 py-3 text-sm font-bold shadow-sm transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer"
              >
                Yes, confirm and pay {money(total)}
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                className="w-full rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
              >
                Go back
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// ── My campaigns ─────────────────────────────────────────────────────────

// ── Campaign recap: Wrapped-style celebration when an ad period ends ─────

const CONFETTI_COLORS = ["#BDDCEE", "#F9C8DC", "#0f7b3d", "#9356ff", "#FBBF24", "#2b3ce0"]

function Confetti({ pieces = 70 }) {
  // Deterministic spread so the burst looks even without random reflow
  const bits = Array.from({ length: pieces }, (_, i) => ({
    left: ((i * 37) % 100) + (i % 3) - 1,
    delay: ((i * 13) % 26) / 10,
    duration: 2.6 + ((i * 7) % 18) / 10,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: i % 4 === 0,
    size: 7 + (i % 4) * 2,
  }))
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-[120] motion-reduce:hidden">
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute top-0 animate-[confettiFall_linear_infinite]"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size * (b.round ? 1 : 1.6),
            background: b.color,
            borderRadius: b.round ? "50%" : 2,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function CampaignRecap({ booking, onClose }) {
  const stats = [
    ["Store visits", "312.4K", "People who saw your ad and came to look"],
    ["New shoppers reached", "88.1K", "First time they had seen your store"],
    ["Orders", "214", "Bought after seeing your ad"],
    ["Conversion", "4.2%", "Above the 2.6% platform average"],
  ]
  return (
    <>
      <Confetti />
      <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={onClose}>
        <div
          className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
          style={{ backgroundImage: PASTEL_GRADIENT }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Campaign recap"
        >
          <button
            onClick={onClose}
            aria-label="Close recap"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-700 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="p-6 sm:p-10 text-gray-900">
            <ShinyTag>That's a wrap</ShinyTag>
            <h2 className="text-[30px] font-extrabold tracking-tight leading-tight mt-4">Your {booking.placement.split(" · ")[0]} run is done</h2>
            <p className="text-sm text-gray-700 mt-1.5">{booking.dates} · Booking {booking.id}</p>

            <div className="grid grid-cols-2 gap-3 mt-7">
              {stats.map(([label, value, note]) => (
                <div key={label} className="bg-white/70 backdrop-blur rounded-2xl p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-gray-600">{label}</p>
                  <p className="text-[28px] font-extrabold tabular-nums tracking-tight leading-none mt-1.5">{value}</p>
                  <p className="text-[11px] text-gray-600 leading-snug mt-1.5">{note}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 text-white rounded-2xl p-5 mt-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-gray-400">Sales from this booking</p>
              <p className="text-[34px] font-extrabold tabular-nums tracking-tight leading-none mt-1.5">{money(3120000)}</p>
              <p className="text-xs text-gray-300 mt-2">That is <span className="font-bold text-white">8.1×</span> what you spent on the slot.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 mt-7">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-gray-900 text-white px-6 py-3 text-sm font-bold shadow-sm transition-colors hover:bg-gray-800 cursor-pointer"
              >
                Book this space again
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border-[1.5px] border-gray-900/30 bg-white/60 px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function CampaignsView({ onBook, onPerformance, recapBooking, onCloseRecap }) {
  const [waitlistRemoved, setWaitlistRemoved] = useState(false)
  return (
    <div className="space-y-5">
      {recapBooking && <CampaignRecap booking={recapBooking} onClose={onCloseRecap} />}
      {/* Stats strip */}
      <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-xl border border-border/40 flex-wrap">
        {[
          ["Live", "1", "text-emerald-600"],
          ["Pending approval", "1", "text-amber-600"],
          ["Completed", "1", ""],
          ["Total spend", money(192500), ""],
        ].map(([label, value, tone], i) => (
          <div key={label} className="flex items-center gap-6">
            {i > 0 && <div className="w-px bg-border/60 self-stretch hidden sm:block" />}
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
              <p className={cn("text-xl font-bold tabular-nums", tone)}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-separate border-spacing-0 min-w-[900px]">
            <thead className="bg-muted/40">
              <tr>
                {[["Booking", "w-[120px]"], ["Placement", "w-[220px]"], ["Dates", "w-[160px]"], ["Status", "w-[160px]"], ["Spend", "w-[120px]"], ["Result", ""], ["Action", "w-[150px]"]].map(([h, w]) => (
                  <th key={h} className={cn("px-4 first:pl-6 last:pr-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground leading-tight align-top border-b border-border/60 last:text-right", w)}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="group cursor-pointer transition-all duration-150 hover:relative hover:z-10 [&:hover>td]:bg-white dark:[&:hover>td]:bg-muted/40 [&:hover>td]:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                  onClick={onPerformance}
                >
                  <td className="px-4 first:pl-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 font-mono font-medium">{booking.id}</td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap border-b border-border/40 font-medium">{booking.placement}</td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-muted-foreground">{booking.dates}</td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap border-b border-border/40"><StatusPill status={booking.status} /></td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap border-b border-border/40 tabular-nums font-medium">{money(booking.spend)}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-border/40 truncate" title={booking.result}>{booking.result}</td>
                  <td className="px-4 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-right">
                    {booking.status === "completed" ? (
                      <Button size="sm" className="h-8 px-3 text-xs" onClick={(e) => { e.stopPropagation(); onBook("trending") }}>Run it again</Button>
                    ) : (
                      <Button size="sm" variant="outline" className="h-8 px-3 text-xs" onClick={(e) => { e.stopPropagation(); onPerformance() }}>
                        {booking.status === "live" ? "Live performance" : "Details"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            role="button"
            tabIndex={0}
            onClick={onPerformance}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onPerformance() }}
            className="bg-card border border-border/60 rounded-xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-foreground/20 active:scale-[0.995]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold">{booking.placement}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{booking.dates} · <span className="font-mono">{booking.id}</span></p>
              </div>
              <StatusPill status={booking.status} />
            </div>
            <p className="text-sm font-medium">{booking.result}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Spend <span className="font-semibold text-foreground tabular-nums">{money(booking.spend)}</span></p>
              {booking.status === "completed" && (
                <Button size="sm" className="h-8 px-3 text-xs" onClick={(e) => { e.stopPropagation(); onBook("trending") }}>Run it again</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Waitlist */}
      {!waitlistRemoved && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-[#BDDCEE]/15 border border-[#BDDCEE]/40 px-4 py-3.5">
          <div className="flex items-start gap-3">
            <Bell className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-700 dark:text-gray-300" />
            <div>
              <p className="text-sm font-semibold">Waitlist — Hero banner, slide 1, Black Friday week</p>
              <p className="text-xs text-muted-foreground mt-0.5">If it opens, you're notified first. First notified, first served.</p>
            </div>
          </div>
          <button
            onClick={() => setWaitlistRemoved(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground self-start sm:self-center"
          >
            <X className="h-3.5 w-3.5" />Leave waitlist
          </button>
        </div>
      )}
    </div>
  )
}

// ── Performance ──────────────────────────────────────────────────────────

// ── Performance data ─────────────────────────────────────────────────────
// One series per granularity; every metric is derived from the same buckets
// so the chart always agrees with the metric cards above it.

// Rows: [label, store visits, orders, order value, ad spend]. Numbers are
// deliberately irregular (weekend bumps, campaign months, a dip) and stay
// internally consistent: orders ≈ 0.07% of visits, AOV ≈ Rs. 12-15K, and
// spend moves in steps as fixed-price slots start and end.
const PERF_BUCKETS = {
  day: [
    ["18 Aug", 61300, 41, 604700, 25500], ["19 Aug", 58900, 38, 517400, 25500],
    ["20 Aug", 66400, 47, 699800, 27500], ["21 Aug", 63100, 44, 653900, 27500],
    ["22 Aug", 79800, 58, 802300, 27500], ["23 Aug", 84200, 61, 908600, 29500],
    ["24 Aug", 67200, 45, 641200, 29500],
  ],
  week: [
    ["28 Jul", 401200, 289, 4214000, 148000], ["4 Aug", 379600, 261, 3842000, 148000],
    ["11 Aug", 452800, 322, 4690000, 182700], ["18 Aug", 480900, 334, 4827900, 192500],
  ],
  month: [
    ["Mar", 1284000, 861, 12470000, 512000], ["Apr", 1671300, 1204, 17890000, 663500],
    ["May", 1402800, 923, 13210000, 549000], ["Jun", 1318500, 884, 12960000, 520000],
    ["Jul", 1585200, 1092, 15730000, 615800], ["Aug", 1742600, 1181, 17240000, 668900],
  ],
  year: [
    ["2024", 8412000, 5309, 74300000, 2860000], ["2025", 14876000, 9842, 141600000, 5214000],
    ["2026 YTD", 11204000, 7466, 108900000, 4010000],
  ],
}

const RANGE_LABEL = { day: "Last 7 days", week: "Last 4 weeks", month: "Last 6 months", year: "Since 2024" }

// Metric definitions: key, label, how to total it, and how to format it
const PERF_METRICS = [
  { key: "visits", label: "Store visits", axis: "Store visits", fmt: (v) => compact(v), note: "Shoppers who saw your ad" },
  { key: "orders", label: "Total orders", axis: "Orders", fmt: (v) => Math.round(v).toLocaleString(), note: "Attributed to your ads" },
  { key: "value", label: "Order value for period", axis: "Order value", fmt: (v) => money(v), note: "Sales from attributed orders" },
  { key: "aov", label: "Average order value", axis: "Avg order value", fmt: (v) => money(v), note: "Order value ÷ orders", derived: true },
  { key: "spend", label: "Total spent on advertising", axis: "Ad spend", fmt: (v) => money(v), note: "What you paid for slots", flat: true },
]

const buildPerfSeries = (granularity) =>
  PERF_BUCKETS[granularity].map(([label, visits, orders, value, spend]) => ({
    label, visits, orders, value, spend,
    aov: Math.round(value / orders),
  }))

const BOOKING_RESULTS = [
  {
    id: "KAD-1048", name: "Hero banner · Slide 2", dates: "10 – 16 Aug 2026", days: 7,
    visits: 310000, orders: 214, value: 3120000, spend: 129500,
    share: 0.64,
    series: [["10 Aug", 39800, 27], ["11 Aug", 36400, 24], ["12 Aug", 44100, 31], ["13 Aug", 41700, 29], ["14 Aug", 47900, 33], ["15 Aug", 52600, 38], ["16 Aug", 47500, 32]],
  },
  {
    id: "KAD-0987", name: "Trending · Card 4", dates: "20 – 26 Jul 2026", days: 7,
    visits: 170000, orders: 128, value: 1860000, spend: 53200,
    share: 0.36,
    series: [["20 Jul", 21900, 16], ["21 Jul", 19600, 14], ["22 Jul", 24800, 19], ["23 Jul", 23200, 17], ["24 Jul", 26700, 21], ["25 Jul", 28900, 23], ["26 Jul", 24900, 18]],
  },
]

function BookingDetail({ booking, onClose, onBook }) {
  const aov = Math.round(booking.value / booking.orders)
  const roas = booking.value / booking.spend
  const convRate = (booking.orders / booking.visits) * 100
  const data = booking.series.map(([label, visits, orders]) => ({ label, visits, orders }))
  const stats = [
    ["Store visits", compact(booking.visits), `${compact(Math.round(booking.visits / booking.days))} a day`],
    ["Total orders", booking.orders.toLocaleString(), `${convRate.toFixed(2)}% of visits`],
    ["Order value", money(booking.value), "Attributed sales"],
    ["Average order value", money(aov), "Per attributed order"],
    ["Spent on advertising", money(booking.spend), `${money(Math.round(booking.spend / booking.days))} a day`],
    ["Return on ad spend", `${roas.toFixed(1)}×`, `${money(Math.round(roas))} back per Rs. 1`],
  ]
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-3xl max-h-[88vh] overflow-y-auto">
        <div>
          <DialogTitle className="text-xl font-bold tracking-tight">{booking.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-0.5">
            {booking.dates} · Booking {booking.id}
          </DialogDescription>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {stats.map(([label, value, note]) => (
            <div key={label} className="rounded-xl border border-border/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground leading-snug">{label}</p>
              <p className="text-2xl font-bold tabular-nums tracking-tight mt-1.5">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{note}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border/60 p-5 mt-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store visits and orders by day</p>
          <div className="h-56 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="bkArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#BDDCEE" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#EDD8F8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="label" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis yAxisId="v" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} width={46} tickFormatter={(v) => compact(v)} />
                <YAxis yAxisId="o" orientation="right" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} width={34} />
                <Tooltip
                  cursor={{ stroke: "#9CA8E8", strokeWidth: 1, strokeDasharray: "4 4" }}
                  formatter={(v, n) => [Number(v).toLocaleString(), n === "visits" ? "Store visits" : "Orders"]}
                  contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                />
                <Area yAxisId="v" type="monotone" dataKey="visits" stroke="#7DB1D5" strokeWidth={2} fill="url(#bkArea)" dot={false} isAnimationActive={false} />
                <Area yAxisId="o" type="monotone" dataKey="orders" stroke="#0f7b3d" strokeWidth={2} fill="none" dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-5 mt-3">
            <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#7DB1D5]" />Store visits</span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#0f7b3d]" />Orders</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => { onClose(); onBook("hero") }}
            className="flex-1 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-6 py-3 text-sm font-bold shadow-sm transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer"
          >
            Book this space again
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PerformanceView({ onBook }) {
  const [granularity, setGranularity] = useState("day")
  const [metricKey, setMetricKey] = useState("visits")
  const [openBooking, setOpenBooking] = useState(null)

  const series = buildPerfSeries(granularity)
  const activeMetric = PERF_METRICS.find((m) => m.key === metricKey)
  const totals = {
    visits: series.reduce((a, d) => a + d.visits, 0),
    orders: series.reduce((a, d) => a + d.orders, 0),
    value: series.reduce((a, d) => a + d.value, 0),
    spend: series.reduce((a, d) => a + d.spend, 0),
  }
  totals.aov = Math.round(totals.value / totals.orders)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="rounded-xl bg-[#BDDCEE]/15 border border-[#BDDCEE]/40 px-4 py-3 text-sm max-w-2xl">
          <span className="font-semibold">Attributed</span>
          <span className="text-muted-foreground"> means an order within 7 days of a shopper clicking you, or 1 day after seeing you. Windows are adjustable.</span>
        </div>
        <div className="flex gap-2">
          {/* Granularity filter */}
          <div className="flex gap-1 bg-muted rounded-lg p-1" role="tablist" aria-label="Chart range">
            {[["day", "Day"], ["week", "Week"], ["month", "Month"], ["year", "Year"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setGranularity(id)}
                aria-pressed={granularity === id}
                className={cn(
                  "text-[13px] font-semibold px-3.5 py-1.5 rounded-md transition-colors cursor-pointer",
                  granularity === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero card: metric cards drive the chart below them */}
      <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden gap-0 py-0">
        <CardContent className="p-0">
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Advertising performance</p>
              <span className="text-xs bg-muted/40 rounded-full px-3 py-1 border border-border/40 font-medium">{RANGE_LABEL[granularity]}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {PERF_METRICS.map((m) => {
                const active = m.key === metricKey
                const values = series.map((d) => d[m.key])
                const first = values[0], last = values[values.length - 1]
                const delta = first ? ((last - first) / first) * 100 : 0
                return (
                  <button
                    key={m.key}
                    onClick={() => setMetricKey(m.key)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-start min-w-0 text-left rounded-xl border-[1.5px] p-4 transition-colors cursor-pointer",
                      active ? "border-gray-900 dark:border-gray-200 bg-muted/30" : "border-border/60 hover:border-gray-400",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2 w-full">
                      <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground leading-snug">{m.label}</span>
                      {Math.abs(delta) >= 0.5 && (
                        <span className={cn(
                          "inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums rounded-full px-2 py-0.5 leading-none whitespace-nowrap flex-shrink-0",
                          delta >= 0
                            ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
                            : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/40",
                        )}>
                          {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {Math.abs(delta) >= 100 ? Math.round(Math.abs(delta)) : Math.abs(delta).toFixed(1)}%
                        </span>
                      )}
                    </span>
                    <span className="text-xl sm:text-[26px] font-bold tabular-nums tracking-tight mt-1.5 truncate w-full">{m.fmt(totals[m.key])}</span>
                    <span className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{m.note}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="px-2 pt-6 pb-4">
            <div className="flex items-center justify-between px-4 pb-3 gap-3 flex-wrap">
              <p className="text-sm font-bold">{activeMetric.label} by {granularity}</p>
              <span className="text-xs text-muted-foreground">Tap a metric above to change the chart</span>
            </div>
            <div className="h-[20rem] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 12, right: 32, left: 24, bottom: 12 }}>
                  <defs>
                    <linearGradient id="kokoAdArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#BDDCEE" stopOpacity={0.7} />
                      <stop offset="50%" stopColor="#D4D8F8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#EDD8F8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="kokoAdLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7DB1D5" />
                      <stop offset="50%" stopColor="#9CA8E8" />
                      <stop offset="100%" stopColor="#C997DF" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="label" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} tickMargin={12} />
                  <YAxis
                    stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} tickMargin={8} width={64}
                    tickFormatter={(v) => (metricKey === "orders" ? Math.round(v).toLocaleString() : metricKey === "visits" ? compact(v) : `Rs. ${compact(v)}`)}
                  />
                  <Tooltip
                    cursor={{ stroke: "#9CA8E8", strokeWidth: 1, strokeDasharray: "4 4", strokeOpacity: 0.5 }}
                    formatter={(v) => [activeMetric.fmt(Number(v)), activeMetric.axis]}
                    contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Area
                    type="monotone" dataKey={metricKey} stroke="url(#kokoAdLine)" strokeWidth={2}
                    strokeLinejoin="round" strokeLinecap="round" dot={false} fill="url(#kokoAdArea)" isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 px-4 pb-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#7DB1D5] to-[#C997DF]" />
              <span className="text-xs text-muted-foreground font-medium">{activeMetric.axis} · {RANGE_LABEL[granularity].toLowerCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My advertisements — each row opens a deeper view */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60">
          <h3 className="text-base font-semibold">My advertisements</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Tap an advertisement to dive into its numbers. Benchmarked against platform placement averages, never another merchant's.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-separate border-spacing-0 min-w-[820px]">
            <thead className="bg-muted/40">
              <tr>
                {[["My advertisements", "w-[230px]"], ["Store visits", ""], ["Orders", "w-[120px]"], ["Order value", ""], ["Avg order value", ""], ["Ad spend", ""], ["", "w-[70px]"]].map(([h, w], i) => (
                  <th key={h || i} className={cn("px-4 first:pl-6 last:pr-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60", w)}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOOKING_RESULTS.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setOpenBooking(b)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenBooking(b) } }}
                  className="group cursor-pointer transition-all duration-150 hover:relative hover:z-10 [&:hover>td]:bg-white dark:[&:hover>td]:bg-muted/40 [&:hover>td]:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                >
                  <td className="px-4 first:pl-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 font-medium">
                    {b.name}
                    <span className="block text-xs text-muted-foreground font-normal">{b.dates}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap border-b border-border/40 tabular-nums">{compact(b.visits)}</td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap border-b border-border/40 tabular-nums">
                    {b.orders}
                    <span className="ml-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">above avg</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap border-b border-border/40 tabular-nums">{money(b.value)}</td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap border-b border-border/40 tabular-nums">{money(Math.round(b.value / b.orders))}</td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap border-b border-border/40 tabular-nums">{money(b.spend)}</td>
                  <td className="px-4 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-right">
                    <ChevronRight className="h-4 w-4 text-muted-foreground inline-block transition-transform group-hover:translate-x-0.5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openBooking && (
        <BookingDetail booking={openBooking} onClose={() => setOpenBooking(null)} onBook={onBook} />
      )}
    </div>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────

export function AdvertiseWithKoko({ flow = "default", showPrices = false, simulateRecap = 0, onRecapHandled }) {
  const [view, setView] = useState("browse")
  const [selectedIds, setSelectedIds] = useState([])
  const [campaignId, setCampaignId] = useState(null)
  const [recapBooking, setRecapBooking] = useState(null)

  // Simulator: jump to My advertisements and celebrate a finished booking
  useEffect(() => {
    if (!simulateRecap) return
    setView("campaigns")
    setRecapBooking(bookings.find((b) => b.status === "completed") || bookings[0])
    onRecapHandled?.()
  }, [simulateRecap])

  const toggleSpace = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const addSpace = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))

  const startBooking = (preselectedCampaign = null) => {
    setCampaignId(preselectedCampaign)
    setView("booking")
  }

  const removeSpace = (id) => setSelectedIds((prev) => (prev.length > 1 ? prev.filter((x) => x !== id) : prev))

  const goAdvertise = () => {
    setView("browse")
    setTimeout(() => document.getElementById("choose-spaces")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60)
  }

  const tabs = [
    ["browse", "Advertise", null],
    ["campaigns", "My advertisements", 3],
    ["performance", "Performance", null],
  ]

  return (
    <div className="space-y-5 min-w-0">
      {view !== "booking" && (
        <>
          <div className="pt-2">
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">Advertise with Koko</h1>
            <p className="text-base text-muted-foreground mt-1.5">Put your brand in front of shoppers who already use Koko.</p>
          </div>

          <div className="border-b">
            <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
              {tabs.map(([id, label, count]) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={cn(
                    "pb-3 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 text-sm",
                    view === id
                      ? "border-gray-900 text-gray-900 font-semibold dark:border-gray-100 dark:text-gray-100"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                  {count != null && (
                    <span className={cn(
                      "text-xs rounded-full px-1.5 py-0.5 leading-none",
                      view === id ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900" : "bg-muted text-muted-foreground",
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {view === "browse" && (
        <ExploreView
          selectedIds={selectedIds}
          onToggle={toggleSpace}
          onClear={() => setSelectedIds([])}
          onContinue={() => startBooking()}
          flow={flow}
          showPrices={showPrices}
        />
      )}
      {view === "booking" && (
        <BookingFlow
          ids={flow === "cta" ? selectedIds : selectedIds.length ? selectedIds : ["hero"]}
          onToggle={toggleSpace}
          onRemove={removeSpace}
          onAdd={addSpace}
          campaignId={campaignId}
          onExit={() => setView("browse")}
          onViewBookings={() => setView("campaigns")}
          flow={flow}
          showPrices={showPrices}
        />
      )}
      {view === "campaigns" && (
        <CampaignsView
          onBook={() => goAdvertise()}
          onPerformance={() => setView("performance")}
          recapBooking={recapBooking}
          onCloseRecap={() => setRecapBooking(null)}
        />
      )}
      {view === "performance" && <PerformanceView onBook={() => goAdvertise()} />}
    </div>
  )
}
