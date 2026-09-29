import React from 'react';
import { Booking, BusinessProfile, CustomerInfo, Service, StaffMember } from '../../types/booking';
import { ASSETS, formatDateKey } from '../../utils/storage';
import { addMinutesToTime, isStaffAvailable, timeToMinutes } from '../../utils/calendar';
import { ServiceSelector } from './ServiceSelector';
import { StaffSelector } from './StaffSelector';
import { ScheduleSelector } from './ScheduleSelector';
import { BookingTicketPanel } from './BookingTicketPanel';
import { BookingConfirmationModal } from './BookingConfirmationModal';

interface CustomerBookingFlowProps {
  services: Service[];
  allStaff: StaffMember[];
  bookings: Booking[];
  businessProfile: BusinessProfile;
  onAddBooking: (newBooking: Booking) => void;
  onViewInAgenda: (dateStr: string) => void;
}

export const CustomerBookingFlow: React.FC<CustomerBookingFlowProps> = ({
  services,
  allStaff,
  bookings,
  businessProfile,
  onAddBooking,
  onViewInAgenda,
}) => {
  const todayKey = React.useMemo(() => formatDateKey(new Date()), []);

  const [selectedServiceIds, setSelectedServiceIds] = React.useState<string[]>([
    services[0]?.id || 'srv-1',
  ]);
  const [selectedStaffId, setSelectedStaffId] = React.useState<string>('any');
  const [selectedDate, setSelectedDate] = React.useState<string>(todayKey);
  const [selectedTime, setSelectedTime] = React.useState<string>('14:30');
  const [customerInfo, setCustomerInfo] = React.useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmedBooking, setConfirmedBooking] = React.useState<Booking | null>(null);

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  const selectedStaff = allStaff.find((s) => s.id === selectedStaffId);

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleUpdateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...info }));
  };

  const handleConfirmBooking = () => {
    if (selectedServices.length === 0 || !selectedTime || !customerInfo.name || !customerInfo.phone) {
      return;
    }

    setIsSubmitting(true);

    let assignedStaffId = selectedStaffId;
    if (assignedStaffId === 'any') {
      const startM = timeToMinutes(selectedTime);
      const endM = startM + totalDuration;
      const freeStaff = allStaff.find((staff) =>
        isStaffAvailable(staff, selectedDate, startM, endM, bookings)
      );
      assignedStaffId = freeStaff ? freeStaff.id : allStaff[0].id;
    }

    const endTime = addMinutesToTime(selectedTime, totalDuration);
    const randomCodeSuffix = Math.floor(1000 + Math.random() * 9000);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode: `CB-${randomCodeSuffix}`,
      serviceIds: selectedServiceIds,
      staffId: selectedStaffId,
      assignedStaffId,
      date: selectedDate,
      startTime: selectedTime,
      endTime,
      totalDurationMinutes: totalDuration,
      totalPrice,
      customer: { ...customerInfo },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onAddBooking(newBooking);
      setConfirmedBooking(newBooking);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F6F2EA] pb-24 lg:pb-16 text-[#201D1A]">
      {/* Editorial Warm Atmosphere Header */}
      <section className="relative border-b-2 border-[#DED5C6] bg-[#ECE5D8] overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply">
          <img
            src={ASSETS.heroInterior}
            alt="Crown & Blade Barbershop Atelier"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter sepia-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ECE5D8] via-[#ECE5D8]/90 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B94A2C] font-semibold block">
              14 Admiralty Way · Lekki Phase 1, Lagos
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#201D1A] tracking-tight leading-tight">
              Precision Cuts, Beard Sculpting &amp; Nigerian Grooming Rituals
            </h1>
            <p className="text-xs sm:text-sm text-[#655D52] leading-relaxed font-sans max-w-xl">
              Select your treatments below to begin. Operating Tuesday through Sunday (closed Mondays for blade honing &amp; sanitation).
              Your scheduled session and live appointment docket build progressively as you choose your services.
            </p>
          </div>
        </div>
      </section>

      {/* Main Continuous Flow Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 lg:pb-12">
        <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-12">
          {/* Left Flow Column: Services -> Staff -> Schedule */}
          <div className="flex-1 w-full space-y-10 min-w-0">
            <section aria-label="Curated Services Menu">
              <ServiceSelector
                services={services}
                selectedServiceIds={selectedServiceIds}
                onToggleService={handleToggleService}
                currency={businessProfile.currency}
              />
            </section>

            <section aria-label="Select Specialist">
              <StaffSelector
                staffList={allStaff}
                selectedStaffId={selectedStaffId}
                onSelectStaff={setSelectedStaffId}
              />
            </section>

            <section aria-label="Appointment Schedule">
              <ScheduleSelector
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                totalDurationMinutes={totalDuration}
                selectedStaffId={selectedStaffId}
                allStaff={allStaff}
                bookings={bookings}
                openHour={businessProfile.openHour}
                closeHour={businessProfile.closeHour}
                slotIntervalMinutes={businessProfile.slotIntervalMinutes}
              />
            </section>
          </div>

          {/* Right Column: Persistent Physical Appointment Ledger Slip */}
          <BookingTicketPanel
            selectedServices={selectedServices}
            onRemoveService={handleToggleService}
            selectedStaff={selectedStaff}
            selectedStaffId={selectedStaffId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            customerInfo={customerInfo}
            onUpdateCustomerInfo={handleUpdateCustomerInfo}
            currency={businessProfile.currency}
            onConfirmBooking={handleConfirmBooking}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>

      {/* Confirmation Slip Modal */}
      <BookingConfirmationModal
        booking={confirmedBooking}
        services={services}
        allStaff={allStaff}
        businessProfile={businessProfile}
        onClose={() => setConfirmedBooking(null)}
        onViewInAgenda={(dateStr) => {
          setConfirmedBooking(null);
          onViewInAgenda(dateStr);
        }}
      />
    </div>
  );
};
