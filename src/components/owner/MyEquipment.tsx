import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Equipment } from '../../types';
import { 
  Tractor, 
  Plus, 
  Trash2, 
  MapPin, 
  Gauge, 
  Eye, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench
} from 'lucide-react';

export const MyEquipment: React.FC = () => {
  const { 
    equipmentList, 
    updateEquipmentStatus, 
    deleteEquipment, 
    setOwnerView,
    goToDetails,
    setRole
  } = useApp();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteEquipment(id);
    setConfirmDeleteId(null);
  };

  const handlePreviewAsFarmer = (eq: Equipment) => {
    setRole('farmer');
    goToDetails(eq);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            My Machinery Fleet
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your registered tractors, harvesters, and attachments. Toggle availability status between jobs.
          </p>
        </div>

        <button
          onClick={() => setOwnerView('add_equipment')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Equipment</span>
        </button>
      </div>

      {/* Equipment Fleet List */}
      {equipmentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.map(eq => (
            <div
              key={eq.id}
              className="bg-white rounded-xl border border-stone-200/90 shadow-xs flex flex-col overflow-hidden hover:border-stone-300 transition-all"
            >
              {/* Image & Quick Status Bar */}
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                <img
                  src={eq.imageUrl}
                  alt={eq.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  {eq.category.toUpperCase()}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-semibold uppercase text-stone-700">{eq.brand}</span>
                  <span>Model {eq.year}</span>
                </div>

                <h3 className="text-base font-bold text-stone-900 leading-snug mb-2 line-clamp-1">
                  {eq.name}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mb-4 pb-3 border-b border-stone-100">
                  <span className="font-semibold text-stone-800">{eq.horsepower} HP</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span>{eq.fuelType}</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span>{eq.location.village}</span>
                </div>

                {/* Rates & Rental Stats */}
                <div className="space-y-1.5 text-xs text-stone-600 mb-4">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Day Rate:</span>
                    <span className="font-mono font-bold text-stone-900">₹{eq.ratePerDay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Hour Rate:</span>
                    <span className="font-mono text-stone-800">₹{eq.ratePerHour}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total Bookings Completed:</span>
                    <span className="font-semibold text-stone-900">{eq.totalRentals} jobs</span>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="pt-3 border-t border-stone-100 mt-auto space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium">Availability:</span>
                    <select
                      value={eq.status}
                      onChange={(e) => updateEquipmentStatus(eq.id, e.target.value as any)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded border cursor-pointer ${
                        eq.status === 'available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : eq.status === 'booked'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >
                      <option value="available">Available for Hire</option>
                      <option value="booked">Currently Booked</option>
                      <option value="maintenance">In Maintenance</option>
                    </select>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handlePreviewAsFarmer(eq)}
                      className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-emerald-800 font-medium transition-colors"
                      title="Preview how farmers view this machinery listing"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Listing</span>
                    </button>

                    {confirmDeleteId === eq.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(eq.id)}
                          className="px-2 py-0.5 bg-rose-700 text-white rounded text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(eq.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto">
          <Tractor className="w-12 h-12 text-stone-400 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-stone-800 mb-1">No machinery listed yet</h3>
          <p className="text-xs text-stone-500 mb-5">
            List your tractors, rotavators, or harvesters to start receiving booking requests from local farmers.
          </p>
          <button
            onClick={() => setOwnerView('add_equipment')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg"
          >
            + List Your First Machine
          </button>
        </div>
      )}
    </div>
  );
};
