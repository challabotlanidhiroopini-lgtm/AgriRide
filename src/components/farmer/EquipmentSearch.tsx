import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EquipmentCategory } from '../../types';
import { EquipmentCard } from './EquipmentCard';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Sparkles,
  Tractor,
  Wheat,
  RotateCw,
  Droplets,
  Sprout,
  MapPin,
  Navigation,
  Check
} from 'lucide-react';
import { PRESET_FARMER_LOCATIONS } from '../../utils/locationUtils';

const CATEGORIES: { id: EquipmentCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'all', label: 'All Equipment', icon: Tractor },
  { id: 'tractors', label: 'Tractors', icon: Tractor },
  { id: 'harvesters', label: 'Harvesters', icon: Wheat },
  { id: 'tillers', label: 'Tillers & Plows', icon: RotateCw },
  { id: 'sprayers', label: 'Sprayers & Drones', icon: Droplets },
  { id: 'seeders', label: 'Seed Drills', icon: Sprout },
];

export const EquipmentSearch: React.FC = () => {
  const { 
    equipmentList, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery,
    farmerLocation,
    setFarmerLocation,
    getDistanceToFarmer
  } = useApp();

  const [sortBy, setSortBy] = useState<'distance' | 'price_low' | 'price_high' | 'rating'>('distance');
  const [onlyOperator, setOnlyOperator] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [customLocationInput, setCustomLocationInput] = useState('');

  // Filtered and sorted equipment with dynamic distance calculation
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter(eq => {
      // Category filter
      if (activeCategory !== 'all' && eq.category !== activeCategory) {
        return false;
      }

      // Search query (name, brand, model, village, district, state)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = eq.name.toLowerCase().includes(q);
        const matchBrand = eq.brand.toLowerCase().includes(q);
        const matchModel = eq.model.toLowerCase().includes(q);
        const matchLoc = (
          eq.location.village + ' ' + 
          eq.location.district + ' ' + 
          eq.location.state
        ).toLowerCase().includes(q);
        
        if (!matchName && !matchBrand && !matchModel && !matchLoc) {
          return false;
        }
      }

      // Operator filter
      if (onlyOperator && !eq.operatorAvailable) {
        return false;
      }

      // Availability filter
      if (onlyAvailable && eq.status !== 'available') {
        return false;
      }

      // Distance filter calculated from farmer's location
      const distance = getDistanceToFarmer(eq);
      if (maxDistance < 100 && distance > maxDistance) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const distA = getDistanceToFarmer(a);
      const distB = getDistanceToFarmer(b);

      if (sortBy === 'distance') {
        return distA - distB;
      }
      if (sortBy === 'price_low') {
        return a.ratePerDay - b.ratePerDay;
      }
      if (sortBy === 'price_high') {
        return b.ratePerDay - a.ratePerDay;
      }
      if (sortBy === 'rating') {
        return b.ownerRating - a.ownerRating;
      }
      return 0;
    });
  }, [equipmentList, activeCategory, searchQuery, onlyOperator, onlyAvailable, maxDistance, sortBy, farmerLocation, getDistanceToFarmer]);

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setOnlyOperator(false);
    setOnlyAvailable(false);
    setMaxDistance(50);
    setSortBy('distance');
  };

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocationInput.trim()) {
      setFarmerLocation(customLocationInput.trim());
      setCustomLocationInput('');
      setShowLocationPicker(false);
    }
  };

  const hasActiveFilters = 
    activeCategory !== 'all' || 
    searchQuery.trim() !== '' || 
    onlyOperator || 
    onlyAvailable || 
    maxDistance < 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Browse Farm Machinery for Rent
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Rent high-power tractors, combine harvesters, tillers, and precision sprayers sorted by proximity to your field.
          </p>
        </div>

        {/* Farmer Location Capsule in Header */}
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-xl p-3 flex items-center gap-3 shrink-0 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4 text-emerald-100" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider block">
              Your Farm Location:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900">{farmerLocation}</span>
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2 cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Location Filter & Selector Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-sm space-y-4">
        
        {/* Location Selector Expansion */}
        <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200/80 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <Navigation className="w-4 h-4 text-emerald-700" />
              <span>Select or Enter Your Farming Location:</span>
            </div>
            <span className="text-[11px] text-stone-500">
              Distances & route estimates calculate automatically
            </span>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {PRESET_FARMER_LOCATIONS.map(loc => {
              const isSelected = farmerLocation.toLowerCase().includes(loc.district.toLowerCase());
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setFarmerLocation(loc.name)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-2xs font-semibold'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`} />
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Village/City entry form */}
          <form onSubmit={handleCustomLocationSubmit} className="flex gap-2 pt-1">
            <div className="relative flex-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customLocationInput}
                onChange={(e) => setCustomLocationInput(e.target.value)}
                placeholder="Or enter any custom village, tehsil, or district (e.g. Rampur, Ludhiana)..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Set Location
            </button>
          </form>
        </div>

        {/* Search Input and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by equipment, brand (John Deere, Mahindra), or village..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 cursor-pointer"
            >
              <option value="distance">📍 Sort: Nearest First ({farmerLocation.split(',')[0]})</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated Owners</option>
            </select>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Interactive Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Quick Secondary Filters */}
        <div className="hidden sm:flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOperator}
                onChange={(e) => setOnlyOperator(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span>Includes Tractor Driver / Operator</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span>Available Immediately</span>
            </label>

            {/* Radius Filter */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-stone-700">Radius:</span>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-24 accent-emerald-700 cursor-pointer"
              />
              <span className="font-mono tabular-nums text-stone-800 font-semibold">
                {maxDistance >= 100 ? 'Any distance' : `Within ${maxDistance} km`}
              </span>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Mobile Expanded Filters */}
        {showFiltersMobile && (
          <div className="sm:hidden pt-3 border-t border-stone-100 space-y-3 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyOperator}
                onChange={(e) => setOnlyOperator(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300"
              />
              <span>With Tractor Driver / Operator</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300"
              />
              <span>Available Immediately</span>
            </label>

            <div className="flex items-center justify-between">
              <span>Within distance:</span>
              <span className="font-mono tabular-nums font-semibold">
                {maxDistance >= 100 ? 'Any distance' : `${maxDistance} km`}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-emerald-700"
            />

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full py-1.5 bg-stone-100 text-stone-700 rounded text-center font-medium"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Header: Clean unboxed metadata with location context */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-stone-600 flex items-center gap-1.5">
          <span>Found <strong className="text-stone-900 font-bold">{filteredEquipment.length}</strong> machines available</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>Near <strong className="text-emerald-800 font-semibold">{farmerLocation}</strong></span>
          {sortBy === 'distance' && (
            <span className="hidden sm:inline-block text-[11px] text-stone-500 font-medium">
              (sorted closest first)
            </span>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map(equipment => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
          <MapPin className="w-12 h-12 text-stone-400 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-stone-800 mb-1">No equipment found within range</h3>
          <p className="text-xs text-stone-500 mb-5">
            There are no listings within {maxDistance} km of &quot;{farmerLocation}&quot;. Try expanding your distance radius slider or choosing another location hub above.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setMaxDistance(100)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Expand to Any Distance
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
