// @ts-nocheck
// Common data used across components
export const branches = [
  'Main Branch', 
  'Colombo Central', 
  'Kandy Branch', 
  'Galle Branch', 
  'Negombo Branch'
]

export const users = [
  'Admin User', 
  'John Doe', 
  'Sarah Smith', 
  'Mike Johnson', 
  'Lisa Wong',
  'Robert Brown', 
  'Emma Davis', 
  'Alex Wilson', 
  'Maria Garcia', 
  'David Lee'
]

export const customerNames = [
  'Bessie Cooper', 
  'Eleanor Pena', 
  'Jenny Wilson', 
  'Savannah Nguyen', 
  'Cameron Williamson', 
  'Jane Cooper', 
  'Darlene Robertson', 
  'Albert Flores',
  'Esther Howard', 
  'Leslie Alexander', 
  'Brooklyn Simmons', 
  'Courtney Henry',
  'Jacob Jones', 
  'Kristin Watson', 
  'Marvin McKinney', 
  'Ronald Richards'
]

export const usernames = [
  'admin.user', 
  'john.doe', 
  'sarah.smith', 
  'mike.johnson', 
  'lisa.wong',
  'robert.brown', 
  'emma.davis', 
  'alex.wilson', 
  'maria.garcia', 
  'david.lee'
]

// Utility functions for generating mock data
export const generateMockOrderId = (index: number) => `KK${String(index).padStart(6, '0')}`
export const generateMockMerchantOrderId = (index: number) => `M${String(index).padStart(8, '0')}`
export const generateMockActionId = (index: number) => `ACT${String(index).padStart(6, '0')}`
export const generateMockReferenceCode = (index: number) => `REF${String(index).padStart(4, '0')}`

export const generateMockPhoneNumber = () => `77${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`

export const generateRandomDate = (daysBack: number = 30) => 
  new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000)

export const generateRandomAmount = (min: number = 100, max: number = 10000) => 
  Math.floor(Math.random() * (max - min) + min)