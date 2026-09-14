// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import {
  XMarkIcon,
  BellIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  Bars3Icon
} from "@heroicons/react/24/outline"
import { PanelLeft } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { cn } from "./ui/utils"
import { navigationItems, type NavigationItem } from "./NavigationData"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useTheme } from "./ThemeProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
// PROTECTED IMPORT - NEVER REMOVE - Koko Logo
import kokoLogo from "figma:asset/09ac28c5614ff62377e494f60366a17f58f0e925.png"
import astronautBg from 'figma:asset/a349729d02e5cf57b6a622320f58be0535982d3a.png'
import sidebarCampaignBg from 'figma:asset/koko-avurudu-banner.jpg'

import svgPaths from "../imports/svg-fxp87oqzqi"
import HIconSolidBell from "../imports/HIconSolidBell"
import { CreateOrder } from "./CreateOrder"
import { Orders } from "./Orders"
import { StaticQR } from "./StaticQR"
import { Analytics } from "./Analytics"
import { Campaign } from "./Campaign"
import { AdvertiseWithKoko } from "./AdvertiseWithKoko"
import { Finance } from "./Finance"
import { ActionHistory } from "./ActionHistory"
import { ProfileManagement } from "./ProfileManagement"
import { Plugin } from "./tools/Plugin"

interface MerchantPortalProps {
  children?: React.ReactNode
  onLogout?: () => void
}

// ── Sidebar Campaign Banner (image-first "ad space") ────────────────────

function SidebarCampaignBanner({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#BDDCEE] hover:shadow-lg transition-all group"
      style={{
        aspectRatio: '16 / 7',
        background: '#F5EBD7',
      }}
    >
      <img
        src={sidebarCampaignBg}
        alt="Koko Avurudu Campaign"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center' }}
      />
      {/* New Campaign tag — floating top-right corner */}
      <div className="absolute top-1.5 right-1.5 z-10">
        <span className="inline-flex items-center gap-0.5 text-[7px] font-bold uppercase tracking-[0.1em] bg-gray-900 text-white px-1.5 py-0.5 rounded-full shadow">
          <span className="w-0.5 h-0.5 rounded-full bg-white animate-pulse" />
          New
        </span>
      </div>
    </div>
  )
}

function SunIcon() {
  return (
    <div className="relative shrink-0 size-5">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path 
          clipRule="evenodd" 
          d={svgPaths.pe62c280} 
          fill="currentColor" 
          fillRule="evenodd" 
        />
      </svg>
    </div>
  )
}

