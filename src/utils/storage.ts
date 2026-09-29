import { Booking, BusinessProfile, Service, StaffMember } from '../types/booking';

const STORAGE_KEYS = {
  SERVICES: 'cb_services_ng_v2',
  STAFF: 'cb_staff_ng_v2',
  BOOKINGS: 'cb_bookings_ng_v2',
  BUSINESS: 'cb_business_profile_ng_v2',
};

// Image assets generated for the applet
export const ASSETS = {
  heroInterior: '/src/assets/images/hero_barber_interior_1790682088119.jpg',
  tundePortrait: '/src/assets/images/barber_tunde_lagos_1790683269364.jpg',
  chukaPortrait: '/src/assets/images/barber_chuka_lagos_1790683283401.jpg',
  shaveTreatment: '/src/assets/images/barber_shave_treatment_1790682121307.jpg',
};

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  name: 'Crown & Blade Barbershop',
  tagline: 'Precision Cuts, Beard Sculpting & Nigerian Grooming Rituals',
  industry: 'Barbershop & Grooming Atelier',
  address: '14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
  phone: '0803 555 0192',
  email: 'concierge@crownandblade.ng',
  openHour: 9, // 9:00 AM
  closeHour: 20, // 8:00 PM
  slotIntervalMinutes: 15,
  currency: '₦',
  closedDays: [1], // Closed Mondays
};

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Executive Low Cut & Line-Up',
    category: 'Hair & Styling',
    durationMinutes: 35,
    price: 3500,
    description: 'Precision clipper and shear low cut with razor-sharp hairline shape up, neck taper, and menthol spirit tonic finish.',
    recommendedWith: 'srv-3',
    isActive: true,
  },
  {
    id: 'srv-2',
    name: 'Skin Fade & Beard Sculpt Ritual',
    category: 'Fade & Beard',
    durationMinutes: 50,
    price: 6000,
    description: 'Drop or taper skin fade with geometric beard shaping, eucalyptus hot towel steam prep, razor etching, and nourishing shea-cedarwood butter.',
    recommendedWith: 'srv-4',
    isActive: true,
  },
  {
    id: 'srv-3',
    name: 'Signature Beard Sculpt & Conditioning',
    category: 'Beard Care',
    durationMinutes: 30,
    price: 3000,
    description: 'Detailed beard architectural shaping, cheek line razor etching, warm steam infusion, and deep cedarwood oil conditioning massage.',
    isActive: true,
  },
  {
    id: 'srv-4',
    name: 'Black Dye / Natural Camo Tinting',
    category: 'Color & Tint',
    durationMinutes: 40,
    price: 4500,
    description: 'Jet-black or subtle dark brown organic tinting for beard and hairline to restore uniform fullness without artificial stains on skin.',
    isActive: true,
  },
  {
    id: 'srv-5',
    name: 'Traditional Hot Towel Straight-Razor Shave',
    category: 'Shave & Facial',
    durationMinutes: 35,
    price: 4000,
    description: 'Double warm botanical eucalyptus towel wrap, rich lather massage, single-blade clean shave, and soothing alum block with bay rum tonic.',
    isActive: true,
  },
  {
    id: 'srv-6',
    name: 'The Crown Royal Special (Cut, Shave, Dye & Wash)',
    category: 'Complete Rituals',
    durationMinutes: 80,
    price: 12000,
    description: 'The complete Lagos weekend grooming ritual: Signature cut, beard sculpt, hot towel wet shave, black dye tint, relaxing scalp wash, and cold marble finish.',
    isActive: true,
  },
  {
    id: 'srv-7',
    name: 'Kids Clean Cut (Under 12)',
    category: 'Kids & Students',
    durationMinutes: 30,
    price: 2500,
    description: 'Patient, gentle haircut and clean perimeter shaping for young boys, finished with baby powder and sweet treat.',
    isActive: true,
  },
  {
    id: 'srv-8',
    name: 'Scalp Scrub, Mint Wash & Blowdry',
    category: 'Hair Care',
    durationMinutes: 25,
    price: 3000,
    description: 'Deep clarifying tea tree and peppermint shampoo, invigorating scalp acupressure massage, and warm towel dry.',
    isActive: true,
  },
];

export const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Tunde Balogun',
    role: 'Lead Barber & Founder',
    bio: '12 years crafting Lagos’s sharpest tapers and celebrity line-ups. Master of the straight razor and classic afro-scissor shaping.',
    specialties: ['Executive Low Cuts', 'Straight Razor Shaves', 'Afro Shear Sculpting'],
    avatarUrl: ASSETS.tundePortrait,
    rating: 4.98,
    reviewCount: 384,
    workingHours: { start: '09:00', end: '19:30' },
    daysOff: [1], // Monday closed
  },
  {
    id: 'staff-2',
    name: 'Chuka Eze',
    role: 'Senior Precision Barber',
    bio: 'Renowned across Lekki for razor-sharp skin fades, surgical geometric line-ups, and steam beard sculpting with hot towel prep.',
    specialties: ['Skin Drop Fades', 'Geometric Line-Ups', 'Beard Steam Sculpting'],
    avatarUrl: ASSETS.chukaPortrait,
    rating: 4.96,
    reviewCount: 295,
    workingHours: { start: '10:00', end: '20:00' },
    daysOff: [1], // Monday closed
  },
  {
    id: 'staff-3',
    name: 'Femi Adebayo',
    role: 'Grooming & Color Specialist',
    bio: 'Expert in black dye tinting, grey camouflage, restorative scalp treatments, and patient haircuts for kids and young students.',
    specialties: ['Black Dye & Tinting', 'Scalp Therapy', 'Kids Styling'],
    avatarUrl: ASSETS.shaveTreatment,
    rating: 4.94,
    reviewCount: 218,
    workingHours: { start: '09:30', end: '19:00' },
    daysOff: [1], // Monday closed
  },
];

