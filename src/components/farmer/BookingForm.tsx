import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Truck, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

export const BookingForm: React.FC = () => {
  const { 
    selectedEquipment, 
    setFarmerView, 
    createBooking, 
    farmerLocation, 
    getDistanceToFarmer 
  } = useApp();

  if (!selectedEquipment) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-stone-600 mb-4">No equipment selected for booking.</p>
        <button
          onClick={() => setFarmerView('search')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm"
        >
          Return to Equipment Search
        </button>
      </div>
    );
  }

  const eq = selectedEquipment;
  const distanceKm = getDistanceToFarmer(eq);

  // Form State
  const [farmerName, setFarmerName] = useState('Ramesh Patel');
  const [farmerPhone, setFarmerPhone] = useState('+91 98251 12345');
  const [farmerVillage, setFarmerVillage] = useState(farmerLocation || 'Sultanpur Khurd, Sangrur');
  
  const [rentalType, setRentalType] = useState<'days' | 'hours'>('days');
  const [startDate, setStartDate] = useState('2026-10-03');
  const [endDate, setEndDate] = useState('2026-10-04');
  const [durationHours, setDurationHours] = useState<number>(Math.max(eq.minBookingHours, 4));
  
  const [needsOperator, setNeedsOperator] = useState<boolean>(eq.operatorAvailable);
  const [deliveryOption, setDeliveryOption] = useState<'self_pickup' | 'delivery'>(
    eq.deliveryAvailable ? 'delivery' : 'self_pickup'
  );
  const [fieldSizeAcres, setFieldSizeAcres] = useState<number>(5);
  const [cropType, setCropType] = useState('Wheat Field Sowing');
  const [notes, setNotes] = useState('');

  // Calculate duration in days
  const calculateDays = () => {
    if (rentalType === 'hours') return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, isNaN(diff) ? 1 : diff);
  };

  const daysCount = calculateDays();
  const effectiveDuration = rentalType === 'days' ? daysCount : durationHours;

  // Cost calculation
  const basePrice = rentalType === 'days' 
    ? eq.ratePerDay * daysCount 
    : eq.ratePerHour * durationHours;

  const operatorFee = (needsOperator && eq.operatorAvailable)
    ? (rentalType === 'days' ? eq.operatorRatePerDay * daysCount : Math.round((eq.operatorRatePerDay / 8) * durationHours))
    : 0;

  const deliveryFee = deliveryOption === 'delivery' && eq.deliveryAvailable
    ? Math.round(distanceKm * eq.deliveryRatePerKm * 2) // round trip
    : 0;

  const totalAmount = basePrice + operatorFee + deliveryFee + eq.securityDeposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmerName.trim() || !farmerPhone.trim() || !farmerVillage.trim()) {
      alert('Please fill in your name, contact phone, and farm location.');
      return;
    }

    createBooking({
      equipmentId: eq.id,
      equipmentName: eq.name,
      equipmentCategory: eq.category,
      equipmentImage: eq.imageUrl,
      ownerName: eq.ownerName,
      ownerPhone: eq.ownerPhone,
      farmerName,
      farmerPhone,
      farmerVillage,
      startDate,
      endDate: rentalType === 'days' ? endDate : startDate,
      rentalType,
      duration: effectiveDuration,
      needsOperator,
      deliveryOption,
      fieldSizeAcres,
      cropType,
      basePrice,
      operatorFee,
      deliveryFee,
      securityDeposit: eq.securityDeposit,
      totalAmount,
      notes,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => setFarmerView('details')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to equipment details</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Machinery Booking Form
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete your schedule and farm requirements to send a formal booking reservation to {eq.ownerName}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 cols: Form inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Selected Machine Header Summary */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center gap-4">
            <img
              src={eq.imageUrl}
              alt={eq.name}
              className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold uppercase text-emerald-800 tracking-wider">
                {eq.brand} · {eq.horsepower} HP
              </span>
              <h3 className="text-sm font-bold text-stone-900 truncate">{eq.name}</h3>
              <p className="text-xs text-stone-500 truncate">
                Owner: {eq.ownerName} ({eq.location.village}, {eq.location.distanceKm} km away)
              </p>
            </div>
          </div>

          {/* Section 1: Farmer Contact Information */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" />
              <span>1. Farmer & Field Location</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Farmer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number (for WhatsApp/Calls) *
                </label>
                <input
                  type="tel"
                  required
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="e.g. +91 98251 12345"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Farm / Village Delivery Address *
              </label>
              <input
                type="text"
                required
                value={farmerVillage}
                onChange={(e) => setFarmerVillage(e.target.value)}
                placeholder="e.g. Sultanpur Khurd, Near Water Tank, Sangrur"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Section 2: Rental Duration & Schedule */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>2. Rental Schedule</span>
            </h2>

            {/* Rental type buttons */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-lg">
              <button
                type="button"
                onClick={() => setRentalType('days')}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  rentalType === 'days'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Daily Booking (₹{eq.ratePerDay}/day)
              </button>
              <button
                type="button"
                onClick={() => setRentalType('hours')}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  rentalType === 'hours'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Hourly Booking (₹{eq.ratePerHour}/hr)
              </button>
            </div>

            {rentalType === 'days' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Hours Needed (Min {eq.minBookingHours} hrs)
                  </label>
                  <input
                    type="number"
                    min={eq.minBookingHours}
                    max={24}
                    value={durationHours}
                    onChange={(e) => setDurationHours(Math.max(eq.minBookingHours, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Operator & Delivery Options */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>3. Driver & Logistics Preferences</span>
            </h2>

            {/* Operator choice */}
            {eq.operatorAvailable ? (
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="needsOperatorCheck"
                  checked={needsOperator}
                  onChange={(e) => setNeedsOperator(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="needsOperatorCheck" className="text-xs cursor-pointer flex-1">
                  <div className="font-semibold text-stone-900">
                    Include Certified Driver / Operator (+₹{eq.operatorRatePerDay}/day)
                  </div>
                  <p className="text-stone-500 mt-0.5">
                    Recommended for specialized operations like drone spraying, heavy combine harvesting, or rotavating.
                  </p>
                </label>
              </div>
            ) : (
              <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-500 flex items-center gap-2">
                <Info className="w-4 h-4 text-stone-400 shrink-0" />
                <span>This machinery is self-drive only. Farmer must provide an experienced operator.</span>
              </div>
            )}

            {/* Delivery option */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                Machinery Transfer Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryOption('delivery')}
                  disabled={!eq.deliveryAvailable}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    deliveryOption === 'delivery'
                      ? 'border-emerald-600 bg-emerald-50/50 text-stone-900 font-medium ring-1 ring-emerald-600'
                      : eq.deliveryAvailable
                      ? 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      : 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <div className="font-semibold">Doorstep Field Delivery</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {eq.deliveryAvailable
                      ? `Owner delivers to your field (₹${eq.deliveryRatePerKm}/km)`
                      : 'Delivery not offered for this unit'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryOption('self_pickup')}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    deliveryOption === 'self_pickup'
                      ? 'border-emerald-600 bg-emerald-50/50 text-stone-900 font-medium ring-1 ring-emerald-600'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="font-semibold">Self Pickup from Owner</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Collect from {eq.location.village} at zero extra delivery charge.
                  </div>
                </button>
              </div>
            </div>

            {/* Field Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Field Area (Acres)
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={fieldSizeAcres}
                  onChange={(e) => setFieldSizeAcres(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Crop & Operation Type
                </label>
                <input
                  type="text"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  placeholder="e.g. Paddy Puddling / Wheat Sowing"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Additional Instructions or Timing Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please bring machine by 7:00 AM. Field entrance is through east canal road."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right 5 cols: Itemized Cost Breakdown & Submit */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
              Reservation Summary
            </h2>

            {/* Itemized list */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>
                  Base Rent ({rentalType === 'days' ? `${daysCount} day(s)` : `${durationHours} hour(s)`}):
                </span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">
                  ₹{basePrice.toLocaleString()}
                </span>
              </div>

              {needsOperator && eq.operatorAvailable && (
                <div className="flex items-center justify-between text-stone-600">
                  <span>Tractor Operator / Driver Fee:</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    ₹{operatorFee.toLocaleString()}
                  </span>
                </div>
              )}

              {deliveryOption === 'delivery' && (
                <div className="flex items-center justify-between text-stone-600">
                  <span>Field Delivery ({distanceKm} km round trip):</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    ₹{deliveryFee.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <span>Refundable Security Deposit:</span>
                  <span className="text-[10px] text-stone-400">(Escrow)</span>
                </span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">
                  ₹{eq.securityDeposit.toLocaleString()}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
                <div>
                  <div className="text-xs font-semibold text-stone-900">Total Payable at Start</div>
                  <div className="text-[11px] text-stone-500">Includes refundable ₹{eq.securityDeposit} deposit</div>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
                  ₹{totalAmount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Confirmation CTA */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Booking Request</span>
            </button>

            {/* Guarantee note */}
            <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-500 border border-stone-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Submitting places a tentative reservation. {eq.ownerName} will be notified immediately to approve your request. Pay securely upon machine arrival.
              </p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