function CustomAvatar() {
  return (
    <div className="relative h-9 w-9 rounded-full shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105">
      {/* Brand accent outer border */}
      <div className="absolute inset-0 rounded-full border-2 border-[#BDDDEE]" />
      
      {/* White stroke border */}
      <div className="absolute inset-[2px] rounded-full border border-white">
        {/* Dark background with letter */}
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#2b3440] text-[#d7dde4] text-sm font-medium">
          J
        </div>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 rounded-xl hover:bg-sidebar-button-hover text-sidebar-foreground/70 hover:text-sidebar-foreground transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
    >
      {theme === "light" ? (
        <SunIcon />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function UserAvatar({ onLogout }: { onLogout?: () => void }) {
  const handleLogout = () => {
    onLogout?.()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-sidebar-button-hover">
          <CustomAvatar />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Johdoe1</p>
            <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileUserAvatar({ onLogout }: { onLogout?: () => void }) {
  const handleLogout = () => {
    onLogout?.()
  }

  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-4">
        <CustomAvatar />
        <div>
          <p className="font-semibold text-base">Johdoe1</p>
          <p className="text-sm text-muted-foreground">john@example.com</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive transition-colors duration-200 rounded-xl hover:bg-destructive/10"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}



const getPageDescription = (pageId: string) => {
  switch (pageId) {
    case 'campaign':
    case 'campaign-active':
    case 'campaign-yours':
      return 'Create and manage marketing campaigns and promotions'
    case 'advertise-with-koko':
      return 'Book premium visibility across the Koko shopper app'
    case 'plugins':
      return 'Connect your website to Koko and start accepting BNPL payments'
    case 'finance':
      return 'Track payments, settlements, and financial reports'
    case 'action-history':
      return 'Review all activities and system actions'
    case 'profile-management':
      return 'Manage user accounts, roles, and permissions'
    default:
      return 'Page functionality coming soon'
  }
}

export function MerchantPortal({ children, onLogout }: MerchantPortalProps) {
  const [currentPage, setCurrentPage] = useState('advertise-with-koko')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mobileExpandedItems, setMobileExpandedItems] = useState<Set<string>>(new Set())
  const [campaignNotificationViewed, setCampaignNotificationViewed] = useState(false)
  const [createOrderStep, setCreateOrderStep] = useState<string>('form')
  const [ordersInitialTab, setOrdersInitialTab] = useState<string | null>(null)
  const { theme } = useTheme()

  // Demo switcher: flips the Advertise with Koko UI between flow variants
  const [demoFlow, setDemoFlow] = useState<string>('default')
  const [showDemoSwitcher, setShowDemoSwitcher] = useState(false)
  // Alternate UI: no-price landing cards (default) vs the priced card design
  const [uiVariant, setUiVariant] = useState<string>('nopriced')
  const [showUiSwitcher, setShowUiSwitcher] = useState(false)
  // Flows: reference links to the Figma boards
  const [showFlows, setShowFlows] = useState(false)
  // Simulator: state presets for demoing the portal
  const [showSimulator, setShowSimulator] = useState(false)
  const [simulateRecap, setSimulateRecap] = useState(0)
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('koko-demo-flow') : null
    if (saved === 'cta' || saved === 'default') setDemoFlow(saved)
    const savedUi = typeof window !== 'undefined' ? window.localStorage.getItem('koko-ui-variant') : null
    if (savedUi === 'priced' || savedUi === 'nopriced') setUiVariant(savedUi)
  }, [])
  const applyDemoFlow = (f: string) => {
    setDemoFlow(f)
    try { window.localStorage.setItem('koko-demo-flow', f) } catch {}
    setCurrentPage('advertise-with-koko')
    setShowDemoSwitcher(false)
  }
  const applyUiVariant = (v: string) => {
    setUiVariant(v)
    try { window.localStorage.setItem('koko-ui-variant', v) } catch {}
    setCurrentPage('advertise-with-koko')
    setShowUiSwitcher(false)
  }
  // Demo mode: every portal feature except Advertise with Koko is disabled
  const isNavDisabled = (id: string) => id !== 'advertise-with-koko'

  const getCurrentPageTitle = () => {
    for (const item of navigationItems) {
      if (item.id === currentPage) {
        return item.title
      }
      if (item.secondaryItems) {
        const secondaryItem = item.secondaryItems.find(sub => sub.id === currentPage)
        if (secondaryItem) {
          return secondaryItem.title
        }
      }
    }
    return 'Create Order'
  }

  const handleItemClick = (item: NavigationItem) => {
    if (item.hasSecondary) {
      const newExpanded = new Set(expandedItems)
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id)
      } else {
        newExpanded.add(item.id)
      }
      setExpandedItems(newExpanded)
    } else {
      // Mark campaign notification as viewed when campaign page is accessed
      if (item.id === 'campaign') {
        setCampaignNotificationViewed(true)
      }
      setCurrentPage(item.id)
      setIsMobileMenuOpen(false)
      // Reset CreateOrder step when navigating away from create-order page
      if (item.id !== 'create-order') {
        setCreateOrderStep('form')
      }
    }
  }

  const handleSecondaryClick = (secondaryId: string) => {
    if (secondaryId === 'campaign') {
      setCampaignNotificationViewed(true)
    }
    setCurrentPage(secondaryId)
    setIsMobileMenuOpen(false)
    setTimeout(() => setShowMobileMenu(false), 300)
    // Reset CreateOrder step when navigating away from create-order page
    if (secondaryId !== 'create-order') {
      setCreateOrderStep('form')
    }
  }

  const handleMobileItemClick = (item: NavigationItem) => {
    if (item.hasSecondary) {
      const newExpanded = new Set(mobileExpandedItems)
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id)
      } else {
        newExpanded.add(item.id)
      }
      setMobileExpandedItems(newExpanded)
    } else {
      // Mark campaign notification as viewed when campaign page is accessed
      if (item.id === 'campaign') {
        setCampaignNotificationViewed(true)
      }
      setCurrentPage(item.id)
      setIsMobileMenuOpen(false)
      setTimeout(() => setShowMobileMenu(false), 300)
      // Reset CreateOrder step when navigating away from create-order page
      if (item.id !== 'create-order') {
        setCreateOrderStep('form')
      }
    }
  }

  const isItemActive = (item: NavigationItem) => {
    if (currentPage === item.id) return true
    if (item.secondaryItems) {
      return item.secondaryItems.some(sub => sub.id === currentPage)
    }
    return false
  }

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setShowMobileMenu(true)
      requestAnimationFrame(() => {
        setIsMobileMenuOpen(true)
      })
    } else {
      setIsMobileMenuOpen(false)
      setTimeout(() => {
        setShowMobileMenu(false)
      }, 300) // Match the transition duration
    }
  }

  // Helper function to check if campaign notification should be shown
  const shouldShowCampaignNotification = (item: NavigationItem) => {
    return item.id === 'campaign' && !campaignNotificationViewed && item.badge && item.badge.count > 0
  }

  // Handle CreateOrder step changes
  const handleCreateOrderStepChange = (step: string) => {
    setCreateOrderStep(step)
  }

  // Handle navigation to orders with specific tab
  const handleNavigateToOrders = (initialTab?: string) => {
    setCurrentPage('orders')
    setOrdersInitialTab(initialTab || null)
    setIsMobileMenuOpen(false)
    // Reset CreateOrder step when navigating away from create-order page
    setCreateOrderStep('form')
  }

  // Determine if special background should be applied
  const shouldApplySpecialBackground = currentPage === 'create-order' && createOrderStep === 'form'

  return (
    <div className="flex h-screen bg-background overflow-x-hidden">
      {/* Demo switcher overlay */}
      {showDemoSwitcher && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6"
          onClick={() => setShowDemoSwitcher(false)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Demo switcher"
          >
            <div>
              <h2 className="text-lg font-bold tracking-tight">Demo switcher</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Pick which Advertise with Koko flow to demo. Switching resets the flow.</p>
            </div>
            {[
              ["default", "Flow 1 · Default", "Landing page shows the placement cards. Booking: Period, Positions, Assets, Payment."],
              ["cta", "Flow 2 · CTA first", "Landing page shows one big CTA. Booking: Period, Spaces, Positions, Assets, Payment."],
            ].map(([id, label, desc]) => (
              <button
                key={id}
                onClick={() => applyDemoFlow(id)}
                className={cn(
                  "flex items-start gap-3 text-left rounded-xl border-2 p-4 transition-colors cursor-pointer",
                  demoFlow === id ? "border-gray-900 dark:border-gray-200 bg-gray-50/60 dark:bg-gray-900/40" : "border-border hover:border-gray-400",
                )}
              >
                <span
                  className={cn(
                    "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5",
                    demoFlow === id
                      ? "border-gray-900 bg-gray-900 shadow-[inset_0_0_0_3px_#fff] dark:border-gray-100 dark:bg-gray-100 dark:shadow-[inset_0_0_0_3px_#1D232A]"
                      : "border-border bg-card",
                  )}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</span>
                </span>
              </button>
            ))}
            <button
              onClick={() => setShowDemoSwitcher(false)}
              className="w-full rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Flows overlay — Figma board links */}
      {showFlows && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6"
          onClick={() => setShowFlows(false)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Flows"
          >
            <div>
              <h2 className="text-lg font-bold tracking-tight">Flows</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Reference boards for Advertise with Koko. Opens in Figma.</p>
            </div>
            {[
              ["UX logic flow", "Business rules and UX logic behind the booking flow", "https://www.figma.com/board/uTt2QUga8cn287ghIHEMhA/Advertise-with-Koko---Business-and-UX-logic-flow?node-id=3-224&t=xMo7KpnRweBkqqyJ-0"],
              ["Merchant user flow", "End to end path a merchant takes through the product", "https://www.figma.com/board/9cT0sEkdlPf8cSwvitkUbP/Advertise-with-Koko---Merchant-user-flow?node-id=1-15&t=6g1X1TZzQvc5OizR-1"],
            ].map(([label, desc, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 rounded-xl border-2 border-border p-4 transition-colors hover:border-gray-400 cursor-pointer"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</span>
                </span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </a>
            ))}
            <button
              onClick={() => setShowFlows(false)}
              className="w-full rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Alternate UI overlay */}
      {showUiSwitcher && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6"
          onClick={() => setShowUiSwitcher(false)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Alternate UI"
          >
            <div>
              <h2 className="text-lg font-bold tracking-tight">Alternate UI</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Pick which Advertise with Koko design to view.</p>
            </div>
            {[
              ["nopriced", "No price · Default", "Landing cards show store visits only. No price estimates until the booking flow."],
              ["priced", "Priced cards · Alternate", "Landing cards show weekly prices, discounts, and the price sort toggle."],
            ].map(([id, label, desc]) => (
              <button
                key={id}
                onClick={() => applyUiVariant(id)}
                className={cn(
                  "flex items-start gap-3 text-left rounded-xl border-2 p-4 transition-colors cursor-pointer",
                  uiVariant === id ? "border-gray-900 dark:border-gray-200 bg-gray-50/60 dark:bg-gray-900/40" : "border-border hover:border-gray-400",
                )}
              >
                <span
                  className={cn(
                    "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5",
                    uiVariant === id
                      ? "border-gray-900 bg-gray-900 shadow-[inset_0_0_0_3px_#fff] dark:border-gray-100 dark:bg-gray-100 dark:shadow-[inset_0_0_0_3px_#1D232A]"
                      : "border-border bg-card",
                  )}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</span>
                </span>
              </button>
            ))}
            <button
              onClick={() => setShowUiSwitcher(false)}
              className="w-full rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Simulator overlay — placeholder until states are defined */}
      {showSimulator && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-6"
          onClick={() => setShowSimulator(false)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Simulator"
          >
            <div>
              <h2 className="text-lg font-bold tracking-tight">Simulator</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Simulate portal states for demos.</p>
            </div>
            <button
              onClick={() => {
                setCurrentPage('advertise-with-koko')
                setSimulateRecap((n) => n + 1)
                setShowSimulator(false)
              }}
              className="flex items-start gap-3 text-left rounded-xl border-2 border-border p-4 transition-colors hover:border-gray-400 cursor-pointer"
            >
              <span className="text-lg leading-none mt-0.5">🎉</span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">Advertisement period ended</span>
                <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Opens My advertisements and celebrates a finished booking with a recap of its results.
                </span>
              </span>
            </button>
            <div className="rounded-xl border border-dashed border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">More states can be added here.</p>
            </div>
            <button
              onClick={() => setShowSimulator(false)}
              className="w-full rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-shrink-0 bg-white transition-[width] duration-300 ease-in-out relative z-10",
          // Elevated sidebar — directional shadow on the right edge + subtle vertical lift
          "shadow-[6px_0_28px_-8px_rgba(15,23,42,0.12),0_4px_16px_-2px_rgba(15,23,42,0.06)]",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex flex-col w-full overflow-hidden">
          {/* Logo + Toggle Section */}
          <div className={cn(
            "border-b border-border/50 transition-all duration-300",
            isSidebarCollapsed ? "px-3 py-5" : "px-5 py-5"
          )}>
            {isSidebarCollapsed ? (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  aria-label="Expand sidebar"
                  title="Expand sidebar"
                  className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <PanelLeft className="h-5 w-5 text-gray-600" />
                </button>
                {/* PROTECTED LOGO - NEVER REMOVE */}
                <div className="h-11 w-11 bg-white rounded-xl shadow-md border border-border/20 flex items-center justify-center p-1 flex-shrink-0">
                  <ImageWithFallback
                    src={kokoLogo}
                    alt="Koko Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* PROTECTED LOGO - NEVER REMOVE */}
                <div className="h-11 w-11 bg-white rounded-xl shadow-md border border-border/20 flex items-center justify-center p-1 flex-shrink-0">
                  <ImageWithFallback
                    src={kokoLogo}
                    alt="Koko Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-base font-bold text-sidebar-foreground leading-tight tracking-tight truncate">
                    Merchant Portal
                  </span>
                  <span className="text-xs font-medium text-sidebar-foreground/60 truncate">
                    Carnage - Colombo
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                  className="h-9 w-9 rounded-lg flex items-center justify-center bg-white shadow-sm border border-border/40 hover:bg-gray-50 hover:shadow-md transition-all flex-shrink-0"
                >
                  <PanelLeft className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 py-6 transition-all duration-300 overflow-y-auto",
            isSidebarCollapsed ? "px-3" : "px-6"
          )}>
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.id} className={cn(isNavDisabled(item.id) && "opacity-40 pointer-events-none select-none")} aria-disabled={isNavDisabled(item.id)}>
                  <button
                    disabled={isNavDisabled(item.id)}
                    onClick={() => {
                      if (item.hasSecondary) {
                        if (isSidebarCollapsed) {
                          // In collapsed mode, expand sidebar AND open the secondary
                          setIsSidebarCollapsed(false)
                          setExpandedItems(new Set([item.id]))
                          if (item.secondaryItems && item.secondaryItems.length > 0) {
                            setCurrentPage(item.secondaryItems[0].id)
                            setCreateOrderStep('form')
                          }
                          return
                        }
                        if (expandedItems.has(item.id)) {
                          const newExpanded = new Set(expandedItems)
                          newExpanded.delete(item.id)
                          setExpandedItems(newExpanded)
                        } else {
                          setExpandedItems(new Set([item.id]))
                          if (item.secondaryItems && item.secondaryItems.length > 0) {
                            setCurrentPage(item.secondaryItems[0].id)
                            setIsMobileMenuOpen(false)
                            setCreateOrderStep('form')
                          }
                        }
                      } else {
                        setExpandedItems(new Set())
                        handleItemClick(item)
                      }
                    }}
                    title={isSidebarCollapsed ? item.title : undefined}
                    className={cn(
                      "w-full flex items-center text-left rounded-xl transition-all duration-200 group",
                      isSidebarCollapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5",
                      isItemActive(item)
                        ? "sidebar-active-gradient text-[#1f2937] shadow-md hover:shadow-lg"
                        : "text-sidebar-foreground hover:bg-sidebar-button-hover hover:shadow-md"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                      isItemActive(item)
                        ? "text-black scale-110"
                        : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                    )} />
                    {!isSidebarCollapsed && (
                      <>
                        <span className={cn(
                          "text-sm font-medium leading-5 transition-transform duration-200 origin-left",
                          isItemActive(item) ? "text-black font-semibold scale-110" : "font-medium"
                        )}>
                          {item.title}
                        </span>

                        {shouldShowCampaignNotification(item) && (
                          <div className="ml-auto">
                            <div className="h-5 w-5 text-[#BDDDEE] animate-pulse">
                              <HIconSolidBell />
                            </div>
                          </div>
                        )}

                        {item.hasSecondary && (
                          <div className="ml-auto">
                            <ChevronDownIcon
                              className={cn(
                                "h-5 w-5 transition-transform duration-200",
                                isItemActive(item) ? "text-black" : "text-sidebar-foreground/60",
                                expandedItems.has(item.id) ? "rotate-180" : "rotate-0"
                              )}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </button>

                  {/* Secondary Items — only shown when expanded */}
                  {!isSidebarCollapsed && item.hasSecondary && expandedItems.has(item.id) && (
                    <div className="ml-10 mt-2 space-y-1">
                      {item.secondaryItems?.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleSecondaryClick(subItem.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3.5 text-left rounded-xl transition-all duration-200",
                            currentPage === subItem.id
                              ? "text-black font-bold"
                              : "text-sidebar-foreground/60 font-medium hover:text-sidebar-foreground hover:bg-sidebar-button-hover"
                          )}
                        >
                          <span className={cn("text-sm leading-5", currentPage === subItem.id ? "font-bold" : "font-medium")}>{subItem.title}</span>
                          {subItem.badge && subItem.badge.count > 0 && (
                            <div className="ml-auto">
                              <div className="bg-[#BDDDEE] px-2.5 py-1 h-6 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-gray-900 text-xs font-semibold">
                                  {subItem.badge.count}
                                </span>
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Flows — reference links to the Figma boards */}
          {!isSidebarCollapsed && (
            <div className="px-5 pt-2">
              <button
                onClick={() => setShowFlows(true)}
                className="w-full flex items-center justify-between gap-2 rounded-xl border border-dashed border-gray-400 dark:border-gray-500 bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
              >
                <span>Flows</span>
                <span className="text-[10px] font-bold bg-[#BDDCEE] text-gray-800 rounded-full px-2.5 py-1 leading-none whitespace-nowrap">
                  Figma
                </span>
              </button>
            </div>
          )}

          {/* Alternate UI — switches the Advertise with Koko design variant */}
          {!isSidebarCollapsed && (
            <div className="px-5 pt-2">
              <button
                onClick={() => setShowUiSwitcher(true)}
                className="w-full flex items-center justify-between gap-2 rounded-xl border border-dashed border-gray-400 dark:border-gray-500 bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
              >
                <span>Alternate UI</span>
                <span className="text-[10px] font-bold bg-[#BDDCEE] text-gray-800 rounded-full px-2.5 py-1 leading-none whitespace-nowrap">
                  {uiVariant === 'priced' ? 'Priced' : 'No price'}
                </span>
              </button>
            </div>
          )}

          {/* Simulator — state presets, to be filled in later */}
          {!isSidebarCollapsed && (
            <div className="px-5 pt-2">
              <button
                onClick={() => setShowSimulator(true)}
                className="w-full flex items-center justify-between gap-2 rounded-xl border border-dashed border-gray-400 dark:border-gray-500 bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
              >
                <span>Simulator</span>
                <span className="text-[10px] font-bold bg-[#BDDCEE] text-gray-800 rounded-full px-2.5 py-1 leading-none whitespace-nowrap">
                  Soon
                </span>
              </button>
            </div>
          )}

          {/* Demo switcher — flips the Advertise with Koko flow variant */}
          {!isSidebarCollapsed && (
            <div className="px-5 pt-2">
              <button
                onClick={() => setShowDemoSwitcher(true)}
                className="w-full flex items-center justify-between gap-2 rounded-xl border border-dashed border-gray-400 dark:border-gray-500 bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:border-gray-900 dark:hover:border-gray-200 cursor-pointer"
              >
                <span>Demo switcher</span>
                <span className="text-[10px] font-bold bg-[#BDDCEE] text-gray-800 rounded-full px-2.5 py-1 leading-none whitespace-nowrap">
                  {demoFlow === 'cta' ? 'Flow 2' : 'Flow 1'}
                </span>
              </button>
            </div>
          )}

          {/* Sidebar Campaign Banner — expanded view only */}
          {!isSidebarCollapsed && (
            <div className={cn("px-5 pb-3 pt-2", "opacity-40 pointer-events-none")}>
              <SidebarCampaignBanner onClick={() => setCurrentPage('campaign')} />
            </div>
          )}

          {/* Bottom Section - Avatar + Logout */}
          <div className={cn(
            "border-t border-border/50 transition-all duration-300",
            isSidebarCollapsed ? "px-3 py-4" : "px-6 py-6"
          )}>
            {isSidebarCollapsed ? (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  title="Log out"
                  className="h-10 w-10 p-0 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-xl"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-4 min-w-0">
                  <CustomAvatar />
                  <span className="text-sm font-semibold text-sidebar-foreground truncate">Johdoe1</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  title="Log out"
                  className="h-9 px-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className={cn(
              "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
              isMobileMenuOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={toggleMobileMenu} 
          />
          <div className={cn(
            "fixed top-0 right-0 h-full w-80 bg-white dark:bg-sidebar border-l border-border shadow-2xl transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "transform translate-x-0" : "transform translate-x-full"
          )}>
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center flex-shrink-0 rounded-xl shadow-md bg-[#BDDDEE]/10">
                    {/* PROTECTED MOBILE MENU LOGO - NEVER REMOVE */}
                    <ImageWithFallback 
                      src={kokoLogo} 
                      alt="Koko Logo" 
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-sidebar-foreground">Merchant Portal</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  className="rounded-xl hover:bg-sidebar-button-hover transition-colors duration-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-3">
                  {navigationItems.map((item) => (
                    <div key={item.id} className={cn(isNavDisabled(item.id) && "opacity-40 pointer-events-none select-none")} aria-disabled={isNavDisabled(item.id)}>
                      <Button
                        variant="ghost"
                        disabled={isNavDisabled(item.id)}
                        className={cn(
                          "w-full justify-between h-14 px-4 text-left rounded-xl transition-all duration-200",
                          currentPage === item.id && !item.hasSecondary
                            ? "sidebar-active-gradient text-[#1f2937] shadow-md"
                            : "hover:bg-sidebar-button-hover hover:shadow-md text-sidebar-foreground"
                        )}
                        onClick={() => handleMobileItemClick(item)}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.title}</span>
                          {shouldShowCampaignNotification(item) && (
                            <div className="h-4 w-4 text-[#BDDDEE] animate-pulse">
                              <HIconSolidBell />
                            </div>
                          )}
                          {item.badge && item.badge.count > 0 && item.id !== 'campaign' && (
                            <Badge 
                              variant={item.badge.variant || 'default'}
                              className="h-5 w-5 p-0 flex items-center justify-center text-xs min-w-[20px] bg-[#BDDDEE] text-gray-900 border-0 shadow-sm"
                            >
                              {item.badge.count > 99 ? '99+' : item.badge.count}
                            </Badge>
                          )}
                        </div>
                        {item.hasSecondary && (
                           <ChevronDownIcon 
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              mobileExpandedItems.has(item.id) ? "rotate-0" : "rotate-180"
                            )} 
                          />
                        )}
                      </Button>

                      {/* Mobile Secondary Items */}
                      {item.hasSecondary && mobileExpandedItems.has(item.id) && (
                        <div className="ml-8 mt-2 space-y-2">
                          {item.secondaryItems?.map((subItem) => (
                            <Button
                              key={subItem.id}
                              variant="ghost"
                              className={cn(
                                "w-full justify-between h-12 px-4 text-left text-sm rounded-xl transition-all duration-200",
                                currentPage === subItem.id
                                  ? "bg-[#BDDDEE]/20 text-sidebar-foreground border border-[#BDDDEE]/30 shadow-sm"
                                  : "hover:bg-sidebar-button-hover text-sidebar-foreground/80"
                              )}
                              onClick={() => handleSecondaryClick(subItem.id)}
                            >
                              <span className="font-medium">{subItem.title}</span>
                              {subItem.badge && subItem.badge.count > 0 && (
                                <div className="h-4 w-4 text-[#BDDDEE]">
                                  <HIconSolidBell />
                                </div>
                              )}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </nav>

              {/* Bottom Section - User */}
              <div className="border-t border-border/50 bg-sidebar dark:bg-sidebar">
                {/* User Section */}
                <MobileUserAvatar onLogout={onLogout} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
        {/* Mobile Header - Only for mobile hamburger menu */}
        <div className="md:hidden flex items-center justify-between gap-4 p-6 border-b bg-white dark:bg-background flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-white border border-sidebar-border shadow-sm overflow-hidden">
              <img
                src={kokoLogo}
                alt="Koko Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="min-w-0 space-y-1 text-left">
              <h1 className="text-xl font-bold text-foreground truncate">Merchant Portal</h1>
              <p className="text-sm font-medium text-muted-foreground truncate">{getCurrentPageTitle()}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 flex-shrink-0 rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        {/* Page Content */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 min-w-0 relative bg-background",
            currentPage === 'create-order' && createOrderStep === 'form' && "flex items-center justify-center"
          )}
          style={shouldApplySpecialBackground ? {
            backgroundImage: theme === 'dark'
              ? 'linear-gradient(149.739deg, #1a2a38 0%, #1e2145 45%, #2a1a3a 100%)'
              : 'linear-gradient(149.739deg, #BDDCEE 0%, #E0E7FF 35%, #F3E8FF 70%, #FCE7F3 100%)',
          } : {}}
        >

          <div className={cn(
            "relative z-10",
            currentPage === 'create-order' && createOrderStep === 'form' && "w-full"
          )}>
            {children || (
            currentPage === 'create-order' ? (
              <CreateOrder onStepChange={handleCreateOrderStepChange} onNavigateToOrders={() => handleNavigateToOrders('pending')} />
            ) : currentPage === 'orders' ? (
              <Orders initialTab={ordersInitialTab} onTabChange={() => setOrdersInitialTab(null)} />
            ) : currentPage === 'static-qr' ? (
              <StaticQR />
            ) : currentPage === 'analytics' ? (
              <Analytics />
            ) : currentPage === 'campaign' || currentPage === 'campaign-active' || currentPage === 'campaign-yours' ? (
              <Campaign showNotification={!campaignNotificationViewed} />
            ) : currentPage === 'advertise-with-koko' ? (
              <AdvertiseWithKoko
                flow={demoFlow}
                showPrices={uiVariant === 'priced'}
                simulateRecap={simulateRecap}
                key={demoFlow + uiVariant}
              />
            ) : currentPage === 'plugins' ? (
              <Plugin />
            ) : currentPage === 'finance' ? (
              <Finance />
            ) : currentPage === 'action-history' ? (
              <ActionHistory />
            ) : currentPage === 'profile-management' ? (
              <ProfileManagement />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-6 max-w-md p-8 rounded-2xl bg-white dark:bg-card shadow-lg border border-border/50">
                  <div className="text-center space-y-3">
                    <h1 className="text-3xl font-semibold">Create New Order</h1>
                    <p className="text-muted-foreground text-lg">
                      Generate payment links and QR codes for customers
                    </p>
                  </div>
                </div>
              </div>
            )
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
