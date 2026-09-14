// @ts-nocheck
import { ArrowUpDown } from "lucide-react"
import { cn } from "../ui/utils"

interface TableHeaderProps {
  title: string
  sortable?: boolean
  onSort?: () => void
  className?: string
  align?: 'left' | 'center' | 'right'
  width?: string
}

export function TableHeader({ 
  title, 
  sortable = false, 
  onSort, 
  className,
  align = 'center',
  width 
}: TableHeaderProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right'
  }[align]

  return (
    <th className={cn(
      "px-6 py-4 text-sm font-medium text-muted-foreground dark:text-[#a6adbb]",
      alignClass,
      width,
      className
    )}>
      {sortable ? (
        <button
          onClick={onSort}
          className={cn(
            "flex items-center gap-1 hover:text-foreground transition-colors",
            align === 'center' && "justify-center",
            align === 'left' && "justify-start", 
            align === 'right' && "justify-end"
          )}
        >
          {title} <ArrowUpDown className="h-3 w-3" />
        </button>
      ) : (
        <span className={cn(
          "block",
          align === 'center' && "text-center",
          align === 'left' && "text-left",
          align === 'right' && "text-right"
        )}>
          {title}
        </span>
      )}
    </th>
  )
}