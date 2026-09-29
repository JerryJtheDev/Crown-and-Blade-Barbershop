import React from 'react';
import { Booking, StaffMember, TimeSlot } from '../../types/booking';
import {
  calculateAvailableSlots,
  formatFullDate,
  getNextDays,
  isBusinessClosedDate,
} from '../../utils/calendar';

interface ScheduleSelectorProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  selectedTime: string;
  onSelectTime: (timeStr: string) => void;
  totalDurationMinutes: number;
  selectedStaffId: string;
  allStaff: StaffMember[];
  bookings: Booking[];
  openHour: number;
  closeHour: number;
  slotIntervalMinutes: number;
}

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  totalDurationMinutes,
  selectedStaffId,
  allStaff,
  bookings,
  openHour,
  closeHour,
  slotIntervalMinutes,
}) => {
  const days = React.useMemo(() => getNextDays(14), []);
  const isSelectedDateClosed = React.useMemo(
    () => isBusinessClosedDate(selectedDate, [1]),
    [selectedDate]
  );

  // Compute slots for current date & duration
  const slots: TimeSlot[] = React.useMemo(() => {
    return calculateAvailableSlots(
      selectedDate,
      totalDurationMinutes > 0 ? totalDurationMinutes : 45,
      selectedStaffId,
      allStaff,
      bookings,
      openHour,
      closeHour,
      slotIntervalMinutes,
      [1] // Closed Mondays
    );
  }, [
    selectedDate,
    totalDurationMinutes,
    selectedStaffId,
    allStaff,
    bookings,
    openHour,
    closeHour,
    slotIntervalMinutes,
  ]);

  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 17;
  });

  const availableCount = slots.filter((s) => s.available).length;
  const bookedCount = slots.length - availableCount;

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b-2 border-[#DED5C6] pb-3">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#B94A2C] block font-semibold">
            Third Step · The Date &amp; Slot
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#201D1A] tracking-tight mt-0.5">
            Select Your Appointment Slot
          </h2>
          <p className="text-xs sm:text-sm text-[#655D52] mt-1 font-sans">
            Schedule for {formatFullDate(selectedDate)} · {totalDurationMinutes} min duration
          </p>
        </div>

        {/* Available vs Booked indicators */}
        <div className="flex items-center gap-4 text-xs text-[#655D52] font-mono tabular-nums">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B94A2C]"></span>
            <span className="font-medium text-[#201D1A]">{availableCount} Available</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D5CAB8]"></span>
            <span>{bookedCount} Reserved</span>
          </span>
        </div>
      </div>

      {/* Date Tape / Ledger Ribbon */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8E8475] font-mono">
          <span>APPOINTMENT CALENDAR TAPE</span>
          <label className="text-[#B94A2C] hover:underline cursor-pointer">
            [ Custom Date Picker ]
            <input
              type="date"
              value={selectedDate}
              min={days[0]?.dateStr}
              onChange={(e) => {
                if (e.target.value) onSelectDate(e.target.value);
              }}
              className="sr-only"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {days.map((d) => {
            const isSelected = selectedDate === d.dateStr;

            return (
              <button
                key={d.dateStr}
                onClick={() => onSelectDate(d.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[76px] py-2.5 px-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#B94A2C] border-[#B94A2C] text-[#FFFDF9] shadow-sm'
                    : d.isClosed
                    ? 'bg-[#FAF7F2] border-dashed border-[#DED5C6] text-[#8E8475] hover:border-[#B5A793]'
                    : 'bg-[#FFFDF9] border-[#DED5C6] text-[#655D52] hover:border-[#B5A793] hover:text-[#201D1A]'
                }`}
              >
                <span className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-[#FFFDF9]/90' : 'text-[#8E8475]'}`}>
                  {d.isToday ? 'Today' : d.dayName}
                </span>
                <span className="text-xl font-serif font-bold leading-tight mt-0.5 tabular-nums">
                  {d.dayNumber}
                </span>
                <span className={`text-[10px] font-sans ${
                  isSelected
                    ? 'text-[#FFFDF9]/80'
                    : d.isClosed
                    ? 'text-[#B94A2C] font-mono font-semibold'
                    : 'text-[#8E8475]'
                }`}>
                  {d.isClosed ? 'Closed' : d.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tactile Slot Tickets Grid */}
      <div className="bg-[#FFFDF9] border border-[#DED5C6] rounded-xl p-5 sm:p-6 space-y-6 shadow-xs">
        {isSelectedDateClosed ? (
          <div className="py-8 px-4 text-center max-w-lg mx-auto space-y-3">
            <div className="stamp-seal text-xs">
              SHOP CLOSED ON MONDAYS
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#201D1A]">
              Sanitation &amp; Razor Sharpening Day
            </h3>
            <p className="text-xs sm:text-sm text-[#655D52] font-sans leading-relaxed">
              Crown &amp; Blade operates Tuesday through Sunday. Mondays are reserved for deep shop sanitation,
              honing straight razors, and artisan rest.
            </p>
            <p className="text-xs font-mono text-[#B94A2C] font-semibold pt-1">
              Please choose any Tuesday through Sunday on the date tape above to secure an opening.
            </p>
          </div>
        ) : totalDurationMinutes === 0 ? (
          <div className="text-center py-8 text-[#8E8475] text-sm font-serif italic">
            Please select at least one service above to calculate open appointment openings.
          </div>
        ) : (
          <>
            {/* Morning Section */}
            {morningSlots.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#EFE9DC]">
                  <span className="text-xs font-mono font-semibold uppercase text-[#8E8475] tracking-wider">
                    Morning Sessions · 09:00 – 12:00
                  </span>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {morningSlots.map((slot) => (
                    <TactileSlotTicket
                      key={slot.time}
                      slot={slot}
                      isSelected={selectedTime === slot.time}
                      onSelect={() => onSelectTime(slot.time)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon Section */}
            {afternoonSlots.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#EFE9DC]">
                  <span className="text-xs font-mono font-semibold uppercase text-[#8E8475] tracking-wider">
                    Afternoon Sessions · 12:00 – 17:00
                  </span>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {afternoonSlots.map((slot) => (
                    <TactileSlotTicket
                      key={slot.time}
                      slot={slot}
                      isSelected={selectedTime === slot.time}
                      onSelect={() => onSelectTime(slot.time)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Evening Section */}
            {eveningSlots.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#EFE9DC]">
                  <span className="text-xs font-mono font-semibold uppercase text-[#8E8475] tracking-wider">
                    Evening Sessions · 17:00 – 20:00
                  </span>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {eveningSlots.map((slot) => (
                    <TactileSlotTicket
                      key={slot.time}
                      slot={slot}
                      isSelected={selectedTime === slot.time}
                      onSelect={() => onSelectTime(slot.time)}
                    />
                  ))}
                </div>
              </div>
            )}

            {availableCount === 0 && (
              <div className="text-center py-6 text-sm text-[#8E8475] font-serif italic">
                All chairs are booked for this duration on {formatFullDate(selectedDate)}.
                Please select another day or pick "First Available Chair".
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface TactileSlotTicketProps {
  slot: TimeSlot;
  isSelected: boolean;
  onSelect: () => void;
}

const TactileSlotTicket: React.FC<TactileSlotTicketProps> = ({ slot, isSelected, onSelect }) => {
  if (!slot.available) {
    return (
      <div
        className="relative px-2.5 py-2.5 rounded-lg border border-dashed border-[#D5CAB8] slot-hatch-pattern text-center select-none overflow-hidden cursor-not-allowed group/unavailable"
        title={slot.conflictReason || 'Reserved by existing client'}
      >
        {/* Subtle decorative crossed diagonal ruler line */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-full h-[1px] bg-[#C8BCAC] rotate-[-12deg]"></div>
        </div>

        <span className="relative z-10 block text-xs font-mono text-[#8E8475] line-through tabular-nums font-medium opacity-80">
          {slot.displayTime}
        </span>
        <span className="relative z-10 block text-[9px] font-mono uppercase tracking-widest text-[#9E9484] mt-0.5">
          Reserved
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative px-2.5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-center group ${
        isSelected
          ? 'bg-[#B94A2C] text-[#FFFDF9] border border-[#B94A2C] shadow-md scale-[1.02]'
          : 'bg-[#FFFDF9] hover:bg-[#FAF0EC] border border-[#DED5C6] hover:border-[#B94A2C]/60 text-[#201D1A] hover:shadow-xs'
      }`}
    >
      <span className={`block text-xs font-serif font-bold tabular-nums transition-colors ${
        isSelected ? 'text-[#FFFDF9]' : 'text-[#201D1A] group-hover:text-[#B94A2C]'
      }`}>
        {slot.displayTime}
      </span>
      <span
        className={`block text-[10px] font-mono uppercase tracking-widest mt-0.5 transition-colors ${
          isSelected ? 'text-[#FFFDF9]/90 font-medium' : 'text-[#8E8475] group-hover:text-[#B94A2C]'
        }`}
      >
        {isSelected ? '● Locked' : 'Available'}
      </span>
    </button>
  );
};
