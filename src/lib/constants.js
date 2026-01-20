// App Constants
export const APP_NAME = 'CleanAir'
export const APP_VERSION = '1.0.0'

// User Roles
export const ROLES = {
  CLEANER: 'cleaner',
  HOST: 'host',
}

// Mission Status
export const MISSION_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// Property Types
export const PROPERTY_TYPES = [
  { value: 'studio', label: 'Studio' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'loft', label: 'Loft' },
  { value: 'duplex', label: 'Duplex' },
]

// French Cities (for zones)
export const ZONES = [
  'Paris 1er', 'Paris 2e', 'Paris 3e', 'Paris 4e', 'Paris 5e',
  'Paris 6e', 'Paris 7e', 'Paris 8e', 'Paris 9e', 'Paris 10e',
  'Paris 11e', 'Paris 12e', 'Paris 13e', 'Paris 14e', 'Paris 15e',
  'Paris 16e', 'Paris 17e', 'Paris 18e', 'Paris 19e', 'Paris 20e',
  'Boulogne-Billancourt', 'Neuilly-sur-Seine', 'Levallois-Perret',
  'Issy-les-Moulineaux', 'Saint-Denis', 'Montreuil', 'Vincennes',
]

// Days of week
export const DAYS = [
  { value: 'lun', label: 'Lundi', short: 'L' },
  { value: 'mar', label: 'Mardi', short: 'M' },
  { value: 'mer', label: 'Mercredi', short: 'M' },
  { value: 'jeu', label: 'Jeudi', short: 'J' },
  { value: 'ven', label: 'Vendredi', short: 'V' },
  { value: 'sam', label: 'Samedi', short: 'S' },
  { value: 'dim', label: 'Dimanche', short: 'D' },
]

// Time slots
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
]

// Pricing tiers (for reference)
export const PRICING = {
  STUDIO: { base: 35, perM2: 0.8 },
  APARTMENT_SMALL: { base: 45, perM2: 0.7 },
  APARTMENT_LARGE: { base: 55, perM2: 0.6 },
  HOUSE: { base: 70, perM2: 0.5 },
}

// API Routes (for future backend)
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  MISSIONS: {
    LIST: '/api/missions',
    DETAIL: '/api/missions/:id',
    ACCEPT: '/api/missions/:id/accept',
  },
  PROPERTIES: {
    LIST: '/api/properties',
    CREATE: '/api/properties',
    DETAIL: '/api/properties/:id',
  },
}

// Navigation items
export const NAV_ITEMS = {
  cleaner: [
    { path: '/cleaner', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/cleaner/missions', label: 'Missions', icon: 'MapPin' },
    { path: '/cleaner/planning', label: 'Planning', icon: 'Calendar' },
    { path: '/cleaner/earnings', label: 'Revenus', icon: 'Wallet' },
    { path: '/cleaner/profile', label: 'Profil', icon: 'User' },
    { path: '/cleaner/settings', label: 'Paramètres', icon: 'Settings' },
  ],
  host: [
    { path: '/host', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/host/properties', label: 'Mes biens', icon: 'Home' },
    { path: '/host/bookings', label: 'Réservations', icon: 'Calendar' },
    { path: '/host/cleaners', label: 'Cleaners', icon: 'Users' },
    { path: '/host/billing', label: 'Facturation', icon: 'CreditCard' },
    { path: '/host/settings', label: 'Paramètres', icon: 'Settings' },
  ],
}

// Social links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/cleanair',
  linkedin: 'https://linkedin.com/company/cleanair',
  instagram: 'https://instagram.com/cleanair',
}

// Contact info
export const CONTACT = {
  email: 'contact@cleanair.fr',
  phone: '+33 1 23 45 67 89',
  address: 'Paris, France',
}
