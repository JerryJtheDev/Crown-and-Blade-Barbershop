import React from 'react';
import { Service } from '../../types/booking';

interface ServiceManagerModalProps {
  services: Service[];
  currency: string;
  onClose: () => void;
  onSaveServices: (updatedServices: Service[]) => void;
}

export const PRESETS: Record<string, { label: string; services: Omit<Service, 'id'>[] }> = {
  barbershop: {
    label: 'Crown & Blade Barbershop (Lekki)',
    services: [
      {
        name: 'Executive Low Cut & Line-Up',
        category: 'Hair & Styling',
        durationMinutes: 35,
        price: 3500,
        description: 'Precision clipper and shear low cut with razor-sharp hairline shape up, neck taper, and menthol spirit tonic finish.',
        isActive: true,
      },
      {
        name: 'Skin Fade & Beard Sculpt Ritual',
        category: 'Fade & Beard',
        durationMinutes: 50,
        price: 6000,
        description: 'Drop or taper skin fade with geometric beard shaping, eucalyptus hot towel steam prep, razor etching, and nourishing shea-cedarwood butter.',
        isActive: true,
      },
      {
        name: 'Signature Beard Sculpt & Conditioning',
        category: 'Beard Care',
        durationMinutes: 30,
        price: 3000,
        description: 'Detailed beard architectural shaping, cheek line razor etching, warm steam infusion, and deep cedarwood oil conditioning massage.',
        isActive: true,
      },
      {
        name: 'Traditional Hot Towel Straight-Razor Shave',
        category: 'Shave & Facial',
        durationMinutes: 35,
        price: 4000,
        description: 'Double warm botanical eucalyptus towel wrap, rich lather massage, single-blade clean shave, and soothing alum block with bay rum tonic.',
        isActive: true,
      },
      {
        name: 'The Crown Royal Special (Cut, Shave, Dye & Wash)',
        category: 'Complete Rituals',
        durationMinutes: 80,
        price: 12000,
        description: 'The complete Lagos weekend grooming ritual: Signature cut, beard sculpt, hot towel wet shave, black dye tint, relaxing scalp wash, and cold marble finish.',
        isActive: true,
      },
    ],
  },
  wellnessSpa: {
    label: 'Wellness Spa & Massage',
    services: [
      {
        name: 'Deep Tissue Botanical Massage',
        category: 'Massage Therapy',
        durationMinutes: 60,
        price: 110,
        description: 'Targeted muscle relief with heated basalt stones and organic arnica essential oil infusions.',
        isActive: true,
      },
      {
        name: 'Restorative Cellular Facial',
        category: 'Esthetics',
        durationMinutes: 50,
        price: 95,
        description: 'Gentle ultrasonic exfoliation, marine collagen mask, and cooling lymphatic drainage quartz roller.',
        isActive: true,
      },
      {
        name: 'Head & Neck Tension Release',
        category: 'Express Care',
        durationMinutes: 30,
        price: 55,
        description: 'Focused acupressure release for occipital and cervical muscle fatigue with peppermint balm.',
        isActive: true,
      },
    ],
  },
  consultingStudio: {
    label: 'Consulting & Creative Studio',
    services: [
      {
        name: 'Strategic Advisory Session',
        category: 'Consultations',
        durationMinutes: 60,
        price: 180,
        description: 'One-on-one executive roadmap deep dive, product audit, and targeted actionable next steps.',
        isActive: true,
      },
      {
        name: 'Creative Portfolio Review',
        category: 'Creative Direction',
        durationMinutes: 45,
        price: 120,
        description: 'Comprehensive review of brand identity, presentation pitch deck, and typography alignment.',
        isActive: true,
      },
      {
        name: 'Discovery Chemistry Call',
        category: 'Introductory',
        durationMinutes: 20,
        price: 35,
        description: 'Initial intake and project scope assessment for high-impact prospective collaborations.',
        isActive: true,
      },
    ],
  },
};

