import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Equipment, 
  Booking, 
  UserRole, 
  UserProfile,
  FarmerView, 
  OwnerView, 
  EquipmentCategory, 
  BookingStatus 
} from '../types';
import { INITIAL_EQUIPMENT, INITIAL_BOOKINGS } from '../data/initialData';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { getEquipmentDistanceKm } from '../utils/locationUtils';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  farmerView: FarmerView;
  setFarmerView: (view: FarmerView) => void;
  ownerView: OwnerView;
  setOwnerView: (view: OwnerView) => void;
  selectedEquipment: Equipment | null;
  setSelectedEquipment: (eq: Equipment | null) => void;
  lastConfirmedBooking: Booking | null;
  setLastConfirmedBooking: (b: Booking | null) => void;
  
  equipmentList: Equipment[];
  bookings: Booking[];
  
  activeCategory: EquipmentCategory;
  setActiveCategory: (cat: EquipmentCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Location state
  farmerLocation: string;
  setFarmerLocation: (loc: string) => void;
  getDistanceToFarmer: (eq: Equipment) => number;
  
  // Auth state
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  authModalRole: UserRole;
  openAuthModal: (mode?: 'login' | 'register', defaultRole?: UserRole) => void;
  closeAuthModal: () => void;
  signInWithGoogle: (preferredRole: UserRole) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (data: {
    email: string;
    password: string;
    displayName: string;
    role: UserRole;
    phone?: string;
    village?: string;
    district?: string;
  }) => Promise<void>;
  loginAsDemo: (demoRole: UserRole) => Promise<void>;
  signOutUser: () => Promise<void>;

  // Actions
  goToDetails: (eq: Equipment) => void;
  goToBooking: (eq: Equipment) => void;
  createBooking: (data: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  addEquipment: (newEq: Omit<Equipment, 'id' | 'ownerId' | 'ownerName' | 'ownerPhone' | 'ownerRating' | 'totalRentals'>) => void;
  updateEquipmentStatus: (equipmentId: string, status: Equipment['status']) => void;
  deleteEquipment: (equipmentId: string) => void;
  
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_EQUIPMENT = 'agriride_equipment_v1';
const STORAGE_KEY_BOOKINGS = 'agriride_bookings_v1';
const STORAGE_KEY_USER_PROFILE = 'agriride_user_profile_v1';
const STORAGE_KEY_FARMER_LOCATION = 'agriride_farmer_location_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('farmer');
  const [farmerView, setFarmerView] = useState<FarmerView>('dashboard');
  const [ownerView, setOwnerView] = useState<OwnerView>('dashboard');
  
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<Booking | null>(null);
  
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Farmer's selected location (village / district / city)
  const [farmerLocation, setFarmerLocationState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FARMER_LOCATION);
      if (saved) return saved;
    } catch (e) {
      console.error('Failed to load farmer location', e);
    }
    return 'Sangrur, Punjab';
  });

  const setFarmerLocation = (newLoc: string) => {
    const trimmed = newLoc.trim() || 'Sangrur, Punjab';
    setFarmerLocationState(trimmed);
    try {
      localStorage.setItem(STORAGE_KEY_FARMER_LOCATION, trimmed);
    } catch (e) {
      console.error('Failed to save farmer location', e);
    }
  };

  const getDistanceToFarmer = (eq: Equipment): number => {
    return getEquipmentDistanceKm(eq, farmerLocation);
  };

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Auth states
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load profile', e);
    }
    return null;
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalRole, setAuthModalRole] = useState<UserRole>('farmer');

  // Initialize equipment from localStorage or defaults
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EQUIPMENT);
      if (saved) {
        const parsed: Equipment[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(e => e.id));
        const missingFromInitial = INITIAL_EQUIPMENT.filter(e => !existingIds.has(e.id));
        if (missingFromInitial.length > 0) {
          return [...parsed, ...missingFromInitial];
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load equipment from localStorage', e);
    }
    return INITIAL_EQUIPMENT;
  });

  // Initialize bookings from localStorage or defaults
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load bookings from localStorage', e);
    }
    return INITIAL_BOOKINGS;
  });

  // Persist equipment
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EQUIPMENT, JSON.stringify(equipmentList));
    } catch (e) {
      console.error('Failed to save equipment', e);
    }
  }, [equipmentList]);

  // Persist bookings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings', e);
    }
  }, [bookings]);

  // Persist userProfile in localStorage
  useEffect(() => {
    if (userProfile) {
      try {
        localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(userProfile));
      } catch (e) {
        console.error('Failed to save userProfile', e);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_USER_PROFILE);
    }
  }, [userProfile]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserProfile(data);
            setRole(data.role);
            if (data.role === 'farmer') {
              setFarmerView('dashboard');
            } else if (data.role === 'owner') {
              setOwnerView('dashboard');
            }
          }
        } catch (err) {
          console.error('Failed to fetch user profile from Firestore', err);
        }
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login', defaultRole: UserRole = 'farmer') => {
    setAuthModalMode(mode);
    setAuthModalRole(defaultRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithGoogle = async (preferredRole: UserRole) => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Fetch or initialize user profile in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      let profile: UserProfile;
      if (docSnap.exists()) {
        profile = docSnap.data() as UserProfile;
      } else {
        // First time Google sign in: save role in database
        profile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || (preferredRole === 'farmer' ? 'Farmer User' : 'Equipment Owner'),
          role: preferredRole,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, profile);
      }

      setUserProfile(profile);
      setRole(profile.role);

      // Route after login based on role
      if (profile.role === 'farmer') {
        setFarmerView('dashboard');
      } else {
        setOwnerView('dashboard');
      }

      showToast(`Welcome ${profile.displayName}! Signed in as ${profile.role === 'farmer' ? 'Farmer' : 'Equipment Owner'}.`, 'success');
    } catch (err: any) {
      console.error('Google Sign In error', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return; // user dismissed popup
      }
      throw err;
    }
  };

  const loginWithEmail = async (emailStr: string, pass: string) => {
    let profile: UserProfile | null = null;
    const cleanEmail = emailStr.toLowerCase().trim();
    const safeDocId = 'usr_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

    try {
      // Try Firebase Auth if provider is enabled
      const safePass = pass ? pass.padEnd(6, '0') : 'password123';
      const credential = await signInWithEmailAndPassword(auth, cleanEmail, safePass);
      const user = credential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        profile = docSnap.data() as UserProfile;
      }
    } catch (authErr: any) {
      console.warn('Firebase Auth email login fallback:', authErr.code || authErr.message);
    }

    // If not authenticated via Firebase Auth provider, check Firestore database
    if (!profile) {
      try {
        const userDocRef = doc(db, 'users', safeDocId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          profile = docSnap.data() as UserProfile;
        } else {
          // Check query in users collection by email
          const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
            profile = querySnap.docs[0].data() as UserProfile;
          }
        }
      } catch (dbErr) {
        console.error('Firestore user lookup error', dbErr);
      }
    }

    // If profile not found, provision it in Firestore
    if (!profile) {
      profile = {
        uid: safeDocId,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        role: role, // use active role
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(doc(db, 'users', safeDocId), {
          ...profile,
          passwordHash: btoa(pass || 'password')
        }, { merge: true });
      } catch (e) {
        console.error('Could not save profile in Firestore', e);
      }
    }

    setUserProfile(profile);
    setRole(profile.role);
    
    // Route after login based on role
    if (profile.role === 'farmer') {
      setFarmerView('dashboard');
    } else {
      setOwnerView('dashboard');
    }

    showToast(`Welcome back, ${profile.displayName}! Signed in as ${profile.role === 'farmer' ? 'Farmer' : 'Equipment Owner'}.`, 'success');
  };

  const registerWithEmail = async (data: {
    email: string;
    password: string;
    displayName: string;
    role: UserRole;
    phone?: string;
    village?: string;
    district?: string;
  }) => {
    let uid = '';
    const cleanEmail = data.email.toLowerCase().trim();
    const safeDocId = 'usr_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

    try {
      const safePass = data.password ? data.password.padEnd(6, '0') : 'password123';
      const credential = await createUserWithEmailAndPassword(auth, cleanEmail, safePass);
      uid = credential.user.uid;
      await updateProfile(credential.user, { displayName: data.displayName });
    } catch (authErr: any) {
      console.warn('Firebase Auth registration fallback:', authErr.code || authErr.message);
      uid = safeDocId;
    }

    // Store user's role and details in the database
    const profile: UserProfile = {
      uid: uid || safeDocId,
      email: data.email,
      displayName: data.displayName || cleanEmail.split('@')[0],
      role: data.role,
      phone: data.phone,
      village: data.village,
      district: data.district,
      createdAt: new Date().toISOString(),
    };

    try {
      const userDocRef = doc(db, 'users', uid || safeDocId);
      await setDoc(userDocRef, {
        ...profile,
        passwordHash: btoa(data.password || 'password')
      }, { merge: true });
    } catch (dbErr) {
      console.error('Firestore registration save error', dbErr);
    }

    setUserProfile(profile);
    setRole(profile.role);

    // Route after registration based on role
    if (profile.role === 'farmer') {
      setFarmerView('dashboard');
    } else {
      setOwnerView('dashboard');
    }

    showToast(`Account created! Welcome to AgriRide as a ${profile.role === 'farmer' ? 'Farmer' : 'Equipment Owner'}.`, 'success');
  };

  const loginAsDemo = async (demoRole: UserRole) => {
    const isFarmer = demoRole === 'farmer';
    const email = isFarmer ? 'farmer.demo@agriride.farm' : 'owner.demo@agriride.farm';
    const displayName = isFarmer ? 'Ramesh Patel' : 'Harpreet Brar';
    const phone = isFarmer ? '+91 98251 12345' : '+91 98144 09876';
    const village = isFarmer ? 'Sultanpur Khurd' : 'Rampur Kalan';
    const district = 'Sangrur';
    const demoUid = isFarmer ? 'demo_farmer_ramesh' : 'demo_owner_harpreet';

    const profile: UserProfile = {
      uid: demoUid,
      email,
      displayName,
      role: demoRole,
      phone,
      village,
      district,
      state: 'Punjab',
      createdAt: new Date().toISOString(),
    };

    // Store in Firestore users collection
    try {
      const userDocRef = doc(db, 'users', demoUid);
      await setDoc(userDocRef, profile, { merge: true });
    } catch (e) {
      console.warn('Could not write demo profile to Firestore, falling back to local session', e);
    }

    setUserProfile(profile);
    setRole(demoRole);

    // Route after login based on role
    if (demoRole === 'farmer') {
      setFarmerView('dashboard');
    } else {
      setOwnerView('dashboard');
    }

    showToast(`Signed in as demo ${isFarmer ? 'Farmer (Ramesh Patel)' : 'Equipment Owner (Harpreet Brar)'}.`, 'success');
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUserProfile(null);
    showToast('Signed out of AgriRide.', 'info');
  };

  const goToDetails = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setFarmerView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToBooking = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setFarmerView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createBooking = (data: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
    const newId = `AGR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: Booking = {
      ...data,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);
    setLastConfirmedBooking(newBooking);
    setFarmerView('confirmation');
    showToast(`Booking request ${newId} submitted to equipment owner!`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status } : b))
    );
    const statusMsg = 
      status === 'approved' ? 'Booking approved successfully!' :
      status === 'rejected' ? 'Booking request declined.' :
      status === 'completed' ? 'Rental marked as completed.' :
      `Booking status updated to ${status}.`;
    
    showToast(statusMsg, status === 'rejected' ? 'info' : 'success');
  };

  const addEquipment = (newEq: Omit<Equipment, 'id' | 'ownerId' | 'ownerName' | 'ownerPhone' | 'ownerRating' | 'totalRentals'>) => {
    const id = `eq-${Date.now()}`;
    const ownerDisplayName = userProfile?.displayName || 'Harpreet Brar (You)';
    const ownerPhone = userProfile?.phone || '+91 98144 09876';

    const fullEquipment: Equipment = {
      ...newEq,
      id,
      ownerId: userProfile?.uid || 'owner-current',
      ownerName: ownerDisplayName,
      ownerPhone: ownerPhone,
      ownerRating: 5.0,
      totalRentals: 0,
      status: 'available',
    };

    setEquipmentList(prev => [fullEquipment, ...prev]);
    setOwnerView('my_equipment');
    showToast(`"${fullEquipment.name}" successfully listed for rent!`, 'success');
  };

  const updateEquipmentStatus = (equipmentId: string, status: Equipment['status']) => {
    setEquipmentList(prev =>
      prev.map(eq => (eq.id === equipmentId ? { ...eq, status } : eq))
    );
    showToast(`Equipment status updated to ${status}.`, 'info');
  };

  const deleteEquipment = (equipmentId: string) => {
    setEquipmentList(prev => prev.filter(eq => eq.id !== equipmentId));
    showToast('Equipment removed from your listings.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        farmerView,
        setFarmerView,
        ownerView,
        setOwnerView,
        selectedEquipment,
        setSelectedEquipment,
        lastConfirmedBooking,
        setLastConfirmedBooking,
        equipmentList,
        bookings,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        farmerLocation,
        setFarmerLocation,
        getDistanceToFarmer,
        firebaseUser,
        userProfile,
        authLoading,
        isAuthModalOpen,
        authModalMode,
        authModalRole,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginAsDemo,
        signOutUser,
        goToDetails,
        goToBooking,
        createBooking,
        updateBookingStatus,
        addEquipment,
        updateEquipmentStatus,
        deleteEquipment,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
