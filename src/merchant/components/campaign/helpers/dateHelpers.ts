// @ts-nocheck
export const getCampaignDateRange = () => {
  // Campaign period: Nov 29 - Dec 2, 2024
  const campaignStartDate = new Date(2024, 10, 29) // Month is 0-indexed, so 10 = November
  const campaignEndDate = new Date(2024, 11, 2)   // 11 = December
  
  return { campaignStartDate, campaignEndDate }
}

export const isDateInCampaignRange = (date: Date) => {
  const { campaignStartDate, campaignEndDate } = getCampaignDateRange()
  return date >= campaignStartDate && date <= campaignEndDate
}

export const formatDateForDisplay = (date: Date | string | undefined | null) => {
  if (!date) {
    return 'Not set'
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid date'
  }
  
  return dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}