import React from 'react';
import { CustomerInfo, Service, StaffMember } from '../../types/booking';
import { addMinutesToTime, formatDisplayTime, formatFullDate } from '../../utils/calendar';

interface BookingTicketPanelProps {
  selectedServices: Service[];
  onRemoveService: (serviceId: string) => void;
  selectedStaff?: StaffMember;
  selectedStaffId: string;
  selectedDate: string;
  selectedTime: string;
  customerInfo: CustomerInfo;
  onUpdateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  currency: string;
  onConfirmBooking: () => void;
  isSubmitting: boolean;
}

export const BookingTicketPanel: React.FC<BookingTicketPanelProps> = ({
  selectedServices,
  onRemoveService,
  selectedStaff,
  selectedStaffId,
  selectedDate,
  selectedTime,
  customerInfo,
  onUpdateCustomerInfo,
  currency,
  onConfirmBooking,
  isSubmitting,
}) => {
  const [mobileExpanded, setMobileExpanded] = React.useState(false);

  // Animation pulse state when slot or service updates
  const [pulseTime, setPulseTime] = React.useState(false);
  const [pulsePrice, setPulsePrice] = React.useState(false);

  React.useEffect(() => {
    if (selectedTime) {
      setPulseTime(true);
      const t = setTimeout(() => setPulseTime(false), 600);
      return () => clearTimeout(t);
    }
  }, [selectedTime, selectedDate]);

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  React.useEffect(() => {
    setPulsePrice(true);
    const t = setTimeout(() => setPulsePrice(false), 600);
    return () => clearTimeout(t);
  }, [totalPrice, totalDuration]);

  const endTime = selectedTime && totalDuration > 0
    ? addMinutesToTime(selectedTime, totalDuration)
    : '';

  const hasServices = selectedServices.length > 0;
  const hasTime = !!selectedTime;
  const hasCustomerName = customerInfo.name.trim().length >= 2;
  const hasCustomerPhone = customerInfo.phone.trim().length >= 7;

  const isReadyToBook = hasServices && hasTime && hasCustomerName && hasCustomerPhone;

  const getMissingRequirementText = () => {
    if (!hasServices) return 'Select at least 1 service from the menu';
    if (!hasTime) return 'Choose an appointment time slot';
    if (!hasCustomerName) return 'Enter your name';
    if (!hasCustomerPhone) return 'Enter a contact phone number';
    return null;
  };

  const missingText = getMissingRequirementText();

  // Shared ticket content component used in both desktop sticky panel and mobile bottom sheet
  const renderTicketContent = (isMobileSheet = false) => (
    <div className="bg-[#FFFDF9] border-2 border-[#D8CEBE] rounded-xl shadow-lg overflow-hidden divide-y divide-[#EFE9DC]">
      {/* Slip Header */}
      <div className="p-4 sm:p-5 bg-[#FAF7F2] relative">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B94A2C] block font-bold">
              Crown &amp; Blade Barbershop · Lekki Phase 1, Lagos
            </span>
            <h3 className="text-xl font-serif font-bold text-[#201D1A] mt-0.5">
              Appointment Docket
            </h3>
          </div>
          <div className="stamp-seal text-[10px]">
            DRAFT SLIP
          </div>
        </div>
        <p className="text-xs text-[#655D52] mt-1 font-sans">
          Live summary updating as you choose services, specialist, and time.
        </p>
      </div>

      {/* Section 1: Selected Services */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#8E8475] uppercase tracking-wider">
          <span>Itemized Services</span>
          <span className={`transition-all duration-300 font-semibold ${pulsePrice ? 'text-[#B94A2C] scale-105' : 'text-[#8E8475]'}`}>
            {selectedServices.length} Selected
          </span>
        </div>

        {selectedServices.length === 0 ? (
          <div className="py-4 text-center border border-dashed border-[#DED5C6] rounded bg-[#FAF7F2] text-xs text-[#8E8475] font-serif italic">
            No services selected yet. Pick an item from the menu on the left.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-2.5 rounded bg-[#FAF7F2] border border-[#E8DFD3] text-xs transition-all duration-200"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-medium text-[#201D1A] font-serif truncate text-sm">
                    {service.name}
                  </div>
                  <div className="text-[11px] text-[#655D52] font-mono">
                    {service.durationMinutes} min · {currency}{service.price}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveService(service.id)}
                  className="p-1 text-[#8E8475] hover:text-[#B94A2C] transition-colors shrink-0 font-mono text-xs cursor-pointer"
                  title="Remove service"
                >
                  [✕]
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Specialist & Schedule */}
      <div className="p-4 sm:p-5 space-y-2.5">
        <div className="text-xs font-mono text-[#8E8475] uppercase tracking-wider">
          Schedule &amp; Specialist
        </div>

        <div className="space-y-2 text-xs">
          {/* Specialist */}
          <div className="p-2.5 rounded bg-[#FAF7F2] border border-[#E8DFD3] transition-colors">
            <span className="block text-[10px] text-[#8E8475] uppercase font-mono">Artisan Specialist</span>
            <span className="font-serif font-semibold text-[#201D1A] text-sm truncate block mt-0.5">
              {selectedStaffId === 'any' || !selectedStaff
                ? 'First Available Specialist'
                : selectedStaff.name}
            </span>
          </div>

          {/* Date */}
          <div className="p-2.5 rounded bg-[#FAF7F2] border border-[#E8DFD3] transition-colors">
            <span className="block text-[10px] text-[#8E8475] uppercase font-mono">Scheduled Date</span>
            <span className="font-serif font-semibold text-[#201D1A] text-sm truncate block mt-0.5">
              {formatFullDate(selectedDate)}
            </span>
          </div>

          {/* Time Window with smooth pulse & transition animation */}
          <div
            className={`p-2.5 rounded border transition-all duration-500 ${
              pulseTime
                ? 'bg-[#FAF0EC] border-[#B94A2C] shadow-xs'
                : 'bg-[#FAF7F2] border-[#E8DFD3]'
            }`}
          >
            <span className="flex items-center justify-between text-[10px] text-[#8E8475] uppercase font-mono">
              <span>Session Window</span>
              {pulseTime && (
                <span className="text-[#B94A2C] font-bold text-[9px] animate-pulse">
                  ● Updated
                </span>
              )}
            </span>
            {selectedTime ? (
              <span
                className={`font-serif font-bold text-sm tabular-nums block mt-0.5 transition-all duration-300 ${
                  pulseTime ? 'text-[#B94A2C] scale-[1.01]' : 'text-[#B94A2C]'
                }`}
              >
                {formatDisplayTime(selectedTime)} – {formatDisplayTime(endTime)} ({totalDuration} mins)
              </span>
            ) : (
              <span className="text-[#8E8475] font-serif italic block mt-0.5">
                Select a time slot on the left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Client Details Form */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="text-xs font-mono text-[#8E8475] uppercase tracking-wider">
          Client Specification
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-[#655D52] mb-1">
              Full Name <span className="text-[#B94A2C]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Babatunde Adeleke"
              value={customerInfo.name}
              onChange={(e) => onUpdateCustomerInfo({ name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-[15px] sm:text-xs bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] placeholder-[#A89E8F] focus:outline-none focus:border-[#B94A2C] transition-colors min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-mono text-[#655D52] mb-1">
                Phone <span className="text-[#B94A2C]">*</span>
              </label>
              <input
                type="tel"
                placeholder="0803 555 0192"
                value={customerInfo.phone}
                onChange={(e) => onUpdateCustomerInfo({ phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-[15px] sm:text-xs bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] placeholder-[#A89E8F] focus:outline-none focus:border-[#B94A2C] transition-colors min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#655D52] mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="client@mail.com"
                value={customerInfo.email}
                onChange={(e) => onUpdateCustomerInfo({ email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-[15px] sm:text-xs bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] placeholder-[#A89E8F] focus:outline-none focus:border-[#B94A2C] transition-colors min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#655D52] mb-1">
              Styling Notes / Preferences
            </label>
            <input
              type="text"
              placeholder="e.g. Low taper fade, beard steam with tea tree"
              value={customerInfo.notes || ''}
              onChange={(e) => onUpdateCustomerInfo({ notes: e.target.value })}
              className="w-full px-3.5 py-2.5 text-[15px] sm:text-xs bg-[#FAF7F2] border border-[#DED5C6] rounded-lg text-[#201D1A] placeholder-[#A89E8F] focus:outline-none focus:border-[#B94A2C] transition-colors min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Total & Confirmation Button */}
      <div className="p-4 sm:p-5 bg-[#FAF7F2] space-y-4">
        <div className="space-y-1.5 text-xs text-[#655D52]">
          <div className="flex justify-between font-mono">
            <span>Total Duration</span>
            <span className="tabular-nums text-[#201D1A]">{totalDuration} minutes</span>
          </div>
          <div className="flex justify-between font-mono">
            <span>Subtotal</span>
            <span className="tabular-nums text-[#201D1A]">{currency}{totalPrice}.00</span>
          </div>
          <div className="flex justify-between font-serif text-base font-bold pt-2 border-t border-[#DED5C6] text-[#201D1A]">
            <span>Total Due Upon Completion</span>
            <span
              className={`tabular-nums text-lg transition-all duration-300 ${
                pulsePrice ? 'text-[#B94A2C] scale-105 font-black' : 'text-[#B94A2C]'
              }`}
            >
              {currency}{totalPrice}.00
            </span>
          </div>
        </div>

        <div className="text-[11px] text-[#8E8475] font-mono border-l-2 border-[#B94A2C] pl-2 leading-tight">
          Pay upon completion in lounge. No upfront credit card deposit needed.
        </div>

        {missingText && (
          <p className="text-[11px] text-[#B94A2C] text-center font-mono font-medium">
            {missingText}
          </p>
        )}

        <button
          type="button"
          onClick={onConfirmBooking}
          disabled={!isReadyToBook || isSubmitting}
          className={`w-full py-3.5 px-4 rounded-xl text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[48px] ${
            isReadyToBook && !isSubmitting
              ? 'bg-[#B94A2C] hover:bg-[#9A381F] text-[#FFFDF9] shadow-md hover:shadow-lg active:scale-[0.99]'
              : 'bg-[#EFE9DC] text-[#A89E8F] cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span>Securing Appointment...</span>
          ) : (
            <span>Confirm Appointment</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Floating Bottom Bar / Peeking Drawer Notch */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF9] border-t-2 border-[#DED5C6] shadow-[0_-4px_20px_rgba(32,29,26,0.08)]">
        {/* Pull Indicator Notch */}
        <div
          onClick={() => setMobileExpanded(true)}
          className="w-full flex justify-center pt-2 pb-0.5 cursor-pointer"
        >
          <div className="w-10 h-1 rounded-full bg-[#D5CAB8]"></div>
        </div>

        <div className="px-4 pb-3 pt-1 flex items-center justify-between gap-3">
          <div
            className="min-w-0 cursor-pointer flex-1"
            onClick={() => setMobileExpanded(true)}
          >
            <div className="text-[11px] text-[#8E8475] font-mono flex items-center gap-1.5">
              <span>{selectedServices.length} {selectedServices.length === 1 ? 'service' : 'services'}</span>
              {totalDuration > 0 && <span>· {totalDuration}m</span>}
            </div>
            <div className="text-base font-serif font-bold text-[#201D1A] tabular-nums">
              {currency}{totalPrice}
              {selectedTime ? (
                <span className="text-xs font-mono font-normal text-[#B94A2C] ml-2">
                  @{formatDisplayTime(selectedTime)}
                </span>
              ) : (
                <span className="text-[11px] font-sans text-[#8E8475] font-normal ml-2 italic">
                  (select time slot)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileExpanded(true)}
              className="px-3.5 py-2.5 rounded-lg bg-[#EFE9DC] text-xs font-mono font-medium text-[#4A443C] cursor-pointer min-h-[44px] flex items-center justify-center active:bg-[#DED5C6]"
            >
              Review Docket ↑
            </button>

            {isReadyToBook ? (
              <button
                onClick={onConfirmBooking}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-lg bg-[#B94A2C] hover:bg-[#9A381F] text-[#FFFDF9] font-medium text-xs font-mono transition-colors shadow-xs min-h-[44px] flex items-center justify-center active:scale-95"
              >
                Confirm
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Sliding Bottom Sheet Modal */}
      {mobileExpanded && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#201D1A]/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileExpanded(false)}
          />

          {/* Slide-Up Bottom Sheet Card */}
          <div
            className="relative z-10 w-full max-h-[88vh] bg-[#F6F2EA] rounded-t-2xl border-t-2 border-[#D8CEBE] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
          >
            {/* Sheet Handle and Close Bar */}
            <div className="px-4 pt-3 pb-2 border-b border-[#DED5C6] flex items-center justify-between bg-[#FAF7F2] shrink-0">
              <div className="flex-1 flex justify-center pl-10">
                <div className="w-12 h-1.5 rounded-full bg-[#C8BCAC]"></div>
              </div>
              <button
                onClick={() => setMobileExpanded(false)}
                className="px-2.5 py-1 rounded bg-[#EFE9DC] hover:bg-[#DED5C6] text-xs font-mono text-[#655D52] cursor-pointer"
              >
                [Close ✕]
              </button>
            </div>

            {/* Scrollable Sheet Content */}
            <div className="p-4 overflow-y-auto">
              {renderTicketContent(true)}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sticky Docket Panel */}
      <aside className="hidden lg:block lg:sticky lg:top-20 lg:w-[380px] xl:w-[410px] shrink-0">
        {renderTicketContent(false)}
      </aside>
    </>
  );
};
