import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EquipmentCategory } from '../../types';
import { 
  ArrowLeft, 
  Tractor, 
  Upload, 
  MapPin, 
  IndianRupee, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Truck
} from 'lucide-react';

const PHOTO_PRESETS = [
  {
    label: 'Heavy Tractor in Golden Wheat',
    url: '/src/assets/images/agri_tractor_field_1790683935128.jpg',
  },
  {
    label: 'Combine Harvester in Harvest Field',
    url: '/src/assets/images/agri_combine_harvester_1790683950014.jpg',
  },
  {
    label: 'Rotary Tiller / Rotavator Attachment',
    url: '/src/assets/images/agri_tiller_rotavator_1790683964530.jpg',
  },
  {
    label: 'Agricultural Drone Sprayer',
    url: '/src/assets/images/agri_drone_sprayer_1790683976212.jpg',
  },
  {
    label: 'Manual Sprayer Pump (20L)',
    url: '/src/assets/images/agri_manual_sprayer_1790684689093.jpg',
  }
];

export const AddEquipment: React.FC = () => {
  const { addEquipment, setOwnerView } = useApp();

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<EquipmentCategory, 'all'>>('tractors');
  const [brand, setBrand] = useState('Mahindra');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2023);
  const [horsepower, setHorsepower] = useState<number>(50);
  const [fuelType, setFuelType] = useState<any>('Diesel');
  
  const [ratePerDay, setRatePerDay] = useState<number>(2600);
  const [ratePerHour, setRatePerHour] = useState<number>(400);
  const [minBookingHours, setMinBookingHours] = useState<number>(4);
  const [securityDeposit, setSecurityDeposit] = useState<number>(3000);

  const [village, setVillage] = useState('Rampur Kalan');
  const [district, setDistrict] = useState('Sangrur');
  const [state, setState] = useState('Punjab');
  const [distanceKm, setDistanceKm] = useState<number>(5.0);

  const [operatorAvailable, setOperatorAvailable] = useState<boolean>(true);
  const [operatorRatePerDay, setOperatorRatePerDay] = useState<number>(600);

  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean>(true);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState<number>(25);
  const [deliveryRatePerKm, setDeliveryRatePerKm] = useState<number>(20);

  const [condition, setCondition] = useState<any>('Excellent');
  const [description, setDescription] = useState('');
  const [keyFeaturesInput, setKeyFeaturesInput] = useState(
    'Dual Clutch transmission, Power Steering, High fuel efficiency'
  );
  const [implementsInput, setImplementsInput] = useState(
    'Trolley Hitch, Front Counterweights, Top Link'
  );

  const [selectedPhoto, setSelectedPhoto] = useState<string>(PHOTO_PRESETS[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please provide an equipment name.');
      return;
    }

    const keyFeatures = keyFeaturesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const implementsIncluded = implementsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addEquipment({
      name,
      category,
      brand,
      model: model || `${brand} Special`,
      year,
      horsepower,
      fuelType,
      ratePerHour,
      ratePerDay,
      securityDeposit,
      location: {
        village,
        district,
        state,
        distanceKm,
      },
      operatorAvailable,
      operatorRatePerDay: operatorAvailable ? operatorRatePerDay : 0,
      deliveryAvailable,
      deliveryRadiusKm: deliveryAvailable ? deliveryRadiusKm : 0,
      deliveryRatePerKm: deliveryAvailable ? deliveryRatePerKm : 0,
      condition,
      description: description || `Well-maintained ${brand} ${horsepower} HP machinery available for seasonal hire. Verified engine condition with regular servicing.`,
      keyFeatures: keyFeatures.length > 0 ? keyFeatures : [`${horsepower} HP high-torque engine`, 'Regular maintenance record'],
      implementsIncluded,
      imageUrl: selectedPhoto,
      status: 'available',
      minBookingHours,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <button
        onClick={() => setOwnerView('my_equipment')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to my equipment list</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          List Farm Machinery for Rent
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Share your tractors, harvesters, or agricultural implements with verified local farmers in your area.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Basic Machine Info */}
        <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Tractor className="w-4 h-4 text-amber-600" />
            <span>1. Machinery Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Equipment Title / Listing Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mahindra 575 DI Sarpanch 47 HP Tractor"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 cursor-pointer"
              >
                <option value="tractors">Tractor</option>
                <option value="harvesters">Combine Harvester</option>
                <option value="tillers">Rotary Tiller / Cultivator</option>
                <option value="sprayers">Sprayer / Drone</option>
                <option value="seeders">Seed Drill / Planter</option>
                <option value="balers">Baler / Mower</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. John Deere, Mahindra, Kubota, Sonalika"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Model Name / Variant
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. 5050D GearPro"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Power (HP) *
                </label>
                <input
                  type="number"
                  required
                  min={5}
                  max={250}
                  value={horsepower}
                  onChange={(e) => setHorsepower(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Model Year
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2026}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Fuel / Drive Mechanism
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 cursor-pointer"
              >
                <option value="Diesel">Diesel</option>
                <option value="Manual (Hand-Operated)">Manual (Hand-Operated)</option>
                <option value="Battery-Operated">Battery-Operated (Electric / Drone)</option>
                <option value="Tractor-Driven (PTO)">Tractor-Driven (PTO Attachment)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 cursor-pointer"
              >
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Rates */}
        <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-amber-600" />
            <span>2. Rental Pricing & Deposit</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Rate per Day (₹) *
              </label>
              <input
                type="number"
                required
                min={100}
                value={ratePerDay}
                onChange={(e) => setRatePerDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Rate per Hour (₹) *
              </label>
              <input
                type="number"
                required
                min={50}
                value={ratePerHour}
                onChange={(e) => setRatePerHour(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Min. Booking Hours
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={minBookingHours}
                onChange={(e) => setMinBookingHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                min={0}
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Driver & Delivery Options */}
        <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>3. Driver & Delivery Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Operator toggle */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={operatorAvailable}
                  onChange={(e) => setOperatorAvailable(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300"
                />
                <span className="text-xs font-bold text-stone-900">
                  Provide Driver / Trained Operator
                </span>
              </label>

              {operatorAvailable && (
                <div>
                  <label className="block text-xs text-stone-600 mb-1">
                    Operator Charge per Day (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={operatorRatePerDay}
                    onChange={(e) => setOperatorRatePerDay(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Delivery toggle */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300"
                />
                <span className="text-xs font-bold text-stone-900">
                  Offer Field Delivery to Farmer
                </span>
              </label>

              {deliveryAvailable && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Max Radius (km)</label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={deliveryRadiusKm}
                      onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Rate per km (₹)</label>
                    <input
                      type="number"
                      min={5}
                      value={deliveryRatePerKm}
                      onChange={(e) => setDeliveryRatePerKm(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Village *</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">District *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Machine Photography & Description */}
        <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-600" />
            <span>4. Visual Photo & Description</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Select Curated Agricultural Photo Preset:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PHOTO_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedPhoto(p.url)}
                  className={`p-1.5 rounded-xl border text-left transition-all overflow-hidden ${
                    selectedPhoto === p.url
                      ? 'border-amber-600 ring-2 ring-amber-600 bg-amber-50/30'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full aspect-[4/3] object-cover rounded-lg mb-1.5" />
                  <span className="text-[11px] font-medium text-stone-700 line-clamp-1 px-1">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Implements Included (comma separated)
            </label>
            <input
              type="text"
              value={implementsInput}
              onChange={(e) => setImplementsInput(e.target.value)}
              placeholder="e.g. Trolley Hitch, Disc Harrow, 9-tyne cultivator"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Key Features & Highlights (comma separated)
            </label>
            <input
              type="text"
              value={keyFeaturesInput}
              onChange={(e) => setKeyFeaturesInput(e.target.value)}
              placeholder="e.g. High torque engine, New tires, Low diesel consumption"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Detailed Description for Farmers
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe machine performance, ideal crop seasons, and working conditions..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 resize-none"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setOwnerView('my_equipment')}
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            List Equipment on AgriRide
          </button>
        </div>

      </form>
    </div>
  );
};
