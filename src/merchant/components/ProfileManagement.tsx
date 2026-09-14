// @ts-nocheck
"use client"

import { useState, useMemo } from "react"
import { Search, MoreVertical, Edit, Shield, UserPlus, Key, Mail, X, Filter, ChevronDown, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Switch } from "./ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet"
import { cn } from "./ui/utils"
import { toast } from "sonner"

// ── Types ────────────────────────────────────────────────────────────────

type UserRole = 'Super Admin' | 'Branch Admin' | 'Finance Admin' | 'Cashier'
// Roles that can be assigned when creating a new user (no Super Admin)
const CREATABLE_ROLES: UserRole[] = ['Branch Admin', 'Finance Admin', 'Cashier']
type UserStatus = 'Active' | 'Pending Activation' | 'Inactive'

interface User {
  id: string
  username: string
  fullName: string
  email: string
  mobile: string
  branch: string
  role: UserRole
  createdDate: string
  status: UserStatus
  permissions: {
    adminStatus: boolean
    userCreation: boolean
    refundOrders: boolean
  }
}

// ── Data ─────────────────────────────────────────────────────────────────

const generateDummyUsers = (): User[] => {
  const users = [
    { username: 'admin.user', fullName: 'Admin User', email: 'admin@carnage.lk', mobile: '771234567', branch: 'Main Branch', role: 'Super Admin' as UserRole },
    { username: 'john.doe', fullName: 'John Doe', email: 'john.doe@carnage.lk', mobile: '771234568', branch: 'Colombo Central', role: 'Branch Admin' as UserRole },
    { username: 'sarah.smith', fullName: 'Sarah Smith', email: 'sarah.smith@carnage.lk', mobile: '771234569', branch: 'Kandy Branch', role: 'Finance Admin' as UserRole },
    { username: 'mike.johnson', fullName: 'Mike Johnson', email: 'mike.j@carnage.lk', mobile: '771234570', branch: 'Main Branch', role: 'Cashier' as UserRole },
    { username: 'lisa.wong', fullName: 'Lisa Wong', email: 'lisa.wong@carnage.lk', mobile: '771234571', branch: 'Galle Branch', role: 'Branch Admin' as UserRole },
    { username: 'robert.brown', fullName: 'Robert Brown', email: 'robert.b@carnage.lk', mobile: '771234572', branch: 'Negombo Branch', role: 'Finance Admin' as UserRole },
    { username: 'emma.davis', fullName: 'Emma Davis', email: 'emma.davis@carnage.lk', mobile: '771234573', branch: 'Colombo Central', role: 'Cashier' as UserRole },
    { username: 'alex.wilson', fullName: 'Alex Wilson', email: 'alex.w@carnage.lk', mobile: '771234574', branch: 'Kandy Branch', role: 'Cashier' as UserRole },
  ]
  const statuses: UserStatus[] = ['Active', 'Active', 'Active', 'Active', 'Active', 'Pending Activation', 'Active', 'Pending Activation']
  return users.map((user, i) => ({
    id: `user_${i + 1}`,
    ...user,
    createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: statuses[i],
    permissions: {
      adminStatus: user.role !== 'Cashier',
      userCreation: user.role === 'Super Admin' || user.role === 'Branch Admin',
      refundOrders: user.role !== 'Cashier'
    }
  }))
}

// ── Pills ────────────────────────────────────────────────────────────────

