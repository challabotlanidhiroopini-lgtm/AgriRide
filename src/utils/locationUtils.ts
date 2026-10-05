import { Equipment } from '../types';

export interface LocationPreset {
  id: string;
  name: string;
  village: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

export const PRESET_FARMER_LOCATIONS: LocationPreset[] = [
  {
    id: 'loc-sangrur',
    name: 'Sangrur, Punjab',
    village: 'Sultanpur Khurd',
    district: 'Sangrur',
    state: 'Punjab',
    lat: 30.2458,
    lng: 75.8421,
  },
  {
    id: 'loc-warangal',
    name: 'Warangal, Telangana',
    village: 'Gundlapally',
    district: 'Warangal',
    state: 'Telangana',
    lat: 17.9784,
    lng: 79.5941,
  },
  {
    id: 'loc-nashik',
    name: 'Nashik, Maharashtra',
    village: 'Dindori',
    district: 'Nashik',
    state: 'Maharashtra',
    lat: 20.2033,
    lng: 73.8344,
  },
  {
    id: 'loc-karnal',
    name: 'Karnal, Haryana',
    village: 'Nilokheri',
    district: 'Karnal',
    state: 'Haryana',
    lat: 29.8315,
    lng: 76.9208,
  },
  {
    id: 'loc-guntur',
    name: 'Guntur, Andhra Pradesh',
    village: 'Chebrolu',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    lat: 16.2008,
    lng: 80.5312,
  },
  {
    id: 'loc-mandya',
    name: 'Mandya, Karnataka',
    village: 'Maddur',
    district: 'Mandya',
    state: 'Karnataka',
    lat: 12.5844,
    lng: 77.0450,
  },
];

// Equipment base coordinates
export const EQUIPMENT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'eq-1': { lat: 30.2650, lng: 75.8620 }, // Rampur Kalan, Sangrur
  'eq-2': { lat: 16.1950, lng: 80.5280 }, // Chebrolu, Guntur
  'eq-3': { lat: 20.2100, lng: 73.8390 }, // Dindori, Nashik
  'eq-4': { lat: 17.9850, lng: 79.6020 }, // Gundlapally, Warangal
  'eq-5': { lat: 29.8400, lng: 76.9300 }, // Nilokheri, Karnal
  'eq-6': { lat: 12.5900, lng: 77.0500 }, // Maddur, Mandya
  'eq-7': { lat: 17.9820, lng: 79.5980 }, // Gundlapally, Warangal
};

/**
 * Calculates geographical distance using the Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Resolves a farmer location string to approximate coordinates
 */
export function resolveLocationDetails(locationStr: string): {
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
} {
  const normalized = locationStr.toLowerCase().trim();

  // Check preset matches
  const match = PRESET_FARMER_LOCATIONS.find(
    p =>
      normalized.includes(p.district.toLowerCase()) ||
      normalized.includes(p.village.toLowerCase()) ||
      p.name.toLowerCase().includes(normalized)
  );

  if (match) {
    return {
      name: match.name,
      district: match.district,
      state: match.state,
      lat: match.lat,
      lng: match.lng,
    };
  }

  // Fallback for custom location: deterministic coordinates based on string hash
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = ((Math.abs(hash) % 1000) / 1000) * 0.15;
  const offsetLng = (((Math.abs(hash) >> 3) % 1000) / 1000) * 0.15;

  return {
    name: locationStr.trim(),
    district: locationStr.split(',')[0]?.trim() || locationStr.trim(),
    state: locationStr.split(',')[1]?.trim() || 'Nearby',
    lat: 30.2458 + offsetLat,
    lng: 75.8421 + offsetLng,
  };
}

/**
 * Calculates realistic demo distance from equipment to selected farmer location
 */
export function getEquipmentDistanceKm(equipment: Equipment, farmerLocationStr: string): number {
  if (!farmerLocationStr) {
    return equipment.location.distanceKm || 4.2;
  }

  const farmerLoc = resolveLocationDetails(farmerLocationStr);
  const eqLoc = equipment.location;

  // Retrieve or compute equipment coordinates
  const eqCoords = EQUIPMENT_COORDINATES[equipment.id] || {
    lat: eqLoc.lat || 30.2650,
    lng: eqLoc.lng || 75.8620,
  };

  // If in the exact same village: very close (1.8 to 4.5 km)
  if (
    farmerLoc.district.toLowerCase() === eqLoc.district.toLowerCase() &&
    (farmerLocationStr.toLowerCase().includes(eqLoc.village.toLowerCase()) ||
     eqLoc.village.toLowerCase().includes(farmerLoc.district.toLowerCase()))
  ) {
    return Math.min(equipment.location.distanceKm || 3.2, 4.5);
  }

  // If in the same district: 3.5 to 14.5 km
  if (farmerLoc.district.toLowerCase() === eqLoc.district.toLowerCase()) {
    return equipment.location.distanceKm || 5.8;
  }

  // If in the same state: 28 to 65 km
  if (
    farmerLoc.state.toLowerCase() === eqLoc.state.toLowerCase() ||
    farmerLocationStr.toLowerCase().includes(eqLoc.state.toLowerCase())
  ) {
    const rawDist = calculateHaversineDistanceKm(farmerLoc.lat, farmerLoc.lng, eqCoords.lat, eqCoords.lng);
    return Math.max(18.5, Math.min(rawDist, 68.0));
  }

  // Inter-state / realistic demo distance
  const geoDist = calculateHaversineDistanceKm(farmerLoc.lat, farmerLoc.lng, eqCoords.lat, eqCoords.lng);
  return Math.round(geoDist * 10) / 10;
}
