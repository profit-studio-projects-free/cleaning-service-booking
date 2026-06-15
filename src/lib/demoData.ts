import type {
  BlockedDate,
  BusinessHours,
  BusinessSettings,
  Service,
} from './types';

/**
 * Safe demo data used only when Supabase env values are missing.
 * The real backend data takes over automatically once env is configured.
 */

const NOW_ISO = new Date('2026-01-01T12:00:00Z').toISOString();

export const demoServices: Service[] = [
  {
    id: 'demo-svc-1',
    name: 'Standard Home Cleaning',
    description:
      'A meticulous weekly refresh. Kitchens, bathrooms, living areas, bedrooms, and floors — handled by a trained two-person cleaning team.',
    duration_minutes: 120,
    price: 149,
    is_active: true,
    created_at: NOW_ISO,
  },
  {
    id: 'demo-svc-2',
    name: 'Deep Cleaning Service',
    description:
      'A top-to-bottom reset. Baseboards, inside cabinets, behind appliances, light fixtures — every detail addressed with precision.',
    duration_minutes: 240,
    price: 299,
    is_active: true,
    created_at: NOW_ISO,
  },
  {
    id: 'demo-svc-3',
    name: 'Move-In / Move-Out Cleaning',
    description:
      'A spotless, ready-to-live-in clean for empty homes — perfect for a new place or for handing the keys back.',
    duration_minutes: 300,
    price: 379,
    is_active: true,
    created_at: NOW_ISO,
  },
  {
    id: 'demo-svc-4',
    name: 'Apartment Cleaning',
    description:
      'A tailored cleaning for apartments and condos — efficient, quiet, and respectful of building rules.',
    duration_minutes: 90,
    price: 119,
    is_active: true,
    created_at: NOW_ISO,
  },
  {
    id: 'demo-svc-5',
    name: 'Office Cleaning',
    description:
      'A polished workspace for your team — desks, kitchens, conference rooms, and shared areas, after hours.',
    duration_minutes: 180,
    price: 229,
    is_active: true,
    created_at: NOW_ISO,
  },
  {
    id: 'demo-svc-6',
    name: 'Post-Renovation Cleaning',
    description:
      'Dust-free, finished, photo-ready spaces after renovation work. We handle the fine debris and the final shine.',
    duration_minutes: 360,
    price: 449,
    is_active: true,
    created_at: NOW_ISO,
  },
];

export const demoBusinessHours: BusinessHours[] = [
  { id: 'h-0', weekday: 0, is_open: false, start_time: '09:00:00', end_time: '17:00:00' },
  { id: 'h-1', weekday: 1, is_open: true, start_time: '08:00:00', end_time: '18:00:00' },
  { id: 'h-2', weekday: 2, is_open: true, start_time: '08:00:00', end_time: '18:00:00' },
  { id: 'h-3', weekday: 3, is_open: true, start_time: '08:00:00', end_time: '18:00:00' },
  { id: 'h-4', weekday: 4, is_open: true, start_time: '08:00:00', end_time: '18:00:00' },
  { id: 'h-5', weekday: 5, is_open: true, start_time: '08:00:00', end_time: '18:00:00' },
  { id: 'h-6', weekday: 6, is_open: true, start_time: '09:00:00', end_time: '15:00:00' },
];

export const demoBlockedDates: BlockedDate[] = [];

export const demoSettings: BusinessSettings = {
  id: 'demo-settings',
  business_name: 'Lumen & Bloom Cleaning Co.',
  business_email: 'hello@lumenbloom.co',
  business_phone: '(555) 218-4290',
  business_address: '245 Maple Ave, Brooklyn, NY',
  slot_interval_minutes: 30,
  booking_notice_hours: 2,
  created_at: NOW_ISO,
};
