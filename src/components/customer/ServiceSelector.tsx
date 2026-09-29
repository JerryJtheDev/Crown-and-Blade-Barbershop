import React from 'react';
import { Service } from '../../types/booking';

interface ServiceSelectorProps {
  services: Service[];
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
  currency: string;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServiceIds,
  onToggleService,
  currency,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string>('All');

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices =
    activeCategory === 'All'
      ? services.filter((s) => s.isActive)
      : services.filter((s) => s.isActive && s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b-2 border-[#DED5C6] pb-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#B94A2C] block font-semibold">
            First Step · The Menu
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#201D1A] tracking-tight mt-0.5">
            Select Your Services
          </h2>
          <p className="text-xs sm:text-sm text-[#655D52] mt-1 font-sans">
            Every session begins with a hot cedarwood towel and tailored styling consultation.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer rounded-lg border min-h-[44px] flex items-center justify-center ${
                activeCategory === cat
                  ? 'bg-[#201D1A] text-[#FFFDF9] border-[#201D1A] shadow-xs'
                  : 'bg-[#FFFDF9] text-[#655D52] border-[#DED5C6] hover:border-[#B5A793] hover:text-[#201D1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services List - Tactile Ticket-Stub Style Cards */}
      <div className="space-y-3">
        {filteredServices.map((service, index) => {
          const isSelected = selectedServiceIds.includes(service.id);
          const formattedIndex = String(index + 1).padStart(2, '0');

          return (
            <div
              key={service.id}
              onClick={() => onToggleService(service.id)}
              className={`relative transition-all cursor-pointer rounded-xl border group overflow-hidden ${
                isSelected
                  ? 'bg-[#FFFDF9] border-[#B94A2C] ring-2 ring-[#B94A2C]/20 shadow-md'
                  : 'bg-[#FFFDF9] border-[#DED5C6] hover:border-[#B5A793] shadow-xs'
              }`}
            >
              {/* Asymmetric ticket-edge accent */}
              <div
                className={`absolute top-0 bottom-0 left-0 w-1.5 transition-colors ${
                  isSelected ? 'bg-[#B94A2C]' : 'bg-transparent group-hover:bg-[#D5CAB8]'
                }`}
              />

              <div className="p-4 sm:p-5 pl-4.5 sm:pl-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Index & Service Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono">
                    <span className="text-[#B94A2C] font-semibold">{formattedIndex}.</span>
                    <span className="text-[#8E8475] uppercase tracking-wider text-[11px]">
                      {service.category}
                    </span>
                    <span className="text-[#D5CAB8] hidden xs:inline">/</span>
                    <span className="text-[#655D52] font-medium tabular-nums">
                      {service.durationMinutes} min session
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif text-[#201D1A] group-hover:text-[#B94A2C] transition-colors leading-snug">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#655D52] leading-relaxed max-w-2xl font-sans">
                    {service.description}
                  </p>
                </div>

                {/* Price Tag & Tactile Toggle */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EFE9DC]">
                  <div className="text-left sm:text-right">
                    <span className="text-xl sm:text-2xl font-serif font-medium text-[#201D1A] tabular-nums block">
                      {currency}{service.price}
                    </span>
                    <span className="text-[10px] font-mono text-[#8E8475] uppercase block -mt-0.5">
                      Fixed Rate
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleService(service.id);
                    }}
                    className={`px-4 py-2.5 text-xs font-mono font-medium transition-all rounded-lg cursor-pointer uppercase tracking-wider min-h-[44px] flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#B94A2C] text-[#FFFDF9] shadow-xs'
                        : 'bg-[#F6F2EA] text-[#4A443C] border border-[#DED5C6] hover:bg-[#EFE9DC]'
                    }`}
                  >
                    {isSelected ? '✓ Added' : '+ Add Service'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
