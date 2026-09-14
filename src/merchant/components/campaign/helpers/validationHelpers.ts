// @ts-nocheck
import { FormData } from '../types'

export const validateChannelSelection = (formData: FormData): boolean => {
  return formData.platforms.socialMedia || formData.platforms.inStore || formData.platforms.website
}

export const validateFormSubmission = (formData: FormData): string | null => {
  // Check required date fields
  if (!formData.startDate || !formData.endDate) {
    return 'Please select both start and end dates'
  }
  
  // Validate that at least one channel is selected
  if (!validateChannelSelection(formData)) {
    return 'Please select at least one campaign channel'
  }
  
  // Validate discount application method is selected
  if (!formData.applyDiscountThrough) {
    return 'Please select a discount application method'
  }
  
  // For Merchant's System, validate discount structure
  if (formData.applyDiscountThrough === 'merchant') {
    if (!formData.discountType) {
      return 'Please select a discount structure'
    }
    
    if (formData.discountType === 'flat' && !formData.flatPercentage) {
      return 'Please enter a discount percentage'
    }
  }

  return null
}

export const shouldShowCampaignLimits = (formData: FormData): boolean => {
  const isKokoGateway = formData.applyDiscountThrough === 'koko'
  const isMerchantSystem = formData.applyDiscountThrough === 'merchant'
  const isSelectedProducts = formData.discountType === 'selected-products'
  
  // Only show limits for:
  // 1. Koko's Gateway with flat percentage
  // 2. Merchant's System with flat percentage (NOT for selected products)
  return (isKokoGateway || (isMerchantSystem && !isSelectedProducts)) && 
         (formData.flatPercentage || formData.discountType === 'flat' || isKokoGateway)
}

export const isFormComplete = (formData: FormData): boolean => {
  // 1. Check required date fields (mandatory)
  if (!formData.startDate || !formData.endDate) {
    return false
  }
  
  // 2. Check if at least one channel is selected (mandatory)
  if (!validateChannelSelection(formData)) {
    return false
  }
  
  // 3. Check if discount application method is selected (mandatory)
  if (!formData.applyDiscountThrough) {
    return false
  }
  
  // 4. For Koko's Gateway - no additional required fields (maxDiscount and minPurchase are optional)
  // For Merchant's System, check discount structure selection and required fields
  if (formData.applyDiscountThrough === 'merchant') {
    if (!formData.discountType) {
      return false
    }
    
    // If flat percentage is selected, percentage is required
    if (formData.discountType === 'flat' && !formData.flatPercentage) {
      return false
    }
    
    // Selected products doesn't require additional fields to be filled
  }
  
  return true
}