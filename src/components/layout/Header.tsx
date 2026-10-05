import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  X, 
  Tractor, 
  Wheat, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ShieldCheck 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    farmerView, 
    setFarmerView, 
    ownerView, 
    setOwnerView,
    bookings,
    userProfile,
    firebaseUser,
    openAuthModal,
    signOutUser
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingRequestsCount = bookings.filter(b => b.status === 'pending').length;
  const activeFarmerBookingsCount = bookings.filter(b => b.status === 'approved' || b.status === 'in_progress' || b.status === 'pending').length;

  const handleRoleChange = (newRole: 'farmer' | 'owner') => {
    setRole(newRole);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (role === 'farmer') setFarmerView('dashboard');
                else setOwnerView('dashboard');
              }}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-stone-950 font-black shadow-sm">
                <Tractor className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight">AgriRide</span>
            </button>

            {/* Role indicator label */}
            <span className="hidden sm:inline-block text-xs font-medium text-stone-400 border-l border-stone-700 pl-3">
              {role === 'farmer' ? 'Farmer Rental Network' : 'Machinery Owner Portal'}
            </span>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-300">
            {role === 'farmer' ? (
              <>
                <button
                  onClick={() => setFarmerView('dashboard')}
                  className={`transition-colors hover:text-white py-1 cursor-pointer ${
                    farmerView === 'dashboard' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setFarmerView('search')}
                  className={`transition-colors hover:text-white py-1 cursor-pointer ${
                    farmerView === 'search' || farmerView === 'details' || farmerView === 'booking' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
                  }`}
                >
                  Browse Equipment
                </button>
                <button
                  onClick={() => setFarmerView('my_bookings')}
                  className={`flex items-center gap-1.5 transition-colors hover:text-white py-1 cursor-pointer ${
                    farmerView === 'my_bookings' || farmerView === 'confirmation' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
                  }`}
                >
                  <span>My Bookings</span>
                  {activeFarmerBookingsCount > 0 && (
                    <span className="text-[11px] font-mono px-1.5 py-0.2 bg-emerald-900/80 text-emerald-300 rounded border border-emerald-700/50">
                      {activeFarmerBookingsCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setOwnerView('dashboard')}
                  className={`transition-colors hover:text-white py-1 cursor-pointer ${
                    ownerView === 'dashboard' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
                  }`}
                >
                  Owner Overview
                </button>
                <button
                  onClick={() => setOwnerView('my_equipment')}
                  className={`transition-colors hover:text-white py-1 cursor-pointer ${
                    ownerView === 'my_equipment' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
                  }`}
                >
                  My Equipment
                </button>
                <button
                  onClick={() => setOwnerView('booking_requests')}
                  className={`flex items-center gap-1.5 transition-colors hover:text-white py-1 cursor-pointer ${
                    ownerView === 'booking_requests' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : ''
                  }`}
                >
                  <span>Booking Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span className="text-[11px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-600/40">
                      {pendingRequestsCount} new
                    </span>
                  )}
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Role Switcher, Auth User & Primary Action */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Interactive Role Switcher Toggle */}
            <div className="flex items-center bg-stone-800 p-1 rounded-lg border border-stone-700/70 text-xs">
              <button
                type="button"
                onClick={() => handleRoleChange('farmer')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  role === 'farmer'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Switch to Farmer mode"
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('owner')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  role === 'owner'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Switch to Equipment Owner mode"
              >
                <span>Owner</span>
                {pendingRequestsCount > 0 && role === 'farmer' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                )}
              </button>
            </div>

            {/* Firebase Auth Account pill / Sign In */}
            {userProfile || firebaseUser ? (
              <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-stone-800">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 font-bold">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <span className="text-stone-200 font-bold block leading-none truncate max-w-[110px]">
                      {userProfile?.displayName || firebaseUser?.displayName || 'User'}
                    </span>
                    <span className="text-[10px] text-stone-400 capitalize">
                      {userProfile?.role === 'farmer' ? 'Farmer' : 'Equipment Owner'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={signOutUser}
                  className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition-colors"
                  title="Sign out of Firebase"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 pl-1 border-l border-stone-800">
                <button
                  type="button"
                  onClick={() => openAuthModal('login', role)}
                  className="px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register', role)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Quick Action Button */}
            {role === 'farmer' ? (
              <button
                onClick={() => setFarmerView('search')}
                className="hidden md:inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-stone-900 bg-stone-200 hover:bg-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Rent Machinery
              </button>
            ) : (
              <button
                onClick={() => setOwnerView('add_equipment')}
                className="hidden md:inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                + List Machine
              </button>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-900 px-4 pt-3 pb-5 space-y-3">
          
          {/* Mobile Auth Status */}
          <div className="p-3 bg-stone-800 rounded-xl flex items-center justify-between">
            {userProfile || firebaseUser ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-white font-bold text-xs">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'U'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-200 block leading-tight">
                      {userProfile?.displayName || firebaseUser?.displayName || 'User'}
                    </span>
                    <span className="text-[11px] text-stone-400 capitalize">
                      Role: {userProfile?.role || role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { signOutUser(); setMobileMenuOpen(false); }}
                  className="px-2.5 py-1 text-xs text-rose-300 hover:bg-stone-700 rounded transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="w-full flex items-center justify-between gap-2">
                <span className="text-xs text-stone-400">Join AgriRide:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { openAuthModal('login', role); setMobileMenuOpen(false); }}
                    className="px-3 py-1 bg-stone-700 text-stone-200 text-xs font-medium rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { openAuthModal('register', role); setMobileMenuOpen(false); }}
                    className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-stone-400 pb-1">
            Current mode: <strong className="text-stone-200 uppercase">{role}</strong>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {role === 'farmer' ? (
              <>
                <button
                  onClick={() => { setFarmerView('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    farmerView === 'dashboard' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  Farmer Dashboard
                </button>
                <button
                  onClick={() => { setFarmerView('search'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    farmerView === 'search' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  Browse Equipment
                </button>
                <button
                  onClick={() => { setFarmerView('my_bookings'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                    farmerView === 'my_bookings' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span>My Bookings</span>
                  {activeFarmerBookingsCount > 0 && (
                    <span className="text-xs font-mono bg-stone-700 px-2 py-0.5 rounded text-emerald-300">
                      {activeFarmerBookingsCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setOwnerView('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    ownerView === 'dashboard' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  Owner Dashboard
                </button>
                <button
                  onClick={() => { setOwnerView('my_equipment'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    ownerView === 'my_equipment' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  My Equipment
                </button>
                <button
                  onClick={() => { setOwnerView('booking_requests'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                    ownerView === 'booking_requests' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span>Booking Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-600/40">
                      {pendingRequestsCount} new
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setOwnerView('add_equipment'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium text-amber-400 hover:bg-stone-800`}
                >
                  + Add New Equipment
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
