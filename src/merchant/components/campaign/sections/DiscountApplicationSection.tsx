// @ts-nocheck
import React from "react"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { FigmaRadioGroup, FigmaRadio } from "../../ui/figma-radio"
import { FormData } from '../types'

interface DiscountApplicationSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  isReadOnly: boolean
}

export function DiscountApplicationSection({ formData, updateFormData, isReadOnly }: DiscountApplicationSectionProps) {
  const isMerchantSystem = formData.applyDiscountThrough === 'merchant'
  
  // Set default to Koko's Gateway if not already set
  React.useEffect(() => {
    if (!formData.applyDiscountThrough) {
      updateFormData({ applyDiscountThrough: 'koko' })
    }
  }, [formData.applyDiscountThrough, updateFormData])

  // Ensure flat percentage is selected by default when merchant system is chosen
  React.useEffect(() => {
    if (isMerchantSystem && !formData.discountType) {
      updateFormData({ discountType: 'flat' })
    }
  }, [isMerchantSystem, formData.discountType, updateFormData])

  return (
    <div className="space-y-8 p-6 rounded-xl border border-border/50 bg-card/30 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">Discount Application</h3>
        <p className="text-muted-foreground text-lg leading-relaxed">Choose how discounts will be processed</p>
      </div>

      <div>
        <FigmaRadioGroup
          value={formData.applyDiscountThrough || 'koko'}
          onValueChange={(value) => {
            const selectedValue = value as 'koko' | 'merchant'
            updateFormData({ 
              applyDiscountThrough: selectedValue,
              // Auto-select flat percentage when merchant's system is selected
              discountType: selectedValue === 'merchant' ? 'flat' : '',
              flatPercentage: '',
              selectedProductsPercentage: '',
              selectedProductsUpTo: '',
              maxDiscountEnabled: false,
              maxDiscountAmount: '',
              minPurchaseEnabled: false,
              minPurchaseValue: ''
            })
          }}
          name="applyDiscountThrough"
          disabled={isReadOnly}
          className="space-y-8"
        >
          <FigmaRadio value="koko" id="koko">
            <div className="flex flex-col">
              <Label htmlFor="koko" className="text-lg font-semibold cursor-pointer text-foreground">Koko's Gateway</Label>
              <p className="text-muted-foreground text-base mt-2 leading-relaxed">Process discounts through Koko's payment system</p>
            </div>
          </FigmaRadio>
          
          <FigmaRadio value="merchant" id="merchant">
            <div className="flex flex-col">
              <Label htmlFor="merchant" className="text-lg font-semibold cursor-pointer text-foreground">Merchant's System</Label>
              <p className="text-muted-foreground text-base mt-2 leading-relaxed">Handle discounts through your own system</p>
            </div>
          </FigmaRadio>
        </FigmaRadioGroup>

        {/* Discount Structure Options - Only show when Merchant's System is selected */}
        {isMerchantSystem && (
          <div className="ml-8 mt-8">
            <div className="p-6 bg-muted/30 rounded-xl border border-muted shadow-sm">
              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
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
                disabled={false}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <FigmaRadio value="flat" id="flat">
                    <div className="flex flex-col">
                      <Label htmlFor="flat" className="text-lg font-semibold cursor-pointer text-foreground">Flat Percentage</Label>
                      <p className="text-muted-foreground text-base mt-2 leading-relaxed">Apply a fixed percentage discount on all items</p>
                    </div>
                  </FigmaRadio>
                  
                  {formData.discountType === 'flat' && (
                    <div className="ml-8">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Label htmlFor="flatPercentage" className="text-base font-semibold sm:min-w-fit text-foreground">Discount Percentage</Label>
                        <div className="flex items-center space-x-3">
                          <Input
                            id="flatPercentage"
                            type="number"
                            placeholder="0"
                            value={formData.flatPercentage}
                            onChange={(e) => updateFormData({ flatPercentage: e.target.value })}
                            className="w-20 h-12 text-lg border-2 hover:border-ring/50 transition-colors"
                            variant="compact"
                            disabled={isReadOnly}
                            min="0"
                            max="100"
                          />
                          <span className="text-muted-foreground font-semibold text-lg">%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <FigmaRadio value="selected-products" id="selected-products">
                    <div className="flex flex-col">
                      <Label htmlFor="selected-products" className="text-lg font-semibold cursor-pointer text-foreground">Selected Products</Label>
                      <p className="text-muted-foreground text-base mt-2 leading-relaxed">Apply variable percentage discount to specific product categories</p>
                    </div>
                  </FigmaRadio>
                  
                  {formData.discountType === 'selected-products' && (
                    <div className="ml-8 space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <Label htmlFor="selectedPercentage" className="text-base font-semibold sm:min-w-fit text-foreground">Discount %</Label>
                            <div className="flex items-center space-x-3">
                              <Input
                                id="selectedPercentage"
                                type="number"
                                placeholder="0"
                                value={formData.selectedProductsPercentage}
                                onChange={(e) => updateFormData({ selectedProductsPercentage: e.target.value })}
                                disabled={isReadOnly}
                                min="0"
                                max="100"
                                className="w-20 h-12 text-lg border-2 hover:border-ring/50 transition-colors"
                                variant="compact"
                              />
                              <span className="text-muted-foreground font-semibold text-lg">%</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <Label htmlFor="upToPercentage" className="text-base font-semibold sm:min-w-fit text-foreground">Maximum %</Label>
                            <div className="flex items-center space-x-3">
                              <Input
                                id="upToPercentage"
                                type="number"
                                placeholder="0"
                                value={formData.selectedProductsUpTo}
                                onChange={(e) => updateFormData({ selectedProductsUpTo: e.target.value })}
                                disabled={isReadOnly}
                                min="0"
                                max="100"
                                className="w-20 h-12 text-lg border-2 hover:border-ring/50 transition-colors"
                                variant="compact"
                              />
                              <span className="text-muted-foreground font-semibold text-lg">%</span>
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