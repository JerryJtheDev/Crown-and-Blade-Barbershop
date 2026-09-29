import React from 'react';
import { Booking, BusinessProfile, Service, StaffMember } from '../../types/booking';
import { downloadIcsCalendar, formatDisplayTime, formatFullDate } from '../../utils/calendar';

interface BookingConfirmationModalProps {
  booking: Booking | null;
  services: Service[];
  allStaff: StaffMember[];
  businessProfile: BusinessProfile;
  onClose: () => void;
  onViewInAgenda: (bookingDate: string) => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  services,
  allStaff,
  businessProfile,
  onClose,
  onViewInAgenda,
}) => {
  if (!booking) return null;

  const bookedServices = services.filter((s) => booking.serviceIds.includes(s.id));
  const assignedStaff = allStaff.find((s) => s.id === booking.assignedStaffId);
  const firstName = booking.customer.name.trim().split(' ')[0] || 'Friend';
  const staffFirstName = assignedStaff?.name.trim().split(' ')[0] || 'Your barber';

  const handleDownloadCalendar = () => {
    downloadIcsCalendar(booking, bookedServices, assignedStaff);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#201D1A]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFDF9] border-2 border-[#D8CEBE] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden divide-y divide-[#EFE9DC] max-h-[92vh] flex flex-col">
        {/* Header with authentic stamp */}
        <div className="p-5 sm:p-6 text-center bg-[#FAF7F2] relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-10 h-10 flex items-center justify-center text-xs font-mono text-[#8E8475] hover:text-[#201D1A] rounded-lg bg-[#EFE9DC] transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="stamp-seal mb-2.5 text-xs">
            CONFIRMED · APPOINTMENT SECURED
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#201D1A] tracking-tight">
            We've Saved Your Chair, {firstName}
          </h3>

          <p className="text-xs sm:text-sm text-[#655D52] mt-1.5 font-sans max-w-md mx-auto leading-relaxed">
            {staffFirstName} is looking forward to hosting you at {businessProfile.name} on{' '}
            <strong className="text-[#201D1A] font-semibold">{formatFullDate(booking.date)}</strong> at{' '}
            <strong className="text-[#B94A2C] font-semibold">{formatDisplayTime(booking.startTime)}</strong>.
          </p>

          <div className="mt-2.5 inline-block text-xs font-mono text-[#8E8475] bg-[#FFFDF9] border border-[#DED5C6] px-3 py-1 rounded-md">
            Docket Reference: <span className="text-[#B94A2C] font-bold">{booking.bookingCode}</span>
          </div>
        </div>

        {/* Scrollable details container */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#EFE9DC]">
          {/* Personalized Welcome Note */}
          <div className="p-4 sm:p-5 bg-[#FAF0EC]/60 text-xs font-sans text-[#655D52] space-y-1.5">
            <div className="font-serif font-bold text-[#201D1A] text-sm flex items-center gap-1.5">
              <span>A Neighborhood Note From Crown &amp; Blade</span>
            </div>
            <p className="leading-relaxed">
              Feel free to arrive 5–10 minutes early at 14 Admiralty Way, Lekki Phase 1. We'll have a cold bottle of malt, Chapman,
              or chilled water ready for you in the lounge while {staffFirstName} readies the eucalyptus steam towels and sterilizes your chair.
            </p>
            {booking.customer.notes && (
              <p className="text-[#B94A2C] font-mono text-[11px] pt-1">
                ✓ We've noted your styling request: "{booking.customer.notes}"
              </p>
            )}
          </div>

          {/* Details breakdown */}
          <div className="p-4 sm:p-6 space-y-3.5 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFD3] space-y-0.5">
                <span className="text-[10px] font-mono text-[#8E8475] uppercase block">
                  Scheduled Date
                </span>
                <span className="font-serif font-bold text-[#201D1A] text-sm block">
                  {formatFullDate(booking.date)}
                </span>
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFD3] space-y-0.5">
                <span className="text-[10px] font-mono text-[#8E8475] uppercase block">
                  Session Window
                </span>
                <span className="font-serif font-bold text-[#B94A2C] text-sm tabular-nums block">
                  {formatDisplayTime(booking.startTime)} – {formatDisplayTime(booking.endTime)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFD3] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#8E8475] uppercase block">
                  Artisan Specialist
                </span>
                <span className="font-serif font-bold text-[#201D1A] text-sm sm:text-base block mt-0.5">
                  {assignedStaff?.name || 'Assigned Specialist'}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-[#655D52]">
                {assignedStaff?.role}
              </span>
            </div>

            {/* Booked Services */}
            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFD3] space-y-2">
              <span className="text-[10px] text-[#8E8475] block font-mono uppercase tracking-wider">
                Selected Services
              </span>
              {bookedServices.map((srv) => (
                <div key={srv.id} className="flex justify-between items-center text-[#201D1A]">
                  <span className="font-serif font-medium">{srv.name}</span>
                  <span className="font-mono tabular-nums text-[#655D52]">
                    {businessProfile.currency}{srv.price}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#EFE9DC] flex justify-between items-center font-serif font-bold text-sm">
                <span>Total Due Upon Completion</span>
                <span className="font-mono tabular-nums text-[#B94A2C] text-base">
                  {businessProfile.currency}{booking.totalPrice}.00
                </span>
              </div>
            </div>

            {/* Location details */}
            <div className="text-[11px] text-[#8E8475] font-mono space-y-0.5 pt-1">
              <div className="font-serif font-bold text-[#201D1A] text-xs">{businessProfile.name}</div>
              <div>{businessProfile.address}</div>
              <div>Direct concierge: {businessProfile.phone}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] space-y-2 shrink-0">
          <button
            onClick={handleDownloadCalendar}
            className="w-full py-3 px-4 rounded-xl bg-[#FFFDF9] hover:bg-[#EFE9DC] text-[#201D1A] border border-[#DED5C6] text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs min-h-[44px]"
          >
            <span>↓ Add to Apple / Google Calendar (.ics)</span>
          </button>

          <button
            onClick={() => onViewInAgenda(booking.date)}
            className="w-full py-3 px-4 rounded-xl bg-[#B94A2C] hover:bg-[#9A381F] text-[#FFFDF9] text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px] active:scale-98"
          >
            <span>View Plotted in Master Agenda Book →</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs font-mono text-[#8E8475] hover:text-[#201D1A] cursor-pointer min-h-[38px] flex items-center justify-center"
          >
            Done · Return to Booking Menu
          </button>
        </div>
      </div>
    </div>
  );
};
