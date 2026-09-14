// @ts-nocheck
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BoltIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  QuestionMarkCircleIcon,
  LockClosedIcon,
  LinkSlashIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { cn } from "../ui/utils"
import { toast } from "sonner"

type Platform = "wordpress" | "shopify" | "manual"
type Step = "select" | "credentials"

const MOCK_CREDENTIALS = {
  merchantId: "MID-89F3K2L9P0Q7X1Y4Z6W8V5U3T2S1R0N",
  apiKey: "REGEN-F4TIU4SE81",
  publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2a8KqL...(truncated)",
  privateKey: "MIIEowIBAAKCAQEA2a8KqLmNpXr9vYzW3tQs7hUdFcBe1iJk",
}

// ── LocalStorage helpers ─────────────────────────────────────────────────

const LS_OVERVIEW = 'koko_plugin_overview_seen'
const LS_CONNECTED = 'koko_connected_platforms'

const getOverviewSeen = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(LS_OVERVIEW) === '1'
}
const markOverviewSeen = () => {
  if (typeof window !== 'undefined') localStorage.setItem(LS_OVERVIEW, '1')
}
const getConnectedPlatforms = (): Platform[] => {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LS_CONNECTED) || '[]') } catch { return [] }
}
const addConnectedPlatform = (p: Platform) => {
  if (typeof window === 'undefined') return
  // Only one platform can be connected at a time
  localStorage.setItem(LS_CONNECTED, JSON.stringify([p]))
}
const removeConnectedPlatform = (p: Platform) => {
  if (typeof window === 'undefined') return
  const current = getConnectedPlatforms().filter((x) => x !== p)
  localStorage.setItem(LS_CONNECTED, JSON.stringify(current))
}

function generateOrderId() {
  return `TEST-${Date.now().toString().slice(-13)}`
}
function generateTxnId() {
  return `TRN-${Math.random().toString(36).slice(2, 12).toUpperCase()}`
}
function generateToken() {
  return `tok_${Math.random().toString(36).slice(2, 18)}`
}

// ── Platform icons ─────────────────────────────────────────────────────────

function WordPressIcon({ size = 40 }: { size?: number }) {
  return (
    <div className="rounded-xl flex items-center justify-center bg-blue-50" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" style={{ width: size * 0.82, height: size * 0.82 }}>
        {/* outer thin ring */}
        <circle cx="50" cy="50" r="47" fill="none" stroke="#21759B" strokeWidth="2.5" />
        {/* inner filled circle */}
        <circle cx="50" cy="50" r="40" fill="#21759B" />
        {/* serif W */}
        <text
          x="50"
          y="72"
          textAnchor="middle"
          fill="white"
          fontFamily="'Times New Roman', Georgia, serif"
          fontSize="58"
          fontWeight="700"
        >
          W
        </text>
      </svg>
    </div>
  )
}

function ShopifyIcon({ size = 40 }: { size?: number }) {
  return (
    <div className="rounded-xl flex items-center justify-center bg-green-50" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" style={{ width: size * 0.82, height: size * 0.82 }} fill="none">
        {/* shopping bag body — front (light green) */}
        <path
          d="M28 28 L72 28 L80 92 L20 92 Z"
          fill="#95BF47"
        />
        {/* right side panel (dark green) */}
        <path
          d="M72 28 L80 92 L65 92 L65 28 Z"
          fill="#5E8E3E"
        />
        {/* top right cap */}
        <path
          d="M72 28 L65 28 L62 18 L75 22 Z"
          fill="#5E8E3E"
        />
        {/* handles — curved straps */}
        <path
          d="M35 30 C35 18, 42 12, 50 12 C58 12, 65 18, 65 30"
          stroke="#95BF47"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M42 30 C42 22, 46 18, 50 18 C54 18, 58 22, 58 30"
          stroke="#95BF47"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* serif S */}
        <text
          x="48"
          y="74"
          textAnchor="middle"
          fill="white"
          fontFamily="'Times New Roman', Georgia, serif"
          fontSize="52"
          fontWeight="700"
          fontStyle="italic"
        >
          S
        </text>
      </svg>
    </div>
  )
}

