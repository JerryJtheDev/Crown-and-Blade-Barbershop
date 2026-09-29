import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Search,
  Trash2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Booking, BookingStatus, BusinessProfile, Service, StaffMember } from '../../types/booking';
import { formatDateKey } from '../../utils/storage';
import { formatDisplayTime, formatFullDate, isBusinessClosedDate } from '../../utils/calendar';
import { StaffColumnTimeline } from './StaffColumnTimeline';
import { WeekOverview } from './WeekOverview';
import { BookingDetailModal } from './BookingDetailModal';
import { QuickBookingModal } from './QuickBookingModal';
import { ServiceManagerModal } from './ServiceManagerModal';

interface AdminTimelineViewProps {
  bookings: Booking[];
  services: Service[];
  allStaff: StaffMember[];
  businessProfile: BusinessProfile;
  initialDate?: string;
  onUpdateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  onDeleteBooking: (bookingId: string) => void;
  onAddBooking: (newBooking: Booking) => void;
  onSaveServices: (updatedServices: Service[]) => void;
  onClearAllBookings?: () => void;
  onResetData?: () => void;
}

export const AdminTimelineView: React.FC<AdminTimelineViewProps> = ({
  bookings,
  services,
  allStaff,
  businessProfile,
  initialDate,
  onUpdateBookingStatus,
  onDeleteBooking,
  onAddBooking,
  onSaveServices,
  onClearAllBookings,
  onResetData,
}) => {
  const todayKey = React.useMemo(() => formatDateKey(new Date()), []);

  const [currentDateStr, setCurrentDateStr] = React.useState<string>(
    initialDate || todayKey
  );
  const [activeTab, setActiveTab] = React.useState<'timeline' | 'stream' | 'week'>('timeline');

  const isCurrentDateMonday = React.useMemo(
    () => isBusinessClosedDate(currentDateStr, [1]),
    [currentDateStr]
  );

  // Search & filter
  const [searchQuery, setSearchQuery] = React.useState('');
  const [staffFilter, setStaffFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  // Modals
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [isQuickBookingOpen, setIsQuickBookingOpen] = React.useState(false);
  const [quickBookingSlot, setQuickBookingSlot] = React.useState<{
    time?: string;
    staffId?: string;
  }>({});
  const [isServiceManagerOpen, setIsServiceManagerOpen] = React.useState(false);

  const handlePrevDay = () => {
    const d = new Date(currentDateStr + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setCurrentDateStr(formatDateKey(d));
  };

  const handleNextDay = () => {
    const d = new Date(currentDateStr + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setCurrentDateStr(formatDateKey(d));
  };

  const handleGoToday = () => {
    setCurrentDateStr(todayKey);
  };

  const handleSlotClick = (time: string, staffId: string) => {
    setQuickBookingSlot({ time, staffId });
    setIsQuickBookingOpen(true);
  };

  const filteredDayBookings = React.useMemo(() => {
    return bookings
      .filter((b) => b.date === currentDateStr)
      .filter((b) => {
        if (staffFilter !== 'all' && b.assignedStaffId !== staffFilter) return false;
        if (statusFilter !== 'all' && b.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = b.customer.name.toLowerCase().includes(q);
          const matchPhone = b.customer.phone.toLowerCase().includes(q);
          const matchCode = b.bookingCode.toLowerCase().includes(q);
          return matchName || matchPhone || matchCode;
        }
        return true;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [bookings, currentDateStr, staffFilter, statusFilter, searchQuery]);

  const dayStats = React.useMemo(() => {
    const dayAll = bookings.filter((b) => b.date === currentDateStr);
    const active = dayAll.filter((b) => b.status !== 'cancelled');
    const revenue = active.reduce((sum, b) => sum + b.totalPrice, 0);
    return {
      total: dayAll.length,
      active: active.length,
      revenue,
    };
  }, [bookings, currentDateStr]);

  return (
    <div className="min-h-screen bg-[#F6F2EA] pb-16 text-[#201D1A]">
      {/* Top Ledger Header */}
      <section className="bg-[#FAF7F2] border-b-2 border-[#DED5C6] sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 space-y-3 sm:space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            {/* Date Navigator */}
            <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-center bg-[#FFFDF9] rounded-lg border border-[#DED5C6] p-0.5 shadow-2xs shrink-0">
                <button
                  type="button"
                  onClick={handlePrevDay}
                  className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-[#655D52] hover:text-[#201D1A] rounded-md transition-colors cursor-pointer"
                  title="Previous Day"
                  aria-label="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleGoToday}
                  className={`px-3 py-1.5 sm:py-1 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer min-h-[36px] sm:min-h-0 flex items-center justify-center ${
                    currentDateStr === todayKey
                      ? 'bg-[#B94A2C] text-[#FFFDF9] font-bold'
                      : 'text-[#655D52] hover:text-[#201D1A]'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={handleNextDay}
                  className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-[#655D52] hover:text-[#201D1A] rounded-md transition-colors cursor-pointer"
                  title="Next Day"
                  aria-label="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#201D1A] truncate">
                  {formatFullDate(currentDateStr)}
                </h1>
                <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#655D52] font-mono tabular-nums">
                  <span className="font-semibold text-[#201D1A]">{dayStats.active} clients</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#B94A2C] font-semibold">{businessProfile.currency}{dayStats.revenue}.00 volume</span>
                </div>
              </div>
            </div>

            {/* Actions & View Modes */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* View tabs: 3-column grid on mobile (min-h 44px), inline flex on larger */}
              <div className="grid grid-cols-3 sm:flex items-center bg-[#EFE9DC] p-1 rounded-lg border border-[#DED5C6]">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer text-center min-h-[40px] sm:min-h-0 flex items-center justify-center ${
                    activeTab === 'timeline'
                      ? 'bg-[#FFFDF9] text-[#201D1A] shadow-xs font-bold'
                      : 'text-[#655D52] hover:text-[#201D1A]'
                  }`}
                >
                  Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('stream')}
                  className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer text-center min-h-[40px] sm:min-h-0 flex items-center justify-center ${
                    activeTab === 'stream'
                      ? 'bg-[#FFFDF9] text-[#201D1A] shadow-xs font-bold'
                      : 'text-[#655D52] hover:text-[#201D1A]'
                  }`}
                >
                  Run Sheet
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('week')}
                  className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer text-center min-h-[40px] sm:min-h-0 flex items-center justify-center ${
                    activeTab === 'week'
                      ? 'bg-[#FFFDF9] text-[#201D1A] shadow-xs font-bold'
                      : 'text-[#655D52] hover:text-[#201D1A]'
                  }`}
                >
                  7-Day Grid
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:flex items-center gap-2">
                {/* Service Management */}
                <button
                  type="button"
                  onClick={() => setIsServiceManagerOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg bg-[#FFFDF9] hover:bg-[#EFE9DC] text-[#201D1A] border border-[#DED5C6] text-xs font-mono transition-colors cursor-pointer min-h-[44px] sm:min-h-0 shadow-2xs"
                >
                  <Settings className="w-3.5 h-3.5 text-[#B94A2C]" />
                  <span>Rates</span>
                </button>

                {/* Clear Bookings */}
                {onClearAllBookings && (
                  <button
                    type="button"
                    onClick={onClearAllBookings}
                    title="Clear all bookings from schedule to start fresh"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg bg-[#FFFDF9] hover:bg-[#FAF0EC] text-[#8E8475] hover:text-[#B94A2C] border border-[#DED5C6] hover:border-[#B94A2C]/60 text-xs font-mono transition-colors cursor-pointer min-h-[44px] sm:min-h-0 shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#B94A2C]" />
                    <span>Clear</span>
                  </button>
                )}

                {/* Quick Walk-in Button (Full width on mobile or prominent) */}
                <button
                  type="button"
                  onClick={() => {
                    setQuickBookingSlot({});
                    setIsQuickBookingOpen(true);
                  }}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-lg bg-[#B94A2C] hover:bg-[#9A381F] text-[#FFFDF9] font-mono font-semibold text-xs transition-colors cursor-pointer min-h-[44px] sm:min-h-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Walk-In Booking</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters Row */}
          {activeTab !== 'week' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2.5 border-t border-[#DED5C6] text-xs font-sans">
              <div className="relative flex-1 w-full sm:max-w-xs md:max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8475]" />
                <input
                  type="text"
                  placeholder="Search client, phone, or docket ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 sm:py-1.5 bg-[#FFFDF9] border border-[#DED5C6] rounded-lg text-xs text-[#201D1A] placeholder-[#8E8475] focus:outline-none focus:border-[#B94A2C] min-h-[44px] sm:min-h-0"
                />
              </div>

              <div className="grid grid-cols-2 sm:flex items-center gap-2">
                <select
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-[#FFFDF9] border border-[#DED5C6] rounded-lg text-[#201D1A] text-xs font-mono focus:outline-none min-h-[44px] sm:min-h-0"
                >
                  <option value="all">All Specialists</option>
                  {allStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-[#FFFDF9] border border-[#DED5C6] rounded-lg text-[#201D1A] text-xs font-mono focus:outline-none min-h-[44px] sm:min-h-0"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Chair</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Agenda Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Monday Closed Alert Banner */}
        {isCurrentDateMonday && (
          <div className="p-4 rounded-xl border border-dashed border-[#B94A2C]/60 bg-[#FAF0EC] flex items-center justify-between gap-4 text-xs font-sans">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#B94A2C] text-[#FFFDF9] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#201D1A]">
                  Scheduled Sanitation &amp; Rest Day (Mondays Closed)
                </h4>
                <p className="text-[#655D52] mt-0.5">
                  The customer booking calendar automatically marks Mondays as unavailable for online reservations.
                  Any manual walk-ins or VIP appointments placed here are tracked as special shop sessions.
                </p>
              </div>
            </div>

            <span className="stamp-seal text-[9px] shrink-0">
              OFFLINE DAY
            </span>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#655D52] font-mono">
              <span>
                Click an appointment slip to edit status. Click empty space to add a walk-in.
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#FAF0EC] border border-[#B94A2C]"></span>
                  <span>Confirmed</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#FCF6E8] border border-[#9A6417]"></span>
                  <span>In Chair</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#EEF4EE] border border-[#2C4E37]"></span>
                  <span>Completed</span>
                </span>
              </div>
            </div>

            <StaffColumnTimeline
              dateStr={currentDateStr}
              staffList={staffFilter === 'all' ? allStaff : allStaff.filter((s) => s.id === staffFilter)}
              bookings={filteredDayBookings}
              services={services}
              openHour={businessProfile.openHour}
              closeHour={businessProfile.closeHour}
              currency={businessProfile.currency}
              onSelectBooking={setSelectedBooking}
              onSlotClick={handleSlotClick}
            />
          </div>
        )}

        {/* View 2: Sequential Day Run Sheet */}
        {activeTab === 'stream' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#655D52]">
              <span>Sequential Run Sheet for {formatFullDate(currentDateStr)}</span>
              <span>{filteredDayBookings.length} clients listed</span>
            </div>

            {filteredDayBookings.length === 0 ? (
              <div className="p-12 text-center bg-[#FFFDF9] border border-[#DED5C6] rounded-xl text-sm text-[#8E8475] font-serif italic">
                No bookings found matching current filters for this date.
              </div>
            ) : (
              <div className="divide-y divide-[#EFE9DC] border-2 border-[#D8CEBE] rounded-xl bg-[#FFFDF9] overflow-hidden shadow-xs">
                {filteredDayBookings.map((b) => {
                  const staff = allStaff.find((s) => s.id === b.assignedStaffId);
                  const bookedSrvs = services.filter((s) => b.serviceIds.includes(s.id));

                  return (
                    <div
                      key={b.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-20 shrink-0 text-left">
                          <span className="font-serif font-bold text-sm text-[#B94A2C] tabular-nums block">
                            {formatDisplayTime(b.startTime)}
                          </span>
                          <span className="text-[10px] text-[#8E8475] font-mono tabular-nums block">
                            {formatDisplayTime(b.endTime)} ({b.totalDurationMinutes}m)
                          </span>
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4
                              onClick={() => setSelectedBooking(b)}
                              className="font-serif font-bold text-base text-[#201D1A] hover:text-[#B94A2C] transition-colors cursor-pointer truncate"
                            >
                              {b.customer.name}
                            </h4>
                            <span className="text-[10px] font-mono text-[#8E8475]">
                              Docket: {b.bookingCode}
                            </span>
                          </div>

                          <div className="text-xs text-[#655D52] truncate font-sans">
                            {bookedSrvs.map((s) => s.name).join(' + ')}
                          </div>

                          <div className="text-[11px] text-[#8E8475] font-mono flex items-center gap-3">
                            <span>Artisan: {staff?.name}</span>
                            <span>Tel: {b.customer.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between sm:justify-end gap-3 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-[#EFE9DC]">
                        <span className="font-serif text-base font-bold text-[#201D1A] tabular-nums">
                          {businessProfile.currency}{b.totalPrice}.00
                        </span>

                        <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap">
                          <button
                            type="button"
                            onClick={() => onUpdateBookingStatus(b.id, 'in-progress')}
                            className={`px-2.5 py-1.5 rounded transition-colors cursor-pointer min-h-[38px] flex items-center justify-center ${
                              b.status === 'in-progress'
                                ? 'bg-[#FCF6E8] text-[#9A6417] border border-[#9A6417] font-semibold'
                                : 'bg-[#FAF7F2] text-[#655D52] border border-[#DED5C6] hover:bg-[#EFE9DC]'
                            }`}
                          >
                            In Chair
                          </button>

                          <button
                            type="button"
                            onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                            className={`px-2.5 py-1.5 rounded transition-colors cursor-pointer min-h-[38px] flex items-center justify-center ${
                              b.status === 'completed'
                                ? 'bg-[#EEF4EE] text-[#2C4E37] border border-[#2C4E37] font-semibold'
                                : 'bg-[#FAF7F2] text-[#655D52] border border-[#DED5C6] hover:bg-[#EFE9DC]'
                            }`}
                          >
                            Done
                          </button>

                          <button
                            type="button"
                            onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                            className={`px-2.5 py-1.5 rounded transition-colors cursor-pointer min-h-[38px] flex items-center justify-center ${
                              b.status === 'cancelled'
                                ? 'bg-[#FAF0EC] text-[#B94A2C] border border-[#B94A2C] font-semibold'
                                : 'bg-[#FAF7F2] text-[#8E8475] border border-[#DED5C6] hover:text-[#B94A2C]'
                            }`}
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            className="px-3 py-1.5 rounded bg-[#EFE9DC] text-[#201D1A] hover:bg-[#DED5C6] transition-colors cursor-pointer font-medium min-h-[38px] flex items-center justify-center"
                          >
                            Slip →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* View 3: Week Grid Overview */}
        {activeTab === 'week' && (
          <WeekOverview
            currentDateStr={currentDateStr}
            bookings={bookings}
            services={services}
            staffList={allStaff}
            currency={businessProfile.currency}
            onSelectDate={(newDate) => {
              setCurrentDateStr(newDate);
              setActiveTab('timeline');
            }}
            onSelectBooking={setSelectedBooking}
          />
        )}
      </main>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        services={services}
        allStaff={allStaff}
        currency={businessProfile.currency}
        onClose={() => setSelectedBooking(null)}
        onUpdateStatus={onUpdateBookingStatus}
        onDeleteBooking={onDeleteBooking}
      />

      {/* Quick Booking Modal */}
      {isQuickBookingOpen && (
        <QuickBookingModal
          initialDate={currentDateStr}
          initialTime={quickBookingSlot.time || '11:00'}
          initialStaffId={quickBookingSlot.staffId}
          services={services}
          allStaff={allStaff}
          currency={businessProfile.currency}
          onClose={() => setIsQuickBookingOpen(false)}
          onSaveBooking={onAddBooking}
        />
      )}

      {/* Service & Catalog Manager Modal */}
      {isServiceManagerOpen && (
        <ServiceManagerModal
          services={services}
          currency={businessProfile.currency}
          onClose={() => setIsServiceManagerOpen(false)}
          onSaveServices={onSaveServices}
        />
      )}
    </div>
  );
};
