// @ts-nocheck
import { useState, useEffect } from "react"
import { Download, ChevronDown, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { cn } from "./ui/utils"
import { toast } from "sonner"

// ── Types ────────────────────────────────────────────────────────────────

interface FinancialData {
  period: string
  startDate: string
  endDate: string
  totalOrderValue: number
  merchantCommissionFee: number
  paymentFee: number
  merchantSubsidy: number
  refunds: {
    totalOrderValueRefund: number
    merchantCommissionFeeRefund: number
    paymentFeeRefund: number
    merchantSubsidyRefund: number
  }
  orderCount: number
  refundCount: number
}

// ── Mock data (chronological, oldest → newest at end) ────────────────────

const financialData: FinancialData[] = [
  {
    period: "Oct 25, 2026 - Nov 10, 2026",
    startDate: "2026-10-25",
    endDate: "2026-11-10",
    totalOrderValue: 980000.00,
    merchantCommissionFee: 19600.00,
    paymentFee: 9800.00,
    merchantSubsidy: 3000.00,
    refunds: { totalOrderValueRefund: 0, merchantCommissionFeeRefund: 0, paymentFeeRefund: 0, merchantSubsidyRefund: 0 },
    orderCount: 28,
    refundCount: 0
  },
  {
    period: "Nov 10, 2026 - Nov 25, 2026",
    startDate: "2026-11-10",
    endDate: "2026-11-25",
    totalOrderValue: 1100000.00,
    merchantCommissionFee: 22000.00,
    paymentFee: 11000.00,
    merchantSubsidy: 3500.00,
    refunds: { totalOrderValueRefund: 0, merchantCommissionFeeRefund: 0, paymentFeeRefund: 0, merchantSubsidyRefund: 0 },
    orderCount: 32,
    refundCount: 0
  },
  {
    period: "Nov 25, 2026 - Dec 10, 2026",
    startDate: "2026-11-25",
    endDate: "2026-12-10",
    totalOrderValue: 1200000.00,
    merchantCommissionFee: 24000.00,
    paymentFee: 12000.00,
    merchantSubsidy: 4000.00,
    refunds: { totalOrderValueRefund: 8500.00, merchantCommissionFeeRefund: 170.00, paymentFeeRefund: 85.00, merchantSubsidyRefund: 42.50 },
    orderCount: 38,
    refundCount: 2
  },
  {
    period: "Dec 10, 2026 - Dec 25, 2026",
    startDate: "2026-12-10",
    endDate: "2026-12-25",
    totalOrderValue: 1350000.00,
    merchantCommissionFee: 27000.00,
    paymentFee: 13500.00,
    merchantSubsidy: 5125.00,
    refunds: { totalOrderValueRefund: 15000.00, merchantCommissionFeeRefund: 300.00, paymentFeeRefund: 150.00, merchantSubsidyRefund: 75.00 },
    orderCount: 45,
    refundCount: 3
  },
]

// Period quick presets
type QuickPreset = 'current' | 'previous' | 'last-30d' | 'last-90d' | 'custom'

const QUICK_PRESETS: { id: QuickPreset; label: string }[] = [
  { id: 'current', label: 'Current period' },
  { id: 'previous', label: 'Previous period' },
  { id: 'last-30d', label: 'Last 30 days' },
  { id: 'last-90d', label: 'Last 90 days' },
]

// ── Helpers ──────────────────────────────────────────────────────────────

const formatCurrency = (amount: number, isRefund = false) => {
  const prefix = isRefund && amount > 0 ? '-' : ''
  return `${prefix}Rs. ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const calcEarnings = (d: FinancialData) =>
  d.totalOrderValue - d.merchantCommissionFee - d.paymentFee + d.merchantSubsidy

const calcRefundsTotal = (d: FinancialData) =>
  d.refunds.totalOrderValueRefund - d.refunds.merchantCommissionFeeRefund - d.refunds.paymentFeeRefund + d.refunds.merchantSubsidyRefund

const calcClosing = (d: FinancialData) => calcEarnings(d) - calcRefundsTotal(d)

const pctChange = (current: number, previous: number): number => {
  if (!previous) return 0
  return ((current - previous) / Math.abs(previous)) * 100
}

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

// ── Sub-components ───────────────────────────────────────────────────────

function TrendPill({ change, invertSentiment = false }: { change: number; invertSentiment?: boolean }) {
  const isUp = change > 0
  const isDown = change < 0
  // For refunds, "up" is bad
  const goodDirection = invertSentiment ? isDown : isUp
  const badDirection = invertSentiment ? isUp : isDown
  const styles = goodDirection
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : badDirection
    ? 'bg-red-50 text-red-700 border-red-200'
    : 'bg-muted text-muted-foreground border-border'
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
      styles
    )}>
      {isUp && <TrendingUp className="h-3 w-3" />}
      {isDown && <TrendingDown className="h-3 w-3" />}
      <span className="tabular-nums">{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
    </span>
  )
}

// ── Main Component ───────────────────────────────────────────────────────

export function Finance() {
  // Most recent period is at the end of the array
  const latestPeriod = financialData[financialData.length - 1].period

  const [quickPreset, setQuickPreset] = useState<QuickPreset>('current')
  const [selectedPeriod, setSelectedPeriod] = useState<string>(latestPeriod)
  const [isOrderBreakdownOpen, setIsOrderBreakdownOpen] = useState(false)
  const [isRefundBreakdownOpen, setIsRefundBreakdownOpen] = useState(false)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)

  // Sync quick preset → selectedPeriod
  useEffect(() => {
    if (quickPreset === 'current') {
      setSelectedPeriod(financialData[financialData.length - 1].period)
    } else if (quickPreset === 'previous') {
      setSelectedPeriod(financialData[financialData.length - 2]?.period || latestPeriod)
    }
    // last-30d / last-90d use a synthetic aggregate; we still display the latest period's breakdown for now
  }, [quickPreset, latestPeriod])

  // Find current + previous period data
  const currentIdx = financialData.findIndex(d => d.period === selectedPeriod)
  const currentData = financialData[currentIdx] ?? financialData[financialData.length - 1]
  const previousData = currentIdx > 0 ? financialData[currentIdx - 1] : null

  // Computed values
  const earningsCurrent = calcEarnings(currentData)
  const refundsCurrent = calcRefundsTotal(currentData)
  const closingCurrent = calcClosing(currentData)
  const earningsPrev = previousData ? calcEarnings(previousData) : 0
  const refundsPrev = previousData ? calcRefundsTotal(previousData) : 0
  const closingPrev = previousData ? calcClosing(previousData) : 0

  const earningsTrend = pctChange(earningsCurrent, earningsPrev)
  const refundsTrend = pctChange(refundsCurrent, refundsPrev)
  const closingTrend = pctChange(closingCurrent, closingPrev)

  const handleGenerateInvoice = () => setIsInvoiceModalOpen(true)

  const handleConfirmInvoiceGeneration = () => {
    const invoiceData = `
Finance Statement
=====================================

Period: ${currentData.period}
Generated: ${new Date().toLocaleDateString('en-GB')}

Order Financial Summary:
- Total Order Value: ${formatCurrency(currentData.totalOrderValue)}
- Merchant Commission Fee: -${formatCurrency(currentData.merchantCommissionFee)}
- Payment Processing Fee: -${formatCurrency(currentData.paymentFee)}
- Merchant Subsidy: +${formatCurrency(currentData.merchantSubsidy)}
- Subtotal: ${formatCurrency(earningsCurrent)}

Refunds:
- Total Order Value Refund: ${formatCurrency(currentData.refunds.totalOrderValueRefund, true)}
- Commission Fee Refund: +${formatCurrency(currentData.refunds.merchantCommissionFeeRefund)}
- Payment Fee Refund: +${formatCurrency(currentData.refunds.paymentFeeRefund)}
- Subsidy Refund: ${formatCurrency(currentData.refunds.merchantSubsidyRefund, true)}
- Subtotal: ${formatCurrency(refundsCurrent, true)}

Closing Balance: ${formatCurrency(closingCurrent)}
`.trim()

    const blob = new Blob([invoiceData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance_statement_${currentData.startDate}_${currentData.endDate}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsInvoiceModalOpen(false)
    toast.success('Invoice generated', {
      description: `${currentData.period} downloaded.`,
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 min-w-0">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Finance</h1>
          <p className="text-sm text-muted-foreground mt-1">Financial statements and earnings overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={quickPreset}
            onValueChange={(v) => setQuickPreset(v as QuickPreset)}
          >
            <SelectTrigger className="h-9 w-auto min-w-[160px] text-sm bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUICK_PRESETS.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedPeriod}
            onValueChange={(v) => { setSelectedPeriod(v); setQuickPreset('custom') }}
          >
            <SelectTrigger className="h-9 w-auto min-w-[220px] text-sm bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...financialData].reverse().map(d => (
                <SelectItem key={d.period} value={d.period}>{d.period}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="h-9 gap-2 text-sm" onClick={handleGenerateInvoice}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Generate Invoice</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards — trend pills + sparkline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Earnings */}
        <Card className="rounded-xl border border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Earnings</p>
            <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight mt-1">
              {formatCurrency(earningsCurrent)}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <TrendPill change={earningsTrend} />
              <span className="text-xs text-muted-foreground">vs prev period</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Refunds — up = bad */}
        <Card className="rounded-xl border border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Refunds</p>
            <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight mt-1">
              {refundsCurrent > 0 ? formatCurrency(refundsCurrent, true) : formatCurrency(0)}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <TrendPill change={refundsTrend} invertSentiment />
              <span className="text-xs text-muted-foreground">vs prev period</span>
            </div>
          </CardContent>
        </Card>

        {/* Closing Balance */}
        <Card className="rounded-xl border border-border/60 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Closing Balance</p>
            <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight mt-1">
              {formatCurrency(closingCurrent)}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <TrendPill change={closingTrend} />
              <span className="text-xs text-muted-foreground">vs prev period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Statement */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Financial Statement</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatShortDate(currentData.startDate)} – {formatShortDate(currentData.endDate)}
              </p>
            </div>
          </div>

          {/* Order Financial Summary */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <Collapsible open={isOrderBreakdownOpen} onOpenChange={setIsOrderBreakdownOpen}>
              <CollapsibleTrigger asChild>
                <div className="w-full cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-l-4 border-l-[#BDDCEE]">
                  <div className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-foreground">
                    Order Financial Summary
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-xs font-normal">
                        {currentData.orderCount} order{currentData.orderCount !== 1 ? 's' : ''}
                      </span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOrderBreakdownOpen && "rotate-180"
                      )} />
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="divide-y divide-border/40">
                  <BreakdownRow label="Total Order Value" amount={currentData.totalOrderValue} />
                  <BreakdownRow label="Merchant Commission Fee" amount={currentData.merchantCommissionFee} negative />
                  <BreakdownRow label="Payment Processing Fee" amount={currentData.paymentFee} negative />
                  <BreakdownRow label="Merchant Subsidy" amount={currentData.merchantSubsidy} positive />
                  <BreakdownRow label="Subtotal" amount={earningsCurrent} subtotal />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Refund Breakdown — now includes Payment Fee Refund */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <Collapsible open={isRefundBreakdownOpen} onOpenChange={setIsRefundBreakdownOpen}>
              <CollapsibleTrigger asChild>
                <div className="w-full cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors border-l-4 border-l-[#BDDCEE]">
                  <div className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-foreground">
                    Refund Breakdown
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-xs font-normal">
                        {currentData.refundCount} refund{currentData.refundCount !== 1 ? 's' : ''}
                      </span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isRefundBreakdownOpen && "rotate-180"
                      )} />
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="divide-y divide-border/40">
                  <BreakdownRow label="Total Order Value Refund" amount={currentData.refunds.totalOrderValueRefund} negative />
                  <BreakdownRow label="Commission Fee Refund" amount={currentData.refunds.merchantCommissionFeeRefund} positive />
                  <BreakdownRow label="Payment Fee Refund" amount={currentData.refunds.paymentFeeRefund} positive />
                  <BreakdownRow label="Subsidy Refund" amount={currentData.refunds.merchantSubsidyRefund} negative />
                  <BreakdownRow label="Subtotal" amount={refundsCurrent} subtotal refundSubtotal />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Closing Balance — final summary row below the breakdowns */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-[#BDDCEE]/15 border border-[#BDDCEE]/40">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Closing Balance</p>
              <p className="text-xs text-muted-foreground mt-0.5">Net earnings after all fees and refunds</p>
            </div>
            <p className="text-base sm:text-xl font-bold text-foreground tabular-nums tracking-tight whitespace-nowrap flex-shrink-0">
              {formatCurrency(closingCurrent)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Modal — defaults to current period, no second pick */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>
              Download a finance statement for the period shown below.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 my-2 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Period</p>
            <p className="text-sm font-semibold text-foreground">
              {formatShortDate(currentData.startDate)} – {formatShortDate(currentData.endDate)}
            </p>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Closing Balance</span>
              <span className="font-bold text-foreground tabular-nums">{formatCurrency(closingCurrent)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmInvoiceGeneration} className="gap-2">
              <Download className="h-4 w-4" />
              Generate &amp; Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Breakdown row ──────────────────────────────────────────────────────

function BreakdownRow({
  label,
  amount,
  positive,
  negative,
  subtotal,
  refundSubtotal,
}: {
  label: string
  amount: number
  positive?: boolean
  negative?: boolean
  subtotal?: boolean
  refundSubtotal?: boolean
}) {
  const isZero = amount === 0
  const prefix = subtotal
    ? (refundSubtotal && amount > 0 ? '-' : '')
    : positive && amount > 0 ? '+' : negative && amount > 0 ? '-' : ''
  const colorClass = subtotal
    ? (refundSubtotal ? 'text-red-700' : 'text-foreground')
    : isZero
      ? 'text-muted-foreground'
      : positive
        ? 'text-emerald-700'
        : negative
          ? 'text-red-700'
          : 'text-foreground'
  return (
    <div className={cn(
      "px-5 py-3 flex justify-between items-center text-sm",
      subtotal ? "bg-muted/20 font-semibold" : "hover:bg-muted/10 transition-colors"
    )}>
      <span className={cn(subtotal ? "text-foreground" : "text-muted-foreground")}>{label}</span>
      <span className={cn("font-medium tabular-nums", colorClass, subtotal && "text-base")}>
        {prefix}Rs. {Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  )
}
