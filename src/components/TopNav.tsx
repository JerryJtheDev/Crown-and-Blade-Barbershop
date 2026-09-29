import React from 'react';
import {
  Calendar,
  RefreshCw,
  Menu,
  X,
  Clock,
  MapPin,
  Phone,
  Scissors,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { BusinessProfile } from '../types/booking';

interface TopNavProps {
  currentView: 'customer' | 'admin';
  onViewChange: (view: 'customer' | 'admin') => void;
  businessProfile: BusinessProfile;
  onResetData: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onViewChange,
  businessProfile,
  onResetData,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile menu on resize to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scrolling when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSelectView = (view: 'customer' | 'admin') => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  const handleTriggerReset = () => {
    setMobileMenuOpen(false);
    onResetData();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F6F2EA]/95 backdrop-blur-md border-b border-[#DED5C6] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Wordmark in characterful serif (Never wraps or compresses) */}
          <div className="flex items-center min-w-0">
            <button
              onClick={() => handleSelectView('customer')}
              className="text-left group cursor-pointer focus:outline-none flex items-center gap-1.5"
              aria-label="Crown and Blade Home"
            >
              <span className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#201D1A] group-hover:text-[#B94A2C] transition-colors whitespace-nowrap tracking-tight">
                Crown <span className="italic font-normal text-[#B94A2C]">&amp;</span> Blade
              </span>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links (Hidden on mobile/tablet < md) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            <button
              onClick={() => handleSelectView('customer')}
              className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
                currentView === 'customer'
                  ? 'text-[#201D1A] font-semibold border-b-2 border-[#B94A2C]'
                  : 'text-[#655D52] hover:text-[#201D1A]'
              }`}
            >
              Appointment Booking
            </button>
            <button
              onClick={() => handleSelectView('admin')}
              className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
                currentView === 'admin'
                  ? 'text-[#201D1A] font-semibold border-b-2 border-[#B94A2C]'
                  : 'text-[#655D52] hover:text-[#201D1A]'
              }`}
            >
              Master Agenda Book
            </button>
            <span className="hidden xl:inline-block text-xs text-[#8E8475] font-mono tabular-nums whitespace-nowrap">
              Tue–Sun 9:00 AM – 8:00 PM · Closed Mon
            </span>
          </nav>

          {/* Zone 3: Desktop Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {/* Desktop Reset Demo button (Hidden on tablet/mobile to prevent crowding) */}
            <button
              onClick={onResetData}
              title="Reset sample bookings and catalog"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#655D52] hover:text-[#201D1A] bg-[#FFFDF9] hover:bg-[#EFE9DC] border border-[#DED5C6] rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <RefreshCw className="w-3 h-3 text-[#B94A2C]" />
              <span>Reset Demo</span>
            </button>

            {/* Desktop & Tablet View Switcher (md:flex) */}
            <div className="hidden md:flex items-center bg-[#EFE9DC] p-1 rounded-lg border border-[#DED5C6]">
              <button
                onClick={() => onViewChange('customer')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  currentView === 'customer'
                    ? 'bg-[#FFFDF9] text-[#201D1A] shadow-xs font-semibold'
                    : 'text-[#655D52] hover:text-[#201D1A]'
                }`}
              >
                Book Service
              </button>
              <button
                onClick={() => onViewChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  currentView === 'admin'
                    ? 'bg-[#FFFDF9] text-[#B94A2C] shadow-xs font-semibold'
                    : 'text-[#655D52] hover:text-[#201D1A]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agenda</span>
              </button>
            </div>

            {/* Mobile Hamburger Button (Strict 44x44px touch target, clearly visible) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg bg-[#FFFDF9] hover:bg-[#EFE9DC] active:bg-[#DED5C6] border border-[#DED5C6] text-[#201D1A] transition-colors cursor-pointer shadow-2xs"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5 text-[#201D1A]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay Panel (z-[100] guaranteed above all elements) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#201D1A]/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-In Drawer Canvas */}
          <div
            className="relative z-10 w-full max-w-[320px] xs:max-w-[350px] sm:max-w-[380px] h-full bg-[#F6F2EA] border-l-2 border-[#D8CEBE] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-label="Mobile Navigation"
          >
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b border-[#DED5C6] bg-[#FAF7F2] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B94A2C] block font-bold">
                    Barbershop Concierge
                  </span>
                  <div className="text-xl font-serif font-bold text-[#201D1A] mt-0.5">
                    Crown <span className="italic font-normal text-[#B94A2C]">&amp;</span> Blade
                  </div>
                </div>

                {/* Close Button with 44x44px minimum tap target */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#EFE9DC] hover:bg-[#DED5C6] text-[#201D1A] transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Navigation Items */}
              <div className="p-4 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8475] block font-semibold px-1">
                  Navigation
                </span>

                <button
                  type="button"
                  onClick={() => handleSelectView('customer')}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between min-h-[56px] ${
                    currentView === 'customer'
                      ? 'bg-[#FFFDF9] border-[#B94A2C] shadow-sm ring-1 ring-[#B94A2C]/30'
                      : 'bg-[#FFFDF9] border-[#DED5C6] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        currentView === 'customer'
                          ? 'bg-[#B94A2C] text-[#FFFDF9]'
                          : 'bg-[#EFE9DC] text-[#655D52]'
                      }`}
                    >
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#201D1A]">
                        Book Appointment
                      </div>
                      <div className="text-[11px] text-[#655D52] font-sans">
                        Browse services &amp; secure your chair
                      </div>
                    </div>
                  </div>
                  {currentView === 'customer' ? (
                    <span className="text-[10px] font-mono text-[#B94A2C] font-bold uppercase">
                      Active
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#8E8475]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectView('admin')}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between min-h-[56px] ${
                    currentView === 'admin'
                      ? 'bg-[#FFFDF9] border-[#B94A2C] shadow-sm ring-1 ring-[#B94A2C]/30'
                      : 'bg-[#FFFDF9] border-[#DED5C6] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        currentView === 'admin'
                          ? 'bg-[#B94A2C] text-[#FFFDF9]'
                          : 'bg-[#EFE9DC] text-[#655D52]'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#201D1A]">
                        Master Agenda Book
                      </div>
                      <div className="text-[11px] text-[#655D52] font-sans">
                        Daily timeline, run sheet &amp; rates
                      </div>
                    </div>
                  </div>
                  {currentView === 'admin' ? (
                    <span className="text-[10px] font-mono text-[#B94A2C] font-bold uppercase">
                      Active
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#8E8475]" />
                  )}
                </button>
              </div>

              {/* Shop Details Card */}
              <div className="p-4 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E8475] block font-semibold px-1">
                  Atelier Hours &amp; Location
                </span>

                <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#DED5C6] text-xs font-sans space-y-2.5">
                  <div className="flex items-start gap-2 text-[#201D1A]">
                    <MapPin className="w-4 h-4 text-[#B94A2C] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-serif font-bold text-xs">{businessProfile.name}</div>
                      <div className="text-[11px] text-[#655D52] mt-0.5">{businessProfile.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-[#655D52] pt-2 border-t border-[#EFE9DC]">
                    <Clock className="w-4 h-4 text-[#B94A2C] shrink-0 mt-0.5" />
                    <div className="text-[11px]">
                      <div>Tue – Sun: 9:00 AM – 8:00 PM</div>
                      <div className="text-[#B94A2C] font-semibold mt-0.5">Closed Mondays (Sanitation Day)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#655D52] pt-2 border-t border-[#EFE9DC]">
                    <Phone className="w-4 h-4 text-[#B94A2C] shrink-0" />
                    <a
                      href={`tel:${businessProfile.phone}`}
                      className="text-[11px] font-mono hover:text-[#B94A2C] transition-colors"
                    >
                      {businessProfile.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#DED5C6] space-y-2">
              <button
                type="button"
                onClick={handleTriggerReset}
                className="w-full py-3 px-4 rounded-xl bg-[#FFFDF9] hover:bg-[#EFE9DC] text-[#4A443C] border border-[#DED5C6] text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[46px] shadow-2xs active:scale-98"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#B94A2C]" />
                <span>Reset Demo Schedule</span>
              </button>

              <div className="text-[10px] text-center text-[#8E8475] font-mono pt-1">
                Crown &amp; Blade · Lagos Artisan Grooming
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
