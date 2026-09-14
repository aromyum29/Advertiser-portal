// @ts-nocheck
"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Filter, Calendar, RefreshCw, Download, ChevronDown, ChevronRight, ChevronUp, Search, X, ArrowRight, ArrowLeft, MoreHorizontal } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar as CalendarComponent } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet"
import { Separator } from "./ui/separator"
import { cn } from "./ui/utils"


// Order status type (kept for filtering but not displayed)
type OrderStatus = 'successful' | 'pending' | 'cancelled' | 'refunded' | 'failed'

interface RefundEvent {
  amount: number
  date: string
  type: 'full' | 'partial'
}

// Order interface
interface Order {
  id: string
  orderNo: string
  merchantOrderId: string
  createdDate: string
  orderValue: number
  discountedValue: number
  merchantDiscount?: number
  customerName: string
  customerMobile: string
  referenceCode?: string
  createdBy: string
  branchName: string
  status: OrderStatus
  reason?: string
  refundedAmount?: number
  refundHistory?: RefundEvent[]
}

// Generate dummy data
const generateDummyOrders = (): Order[] => {
  const customers = [
    'Nuwan Perera', 'Saman Silva', 'Kamala Fernando', 'Priya Rajapaksa',
    'Asanka Wijesinghe', 'Malika Jayawardena', 'Ravi Gunasekara', 'Shani De Silva',
    'Chaminda Bandara', 'Amara Wickramasinghe', 'Dilshan Rathnayake', 'Sanduni Liyanage',
    'Thisara Mendis', 'Rashika Gunaratne', 'Lakmal Herath', 'Priyanka Amarasinghe',
    'Nipuna Weerasinghe', 'Thilanka Dissanayake', 'Isuru Chandrasiri', 'Amila Karunaratne',
    'Nirmal Kumara', 'Geethika Madushani', 'Ruwan Samaraweera', 'Kavinda Pathirana'
  ]

  const branches = ['Main Branch', 'Colombo Central', 'Kandy Branch', 'Galle Branch', 'Negombo Branch']
  const users = ['Admin User', 'John Doe', 'Sarah Smith', 'Mike Johnson', 'Lisa Wong']
  const statuses: OrderStatus[] = ['successful', 'pending', 'cancelled', 'refunded', 'failed']
  const refundReasons = [
    'Customer requested refund',
    'Item out of stock',
    'Payment processing error',
    'Duplicate order',
    'Quality issues reported',
    'Delivery failed',
    'Customer changed mind',
    'Technical system error'
  ]

  return Array.from({ length: 50 }, (_, i) => {
    const orderValue = Math.floor(Math.random() * 10000) + 100
    const discount = Math.floor(Math.random() * 500)
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    let refundedAmount: number | undefined = undefined
    let refundHistory: RefundEvent[] | undefined = undefined
    if (status === 'refunded') {
      const isFullRefund = Math.random() > 0.4
      if (isFullRefund) {
        refundedAmount = orderValue
        refundHistory = [{
          amount: orderValue,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'full'
        }]
      } else {
        const partialCount = 1 + Math.floor(Math.random() * 2)
        refundHistory = []
        let totalSoFar = 0
        for (let p = 0; p < partialCount; p++) {
          const remaining = orderValue - totalSoFar
          const amt = Math.floor(remaining * (0.3 + Math.random() * 0.4))
          refundHistory.push({
            amount: amt,
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'partial'
          })
          totalSoFar += amt
        }
        refundedAmount = totalSoFar
      }
    }

    // ~55% of orders have a merchant-applied discount; others may still have payment-method discount baked into discountedValue
    const hasMerchantDiscount = Math.random() > 0.45
    const merchantDiscount = hasMerchantDiscount ? Math.floor(50 + Math.random() * 300) : undefined

    return {
      id: `order_${i + 1}`,
      orderNo: `KK${String(i + 1).padStart(6, '0')}`,
      merchantOrderId: `M${String(i + 1).padStart(8, '0')}`,
      createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      orderValue: orderValue,
      discountedValue: orderValue - discount,
      merchantDiscount,
      customerName: customer,
      customerMobile: `77${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      referenceCode: Math.random() > 0.3 ? `REF${String(i + 1).padStart(4, '0')}` : undefined,
      createdBy: users[Math.floor(Math.random() * users.length)],
      branchName: branches[Math.floor(Math.random() * branches.length)],
      status: status,
      reason: (status === 'refunded' || status === 'cancelled' || status === 'failed') ?
        refundReasons[Math.floor(Math.random() * refundReasons.length)] : undefined,
      refundedAmount: refundedAmount,
      refundHistory: refundHistory
    }
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────

const STATUS_META: Record<OrderStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  successful: { label: 'Successful', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  pending:    { label: 'Pending',    dot: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  cancelled:  { label: 'Cancelled',  dot: 'bg-gray-400',    bg: 'bg-gray-100',   text: 'text-gray-700',    border: 'border-gray-200' },
  refunded:   { label: 'Refunded',   dot: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  failed:     { label: 'Failed',     dot: 'bg-red-500',     bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
}

const PARTIAL_REFUND_META = {
  label: 'Partial Refund',
  dot: 'bg-orange-500',
  bg: 'bg-orange-50',
  text: 'text-orange-700',
  border: 'border-orange-200',
}

function totalRefunded(order: Order): number {
  if (order.refundHistory && order.refundHistory.length) {
    return order.refundHistory.reduce((s, r) => s + r.amount, 0)
  }
  return order.refundedAmount || 0
}

function isPartiallyRefunded(order: Order): boolean {
  if (order.status !== 'refunded') return false
  return totalRefunded(order) < order.orderValue
}

function DetailRow({ label, value, mono, bold, highlight }: { label: string; value: string; mono?: boolean; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between py-3", highlight && "bg-muted/30 px-3 -mx-3 rounded-lg")}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn(
        "text-sm text-foreground",
        bold && "font-semibold",
        mono && "font-mono text-xs"
      )}>
        {value}
      </span>
    </div>
  )
}

function StatusPill({ status, order }: { status?: OrderStatus; order?: Order }) {
  // If an order is passed and is partially refunded, override label/colors
  const meta = order && isPartiallyRefunded(order)
    ? PARTIAL_REFUND_META
    : STATUS_META[status || order?.status || 'pending']
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
      meta.bg, meta.text, meta.border
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface OrdersProps {
  initialTab?: string | null
  onTabChange?: () => void
}

export function Orders({ initialTab, onTabChange }: OrdersProps = {}) {
  const [orders, setOrders] = useState<Order[]>(generateDummyOrders())

  // Filter states
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('successful')
  const [branchFilter, setBranchFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [identifierType, setIdentifierType] = useState<string>('')
  const [identifierSearch, setIdentifierSearch] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

  // Pagination
  const [successfulPage, setSuccessfulPage] = useState(1)
  const [pendingPage, setPendingPage] = useState(1)
  const [cancelledPage, setCancelledPage] = useState(1)
  const [refundedPage, setRefundedPage] = useState(1)
  const [failedPage, setFailedPage] = useState(1)

  // Sorting
  const [sortField, setSortField] = useState<keyof Order>('createdDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Scroll state
  const tableScrollRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState<'start' | 'middle' | 'end'>('start')

  // Modals
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
  const [selectedRefundOrder, setSelectedRefundOrder] = useState<Order | null>(null)
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full')
  const [partialAmount, setPartialAmount] = useState<string>('')

  // Cancel-payment confirmation
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelTargetOrder, setCancelTargetOrder] = useState<Order | null>(null)

  // Refund "Are you sure?" confirmation (shown after the Process Refund button)
  const [isRefundConfirmOpen, setIsRefundConfirmOpen] = useState(false)
  const [pendingRefundAmount, setPendingRefundAmount] = useState<number>(0)

  // Side drawer for row details
  const [drawerOrder, setDrawerOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Unique values for filters
  const uniqueBranches = useMemo(() =>
    Array.from(new Set(orders.map(order => order.branchName))).sort()
  , [orders])

  const uniqueUsers = useMemo(() =>
    Array.from(new Set(orders.map(order => order.createdBy))).sort()
  , [orders])

  useEffect(() => {
    if (initialTab && ['successful', 'pending', 'cancelled', 'refunded', 'failed'].includes(initialTab)) {
      setStatusFilter(initialTab as OrderStatus)
      onTabChange?.()
    }
  }, [initialTab, onTabChange])

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (branchFilter !== 'all') count++
    if (userFilter !== 'all') count++
    if (dateFilter !== 'all') count++
    if (identifierType) count++
    return count
  }, [branchFilter, userFilter, dateFilter, identifierType])

  // Filter + sort
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (branchFilter !== 'all' && order.branchName !== branchFilter) return false
      if (userFilter !== 'all' && order.createdBy !== userFilter) return false
      if (identifierType && identifierSearch.trim() !== '') {
        const searchTerm = identifierSearch.toLowerCase().trim()
        switch (identifierType) {
          case 'koko-id': if (!order.orderNo.toLowerCase().includes(searchTerm)) return false; break
          case 'merchant-order-id': if (!order.merchantOrderId.toLowerCase().includes(searchTerm)) return false; break
          case 'mobile-number': if (!order.customerMobile.toLowerCase().includes(searchTerm)) return false; break
          case 'reference-code': if (!order.referenceCode?.toLowerCase().includes(searchTerm)) return false; break
        }
      }
      if (dateFilter !== 'all') {
        const orderDate = new Date(order.createdDate)
        const today = new Date()
        const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
        switch (dateFilter) {
          case 'today': if (daysDiff !== 0) return false; break
          case 'week': if (daysDiff > 7) return false; break
          case 'month': if (daysDiff > 30) return false; break
          case 'custom': {
            const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate())
            if (startDate) {
              const start = new Date(startDate)
              if (orderDateOnly < start) return false
            }
            if (endDate) {
              const end = new Date(endDate)
              if (orderDateOnly > end) return false
            }
            break
          }
        }
      }
      return true
    })

    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }
      if (sortDirection === 'asc') return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    })

    return filtered
  }, [orders, statusFilter, branchFilter, userFilter, identifierType, identifierSearch, dateFilter, startDate, endDate, sortField, sortDirection])

  // Tab-specific pagination
  const currentTabData = useMemo(() => {
    const totalItems = filteredAndSortedOrders.length
    const itemsPerPage = 10
    let currentPage: number
    let setCurrentPage: (page: number) => void
    switch (statusFilter) {
      case 'successful': currentPage = successfulPage; setCurrentPage = setSuccessfulPage; break
      case 'pending':    currentPage = pendingPage;    setCurrentPage = setPendingPage; break
      case 'cancelled':  currentPage = cancelledPage;  setCurrentPage = setCancelledPage; break
      case 'refunded':   currentPage = refundedPage;   setCurrentPage = setRefundedPage; break
      case 'failed':     currentPage = failedPage;     setCurrentPage = setFailedPage; break
      default:           currentPage = 1; setCurrentPage = () => {}
    }
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedOrders = filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage)
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1)
    return { currentPage, setCurrentPage, totalPages, itemsPerPage, paginatedOrders, totalItems }
  }, [filteredAndSortedOrders, statusFilter, successfulPage, pendingPage, cancelledPage, refundedPage, failedPage])

  const { currentPage, setCurrentPage, totalPages, paginatedOrders, totalItems } = currentTabData

  const handleSort = (field: keyof Order) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDirection('desc') }
  }

  const handleRefund = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedRefundOrder(order)
    setRefundType('full')
    setPartialAmount('')
    setIsRefundModalOpen(true)
  }

  // Step 1: user clicked "Process Refund" — validate and open the confirmation dialog
  const requestRefundConfirm = () => {
    if (!selectedRefundOrder) return
    const order = selectedRefundOrder
    const alreadyRefunded = totalRefunded(order)
    const remaining = order.orderValue - alreadyRefunded
    const amount = refundType === 'full'
      ? remaining
      : Math.min(parseFloat(partialAmount) || 0, remaining)
    if (amount <= 0) return
    setPendingRefundAmount(amount)
    setIsRefundConfirmOpen(true)
  }

  // Step 2: user confirmed in the "Are you sure?" dialog — actually issue the refund
  const executeRefund = () => {
    if (!selectedRefundOrder) return
    const order = selectedRefundOrder
    const amount = pendingRefundAmount
    if (amount <= 0) return

    const newEvent: RefundEvent = {
      amount,
      date: new Date().toISOString(),
      type: refundType,
    }

    const newHistory: RefundEvent[] = [...(order.refundHistory || []), newEvent]
    const newTotalRefunded = newHistory.reduce((s, r) => s + r.amount, 0)
    const isNowFullyRefunded = newTotalRefunded >= order.orderValue

    setOrders(prev => prev.map(o => o.id === order.id ? {
      ...o,
      status: 'refunded',
      refundHistory: newHistory,
      refundedAmount: newTotalRefunded,
    } : o))

    const toastEvent = new CustomEvent('show-toast', {
      detail: {
        type: 'success',
        title: isNowFullyRefunded ? 'Refund Completed' : 'Partial Refund Processed',
        description: `Rs. ${amount.toLocaleString()} refunded for ${order.orderNo}.${!isNowFullyRefunded ? ` Rs. ${(order.orderValue - newTotalRefunded).toLocaleString()} remaining.` : ''}`
      }
    })
    window.dispatchEvent(toastEvent)

    setIsRefundConfirmOpen(false)
    setPendingRefundAmount(0)
    setIsRefundModalOpen(false)
    setSelectedRefundOrder(null)
    setRefundType('full')
    setPartialAmount('')
  }

  const handleCancelPayment = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    setCancelTargetOrder(order)
    setIsCancelModalOpen(true)
  }

  const confirmCancelPayment = () => {
    if (!cancelTargetOrder) return
    const order = cancelTargetOrder
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o))
    const toastEvent = new CustomEvent('show-toast', {
      detail: { type: 'success', title: 'Payment Request Cancelled', description: `Payment request for order ${order.orderNo} has been cancelled.` }
    })
    window.dispatchEvent(toastEvent)
    setIsCancelModalOpen(false)
    setCancelTargetOrder(null)
  }

  const handleRowClick = (order: Order) => {
    setDrawerOrder(order)
    setIsDrawerOpen(true)
  }

  // Columns per tab
  type ColumnDef = { key: string; label: string; sortable: boolean; align?: 'left' | 'right' | 'center' }
  const getColumnsForTab = (status: OrderStatus | 'all'): ColumnDef[] => {
    const baseLeft: ColumnDef[] = [
      { key: 'createdDate', label: 'Date & time', sortable: true, align: 'center' },
      { key: 'orderNo', label: 'Order no.', sortable: true, align: 'center' },
      { key: 'orderValue', label: 'Order value', sortable: true, align: 'center' },
      { key: 'discountedValue', label: 'Order value post discount', sortable: true, align: 'center' },
      { key: 'merchantDiscount', label: 'Merchant discount', sortable: false, align: 'center' },
    ]
    const customerCol: ColumnDef = { key: 'customerName', label: 'Customer', sortable: true, align: 'center' }
    const refCol: ColumnDef = { key: 'referenceCode', label: 'Reference', sortable: false, align: 'center' }
    const statusCol: ColumnDef = { key: 'status', label: 'Status', sortable: false, align: 'center' }

    switch (status) {
      case 'successful':
        return [...baseLeft,
          statusCol, customerCol, refCol,
          { key: 'branchName', label: 'Branch', sortable: true, align: 'center' },
          { key: 'merchantOrderId', label: 'Merchant Order ID', sortable: true, align: 'center' },
          { key: 'actions', label: 'Action', sortable: false, align: 'center' }
        ]
      case 'refunded':
        return [...baseLeft,
          { key: 'refundedAmount', label: 'Amount refunded', sortable: true, align: 'center' },
          statusCol, customerCol, refCol
        ]
      case 'pending':
        return [...baseLeft, statusCol, customerCol, refCol,
          { key: 'actions', label: 'Action', sortable: false, align: 'center' }
        ]
      case 'failed':
        return [...baseLeft, statusCol, customerCol, refCol]
      case 'cancelled':
        return [...baseLeft, statusCol, customerCol, refCol]
      default:
        return [...baseLeft, statusCol, customerCol]
    }
  }

  const currentColumns = getColumnsForTab(statusFilter)
  const hasActionsColumn = currentColumns.some(c => c.key === 'actions')

  const resetFilters = () => {
    setStatusFilter('successful')
    setBranchFilter('all')
    setUserFilter('all')
    setIdentifierType('')
    setIdentifierSearch('')
    setDateFilter('all')
    setStartDate('')
    setEndDate('')
    setSuccessfulPage(1); setPendingPage(1); setCancelledPage(1); setRefundedPage(1); setFailedPage(1)
    setIsFiltersExpanded(false)
  }

  // ── Scroll affordance: detect position + auto-scroll buttons ─────────────
  const handleScroll = () => {
    if (!tableScrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = tableScrollRef.current
    const atStart = scrollLeft <= 5
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 5
    setScrollState(atStart ? 'start' : atEnd ? 'end' : 'middle')
  }

  useEffect(() => {
    // recompute on tab change
    setTimeout(handleScroll, 50)
  }, [statusFilter, paginatedOrders.length])

  const scrollToActions = () => {
    if (!tableScrollRef.current) return
    tableScrollRef.current.scrollTo({ left: tableScrollRef.current.scrollWidth, behavior: 'smooth' })
  }

  const scrollToStart = () => {
    if (!tableScrollRef.current) return
    tableScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
  }

  // Filter chip helper
  const renderFilterChip = (label: string, value: string, onRemove: () => void) => (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200">
      <span className="text-gray-500">{label}:</span>
      <span>{value}</span>
      <button
        onClick={onRemove}
        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )

  const dateFilterLabel = (() => {
    if (dateFilter === 'today') return 'Today'
    if (dateFilter === 'week') return 'This Week'
    if (dateFilter === 'month') return 'This Month'
    if (dateFilter === 'custom') {
      if (startDate && endDate) return `${new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
      if (startDate) return `From ${new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
      if (endDate) return `Until ${new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
    }
    return ''
  })()

  const hasActiveChips = branchFilter !== 'all' || userFilter !== 'all' || dateFilter !== 'all' || (identifierType && identifierSearch.trim() !== '')

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 min-w-0 relative">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage all payment orders</p>
        </div>
        <Button variant="outline" className="h-10 gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>

      {/* Status Tabs (moved above filters per IA hierarchy) */}
      <div className="border-b">
        <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
          {(['successful', 'pending', 'cancelled', 'refunded', 'failed'] as OrderStatus[]).map(status => {
            const tabCount = orders.filter(o => o.status === status).length
            const isActive = statusFilter === status
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "pb-3 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 text-sm",
                  isActive ? "border-gray-900 text-gray-900 font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {STATUS_META[status].label}
                <span className={cn(
                  "text-xs rounded-full px-1.5 py-0.5 leading-none",
                  isActive ? "bg-gray-900 text-white" : "bg-muted text-muted-foreground"
                )}>
                  {tabCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main filter row — identifier-driven search + More Filters */}
      <div className="flex flex-wrap items-stretch gap-3 min-w-0">
        {/* Identifier type dropdown */}
        <div className="w-full sm:w-[220px] sm:flex-shrink-0">
          <Select value={identifierType} onValueChange={(v) => { setIdentifierType(v); if (!v) setIdentifierSearch('') }}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="Search by…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="koko-id">Koko ID</SelectItem>
              <SelectItem value="merchant-order-id">Merchant Order ID</SelectItem>
              <SelectItem value="mobile-number">Customer Mobile Number</SelectItem>
              <SelectItem value="reference-code">Reference Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Identifier value input */}
        <div className="relative flex-1 min-w-0 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={
              identifierType === 'koko-id' ? 'Enter Koko ID' :
              identifierType === 'merchant-order-id' ? 'Enter Merchant Order ID' :
              identifierType === 'mobile-number' ? 'Enter mobile number' :
              identifierType === 'reference-code' ? 'Enter reference code' :
              'Select identifier type first'
            }
            value={identifierSearch}
            onChange={(e) => setIdentifierSearch(e.target.value)}
            disabled={!identifierType}
            className="w-full h-10 pl-9 pr-9 rounded-lg border border-border/60 bg-input-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {identifierSearch && (
            <button
              onClick={() => setIdentifierSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* More Filters */}
        <Button
          variant="outline"
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="h-10 gap-2 flex-shrink-0"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">More Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-gray-900 text-white rounded-full text-xs px-1.5 py-0.5 leading-none">
              {activeFilterCount}
            </span>
          )}
          {isFiltersExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        <div className="text-sm text-muted-foreground flex-shrink-0 hidden sm:flex items-center">
          {paginatedOrders.length} of {totalItems}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveChips && (
        <div className="flex flex-wrap items-center gap-2">
          {branchFilter !== 'all' && renderFilterChip('Branch', branchFilter, () => setBranchFilter('all'))}
          {userFilter !== 'all' && renderFilterChip('Created by', userFilter, () => setUserFilter('all'))}
          {dateFilter !== 'all' && renderFilterChip('Date', dateFilterLabel, () => { setDateFilter('all'); setStartDate(''); setEndDate('') })}
          <button
            onClick={resetFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline ml-1 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Collapsible More Filters Panel — only date, branch, user */}
      {isFiltersExpanded && (
        <div className="rounded-xl border border-border/60 animate-in slide-in-from-top-2 duration-200">
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">More Filters</h3>
              <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1.5 h-8 text-xs">
                <RefreshCw className="h-3 w-3" />
                Reset All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-800">Start date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 justify-start font-normal gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="text-muted-foreground">Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate ? new Date(startDate) : undefined}
                      onSelect={(date) => {
                        const s = date ? date.toISOString().split('T')[0] : ''
                        setStartDate(s)
                        setDateFilter(s || endDate ? 'custom' : 'all')
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-800">End date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 justify-start font-normal gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {endDate ? new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : <span className="text-muted-foreground">Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate ? new Date(endDate) : undefined}
                      onSelect={(date) => {
                        const e = date ? date.toISOString().split('T')[0] : ''
                        setEndDate(e)
                        setDateFilter(startDate || e ? 'custom' : 'all')
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-800">Branch</label>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="All Branches" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {uniqueBranches.map(branch => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-800">Created by</label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="All Users" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table with scroll affordance — desktop */}
      <div className="hidden md:block bg-card border border-border/60 rounded-xl overflow-hidden">
        {/* Scroll hint bar */}
        {hasActionsColumn && scrollState !== 'end' && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/60 bg-muted/20 text-xs text-muted-foreground">
            <MoreHorizontal className="h-3.5 w-3.5" />
            <span>More columns available. Scroll to the right.</span>
          </div>
        )}

        {/* Scrollable table region */}
        <div className="relative">
          {/* Right edge fade indicator when more content available */}
          {scrollState !== 'end' && (
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent z-10" />
          )}
          {scrollState !== 'start' && (
            <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-card to-transparent z-10" />
          )}

          <div
            ref={tableScrollRef}
            onScroll={handleScroll}
            className="w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground"
          >
            <table className={cn("w-full table-fixed border-separate border-spacing-0", hasActionsColumn && "min-w-[1100px]")}>
              <thead className="bg-muted/40">
                <tr>
                  {currentColumns.map((column) => {
                    const isSorted = sortField === column.key
                    // Uniform column width per type for consistent rhythm
                    const widthClass =
                      column.key === 'createdDate' ? 'w-[170px]' :
                      column.key === 'orderNo' ? 'w-[130px]' :
                      column.key === 'orderValue' || column.key === 'discountedValue' || column.key === 'refundedAmount' ? 'w-[180px]' :
                      column.key === 'merchantDiscount' ? 'w-[150px]' :
                      column.key === 'status' ? 'w-[150px]' :
                      column.key === 'customerName' ? 'w-[230px]' :
                      column.key === 'referenceCode' ? 'w-[130px]' :
                      column.key === 'branchName' ? 'w-[150px]' :
                      column.key === 'merchantOrderId' ? 'w-[170px]' :
                      column.key === 'actions' ? 'w-[150px]' :
                      'w-auto'
                    return (
                      <th
                        key={column.key}
                        className={cn(
                          "px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground leading-tight align-top border-b border-border/60",
                          widthClass,
                          column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left',
                          "first:text-left last:text-right"
                        )}
                      >
                        {column.sortable ? (
                          <button
                            onClick={() => handleSort(column.key as keyof Order)}
                            className={cn(
                              "inline-flex items-start gap-1 uppercase tracking-wider leading-tight text-center hover:text-foreground transition-colors",
                              isSorted && "text-foreground"
                            )}
                          >
                            {column.label}
                            {isSorted && (
                              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        ) : (
                          column.label
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={currentColumns.length} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Search className="h-8 w-8 opacity-30" />
                        <div>
                          <p className="text-sm font-medium">No orders found</p>
                          <p className="text-xs mt-0.5">Try adjusting your search or filters</p>
                        </div>
                        <button onClick={resetFilters} className="text-xs text-gray-700 hover:underline mt-1">
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleRowClick(order)}
                    className="group cursor-pointer transition-all duration-150 hover:relative hover:z-10 [&:hover>td]:bg-white [&:hover>td]:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                  >
                    {currentColumns.map((column) => {
                      const align = column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                      const baseCell = `px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 transition-all duration-150 ${align} first:text-left last:text-right`
                      switch (column.key) {
                        case 'createdDate':
                          return (
                            <td key={column.key} className={cn(baseCell, "text-foreground font-medium")}>
                              <span className="block tabular-nums">{new Date(order.createdDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                              <span className="block text-xs text-muted-foreground tabular-nums mt-0.5">{new Date(order.createdDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                            </td>
                          )
                        case 'orderNo':
                          return <td key={column.key} className={cn(baseCell, "text-foreground font-medium")}>{order.orderNo}</td>
                        case 'orderValue':
                          return <td key={column.key} className={cn(baseCell, "text-foreground font-medium tabular-nums")}>Rs. {order.orderValue.toLocaleString()}</td>
                        case 'discountedValue':
                          return <td key={column.key} className={cn(baseCell, "text-foreground font-medium tabular-nums")}>Rs. {order.discountedValue.toLocaleString()}</td>
                        case 'merchantDiscount':
                          return (
                            <td key={column.key} className={cn(baseCell, "text-foreground font-medium tabular-nums")}>
                              {order.merchantDiscount ? `Rs. ${order.merchantDiscount.toLocaleString()}` : '-'}
                            </td>
                          )
                        case 'refundedAmount':
                          return <td key={column.key} className={cn(baseCell, "text-foreground font-medium tabular-nums")}>Rs. {order.refundedAmount?.toLocaleString() || '0'}</td>
                        case 'status':
                          return <td key={column.key} className={baseCell}><StatusPill order={order} /></td>
                        case 'customerName':
                          return (
                            <td key={column.key} className={baseCell}>
                              <div className="text-sm font-medium text-foreground">{order.customerName}</div>
                              <div className="text-sm font-medium text-foreground tabular-nums mt-0.5">+94 {order.customerMobile}</div>
                            </td>
                          )
                        case 'referenceCode':
                          return <td key={column.key} className={cn(baseCell, "text-foreground font-medium")}>{order.referenceCode || '-'}</td>
                        case 'branchName':
                          return <td key={column.key} className={cn(baseCell, "text-foreground font-medium")}>{order.branchName}</td>
                        case 'merchantOrderId':
                          return <td key={column.key} className={cn(baseCell, "text-foreground font-medium")}>{order.merchantOrderId}</td>
                        case 'actions':
                          return (
                            <td key={column.key} className={baseCell}>
                              {statusFilter === 'successful' && (
                                <Button size="sm" onClick={(e) => handleRefund(order, e)} className="h-8 px-3 text-xs">
                                  Refund
                                </Button>
                              )}
                              {statusFilter === 'pending' && (
                                <Button size="sm" variant="outline" onClick={(e) => handleCancelPayment(order, e)} className="h-8 px-3 text-xs text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800">
                                  Cancel request
                                </Button>
                              )}
                            </td>
                          )
                        default:
                          return <td key={column.key} className={baseCell}></td>
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Orders — mobile card list */}
      <div className="md:hidden flex flex-col gap-3">
        {paginatedOrders.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-xl p-8 flex flex-col items-center gap-3 text-muted-foreground">
            <Search className="h-8 w-8 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-medium">No orders found</p>
              <p className="text-xs mt-0.5">Try adjusting your search or filters</p>
            </div>
            <button onClick={resetFilters} className="text-xs text-gray-700 hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          paginatedOrders.map((order) => {
            const hasAction = statusFilter === 'successful' || statusFilter === 'pending'
            return (
              <div
                key={order.id}
                role="button"
                tabIndex={0}
                onClick={() => handleRowClick(order)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick(order) } }}
                className="bg-card border border-border/60 rounded-xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-foreground/20 active:scale-[0.995]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-base font-semibold text-foreground break-all">{order.orderNo}</span>
                    <span className="text-xs text-muted-foreground mt-1 tabular-nums">
                      {new Date(order.createdDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {new Date(order.createdDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <StatusPill order={order} />
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {statusFilter === 'refunded' ? 'Refunded' : 'Order value post discount'}
                  </span>
                  <span className="text-lg font-semibold text-foreground tabular-nums">
                    Rs. {(statusFilter === 'refunded' ? (order.refundedAmount || 0) : order.discountedValue).toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-border/40 pt-3 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Order value</span>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      Rs. {order.orderValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Merchant discount</span>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      {order.merchantDiscount ? `Rs. ${order.merchantDiscount.toLocaleString()}` : '-'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Customer</span>
                    <span className="text-sm font-medium text-foreground text-right break-words max-w-[65%]">{order.customerName}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Mobile</span>
                    <span className="text-base font-semibold text-foreground tabular-nums">+94 {order.customerMobile}</span>
                  </div>
                  {order.referenceCode && (
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Reference</span>
                      <span className="text-sm font-medium text-foreground break-all max-w-[65%] text-right">{order.referenceCode}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/40 pt-3 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  <span>Tap for full details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>

                {hasAction && (
                  <div onClick={(e) => e.stopPropagation()}>
                    {statusFilter === 'successful' && (
                      <Button size="sm" onClick={(e) => handleRefund(order, e)} className="h-10 text-sm w-full">
                        Refund
                      </Button>
                    )}
                    {statusFilter === 'pending' && (
                      <Button size="sm" variant="outline" onClick={(e) => handleCancelPayment(order, e)} className="h-10 text-sm w-full text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800">
                        Cancel request
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 px-3 text-xs">
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {(() => {
                const pages = []
                const showEllipsis = totalPages > 7
                if (!showEllipsis) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                      <Button key={i} variant={currentPage === i ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(i)} className="h-8 w-8 p-0 text-xs">
                        {i}
                      </Button>
                    )
                  }
                } else {
                  pages.push(
                    <Button key={1} variant={currentPage === 1 ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(1)} className="h-8 w-8 p-0 text-xs">1</Button>
                  )
                  if (currentPage > 4) pages.push(<span key="le" className="px-1 text-xs text-muted-foreground">…</span>)
                  const startPage = Math.max(2, Math.min(currentPage - 1, totalPages - 4))
                  const endPage = Math.min(totalPages - 1, Math.max(currentPage + 1, 5))
                  for (let i = startPage; i <= endPage; i++) {
                    if (i !== 1 && i !== totalPages) {
                      pages.push(
                        <Button key={i} variant={currentPage === i ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(i)} className="h-8 w-8 p-0 text-xs">{i}</Button>
                      )
                    }
                  }
                  if (currentPage < totalPages - 3) pages.push(<span key="re" className="px-1 text-xs text-muted-foreground">…</span>)
                  if (totalPages > 1) {
                    pages.push(
                      <Button key={totalPages} variant={currentPage === totalPages ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(totalPages)} className="h-8 w-8 p-0 text-xs">{totalPages}</Button>
                    )
                  }
                }
                return pages
              })()}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 px-3 text-xs">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Order Details Side Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg p-0 gap-0 flex flex-col"
        >
          {drawerOrder && (
            <>
              {/* Header */}
              <div className="px-6 pt-6 pb-5 border-b border-border/60">
                <div className="flex items-start justify-between gap-4 mb-3 pr-8">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Order</p>
                    <SheetTitle className="text-xl font-bold font-mono">{drawerOrder.orderNo}</SheetTitle>
                  </div>
                  <StatusPill order={drawerOrder} />
                </div>
                <SheetDescription className="text-xs text-muted-foreground">
                  Created {formatRelativeTime(drawerOrder.createdDate)} ·{' '}
                  {new Date(drawerOrder.createdDate).toLocaleString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </SheetDescription>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Amount card */}
                <div className="rounded-xl bg-muted/40 border border-border/40 p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                    Order value post discount
                  </p>
                  <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
                    Rs. {drawerOrder.discountedValue.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <span className="text-xs text-muted-foreground">Order value (gross)</span>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      Rs. {drawerOrder.orderValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                    <span className="text-xs text-muted-foreground">Merchant discount</span>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      {drawerOrder.merchantDiscount ? `Rs. ${drawerOrder.merchantDiscount.toLocaleString()}` : '-'}
                    </span>
                  </div>
                  {drawerOrder.status === 'refunded' && (
                    <>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                        <span className="text-xs text-blue-700 font-medium">Amount refunded</span>
                        <span className="text-sm font-semibold text-blue-700 tabular-nums">
                          Rs. {totalRefunded(drawerOrder).toLocaleString()}
                        </span>
                      </div>
                      {isPartiallyRefunded(drawerOrder) && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                          <span className="text-xs text-orange-700 font-medium">Remaining refundable</span>
                          <span className="text-sm font-semibold text-orange-700 tabular-nums">
                            Rs. {(drawerOrder.orderValue - totalRefunded(drawerOrder)).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Refund History (for partial/refunded orders) */}
                {drawerOrder.refundHistory && drawerOrder.refundHistory.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                      Refund History
                    </p>
                    <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
                      {drawerOrder.refundHistory.map((r, idx) => (
                        <div key={idx} className="flex justify-between items-center px-4 py-3 text-sm">
                          <div>
                            <p className="text-foreground font-medium">
                              {r.type === 'full' ? 'Full refund' : `Partial refund #${idx + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(r.date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <span className="font-semibold text-blue-700 tabular-nums">
                            Rs. {r.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer section */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                    Customer
                  </p>
                  <div className="rounded-xl border border-border/40 bg-card p-4 space-y-1">
                    <p className="text-sm font-semibold text-foreground">{drawerOrder.customerName}</p>
                    <p className="text-base font-semibold text-foreground tabular-nums">+94 {drawerOrder.customerMobile}</p>
                  </div>
                </div>

                {/* Order details */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                    Order Details
                  </p>
                  <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Date & time</span>
                      <span className="text-foreground font-medium tabular-nums">
                        {new Date(drawerOrder.createdDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Order no.</span>
                      <span className="font-medium text-foreground">{drawerOrder.orderNo}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Merchant Order ID</span>
                      <span className="font-medium text-foreground">{drawerOrder.merchantOrderId}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Reference code</span>
                      <span className="font-medium text-foreground">
                        {drawerOrder.referenceCode || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Branch</span>
                      <span className="text-foreground font-medium">{drawerOrder.branchName}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Created by</span>
                      <span className="text-foreground font-medium">{drawerOrder.createdBy}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <StatusPill order={drawerOrder} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky action footer */}
              {(drawerOrder.status === 'successful' || drawerOrder.status === 'pending' || isPartiallyRefunded(drawerOrder)) && (
                <div className="border-t border-border/60 px-6 py-4 bg-muted/20">
                  {(drawerOrder.status === 'successful' || isPartiallyRefunded(drawerOrder)) && (
                    <Button
                      onClick={(e) => { setIsDrawerOpen(false); handleRefund(drawerOrder, e) }}
                      className="w-full h-11"
                    >
                      {isPartiallyRefunded(drawerOrder) ? 'Process Another Refund' : 'Process Refund'}
                    </Button>
                  )}
                  {drawerOrder.status === 'pending' && (
                    <Button
                      variant="outline"
                      onClick={(e) => { setIsDrawerOpen(false); handleCancelPayment(drawerOrder, e) }}
                      className="w-full h-11 text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800"
                    >
                      Cancel Payment Request
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Refund Modal */}
      <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden" aria-describedby="refund-description">
          {selectedRefundOrder && (() => {
            const alreadyRefunded = totalRefunded(selectedRefundOrder)
            const remaining = selectedRefundOrder.orderValue - alreadyRefunded
            const parsedPartial = parseFloat(partialAmount) || 0
            const isPartialValid = refundType === 'partial' && parsedPartial > 0 && parsedPartial <= remaining
            const canProcess = refundType === 'full' ? remaining > 0 : isPartialValid

            return (
              <>
                {/* Header */}
                <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/60 bg-muted/30">
                  <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Refund Order
                  </DialogTitle>
                  <DialogDescription id="refund-description" className="sr-only">
                    Process a full or partial refund for this order.
                  </DialogDescription>
                </DialogHeader>

                {/* Order details */}
                <div className="px-6 py-5 space-y-4">
                  <div className="divide-y divide-border/40">
                    <DetailRow label="Name" value={selectedRefundOrder.customerName} />
                    <DetailRow label="Mobile Number" value={`+94 ${selectedRefundOrder.customerMobile}`} />
                    <DetailRow label="Date" value={new Date(selectedRefundOrder.createdDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                    <DetailRow label="Order" value={selectedRefundOrder.orderNo} mono />
                    <DetailRow
                      label="Order Value"
                      value={`Rs. ${selectedRefundOrder.orderValue.toLocaleString()}`}
                      highlight
                      bold
                    />
                    <DetailRow
                      label="Amount refunded"
                      value={`Rs. ${alreadyRefunded.toLocaleString()}`}
                    />
                    <DetailRow
                      label="Order Value post Refunds"
                      value={`Rs. ${remaining.toLocaleString()}`}
                      bold
                    />
                  </div>

                  {/* Refund type selector */}
                  <div className="pt-2">
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="refundType"
                          value="full"
                          checked={refundType === 'full'}
                          onChange={() => setRefundType('full')}
                          className="w-4 h-4 accent-gray-900"
                        />
                        <span className="text-sm font-medium text-foreground">Full refund</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="refundType"
                          value="partial"
                          checked={refundType === 'partial'}
                          onChange={() => setRefundType('partial')}
                          className="w-4 h-4 accent-gray-900"
                        />
                        <span className="text-sm font-medium text-foreground">Partial refund</span>
                      </label>
                    </div>

                    {refundType === 'partial' && (
                      <div className="mt-3 flex flex-col gap-1.5">
                        <label htmlFor="partial-amount" className="text-xs font-medium text-muted-foreground">
                          Partial refund amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">
                            Rs.
                          </span>
                          <Input
                            id="partial-amount"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={partialAmount}
                            onChange={(e) => {
                              const v = e.target.value.replace(/[^\d.]/g, '')
                              if (/^\d*\.?\d{0,2}$/.test(v) || v === '') setPartialAmount(v)
                            }}
                            className="pl-10 h-11"
                            autoFocus
                          />
                        </div>
                        {parsedPartial > remaining && (
                          <p className="text-xs text-red-600">
                            Amount cannot exceed Rs. {remaining.toLocaleString()}
                          </p>
                        )}
                        {parsedPartial > 0 && parsedPartial <= remaining && (
                          <p className="text-xs text-muted-foreground">
                            Remaining after this refund:{' '}
                            <span className="font-semibold text-foreground">
                              Rs. {(remaining - parsedPartial).toLocaleString()}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border/60 bg-muted/20 flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsRefundModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={requestRefundConfirm} disabled={!canProcess}>
                    Process Refund
                  </Button>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Refund Confirmation Modal — final "Are you sure?" gate */}
      <Dialog open={isRefundConfirmOpen} onOpenChange={setIsRefundConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {refundType === 'full' ? 'Process full refund?' : 'Process partial refund?'}
            </DialogTitle>
            <DialogDescription>
              {selectedRefundOrder ? (
                <>
                  You are about to refund{' '}
                  <span className="font-semibold text-foreground tabular-nums">Rs. {pendingRefundAmount.toLocaleString()}</span>{' '}
                  on order <span className="font-medium text-foreground">{selectedRefundOrder.orderNo}</span>.
                  Refunds cannot be reversed once processed.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setIsRefundConfirmOpen(false)}>
              Go back
            </Button>
            <Button
              onClick={executeRefund}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, process refund
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Payment Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel payment request?</DialogTitle>
            <DialogDescription>
              {cancelTargetOrder ? (
                <>This will cancel payment request <span className="font-medium text-foreground">{cancelTargetOrder.orderNo}</span>. The customer will no longer be able to pay against this link. This action cannot be undone.</>
              ) : 'This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
              Keep request
            </Button>
            <Button
              onClick={confirmCancelPayment}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, cancel request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
