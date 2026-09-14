// @ts-nocheck
import { cn } from "./ui/utils"

// Role type
type UserRole = 'super admin' | 'cashier' | 'branch admin' | 'finance admin'

// Specialized Role Badge Component for Action History
interface ActionHistoryRoleBadgeProps {
  role: UserRole
  className?: string
}

export function ActionHistoryRoleBadge({ role, className }: ActionHistoryRoleBadgeProps) {
  const getRoleBadgeColors = (role: UserRole) => {
    switch (role) {
      case 'super admin':
        return {
          borderColor: 'border-red-500',
          textColor: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/30'
        }
      case 'finance admin':
        return {
          borderColor: 'border-blue-500',
          textColor: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/30'
        }
      case 'branch admin':
        return {
          borderColor: 'border-orange-500',
          textColor: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-950/30'
        }
      case 'cashier':
        return {
          borderColor: 'border-green-500',
          textColor: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950/30'
        }
      default:
        return {
          borderColor: 'border-gray-500',
          textColor: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-950/30'
        }
    }
  }

  const colors = getRoleBadgeColors(role)
  const displayText = role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return (
    <div 
      className={cn(
        "relative rounded-[30.4px] inline-flex h-7 w-32",
        colors.bgColor,
        className
      )} 
      data-name="ActionHistoryRoleBadge"
    >
      <div className={cn("absolute border border-solid inset-0 pointer-events-none rounded-[30.4px]", colors.borderColor)} />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-2 items-center justify-center px-4 py-0 relative size-full">
          <div className={cn("flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap", colors.textColor)}>
            <p className="leading-[20px] whitespace-pre truncate">{displayText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}