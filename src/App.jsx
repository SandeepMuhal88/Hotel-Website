import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import CottagesSection from './components/CottagesSection.jsx';
import ResortFacilities from './components/ResortFacilities.jsx';
import PhotoGallery from './components/PhotoGallery.jsx';
import LocalAttractions from './components/LocalAttractions.jsx';
import InquiryForm from './components/InquiryForm.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import BookingModal from './components/BookingModal.jsx';
import UserDashboardModal from './components/UserDashboardModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AIConcierge from './components/AIConcierge.jsx';
import { INITIAL_ROOMS } from './data/resortData.js';

export function App() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [user, setUser] = useState({
    id: 'usr-demo-1',
    mobileNumber: '+919876543210',
    name: 'Vikramaditya Singh',
    email: 'vikram@example.com',
    preferences: {
      bedPreference: 'King',
      dietaryPreference: 'Vegetarian',
      floorPreference: 'Ground Floor Cottage',
      purposeOfVisit: 'Romantic Getaway',
      specialNotes: 'Prefer a quiet cottage near the swimming pool.'
    },
    createdAt: new Date().toISOString()
  });

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Search parameters
  const [searchCheckIn, setSearchCheckIn] = useState('');
  const [searchCheckOut, setSearchCheckOut] = useState('');
  const [searchGuests, setSearchGuests] = useState(2);
  const [calculateNights, setCalculateNights] = useState(1);


  const handleSearchAvailability = (checkIn, checkOut, guests, category) => {
    setSearchCheckIn(checkIn);
    setSearchCheckOut(checkOut);
    setSearchGuests(guests);

    if (checkIn && checkOut) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
      setCalculateNights(nights);
    }

    // Scroll to cottages section
    const el = document.getElementById('cottages');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  const handleUpdateUserPreferences = (newPref) => {
    if (user) {
      setUser({ ...user, preferences: newPref });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header */}
      <Header
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(!isAdminOpen)}
        onOpenBookingModal={() => {
          setSelectedRoom(rooms[0] || null);
          setIsBookingOpen(true);
        }}
        onLogout={() => setUser(null)}
        isAdminOpen={isAdminOpen}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          onSearchAvailability={handleSearchAvailability}
          onExploreCottages={() => {
            const el = document.getElementById('cottages');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Cottages Section */}
        <CottagesSection
          rooms={rooms}
          onSelectRoom={handleSelectRoom}
          calculateNights={calculateNights}
        />

        {/* Resort Facilities & Swimming Pool Section */}
        <ResortFacilities />

        {/* Photo Gallery */}
        <PhotoGallery />

        {/* Local Sightseeing & Pushkar Guide */}
        <LocalAttractions />

        {/* Wedding & Group Inquiry Form */}
        <InquiryForm />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={() => {
          setSelectedRoom(rooms[0] || null);
          setIsBookingOpen(true);
        }}
      />

      {/* Modals & Portals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setIsAuthOpen(false);
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedRoom={selectedRoom}
        allRooms={rooms}
        user={user}
        onLoginRequest={() => {
          setIsBookingOpen(false);
          setIsAuthOpen(true);
        }}
        onBookingConfirmed={(booking) => {
          // Room availability updates are handled client-side in localApi
        }}
      />

      {user && (
        <UserDashboardModal
          isOpen={isUserDashboardOpen}
          onClose={() => setIsUserDashboardOpen(false)}
          user={user}
          onUpdatePreferences={handleUpdateUserPreferences}
        />
      )}

      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* AI Guest Concierge */}
      <AIConcierge />

    </div>
  );
}

export default App;
