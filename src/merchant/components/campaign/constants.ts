// @ts-nocheck
import { FormData } from './types'

export const INITIAL_FORM_DATA: FormData = {
  startDate: undefined,
  endDate: undefined,
  applyDiscountThrough: 'koko',
  discountType: '',
  flatPercentage: '',
  selectedProductsPercentage: '',
  selectedProductsUpTo: '',
  maxDiscountEnabled: false,
  maxDiscountAmount: '',
  minPurchaseEnabled: false,
  minPurchaseValue: '',
  platforms: {
    socialMedia: false,
    inStore: false,
    website: false
  }
}

// Dummy data for campaign view mode (prototype)
export const VIEW_MODE_FORM_DATA: FormData = {
  startDate: new Date('2024-12-01'),
  endDate: new Date('2024-12-31'),
  applyDiscountThrough: 'merchant',
  discountType: 'flat',
  flatPercentage: '15',
  selectedProductsPercentage: '',
  selectedProductsUpTo: '',
  maxDiscountEnabled: true,
  maxDiscountAmount: '5000',
  minPurchaseEnabled: true,
  minPurchaseValue: '1000',
  platforms: {
    socialMedia: true,
    inStore: true,
    website: false
  }
}

// Pre-filled dummy data for edit mode
export const EDIT_MODE_FORM_DATA: FormData = {
  startDate: new Date('2024-11-20'),
  endDate: new Date('2024-12-15'),
  applyDiscountThrough: 'koko',
  discountType: 'selectedProducts',
  flatPercentage: '',
  selectedProductsPercentage: '20',
  selectedProductsUpTo: '3000',
  maxDiscountEnabled: true,
  maxDiscountAmount: '8000',
  minPurchaseEnabled: false,
  minPurchaseValue: '',
  platforms: {
    socialMedia: true,
    inStore: false,
    website: true
  }
}

export const CAMPAIGN_BENEFITS = [
  'Increase your sales revenue',
  'Attract new customers',
  'Boost brand visibility',
  'Access to exclusive tools'
]