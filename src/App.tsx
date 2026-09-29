/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Booking,
  BookingStatus,
  BusinessProfile,
  Service,
  StaffMember,
} from './types/booking';
import {
  clearAllBookings,
  getStoredBookings,
  getStoredBusinessProfile,
  getStoredServices,
  getStoredStaff,
  resetAllDataToDefault,
  saveStoredBookings,
  saveStoredServices,
} from './utils/storage';
import { TopNav } from './components/TopNav';
import { CustomerBookingFlow } from './components/customer/CustomerBookingFlow';
import { AdminTimelineView } from './components/admin/AdminTimelineView';

export default function App() {
  const [currentView, setCurrentView] = React.useState<'customer' | 'admin'>('customer');

  // Loaded state
  const [businessProfile, setBusinessProfile] = React.useState<BusinessProfile>(() =>
    getStoredBusinessProfile()
  );
  const [services, setServices] = React.useState<Service[]>(() => getStoredServices());
  const [staff, setStaff] = React.useState<StaffMember[]>(() => getStoredStaff());
  const [bookings, setBookings] = React.useState<Booking[]>(() => getStoredBookings());

  // Focus date when navigating to admin agenda
  const [targetAgendaDate, setTargetAgendaDate] = React.useState<string | undefined>(undefined);

  // Add new booking
  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      saveStoredBookings(updated);
      return updated;
    });
  };

  // Update booking status
  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === bookingId ? { ...b, status } : b));
      saveStoredBookings(updated);
      return updated;
    });
  };

  // Delete booking
  const handleDeleteBooking = (bookingId: string) => {
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== bookingId);
      saveStoredBookings(updated);
      return updated;
    });
  };

  // Save services
  const handleSaveServices = (updatedServices: Service[]) => {
    setServices(updatedServices);
    saveStoredServices(updatedServices);
  };

  // Clear all bookings for fresh business usage
  const handleClearAllBookings = () => {
    if (confirm('Clear all bookings? This will wipe all appointments from your schedule so you can start using it as an active booking tool.')) {
      clearAllBookings();
      setBookings([]);
    }
  };

  // Reset to default seed
  const handleResetData = () => {
    if (confirm('Reset all demo bookings, services, and staff to the initial Lagos barbershop demo state?')) {
      resetAllDataToDefault();
      setBusinessProfile(getStoredBusinessProfile());
      setServices(getStoredServices());
      setStaff(getStoredStaff());
      setBookings(getStoredBookings());
    }
  };

  // Jump from customer confirmation to admin agenda
  const handleViewInAgenda = (dateStr: string) => {
    setTargetAgendaDate(dateStr);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#201D1A] flex flex-col font-sans selection:bg-[#B94A2C]/20 selection:text-[#8D341B]">
      {/* Universal Top Bar */}
      <TopNav
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        businessProfile={businessProfile}
        onResetData={handleResetData}
      />

      {/* View Switcher Container */}
      <div className="flex-1">
        {currentView === 'customer' ? (
          <CustomerBookingFlow
            services={services}
            allStaff={staff}
            bookings={bookings}
            businessProfile={businessProfile}
            onAddBooking={handleAddBooking}
            onViewInAgenda={handleViewInAgenda}
          />
        ) : (
          <AdminTimelineView
            bookings={bookings}
            services={services}
            allStaff={staff}
            businessProfile={businessProfile}
            initialDate={targetAgendaDate}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
            onAddBooking={handleAddBooking}
            onSaveServices={handleSaveServices}
            onClearAllBookings={handleClearAllBookings}
            onResetData={handleResetData}
          />
        )}
      </div>

      {/* Subtle Editorial Warm Paper Footer */}
      <footer className="border-t-2 border-[#DED5C6] bg-[#ECE5D8] text-[#655D52] text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#201D1A] text-sm tracking-tight">
              {businessProfile.name}
            </span>
            <span aria-hidden="true" className="text-[#A89E8F]">·</span>
            <span>{businessProfile.address}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Direct Concierge: {businessProfile.phone}</span>
            <span aria-hidden="true" className="text-[#A89E8F]">·</span>
            <span className="text-[#B94A2C] font-semibold">Bespoke Appointment System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