export const ServiceManagerModal: React.FC<ServiceManagerModalProps> = ({
  services,
  currency,
  onClose,
  onSaveServices,
}) => {
  const [items, setItems] = React.useState<Service[]>(services);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [formName, setFormName] = React.useState('');
  const [formCategory, setFormCategory] = React.useState('Hair & Styling');
  const [formDuration, setFormDuration] = React.useState(45);
  const [formPrice, setFormPrice] = React.useState(60);
  const [formDescription, setFormDescription] = React.useState('');
  const [isAddingNew, setIsAddingNew] = React.useState(false);

  const startEdit = (srv: Service) => {
    setEditingId(srv.id);
    setIsAddingNew(false);
    setFormName(srv.name);
    setFormCategory(srv.category);
    setFormDuration(srv.durationMinutes);
    setFormPrice(srv.price);
    setFormDescription(srv.description);
  };

  const startAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormName('');
    setFormCategory('Hair & Styling');
    setFormDuration(45);
    setFormPrice(60);
    setFormDescription('');
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (isAddingNew) {
      const newSrv: Service = {
        id: `srv-${Date.now()}`,
        name: formName.trim(),
        category: formCategory.trim() || 'General',
        durationMinutes: Number(formDuration),
        price: Number(formPrice),
        description: formDescription.trim(),
        isActive: true,
      };
      const updated = [...items, newSrv];
      setItems(updated);
      onSaveServices(updated);
    } else if (editingId) {
      const updated = items.map((s) =>
        s.id === editingId
          ? {
              ...s,
              name: formName.trim(),
              category: formCategory.trim() || 'General',
              durationMinutes: Number(formDuration),
              price: Number(formPrice),
              description: formDescription.trim(),
            }
          : s
      );
      setItems(updated);
      onSaveServices(updated);
    }

    cancelForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this service permanently?')) {
      const updated = items.filter((s) => s.id !== id);
      setItems(updated);
      onSaveServices(updated);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = items.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setItems(updated);
    onSaveServices(updated);
  };

  const handleLoadPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    if (confirm(`Switch catalog to "${preset.label}" preset?`)) {
      const newServices: Service[] = preset.services.map((p, idx) => ({
        ...p,
        id: `srv-preset-${presetKey}-${idx}-${Date.now()}`,
      }));
      setItems(newServices);
      onSaveServices(newServices);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201D1A]/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFFDF9] border-2 border-[#D8CEBE] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden divide-y divide-[#EFE9DC] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 flex items-center justify-between bg-[#FAF7F2] shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B94A2C] block font-bold">
              Catalog Master
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#201D1A]">
              Services, Durations &amp; Rates
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {!isAddingNew && !editingId && (
              <button
                onClick={startAddNew}
                className="px-3 py-1.5 rounded bg-[#B94A2C] hover:bg-[#9A381F] text-[#FFFDF9] font-mono font-medium text-xs transition-colors cursor-pointer"
              >
                + New Service
              </button>
            )}
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs font-mono text-[#8E8475] hover:text-[#201D1A] rounded bg-[#EFE9DC] transition-colors cursor-pointer"
            >
              [Close ✕]
            </button>
          </div>
        </div>

        {/* Preset Switcher Banner */}
        <div className="px-5 py-2.5 bg-[#FAF7F2] border-b border-[#DED5C6] flex flex-wrap items-center justify-between gap-2 shrink-0 font-mono">
          <span className="text-[11px] text-[#655D52]">
            Adapt To Another Business:
          </span>
          <div className="flex items-center gap-1.5">
            {Object.entries(PRESETS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleLoadPreset(key)}
                className="text-[10px] px-2.5 py-1 rounded bg-[#FFFDF9] hover:bg-[#EFE9DC] text-[#201D1A] border border-[#DED5C6] transition-colors cursor-pointer shadow-2xs"
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content list or form */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Add / Edit Form */}
          {(isAddingNew || editingId) && (
            <form
              onSubmit={handleSaveForm}
              className="p-4 rounded-lg bg-[#FAF7F2] border-2 border-[#D8CEBE] space-y-3 font-sans"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#DED5C6]">
                <h4 className="font-serif font-bold text-sm text-[#201D1A]">
                  {isAddingNew ? 'Create New Service' : 'Edit Service Entry'}
                </h4>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="text-xs font-mono text-[#8E8475] hover:text-[#201D1A]"
                >
                  [Cancel]
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-[11px] text-[#655D52] mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Scissor Cut"
                    className="w-full px-3 py-1.5 bg-[#FFFDF9] border border-[#DED5C6] rounded text-[#201D1A] focus:outline-none focus:border-[#B94A2C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#655D52] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Hair & Styling"
                    className="w-full px-3 py-1.5 bg-[#FFFDF9] border border-[#DED5C6] rounded text-[#201D1A] focus:outline-none focus:border-[#B94A2C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#655D52] mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-[#FFFDF9] border border-[#DED5C6] rounded text-[#201D1A] focus:outline-none focus:border-[#B94A2C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#655D52] mb-1">
                    Rate ({currency}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-[#FFFDF9] border border-[#DED5C6] rounded text-[#201D1A] focus:outline-none focus:border-[#B94A2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#655D52] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail tools, preparations, tonics, or techniques used..."
                  className="w-full px-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#DED5C6] rounded text-[#201D1A] focus:outline-none focus:border-[#B94A2C] font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 font-mono">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-3 py-1.5 text-xs bg-[#EFE9DC] rounded text-[#655D52]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#B94A2C] text-[#FFFDF9] rounded hover:bg-[#9A381F]"
                >
                  Save Service
                </button>
              </div>
            </form>
          )}

          {/* Service items list */}
          <div className="divide-y divide-[#EFE9DC] border border-[#DED5C6] rounded-lg bg-[#FFFDF9] overflow-hidden">
            {items.map((srv) => (
              <div
                key={srv.id}
                className="p-3.5 sm:p-4 flex items-start justify-between gap-4 hover:bg-[#FAF7F2] transition-colors"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#8E8475]">
                    <span className="uppercase font-semibold">{srv.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{srv.durationMinutes} mins</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-[#201D1A]">
                      {currency}{srv.price}
                    </span>
                  </div>

                  <h5 className="font-serif font-bold text-base text-[#201D1A]">{srv.name}</h5>
                  <p className="text-xs text-[#655D52] line-clamp-1 font-sans">{srv.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(srv.id)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase cursor-pointer border ${
                      srv.isActive
                        ? 'bg-[#EEF4EE] text-[#2C4E37] border-[#2C4E37]'
                        : 'bg-[#FAF7F2] text-[#8E8475] border-[#DED5C6]'
                    }`}
                  >
                    {srv.isActive ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    type="button"
                    onClick={() => startEdit(srv)}
                    className="text-[#655D52] hover:text-[#201D1A] cursor-pointer"
                  >
                    [Edit]
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(srv.id)}
                    className="text-[#B94A2C] hover:underline cursor-pointer"
                  >
                    [Del]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] flex justify-end shrink-0 font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded bg-[#EFE9DC] text-[#201D1A] hover:bg-[#DED5C6] transition-colors cursor-pointer"
          >
            Done Managing
          </button>
        </div>
      </div>
    </div>
  );
};
