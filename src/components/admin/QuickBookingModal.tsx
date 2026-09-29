import React from 'react';
import { Booking, Service, StaffMember } from '../../types/booking';
import { addMinutesToTime } from '../../utils/calendar';

interface QuickBookingModalProps {
  initialDate: string;
  initialTime?: string;
  initialStaffId?: string;
  services: Service[];
  allStaff: StaffMember[];
  currency: string;
  onClose: () => void;
  onSaveBooking: (booking: Booking) => void;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  initialDate,
  initialTime = '10:00',
  initialStaffId,
  services,
  allStaff,
  currency,
  onClose,
  onSaveBooking,
}) => {
  const [date, setDate] = React.useState(initialDate);
  const [time, setTime] = React.useState(initialTime);
  const [staffId, setStaffId] = React.useState(
    initialStaffId && initialStaffId !== 'any' ? initialStaffId : allStaff[0]?.id || ''
  );
  const [selectedServiceIds, setSelectedServiceIds] = React.useState<string[]>([
    services[0]?.id || '',
  ]);
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const endTime = time && totalDuration > 0 ? addMinutesToTime(time, totalDuration) : time;

  const toggleService = (srvId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(srvId)
        ? prev.filter((id) => id !== srvId)
        : [...prev, srvId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !time || selectedServiceIds.length === 0) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode: `CB-${randomSuffix}`,
      serviceIds: selectedServiceIds,
      staffId,
      assignedStaffId: staffId,
      date,
      startTime: time,
      endTime,
      totalDurationMinutes: totalDuration,
      totalPrice,
      customer: {
        name: customerName,
        phone: customerPhone || '(Walk-in)',
        email: customerEmail,
        notes: notes || 'Direct walk-in entry',
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onSaveBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#201D1A]/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFDF9] border-2 border-[#D8CEBE] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden divide-y divide-[#EFE9DC] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B94A2C] block font-bold">
              Reception Desk Entry
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#201D1A]">
              Log Walk-In Appointment
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-xs font-mono text-[#8E8475] hover:text-[#201D1A] rounded-lg bg-[#EFE9DC] transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-5 space-y-4 text-xs font-sans overflow-y-auto flex-1">
            {/* Date, Time, Staff Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono">
              <div>
                <label className="block text-[11px] text-[#655D52] mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] focus:outline-none focus:border-[#B94A2C] min-h-[44px] text-[15px] sm:text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#655D52] mb-1">Start Time</label>
                <input
                  type="time"
                  value={time}
                  step="900"
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] focus:outline-none focus:border-[#B94A2C] min-h-[44px] text-[15px] sm:text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#655D52] mb-1">Artisan</label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] focus:outline-none focus:border-[#B94A2C] min-h-[44px] text-[15px] sm:text-xs"
                >
                  {allStaff.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select Services */}
            <div>
              <label className="block text-[11px] font-mono text-[#655D52] mb-1.5">
                Service(s) · {totalDuration}m · {currency}{totalPrice}.00
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map((srv) => {
                  const isChecked = selectedServiceIds.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-colors flex items-center justify-between min-h-[44px] ${
                        isChecked
                          ? 'bg-[#FAF0EC] border-[#B94A2C] text-[#201D1A]'
                          : 'bg-[#FAF7F2] border-[#DED5C6] text-[#655D52] hover:border-[#B5A793]'
                      }`}
                    >
                      <div className="truncate pr-1">
                        <span className="font-serif font-bold block truncate text-xs">{srv.name}</span>
                        <span className="text-[10px] font-mono opacity-80">
                          {srv.durationMinutes}m · {currency}{srv.price}
                        </span>
                      </div>
                      {isChecked && <span className="font-mono text-xs font-bold text-[#B94A2C]">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 pt-2 border-t border-[#EFE9DC]">
              <div>
                <label className="block text-[11px] font-mono text-[#655D52] mb-1">
                  Customer Name <span className="text-[#B94A2C]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Babatunde Adeleke"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] placeholder-[#A89E8F] focus:outline-none focus:border-[#B94A2C] min-h-[44px] text-[15px] sm:text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono text-[#655D52] mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="0802 341 8912"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] placeholder-[#A89E8F] focus:outline-none focus:border-[#B94A2C] min-h-[44px] text-[15px] sm:text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#655D52] mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@mail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] placeholder-[#A89E8F] focus:outline-none focus:border-[#B94A2C] min-h-[44px] text-[15px] sm:text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#655D52] mb-1">Reception Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Walk-in, low skin fade, beard steam ritual"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] placeholder-[#A89E8F] focus:outline-none focus:border-[#B94A2C] min-h-[44px] text-[15px] sm:text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#FAF7F2] flex justify-end gap-2.5 font-mono shrink-0 border-t border-[#EFE9DC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs rounded-lg bg-[#EFE9DC] text-[#655D52] hover:text-[#201D1A] transition-colors cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!customerName || selectedServiceIds.length === 0}
              className="px-5 py-2.5 text-xs rounded-lg bg-[#B94A2C] hover:bg-[#9A381F] text-[#FFFDF9] font-semibold transition-colors cursor-pointer disabled:opacity-50 min-h-[44px] shadow-xs active:scale-98"
            >
              Commit to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
