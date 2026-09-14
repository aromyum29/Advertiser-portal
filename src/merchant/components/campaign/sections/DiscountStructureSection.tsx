// @ts-nocheck
import React from "react"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { FigmaRadioGroup, FigmaRadio } from "../../ui/figma-radio"
import { FormData } from '../types'

interface DiscountStructureSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  isReadOnly: boolean
}

export function DiscountStructureSection({ formData, updateFormData, isReadOnly }: DiscountStructureSectionProps) {
  const isKokoGateway = formData.applyDiscountThrough === 'koko'
  const isMerchantSystem = formData.applyDiscountThrough === 'merchant'

  // Ensure flat percentage is selected by default when merchant system is chosen
  React.useEffect(() => {
    if (isMerchantSystem && !formData.discountType) {
      updateFormData({ discountType: 'flat' })
    }
  }, [isMerchantSystem, formData.discountType, updateFormData])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-foreground">Discount Structure</h3>
        <p className="text-muted-foreground">Define your discount mechanism</p>
      </div>

      <div className="space-y-6">
        {isKokoGateway && (
          // Koko's Gateway: Only flat percentage option
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Flat Percentage</Label>
              <p className="text-muted-foreground text-xs mt-1">Apply a fixed percentage discount on all items</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Label htmlFor="flatPercentage" className="text-sm font-medium sm:min-w-fit">Discount Percentage</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="flatPercentage"
                  type="number"
                  placeholder="0"
                  value={formData.flatPercentage}
                  onChange={(e) => updateFormData({ flatPercentage: e.target.value })}
                  className="w-16"
                  variant="compact"
                  disabled={isReadOnly}
                  min="0"
                  max="100"
                />
                <span className="text-muted-foreground font-medium">%</span>
              </div>
            </div>
          </div>
        )}

        {isMerchantSystem && (
          // Merchant's System: Both flat percentage and selected products options
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-muted">
              <p className="text-sm text-muted-foreground mb-4">
                Choose your discount structure. You can apply a flat percentage to all items or set variable discounts for specific product categories.
              </p>
              <FigmaRadioGroup
                value={formData.discountType || 'flat'}
                onValueChange={(value) => updateFormData({ 
                  discountType: value as 'flat' | 'selected-products',
                  // Reset limits when switching discount types
                  maxDiscountEnabled: false,
                  maxDiscountAmount: '',
                  minPurchaseEnabled: false,
                  minPurchaseValue: ''
                })}
                name="discountType"
                disabled={isReadOnly}
                className="space-y-8"
              >
            <div className="space-y-4">
              <FigmaRadio value="flat" id="flat">
                <div className="flex flex-col">
                  <Label htmlFor="flat" className="text-sm font-medium cursor-pointer">Flat Percentage</Label>
                  <p className="text-muted-foreground text-xs mt-1">Apply a fixed percentage discount on all items</p>
                </div>
              </FigmaRadio>
              
              {formData.discountType === 'flat' && (
                <div className="ml-7">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Label htmlFor="flatPercentage" className="text-sm font-medium sm:min-w-fit">Discount Percentage</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="flatPercentage"
                        type="number"
                        placeholder="0"
                        value={formData.flatPercentage}
                        onChange={(e) => updateFormData({ flatPercentage: e.target.value })}
                        className="w-16"
                        variant="compact"
                        disabled={isReadOnly}
                        min="0"
                        max="100"
                      />
                      <span className="text-muted-foreground font-medium">%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <FigmaRadio value="selected-products" id="selected-products">
                <div className="flex flex-col">
                  <Label htmlFor="selected-products" className="text-sm font-medium cursor-pointer">Selected Products</Label>
                  <p className="text-muted-foreground text-xs mt-1">Apply variable percentage discount to specific product categories</p>
                </div>
              </FigmaRadio>
              
              {formData.discountType === 'selected-products' && (
                <div className="ml-7 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <Label htmlFor="selectedPercentage" className="text-sm font-medium sm:min-w-fit">Discount %</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="selectedPercentage"
                            type="number"
                            placeholder="0"
                            value={formData.selectedProductsPercentage}
                            onChange={(e) => updateFormData({ selectedProductsPercentage: e.target.value })}
                            disabled={isReadOnly}
                            min="0"
                            max="100"
                            className="w-16"
                            variant="compact"
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <Label htmlFor="upToPercentage" className="text-sm font-medium sm:min-w-fit">Maximum %</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="upToPercentage"
                            type="number"
                            placeholder="0"
                            value={formData.selectedProductsUpTo}
                            onChange={(e) => updateFormData({ selectedProductsUpTo: e.target.value })}
                            disabled={isReadOnly}
                            min="0"
                            max="100"
                            className="w-16"
                            variant="compact"
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FigmaRadioGroup>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}