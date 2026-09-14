// @ts-nocheck
import React from "react"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { Calendar } from "../../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { cn } from "../../ui/utils"
import { FormData } from '../types'
import { getCampaignDateRange, isDateInCampaignRange, formatDateForDisplay } from '../helpers/dateHelpers'

interface CampaignDurationSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  isReadOnly: boolean
}

export function CampaignDurationSection({ formData, updateFormData, isReadOnly }: CampaignDurationSectionProps) {
  const { campaignStartDate, campaignEndDate } = getCampaignDateRange()

  return (
    <div className="space-y-8 p-6 rounded-xl border border-border/50 bg-card/30 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">Campaign Duration</h3>
        <p className="text-muted-foreground text-lg leading-relaxed">Set your participation period (Nov 29 - Dec 2, 2024)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <Label htmlFor="startDate" className="text-lg font-semibold mb-4 block text-foreground">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left h-14 text-lg px-6 border-2 hover:border-ring/50 transition-colors",
                  !formData.startDate && "text-muted-foreground"
                )}
                disabled={isReadOnly}
              >
                {formData.startDate ? formatDateForDisplay(formData.startDate) : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => updateFormData({ startDate: date })}
                disabled={(date) => !isDateInCampaignRange(date)}
                fromDate={campaignStartDate}
                toDate={campaignEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="endDate" className="text-lg font-semibold mb-4 block text-foreground">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left h-14 text-lg px-6 border-2 hover:border-ring/50 transition-colors",
                  !formData.endDate && "text-muted-foreground"
                )}
                disabled={isReadOnly}
              >
                {formData.endDate ? formatDateForDisplay(formData.endDate) : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => updateFormData({ endDate: date })}
                disabled={(date) => !isDateInCampaignRange(date) || (formData.startDate && date < formData.startDate)}
                fromDate={formData.startDate || campaignStartDate}
                toDate={campaignEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}