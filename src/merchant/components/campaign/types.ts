// @ts-nocheck
export interface JoinCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  campaignName: string
  campaignStartDate: string
  campaignEndDate: string
  mode?: 'view' | 'edit' | 'join'
}

export interface FormData {
  startDate: Date | undefined
  endDate: Date | undefined
  applyDiscountThrough: 'koko' | 'merchant'
  discountType: 'flat' | 'selected-products' | ''
  flatPercentage: string
  selectedProductsPercentage: string
  selectedProductsUpTo: string
  maxDiscountEnabled: boolean
  maxDiscountAmount: string
  minPurchaseEnabled: boolean
  minPurchaseValue: string
  platforms: {
    socialMedia: boolean
    inStore: boolean
    website: boolean
  }
}