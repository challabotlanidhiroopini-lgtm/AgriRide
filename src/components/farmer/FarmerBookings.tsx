import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  UserCheck, 
  ArrowRight, 
  Tractor,
  AlertCircle,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { BookingStatus } from '../../types';

export const FarmerBookings: React.FC = () => {
  const { bookings, updateBookingStatus, setFarmerView } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved by Owner</span>
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Owner Review</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded">
            <Tractor className="w-3.5 h-3.5" />
            <span>Active in Field</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-stone-100 text-stone-700 rounded">
            <span>Completed</span>
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-rose-100 text-rose-800 rounded">
            <XCircle className="w-3.5 h-3.5" />
            <span>{status === 'rejected' ? 'Declined by Owner' : 'Cancelled'}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            My Machinery Bookings
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track current rental status, contact equipment owners, and review booking summaries.
          </p>
        </div>

        <button
          onClick={() => setFarmerView('search')}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ Rent Another Machine</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg max-w-fit mb-6 text-xs overflow-x-auto">
        {['all', 'pending', 'approved', 'completed'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 font-medium rounded-md capitalize transition-all ${
              filterStatus === st
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {st === 'all' ? 'All Bookings' : st}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map(b => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-5 hover:border-stone-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex items-start gap-4">
                  <img
                    src={b.equipmentImage}
                    alt={b.equipmentName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
                      <span className="font-mono font-semibold uppercase text-stone-600">{b.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>Booked on {new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 leading-tight">
                      {b.equipmentName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-stone-600 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{b.startDate} {b.startDate !== b.endDate ? `to ${b.endDate}` : ''}</span>
                        <span className="text-stone-400">({b.duration} {b.rentalType})</span>
                      </div>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{b.farmerVillage}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
                  {getStatusBadge(b.status)}
                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">Total</span>
                    <span className="text-lg font-bold font-mono tabular-nums text-emerald-800">
                      ₹{b.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Owner and Actions bar */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-700">
                    {b.ownerName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Equipment Owner</span>
                    <strong className="text-stone-900">{b.ownerName}</strong>
                  </div>
                  <a
                    href={`tel:${b.ownerPhone}`}
                    className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{b.ownerPhone}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {b.status === 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className="px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded font-medium transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}
                  {b.status === 'approved' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'completed')}
                      className="px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors"
                    >
                      Mark Job Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto">
          <Tractor className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">No bookings found</h3>
          <p className="text-xs text-stone-500 mb-5">
            You don&apos;t have any equipment reservations under this status.
          </p>
          <button
            onClick={() => setFarmerView('search')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg"
          >
            Explore Available Equipment
          </button>
        </div>
      )}
    </div>
  );
};
