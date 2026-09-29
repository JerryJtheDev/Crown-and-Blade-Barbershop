import React from 'react';
import { StaffMember } from '../../types/booking';

interface StaffSelectorProps {
  staffList: StaffMember[];
  selectedStaffId: string;
  onSelectStaff: (staffId: string) => void;
}

export const StaffSelector: React.FC<StaffSelectorProps> = ({
  staffList,
  selectedStaffId,
  onSelectStaff,
}) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="border-b-2 border-[#DED5C6] pb-3">
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#B94A2C] block font-semibold">
          Second Step · The Barber
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#201D1A] tracking-tight mt-0.5">
          Select Your Specialist
        </h2>
        <p className="text-xs sm:text-sm text-[#655D52] mt-1 font-sans">
          Request your regular barber, or select open chair for the widest choice of times.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Option 1: Any Available Specialist */}
        <div
          onClick={() => onSelectStaff('any')}
          className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
            selectedStaffId === 'any'
              ? 'bg-[#FFFDF9] border-[#B94A2C] ring-2 ring-[#B94A2C]/20 shadow-sm'
              : 'bg-[#FFFDF9] border-[#DED5C6] hover:border-[#B5A793] shadow-2xs'
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-[#FAF0EC] border border-[#E9C8BF] flex items-center justify-center font-serif text-lg text-[#B94A2C] font-semibold">
              ANY
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base text-[#201D1A] font-semibold">
                  First Available Chair
                </h4>
                {selectedStaffId === 'any' && (
                  <span className="text-[10px] font-mono font-bold text-[#B94A2C] uppercase">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#655D52] mt-0.5">
                Maximum scheduling openings
              </p>
            </div>
          </div>
          <div className="text-[11px] text-[#8E8475] mt-4 pt-2.5 border-t border-[#EFE9DC] font-sans">
            Automatically paired with the best open specialist at your time.
          </div>
        </div>

        {/* Individual Staff Cards */}
        {staffList.map((member) => {
          const isSelected = selectedStaffId === member.id;

          return (
            <div
              key={member.id}
              onClick={() => onSelectStaff(member.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FFFDF9] border-[#B94A2C] ring-2 ring-[#B94A2C]/20 shadow-sm'
                  : 'bg-[#FFFDF9] border-[#DED5C6] hover:border-[#B5A793] shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#D5CAB8] bg-[#EFE9DC] shrink-0">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top filter contrast-[1.05]"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-serif text-base text-[#201D1A] font-semibold truncate">
                        {member.name}
                      </h4>
                      {isSelected && (
                        <span className="text-[10px] font-mono font-bold text-[#B94A2C] uppercase shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8E8475] truncate">{member.role}</p>
                    <div className="text-[11px] text-[#B94A2C] font-mono tabular-nums mt-0.5">
                      Rating {member.rating.toFixed(2)} · {member.reviewCount} cuts
                    </div>
                  </div>
                </div>

                {/* Specialties as editorial text */}
                <div className="text-[11px] text-[#655D52] line-clamp-1 font-mono">
                  {member.specialties.join(' · ')}
                </div>
              </div>

              <div className="text-[11px] text-[#8E8475] mt-4 pt-2.5 border-t border-[#EFE9DC] flex justify-between font-mono">
                <span>Shift</span>
                <span className="tabular-nums text-[#4A443C]">
                  {member.workingHours.start} – {member.workingHours.end}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
