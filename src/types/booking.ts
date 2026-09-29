export type BookingStatus = 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description: string;
  recommendedWith?: string;
  isActive: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  workingHours: {
    start: string; // e.g. "09:00"
    end: string;   // e.g. "19:00"
  };
  daysOff: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  notes?: string;
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "CB-7429"
  serviceIds: string[];
  staffId: string; // staff id or "any"
  assignedStaffId: string; // actual staff member performing the service
  date: string; // "YYYY-MM-DD"
  startTime: string; // "14:30"
  endTime: string;   // "15:15"
  totalDurationMinutes: number;
  totalPrice: number;
  customer: CustomerInfo;
  status: BookingStatus;
  createdAt: string;
}

export interface BusinessProfile {
  name: string;
  tagline: string;
  industry: string;
  address: string;
  phone: string;
  email: string;
  openHour: number; // e.g. 9 for 09:00
  closeHour: number; // e.g. 19 for 19:00
  slotIntervalMinutes: number; // 15 or 30
  currency: string;
  closedDays: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export interface TimeSlot {
  time: string; // "09:00"
  displayTime: string; // "9:00 AM"
  available: boolean;
  conflictReason?: string;
  availableStaffIds: string[];
}