const STATUS_META: Record<UserStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  'Active': { label: 'Active', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Pending Activation': { label: 'Pending', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Inactive': { label: 'Inactive', dot: 'bg-gray-400', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
}

const ROLE_META: Record<UserRole, { bg: string; text: string; border: string }> = {
  'Super Admin':    { bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-200' },
  'Branch Admin':   { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200' },
  'Finance Admin':  { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200' },
  'Cashier':        { bg: 'bg-gray-100',   text: 'text-gray-700',   border: 'border-gray-200' },
}

function StatusPill({ status }: { status: UserStatus }) {
  const m = STATUS_META[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium", m.bg, m.text, m.border)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  )
}

function RolePill({ role }: { role: UserRole }) {
  const m = ROLE_META[role]
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium", m.bg, m.text, m.border)}>
      {role}
    </span>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ── Main Component ───────────────────────────────────────────────────────

export function ProfileManagement() {
  const [users, setUsers] = useState<User[]>(generateDummyUsers())

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Activation, deactivation, cancel-activation flows
  const [activationTargetUser, setActivationTargetUser] = useState<User | null>(null)
  const [activationPassword, setActivationPassword] = useState('')
  const [activationConfirm, setActivationConfirm] = useState('')
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null)
  const [cancelActivationTarget, setCancelActivationTarget] = useState<User | null>(null)

  // Drawer
  const [drawerUser, setDrawerUser] = useState<User | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Filters
  const [identifierType, setIdentifierType] = useState<string>('')
  const [identifierSearch, setIdentifierSearch] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [branchFilter, setBranchFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Form
  const [formData, setFormData] = useState({
    fullName: '', email: '', mobile: '', branch: '', role: '' as UserRole | '',
    status: 'Active' as UserStatus
  })
  const [createPerms, setCreatePerms] = useState({
    activateUser: true, initiateRefunds: false, initiatePartialRefunds: false, createProfiles: false,
  })
  const [permissionsData, setPermissionsData] = useState({
    adminStatus: false, userCreation: false, refundOrders: false,
  })

  const uniqueBranches = useMemo(() => Array.from(new Set(users.map(u => u.branch))).sort(), [users])

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (roleFilter !== 'all') n++
    if (branchFilter !== 'all') n++
    if (statusFilter !== 'all') n++
    return n
  }, [roleFilter, branchFilter, statusFilter])

  // Filtered + sorted
  const filtered = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (branchFilter !== 'all' && u.branch !== branchFilter) return false
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      if (identifierType && identifierSearch.trim() !== '') {
        const t = identifierSearch.toLowerCase().trim()
        switch (identifierType) {
          case 'username':  if (!u.username.toLowerCase().includes(t)) return false; break
          case 'full-name': if (!u.fullName.toLowerCase().includes(t)) return false; break
          case 'email':     if (!u.email.toLowerCase().includes(t)) return false; break
          case 'mobile':    if (!u.mobile.includes(t)) return false; break
        }
      }
      return true
    })
  }, [users, identifierType, identifierSearch, roleFilter, branchFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = useMemo(() =>
    filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  , [filtered, currentPage])

  // Active + pending counts
  const activeCount = useMemo(() => users.filter(u => u.status === 'Active').length, [users])
  const pendingCount = useMemo(() => users.filter(u => u.status === 'Pending Activation').length, [users])

  // ── Handlers ─────────────────────────────────────────────────────────

  const handleCreateUser = () => {
    if (!formData.role) return
    const username = formData.fullName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')
    const mobile = formData.mobile.startsWith('77') ? formData.mobile : `77${formData.mobile.slice(-7)}`
    const newUser: User = {
      id: `user_${users.length + 1}`,
      username,
      fullName: formData.fullName,
      email: formData.email,
      mobile,
      branch: formData.branch,
      role: formData.role as UserRole,
      // New accounts always start in Pending Activation; user activates via emailed link
      status: 'Pending Activation',
      createdDate: new Date().toISOString().split('T')[0],
      permissions: {
        adminStatus: createPerms.activateUser,
        userCreation: createPerms.createProfiles,
        refundOrders: createPerms.initiateRefunds,
      },
    }
    setUsers([newUser, ...users])
    toast.success("Activation link sent", {
      description: `An activation link has been emailed to ${formData.email}. The account is pending until the user sets their password.`,
    })
    setIsCreateModalOpen(false)
    setFormData({ fullName: '', email: '', mobile: '', branch: '', role: '', status: 'Active' })
    setCreatePerms({ activateUser: true, initiateRefunds: false, initiatePartialRefunds: false, createProfiles: false })
  }

  // Simulate the recipient clicking the emailed activation link and setting a password.
  const openActivationFlow = (user: User) => {
    setActivationTargetUser(user)
    setActivationPassword('')
    setActivationConfirm('')
  }

  const confirmActivation = () => {
    if (!activationTargetUser) return
    if (activationPassword.length < 8 || activationPassword !== activationConfirm) return
    setUsers(prev => prev.map(u => u.id === activationTargetUser.id ? { ...u, status: 'Active' } : u))
    toast.success("Account activated", { description: `${activationTargetUser.fullName} can now log in.` })
    setActivationTargetUser(null)
    setActivationPassword('')
    setActivationConfirm('')
  }

  const confirmDeactivate = () => {
    if (!deactivateTarget) return
    setUsers(prev => prev.map(u => u.id === deactivateTarget.id ? { ...u, status: 'Inactive' } : u))
    toast.success("Account deactivated", { description: `${deactivateTarget.fullName} can no longer access the portal.` })
    setDeactivateTarget(null)
  }

  const confirmCancelActivation = () => {
    if (!cancelActivationTarget) return
    setUsers(prev => prev.filter(u => u.id !== cancelActivationTarget.id))
    toast.success("Activation cancelled", { description: `The pending account for ${cancelActivationTarget.fullName} has been removed.` })
    setCancelActivationTarget(null)
  }

  const handleEditUser = () => {
    if (!selectedUser) return
    const mobile = formData.mobile.startsWith('77') ? formData.mobile : `77${formData.mobile.slice(-7)}`
    setUsers(users.map(u => u.id === selectedUser.id ? {
      ...u, email: formData.email, mobile, role: (formData.role || u.role) as UserRole, status: formData.status
    } : u))
    setIsEditModalOpen(false)
    setSelectedUser(null)
    toast.success("User updated")
  }

  const handleUpdatePermissions = () => {
    if (!selectedUser) return
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, permissions: { ...permissionsData } } : u))
    setIsPermissionsModalOpen(false)
    setSelectedUser(null)
    toast.success("Permissions updated")
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      fullName: user.fullName, email: user.email, mobile: user.mobile,
      branch: user.branch, role: user.role, status: user.status,
    })
    setIsEditModalOpen(true)
  }

  const openPermissionsModal = (user: User) => {
    setSelectedUser(user)
    setPermissionsData({ ...user.permissions })
    setIsPermissionsModalOpen(true)
  }

  const handleResetPassword = (user: User) => {
    const link = `https://portal.carnage.lk/reset-password?token=${btoa(user.username + Date.now())}`
    navigator.clipboard.writeText(link)
    toast.success("Reset link sent", { description: `An email has been sent to ${user.email}.` })
  }

  const handleSendActivationLink = (user: User) => {
    toast.success("Activation link sent", { description: `Activation email sent to ${user.email}.` })
  }

  const resetFilters = () => {
    setIdentifierType('')
    setIdentifierSearch('')
    setRoleFilter('all')
    setBranchFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
    setIsFiltersExpanded(false)
  }

  const handleRowClick = (user: User) => {
    setDrawerUser(user)
    setIsDrawerOpen(true)
  }

  // Form validation
  const isCreateFormValid = useMemo(() => (
    formData.fullName.trim() !== '' &&
    validateEmail(formData.email) &&
    formData.mobile.replace(/\s/g, '').length === 9 &&
    formData.branch !== '' &&
    formData.role !== ''
  ), [formData])

  const isEditFormValid = useMemo(() => (
    validateEmail(formData.email) &&
    formData.mobile.replace(/\s/g, '').length === 9
  ), [formData])

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 min-w-0">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">User Profiles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="h-10 gap-2">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Create User</span>
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-xl border border-border/40 flex-wrap">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Users</span>
          <span className="text-xl font-bold text-foreground tabular-nums">{users.length}</span>
        </div>
        <div className="w-px bg-border/60 self-stretch hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active</span>
          <span className="text-xl font-bold text-emerald-600 tabular-nums">{activeCount}</span>
        </div>
        <div className="w-px bg-border/60 self-stretch hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending Activation</span>
          <span className="text-xl font-bold text-amber-600 tabular-nums">{pendingCount}</span>
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
              <SelectItem value="full-name">Full Name</SelectItem>
              <SelectItem value="username">Username</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={
              identifierType === 'full-name' ? 'Enter full name' :
              identifierType === 'username' ? 'Enter username' :
              identifierType === 'email' ? 'Enter email' :
              identifierType === 'mobile' ? 'Enter mobile' :
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
          {filtered.length} of {users.length}
        </div>
      </div>

      {/* More filters expanded */}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-800">Role</label>
                <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | 'all')}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="All Roles" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {(['Super Admin', 'Branch Admin', 'Finance Admin', 'Cashier'] as UserRole[]).map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <label className="text-sm font-medium text-gray-800">Status</label>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus | 'all')}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending Activation">Pending Activation</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
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
          <table className="w-full table-fixed border-separate border-spacing-0 min-w-[900px]">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[220px]">User</th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[200px]">Email</th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[140px]">Mobile</th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[140px]">Branch</th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[140px]">Role</th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[130px]">Status</th>
                <th className="px-4 first:pl-6 last:pr-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center first:text-left last:text-right leading-tight align-top border-b border-border/60 w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Search className="h-8 w-8 opacity-30" />
                      <div>
                        <p className="text-sm font-medium">No users found</p>
                        <p className="text-xs mt-0.5">Try adjusting your search or filters</p>
                      </div>
                      <button onClick={resetFilters} className="text-xs text-gray-700 hover:underline mt-1">Clear all filters</button>
                    </div>
                  </td>
                </tr>
              )}
              {paginated.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user)}
                  className="group cursor-pointer transition-all duration-150 hover:relative hover:z-10 [&:hover>td]:bg-white [&:hover>td]:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                >
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right whitespace-nowrap">
                    <div className="font-medium text-foreground truncate">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground truncate">@{user.username}</div>
                  </td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right text-foreground font-medium whitespace-nowrap truncate">{user.email}</td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right text-foreground font-medium whitespace-nowrap">+94 {user.mobile}</td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right text-foreground font-medium whitespace-nowrap truncate">{user.branch}</td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right"><RolePill role={user.role} /></td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right"><StatusPill status={user.status} /></td>
                  <td className="px-4 first:pl-6 last:pr-6 py-3.5 text-sm border-b border-border/40 text-center first:text-left last:text-right">
                    {user.role === 'Super Admin' ? (
                      <div className="inline-flex items-center gap-1.5 opacity-50 pointer-events-none select-none" title="Super Admin actions are locked">
                        <Button size="sm" disabled className="h-8 w-[80px] px-3 text-xs">Edit</Button>
                        <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); openEditModal(user) }}
                          className="h-8 w-[80px] px-3 text-xs"
                        >
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => openPermissionsModal(user)}>
                              <Shield className="mr-2 h-4 w-4" />Permissions
                            </DropdownMenuItem>
                            {user.status === 'Active' && (
                              <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                <Key className="mr-2 h-4 w-4" />Reset Password
                              </DropdownMenuItem>
                            )}
                            {user.status === 'Pending Activation' && (
                              <>
                                <DropdownMenuItem onClick={() => handleSendActivationLink(user)}>
                                  <Mail className="mr-2 h-4 w-4" />Resend Activation Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openActivationFlow(user)}>
                                  <Key className="mr-2 h-4 w-4" />Open Activation Page
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setCancelActivationTarget(user)}
                                  className="text-red-700 focus:text-red-700"
                                >
                                  <X className="mr-2 h-4 w-4" />Cancel Activation
                                </DropdownMenuItem>
                              </>
                            )}
                            {user.status === 'Active' && (
                              <DropdownMenuItem
                                onClick={() => setDeactivateTarget(user)}
                                className="text-red-700 focus:text-red-700"
                              >
                                <X className="mr-2 h-4 w-4" />Deactivate Account
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profiles — mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {paginated.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-xl p-8 flex flex-col items-center gap-3 text-muted-foreground">
            <Search className="h-8 w-8 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-medium">No users found</p>
              <p className="text-xs mt-0.5">Try adjusting your search or filters</p>
            </div>
            <button onClick={resetFilters} className="text-xs text-gray-700 hover:underline mt-1">Clear all filters</button>
          </div>
        ) : (
          paginated.map((user) => (
            <div
              key={user.id}
              role="button"
              tabIndex={0}
              onClick={() => handleRowClick(user)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick(user) } }}
              className="bg-card border border-border/60 rounded-xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-foreground/20 active:scale-[0.995]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-base font-semibold text-foreground break-words">{user.fullName}</span>
                  <span className="text-xs text-muted-foreground break-all mt-1">@{user.username}</span>
                </div>
                <StatusPill status={user.status} />
              </div>

              <div className="border-t border-border/40 pt-3 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Email</span>
                  <span className="text-sm font-medium text-foreground break-all max-w-[65%] text-right">{user.email}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Mobile</span>
                  <span className="text-sm font-medium text-foreground tabular-nums">+94 {user.mobile}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">Branch</span>
                  <span className="text-sm font-medium text-foreground break-words max-w-[65%] text-right">{user.branch}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Role</span>
                  <RolePill role={user.role} />
                </div>
              </div>

              <div className="border-t border-border/40 pt-3 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <span>Tap for full details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>

              {user.role === 'Super Admin' ? (
                <div className="flex items-center gap-2 opacity-50 pointer-events-none select-none" onClick={(e) => e.stopPropagation()} title="Super Admin actions are locked">
                  <Button size="sm" disabled className="flex-1 h-10 text-sm">Edit</Button>
                  <Button variant="outline" size="sm" disabled className="h-10 w-10 p-0 flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); openEditModal(user) }}
                  className="flex-1 h-10 text-sm"
                >
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => openPermissionsModal(user)}>
                      <Shield className="mr-2 h-4 w-4" />Permissions
                    </DropdownMenuItem>
                    {user.status === 'Active' && (
                      <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                        <Key className="mr-2 h-4 w-4" />Reset Password
                      </DropdownMenuItem>
                    )}
                    {user.status === 'Pending Activation' && (
                      <>
                        <DropdownMenuItem onClick={() => handleSendActivationLink(user)}>
                          <Mail className="mr-2 h-4 w-4" />Resend Activation Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openActivationFlow(user)}>
                          <Key className="mr-2 h-4 w-4" />Open Activation Page
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setCancelActivationTarget(user)}
                          className="text-red-700 focus:text-red-700"
                        >
                          <X className="mr-2 h-4 w-4" />Cancel Activation
                        </DropdownMenuItem>
                      </>
                    )}
                    {user.status === 'Active' && (
                      <DropdownMenuItem
                        onClick={() => setDeactivateTarget(user)}
                        className="text-red-700 focus:text-red-700"
                      >
                        <X className="mr-2 h-4 w-4" />Deactivate Account
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              )}
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

      {/* ── Side Drawer ──────────────────────────────────────── */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 gap-0 flex flex-col">
          {drawerUser && (
            <>
              <div className="px-6 pt-6 pb-5 border-b border-border/60 pr-12">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">User</p>
                    <SheetTitle className="text-xl font-bold truncate">{drawerUser.fullName}</SheetTitle>
                  </div>
                  <StatusPill status={drawerUser.status} />
                </div>
                <SheetDescription className="text-xs text-muted-foreground font-mono">@{drawerUser.username}</SheetDescription>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Contact</p>
                  <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-mono text-xs text-foreground">{drawerUser.email}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Mobile</span>
                      <span className="font-mono text-xs text-foreground">+94 {drawerUser.mobile}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Account</p>
                  <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Role</span>
                      <RolePill role={drawerUser.role} />
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Branch</span>
                      <span className="text-foreground">{drawerUser.branch}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span className="text-foreground">{formatDate(drawerUser.createdDate)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Permissions</p>
                  <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
                    <PermRow label="Admin status" enabled={drawerUser.permissions.adminStatus} />
                    <PermRow label="User creation" enabled={drawerUser.permissions.userCreation} />
                    <PermRow label="Refund orders" enabled={drawerUser.permissions.refundOrders} />
                  </div>
                </div>
              </div>
              <div className="border-t border-border/60 px-6 py-4 bg-muted/20">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => { setIsDrawerOpen(false); openEditModal(drawerUser) }}>
                    Edit
                  </Button>
                  <Button onClick={() => { setIsDrawerOpen(false); openPermissionsModal(drawerUser) }}>
                    Permissions
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Create User Modal ────────────────────────────────── */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Fill in the details below to add a new user account.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Full Name <span className="text-red-500">*</span></label>
                <Input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Enter full name" className="h-11" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Email <span className="text-red-500">*</span></label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@example.com" className="h-11" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Mobile <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">+94</span>
                  <Input type="tel" value={formData.mobile} onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, '')
                    if (v.length > 9) v = v.slice(0, 9)
                    setFormData({...formData, mobile: v})
                  }} placeholder="771234567" className="pl-12 h-11" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Branch <span className="text-red-500">*</span></label>
                <Select value={formData.branch} onValueChange={(v) => setFormData({...formData, branch: v})}>
                  <SelectTrigger className="h-11 text-sm"><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>{uniqueBranches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Role <span className="text-red-500">*</span></label>
              <Select value={formData.role || ''} onValueChange={(v) => setFormData({...formData, role: v as UserRole})}>
                <SelectTrigger className="h-11 text-sm"><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {CREATABLE_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/20 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Permissions</p>
              <PermSwitchRow label="Initiate Refunds" description="Allow user to process customer refunds" checked={createPerms.initiateRefunds} onChange={(c) => setCreatePerms({...createPerms, initiateRefunds: c, ...(c ? {} : { initiatePartialRefunds: false })})} />
              <div className="pl-4 border-l-2 border-border/40">
                <PermSwitchRow
                  label="Initiate Partial Refund"
                  description="Allow user to issue refunds for only part of an order"
                  checked={createPerms.initiatePartialRefunds}
                  onChange={(c) => setCreatePerms({...createPerms, initiatePartialRefunds: c})}
                  disabled={!createPerms.initiateRefunds}
                />
                {!createPerms.initiateRefunds && (
                  <p className="text-[11px] text-muted-foreground mt-1">Enable "Initiate Refunds" first.</p>
                )}
              </div>
              <PermSwitchRow label="Create Profiles" description="Allow user to create new user accounts" checked={createPerms.createProfiles} onChange={(c) => setCreatePerms({...createPerms, createProfiles: c})} />
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
              <Mail className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800 leading-relaxed">
                The account will be created in <span className="font-semibold">Pending Activation</span>. An activation link will be emailed to the user. They must set a password to complete activation.
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/40 mt-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateUser} disabled={!isCreateFormValid}>Send Activation Link</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Modal ──────────────────────────────────────── */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>{selectedUser?.fullName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Email <span className="text-red-500">*</span></label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-11" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Mobile <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none">+94</span>
                <Input type="tel" value={formData.mobile} onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '')
                  if (v.length > 9) v = v.slice(0, 9)
                  setFormData({...formData, mobile: v})
                }} className="pl-12 h-11" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select value={formData.role || ''} onValueChange={(v) => setFormData({...formData, role: v as UserRole})}>
                <SelectTrigger className="h-11 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Branch Admin">Branch Admin</SelectItem>
                  <SelectItem value="Finance Admin">Finance Admin</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v as UserStatus})}>
                <SelectTrigger className="h-11 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending Activation">Pending Activation</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser} disabled={!isEditFormValid}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Permissions Modal ───────────────────────────────── */}
      <Dialog open={isPermissionsModalOpen} onOpenChange={setIsPermissionsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>{selectedUser?.fullName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 rounded-xl border border-border/40 bg-muted/20 p-4">
            <PermSwitchRow label="Admin Status" description="Grant administrative privileges" checked={permissionsData.adminStatus} onChange={(c) => setPermissionsData({...permissionsData, adminStatus: c})} />
            <PermSwitchRow label="User Creation" description="Allow creating new user accounts" checked={permissionsData.userCreation} onChange={(c) => setPermissionsData({...permissionsData, userCreation: c})} />
            <PermSwitchRow label="Refund Orders" description="Process order refunds and returns" checked={permissionsData.refundOrders} onChange={(c) => setPermissionsData({...permissionsData, refundOrders: c})} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsPermissionsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdatePermissions}>Update Permissions</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Activation Page (simulated email link) ──────────── */}
      <Dialog open={!!activationTargetUser} onOpenChange={(open) => { if (!open) setActivationTargetUser(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activate your account</DialogTitle>
            <DialogDescription>
              {activationTargetUser ? (
                <>You're activating <span className="font-medium text-foreground">{activationTargetUser.fullName}</span> ({activationTargetUser.email}). Set a password to complete activation.</>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">New password <span className="text-red-500">*</span></label>
              <Input
                type="password"
                value={activationPassword}
                onChange={(e) => setActivationPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Confirm password <span className="text-red-500">*</span></label>
              <Input
                type="password"
                value={activationConfirm}
                onChange={(e) => setActivationConfirm(e.target.value)}
                placeholder="Re-enter password"
                className="h-11"
              />
              {activationConfirm.length > 0 && activationConfirm !== activationPassword && (
                <span className="text-xs text-red-600">Passwords do not match.</span>
              )}
              {activationPassword.length > 0 && activationPassword.length < 8 && (
                <span className="text-xs text-red-600">Password must be at least 8 characters.</span>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border/40 mt-2">
            <Button variant="outline" onClick={() => setActivationTargetUser(null)}>Cancel</Button>
            <Button
              onClick={confirmActivation}
              disabled={activationPassword.length < 8 || activationPassword !== activationConfirm}
            >
              Activate account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Deactivate Confirmation ─────────────────────────── */}
      <Dialog open={!!deactivateTarget} onOpenChange={(open) => { if (!open) setDeactivateTarget(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate this account?</DialogTitle>
            <DialogDescription>
              {deactivateTarget ? (
                <><span className="font-medium text-foreground">{deactivateTarget.fullName}</span> will no longer be able to log in. You can reactivate the account later from the user record.</>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={() => setDeactivateTarget(null)}>Keep active</Button>
            <Button onClick={confirmDeactivate} className="bg-red-600 text-white hover:bg-red-700">
              Yes, deactivate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Cancel Activation Confirmation ──────────────────── */}
      <Dialog open={!!cancelActivationTarget} onOpenChange={(open) => { if (!open) setCancelActivationTarget(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel pending activation?</DialogTitle>
            <DialogDescription>
              {cancelActivationTarget ? (
                <>The pending account for <span className="font-medium text-foreground">{cancelActivationTarget.fullName}</span> will be removed and the activation link will stop working. This cannot be undone.</>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={() => setCancelActivationTarget(null)}>Keep pending</Button>
            <Button onClick={confirmCancelActivation} className="bg-red-600 text-white hover:bg-red-700">
              Yes, cancel activation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────

function PermRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex justify-between items-center px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium",
        enabled
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-gray-100 text-gray-600 border-gray-200"
      )}>
        <span className={cn("w-1.5 h-1.5 rounded-full", enabled ? "bg-emerald-500" : "bg-gray-400")} />
        {enabled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  )
}

function PermSwitchRow({ label, description, checked, onChange, disabled }: { label: string; description: string; checked: boolean; onChange: (c: boolean) => void; disabled?: boolean }) {
  return (
    <div className={cn("flex items-start justify-between gap-3", disabled && "opacity-50")}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}
