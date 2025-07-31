// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://hoe.onrender.com"

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  // Add /api prefix if the endpoint doesn't already start with /api
  const apiEndpoint = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  return `${API_BASE_URL}${apiEndpoint}`
}

// Common headers for API requests
export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

// Common headers for admin API requests
export const getAdminHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("adminToken") : null
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  }
} 