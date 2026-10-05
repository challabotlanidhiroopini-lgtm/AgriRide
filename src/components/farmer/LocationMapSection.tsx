import React, { useState } from 'react';
import { Equipment } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Maximize2, 
  Layers, 
  Compass, 
  CheckCircle2, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { PRESET_FARMER_LOCATIONS } from '../../utils/locationUtils';

interface LocationMapSectionProps {
  equipment: Equipment;
  distanceKm: number;
}

export const LocationMapSection: React.FC<LocationMapSectionProps> = ({ equipment, distanceKm }) => {
  const { farmerLocation, setFarmerLocation } = useApp();
  const [mapStyle, setMapStyle] = useState<'fields' | 'terrain' | 'satellite'>('fields');
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const eq = equipment;
  const isWithinDelivery = eq.deliveryAvailable && distanceKm <= eq.deliveryRadiusKm;
  const estimatedMins = Math.max(10, Math.round(distanceKm * 3.5));

  const handleSelectPreset = (locName: string) => {
    setFarmerLocation(locName);
    setIsChangingLocation(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setFarmerLocation(customInput.trim());
      setCustomInput('');
      setIsChangingLocation(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4 text-emerald-700" />
            </div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Machinery Location & Route Map
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Approx. <strong className="text-stone-800 font-semibold">{distanceKm} km</strong> from your selected farm in <span className="text-emerald-800 font-medium">{farmerLocation}</span>
          </p>
        </div>

        {/* Change location trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsChangingLocation(!isChangingLocation)}
            className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Change My Location</span>
          </button>
        </div>
      </div>

      {/* Quick Location Picker Drawer if toggled */}
      {isChangingLocation && (
        <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 transition-all text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-950">Select your farm village/district to recalculate distance:</span>
            <button
              onClick={() => setIsChangingLocation(false)}
              className="text-stone-500 hover:text-stone-800 underline text-[11px]"
            >
              Close
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PRESET_FARMER_LOCATIONS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.name)}
                className={`px-2.5 py-1.5 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                  farmerLocation.toLowerCase().includes(preset.district.toLowerCase())
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-white text-stone-700 hover:bg-emerald-100/70 border border-stone-200'
                }`}
              >
                📍 {preset.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or enter any custom village or tehsil..."
              className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-md text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-md text-xs cursor-pointer"
            >
              Update
            </button>
          </form>
        </div>
      )}

      {/* Stylized Prototype Map Graphic */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-stone-100 overflow-hidden select-none">
        
        {/* Background Canvas: Agricultural Field Plots & Topo Roads */}
        <svg className="w-full h-full object-cover" viewBox="0 0 800 340" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Grid pattern representing parcelized farmlands */}
            <pattern id="farm-plots" width="70" height="70" patternUnits="userSpaceOnUse">
              <rect width="70" height="70" fill={mapStyle === 'satellite' ? '#2f3b2f' : mapStyle === 'terrain' ? '#f4eedb' : '#f8f6f0'} />
              <rect x="2" y="2" width="32" height="32" fill={mapStyle === 'satellite' ? '#283328' : mapStyle === 'terrain' ? '#ede5ce' : '#f0ece1'} opacity="0.8" />
              <rect x="36" y="2" width="32" height="32" fill={mapStyle === 'satellite' ? '#333e33' : mapStyle === 'terrain' ? '#e9dfc6' : '#ece7dc'} opacity="0.6" />
              <rect x="2" y="36" width="32" height="32" fill={mapStyle === 'satellite' ? '#2c372c' : mapStyle === 'terrain' ? '#e6dcbe' : '#e7e2d5'} opacity="0.7" />
              <rect x="36" y="36" width="32" height="32" fill={mapStyle === 'satellite' ? '#384538' : mapStyle === 'terrain' ? '#ebe1c8' : '#efebe0'} opacity="0.9" />
              {/* Plot furrows */}
              <line x1="2" y1="10" x2="34" y2="10" stroke={mapStyle === 'satellite' ? '#445344' : '#e0dbce'} strokeWidth="0.75" strokeDasharray="2 3" />
              <line x1="2" y1="20" x2="34" y2="20" stroke={mapStyle === 'satellite' ? '#445344' : '#e0dbce'} strokeWidth="0.75" strokeDasharray="2 3" />
            </pattern>

            {/* Canal / Water gradient */}
            <linearGradient id="canal-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5c4d4" />
              <stop offset="100%" stopColor="#8cb3c6" />
            </linearGradient>

            {/* Glow for route line */}
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Parcel Pattern */}
          <rect width="800" height="340" fill="url(#farm-plots)" />

          {/* Irrigation canal meandering through fields */}
          <path
            d="M -20,290 C 180,270 240,190 390,210 C 520,230 630,120 820,110"
            fill="none"
            stroke="url(#canal-gradient)"
            strokeWidth="14"
            opacity="0.85"
          />
          <path
            d="M -20,290 C 180,270 240,190 390,210 C 520,230 630,120 820,110"
            fill="none"
            stroke="#6fa0b9"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.9"
          />

          {/* Secondary rural road network */}
          <path d="M 80,-20 L 150,360" stroke={mapStyle === 'satellite' ? '#686f68' : '#e2dac6'} strokeWidth="5" fill="none" />
          <path d="M 700,-20 L 640,360" stroke={mapStyle === 'satellite' ? '#686f68' : '#e2dac6'} strokeWidth="5" fill="none" />
          <path d="M -20,120 Q 300,140 820,90" stroke={mapStyle === 'satellite' ? '#686f68' : '#e2dac6'} strokeWidth="4" fill="none" />

          {/* Equipment Delivery Radius Circle */}
          {eq.deliveryAvailable && (
            <circle
              cx="590"
              cy="140"
              r="170"
              fill="#059669"
              fillOpacity="0.08"
              stroke="#059669"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
          )}

          {/* Primary Connecting Transit Road / Route Line between Farmer (210, 200) and Equipment Host (590, 140) */}
          {/* Base asphalt path */}
          <path
            d="M 210,200 C 270,170 330,230 420,180 S 520,130 590,140"
            fill="none"
            stroke="#ffffff"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Active Navigation Route Line */}
          <path
            d="M 210,200 C 270,170 330,230 420,180 S 520,130 590,140"
            fill="none"
            stroke="#059669"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#route-glow)"
          />
          {/* Animated/Dotted directional marker */}
          <path
            d="M 210,200 C 270,170 330,230 420,180 S 520,130 590,140"
            fill="none"
            stroke="#a7f3d0"
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeLinecap="round"
          />

          {/* Route Distance Badge in Midpoint (380, 185) */}
          <g transform="translate(350, 160)">
            <rect x="0" y="0" width="115" height="28" rx="14" fill="#1c1917" opacity="0.92" />
            <text x="57" y="18" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="monospace">
              {distanceKm} km · ~{estimatedMins} min
            </text>
          </g>

          {/* Point A: Farmer's Location (210, 200) */}
          <g transform="translate(210, 200)">
            {/* Radar wave pulse */}
            <circle cx="0" cy="0" r="22" fill="#10b981" fillOpacity="0.25">
              <animate attributeName="r" values="12;28;12" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="10" fill="#047857" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
          </g>

          {/* Point B: Equipment Owner Depot (590, 140) */}
          <g transform="translate(590, 140)">
            <circle cx="0" cy="0" r="24" fill="#d97706" fillOpacity="0.25">
              <animate attributeName="r" values="14;30;14" dur="3s" begin="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" begin="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="12" fill="#b45309" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="5" fill="#fef3c7" />
          </g>
        </svg>

        {/* HTML Labels overlay for Point A (Farmer) */}
        <div className="absolute left-[14%] sm:left-[21%] top-[54%] -translate-x-1/2 -translate-y-full mb-3 pointer-events-none">
          <div className="bg-stone-900/95 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-md border border-stone-700/80 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Your Farm: {farmerLocation.split(',')[0]}</span>
          </div>
        </div>

        {/* HTML Labels overlay for Point B (Equipment Depot) */}
        <div className="absolute left-[70%] sm:left-[74%] top-[34%] -translate-x-1/2 -translate-y-full mb-3 pointer-events-none">
          <div className="bg-emerald-950/95 text-emerald-100 px-3 py-1.5 rounded-md text-[11px] font-bold shadow-md border border-emerald-600/70 flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-amber-400">🚜</span>
            <span>{eq.ownerName}&apos;s Depot ({eq.location.village})</span>
          </div>
        </div>

        {/* Map UI Controls & Layer Selector */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-stone-900/85 backdrop-blur-xs p-1 rounded-lg border border-stone-700 text-[11px] text-stone-200">
          <button
            type="button"
            onClick={() => setMapStyle('fields')}
            className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
              mapStyle === 'fields' ? 'bg-emerald-700 text-white font-bold' : 'hover:text-white'
            }`}
          >
            Rural Roads
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('terrain')}
            className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
              mapStyle === 'terrain' ? 'bg-emerald-700 text-white font-bold' : 'hover:text-white'
            }`}
          >
            Terrain
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('satellite')}
            className={`px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
              mapStyle === 'satellite' ? 'bg-emerald-700 text-white font-bold' : 'hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Interactive Delivery Radius status tag */}
        <div className="absolute bottom-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 border border-stone-800">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {isWithinDelivery 
              ? `Your location is within host's ${eq.deliveryRadiusKm} km delivery zone`
              : eq.deliveryAvailable
              ? `Self-pickup suggested (exceeds ${eq.deliveryRadiusKm} km delivery limit)`
              : 'Direct pickup from equipment yard'}
          </span>
        </div>
      </div>

      {/* Transit specifications & route breakdown below map */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-white border-t border-stone-100">
        
        {/* Machine exact depot location */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
          <div className="flex items-center gap-1.5 text-stone-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold text-stone-700">Depot Address</span>
          </div>
          <p className="font-bold text-stone-900 text-xs mt-0.5">
            {eq.location.village}, {eq.location.district}
          </p>
          <p className="text-[11px] text-stone-500">
            {eq.location.state} · Host: {eq.ownerName}
          </p>
        </div>

        {/* Transit Distance & Duration */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
          <div className="flex items-center gap-1.5 text-stone-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-stone-700">Transit Duration</span>
          </div>
          <p className="font-bold text-stone-900 font-mono text-xs mt-0.5">
            ~{estimatedMins} Minutes
          </p>
          <p className="text-[11px] text-stone-500">
            {distanceKm} km via rural link roads
          </p>
        </div>

        {/* Delivery Terms */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
          <div className="flex items-center gap-1.5 text-stone-500 mb-1">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold text-stone-700">Delivery Logistics</span>
          </div>
          <p className="font-bold text-stone-900 text-xs mt-0.5">
            {eq.deliveryAvailable ? `Direct Haulage (₹${eq.deliveryRatePerKm}/km)` : 'Self-Drive / Pickup'}
          </p>
          <p className="text-[11px] text-stone-500">
            {isWithinDelivery ? '✓ Delivers to your gate' : 'Pickup from owner yard'}
          </p>
        </div>

      </div>
    </div>
  );
};
