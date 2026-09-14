// @ts-nocheck
"use client"

import { useState, useMemo } from "react"
import { TrendingUp, TrendingDown, FileText } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import { cn } from "./ui/utils"
import { KPIDetailModal } from "./KPIDetailModal"

// ── Types ───────────────────────────────────────────────────────────────

interface DailyGMV {
  date: string
  gmv: number
  orders: number
  cancelledOrders: number
  pendingOrders: number
  successfulOrders: number
  averageOrderValue: number
}

interface KPIStat {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'neutral'
  type: 'payment' | 'orders' | 'cancelled' | 'pending'
  sparklineData?: number[]
}

// ── Data generator ──────────────────────────────────────────────────────

const generateDummyData = (period: 'daily' | 'weekly' | 'monthly', branch: string = 'all'): DailyGMV[] => {
  const data: DailyGMV[] = []
  const now = new Date()

  let dateIncrement = 1
  let maxDays = 30
  if (period === 'weekly') { dateIncrement = 7; maxDays = 84 }
  else if (period === 'monthly') { dateIncrement = 30; maxDays = 365 }

  const branchMultiplier = branch === 'all' ? 1 :
    branch === 'Main Branch' ? 1.2 :
    branch === 'Colombo Central' ? 1.0 :
    branch === 'Kandy Branch' ? 0.8 :
    branch === 'Galle Branch' ? 0.6 : 0.7

  const dataPointCount = Math.ceil(maxDays / dateIncrement) + 1
  const maxTotalGMV = 23
  const averageGMVPerPoint = maxTotalGMV / dataPointCount
  let dateCount = 0

  for (let i = maxDays; i >= 0; i -= dateIncrement) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
    const variationFactor = 0.3 + (Math.random() * 0.7)
    const seasonality = 1 + (Math.sin(dateCount * 0.1) * 0.2)
    let baseGMV = (averageGMVPerPoint * variationFactor * seasonality) * branchMultiplier
    const maxIndividualGMV = period === 'daily' ? 1.2 : period === 'weekly' ? 2.5 : 3.5
    baseGMV = Math.min(baseGMV, maxIndividualGMV)
    const gmv = Math.round(baseGMV * 1000000) / 1000000

    const totalOrders = Math.floor(Math.random() * 500 + 100) * branchMultiplier
    const successfulOrders = Math.floor(totalOrders * (0.75 + Math.random() * 0.2))
    const cancelledOrders = Math.floor(totalOrders * (Math.random() * 0.15))
    const pendingOrders = totalOrders - successfulOrders - cancelledOrders

    const monthName = date.toLocaleDateString('en-GB', { month: 'short' })
    const day = date.getDate()
    const weekNumber = Math.ceil((now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
    const year = date.getFullYear()

    data.push({
      date: period === 'monthly' ? `${monthName} ${year}` :
            period === 'weekly' ? `W${weekNumber}` :
            `${monthName} ${day}`,
      gmv,
      orders: Math.round(totalOrders),
      cancelledOrders: Math.max(0, cancelledOrders),
      pendingOrders: Math.max(0, pendingOrders),
      successfulOrders,
      averageOrderValue: Math.round((gmv * 1000000) / Math.max(1, totalOrders))
    })
    dateCount++
  }

  return data.reverse()
}

// ── Helpers ─────────────────────────────────────────────────────────────

function formatRsCompact(value: number): string {
  if (value >= 1) return `Rs. ${value.toFixed(2)}M`
  const rupees = Math.round(value * 1000000)
  if (rupees >= 1000) return `Rs. ${(rupees / 1000).toFixed(1)}K`
  return `Rs. ${rupees.toLocaleString()}`
}

function TrendPill({ trend, change }: { trend: 'up' | 'down' | 'neutral'; change: number }) {
  const isUp = trend === 'up'
  const isDown = trend === 'down'
  const styles = isUp
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isDown
    ? 'bg-red-50 text-red-700 border-red-200'
    : 'bg-muted text-muted-foreground border-border'
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
      styles
    )}>
      {isUp && <TrendingUp className="h-3 w-3" />}
      {isDown && <TrendingDown className="h-3 w-3" />}
      <span className="tabular-nums">
        {change > 0 ? '+' : ''}{change.toFixed(1)}%
      </span>
    </span>
  )
}

