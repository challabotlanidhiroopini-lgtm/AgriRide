import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Tractor, 
  IndianRupee, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  ArrowRight, 
  Users, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Phone
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const { 
    equipmentList, 
    bookings, 
    updateBookingStatus, 
    setOwnerView, 
    updateEquipmentStatus,
    userProfile 
  } = useApp();

  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const approvedBookings = bookings.filter(b => b.status === 'approved' || b.status === 'in_progress');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  // Calculate total earnings from completed and active bookings
  const totalEarnings = [...approvedBookings, ...completedBookings].reduce(
    (acc, b) => acc + (b.totalAmount - b.securityDeposit), // earnings without refundable deposit
    0
  );

  const availableEquipmentCount = equipmentList.filter(e => e.status === 'available').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome & Quick Actions */}
      <div className="bg-stone-900 rounded-2xl text-white p-6 sm:p-8 border border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-md border border-amber-600/30 mb-2">
            <span>Machinery Owner Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {userProfile?.displayName ? `${userProfile.displayName}'s Machinery Fleet` : "Harpreet Brar's Machinery Fleet"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            Manage your agricultural implements, review incoming farmer booking requests, and track seasonal machinery rental income.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOwnerView('add_equipment')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>List New Machinery</span>
          </button>
          <button
            onClick={() => setOwnerView('booking_requests')}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-lg text-xs transition-colors whitespace-nowrap border border-stone-700"
          >
            View All Requests ({pendingRequests.length})
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs">
            <span>Total Rental Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-stone-900">
            ₹{totalEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Net machinery earnings</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs">
            <span>Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-amber-600">
            {pendingRequests.length}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Awaiting your approval</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs">
            <span>Listed Equipment</span>
            <Tractor className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-stone-900">
            {equipmentList.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {availableEquipmentCount} available now
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs">
            <span>Completed Rentals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-stone-900">
            {completedBookings.length}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">100% positive feedback</span>
        </div>
      </div>

      {/* Urgent Pending Requests Section */}
      <section className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Action Required: Incoming Booking Requests
            </h2>
            {pendingRequests.length > 0 && (
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                {pendingRequests.length} pending
              </span>
            )}
          </div>
          <button
            onClick={() => setOwnerView('booking_requests')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={req.equipmentImage}
                    alt={req.equipmentName}
                    className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-stone-900">{req.id}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-amber-800 font-semibold">{req.duration} {req.rentalType}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-stone-500">{req.startDate}</span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900">{req.equipmentName}</h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-stone-600 mt-1">
                      <span>Farmer: <strong>{req.farmerName}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{req.farmerVillage}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{req.fieldSizeAcres} Acres ({req.cropType})</span>
                    </div>
                  </div>
                </div>

                {/* Earnings & Approve/Reject Buttons */}
                <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-amber-200/60">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] text-stone-500 block">Total Booking</span>
                    <span className="text-base font-bold font-mono text-stone-900 tabular-nums">
                      ₹{req.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateBookingStatus(req.id, 'rejected')}
                      className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => updateBookingStatus(req.id, 'approved')}
                      className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-stone-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-stone-700">All booking requests are up to date!</p>
            <p className="text-stone-400 mt-0.5">New requests from nearby farmers will appear here immediately.</p>
          </div>
        )}
      </section>

      {/* Machinery Fleet Quick Overview */}
      <section className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Your Listed Machinery Fleet
            </h2>
            <p className="text-xs text-stone-500">Quickly toggle availability status or adjust pricing</p>
          </div>
          <button
            onClick={() => setOwnerView('my_equipment')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Manage All Equipment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentList.slice(0, 3).map(eq => (
            <div
              key={eq.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <img
                  src={eq.imageUrl}
                  alt={eq.name}
                  className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-stone-500 uppercase font-semibold">
                    {eq.brand} · {eq.horsepower} HP
                  </div>
                  <h3 className="font-bold text-stone-900 truncate text-sm">{eq.name}</h3>
                  <div className="text-stone-600 font-mono mt-0.5">
                    ₹{eq.ratePerDay}/day · ₹{eq.ratePerHour}/hr
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/70">
                <span className="text-stone-500 text-[11px]">Availability Status:</span>
                <select
                  value={eq.status}
                  onChange={(e) => updateEquipmentStatus(eq.id, e.target.value as any)}
                  className={`text-xs font-semibold px-2 py-1 rounded border cursor-pointer ${
                    eq.status === 'available'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : eq.status === 'booked'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-stone-100 text-stone-700 border-stone-300'
                  }`}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked / In Field</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
