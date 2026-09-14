// @ts-nocheck
import { useState, useMemo } from "react"
import { Download, Eye, Edit, X, MoreVertical, Search, Filter, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet"
import { Separator } from "./ui/separator"
import { BlackFridayCountdown } from "./BlackFridayCountdown"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { JoinCampaignModal } from "./JoinCampaignModal"
import { cn } from "./ui/utils"
import astronautBg from 'figma:asset/a349729d02e5cf57b6a622320f58be0535982d3a.png'

interface CampaignProps {
  showNotification?: boolean
}

interface Campaign {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  joinDeadline?: string
  status: 'joined' | 'pending' | 'not_joined' | 'active' | 'expired'
  category: string
  isNew?: boolean
}

// ── Mock data ─────────────────────────────────────────────────────────

const kokoCampaigns: Campaign[] = [
  {
    id: "AC001",
    name: "Black Friday Sale",
    description: "Drive sales during the holiday season with exclusive Black Friday promotions and discounts.",
    startDate: "2026-11-27",
    endDate: "2026-12-31",
    joinDeadline: "2026-11-20",
    status: "not_joined",
    category: "Sales",
    isNew: true,
  },
  {
    id: "AC002",
    name: "EID Sale",
    description: "Acquire new customers and drive engagement during the EID festive season.",
    startDate: "2026-07-10",
    endDate: "2026-08-15",
    joinDeadline: "2026-07-05",
    status: "pending",
    category: "Acquisition",
  },
  {
    id: "AC003",
    name: "New Year Sale",
    description: "Promote digital payment adoption with special new year offers.",
    startDate: "2026-12-15",
    endDate: "2027-01-15",
    joinDeadline: "2026-12-10",
    status: "joined",
    category: "Technology",
  },
  {
    id: "AC004",
    name: "Koko Birthday Sale",
    description: "Target weekend shoppers with exclusive birthday celebration deals.",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    joinDeadline: "2026-08-28",
    status: "not_joined",
    category: "Sales",
  }
]

const myCampaigns: Campaign[] = [
  {
    id: "MC001",
    name: "Black Friday Special",
    description: "Special Black Friday weekend promotional campaign.",
    startDate: "2026-11-27",
    endDate: "2026-11-30",
    status: "joined",
    category: "Sales"
  },
  {
    id: "MC002",
    name: "Customer Loyalty Program",
    description: "Reward loyal customers with exclusive perks and offers.",
    startDate: "2026-09-01",
    endDate: "2026-10-31",
    status: "pending",
    category: "Retention"
  },
  {
    id: "MC003",
    name: "Mobile App Promotion",
    description: "Encourage app downloads with exclusive in-app offers.",
    startDate: "2026-07-15",
    endDate: "2026-08-15",
    status: "joined",
    category: "Technology"
  },
  {
    id: "MC004",
    name: "Summer Sales Drive",
    description: "Maximize summer revenue with seasonal deals.",
    startDate: "2026-06-25",
    endDate: "2026-07-31",
    status: "joined",
    category: "Sales"
  }
]

// ── Status pill ───────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; dot: string; bg: string; text: string; border: string }> = {
  joined: { label: 'Joined', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  pending: { label: 'Pending', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  not_joined: { label: 'Available', dot: 'bg-[#7DB1D5]', bg: 'bg-[#BDDCEE]/30', text: 'text-gray-700', border: 'border-[#BDDCEE]' },
  active: { label: 'Active', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  expired: { label: 'Expired', dot: 'bg-gray-400', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
}

function StatusPill({ status }: { status: string }) {
  const meta = STATUS_META[status] || STATUS_META.not_joined
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

function NewPill() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider">
      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
      New
    </span>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const isDeadlinePassed = (deadline: string) => new Date(deadline) < new Date()

const handleExport = (campaign: Campaign) => {
  const data = `Campaign: ${campaign.name}\nStatus: ${campaign.status}\nCategory: ${campaign.category}\nStart Date: ${campaign.startDate}\nEnd Date: ${campaign.endDate}`
  const blob = new Blob([data], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${campaign.name.replace(/\s+/g, '_')}_export.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleExportAll = (campaigns: Campaign[]) => {
  const data = campaigns.map(c =>
    `Campaign: ${c.name}\nStatus: ${c.status}\nCategory: ${c.category}\nStart: ${c.startDate}\nEnd: ${c.endDate}\n---`
  ).join('\n')
  const blob = new Blob([data], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'all_campaigns_export.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── Main Component ────────────────────────────────────────────────────

export function Campaign({ showNotification = true }: CampaignProps) {
  const [activeTab, setActiveTab] = useState<'koko' | 'my'>('koko')
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'join'>('join')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  // Drawer
  const [drawerCampaign, setDrawerCampaign] = useState<Campaign | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Search + filter
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Countdown
  const countdownTargetDate = useMemo(() => {
    const now = new Date()
    const randomDays = Math.floor(Math.random() * 30) + 1
    const futureDate = new Date(now)
    futureDate.setDate(now.getDate() + randomDays)
    futureDate.setHours(
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60),
      0
    )
    return futureDate
  }, [])

  // Current dataset
  const currentDataset = activeTab === 'koko' ? kokoCampaigns : myCampaigns

  // Unique categories
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>()
    currentDataset.forEach(c => set.add(c.category))
    return Array.from(set).sort()
  }, [currentDataset])

  // Filtered + sorted list — actionable campaigns float to the top
  const filteredCampaigns = useMemo(() => {
    const statusPriority: Record<string, number> = {
      not_joined: 0, // available — top
      active: 0,
      pending: 1,
      joined: 2,
      expired: 3,
    }
    return currentDataset
      .filter(c => {
        if (categoryFilter !== 'all' && c.category !== categoryFilter) return false
        if (search.trim()) {
          const term = search.toLowerCase().trim()
          if (
            !c.name.toLowerCase().includes(term) &&
            !c.description.toLowerCase().includes(term) &&
            !c.category.toLowerCase().includes(term)
          ) return false
        }
        return true
      })
      .sort((a, b) => {
        const pa = statusPriority[a.status] ?? 99
        const pb = statusPriority[b.status] ?? 99
        if (pa !== pb) return pa - pb
        // Tiebreak: NEW campaigns above older ones inside the same status group
        if (!!b.isNew !== !!a.isNew) return b.isNew ? 1 : -1
        return 0
      })
  }, [currentDataset, search, categoryFilter])

  const handleJoinCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setModalMode('join')
    setJoinModalOpen(true)
  }

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setModalMode('view')
    setJoinModalOpen(true)
  }

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setModalMode('edit')
    setJoinModalOpen(true)
  }

  const handleRowClick = (campaign: Campaign) => {
    setDrawerCampaign(campaign)
    setIsDrawerOpen(true)
  }

  return (
    <div className="space-y-5 min-w-0">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover Koko campaigns and manage your participated campaigns
          </p>
        </div>
        {activeTab === 'my' && (
          <Button variant="outline" className="h-10 gap-2" onClick={() => handleExportAll(myCampaigns)}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export All</span>
          </Button>
        )}
      </div>

      {/* Featured campaign banner */}
      <div
        className="rounded-2xl relative overflow-hidden border border-border/60 shadow-sm"
        style={{
          backgroundImage: `url(${astronautBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '320px',
        }}
      >
        {/* Soft dark overlay — image still shows */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative z-10 flex items-center p-6 sm:p-8 min-h-[320px]">
          {/* Glass card */}
          <div className="backdrop-blur-xl bg-white/8 rounded-2xl border border-white/15 p-6 sm:p-7 max-w-md shadow-2xl">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 bg-red-600/90 px-2.5 py-1 rounded-full">
                Black Friday
              </span>
              <span className="text-xs text-white/60">·</span>
              <span className="text-xs text-white/70 font-medium">Nov 29 – Dec 2</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-5">
              Black Friday Campaign
            </h2>

            {/* Cleaner countdown */}
            <div className="mb-6">
              <BlackFridayCountdown targetDate={countdownTargetDate} />
            </div>

            {/* CTA - charcoal */}
            <Button
              className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
              onClick={() => handleJoinCampaign({
                id: "BF001",
                name: "Black Friday Campaign",
                description: "Special Black Friday promotions",
                startDate: "2024-11-29",
                endDate: "2024-12-02",
                joinDeadline: "2024-11-25",
                status: "not_joined",
                category: "Sales"
              })}
            >
              Join Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs — counts inline */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => { setActiveTab('koko'); setSearch(''); setCategoryFilter('all') }}
            className={cn(
              "pb-3 border-b-2 transition-colors flex items-center gap-1.5 text-sm",
              activeTab === 'koko'
                ? "border-gray-900 text-gray-900 font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Koko Campaigns
            <span className={cn(
              "text-xs rounded-full px-1.5 py-0.5 leading-none",
              activeTab === 'koko' ? "bg-gray-900 text-white" : "bg-muted text-muted-foreground"
            )}>
              {kokoCampaigns.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('my'); setSearch(''); setCategoryFilter('all') }}
            className={cn(
              "pb-3 border-b-2 transition-colors flex items-center gap-1.5 text-sm",
              activeTab === 'my'
                ? "border-gray-900 text-gray-900 font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            My Campaigns
            <span className={cn(
              "text-xs rounded-full px-1.5 py-0.5 leading-none",
              activeTab === 'my' ? "bg-gray-900 text-white" : "bg-muted text-muted-foreground"
            )}>
              {myCampaigns.length}
            </span>
          </button>
        </div>
      </div>

      {/* Search + Category filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search campaigns by name, description or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-9 rounded-lg border border-border/60 bg-input-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-10 w-44 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {uniqueCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground flex-shrink-0 hidden sm:flex items-center">
          {filteredCampaigns.length} of {currentDataset.length}
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[280px]">
                  Campaign Name
                </th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[130px]">
                  Start Date
                </th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[130px]">
                  End Date
                </th>
                {activeTab === 'koko' && (
                  <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[140px]">
                    Join Deadline
                  </th>
                )}
                {activeTab === 'my' && (
                  <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[130px]">
                    Status
                  </th>
                )}
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[160px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={activeTab === 'koko' ? 5 : 5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Filter className="h-8 w-8 opacity-30" />
                      <div>
                        <p className="text-sm font-medium">No campaigns found</p>
                        <p className="text-xs mt-0.5">Try adjusting your search or category filter</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  onClick={() => handleRowClick(campaign)}
                  className="group cursor-pointer transition-all duration-150 hover:relative hover:z-10 [&:hover>td]:bg-white [&:hover>td]:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                >
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">{campaign.name}</span>
                      {campaign.isNew && <NewPill />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{campaign.category}</p>
                  </td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-center first:text-left last:text-right text-muted-foreground">
                    {formatDate(campaign.startDate)}
                  </td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-center first:text-left last:text-right text-muted-foreground">
                    {formatDate(campaign.endDate)}
                  </td>
                  {activeTab === 'koko' && (
                    <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-center first:text-left last:text-right">
                      {campaign.joinDeadline ? (
                        <span className={cn(
                          "tabular-nums",
                          isDeadlinePassed(campaign.joinDeadline) ? "text-red-600 font-medium" : "text-muted-foreground"
                        )}>
                          {formatDate(campaign.joinDeadline)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  )}
                  {activeTab === 'my' && (
                    <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-center first:text-left last:text-right">
                      <StatusPill status={campaign.status} />
                    </td>
                  )}
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-center first:text-left last:text-right">
                    <div className="inline-flex gap-1.5">
                      {activeTab === 'koko' ? (
                        <Button
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleJoinCampaign(campaign) }}
                          disabled={campaign.status === 'joined' || campaign.status === 'pending'}
                          className="h-8 w-[120px] px-3 text-xs"
                        >
                          {campaign.status === 'joined' ? 'Joined' : campaign.status === 'pending' ? 'Pending' : 'Join Campaign'}
                        </Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Actions
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem className="gap-2" onClick={() => handleViewCampaign(campaign)}>
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleEditCampaign(campaign)}>
                              <Edit className="h-4 w-4" />
                              Edit Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <X className="h-4 w-4" />
                              Cancel Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleExport(campaign)}>
                              <Download className="h-4 w-4" />
                              Export Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaigns — mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-xl p-8 flex flex-col items-center gap-3 text-muted-foreground">
            <Filter className="h-8 w-8 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-medium">No campaigns found</p>
              <p className="text-xs mt-0.5">Try adjusting your search or category filter</p>
            </div>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              role="button"
              tabIndex={0}
              onClick={() => handleRowClick(campaign)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick(campaign) } }}
              className="bg-card border border-border/60 rounded-xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-foreground/20 active:scale-[0.995]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="text-base font-semibold text-foreground break-words">{campaign.name}</span>
                    {campaign.isNew && <NewPill />}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 break-words">{campaign.category}</span>
                </div>
                {activeTab === 'my' && <StatusPill status={campaign.status} />}
              </div>

              <div className="border-t border-border/40 pt-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Start date</span>
                  <span className="text-sm font-medium text-foreground">{formatDate(campaign.startDate)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">End date</span>
                  <span className="text-sm font-medium text-foreground">{formatDate(campaign.endDate)}</span>
                </div>
                {activeTab === 'koko' && campaign.joinDeadline && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Join deadline</span>
                    <span className={cn(
                      "text-sm font-medium tabular-nums",
                      isDeadlinePassed(campaign.joinDeadline) ? "text-red-600" : "text-foreground"
                    )}>
                      {formatDate(campaign.joinDeadline)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-border/40 pt-3 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <span>Tap for full details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>

              {activeTab === 'koko' ? (
                <Button
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleJoinCampaign(campaign) }}
                  disabled={campaign.status === 'joined' || campaign.status === 'pending'}
                  className="h-10 text-sm"
                >
                  {campaign.status === 'joined' ? 'Joined' : campaign.status === 'pending' ? 'Pending' : 'Join Campaign'}
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-10 w-full text-sm gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Actions
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem className="gap-2" onClick={() => handleViewCampaign(campaign)}>
                      <Eye className="h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => handleEditCampaign(campaign)}>
                      <Edit className="h-4 w-4" />
                      Edit Campaign
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <X className="h-4 w-4" />
                      Cancel Campaign
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => handleExport(campaign)}>
                      <Download className="h-4 w-4" />
                      Export Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))
        )}
      </div>

      {/* Side drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 gap-0 flex flex-col">
          {drawerCampaign && (
            <>
              <div className="px-6 pt-6 pb-5 border-b border-border/60">
                <div className="flex items-start justify-between gap-4 mb-3 pr-8">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Campaign</p>
                    <SheetTitle className="text-xl font-bold truncate">{drawerCampaign.name}</SheetTitle>
                  </div>
                  <StatusPill status={drawerCampaign.status} />
                </div>
                <SheetDescription className="text-xs text-muted-foreground">
                  {drawerCampaign.category}
                </SheetDescription>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Description card */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">About</p>
                  <div className="rounded-xl border border-border/40 bg-card p-4">
                    <p className="text-sm text-foreground leading-relaxed">{drawerCampaign.description}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Timeline</p>
                  <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
                    <div className="flex justify-between items-center px-4 first:pl-6 last:pr-6 py-3.5 text-sm">
                      <span className="text-muted-foreground">Start date</span>
                      <span className="font-medium text-foreground tabular-nums">{formatDate(drawerCampaign.startDate)}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 first:pl-6 last:pr-6 py-3.5 text-sm">
                      <span className="text-muted-foreground">End date</span>
                      <span className="font-medium text-foreground tabular-nums">{formatDate(drawerCampaign.endDate)}</span>
                    </div>
                    {drawerCampaign.joinDeadline && (
                      <div className="flex justify-between items-center px-4 first:pl-6 last:pr-6 py-3.5 text-sm">
                        <span className="text-muted-foreground">Join deadline</span>
                        <span className={cn(
                          "font-medium tabular-nums",
                          isDeadlinePassed(drawerCampaign.joinDeadline) ? "text-red-600" : "text-foreground"
                        )}>
                          {formatDate(drawerCampaign.joinDeadline)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center px-4 first:pl-6 last:pr-6 py-3.5 text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <StatusPill status={drawerCampaign.status} />
                    </div>
                    <div className="flex justify-between items-center px-4 first:pl-6 last:pr-6 py-3.5 text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-foreground">{drawerCampaign.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky footer */}
              <div className="border-t border-border/60 px-6 py-4 bg-muted/20">
                {(drawerCampaign.status === 'not_joined' || activeTab === 'koko') ? (
                  <Button
                    onClick={() => { setIsDrawerOpen(false); handleJoinCampaign(drawerCampaign) }}
                    disabled={drawerCampaign.status === 'joined' || drawerCampaign.status === 'pending'}
                    className="w-full h-11"
                  >
                    {drawerCampaign.status === 'joined' ? 'Already Joined' : drawerCampaign.status === 'pending' ? 'Pending Approval' : 'Join Campaign'}
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => { setIsDrawerOpen(false); handleViewCampaign(drawerCampaign) }}>
                      View
                    </Button>
                    <Button onClick={() => { setIsDrawerOpen(false); handleEditCampaign(drawerCampaign) }}>
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Join Campaign Modal */}
      {selectedCampaign && (
        <JoinCampaignModal
          isOpen={joinModalOpen}
          onClose={() => {
            setJoinModalOpen(false)
            setSelectedCampaign(null)
          }}
          campaignName={selectedCampaign.name}
          campaignStartDate={selectedCampaign.startDate}
          campaignEndDate={selectedCampaign.endDate}
          mode={modalMode}
        />
      )}
    </div>
  )
}
