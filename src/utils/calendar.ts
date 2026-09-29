import { Booking, Service, StaffMember, TimeSlot } from '../types/booking';

// Convert "HH:mm" to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes from midnight to "HH:mm"
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Format "HH:mm" into friendly "9:30 AM"
export function formatDisplayTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

// Add minutes to "HH:mm"
export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const totalMins = timeToMinutes(timeStr) + minutesToAdd;
  return minutesToTime(totalMins);
}

// Check if two time intervals overlap: [startA, endA) and [startB, endB)
export function isOverlapping(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

// Check if a specific date is closed for the business (e.g. Monday = 1)
export function isBusinessClosedDate(dateStr: string, closedDays: number[] = [1]): boolean {
  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();
  return closedDays.includes(dayOfWeek);
}

// Check if a staff member is available for a given time window on a specific date
export function isStaffAvailable(
  staff: StaffMember,
  dateStr: string,
  startMinutes: number,
  endMinutes: number,
  bookings: Booking[],
  excludeBookingId?: string
): boolean {
  // Check day off
  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();
  if (staff.daysOff.includes(dayOfWeek)) {
    return false;
  }

  // Check working hours
  const staffStart = timeToMinutes(staff.workingHours.start);
  const staffEnd = timeToMinutes(staff.workingHours.end);
  if (startMinutes < staffStart || endMinutes > staffEnd) {
    return false;
  }

  // Check existing bookings for this staff on this date
  const conflictingBooking = bookings.find((b) => {
    if (b.status === 'cancelled') return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;
    if (b.date !== dateStr) return false;
    if (b.assignedStaffId !== staff.id) return false;

    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);

    return isOverlapping(startMinutes, endMinutes, bStart, bEnd);
  });

  return !conflictingBooking;
}

// Calculate all available slots for a given date, duration, and staff selection
export function calculateAvailableSlots(
  dateStr: string,
  durationMinutes: number,
  selectedStaffId: string, // staff id or "any"
  allStaff: StaffMember[],
  bookings: Booking[],
  openHour: number = 9,
  closeHour: number = 20,
  intervalMinutes: number = 15,
  closedDays: number[] = [1]
): TimeSlot[] {
  const isShopClosed = isBusinessClosedDate(dateStr, closedDays);
  const slots: TimeSlot[] = [];
  const startMinute = openHour * 60;
  const endMinute = closeHour * 60;

  for (let m = startMinute; m + durationMinutes <= endMinute; m += intervalMinutes) {
    const slotTimeStr = minutesToTime(m);

    if (isShopClosed) {
      slots.push({
        time: slotTimeStr,
        displayTime: formatDisplayTime(slotTimeStr),
        available: false,
        conflictReason: 'Shop closed Mondays for maintenance & sharpening',
        availableStaffIds: [],
      });
      continue;
    }

    const slotEndM = m + durationMinutes;
    let available = false;
    let conflictReason = '';
    const availableStaffIds: string[] = [];

    if (selectedStaffId && selectedStaffId !== 'any') {
      const staff = allStaff.find((s) => s.id === selectedStaffId);
      if (!staff) {
        available = false;
        conflictReason = 'Specialist not found';
      } else {
        const canWork = isStaffAvailable(staff, dateStr, m, slotEndM, bookings);
        if (canWork) {
          available = true;
          availableStaffIds.push(staff.id);
        } else {
          available = false;
          conflictReason = 'Booked or outside shift';
        }
      }
    } else {
      // Any staff available
      for (const staff of allStaff) {
        if (isStaffAvailable(staff, dateStr, m, slotEndM, bookings)) {
          availableStaffIds.push(staff.id);
        }
      }
      if (availableStaffIds.length > 0) {
        available = true;
      } else {
        available = false;
        conflictReason = 'All specialists booked';
      }
    }

    slots.push({
      time: slotTimeStr,
      displayTime: formatDisplayTime(slotTimeStr),
      available,
      conflictReason: available ? undefined : conflictReason,
      availableStaffIds,
    });
  }

  return slots;
}

// Generate next 14 available days for date strip
export function getNextDays(count: number = 14): {
  date: Date;
  dateStr: string;
  dayName: string;
  dayNumber: string;
  monthName: string;
  isToday: boolean;
  isClosed: boolean;
}[] {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = String(d.getDate());
    const isClosed = d.getDay() === 1; // Closed Monday

    days.push({
      date: d,
      dateStr,
      dayName,
      dayNumber,
      monthName,
      isToday: i === 0,
      isClosed,
    });
  }
  return days;
}

// Format date into human readable title e.g. "Tuesday, September 29, 2026"
export function formatFullDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// Generate and trigger download of an .ics calendar file for the confirmed booking
export function downloadIcsCalendar(booking: Booking, services: Service[], staffMember?: StaffMember): void {
  const serviceNames = services.map((s) => s.name).join(' + ');
  const title = `${serviceNames} - Crown & Blade Barbershop`;
  const description = `Appointment with ${staffMember ? staffMember.name : 'Specialist'}\\nDocket Reference: ${booking.bookingCode}\\nTotal: ₦${booking.totalPrice}`;
  const location = 'Crown & Blade Barbershop, 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria';

  // Format date time into ICS string YYYYMMDDTHHMMSS
  const [y, m, d] = booking.date.split('-');
  const [startH, startMin] = booking.startTime.split(':');
  const [endH, endMin] = booking.endTime.split(':');

  const dtStart = `${y}${m}${d}T${startH}${startMin}00`;
  const dtEnd = `${y}${m}${d}T${endH}${endMin}00`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Crown and Blade//Appointment Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.id}-${Date.now()}@crownandblade.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `appointment-${booking.bookingCode}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
