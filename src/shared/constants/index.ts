// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CATEGORIES: '/categories',
  CATEGORY: '/categories/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'ecommerce-cart',
  USER: 'ecommerce-user',
  TOKEN: 'ecommerce-token',
  PREFERENCES: 'ecommerce-preferences',
  RECENT_SEARCHES: 'ecommerce-recent-searches',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

// Product Categories
export const CATEGORIES = [
  'electronics',
  'clothing',
  'books',
  'home-garden',
  'sports',
  'beauty',
  'toys',
  'automotive',
] as const;

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  pending: 'text-yellow-600 bg-yellow-50',
  confirmed: 'text-blue-600 bg-blue-50',
  processing: 'text-purple-600 bg-purple-50',
  shipped: 'text-indigo-600 bg-indigo-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Toast Messages
export const MESSAGES = {
  SUCCESS: {
    PRODUCT_ADDED_TO_CART: 'Product added to cart successfully!',
    ORDER_PLACED: 'Order placed successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please log in to continue.',
    NOT_FOUND: 'Requested resource not found.',
  },
} as const;

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;