import React from 'react';
import { Booking, BookingStatus, Service, StaffMember } from '../../types/booking';
import { formatDisplayTime, formatFullDate } from '../../utils/calendar';

interface BookingDetailModalProps {
  booking: Booking | null;
  services: Service[];
  allStaff: StaffMember[];
  currency: string;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  services,
  allStaff,
  currency,
  onClose,
  onUpdateStatus,
  onDeleteBooking,
}) => {
  if (!booking) return null;

  const bookedServices = services.filter((s) => booking.serviceIds.includes(s.id));
  const assignedStaff = allStaff.find((s) => s.id === booking.assignedStaffId);

  const getStatusStamp = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="stamp-seal text-[10px]">Confirmed // Locked</span>;
      case 'in-progress':
        return <span className="stamp-seal text-[10px] text-[#9A6417] border-[#9A6417]">In Chair // Active</span>;
      case 'completed':
        return <span className="stamp-seal text-[10px] text-[#2C4E37] border-[#2C4E37]">Fulfilled // Completed</span>;
      case 'cancelled':
        return <span className="stamp-seal text-[10px] text-[#8E8475] border-[#8E8475] line-through">Cancelled</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#201D1A]/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFDF9] border-2 border-[#D8CEBE] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden divide-y divide-[#EFE9DC] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-start justify-between bg-[#FAF7F2] shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-[#8E8475]">
                Docket: {booking.bookingCode}
              </span>
              {getStatusStamp(booking.status)}
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#201D1A] mt-1">
              {booking.customer.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-xs font-mono text-[#8E8475] hover:text-[#201D1A] rounded-lg bg-[#EFE9DC] transition-colors cursor-pointer"
            aria-label="Close Docket"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs font-sans overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#FAF7F2] rounded border border-[#E8DFD3] space-y-1">
              <span className="text-[10px] font-mono text-[#8E8475] uppercase block">
                Scheduled Date
              </span>
              <span className="font-serif font-bold text-[#201D1A] text-sm block">
                {formatFullDate(booking.date)}
              </span>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded border border-[#E8DFD3] space-y-1">
              <span className="text-[10px] font-mono text-[#8E8475] uppercase block">
                Time Window
              </span>
              <span className="font-serif font-bold text-[#B94A2C] text-sm tabular-nums block">
                {formatDisplayTime(booking.startTime)} – {formatDisplayTime(booking.endTime)} ({booking.totalDurationMinutes}m)
              </span>
            </div>
          </div>

          {/* Specialist */}
          <div className="p-3 bg-[#FAF7F2] rounded border border-[#E8DFD3] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D5CAB8] bg-[#EFE9DC]">
                {assignedStaff && (
                  <img
                    src={assignedStaff.avatarUrl}
                    alt={assignedStaff.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter contrast-[1.05]"
                  />
                )}
              </div>
              <div>
                <span className="text-[10px] text-[#8E8475] uppercase font-mono block">
                  Assigned Artisan
                </span>
                <span className="font-serif font-bold text-[#201D1A] text-base block">
                  {assignedStaff?.name || 'Unassigned'}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-[#655D52]">
              {assignedStaff?.role}
            </span>
          </div>

          {/* Customer contact */}
          <div className="p-3 bg-[#FAF7F2] rounded border border-[#E8DFD3] space-y-2 font-mono">
            <span className="text-[10px] text-[#8E8475] uppercase block">
              Contact Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href={`tel:${booking.customer.phone}`}
                className="text-[#201D1A] hover:text-[#B94A2C] transition-colors"
              >
                Tel: {booking.customer.phone}
              </a>

              {booking.customer.email && (
                <a
                  href={`mailto:${booking.customer.email}`}
                  className="text-[#201D1A] hover:text-[#B94A2C] transition-colors truncate"
                >
                  Mail: {booking.customer.email}
                </a>
              )}
            </div>

            {booking.customer.notes && (
              <div className="pt-2 border-t border-[#E8DFD3] text-[#655D52] italic font-serif text-sm">
                "{booking.customer.notes}"
              </div>
            )}
          </div>

          {/* Booked Services */}
          <div className="p-3 bg-[#FAF7F2] rounded border border-[#E8DFD3] space-y-1.5">
            <span className="text-[10px] text-[#8E8475] uppercase font-mono block">
              Booked Services
            </span>
            {bookedServices.map((s) => (
              <div key={s.id} className="flex justify-between items-center text-[#201D1A]">
                <span className="font-serif font-medium">{s.name} ({s.durationMinutes}m)</span>
                <span className="font-mono tabular-nums text-[#655D52]">
                  {currency}{s.price}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-[#E8DFD3] flex justify-between items-center font-serif font-bold text-sm">
              <span>Total Session Investment</span>
              <span className="font-mono tabular-nums text-[#B94A2C] text-base">
                {currency}{booking.totalPrice}.00
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-5 bg-[#FAF7F2] space-y-3 font-mono">
          <span className="text-[10px] text-[#8E8475] uppercase block">
            Update Appointment Status
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => onUpdateStatus(booking.id, 'confirmed')}
              className={`py-2 px-2.5 rounded border transition-colors cursor-pointer ${
                booking.status === 'confirmed'
                  ? 'bg-[#B94A2C] text-[#FFFDF9] border-[#B94A2C] font-bold'
                  : 'bg-[#FFFDF9] border-[#DED5C6] text-[#655D52] hover:text-[#201D1A]'
              }`}
            >
              Confirmed
            </button>

            <button
              onClick={() => onUpdateStatus(booking.id, 'in-progress')}
              className={`py-2 px-2.5 rounded border transition-colors cursor-pointer ${
                booking.status === 'in-progress'
                  ? 'bg-[#9A6417] text-[#FFFDF9] border-[#9A6417] font-bold'
                  : 'bg-[#FFFDF9] border-[#DED5C6] text-[#655D52] hover:text-[#201D1A]'
              }`}
            >
              In Chair
            </button>

            <button
              onClick={() => onUpdateStatus(booking.id, 'completed')}
              className={`py-2 px-2.5 rounded border transition-colors cursor-pointer ${
                booking.status === 'completed'
                  ? 'bg-[#2C4E37] text-[#FFFDF9] border-[#2C4E37] font-bold'
                  : 'bg-[#FFFDF9] border-[#DED5C6] text-[#655D52] hover:text-[#201D1A]'
              }`}
            >
              Complete
            </button>

            <button
              onClick={() => onUpdateStatus(booking.id, 'cancelled')}
              className={`py-2 px-2.5 rounded border transition-colors cursor-pointer ${
                booking.status === 'cancelled'
                  ? 'bg-[#8E8475] text-[#FFFDF9] border-[#8E8475]'
                  : 'bg-[#FFFDF9] border-[#DED5C6] text-[#8E8475] hover:text-[#B94A2C]'
              }`}
            >
              Cancel
            </button>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                if (confirm('Permanently remove this booking docket?')) {
                  onDeleteBooking(booking.id);
                  onClose();
                }
              }}
              className="text-[#B94A2C] hover:underline cursor-pointer"
            >
              [Delete Record]
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-[#EFE9DC] hover:bg-[#DED5C6] text-[#201D1A] transition-colors cursor-pointer font-medium"
            >
              Close Docket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
