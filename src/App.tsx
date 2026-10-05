import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { AuthModal } from './components/auth/AuthModal';

// Farmer screens
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { EquipmentSearch } from './components/farmer/EquipmentSearch';
import { EquipmentDetails } from './components/farmer/EquipmentDetails';
import { BookingForm } from './components/farmer/BookingForm';
import { BookingConfirmation } from './components/farmer/BookingConfirmation';
import { FarmerBookings } from './components/farmer/FarmerBookings';

// Owner screens
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { AddEquipment } from './components/owner/AddEquipment';
import { MyEquipment } from './components/owner/MyEquipment';
import { BookingRequests } from './components/owner/BookingRequests';

const MainContent: React.FC = () => {
  const { role, farmerView, ownerView } = useApp();

  return (
    <main className="flex-1 w-full pb-12">
      {role === 'farmer' ? (
        <>
          {farmerView === 'dashboard' && <FarmerDashboard />}
          {farmerView === 'search' && <EquipmentSearch />}
          {farmerView === 'details' && <EquipmentDetails />}
          {farmerView === 'booking' && <BookingForm />}
          {farmerView === 'confirmation' && <BookingConfirmation />}
          {farmerView === 'my_bookings' && <FarmerBookings />}
        </>
      ) : (
        <>
          {ownerView === 'dashboard' && <OwnerDashboard />}
          {ownerView === 'add_equipment' && <AddEquipment />}
          {ownerView === 'my_equipment' && <MyEquipment />}
          {ownerView === 'booking_requests' && <BookingRequests />}
        </>
      )}
    </main>
  );
};

const AppShell: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, authModalRole } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      <Header />
      <MainContent />
      <Footer />
      <ToastContainer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        initialRole={authModalRole}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
