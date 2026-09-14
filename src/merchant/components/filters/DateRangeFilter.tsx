// @ts-nocheck
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface DateRangeFilterProps {
  dateFilter: string
  startDate: string
  endDate: string
  onDateFilterChange: (value: string) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onApplyDateRange: () => void
  onClearDateRange: () => void
}

export function DateRangeFilter({
  dateFilter,
  startDate,
  endDate,
  onDateFilterChange,
  onStartDateChange,
  onEndDateChange,
  onApplyDateRange,
  onClearDateRange
}: DateRangeFilterProps) {
  const getDateFilterDisplayValue = () => {
    if (dateFilter === 'custom' && (startDate || endDate)) {
      if (startDate && endDate) {
        return 'Custom Range'
      } else if (startDate) {
        return `From ${new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
      } else if (endDate) {
        return `Until ${new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
      }
    }
    
    switch (dateFilter) {
      case 'today': return 'Today'
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      default: return 'All Dates'
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">DATE RANGE</label>
      <Select value={dateFilter} onValueChange={onDateFilterChange}>
        <SelectTrigger className="w-full h-10 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent dark:bg-input dark:border-border">
          <SelectValue placeholder="All Dates">
            {getDateFilterDisplayValue()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <div className="px-2 py-2 border-t border-border">
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Custom Date Range</div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Start Date</label>
                  <div className="h-8">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => onStartDateChange(e.target.value)}
                      className="w-full h-full text-xs bg-input-background border border-border rounded-lg appearance-none shadow-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary dark:bg-input dark:border-border px-2"
                      style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">End Date</label>
                  <div className="h-8">
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => onEndDateChange(e.target.value)}
                      className="w-full h-full text-xs bg-input-background border border-border rounded-lg appearance-none shadow-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary dark:bg-input dark:border-border px-2"
                      style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 text-xs flex-1"
                    onClick={onApplyDateRange}
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs flex-1 border-border dark:border-border"
                    onClick={onClearDateRange}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SelectContent>
      </Select>
    </div>
  )
}