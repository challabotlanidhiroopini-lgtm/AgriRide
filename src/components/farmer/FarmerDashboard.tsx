import React from 'react';
import { useApp } from '../../context/AppContext';
import { EquipmentCategory } from '../../types';
import { EquipmentCard } from './EquipmentCard';
import { 
  Tractor, 
  Wheat, 
  RotateCw, 
  Droplets, 
  Sprout, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Phone
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { 
    equipmentList, 
    bookings, 
    setFarmerView, 
    setActiveCategory, 
    goToDetails,
    setRole,
    setOwnerView,
    userProfile,
    openAuthModal,
    farmerLocation,
    getDistanceToFarmer
  } = useApp();

  const activeBookings = bookings.filter(
    b => b.status === 'approved' || b.status === 'pending' || b.status === 'in_progress'
  );

  const availableCount = equipmentList.filter(e => e.status === 'available').length;
  
  // Prioritize machines closest to farmer's selected location
  const nearbyFeatured = React.useMemo(() => {
    return [...equipmentList]
      .sort((a, b) => getDistanceToFarmer(a) - getDistanceToFarmer(b))
      .slice(0, 3);
  }, [equipmentList, getDistanceToFarmer]);

  const quickCategories: { id: EquipmentCategory; name: string; count: number; icon: React.FC<{ className?: string }> }[] = [
    { id: 'tractors', name: 'Tractors', count: equipmentList.filter(e => e.category === 'tractors').length, icon: Tractor },
    { id: 'harvesters', name: 'Harvesters', count: equipmentList.filter(e => e.category === 'harvesters').length, icon: Wheat },
    { id: 'tillers', name: 'Rotary Tillers', count: equipmentList.filter(e => e.category === 'tillers').length, icon: RotateCw },
    { id: 'sprayers', name: 'Sprayers & Drones', count: equipmentList.filter(e => e.category === 'sprayers').length, icon: Droplets },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-emerald-800/80 rounded-md border border-emerald-700/60 text-emerald-200">
              <Tractor className="w-3.5 h-3.5 text-emerald-300" />
              <span>{userProfile ? `Welcome, ${userProfile.displayName}` : 'Kharif & Rabi Season Machinery Sharing'}</span>
            </div>
            {!userProfile && (
              <button
                onClick={() => openAuthModal('login', 'farmer')}
                className="text-xs text-emerald-300 underline underline-offset-2 hover:text-white"
              >
                Sign in with Firebase
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Rent Reliable Agricultural Machinery Directly from Neighbors
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
            Avoid massive capital costs. Access verified 50+ HP tractors, combine harvesters, seeders, and smart drone sprayers on flexible hourly and daily rates.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFarmerView('search')}
              className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Browse All Machinery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setActiveCategory('tractors');
                setFarmerView('search');
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-xs backdrop-blur-xs transition-colors"
            >
              Find Tractors Near Me
            </button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-600/20 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-stone-800">
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Available Machines</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            {availableCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">Ready for immediate hire</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Your Active Bookings</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            {activeBookings.length}
          </div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">
            {activeBookings.filter(b => b.status === 'pending').length} pending approval
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Nearby Service Radius</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            40 km
          </div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Doorstep field delivery</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Trained Operators</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
            100%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">Verified local drivers</span>
        </div>
      </div>

      {/* Active Bookings Quick Section (if any) */}
      {activeBookings.length > 0 && (
        <section className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Your Recent Bookings
              </h2>
              <span className="text-xs text-stone-500">Track current status and schedule</span>
            </div>
            <button
              onClick={() => setFarmerView('my_bookings')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>View All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {activeBookings.map(b => (
              <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-stone-100 overflow-hidden shrink-0">
                    <img src={b.equipmentImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">{b.equipmentName}</div>
                    <div className="text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span>{b.startDate} ({b.duration} {b.rentalType})</span>
                      <span aria-hidden="true">·</span>
                      <span>Owner: {b.ownerName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-medium ${
                      b.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {b.status === 'approved' ? '✓ Approved by Owner' : 'Pending Approval'}
                  </span>
                  <button
                    onClick={() => setFarmerView('my_bookings')}
                    className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 rounded"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Explorer */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Machinery Categories
            </h2>
            <p className="text-xs text-stone-500">Pick the right implement for your seasonal crop cycle</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setFarmerView('search');
                }}
                className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs hover:border-emerald-600 hover:shadow-sm text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-0.5">{cat.name}</h3>
                <span className="text-xs text-stone-500">{cat.count} models available</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured / Nearby Equipment Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Featured Machines Near {farmerLocation.split(',')[0]}
            </h2>
            <p className="text-xs text-stone-500">Closest verified machinery hosts to your farm with driver & delivery</p>
          </div>
          <button
            onClick={() => setFarmerView('search')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>See All Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyFeatured.map(eq => (
            <EquipmentCard key={eq.id} equipment={eq} />
          ))}
        </div>
      </section>

      {/* Cross-role promo for farm owners */}
      <section className="bg-stone-100 rounded-xl p-6 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900">
            Do you own a tractor, combine, or rotavator sitting idle in your shed?
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Turn your unused farm machinery into monthly income by sharing it with fellow farmers in your tehsil.
          </p>
        </div>
        <button
          onClick={() => {
            setRole('owner');
            setOwnerView('add_equipment');
          }}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0"
        >
          Switch to Owner & List Machinery
        </button>
      </section>

    </div>
  );
};
