import React from 'react';
import { useApp } from '../../context/AppContext';
import { Tractor, ShieldCheck, MapPin, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setRole, setFarmerView, setOwnerView } = useApp();

  return (
    <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded bg-emerald-600 flex items-center justify-center text-white">
                <Tractor className="w-4 h-4" />
              </div>
              <span>AgriRide</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Empowering farming communities through accessible, reliable equipment sharing. Rent top-grade machinery or monetize idle farm assets.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified local machinery owners</span>
            </div>
          </div>

          {/* Farmer Portal Links */}
          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">
              For Farmers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setRole('farmer'); setFarmerView('search'); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Browse Tractors & Harvesters
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setRole('farmer'); setFarmerView('search'); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Sprayer Drones & Implements
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setRole('farmer'); setFarmerView('my_bookings'); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Active Bookings
                </button>
              </li>
              <li>
                <span className="text-stone-500">Standardized Farm Lease Terms</span>
              </li>
            </ul>
          </div>

          {/* Equipment Owner Links */}
          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">
              For Equipment Owners
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setRole('owner'); setOwnerView('add_equipment'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  List Idle Machinery
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setRole('owner'); setOwnerView('my_equipment'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Manage Machinery Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setRole('owner'); setOwnerView('booking_requests'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Review Incoming Bookings
                </button>
              </li>
              <li>
                <span className="text-stone-500">Owner Damage Protection Policy</span>
              </li>
            </ul>
          </div>

          {/* Local Support & Helpline */}
          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">
              AgriRide Rural Helpdesk
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1800-889-AGRI (Toll Free, 6 AM - 9 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
                <span>Active in 14 Agricultural Hubs</span>
              </div>
              <p className="text-stone-500 pt-2 text-[11px]">
                Support in Hindi, Punjabi, Telugu, Marathi, Kannada & English.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} AgriRide Equipment Sharing Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Fair Rental Rates</span>
            <span aria-hidden="true">·</span>
            <span>Security Deposit Escrow</span>
            <span aria-hidden="true">·</span>
            <span>Zero Advance Commissions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
