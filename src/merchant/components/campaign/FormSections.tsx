// @ts-nocheck
// Re-export all form sections from their individual component files
export { CampaignDurationSection } from './sections/CampaignDurationSection'
export { DiscountApplicationSection } from './sections/DiscountApplicationSection'
export { CampaignLimitsSection } from './sections/CampaignLimitsSection'
export { CampaignChannelsSection } from './sections/CampaignChannelsSection'

// Export types for convenience
export type { FormData } from './types'

// Form section props interface
export interface FormSectionProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  updatePlatforms: (platform: keyof FormData['platforms'], checked: boolean) => void
  isReadOnly: boolean
}