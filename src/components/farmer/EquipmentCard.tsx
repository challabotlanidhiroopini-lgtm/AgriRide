import React, { useState } from 'react';
import { Equipment } from '../../types';
import { useApp } from '../../context/AppContext';
import { MapPin, Star, UserCheck, ShieldCheck, Wrench, ArrowRight, Gauge, Truck } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  const { goToDetails, goToBooking, getDistanceToFarmer, farmerLocation } = useApp();
  const [imageError, setImageError] = useState(false);

  const isAvailable = equipment.status === 'available';
  const distanceKm = getDistanceToFarmer(equipment);
  const isNearby = distanceKm <= 10;
  const isDelivered = equipment.deliveryAvailable && distanceKm <= equipment.deliveryRadiusKm;

  return (
    <article className="group bg-white rounded-xl border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Visual Image Container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={equipment.imageUrl}
            alt={equipment.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200/80 p-4 text-stone-500">
            <Wrench className="w-10 h-10 mb-2 text-stone-400 stroke-[1.5]" />
            <span className="text-xs font-semibold text-stone-600">{equipment.brand}</span>
            <span className="text-[11px] text-stone-500">{equipment.model}</span>
          </div>
        )}

        {/* Status indicator on image */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-md shadow-sm ${
              isAvailable
                ? 'bg-emerald-800/90 text-white backdrop-blur-xs'
                : 'bg-stone-800/90 text-stone-200 backdrop-blur-xs'
            }`}
          >
            {isAvailable ? 'Available Now' : equipment.status === 'booked' ? 'Currently Rented' : 'In Service'}
          </span>
          {isNearby && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-stone-950 shadow-xs">
              ⚡ Nearby Host
            </span>
          )}
        </div>

        {/* Distance marker calculated from farmer's location */}
        <div className="absolute bottom-3 right-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-stone-700/60">
          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="font-semibold font-mono">{distanceKm} km</span>
          <span className="text-stone-300 text-[10px]">away</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Category & Brand unboxed text */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
          <span className="uppercase tracking-wider font-semibold text-stone-600">
            {equipment.brand}
          </span>
          <span aria-hidden="true">·</span>
          <span>{equipment.category.toUpperCase()}</span>
          <span aria-hidden="true">·</span>
          <span>Model {equipment.year}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-stone-900 tracking-tight leading-snug mb-2 group-hover:text-emerald-800 transition-colors line-clamp-1">
          {equipment.name}
        </h3>

        {/* Location & Distance Bar */}
        <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-semibold text-stone-800 truncate">
              {equipment.location.village}, {equipment.location.district}
            </span>
            <span className="text-stone-400 text-[11px] shrink-0">({equipment.location.state})</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 font-mono shrink-0 pl-2">
            {distanceKm} km
          </span>
        </div>

        {/* Quick Specs metadata with dot separators */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-stone-600 mb-3.5 pb-3 border-b border-stone-100">
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-stone-400" />
            <strong className="font-semibold text-stone-800">{equipment.horsepower} HP</strong>
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{equipment.fuelType}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>
            {equipment.operatorAvailable ? (
              <span className="text-emerald-700 font-medium">Operator Available</span>
            ) : (
              <span className="text-stone-500">Self Drive</span>
            )}
          </span>
        </div>

        {/* Delivery capability & Owner rating */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
          <div className="flex items-center gap-1 text-[11px]">
            <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className={isDelivered ? 'text-emerald-800 font-medium' : 'text-stone-500'}>
              {equipment.deliveryAvailable 
                ? `Delivery up to ${equipment.deliveryRadiusKm} km`
                : 'Self-pickup at depot'}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-stone-800">{equipment.ownerRating}</span>
            <span className="text-stone-400">({equipment.totalRentals})</span>
          </div>
        </div>

        {/* Pricing & Actions baseline */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                ₹{equipment.ratePerDay.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500">/ day</span>
            </div>
            <div className="text-[11px] text-stone-500 font-mono tabular-nums">
              or ₹{equipment.ratePerHour}/hr
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToDetails(equipment)}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => goToBooking(equipment)}
              disabled={!isAvailable}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                isAvailable
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-200 text-stone-500 cursor-not-allowed'
              }`}
            >
              <span>Book</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
