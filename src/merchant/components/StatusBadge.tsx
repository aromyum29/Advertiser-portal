// @ts-nocheck
import { cn } from "./ui/utils"

interface StatusBadgeProps {
  children: React.ReactNode
  variant?: 'successful' | 'pending' | 'cancelled' | 'refunded' | 'failed'
  className?: string
}

const getTextColor = (variant: StatusBadgeProps['variant']) => {
  switch (variant) {
    case 'successful':
      return 'text-green-600 dark:text-green-400'
    case 'pending':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'cancelled':
      return 'text-gray-600 dark:text-gray-400'
    case 'refunded':
      return 'text-blue-600 dark:text-blue-400'
    case 'failed':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

export function StatusBadge({ children, variant, className }: StatusBadgeProps) {
  const textColor = getTextColor(variant);

  return (
    <span className={cn("text-sm font-medium", textColor, className)}>
      {children}
    </span>
  )
}