// ── Custom Active Dot (animated glow) ──────────────────────────────────

const CustomActiveDot = (props: any) => {
  const { cx, cy } = props
  if (cx == null || cy == null) return null
  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* Soft halo (glow) */}
      <circle cx={cx} cy={cy} r={14} fill="#9CA8E8" opacity={0.18} filter="url(#dotGlow)" />
      <circle cx={cx} cy={cy} r={10} fill="#9CA8E8" opacity={0.28} filter="url(#dotGlow)" />

      {/* Outward ripple 1 */}
      <circle cx={cx} cy={cy} r={6} fill="none" stroke="#9CA8E8" strokeWidth={1.2} opacity={0.7}>
        <animate attributeName="r" from="6" to="18" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.7" to="0" dur="1.6s" repeatCount="indefinite" />
      </circle>
      {/* Outward ripple 2 (offset) */}
      <circle cx={cx} cy={cy} r={6} fill="none" stroke="#C997DF" strokeWidth={1.2} opacity={0.5}>
        <animate attributeName="r" from="6" to="22" dur="1.6s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.5" to="0" dur="1.6s" begin="0.5s" repeatCount="indefinite" />
      </circle>

      {/* Inner solid dot */}
      <circle cx={cx} cy={cy} r={6} fill="#7DB1D5" stroke="#fff" strokeWidth={2.5} />
    </g>
  )
}

// ── Tooltip ─────────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-white border border-border/60 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
      <p className="text-base font-bold text-foreground tabular-nums">
        {formatRsCompact(data.gmv)}
      </p>
      <div className="mt-1 pt-1 border-t border-border/40 space-y-0.5">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{data.orders}</span> orders
        </p>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────

