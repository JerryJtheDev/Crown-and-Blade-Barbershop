import React from 'react';
import { Clock } from 'lucide-react';
import { Booking, BookingStatus, Service, StaffMember } from '../../types/booking';
import { formatDisplayTime, timeToMinutes } from '../../utils/calendar';

interface StaffColumnTimelineProps {
  dateStr: string;
  staffList: StaffMember[];
  bookings: Booking[];
  services: Service[];
  openHour: number;
  closeHour: number;
  currency: string;
  onSelectBooking: (booking: Booking) => void;
  onSlotClick: (time: string, staffId: string) => void;
}

export const StaffColumnTimeline: React.FC<StaffColumnTimelineProps> = ({
  dateStr,
  staffList,
  bookings,
  services,
  openHour,
  closeHour,
  currency,
  onSelectBooking,
  onSlotClick,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mobileStaffTab, setMobileStaffTab] = React.useState<string>('all');

  const totalHours = closeHour - openHour;
  const startDayMinutes = openHour * 60;
  const totalDayMinutes = totalHours * 60;

  const hourHeightPx = 64;
  const totalHeightPx = totalHours * hourHeightPx;

  const hoursArray = React.useMemo(() => {
    const list = [];
    for (let h = openHour; h <= closeHour; h++) {
      list.push(h);
    }
    return list;
  }, [openHour, closeHour]);

  const todayStr = React.useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const isToday = dateStr === todayStr;

  const [currentMinutes, setCurrentMinutes] = React.useState<number>(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  React.useEffect(() => {
    if (!isToday) return;
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, [isToday]);

  const currentTimeTopPx =
    isToday && currentMinutes >= startDayMinutes && currentMinutes <= startDayMinutes + totalDayMinutes
      ? ((currentMinutes - startDayMinutes) / totalDayMinutes) * totalHeightPx
      : null;

  const dayBookings = bookings.filter((b) => b.date === dateStr);

  const displayedStaff = React.useMemo(() => {
    if (mobileStaffTab === 'all') return staffList;
    return staffList.filter((s) => s.id === mobileStaffTab);
  }, [mobileStaffTab, staffList]);

  const isSingleColumn = displayedStaff.length === 1;

  const getStatusStyles = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#FFFDF9] border-l-[#B94A2C] border-[#DED5C6] text-[#201D1A] hover:bg-[#FAF7F2] shadow-2xs';
      case 'in-progress':
        return 'bg-[#FFF9EE] border-l-[#9A6417] border-[#EAD5B0] text-[#201D1A] hover:bg-[#FFF4DC] shadow-xs ring-1 ring-[#9A6417]/30';
      case 'completed':
        return 'bg-[#F5F8F5] border-l-[#2C4E37] border-[#DCE6DC] text-[#201D1A] opacity-75 hover:opacity-100 hover:bg-[#EEF4EE]';
      case 'cancelled':
        return 'slot-hatch-pattern border-l-[#8E8475] border-[#DED5C6] text-[#8E8475] opacity-55 hover:opacity-80 line-through';
    }
  };

  const getStatusStamp = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="text-[#B94A2C] font-mono text-[9px] uppercase tracking-wider font-bold">
            CONFIRMED
          </span>
        );
      case 'in-progress':
        return <span className="stamp-in-chair">IN CHAIR</span>;
      case 'completed':
        return <span className="stamp-completed">PAID</span>;
      case 'cancelled':
        return <span className="stamp-cancelled">VOID</span>;
    }
  };

  return (
    <div className="space-y-2">
      {/* Mobile Barber Chair Segment Switcher (visible on mobile & tablet < lg) */}
      <div className="lg:hidden flex items-center justify-between gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1 bg-[#EFE9DC] rounded-lg border border-[#DED5C6]">
          <button
            type="button"
            onClick={() => setMobileStaffTab('all')}
            className={`px-3.5 py-2 rounded-md text-xs font-mono transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center justify-center ${
              mobileStaffTab === 'all'
                ? 'bg-[#FFFDF9] text-[#201D1A] font-bold shadow-2xs'
                : 'text-[#655D52] hover:text-[#201D1A]'
            }`}
          >
            All Chairs ({dayBookings.filter((b) => b.status !== 'cancelled').length})
          </button>
          {staffList.map((s) => {
            const count = dayBookings.filter(
              (b) => b.assignedStaffId === s.id && b.status !== 'cancelled'
            ).length;
            const firstName = s.name.split(' ')[0];
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setMobileStaffTab(s.id)}
                className={`px-3.5 py-2 rounded-md text-xs font-mono transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                  mobileStaffTab === s.id
                    ? 'bg-[#FFFDF9] text-[#B94A2C] font-bold shadow-2xs'
                    : 'text-[#655D52] hover:text-[#201D1A]'
                }`}
              >
                {firstName} ({count})
              </button>
            );
          })}
        </div>

        {mobileStaffTab === 'all' && (
          <span className="text-[10px] text-[#8E8475] font-mono whitespace-nowrap hidden sm:inline">
            ⇄ Swipe timeline
          </span>
        )}
      </div>

      <div className="bg-[#FFFDF9] border-2 border-[#D8CEBE] rounded-xl overflow-hidden shadow-sm">
        {/* Staff Columns Ledger Header */}
        <div className="border-b border-[#DED5C6] bg-[#FAF7F2] sticky top-0 z-20">
          <div
            className={`grid ${
              isSingleColumn
                ? 'grid-cols-[54px_1fr] sm:grid-cols-[64px_1fr]'
                : 'grid-cols-[54px_minmax(500px,1fr)] sm:grid-cols-[64px_minmax(600px,1fr)]'
            }`}
          >
            <div className="p-2 sm:p-3 border-r border-[#DED5C6] flex items-center justify-center text-[11px] font-mono text-[#8E8475] sticky left-0 z-30 bg-[#FAF7F2]">
              <Clock className="w-3.5 h-3.5" />
            </div>

            <div
              className={`grid divide-x divide-[#DED5C6] ${
                isSingleColumn ? 'grid-cols-1' : `grid-cols-${displayedStaff.length}`
              }`}
              style={{
                gridTemplateColumns: isSingleColumn
                  ? '1fr'
                  : `repeat(${displayedStaff.length}, minmax(180px, 1fr))`,
              }}
            >
              {displayedStaff.map((staff) => {
                const staffCount = dayBookings.filter(
                  (b) => b.assignedStaffId === staff.id && b.status !== 'cancelled'
                ).length;

                return (
                  <div key={staff.id} className="p-2.5 sm:p-3 flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-[#D5CAB8] bg-[#EFE9DC] shrink-0">
                        <img
                          src={staff.avatarUrl}
                          alt={staff.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top filter contrast-[1.05]"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#201D1A] truncate">
                          {staff.name}
                        </h4>
                        <p className="text-[10px] text-[#8E8475] truncate">
                          {staff.role.split('&')[0]}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] sm:text-[11px] font-mono tabular-nums px-2 py-0.5 rounded bg-[#FFFDF9] text-[#B94A2C] border border-[#DED5C6] font-semibold shrink-0">
                      {staffCount} {staffCount === 1 ? 'client' : 'clients'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Timeline Scrollable Canvas */}
        <div
          ref={containerRef}
          className="overflow-x-auto relative scrollbar-thin"
          style={{ height: `${totalHeightPx + 40}px` }}
        >
          <div
            className={`grid relative ${
              isSingleColumn
                ? 'grid-cols-[54px_1fr] sm:grid-cols-[64px_1fr] w-full'
                : 'grid-cols-[54px_minmax(500px,1fr)] sm:grid-cols-[64px_minmax(600px,1fr)] min-w-[554px] sm:min-w-[664px]'
            }`}
            style={{ height: `${totalHeightPx}px` }}
          >
            {/* Vertical Hours Column (Sticky on horizontal swipe!) */}
            <div className="border-r border-[#DED5C6] relative bg-[#FAF7F2] select-none sticky left-0 z-20 shadow-[2px_0_4px_rgba(32,29,26,0.03)]">
              {hoursArray.map((hour, idx) => {
                const topPx = idx * hourHeightPx;
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayH = hour % 12 === 0 ? 12 : hour % 12;

                return (
                  <div
                    key={hour}
                    className="absolute right-1.5 sm:right-2 -translate-y-1/2 text-[10px] sm:text-[11px] font-mono text-[#8E8475] tabular-nums font-medium"
                    style={{ top: `${topPx}px` }}
                  >
                    {displayH}:00 {period}
                  </div>
                );
              })}

              {/* Current Time NOW indicator tag */}
              {currentTimeTopPx !== null && (
                <div
                  className="absolute right-1 -translate-y-1/2 z-30 pointer-events-none px-1.5 py-0.5 rounded bg-[#B94A2C] text-[#FFFDF9] font-mono text-[9px] font-bold tracking-tight shadow-xs whitespace-nowrap"
                  style={{ top: `${currentTimeTopPx}px` }}
                >
                  LIVE
                </div>
              )}
            </div>

            {/* Columns Grid Canvas */}
            <div
              className="grid divide-x divide-[#DED5C6] relative bg-[#FFFDF9]"
              style={{
                gridTemplateColumns: isSingleColumn
                  ? '1fr'
                  : `repeat(${displayedStaff.length}, minmax(180px, 1fr))`,
              }}
            >
              {/* Horizontal hour lines */}
              <div className="absolute inset-0 pointer-events-none">
                {hoursArray.map((_, idx) => (
                  <div
                    key={idx}
                    className="border-b border-[#EFE9DC] w-full absolute"
                    style={{ top: `${idx * hourHeightPx}px` }}
                  />
                ))}
                {/* Half-hour dashed lines */}
                {hoursArray.slice(0, -1).map((_, idx) => (
                  <div
                    key={`half-${idx}`}
                    className="border-b border-[#EFE9DC] border-dashed w-full absolute"
                    style={{ top: `${idx * hourHeightPx + hourHeightPx / 2}px` }}
                  />
                ))}
              </div>

              {/* Current Time Red Ribbon */}
              {currentTimeTopPx !== null && (
                <div
                  className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                  style={{ top: `${currentTimeTopPx}px` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B94A2C] -ml-1.5 shadow-sm ring-2 ring-[#B94A2C]/20"></div>
                  <div className="h-[2px] bg-[#B94A2C] flex-1 shadow-xs"></div>
                </div>
              )}

              {/* Staff Columns */}
              {displayedStaff.map((staff) => {
                const staffBookings = dayBookings.filter(
                  (b) => b.assignedStaffId === staff.id
                );

                return (
                  <div
                    key={staff.id}
                    className="relative h-full transition-colors group/col cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickY = e.clientY - rect.top;
                      const minutesFromStart = Math.floor(
                        (clickY / totalHeightPx) * totalDayMinutes
                      );
                      const roundedMinutes =
                        Math.floor(minutesFromStart / 15) * 15 + startDayMinutes;
                      const h = Math.floor(roundedMinutes / 60);
                      const m = roundedMinutes % 60;
                      const timeStr = `${String(h).padStart(2, '0')}:${String(
                        m
                      ).padStart(2, '0')}`;
                      onSlotClick(timeStr, staff.id);
                    }}
                  >
                    <div className="absolute inset-0 hover:bg-[#FAF0EC]/30 transition-colors"></div>

                    {/* Render Bookings as Physical Appointment Slips */}
                    {staffBookings.map((b) => {
                      const startM = timeToMinutes(b.startTime);
                      const endM = timeToMinutes(b.endTime);
                      const durationM = endM - startM;

                      const topPx =
                        ((startM - startDayMinutes) / totalDayMinutes) * totalHeightPx;
                      const heightPx = Math.max(
                        (durationM / totalDayMinutes) * totalHeightPx - 2,
                        32
                      );

                      const bookedServiceNames = services
                        .filter((s) => b.serviceIds.includes(s.id))
                        .map((s) => s.name)
                        .join(' + ');

                      return (
                        <div
                          key={b.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBooking(b);
                          }}
                          style={{
                            top: `${topPx}px`,
                            height: `${heightPx}px`,
                          }}
                          className={`absolute left-1 sm:left-1.5 right-1 sm:right-1.5 rounded-lg border-l-4 p-1.5 sm:p-2 z-10 transition-all cursor-pointer overflow-hidden border ${getStatusStyles(
                            b.status
                          )}`}
                        >
                          <div className="flex items-start justify-between gap-1 leading-none">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-serif font-bold text-xs truncate block text-[#201D1A]">
                                  {b.customer.name}
                                </span>
                                {getStatusStamp(b.status)}
                              </div>
                              <span className="text-[10px] text-[#655D52] truncate block mt-0.5 font-sans">
                                {bookedServiceNames}
                              </span>
                            </div>

                            <span className="font-mono text-[10px] tabular-nums shrink-0 text-[#201D1A] font-bold">
                              {currency}{b.totalPrice}
                            </span>
                          </div>

                          {heightPx > 46 && (
                            <div className="flex items-center justify-between text-[10px] font-mono text-[#655D52] mt-1 pt-1 border-t border-[#DED5C6]/60">
                              <span>
                                {formatDisplayTime(b.startTime)} – {formatDisplayTime(b.endTime)}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider text-[#8E8475]">
                                {b.totalDurationMinutes}m
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
