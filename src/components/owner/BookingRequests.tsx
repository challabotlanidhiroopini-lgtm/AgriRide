import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  User, 
  IndianRupee,
  AlertCircle
} from 'lucide-react';
import { BookingStatus } from '../../types';

export const BookingRequests: React.FC = () => {
  const { bookings, updateBookingStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredRequests = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded">
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded">
            Pending Approval
          </span>
        );
      case 'in_progress':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded">
            In Field
          </span>
        );
      case 'completed':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 text-stone-700 rounded">
            Completed
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 bg-rose-100 text-rose-800 rounded">
            {status === 'rejected' ? 'Declined' : 'Cancelled by Farmer'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Farmer Booking Requests
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review schedule requirements, field locations, and approve machinery rentals.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg max-w-fit mb-6 text-xs overflow-x-auto">
        {['all', 'pending', 'approved', 'completed', 'rejected'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 font-medium rounded-md capitalize transition-all ${
              filterStatus === st
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {st === 'all' ? 'All Requests' : st}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const ownerNetEarnings = req.totalAmount - req.securityDeposit;

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-5 space-y-4 hover:border-stone-300 transition-all"
              >
                {/* Header row: ID, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {req.id}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-stone-500">
                      Requested on {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {getStatusBadge(req.status)}
                </div>

                {/* Main Content Grid: Equipment info + Farmer info + Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  {/* Left 4 cols: Machine details */}
                  <div className="md:col-span-4 flex items-start gap-3">
                    <img
                      src={req.equipmentImage}
                      alt={req.equipmentName}
                      className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-500 uppercase font-semibold block">
                        Requested Machinery
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">
                        {req.equipmentName}
                      </h4>
                      <div className="text-stone-600 mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>
                          {req.startDate} ({req.duration} {req.rentalType})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle 4 cols: Farmer & Field Details */}
                  <div className="md:col-span-4 space-y-1.5 p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>{req.farmerName}</span>
                      </span>
                      <a
                        href={`tel:${req.farmerPhone}`}
                        className="text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{req.farmerPhone}</span>
                      </a>
                    </div>

                    <div className="text-stone-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{req.farmerVillage}</span>
                    </div>

                    <div className="text-stone-600 pt-1 border-t border-stone-200/60">
                      <span>Field: <strong>{req.fieldSizeAcres} Acres</strong> · {req.cropType}</span>
                    </div>

                    <div className="text-[11px] text-stone-500">
                      Mode: {req.deliveryOption === 'delivery' ? 'Field Doorstep Delivery' : 'Self-Pickup by Farmer'}
                      {req.needsOperator ? ' · Driver requested' : ' · Farmer self-operate'}
                    </div>

                    {req.notes && (
                      <div className="text-[11px] text-stone-600 italic bg-white p-1.5 rounded border border-stone-200/60">
                        &quot;{req.notes}&quot;
                      </div>
                    )}
                  </div>

                  {/* Right 4 cols: Financial Summary */}
                  <div className="md:col-span-4 p-3 bg-stone-50 rounded-lg flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between text-stone-500">
                        <span>Base Rental:</span>
                        <span className="font-mono text-stone-900">₹{req.basePrice.toLocaleString()}</span>
                      </div>
                      {req.operatorFee > 0 && (
                        <div className="flex justify-between text-stone-500">
                          <span>Operator Fee:</span>
                          <span className="font-mono text-stone-900">₹{req.operatorFee.toLocaleString()}</span>
                        </div>
                      )}
                      {req.deliveryFee > 0 && (
                        <div className="flex justify-between text-stone-500">
                          <span>Delivery Charge:</span>
                          <span className="font-mono text-stone-900">₹{req.deliveryFee.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-stone-500">
                        <span>Security Deposit (Escrow):</span>
                        <span className="font-mono text-stone-900">₹{req.securityDeposit.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline mt-2">
                      <span className="font-bold text-stone-900">Your Net Earnings:</span>
                      <span className="text-base font-extrabold font-mono text-emerald-800 tabular-nums">
                        ₹{ownerNetEarnings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons bar */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-stone-500">
                    {req.status === 'pending' && (
                      <span>Farmer is awaiting your availability confirmation.</span>
                    )}
                    {req.status === 'approved' && (
                      <span className="text-emerald-700 font-medium">
                        Booking approved. Prepare machinery for scheduled start on {req.startDate}.
                      </span>
                    )}
                    {req.status === 'completed' && (
                      <span className="text-stone-600">
                        Rental concluded. Security deposit cleared for return.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(req.id, 'rejected')}
                          className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold rounded-lg transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(req.id, 'approved')}
                          className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Booking</span>
                        </button>
                      </>
                    )}

                    {req.status === 'approved' && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(req.id, 'in_progress')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          Mark Dispatched / In Field
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(req.id, 'completed')}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-lg transition-colors"
                        >
                          Mark Job Completed
                        </button>
                      </>
                    )}

                    {req.status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => updateBookingStatus(req.id, 'completed')}
                        className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors"
                      >
                        Complete Rental & Return Deposit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto">
          <Clock className="w-12 h-12 text-stone-400 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-stone-800 mb-1">No requests found</h3>
          <p className="text-xs text-stone-500">
            There are currently no requests matching this status filter.
          </p>
        </div>
      )}
    </div>
  );
};
