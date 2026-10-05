import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Check, 
  Truck, 
  UserCheck, 
  Clock, 
  Phone, 
  Wrench,
  Fuel,
  Gauge,
  Calendar,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { LocationMapSection } from './LocationMapSection';

export const EquipmentDetails: React.FC = () => {
  const { 
    selectedEquipment, 
    setFarmerView, 
    goToBooking,
    getDistanceToFarmer,
    farmerLocation
  } = useApp();

  const [imageError, setImageError] = useState(false);

  if (!selectedEquipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-600 mb-4">No equipment selected.</p>
        <button
          onClick={() => setFarmerView('search')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm cursor-pointer"
        >
          Return to Equipment Search
        </button>
      </div>
    );
  }

  const eq = selectedEquipment;
  const isAvailable = eq.status === 'available';
  const distanceKm = getDistanceToFarmer(eq);
  const isWithinDelivery = eq.deliveryAvailable && distanceKm <= eq.deliveryRadiusKm;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => setFarmerView('search')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors mb-6 group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to search listings</span>
      </button>

      {/* Main Grid: Left Detailed Column + Right Contiguous Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 cols: Media + Specifications + Location Map + Descriptions */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Hero Image */}
          <div className="relative aspect-[16/9] sm:aspect-[16/10] bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
            {!imageError ? (
              <img
                src={eq.imageUrl}
                alt={eq.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 p-8 text-stone-500">
                <Wrench className="w-16 h-16 text-stone-400 mb-3" />
                <p className="font-semibold">{eq.name}</p>
              </div>
            )}

            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-md shadow-xs ${
                isAvailable ? 'bg-emerald-800 text-white' : 'bg-stone-800 text-stone-200'
              }`}>
                {isAvailable ? 'Ready for Rent' : 'Currently Booked'}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-stone-900/80 text-white backdrop-blur-xs">
                Condition: {eq.condition}
              </span>
            </div>

            {/* Floating Location Pill on Image */}
            <div className="absolute bottom-4 left-4 bg-stone-900/85 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm border border-stone-700/60">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{eq.location.village}, {eq.location.district}</span>
              <span className="text-stone-400">·</span>
              <span className="font-mono text-emerald-300 font-bold">{distanceKm} km away</span>
            </div>
          </div>

          {/* Machine Title & Location Header */}
          <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-emerald-800">{eq.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{eq.category.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>Model Year {eq.year}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-3">
              {eq.name}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-stone-800">{eq.location.village}, {eq.location.district}, {eq.location.state}</span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {distanceKm} km from {farmerLocation.split(',')[0]}
                </span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-stone-800">{eq.ownerRating} Owner Rating</span>
                <span className="text-stone-500">({eq.totalRentals} completed jobs)</span>
              </div>
            </div>
          </div>

          {/* Simple Map-Style Location Section (Prototype Map) */}
          <LocationMapSection equipment={eq} distanceKm={distanceKm} />

          {/* Key Specifications Grid */}
          <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
              Machinery Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Gauge className="w-4 h-4 text-stone-400" />
                  <span>Horsepower</span>
                </div>
                <div className="text-base font-bold text-stone-900 font-mono">{eq.horsepower} HP</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Fuel className="w-4 h-4 text-stone-400" />
                  <span>Fuel / Power</span>
                </div>
                <div className="text-sm font-bold text-stone-900">{eq.fuelType}</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span>Min. Rental</span>
                </div>
                <div className="text-base font-bold text-stone-900 font-mono">{eq.minBookingHours} Hours</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Truck className="w-4 h-4 text-stone-400" />
                  <span>Delivery Radius</span>
                </div>
                <div className="text-base font-bold text-stone-900 font-mono">{eq.deliveryRadiusKm} km</div>
              </div>
            </div>

            {/* Implements included */}
            {eq.implementsIncluded && eq.implementsIncluded.length > 0 && (
              <div className="mt-5 pt-4 border-t border-stone-100">
                <h3 className="text-xs font-semibold text-stone-700 mb-2">Implements & Attachments Included:</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {eq.implementsIncluded.map((imp, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded text-xs font-medium">
                      ✓ {imp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description & Features */}
          <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Description & Field Capability
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              {eq.description}
            </p>

            <div className="pt-2">
              <h3 className="text-xs font-semibold text-stone-700 mb-2.5">Key Highlights:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                {eq.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Owner Profile card */}
          <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center font-bold text-lg">
                {eq.ownerName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900">{eq.ownerName}</h3>
                  <div className="flex items-center gap-0.5 text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Owner</span>
                  </div>
                </div>
                <p className="text-xs text-stone-500">
                  Equipment host in {eq.location.village}, {eq.location.district} · {eq.totalRentals} bookings completed
                </p>
              </div>
            </div>

            <div className="text-xs text-stone-600 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>Contact shared upon booking request</span>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Sticky Contiguous Purchase/Booking Module */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-sm space-y-5">
            {/* Price Header */}
            <div>
              <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">
                Standard Rental Rate
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                  ₹{eq.ratePerDay.toLocaleString()}
                </span>
                <span className="text-sm text-stone-500">/ day (8 hrs)</span>
              </div>
              <div className="text-xs text-stone-500 mt-1 font-mono tabular-nums">
                Hourly rate: ₹{eq.ratePerHour} / hr (min {eq.minBookingHours} hrs)
              </div>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Location & Proximity Callout */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-stone-800">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Proximity to Farm:</span>
                </span>
                <span className="font-mono text-emerald-800">{distanceKm} km</span>
              </div>
              <p className="text-[11px] text-stone-500">
                {isWithinDelivery 
                  ? `✓ Within host's ${eq.deliveryRadiusKm} km delivery zone`
                  : eq.deliveryAvailable
                  ? `Pickup suggested (exceeds ${eq.deliveryRadiusKm} km delivery radius)`
                  : 'Self-pickup at owner depot'}
              </p>
            </div>

            {/* Quick summary check items */}
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Refundable Deposit:</span>
                <span className="font-semibold text-stone-800 font-mono">₹{eq.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Operator Option:</span>
                <span className="font-semibold text-stone-800">
                  {eq.operatorAvailable ? `Available (+₹${eq.operatorRatePerDay}/day)` : 'Not Available (Self-Drive)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Direct Delivery:</span>
                <span className="font-semibold text-stone-800">
                  {eq.deliveryAvailable ? `Up to ${eq.deliveryRadiusKm} km (₹${eq.deliveryRatePerKm}/km)` : 'Pickup Only'}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => goToBooking(eq)}
              disabled={!isAvailable}
              className={`w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
                isAvailable
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-500 cursor-not-allowed'
              }`}
            >
              <span>{isAvailable ? 'Proceed to Booking Form' : 'Equipment Currently Unavailable'}</span>
            </button>

            {/* Trust and safety note */}
            <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-500 space-y-1.5 border border-stone-100">
              <div className="flex items-center gap-1.5 font-semibold text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AgriRide Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Direct equipment inspection before field start. Security deposit held in escrow until rental concludes smoothly.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
