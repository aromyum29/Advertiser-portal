// @ts-nocheck
"use client"

import { useState, useMemo } from "react"
import { Search, Filter, ChevronDown, ChevronRight, ChevronUp, RefreshCw, X, Calendar } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar as CalendarComponent } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet"
import { cn } from "./ui/utils"

// ── Types ────────────────────────────────────────────────────────────────

type UserRole = 'super admin' | 'cashier' | 'branch admin' | 'finance admin'

type ActionType =
  | 'order creation' | 'order refund' | 'user login' | 'settings update'
  | 'data export' | 'payment processed' | 'campaign created' | 'qr generated' | 'report generated'

interface Action {
  id: string
  actionId: string
  username: string
  user: string
  role: UserRole
  branch: string
  date: string
  time: string
  actionType: ActionType
  actionDescription: string
}

// ── Static dummy data (computed once at module load — stable across renders) ─

const generateDummyActions = (): Action[] => {
  const usernames = ['admin.user', 'john.doe', 'sarah.smith', 'mike.johnson', 'lisa.wong', 'robert.brown', 'emma.davis', 'alex.wilson', 'maria.garcia', 'david.lee']
  const users = ['Admin User', 'John Doe', 'Sarah Smith', 'Mike Johnson', 'Lisa Wong', 'Robert Brown', 'Emma Davis', 'Alex Wilson', 'Maria Garcia', 'David Lee']
  const roles: UserRole[] = ['super admin', 'cashier', 'branch admin', 'finance admin']
  const branches = ['Main Branch', 'Colombo Central', 'Kandy Branch', 'Galle Branch', 'Negombo Branch']
  const actionTypes: ActionType[] = ['order creation', 'order refund', 'user login', 'settings update', 'data export', 'payment processed', 'campaign created', 'qr generated', 'report generated']

  const describe = (t: ActionType, seed: number): string => {
    const rnd = (max: number) => (seed * 9301 + 49297 + max) % max
    switch (t) {
      case 'order creation': return `Created order KK${String(rnd(999999)).padStart(6, '0')} for Rs. ${(rnd(10000) + 100).toFixed(2)}`
      case 'order refund':   return `Processed refund for order KK${String(rnd(999999)).padStart(6, '0')}`
      case 'user login':     return `User logged into the merchant portal`
      case 'settings update': return `Updated ${['merchant profile', 'payment settings', 'notification preferences', 'security settings'][rnd(4)]}`
      case 'data export':    return `Exported ${['order data', 'financial report', 'customer data', 'analytics report'][rnd(4)]}`
      case 'payment processed': return `Payment processed for Rs. ${(rnd(5000) + 100).toFixed(2)}`
      case 'campaign created': return `Created campaign: ${['Black Friday Sale', 'End of Year Promotion', 'New Customer Discount', 'Loyalty Reward'][rnd(4)]}`
      case 'qr generated':   return `Generated QR for ${['payment collection', 'store display', 'campaign promotion'][rnd(3)]}`
      case 'report generated': return `Generated ${['monthly financial report', 'sales analytics', 'customer insights', 'performance dashboard'][rnd(4)]}`
      default: return `Performed ${t}`
    }
  }

  return Array.from({ length: 100 }, (_, i) => {
    const userIndex = i % usernames.length
    const actionType = actionTypes[i % actionTypes.length]
    const actionDate = new Date(Date.now() - (i * 6 * 60 * 60 * 1000) - Math.floor((i * 41) % 100000))
    return {
      id: `action_${i + 1}`,
      actionId: `ACT${String(i + 1).padStart(6, '0')}`,
      username: usernames[userIndex],
      user: users[userIndex],
      role: roles[i % roles.length],
      branch: branches[(i * 3) % branches.length],
      date: actionDate.toISOString().split('T')[0],
      time: actionDate.toTimeString().split(' ')[0],
      actionType,
      actionDescription: describe(actionType, i + 1),
    }
  })
}

const ALL_ACTIONS = generateDummyActions()

// ── Pills ────────────────────────────────────────────────────────────────

