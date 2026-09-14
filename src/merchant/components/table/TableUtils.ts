// @ts-nocheck
export const formatCurrency = (amount: number, prefix: string = 'Rs. ') => {
  return `${prefix}${amount.toLocaleString('en-LK', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`
}

export const formatDate = (dateString: string, format: 'short' | 'long' = 'short') => {
  const date = new Date(dateString)
  
  if (format === 'short') {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
  
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export const formatTime = (timeString: string) => {
  return timeString.split(' ')[0] // Extract time part only
}

export const formatPhoneNumber = (phone: string) => {
  // Sri Lankan phone number formatting
  if (phone.startsWith('+94')) {
    return phone
  }
  return `+94${phone}`
}

export const getTableMinWidth = (columnCount: number): string => {
  // Calculate minimum width based on column count
  const baseWidth = Math.max(1600, columnCount * 200)
  return `min-w-[${baseWidth}px]`
}