export function Analytics() {
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedKPI, setSelectedKPI] = useState<KPIStat | null>(null)
  const [showKPIModal, setShowKPIModal] = useState(false)

  const branches = ['Main Branch', 'Colombo Central', 'Kandy Branch', 'Galle Branch', 'Negombo Branch']

  const chartData = useMemo(() => generateDummyData(selectedPeriod, selectedBranch), [selectedBranch, selectedPeriod])

  const kpiStats = useMemo(() => {
    const totalGMV = chartData.reduce((sum, d) => sum + d.gmv, 0)
    const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0)
    const totalCancelled = chartData.reduce((sum, d) => sum + d.cancelledOrders, 0)
    const totalPending = chartData.reduce((sum, d) => sum + d.pendingOrders, 0)

    const midPoint = Math.floor(chartData.length / 2)
    const firstHalf = chartData.slice(0, midPoint)
    const secondHalf = chartData.slice(midPoint)

    const firstHalfGMV = firstHalf.reduce((sum, d) => sum + d.gmv, 0) || 1
    const secondHalfGMV = secondHalf.reduce((sum, d) => sum + d.gmv, 0)
    const gmvTrend = ((secondHalfGMV - firstHalfGMV) / firstHalfGMV) * 100

    const firstHalfOrders = firstHalf.reduce((sum, d) => sum + d.orders, 0) || 1
    const secondHalfOrders = secondHalf.reduce((sum, d) => sum + d.orders, 0)
    const ordersTrend = ((secondHalfOrders - firstHalfOrders) / firstHalfOrders) * 100

    const last7 = chartData.slice(-7)

    const stats: KPIStat[] = [
      {
        title: "Total Payment Value",
        value: `Rs. ${totalGMV.toFixed(2)}M`,
        change: gmvTrend,
        trend: gmvTrend > 0 ? 'up' : gmvTrend < 0 ? 'down' : 'neutral',
        type: 'payment',
        sparklineData: last7.map(d => d.gmv),
      },
      {
        title: "Total Orders",
        value: totalOrders.toLocaleString(),
        change: ordersTrend,
        trend: ordersTrend > 0 ? 'up' : ordersTrend < 0 ? 'down' : 'neutral',
        type: 'orders',
        sparklineData: last7.map(d => d.orders),
      },
      {
        title: "Cancelled Orders",
        value: totalCancelled.toLocaleString(),
        change: -5.2,
        trend: 'down',
        type: 'cancelled',
        sparklineData: last7.map(d => d.cancelledOrders),
      },
      {
        title: "Pending Orders",
        value: totalPending.toLocaleString(),
        change: 2.1,
        trend: 'up',
        type: 'pending',
        sparklineData: last7.map(d => d.pendingOrders),
      }
    ]

    return stats
  }, [chartData])

  const handleKPIClick = (stat: KPIStat) => {
    setSelectedKPI(stat)
    setShowKPIModal(true)
  }

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'daily': return 'Last 30 days'
      case 'weekly': return 'Last 12 weeks'
      case 'monthly': return 'Last 12 months'
      default: return 'Period'
    }
  }

  // ── Render ──

  return (
    <div className="space-y-5">

      {/* Header: title + compact filters */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance insights and key metrics for your business</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="h-9 w-auto min-w-[140px] text-sm bg-white">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map(branch => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
            <SelectTrigger className="h-9 w-auto min-w-[140px] text-sm bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Last 30 days</SelectItem>
              <SelectItem value="weekly">Last 12 weeks</SelectItem>
              <SelectItem value="monthly">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-9 gap-2 text-sm">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Generate PDF</span>
          </Button>
        </div>
      </div>

      {/* HERO: Payment Volume card — inline stats + area chart */}
      <Card className="rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">

          {/* Top section: all 4 stats inline, equal weight */}
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-start justify-between gap-4 mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Performance Overview
              </p>
              <div className="text-xs text-muted-foreground bg-muted/40 rounded-full px-3 py-1 border border-border/40 font-medium">
                {getPeriodLabel()}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
              {kpiStats.map((stat, i) => (
                <button
                  key={i}
                  onClick={() => handleKPIClick(stat)}
                  className="flex flex-col items-start text-left group min-w-0"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight mt-1.5 group-hover:opacity-80 transition-opacity truncate w-full">
                    {stat.value}
                  </p>
                  <div className="mt-2">
                    <TrendPill trend={stat.trend} change={stat.change} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Area chart — sized to fit viewport */}
          <div className="px-2 pt-6 pb-4">
            <div className="h-[22rem] lg:h-[24rem] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 12, right: 32, left: 24, bottom: 12 }}
                >
                  <defs>
                    <linearGradient id="kokoAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#BDDCEE" stopOpacity={0.7} />
                      <stop offset="50%" stopColor="#D4D8F8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#EDD8F8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="kokoLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7DB1D5" />
                      <stop offset="50%" stopColor="#9CA8E8" />
                      <stop offset="100%" stopColor="#C997DF" />
                    </linearGradient>

                    {/* Glow filter only for the active dot */}
                    <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    strokeOpacity={0.5}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    interval={selectedPeriod === 'daily' ? 3 : selectedPeriod === 'weekly' ? 1 : 0}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[0, 'dataMax + 0.5']}
                    tickFormatter={(value) => {
                      if (value < 1) {
                        const amount = Math.round(value * 1000000)
                        return `${(amount / 1000).toFixed(0)}K`
                      }
                      return `${value.toFixed(1)}M`
                    }}
                    width={50}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{
                      stroke: '#9CA8E8',
                      strokeWidth: 1,
                      strokeDasharray: '4 4',
                      strokeOpacity: 0.5,
                    }}
                  />
                  {/* Main line — sharp, straight segments */}
                  <Area
                    type="linear"
                    dataKey="gmv"
                    stroke="url(#kokoLineGradient)"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="url(#kokoAreaGradient)"
                    dot={false}
                    activeDot={<CustomActiveDot />}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 px-6 pt-2 pb-1">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#7DB1D5] to-[#C997DF]" />
              <span className="text-xs text-muted-foreground font-medium">Payment Volume</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Detail Modal */}
      {selectedKPI && (
        <KPIDetailModal
          isOpen={showKPIModal}
          onClose={() => setShowKPIModal(false)}
          kpiType={selectedKPI.type}
          value={selectedKPI.value}
          title={selectedKPI.title}
          trend={selectedKPI.trend}
          change={selectedKPI.change}
        />
      )}
    </div>
  )
}

