// @ts-nocheck
import { useState } from "react"
import { ChevronDown, ChevronRight, Filter, RefreshCw, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"

interface FilterOption {
  value: string
  label: string
}

interface CommonFiltersProps {
  // Identifier search
  identifierTypes: FilterOption[]
  identifierType: string
  identifierSearch: string
  onIdentifierTypeChange: (value: string) => void
  onIdentifierSearchChange: (value: string) => void
  
  // Expandable filters
  isExpanded: boolean
  onExpandToggle: () => void
  
  // Results count
  resultsCount: number
  totalCount: number
  
  // Clear functionality
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function CommonFilters({
  identifierTypes,
  identifierType,
  identifierSearch,
  onIdentifierTypeChange,
  onIdentifierSearchChange,
  isExpanded,
  onExpandToggle,
  resultsCount,
  totalCount,
  onClearFilters,
  hasActiveFilters
}: CommonFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 min-w-0">
        {/* Identifier Type Selector */}
        <Select value={identifierType} onValueChange={onIdentifierTypeChange}>
          <SelectTrigger className="w-full sm:w-56 h-10 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent dark:bg-input dark:border-border flex-shrink-0">
            <SelectValue placeholder="Select identifier type..." />
          </SelectTrigger>
          <SelectContent>
            {identifierTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Conditional Search Input */}
        {identifierType && (
          <div className="relative flex-1 min-w-0 sm:flex-initial h-10">
            <input
              placeholder={`Search by ${identifierTypes.find(t => t.value === identifierType)?.label}...`}
              value={identifierSearch}
              onChange={(e) => onIdentifierSearchChange(e.target.value)}
              className="w-full h-full bg-input-background border border-border rounded-lg text-sm pl-3 pr-10 py-2 appearance-none shadow-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary dark:bg-input/30 dark:border-border placeholder:text-muted-foreground"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                boxShadow: 'none'
              }}
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-foreground hover:bg-foreground/90 text-background"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* More Filters Toggle Button */}
        <Button
          variant="outline"
          onClick={onExpandToggle}
          className="h-10 gap-2 bg-input-background border border-border rounded-lg text-sm hover:bg-accent dark:bg-input dark:border-border dark:hover:bg-accent flex-shrink-0"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">More Filters</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex gap-3 sm:gap-4 flex-shrink-0">
        {/* Clear Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="h-10 gap-2 bg-input-background border border-border rounded-lg text-sm hover:bg-accent dark:bg-input dark:border-border dark:hover:bg-accent flex-shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground self-start sm:self-auto flex-shrink-0">
        {resultsCount} of {totalCount} items
      </div>
    </div>
  )
}