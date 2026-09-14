// @ts-nocheck
import React from "react"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Checkbox } from "../../ui/checkbox"
import { FormData } from '../types'
import { shouldShowCampaignLimits } from '../helpers/validationHelpers'

interface CampaignLimitsSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  isReadOnly: boolean
}

export function CampaignLimitsSection({ formData, updateFormData, isReadOnly }: CampaignLimitsSectionProps) {
  if (!shouldShowCampaignLimits(formData)) {
    return null
  }

  return (
    <div className="space-y-8 p-6 rounded-xl border border-border/50 bg-card/30 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">Campaign Limits</h3>
        <p className="text-muted-foreground text-lg leading-relaxed">Set optional spending and discount limits</p>
      </div>

      <div className="space-y-8">
        <div className="flex items-start space-x-6">
          <Checkbox
            id="maxDiscount"
            checked={formData.maxDiscountEnabled}
            onCheckedChange={(checked) => updateFormData({ maxDiscountEnabled: !!checked })}
            disabled={isReadOnly}
            className="mt-1 h-5 w-5"
          />
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="maxDiscount" className="text-lg font-semibold cursor-pointer text-foreground">Maximum Discount Amount</Label>
              <p className="text-muted-foreground text-base mt-2 leading-relaxed">Set a cap on the total discount amount</p>
            </div>
            {formData.maxDiscountEnabled && (
              <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
                <span className="text-muted-foreground font-semibold text-lg">Rs.</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => updateFormData({ maxDiscountAmount: e.target.value })}
                  className="h-12 text-lg border-2 hover:border-ring/50 transition-colors"
                  variant="compact"
                  disabled={isReadOnly}
                  min="0"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-6">
          <Checkbox
            id="minPurchase"
            checked={formData.minPurchaseEnabled}
            onCheckedChange={(checked) => updateFormData({ minPurchaseEnabled: !!checked })}
            disabled={isReadOnly}
            className="mt-1 h-5 w-5"
          />
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="minPurchase" className="text-lg font-semibold cursor-pointer text-foreground">Minimum Purchase Value</Label>
              <p className="text-muted-foreground text-base mt-2 leading-relaxed">Require a minimum order amount</p>
            </div>
            {formData.minPurchaseEnabled && (
              <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
                <span className="text-muted-foreground font-semibold text-lg">Rs.</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.minPurchaseValue}
                  onChange={(e) => updateFormData({ minPurchaseValue: e.target.value })}
                  className="h-12 text-lg border-2 hover:border-ring/50 transition-colors"
                  variant="compact"
                  disabled={isReadOnly}
                  min="0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}