function ManualIcon({ size = 40 }: { size?: number }) {
  return (
    <div className="rounded-xl flex items-center justify-center bg-violet-50" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} fill="none">
        <path d="M16 18L22 12L16 6" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6L2 12L8 18" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ── Credential Row ─────────────────────────────────────────────────────────

interface CredentialRowProps {
  label: string
  sublabel?: string
  value: string
  masked?: boolean
  secret?: boolean
  onRegenerate?: () => void
}

function CredentialRow({ label, sublabel, value, masked = false, secret = false, onRegenerate }: CredentialRowProps) {
  const [visible, setVisible] = useState(!masked)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    toast.success("Copied to clipboard")
  }

  const handleConfirmRegenerate = () => {
    onRegenerate?.()
    toast.success(`${label} regenerated`, {
      description: "The previous key is now invalid. Update your integration with the new value."
    })
    setConfirmOpen(false)
  }

  return (
    <>
      <div
        className={cn(
          "rounded-lg border bg-card px-4 py-3.5 border-l-4",
          secret ? "border-l-amber-400 border-border" : "border-l-[#BDDCEE] border-border"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{label}</span>
              {sublabel && <span className="text-xs text-muted-foreground/50">{sublabel}</span>}
              {secret && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Keep secret</span>
              )}
            </div>
            <p className="font-mono text-sm text-foreground truncate">
              {visible ? value : "•".repeat(Math.min(value.length, 36))}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
            <button
              onClick={() => setVisible(!visible)}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label={visible ? "Hide" : "Show"}
            >
              {visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Copy"
            >
              <ClipboardDocumentIcon className="w-4 h-4" />
            </button>
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                className="h-7 text-xs px-2.5 ml-0.5"
              >
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Regenerate confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate {label}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately invalidate the existing {label.toLowerCase()}. You'll need to update your live
              integration with the new value, or payments will stop working. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRegenerate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ── Setup Guide Dialog ─────────────────────────────────────────────────────

function SetupGuideDialog({ open, onOpenChange, onStart }: { open: boolean; onOpenChange: (open: boolean) => void; onStart?: () => void }) {
  const milestones = [
    { icon: <DocumentTextIcon className="w-5 h-5 text-[#8B9CF8]" />, title: "Choose your platform", desc: "WooCommerce, Shopify, or a custom website. we support them all." },
    { icon: <ClipboardDocumentIcon className="w-5 h-5 text-[#8B9CF8]" />, title: "Copy your credentials", desc: "Paste your unique keys into your store's payment settings." },
    { icon: <ShieldCheckIcon className="w-5 h-5 text-[#8B9CF8]" />, title: "Run a quick test", desc: "We'll confirm everything is connected before you go live." },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Setup Guide</DialogTitle>
          <DialogDescription>How to connect Koko to your website</DialogDescription>
        </DialogHeader>

        {/* Hero */}
        <div className="sidebar-active-gradient px-10 py-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold tracking-wider uppercase bg-white/60 text-gray-800 px-3 py-1.5 rounded-full">
              5 minutes to setup your Koko plugin
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Connect Koko to your website
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-xl leading-relaxed">
            Offer Koko BNPL (Buy Now, Pay Later) at checkout so your customers can split payments. while you get paid upfront.
          </p>
        </div>

        {/* What you'll do */}
        <div className="bg-card px-10 py-8">
          <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-6">What you'll do</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-[#BDDCEE]/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{m.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before you start */}
        <div className="border-t border-border/40 px-10 py-8 space-y-4">
          <p className="text-sm font-semibold text-foreground">Before you start</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "WooCommerce / Shopify", desc: "Koko plugin / app must be installed on your store", tag: "Plugin required" },
              { label: "Custom website?", desc: "A developer will integrate via our REST API", tag: "Developer needed" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/40">
                <CheckCircleIcon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 font-medium">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {onStart && (
          <div className="border-t border-border/40 px-10 py-5 bg-muted/20 flex justify-end">
            <Button onClick={() => { onStart(); onOpenChange(false) }} className="gap-2 h-10 px-5">
              Start Setup
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Screen: Platform Select ────────────────────────────────────────────────

const PLATFORM_OPTIONS = [
  {
    id: "wordpress" as Platform,
    title: "WooCommerce",
    subtitle: "WordPress store",
    tag: "No code needed",
    tagColor: "bg-emerald-100 text-emerald-700",
    recommended: false,
    bullets: ["Install the Koko plugin", "Paste 4 keys into settings", "Go live in minutes"],
    icon: <WordPressIcon size={48} />,
  },
  {
    id: "shopify" as Platform,
    title: "Shopify",
    subtitle: "Shopify store",
    tag: "No code needed",
    tagColor: "bg-emerald-100 text-emerald-700",
    recommended: false,
    bullets: ["Install the Koko BNPL app", "Paste 2 keys into settings", "Enable at checkout"],
    icon: <ShopifyIcon size={48} />,
  },
  {
    id: "manual" as Platform,
    title: "Custom Website",
    subtitle: "Built by a developer",
    tag: "Developer setup",
    tagColor: "bg-violet-100 text-violet-700",
    recommended: false,
    bullets: ["Use our REST API", "Your dev adds the checkout flow", "Full control over UX"],
    icon: <ManualIcon size={48} />,
  },
]

function PlatformSelect({
  selected,
  onSelect,
  onContinue,
  onOpenGuide,
  connectedPlatforms,
}: {
  selected: Platform | null
  onSelect: (p: Platform) => void
  onContinue: () => void
  onOpenGuide: () => void
  connectedPlatforms: Platform[]
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Where is your online store?</h2>
            <p className="text-sm text-muted-foreground mt-1">Pick the platform your website runs on. we'll show you the right steps.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onOpenGuide} className="gap-1.5 flex-shrink-0">
            <QuestionMarkCircleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Setup Guide</span>
          </Button>
        </div>

        {connectedPlatforms.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Only one platform can be connected at a time. Disconnect{" "}
            <span className="font-semibold">
              {connectedPlatforms[0] === "wordpress" ? "WooCommerce" : connectedPlatforms[0] === "shopify" ? "Shopify" : "Custom Website"}
            </span>{" "}
            before connecting another platform.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLATFORM_OPTIONS.map((opt) => {
            const isConnected = connectedPlatforms.includes(opt.id)
            const isLocked = connectedPlatforms.length > 0 && !isConnected
            return (
              <button
                key={opt.id}
                onClick={() => { if (!isLocked) onSelect(opt.id) }}
                disabled={isLocked}
                className={cn(
                  "relative text-left rounded-xl border-2 p-5 transition-all duration-150 flex flex-col",
                  isLocked
                    ? "border-border bg-muted/30 opacity-60 cursor-not-allowed"
                    : selected === opt.id
                      ? "border-gray-900 bg-gray-50 shadow-sm"
                      : "border-border bg-card hover:border-gray-400 hover:bg-muted/20"
                )}
              >
                {isConnected ? (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                ) : isLocked ? (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                    <LockClosedIcon className="w-3 h-3" />
                    Locked
                  </span>
                ) : opt.recommended && (
                  <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#BDDCEE] text-gray-800">
                    Most popular
                  </span>
                )}
                {selected === opt.id && !isLocked && (
                  <div className="absolute top-3 right-3">
                    <CheckCircleSolid className="w-5 h-5 text-gray-900" />
                  </div>
                )}

                <div className={cn("mb-4", (opt.recommended || isConnected || isLocked) ? "mt-6" : "")}>{opt.icon}</div>
                <p className="font-semibold text-sm text-foreground">{opt.title}</p>
                <p className="text-xs text-muted-foreground mb-3">{opt.subtitle}</p>

                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full w-fit mb-3", opt.tagColor)}>
                  {opt.tag}
                </span>

                <ul className="space-y-1.5 mt-auto">
                  {opt.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-[#8B9CF8] font-bold mt-px shrink-0">·</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>


        <div className="flex justify-end">
          <Button onClick={onContinue} disabled={!selected} className="gap-2">
            {selected && connectedPlatforms.includes(selected) ? 'Manage Setup' : 'Continue'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Install info per platform ──────────────────────────────────────────────

function InstallPluginCard({ platform }: { platform: Platform }) {
  if (platform === 'wordpress') {
    return (
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">Step 1</p>
          <h3 className="text-base font-semibold text-foreground">Install the Koko WooCommerce plugin</h3>
          <p className="text-sm text-muted-foreground mt-1">Choose whichever way is easiest for you. both work the same.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://wordpress.org/plugins/koko-bnpl/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-gray-400 hover:bg-muted/20 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Install from WordPress directory</p>
              <p className="text-xs text-muted-foreground mt-0.5">Search "Koko BNPL" in your WP plugin store.</p>
            </div>
          </a>

          <button
            onClick={() => toast.success("Plugin ZIP download started")}
            className="group flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-gray-400 hover:bg-muted/20 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
              <ArrowDownTrayIcon className="h-4 w-4 text-violet-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Download as ZIP</p>
              <p className="text-xs text-muted-foreground mt-0.5">Upload manually via Plugins → Add New → Upload.</p>
            </div>
          </button>
        </div>
      </div>
    )
  }

  if (platform === 'shopify') {
    return (
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">Step 1</p>
          <h3 className="text-base font-semibold text-foreground">Install the Koko Shopify app</h3>
          <p className="text-sm text-muted-foreground mt-1">A direct download for your Shopify store.</p>
        </div>

        <a
          href="https://apps.shopify.com/koko-bnpl"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-gray-400 hover:bg-muted/20 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <ArrowDownTrayIcon className="h-4 w-4 text-green-700" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Download Koko Shopify Plugin</p>
            <p className="text-xs text-muted-foreground mt-0.5">Opens the Shopify App Store listing.</p>
          </div>
        </a>
      </div>
    )
  }

  // Manual
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">Step 1</p>
        <h3 className="text-base font-semibold text-foreground">Read the API documentation</h3>
        <p className="text-sm text-muted-foreground mt-1">Your developer integrates Koko directly using our REST API. no plugin to install.</p>
      </div>

      <a
        href="https://docs.koko.lk/api"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-gray-400 hover:bg-muted/20 transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
          <DocumentTextIcon className="h-4 w-4 text-violet-700" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Open Koko Developer Documentation</p>
          <p className="text-xs text-muted-foreground mt-0.5">Endpoints, authentication, signing, and example payloads.</p>
        </div>
      </a>

      <div className="flex items-start gap-2.5 rounded-lg bg-[#BDDCEE]/20 border border-[#BDDCEE]/40 px-3.5 py-3">
        <BoltIcon className="w-4 h-4 text-gray-700 mt-0.5 shrink-0" />
        <p className="text-xs text-foreground leading-relaxed">
          You can fire a real sandbox test order from step 3. we handle the signing &amp; dataString construction for you.
        </p>
      </div>
    </div>
  )
}

// ── Credentials Guide (where to paste, per platform) ───────────────────

const GUIDE_STEPS: Record<Platform, { title: string; desc: React.ReactNode }[]> = {
  wordpress: [
    { title: "Open WooCommerce Settings", desc: <>In your WordPress dashboard, go to <strong>WooCommerce → Settings → Payments</strong>.</> },
    { title: "Find Koko BNPL", desc: <>Scroll to find <strong>Koko BNPL</strong> in the payment methods list and click <strong>Manage</strong>.</> },
    { title: "Paste your credentials", desc: <>Copy each key from this page and paste it into the matching field in the plugin settings.</> },
    { title: "Set environment to Production", desc: <>Under Environment, select <strong>Production</strong> (use Test/Sandbox while testing).</> },
    { title: "Save and go live", desc: <>Click <strong>Save Changes</strong>. Koko will appear at checkout for your customers.</> },
  ],
  shopify: [
    { title: "Open your Shopify Admin", desc: <>Go to <strong>Apps → Koko BNPL</strong> in your Shopify Admin panel.</> },
    { title: "Paste your credentials", desc: <>Copy your <strong>Merchant ID</strong> and <strong>API Key</strong> and paste them into the matching fields.</> },
    { title: "Save settings", desc: <>Click <strong>Save Settings</strong>. Koko will appear as a payment option at checkout.</> },
  ],
  manual: [
    { title: "Share credentials with your developer", desc: <>Send your developer the Merchant ID, API Key, Public Key, and Private Key below.</> },
    { title: "Developer integrates the Koko API", desc: <>They'll use the REST API to initiate and verify payments. see the docs above.</> },
    { title: "Test before going live", desc: <>Use the connection tester in step 3 to confirm everything works.</> },
  ],
}

// ── Test Connection Dialog ─────────────────────────────────────────────────

function TestConnectionDialog({
  open,
  onOpenChange,
  platform,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform: Platform
  onSuccess: () => void
}) {
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [testResult, setTestResult] = useState<{ txnId: string; paymentUrl: string } | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [orderId] = useState(generateOrderId)
  const [amount, setAmount] = useState("100.00")
  const [returnUrl, setReturnUrl] = useState("https://yoursite.com/koko/return")
  const [cancelUrl, setCancelUrl] = useState("https://yoursite.com/koko/cancel")
  const [responseUrl, setResponseUrl] = useState("https://yoursite.com/koko/response")

  const isManual = platform === 'manual'

  // Reset when dialog reopens
  useEffect(() => {
    if (open) {
      setTestStatus("idle")
      setTestResult(null)
      setShowAdvanced(false)
    }
  }, [open])

  const handleTest = () => {
    setTestStatus("loading")
    setTimeout(() => {
      setTestResult({
        txnId: generateTxnId(),
        paymentUrl: `https://qaapi.paykoko.com/pay/checkout?token=${generateToken()}`,
      })
      setTestStatus("success")
      addConnectedPlatform(platform)
      onSuccess()
      toast.success("Connection successful", {
        description: "Your credentials are valid and your integration is working.",
      })
    }, 1400)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/60">
          <DialogTitle className="text-base">
            {isManual ? 'Sandbox Tester' : 'Test Connection'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isManual
              ? "Fire a real sandbox order. We'll handle signing & dataString. just see if the response comes back clean."
              : "We'll send a test payment request to verify your credentials are connected correctly."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Sandbox banner */}
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white tracking-wider shrink-0">SANDBOX</span>
            <p className="text-xs text-amber-800">No real money is moved. this is just a check.</p>
          </div>

          {testStatus === "idle" || testStatus === "loading" ? (
            <>
              <Button
                onClick={handleTest}
                disabled={testStatus === "loading"}
                className="w-full h-11 gap-2"
              >
                {testStatus === "loading" ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Testing connection…
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-4 h-4" />
                    {isManual ? 'Send Test Order' : 'Run Connection Test'}
                  </>
                )}
              </Button>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showAdvanced ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
                Advanced options
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Amount (LKR)</Label>
                    <Input value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono text-sm h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Order ID</Label>
                    <Input value={orderId} readOnly className="font-mono text-sm h-8 bg-muted/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Return URL</Label>
                    <Input value={returnUrl} onChange={(e) => setReturnUrl(e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cancel URL</Label>
                    <Input value={cancelUrl} onChange={(e) => setCancelUrl(e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Response URL (server callback)</Label>
                    <Input value={responseUrl} onChange={(e) => setResponseUrl(e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircleSolid className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800 text-sm">Connection successful</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Your integration is working correctly.</p>
                </div>
              </div>

              <div className="rounded-lg bg-white border border-emerald-200 p-3 space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24 shrink-0">Transaction ID</span>
                  <span className="font-semibold text-foreground">{testResult?.txnId}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-24 shrink-0">Payment URL</span>
                  <span className="text-blue-600 break-all">{testResult?.paymentUrl}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border/60 bg-muted/20 flex justify-end">
          <Button variant={testStatus === 'success' ? 'default' : 'outline'} onClick={() => onOpenChange(false)}>
            {testStatus === 'success' ? 'Done' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Screen: Credentials (now contains everything) ──────────────────────────

function CredentialsScreen({
  platform,
  onBack,
  isConnected,
  onConnected,
  onDisconnected,
}: {
  platform: Platform
  onBack: () => void
  isConnected: boolean
  onConnected: () => void
  onDisconnected: () => void
}) {
  const isShopify = platform === "shopify"
  const [showSigningKeys, setShowSigningKeys] = useState(false)
  const [testOpen, setTestOpen] = useState(false)
  const [disconnectOpen, setDisconnectOpen] = useState(false)
  const guide = GUIDE_STEPS[platform]

  const platformLabel = platform === "wordpress" ? "WooCommerce" : platform === "shopify" ? "Shopify" : "Custom Website"

  const handleDisconnect = () => {
    removeConnectedPlatform(platform)
    setDisconnectOpen(false)
    onDisconnected()
    toast.success("Platform disconnected", {
      description: `${platformLabel} is no longer connected to Koko.`,
    })
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Test Connection action row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to platforms
          </button>
          <span className="text-border">·</span>
          <span className="text-foreground font-medium">{platformLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Status pill */}
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Not connected
            </span>
          )}

          {isConnected && (
            <Button variant="outline" onClick={() => setDisconnectOpen(true)} className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
              <LinkSlashIcon className="w-4 h-4" />
              Disconnect
            </Button>
          )}

          <Button onClick={() => setTestOpen(true)} className="gap-2">
            <ShieldCheckIcon className="w-4 h-4" />
            {isConnected ? 'Re-test Connection' : 'Test Connection'}
          </Button>
        </div>
      </div>

      <AlertDialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {platformLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              Koko will stop accepting BNPL payments from this platform until you connect it again. You can connect a different platform after disconnecting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={handleDisconnect}>
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Step 1: install / docs */}
      <InstallPluginCard platform={platform} />

      {/* Step 2: credentials + guide */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">Step 2</p>
            <h3 className="text-base font-semibold text-foreground">Your API Credentials</h3>
            <p className="text-sm text-muted-foreground mt-1">
              These keys were created when you signed up. Copy each one and paste it into your {platformLabel} settings.
              Don't share them publicly.
            </p>
          </div>

          {/* Primary credentials */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Primary credentials</p>
            <CredentialRow label="Merchant ID" sublabel="All platforms" value={MOCK_CREDENTIALS.merchantId} masked />
            <CredentialRow label="API Key" value={MOCK_CREDENTIALS.apiKey} onRegenerate={() => {}} />
          </div>

          {/* Signing keys — hidden for Shopify */}
          {!isShopify && (
            <div className="space-y-3">
              <button onClick={() => setShowSigningKeys(!showSigningKeys)} className="flex items-center justify-between w-full text-left">
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Signing keys
                    <span className="ml-2 text-xs normal-case font-normal tracking-normal">
                     . required for {platform === 'manual' ? 'custom integrations' : 'WooCommerce'}
                    </span>
                  </p>
                </div>
                {showSigningKeys ? <ChevronUpIcon className="w-4 h-4 text-muted-foreground" /> : <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />}
              </button>

              {showSigningKeys && (
                <div className="space-y-3">
                  <CredentialRow label="Public Key" value={MOCK_CREDENTIALS.publicKey} onRegenerate={() => {}} />
                  <CredentialRow label="Private Key" value={MOCK_CREDENTIALS.privateKey} masked secret onRegenerate={() => {}} />
                  <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-3">
                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800">Never expose your Private Key in client-side code or public repositories.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Guide */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-muted/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BoltIcon className="w-4 h-4 text-[#8B9CF8]" />
            <p className="text-sm font-semibold text-foreground">How to set this up</p>
          </div>
          <ol className="space-y-4">
            {guide.map((s, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center text-xs font-semibold text-foreground mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Test Connection Dialog */}
      <TestConnectionDialog
        open={testOpen}
        onOpenChange={setTestOpen}
        platform={platform}
        onSuccess={onConnected}
      />
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export function Plugin() {
  const [step, setStep] = useState<Step>("select")
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([])

  // First-time auto-open + connected list
  useEffect(() => {
    setConnectedPlatforms(getConnectedPlatforms())
    if (!getOverviewSeen()) {
      setIsGuideOpen(true)
    }
  }, [])

  const closeGuide = () => {
    setIsGuideOpen(false)
    markOverviewSeen()
  }

  const refreshConnected = () => setConnectedPlatforms(getConnectedPlatforms())

  return (
    <div className="space-y-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Plugin Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your website to Koko and start accepting BNPL payments.
        </p>
      </div>

      {step === "select" && (
        <PlatformSelect
          selected={selectedPlatform}
          onSelect={setSelectedPlatform}
          onContinue={() => { if (selectedPlatform) setStep("credentials") }}
          onOpenGuide={() => setIsGuideOpen(true)}
          connectedPlatforms={connectedPlatforms}
        />
      )}

      {step === "credentials" && selectedPlatform && (
        <CredentialsScreen
          platform={selectedPlatform}
          onBack={() => setStep("select")}
          isConnected={connectedPlatforms.includes(selectedPlatform)}
          onConnected={refreshConnected}
          onDisconnected={refreshConnected}
        />
      )}

      {/* Setup Guide Dialog — auto-opens for first-time users, also reachable via the guide button */}
      <SetupGuideDialog open={isGuideOpen} onOpenChange={closeGuide} />
    </div>
  )
}
