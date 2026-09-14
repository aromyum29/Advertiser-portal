// @ts-nocheck
"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Download, MoreVertical, Edit, QrCode, ChevronUp, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { cn } from "./ui/utils"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import actualQrCode from "figma:asset/ffe57b84a9bfaa6d97d3ff077f472520c4e033a8.png"

// Static QR interface
interface StaticQR {
  id: string
  branchName: string
  number: string
  additionalNumber?: string
  email: string
  qrCode: string
  createdDate: string
}

// Generate dummy data
const generateDummyStaticQRs = (): StaticQR[] => {
  const branches = [
    'Main Branch', 'Colombo Central', 'Kandy Branch', 'Galle Branch', 'Negombo Branch',
    'Matara Branch', 'Jaffna Branch', 'Anuradhapura Branch', 'Kurunegala Branch', 'Ratnapura Branch',
    'Badulla Branch', 'Trincomalee Branch'
  ]

  return Array.from({ length: 25 }, (_, i) => ({
    id: `qr_${i + 1}`,
    branchName: branches[Math.floor(Math.random() * branches.length)],
    number: `77${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
    additionalNumber: Math.random() > 0.6 ? `77${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}` : undefined,
    email: `branch${i + 1}@koko.lk`,
    qrCode: `QR${String(i + 1).padStart(6, '0')}`,
    createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

// ── QR Preview Card ─────────────────────────────────────────────────────

interface QRPreviewProps {
  title: string
  withBranchName: boolean
  titlePosition: 'above' | 'below'
}

function QRPreview({ title, withBranchName, titlePosition }: QRPreviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-border/40 p-6 mx-auto" style={{ maxWidth: 280 }}>
      <div className="flex flex-col items-center gap-4">
        {withBranchName && titlePosition === 'above' && (
          <p className="text-sm font-semibold text-foreground text-center">{title}</p>
        )}
        <div className="w-44 h-44 flex items-center justify-center">
          <ImageWithFallback src={actualQrCode} alt="QR Code" className="w-full h-full object-contain" />
        </div>
        {withBranchName && titlePosition === 'below' && (
          <p className="text-sm font-semibold text-foreground text-center">{title}</p>
        )}
      </div>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────

export function StaticQR() {
  const [qrCodes] = useState<StaticQR[]>(generateDummyStaticQRs())

  // Edit modal state
  const [selectedQR, setSelectedQR] = useState<StaticQR | null>(null)
  const [isNumberModalOpen, setIsNumberModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [editNumber, setEditNumber] = useState('')
  const [editAdditionalNumber, setEditAdditionalNumber] = useState('')
  const [editEmail, setEditEmail] = useState('')

  // Preview modal state (shared between single + bulk)
  const [previewQR, setPreviewQR] = useState<StaticQR | null>(null) // single download preview
  const [isBulkPreviewOpen, setIsBulkPreviewOpen] = useState(false) // bulk download preview
  const [withBranchName, setWithBranchName] = useState(true)
  const [titlePosition, setTitlePosition] = useState<'above' | 'below'>('above')
  const [customTitle, setCustomTitle] = useState('')

  // Bulk download selection
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])

  // Filter
  const [branchFilter, setBranchFilter] = useState<string>('all')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Unique branches
  const uniqueBranches = useMemo(() =>
    Array.from(new Set(qrCodes.map(qr => qr.branchName))).sort()
  , [qrCodes])

  const filteredQRs = useMemo(() => {
    return qrCodes.filter(qr => {
      if (branchFilter !== 'all' && qr.branchName !== branchFilter) return false
      return true
    })
  }, [qrCodes, branchFilter])

  const uniqueBranchCount = useMemo(() =>
    new Set(filteredQRs.map(qr => qr.branchName)).size
  , [filteredQRs])

  const paginatedQRs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredQRs.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredQRs, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredQRs.length / itemsPerPage)

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleEditNumber = (qr: StaticQR) => {
    setSelectedQR(qr)
    setEditNumber(qr.number)
    setEditAdditionalNumber(qr.additionalNumber || '')
    setIsNumberModalOpen(true)
  }

  const handleEditEmail = (qr: StaticQR) => {
    setSelectedQR(qr)
    setEditEmail(qr.email)
    setIsEmailModalOpen(true)
  }

  const handleDownloadQR = (qr: StaticQR) => {
    setPreviewQR(qr)
    setWithBranchName(true)
    setTitlePosition('above')
    setCustomTitle('')
  }

  const handleSaveNumber = () => {
    if (selectedQR) {
      const event = new CustomEvent('show-toast', {
        detail: {
          type: 'success',
          title: 'Phone Number Updated',
          description: `Phone number for ${selectedQR.branchName} has been updated.`
        }
      })
      window.dispatchEvent(event)
      setIsNumberModalOpen(false)
      setSelectedQR(null)
    }
  }

  const handleSaveEmail = () => {
    if (selectedQR) {
      const event = new CustomEvent('show-toast', {
        detail: {
          type: 'success',
          title: 'Email Updated',
          description: `Email for ${selectedQR.branchName} has been updated.`
        }
      })
      window.dispatchEvent(event)
      setIsEmailModalOpen(false)
      setSelectedQR(null)
    }
  }

  const handleDownloadAll = () => {
    setSelectedBranches(uniqueBranches)
    setWithBranchName(true)
    setTitlePosition('above')
    setIsBulkPreviewOpen(true)
  }

  const handleBranchToggle = (branchName: string) => {
    setSelectedBranches(prev =>
      prev.includes(branchName)
        ? prev.filter(b => b !== branchName)
        : [...prev, branchName]
    )
  }

  const handleConfirmSingleDownload = () => {
    if (!previewQR) return
    const event = new CustomEvent('show-toast', {
      detail: {
        type: 'success',
        title: 'QR Code Downloaded',
        description: `QR code for ${previewQR.branchName} downloaded.`
      }
    })
    window.dispatchEvent(event)
    setPreviewQR(null)
  }

  const handleConfirmBulkDownload = () => {
    const event = new CustomEvent('show-toast', {
      detail: {
        type: 'success',
        title: 'QR Codes Downloaded',
        description: `Downloaded ${selectedBranches.length} QR code${selectedBranches.length === 1 ? '' : 's'}.`
      }
    })
    window.dispatchEvent(event)
    setIsBulkPreviewOpen(false)
    setSelectedBranches([])
  }

  // ── Render ────────────────────────────────────────────────────────────

  const previewTitle = customTitle.trim() || (previewQR ? previewQR.branchName : 'Branch Name')

  return (
    <div className="space-y-5 min-w-0 relative">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Static QR</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage QR codes for your branches</p>
        </div>
        <Button variant="outline" className="h-10 gap-2" onClick={handleDownloadAll}>
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download All</span>
        </Button>
      </div>

      {/* Stats + Filter row */}
      <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-xl border border-border/40 flex-wrap">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total QR Codes</span>
          <span className="text-xl font-bold text-foreground tabular-nums">{filteredQRs.length}</span>
        </div>
        <div className="w-px bg-border/60 self-stretch hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Branches</span>
          <span className="text-xl font-bold text-foreground tabular-nums">{uniqueBranchCount}</span>
        </div>
        <div className="w-px bg-border/60 self-stretch hidden sm:block" />
        <div className="flex flex-col gap-1.5 ml-0 sm:ml-auto w-full sm:w-auto">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Filter by Branch</span>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-full sm:w-56 h-9 text-sm">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {uniqueBranches.map(branch => (
                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[220px]">Branch</th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[180px]">Number</th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[220px]">Email Address</th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[180px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQRs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <QrCode className="h-8 w-8 opacity-30" />
                      <div>
                        <p className="text-sm font-medium">No QR codes found</p>
                        <p className="text-xs mt-0.5">Try adjusting the branch filter</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {paginatedQRs.map((qr) => (
                <tr
                  key={qr.id}
                  className="group cursor-default transition-all duration-150 hover:relative hover:z-10 [&:hover>td]:bg-white [&:hover>td]:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                >
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-center first:text-left last:text-right text-foreground font-medium">
                    {qr.branchName}
                  </td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-center first:text-left last:text-right">
                    <div className="text-foreground font-medium text-sm">{qr.number}</div>
                    {qr.additionalNumber && (
                      <div className="text-foreground font-medium text-sm mt-0.5">{qr.additionalNumber}</div>
                    )}
                  </td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-center first:text-left last:text-right text-foreground font-medium">
                    {qr.email}
                  </td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm whitespace-nowrap border-b border-border/40 text-center first:text-left last:text-right">
                    <div className="inline-flex gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => handleDownloadQR(qr)}
                        className="h-8 px-3 text-xs gap-1.5"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        Download QR
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditNumber(qr)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Number
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditEmail(qr)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Static QR — mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {paginatedQRs.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-xl p-8 flex flex-col items-center gap-3 text-muted-foreground">
            <QrCode className="h-8 w-8 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-medium">No QR codes found</p>
              <p className="text-xs mt-0.5">Try adjusting the branch filter</p>
            </div>
          </div>
        ) : (
          paginatedQRs.map((qr) => (
            <div key={qr.id} className="bg-card border border-border/60 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-base font-semibold text-foreground break-words">{qr.branchName}</span>
                  <span className="text-xs text-muted-foreground mt-1">Static QR</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-9 w-9 p-0 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditNumber(qr)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Number
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditEmail(qr)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="border-t border-border/40 pt-3 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Number</span>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground tabular-nums">{qr.number}</span>
                    {qr.additionalNumber && (
                      <span className="text-sm font-medium text-foreground tabular-nums">{qr.additionalNumber}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Email</span>
                  <span className="text-sm font-medium text-foreground break-all max-w-[65%] text-right">{qr.email}</span>
                </div>
              </div>

              <Button size="sm" onClick={() => handleDownloadQR(qr)} className="h-10 text-sm gap-1.5">
                <QrCode className="h-4 w-4" />
                Download QR
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</div>
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 px-3 text-xs">
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="h-8 w-8 p-0 text-xs"
                >
                  {pageNum}
                </Button>
              )
            })}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 px-3 text-xs">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ── Single Download Preview Modal ─────────────────────────────── */}
      <Dialog open={!!previewQR} onOpenChange={(open) => !open && setPreviewQR(null)}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          {previewQR && (
            <>
              <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/60">
                <DialogTitle className="text-base font-bold text-center">Preview</DialogTitle>
                <DialogDescription className="sr-only">Preview the QR code before downloading.</DialogDescription>
              </DialogHeader>

              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-5">
                {/* QR Preview */}
                <QRPreview
                  title={previewTitle}
                  withBranchName={withBranchName}
                  titlePosition={titlePosition}
                />

                {/* Options */}
                <div className="space-y-3">
                  {/* With branch name */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="branchNameOption"
                      checked={withBranchName}
                      onChange={() => setWithBranchName(true)}
                      className="w-4 h-4 mt-0.5 accent-gray-900"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">With branch name</p>
                    </div>
                  </label>

                  {/* Sub-options for "with branch name" */}
                  {withBranchName && (
                    <div className="ml-7 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Title position <span className="text-red-500 normal-case">*</span>
                        </label>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="titlePosition"
                              checked={titlePosition === 'above'}
                              onChange={() => setTitlePosition('above')}
                              className="w-4 h-4 accent-gray-900"
                            />
                            <span className="text-sm text-foreground">Above QR code</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="titlePosition"
                              checked={titlePosition === 'below'}
                              onChange={() => setTitlePosition('below')}
                              className="w-4 h-4 accent-gray-900"
                            />
                            <span className="text-sm text-foreground">Below QR code</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="custom-title" className="text-sm font-medium text-foreground">
                          Custom title <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                        </label>
                        <Input
                          id="custom-title"
                          type="text"
                          placeholder={previewQR.branchName}
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          className="h-10 text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Leave empty to use default title</p>
                      </div>
                    </div>
                  )}

                  {/* Without branch name */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="branchNameOption"
                      checked={!withBranchName}
                      onChange={() => setWithBranchName(false)}
                      className="w-4 h-4 mt-0.5 accent-gray-900"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Without branch name</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border/60 bg-muted/20">
                <Button onClick={handleConfirmSingleDownload} className="w-full h-11 gap-2">
                  <Download className="h-4 w-4" />
                  Download QR code
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Bulk Download Preview Modal ─────────────────────────────── */}
      <Dialog open={isBulkPreviewOpen} onOpenChange={(open) => {
        setIsBulkPreviewOpen(open)
        if (!open) setSelectedBranches([])
      }}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/60">
            <DialogTitle className="text-base font-bold text-center">Preview</DialogTitle>
            <DialogDescription className="sr-only">Configure bulk QR code download options.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-5">
            {/* QR Preview — uses sample branch */}
            <QRPreview
              title={selectedBranches[0] || 'Branch Name'}
              withBranchName={withBranchName}
              titlePosition={titlePosition}
            />

            {/* Options (no custom title for bulk) */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="bulkBranchNameOption"
                  checked={withBranchName}
                  onChange={() => setWithBranchName(true)}
                  className="w-4 h-4 mt-0.5 accent-gray-900"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">With branch name</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Each QR code will display its own branch name</p>
                </div>
              </label>

              {withBranchName && (
                <div className="ml-7 space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Title position <span className="text-red-500 normal-case">*</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="bulkTitlePosition"
                        checked={titlePosition === 'above'}
                        onChange={() => setTitlePosition('above')}
                        className="w-4 h-4 accent-gray-900"
                      />
                      <span className="text-sm text-foreground">Above QR code</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="bulkTitlePosition"
                        checked={titlePosition === 'below'}
                        onChange={() => setTitlePosition('below')}
                        className="w-4 h-4 accent-gray-900"
                      />
                      <span className="text-sm text-foreground">Below QR code</span>
                    </label>
                  </div>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="bulkBranchNameOption"
                  checked={!withBranchName}
                  onChange={() => setWithBranchName(false)}
                  className="w-4 h-4 mt-0.5 accent-gray-900"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Without branch name</p>
                </div>
              </label>
            </div>

            {/* Branch selection */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Branches to download
                </p>
                <span className="text-xs text-muted-foreground">
                  {selectedBranches.length} of {uniqueBranches.length}
                </span>
              </div>
              <div className="max-h-44 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border space-y-1 rounded-lg border border-border/40 p-2">
                {uniqueBranches.map((branch) => (
                  <div key={branch} className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-muted/40 transition-colors">
                    <Checkbox
                      id={`bulk-${branch}`}
                      checked={selectedBranches.includes(branch)}
                      onCheckedChange={() => handleBranchToggle(branch)}
                    />
                    <Label htmlFor={`bulk-${branch}`} className="flex-1 text-sm font-medium text-foreground cursor-pointer">
                      {branch}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border/60 bg-muted/20">
            <Button
              onClick={handleConfirmBulkDownload}
              disabled={selectedBranches.length === 0}
              className="w-full h-11 gap-2"
            >
              <Download className="h-4 w-4" />
              Download QR code{selectedBranches.length === 1 ? '' : 's'} ({selectedBranches.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Number Modal ───────────────────────────────────────── */}
      <Dialog open={isNumberModalOpen} onOpenChange={setIsNumberModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Phone Number</DialogTitle>
            <DialogDescription>
              Update the phone number for {selectedQR?.branchName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="primary-number" className="text-sm font-medium text-foreground">
                Primary Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm font-medium text-muted-foreground">
                  +94
                </span>
                <Input
                  id="primary-number"
                  type="tel"
                  placeholder="771234567"
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className="pl-12 h-11"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="additional-number" className="text-sm font-medium text-foreground">
                Additional Number <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm font-medium text-muted-foreground">
                  +94
                </span>
                <Input
                  id="additional-number"
                  type="tel"
                  placeholder="771234567"
                  value={editAdditionalNumber}
                  onChange={(e) => setEditAdditionalNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className="pl-12 h-11"
                />
              </div>
              <p className="text-xs text-muted-foreground">Leave empty to remove additional number</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setIsNumberModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNumber}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Email Modal ────────────────────────────────────────── */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Email Address</DialogTitle>
            <DialogDescription>
              Update the email address for {selectedQR?.branchName}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5 pt-2">
            <label htmlFor="email-input" className="text-sm font-medium text-foreground">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email-input"
              type="email"
              placeholder="branch@koko.lk"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEmail}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
