export type EquipmentCategory = 
  | 'all'
  | 'tractors'
  | 'harvesters'
  | 'tillers'
  | 'sprayers'
  | 'seeders'
  | 'balers';

export interface Equipment {
  id: string;
  name: string;
  category: Exclude<EquipmentCategory, 'all'>;
  brand: string;
  model: string;
  year: number;
  horsepower: number; // HP
  fuelType: 'Diesel' | 'Electric' | 'Battery-Operated' | 'Tractor-Driven (PTO)' | 'Manual (Hand-Operated)';
  ratePerHour: number;
  ratePerDay: number;
  securityDeposit: number;
  location: {
    village: string;
    district: string;
    state: string;
    distanceKm: number;
    lat?: number;
    lng?: number;
  };
  operatorAvailable: boolean;
  operatorRatePerDay: number;
  deliveryAvailable: boolean;
  deliveryRadiusKm: number;
  deliveryRatePerKm: number;
  condition: 'Like New' | 'Excellent' | 'Good';
  description: string;
  keyFeatures: string[];
  implementsIncluded: string[];
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerRating: number;
  totalRentals: number;
  status: 'available' | 'booked' | 'maintenance';
  minBookingHours: number;
}

export type BookingStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: Exclude<EquipmentCategory, 'all'>;
  equipmentImage: string;
  ownerName: string;
  ownerPhone: string;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  rentalType: 'days' | 'hours';
  duration: number; // e.g., 2 days or 8 hours
  needsOperator: boolean;
  deliveryOption: 'self_pickup' | 'delivery';
  fieldSizeAcres: number;
  cropType: string;
  basePrice: number;
  operatorFee: number;
  deliveryFee: number;
  securityDeposit: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

export type UserRole = 'farmer' | 'owner';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  createdAt: string;
}

export type FarmerView = 
  | 'dashboard' 
  | 'search' 
  | 'details' 
  | 'booking' 
  | 'confirmation' 
  | 'my_bookings';

export type OwnerView = 
  | 'dashboard' 
  | 'add_equipment' 
  | 'my_equipment' 
  | 'booking_requests';
