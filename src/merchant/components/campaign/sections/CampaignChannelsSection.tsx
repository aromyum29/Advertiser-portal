// @ts-nocheck
import React from "react"
import { Label } from "../../ui/label"
import { Checkbox } from "../../ui/checkbox"
import { FormData } from '../types'
import { validateChannelSelection } from '../helpers/validationHelpers'

interface CampaignChannelsSectionProps {
  formData: FormData
  updatePlatforms: (platform: keyof FormData['platforms'], checked: boolean) => void
  isReadOnly: boolean
}

export function CampaignChannelsSection({ formData, updatePlatforms, isReadOnly }: CampaignChannelsSectionProps) {
  const hasSelectedChannel = validateChannelSelection(formData)
  
  return (
    <div className="space-y-8 p-6 rounded-xl border border-border/50 bg-card/30 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">Campaign Channels</h3>
        <p className="text-muted-foreground text-lg leading-relaxed">Select where this campaign will be active (at least one required)</p>
        {!hasSelectedChannel && !isReadOnly && (
          <p className="text-destructive text-base mt-3 font-medium">Please select at least one channel</p>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-6">
          <Checkbox
            id="socialMedia"
            checked={formData.platforms.socialMedia}
            onCheckedChange={(checked) => updatePlatforms('socialMedia', !!checked)}
            disabled={isReadOnly}
            className="mt-1 h-5 w-5"
          />
          <div className="flex-1">
            <Label htmlFor="socialMedia" className="text-lg font-semibold cursor-pointer text-foreground">Social Media Platforms</Label>
            <p className="text-muted-foreground text-base mt-2 leading-relaxed">Facebook, Instagram, Twitter campaigns</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-6">
          <Checkbox
            id="inStore"
            checked={formData.platforms.inStore}
            onCheckedChange={(checked) => updatePlatforms('inStore', !!checked)}
            disabled={isReadOnly}
            className="mt-1 h-5 w-5"
          />
          <div className="flex-1">
            <Label htmlFor="inStore" className="text-lg font-semibold cursor-pointer text-foreground">In-Store Experience</Label>
            <p className="text-muted-foreground text-base mt-2 leading-relaxed">Physical store locations and POS systems</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-6">
          <Checkbox
            id="website"
            checked={formData.platforms.website}
            onCheckedChange={(checked) => updatePlatforms('website', !!checked)}
            disabled={isReadOnly}
            className="mt-1 h-5 w-5"
          />
          <div className="flex-1">
            <Label htmlFor="website" className="text-lg font-semibold cursor-pointer text-foreground">Website & Online Store</Label>
            <p className="text-muted-foreground text-base mt-2 leading-relaxed">E-commerce website and online checkout</p>
          </div>
        </div>
      </div>
    </div>
  )
}