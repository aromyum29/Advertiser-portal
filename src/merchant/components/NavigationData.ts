// @ts-nocheck
import {
  PlusIcon,
  ArchiveBoxIcon,
  QrCodeIcon,
  ChartBarIcon,
  MegaphoneIcon,
  DevicePhoneMobileIcon,
  WalletIcon,
  ClockIcon,
  UserGroupIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/outline"

export interface NavigationItem {
  id: string
  title: string
  icon: any
  hasSecondary?: boolean
  badge?: {
    count: number
    variant?: 'default' | 'destructive' | 'secondary'
  }
  secondaryItems?: Array<{
    id: string
    title: string
    badge?: {
      count: number
      variant?: 'default' | 'destructive' | 'secondary'
    }
  }>
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'create-order',
    title: 'Create Order',
    icon: PlusIcon,
    hasSecondary: false
  },
  {
    id: 'orders',
    title: 'Orders',
    icon: ArchiveBoxIcon,
    hasSecondary: false
  },
  {
    id: 'static-qr',
    title: 'Static QR',
    icon: QrCodeIcon,
    hasSecondary: false
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: ChartBarIcon,
    hasSecondary: false
  },
  {
    id: 'campaign',
    title: 'Campaigns',
    icon: MegaphoneIcon,
    hasSecondary: false,
    badge: {
      count: 2,
      variant: 'default'
    }
  },
  {
    id: 'advertise-with-koko',
    title: 'Advertise with Koko',
    icon: DevicePhoneMobileIcon,
    hasSecondary: false
  },
  {
    id: 'plugins',
    title: 'Plugins',
    icon: PuzzlePieceIcon,
    hasSecondary: false
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: WalletIcon,
    hasSecondary: false
  },
  {
    id: 'profile-management',
    title: 'Profiles',
    icon: UserGroupIcon,
    hasSecondary: false
  },
  {
    id: 'action-history',
    title: 'Action History',
    icon: ClockIcon,
    hasSecondary: false
  }
]