// Helper to format date as YYYY-MM-DD
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateSampleBookings(): Booking[] {
  const today = new Date();
  const todayKey = formatDateKey(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrow);

  return [
    // Today's schedule
    {
      id: 'bk-101',
      bookingCode: 'CB-9411',
      serviceIds: ['srv-1'],
      staffId: 'staff-1',
      assignedStaffId: 'staff-1',
      date: todayKey,
      startTime: '09:30',
      endTime: '10:05',
      totalDurationMinutes: 35,
      totalPrice: 3500,
      customer: {
        name: 'Babatunde Adeleke',
        phone: '0802 341 8912',
        email: 'tunde.adeleke@gmail.com',
        notes: 'Low taper fade, prefers menthol spirit on hairline.',
      },
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'bk-102',
      bookingCode: 'CB-9412',
      serviceIds: ['srv-2'],
      staffId: 'staff-2',
      assignedStaffId: 'staff-2',
      date: todayKey,
      startTime: '10:30',
      endTime: '11:20',
      totalDurationMinutes: 50,
      totalPrice: 6000,
      customer: {
        name: 'Emeka Okonkwo',
        phone: '0813 552 0943',
        email: 'e.okonkwo@lekkiholdings.ng',
        notes: 'Skin drop fade on sides, full beard sculpt with steam.',
      },
      status: 'in-progress',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'bk-103',
      bookingCode: 'CB-9413',
      serviceIds: ['srv-6'],
      staffId: 'staff-1',
      assignedStaffId: 'staff-1',
      date: todayKey,
      startTime: '11:30',
      endTime: '12:50',
      totalDurationMinutes: 80,
      totalPrice: 12000,
      customer: {
        name: 'Olumide Davies',
        phone: '0809 112 4588',
        email: 'olumide@davieslaw.com',
        notes: 'Pre-wedding grooming session. Jet black dye on beard.',
      },
      status: 'confirmed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'bk-104',
      bookingCode: 'CB-9414',
      serviceIds: ['srv-1', 'srv-4'],
      staffId: 'staff-3',
      assignedStaffId: 'staff-3',
      date: todayKey,
      startTime: '13:00',
      endTime: '14:15',
      totalDurationMinutes: 75,
      totalPrice: 8000,
      customer: {
        name: 'Chinedu Anya',
        phone: '0805 771 9023',
        email: 'chinedu.anya@vanguard.ng',
        notes: 'Natural hairline tinting.',
      },
      status: 'confirmed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'bk-105',
      bookingCode: 'CB-9415',
      serviceIds: ['srv-7'],
      staffId: 'staff-2',
      assignedStaffId: 'staff-2',
      date: todayKey,
      startTime: '14:30',
      endTime: '15:00',
      totalDurationMinutes: 30,
      totalPrice: 2500,
      customer: {
        name: 'Seyi Makinde (Junior)',
        phone: '0901 445 2819',
        email: 'smakinde@lagosventures.ng',
        notes: 'Kids clean cut for school photo.',
      },
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'bk-106',
      bookingCode: 'CB-9416',
      serviceIds: ['srv-2', 'srv-8'],
      staffId: 'staff-1',
      assignedStaffId: 'staff-1',
      date: todayKey,
      startTime: '16:00',
      endTime: '17:15',
      totalDurationMinutes: 75,
      totalPrice: 9000,
      customer: {
        name: 'Kelechi Iheanacho',
        phone: '0803 992 1134',
        email: 'kelechi@afrikstudio.io',
      },
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },

    // Tomorrow's bookings
    {
      id: 'bk-107',
      bookingCode: 'CB-9417',
      serviceIds: ['srv-6'],
      staffId: 'staff-1',
      assignedStaffId: 'staff-1',
      date: tomorrowKey,
      startTime: '10:00',
      endTime: '11:20',
      totalDurationMinutes: 80,
      totalPrice: 12000,
      customer: {
        name: 'Folarin Falana',
        phone: '0812 774 9910',
        email: 'folarin@bahdguys.ng',
        notes: 'Crown royal ritual with hot towel treatment.',
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'bk-108',
      bookingCode: 'CB-9418',
      serviceIds: ['srv-1', 'srv-3'],
      staffId: 'staff-2',
      assignedStaffId: 'staff-2',
      date: tomorrowKey,
      startTime: '11:30',
      endTime: '12:35',
      totalDurationMinutes: 65,
      totalPrice: 6500,
      customer: {
        name: 'Dapo Abiodun',
        phone: '0803 219 4432',
        email: 'dabiodun@estatebuild.com',
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ];
}

// Storage helpers
export function getStoredBusinessProfile(): BusinessProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load business profile', e);
  }
  return DEFAULT_BUSINESS_PROFILE;
}

export function saveStoredBusinessProfile(profile: BusinessProfile): void {
  localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(profile));
}

export function getStoredServices(): Service[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load services', e);
  }
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
  return DEFAULT_SERVICES;
}

export function saveStoredServices(services: Service[]): void {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
}

export function getStoredStaff(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load staff', e);
  }
  localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(DEFAULT_STAFF));
  return DEFAULT_STAFF;
}

export function saveStoredStaff(staff: StaffMember[]): void {
  localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
}

export function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load bookings', e);
  }
  const sample = generateSampleBookings();
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(sample));
  return sample;
}

export function saveStoredBookings(bookings: Booking[]): void {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

export function clearAllBookings(): void {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
  localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(DEFAULT_STAFF));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(generateSampleBookings()));
  localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(DEFAULT_BUSINESS_PROFILE));
}
