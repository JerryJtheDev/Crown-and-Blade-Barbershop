import React from 'react';
import { Booking, Service, StaffMember } from '../../types/booking';
import { formatDisplayTime } from '../../utils/calendar';

interface WeekOverviewProps {
  currentDateStr: string;
  bookings: Booking[];
  services: Service[];
  staffList: StaffMember[];
  currency: string;
  onSelectDate: (dateStr: string) => void;
  onSelectBooking: (booking: Booking) => void;
}

export const WeekOverview: React.FC<WeekOverviewProps> = ({
  currentDateStr,
  bookings,
  services,
  staffList,
  currency,
  onSelectDate,
  onSelectBooking,
}) => {
  const weekDays = React.useMemo(() => {
    const base = new Date(currentDateStr + 'T00:00:00');
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;

      list.push({
        date: d,
        dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isClosed: d.getDay() === 1,
      });
    }
    return list;
  }, [currentDateStr]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-[#655D52] pb-1">
        <span>7-DAY MASTER SCHEDULE OVERVIEW</span>
        <span>Click any date column to view its detailed timeline</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
        {weekDays.map((col) => {
          const isSelected = col.dateStr === currentDateStr;
          const dayBookings = bookings
            .filter((b) => b.date === col.dateStr && b.status !== 'cancelled')
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          const dayRevenue = dayBookings.reduce((sum, b) => sum + b.totalPrice, 0);

          return (
            <div
              key={col.dateStr}
              className={`flex flex-col rounded-xl border-2 transition-all ${
                isSelected
                  ? 'bg-[#FFFDF9] border-[#B94A2C] ring-2 ring-[#B94A2C]/20 shadow-md'
                  : col.isClosed
                  ? 'bg-[#FAF7F2] border-[#DED5C6] shadow-2xs'
                  : 'bg-[#FFFDF9] border-[#DED5C6] shadow-2xs'
              }`}
            >
              {/* Day Header */}
              <div
                onClick={() => onSelectDate(col.dateStr)}
                className="p-3 border-b border-[#EFE9DC] cursor-pointer hover:bg-[#FAF7F2] rounded-t-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#8E8475] font-semibold">
                    {col.dayName}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-[#B94A2C] font-bold">
                    {currency}{dayRevenue}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-serif font-bold text-[#201D1A]">
                    {col.dayNumber}
                  </span>
                  <span className="text-xs font-mono text-[#8E8475]">{col.monthName}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                  <span className="text-[#655D52]">
                    {dayBookings.length} {dayBookings.length === 1 ? 'client' : 'clients'}
                  </span>
                  {col.isClosed && (
                    <span className="text-[#B94A2C] font-semibold font-mono text-[9px] uppercase">
                      Closed Mon
                    </span>
                  )}
                </div>
              </div>

              {/* Day Appointments List */}
              <div className="p-2 space-y-1.5 flex-1 min-h-[140px] max-h-[360px] overflow-y-auto bg-[#FAF7F2]">
                {dayBookings.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-[#A89E8F] font-serif italic py-6">
                    Open schedule
                  </div>
                ) : (
                  dayBookings.map((b) => {
                    const staff = staffList.find((s) => s.id === b.assignedStaffId);
                    const srvNames = services
                      .filter((s) => b.serviceIds.includes(s.id))
                      .map((s) => s.name)
                      .join(' + ');

                    return (
                      <div
                        key={b.id}
                        onClick={() => onSelectBooking(b)}
                        className="p-2 rounded bg-[#FFFDF9] hover:bg-[#FAF0EC] border border-[#E8DFD3] hover:border-[#B94A2C]/60 transition-colors cursor-pointer text-left text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#B94A2C]">
                          <span className="font-semibold">{formatDisplayTime(b.startTime)}</span>
                          <span className="uppercase text-[9px] text-[#8E8475]">{b.status}</span>
                        </div>
                        <div className="font-serif font-bold text-[#201D1A] truncate text-xs">
                          {b.customer.name}
                        </div>
                        <div className="text-[10px] text-[#655D52] truncate font-sans">
                          {staff?.name?.split(' ')[0]} · {srvNames}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