const ROLE_META: Record<UserRole, { bg: string; text: string; border: string; label: string }> = {
  'super admin':    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    label: 'Super Admin' },
  'branch admin':   { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Branch Admin' },
  'finance admin':  { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   label: 'Finance Admin' },
  'cashier':        { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',label: 'Cashier' },
}

const ACTION_TYPE_META: Record<ActionType, { label: string }> = {
  'order creation':    { label: 'Order Created' },
  'order refund':      { label: 'Refund' },
  'user login':        { label: 'Login' },
  'settings update':   { label: 'Settings' },
  'data export':       { label: 'Export' },
  'payment processed': { label: 'Payment' },
  'campaign created':  { label: 'Campaign' },
  'qr generated':      { label: 'QR Generated' },
  'report generated':  { label: 'Report' },
}

const ACTION_PILL_CLASSES = "bg-gray-100 text-gray-700 border-gray-200"

function RolePill({ role }: { role: UserRole }) {
  const m = ROLE_META[role]
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium", m.bg, m.text, m.border)}>
      {m.label}
    </span>
  )
}

function ActionTypePill({ type }: { type: ActionType }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium", ACTION_PILL_CLASSES)}>
      {ACTION_TYPE_META[type].label}
    </span>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

// ── Main Component ───────────────────────────────────────────────────────

export function ActionHistory() {
  // Filters
  const [identifierType, setIdentifierType] = useState<string>('')
  const [identifierSearch, setIdentifierSearch] = useState<string>('')
  const [branchFilter, setBranchFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('all')
  const [actionTypeFilter, setActionTypeFilter] = useState<ActionType | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Sorting
  const [sortField, setSortField] = useState<keyof Action>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Drawer
  const [drawerAction, setDrawerAction] = useState<Action | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const uniqueBranches = useMemo(() => Array.from(new Set(ALL_ACTIONS.map(a => a.branch))).sort(), [])
  const uniqueUsers = useMemo(() => Array.from(new Set(ALL_ACTIONS.map(a => a.user))).sort(), [])

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (branchFilter !== 'all') n++
    if (userFilter !== 'all') n++
    if (actionTypeFilter !== 'all') n++
    if (dateFilter !== 'all') n++
    return n
  }, [branchFilter, userFilter, actionTypeFilter, dateFilter])

  // Filter + sort
  const filtered = useMemo(() => {
    let arr = ALL_ACTIONS.filter(a => {
      if (branchFilter !== 'all' && a.branch !== branchFilter) return false
      if (userFilter !== 'all' && a.user !== userFilter) return false
      if (actionTypeFilter !== 'all' && a.actionType !== actionTypeFilter) return false
      if (identifierType && identifierSearch.trim() !== '') {
        const t = identifierSearch.toLowerCase().trim()
        switch (identifierType) {
          case 'action-id': if (!a.actionId.toLowerCase().includes(t)) return false; break
          case 'username':  if (!a.username.toLowerCase().includes(t)) return false; break
          case 'user-name': if (!a.user.toLowerCase().includes(t)) return false; break
        }
      }
      if (dateFilter !== 'all') {
        const actionDate = new Date(a.date)
        const today = new Date()
        const daysDiff = Math.floor((today.getTime() - actionDate.getTime()) / 86400000)
        switch (dateFilter) {
          case 'today': if (daysDiff !== 0) return false; break
          case 'week':  if (daysDiff > 7) return false; break
          case 'month': if (daysDiff > 30) return false; break
          case 'custom': {
            const dOnly = new Date(actionDate.getFullYear(), actionDate.getMonth(), actionDate.getDate())
            if (startDate && dOnly < new Date(startDate)) return false
            if (endDate && dOnly > new Date(endDate)) return false
            break
          }
        }
      }
      return true
    })

    arr.sort((a, b) => {
      let aV: any = a[sortField]
      let bV: any = b[sortField]
      if (typeof aV === 'string') { aV = aV.toLowerCase(); bV = (bV as string).toLowerCase() }
      if (sortDirection === 'asc') return aV < bV ? -1 : aV > bV ? 1 : 0
      return aV > bV ? -1 : aV < bV ? 1 : 0
    })
    return arr
  }, [branchFilter, userFilter, actionTypeFilter, identifierType, identifierSearch, dateFilter, startDate, endDate, sortField, sortDirection])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = useMemo(() =>
    filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  , [filtered, currentPage])

  const handleSort = (f: keyof Action) => {
    if (sortField === f) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    else { setSortField(f); setSortDirection('desc') }
  }

  const resetFilters = () => {
    setIdentifierType('')
    setIdentifierSearch('')
    setBranchFilter('all')
    setUserFilter('all')
    setActionTypeFilter('all')
    setDateFilter('all')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
    setIsFiltersExpanded(false)
  }

  const handleRowClick = (a: Action) => {
    setDrawerAction(a)
    setIsDrawerOpen(true)
  }

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 min-w-0">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Action History</h1>
          <p className="text-sm text-muted-foreground mt-1">Audit log of all system activities</p>
        </div>
      </div>

      {/* Search + More Filters */}
      <div className="flex items-stretch gap-3 min-w-0">
        <div className="w-[200px] flex-shrink-0">
          <Select value={identifierType} onValueChange={(v) => { setIdentifierType(v); if (!v) setIdentifierSearch('') }}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="Search by…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="action-id">Action ID</SelectItem>
              <SelectItem value="username">Username</SelectItem>
              <SelectItem value="user-name">User Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={
              identifierType === 'action-id' ? 'Enter Action ID' :
              identifierType === 'username' ? 'Enter username' :
              identifierType === 'user-name' ? 'Enter user name' :
              'Select identifier type first'
            }
            value={identifierSearch}
            onChange={(e) => setIdentifierSearch(e.target.value)}
            disabled={!identifierType}
            className="w-full h-10 pl-9 pr-9 rounded-lg border border-border/60 bg-input-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {identifierSearch && (
            <button onClick={() => setIdentifierSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Button variant="outline" onClick={() => setIsFiltersExpanded(!isFiltersExpanded)} className="h-10 gap-2 flex-shrink-0">
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
          {filtered.length} of {ALL_ACTIONS.length}
        </div>
      </div>

      {/* More Filters Panel */}
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
                      onSelect={(d) => {
                        const s = d ? d.toISOString().split('T')[0] : ''
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
                      onSelect={(d) => {
                        const e = d ? d.toISOString().split('T')[0] : ''
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
                    {uniqueBranches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-800">User</label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="All Users" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-800">Action type</label>
                <Select value={actionTypeFilter} onValueChange={(v) => setActionTypeFilter(v as ActionType | 'all')}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Action Types</SelectItem>
                    {(Object.keys(ACTION_TYPE_META) as ActionType[]).map(t =>
                      <SelectItem key={t} value={t}>{ACTION_TYPE_META[t].label}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table — desktop */}
      <div className="hidden md:block bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
          <table className="w-full table-fixed border-separate border-spacing-0 min-w-[1100px]">
            <thead className="bg-muted/40">
              <tr>
                <SortableHeader label="Date & Time" field="date" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-left w-[150px]" />
                <SortableHeader label="Action ID" field="actionId" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-left w-[120px]" />
                <SortableHeader label="User" field="user" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-left w-[180px]" />
                <th className="px-4 first:pl-6 last:pr-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center border-b border-border/60 w-[130px]">Role</th>
                <SortableHeader label="Branch" field="branch" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-left w-[140px]" />
                <th className="px-4 first:pl-6 last:pr-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center border-b border-border/60 w-[140px]">Action Type</th>
                <th className="px-4 first:pl-6 last:pr-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-left border-b border-border/60 w-auto">Description</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Search className="h-8 w-8 opacity-30" />
                      <div>
                        <p className="text-sm font-medium">No actions found</p>
                        <p className="text-xs mt-0.5">Try adjusting your search or filters</p>
                      </div>
                      <button onClick={resetFilters} className="text-xs text-gray-700 hover:underline mt-1">Clear all filters</button>
                    </div>
                  </td>
                </tr>
              )}
              {paginated.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => handleRowClick(a)}
                  className="group cursor-pointer transition-all duration-150 hover:relative hover:z-10 [&:hover>td]:bg-white [&:hover>td]:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                >
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right whitespace-nowrap align-middle">
                    <div className="text-foreground font-medium text-sm">{formatDate(a.date)}</div>
                    <div className="text-xs text-muted-foreground">{a.time.slice(0, 5)}</div>
                  </td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right text-foreground font-medium whitespace-nowrap align-middle">{a.actionId}</td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right whitespace-nowrap align-middle">
                    <div className="text-foreground font-medium truncate">{a.user}</div>
                    <div className="text-xs text-muted-foreground">@{a.username}</div>
                  </td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right align-middle"><RolePill role={a.role} /></td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right text-foreground font-medium whitespace-nowrap align-middle truncate">{a.branch}</td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right align-middle"><ActionTypePill type={a.actionType} /></td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right text-foreground font-medium align-middle truncate" title={a.actionDescription}>{a.actionDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action History — mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {paginated.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-xl p-8 flex flex-col items-center gap-3 text-muted-foreground">
            <Search className="h-8 w-8 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-medium">No actions found</p>
              <p className="text-xs mt-0.5">Try adjusting your search or filters</p>
            </div>
            <button onClick={resetFilters} className="text-xs text-gray-700 hover:underline mt-1">Clear all filters</button>
          </div>
        ) : (
          paginated.map((a) => (
            <div
              key={a.id}
              role="button"
              tabIndex={0}
              onClick={() => handleRowClick(a)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick(a) } }}
              className="bg-card border border-border/60 rounded-xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-foreground/20 active:scale-[0.995]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-base font-semibold text-foreground break-all">{a.actionId}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatDate(a.date)} · {a.time.slice(0, 5)}
                  </span>
                </div>
                <ActionTypePill type={a.actionType} />
              </div>

              <div className="border-t border-border/40 pt-3 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">User</span>
                  <div className="flex flex-col items-end min-w-0 max-w-[65%]">
                    <span className="text-sm font-medium text-foreground break-words text-right">{a.user}</span>
                    <span className="text-xs text-muted-foreground break-all">@{a.username}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Role</span>
                  <RolePill role={a.role} />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Branch</span>
                  <span className="text-sm font-medium text-foreground break-words max-w-[65%] text-right">{a.branch}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">Description</span>
                  <span className="text-sm font-medium text-foreground break-words leading-relaxed">{a.actionDescription}</span>
                </div>
              </div>

              <div className="border-t border-border/40 pt-3 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <span>Tap for full details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</div>
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 px-3 text-xs">Previous</Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              return (
                <Button key={pageNum} variant={pageNum === currentPage ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(pageNum)} className="h-8 w-8 p-0 text-xs">{pageNum}</Button>
              )
            })}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 px-3 text-xs">Next</Button>
          </div>
        </div>
      )}

      {/* Drawer — full action details */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 gap-0 flex flex-col">
          {drawerAction && (
            <>
              <div className="px-6 pt-6 pb-5 border-b border-border/60 pr-12">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Action</p>
                    <SheetTitle className="text-xl font-bold font-mono">{drawerAction.actionId}</SheetTitle>
                  </div>
                  <ActionTypePill type={drawerAction.actionType} />
                </div>
                <SheetDescription className="text-xs text-muted-foreground">
                  {formatDate(drawerAction.date)} at {drawerAction.time}
                </SheetDescription>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Description</p>
                  <div className="rounded-xl border border-border/40 bg-card p-4">
                    <p className="text-sm text-foreground leading-relaxed">{drawerAction.actionDescription}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Performed by</p>
                  <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">User</span>
                      <span className="font-medium text-foreground">{drawerAction.user}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Username</span>
                      <span className="font-mono text-xs text-foreground">@{drawerAction.username}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Role</span>
                      <RolePill role={drawerAction.role} />
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Branch</span>
                      <span className="text-foreground">{drawerAction.branch}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Audit details</p>
                  <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Action ID</span>
                      <span className="font-mono text-xs text-foreground">{drawerAction.actionId}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground">{formatDate(drawerAction.date)}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="text-foreground font-mono text-xs">{drawerAction.time}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Action type</span>
                      <ActionTypePill type={drawerAction.actionType} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ── Sortable header ───────────────────────────────────────────────────

function SortableHeader({ label, field, sortField, sortDirection, onSort, className }: {
  label: string
  field: keyof Action
  sortField: keyof Action
  sortDirection: 'asc' | 'desc'
  onSort: (f: keyof Action) => void
  className?: string
}) {
  const isSorted = sortField === field
  return (
    <th className={cn("px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground leading-tight align-top border-b border-border/60", className)}>
      <button
        onClick={() => onSort(field)}
        className={cn("inline-flex items-start gap-1 uppercase tracking-wider leading-tight text-center hover:text-foreground transition-colors", isSorted && "text-foreground")}
      >
        {label}
        {isSorted && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </button>
    </th>
  )
}
