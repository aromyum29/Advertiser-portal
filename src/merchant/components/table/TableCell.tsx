// @ts-nocheck
import { cn } from "../ui/utils"

interface TableCellProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  mono?: boolean
}

export function TableCell({ 
  children, 
  className,
  align = 'center',
  fontWeight = 'normal',
  mono = false
}: TableCellProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align]

  const fontClass = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }[fontWeight]

  return (
    <td className={cn(
      "px-6 py-5 text-sm text-foreground dark:text-[#a6adbb]",
      alignClass,
      fontClass,
      mono && "font-mono",
      className
    )}>
      {children}
    </td>
  )
}