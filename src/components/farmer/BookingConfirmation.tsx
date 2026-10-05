import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  Truck, 
  ShieldCheck, 
  Printer, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const BookingConfirmation: React.FC = () => {
  const { 
    lastConfirmedBooking, 
    setFarmerView, 
    setRole, 
    setOwnerView 
  } = useApp();

  if (!lastConfirmedBooking) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-stone-600 mb-4">No recent booking found.</p>
        <button
          onClick={() => setFarmerView('dashboard')}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const b = lastConfirmedBooking;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8 text-center mb-6">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
          Booking ID: {b.id}
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-3 mb-2">
          Booking Request Received!
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          We have forwarded your booking request to the machinery owner <strong className="text-stone-900 font-semibold">{b.ownerName}</strong>. You will receive an SMS update once accepted.
        </p>

        {/* Demo fast-track banner to test Owner flow */}
        <div className="mt-6 p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div>
            <span className="font-bold">Want to test the Equipment Owner side?</span>
            <p className="text-amber-800 text-[11px] mt-0.5">
              Switch to Owner Portal to review and approve this booking request ({b.id}).
            </p>
          </div>
          <button
            onClick={() => {
              setRole('owner');
              setOwnerView('booking_requests');
            }}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1"
          >
            <span>Open Owner Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Booking Details & Itemized Summary */}
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-6 mb-6 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Rental Summary
            </h2>
            <div className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(b.createdAt).toLocaleDateString()} at {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-800">
            Pending Owner Approval
          </span>
        </div>

        {/* Equipment & Owner Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-stone-50 rounded-lg space-y-1.5">
            <span className="text-stone-500 font-medium">Reserved Machinery:</span>
            <div className="font-bold text-stone-900 text-sm">{b.equipmentName}</div>
            <div className="text-stone-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>
                {b.startDate} {b.startDate !== b.endDate ? `to ${b.endDate}` : ''} ({b.duration} {b.rentalType})
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-lg space-y-1.5">
            <span className="text-stone-500 font-medium">Equipment Owner:</span>
            <div className="font-bold text-stone-900 text-sm">{b.ownerName}</div>
            <div className="text-stone-600 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>{b.ownerPhone}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Field Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 border-t border-stone-100 pt-4">
          <div>
            <span className="text-stone-500 block mb-0.5">Delivery Mode:</span>
            <strong className="text-stone-900">
              {b.deliveryOption === 'delivery' ? 'Field Doorstep Delivery' : 'Self-Pickup by Farmer'}
            </strong>
          </div>
          <div>
            <span className="text-stone-500 block mb-0.5">Driver / Operator:</span>
            <strong className="text-stone-900">
              {b.needsOperator ? 'Provided by Owner' : 'Farmer Self-Operate'}
            </strong>
          </div>
          <div>
            <span className="text-stone-500 block mb-0.5">Field / Operation:</span>
            <strong className="text-stone-900">
              {b.fieldSizeAcres} Acres · {b.cropType}
            </strong>
          </div>
        </div>

        {/* Itemized Price Breakdown */}
        <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Machinery Base Rent ({b.duration} {b.rentalType}):</span>
            <span className="font-mono tabular-nums font-semibold text-stone-900">₹{b.basePrice.toLocaleString()}</span>
          </div>

          {b.operatorFee > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Driver / Operator Assistance:</span>
              <span className="font-mono tabular-nums font-semibold text-stone-900">₹{b.operatorFee.toLocaleString()}</span>
            </div>
          )}

          {b.deliveryFee > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Round-trip Machinery Transport:</span>
              <span className="font-mono tabular-nums font-semibold text-stone-900">₹{b.deliveryFee.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-stone-600">
            <span>Security Deposit (Refundable upon machine return):</span>
            <span className="font-mono tabular-nums font-semibold text-stone-900">₹{b.securityDeposit.toLocaleString()}</span>
          </div>

          <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline text-sm font-bold">
            <span>Total Payable upon Arrival:</span>
            <span className="text-xl font-mono text-emerald-800 tabular-nums">₹{b.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Next Steps for Farmer */}
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-6 mb-6">
        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4">
          What Happens Next?
        </h3>
        <ol className="space-y-3 text-xs text-stone-600">
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <strong className="text-stone-900">Owner Confirmation:</strong> The owner will review your dates and machine availability within 2 hours.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <strong className="text-stone-900">Delivery & Field Check:</strong> Inspect the tractor/implement alongside the owner or driver before work starts.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <strong className="text-stone-900">Return & Deposit Refund:</strong> Once the job is completed, the security deposit is promptly returned.
            </div>
          </li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => setFarmerView('my_bookings')}
          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
        >
          View in My Bookings
        </button>
        <button
          onClick={() => setFarmerView('search')}
          className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
        >
          Browse More Equipment
        </button>
      </div>

    </div>
  );
};
