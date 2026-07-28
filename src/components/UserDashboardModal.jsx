import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, Printer, Settings } from 'lucide-react';

export default function UserDashboardModal({
  isOpen,
  onClose,
  user,
  onUpdatePreferences
}) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [preferences, setPreferences] = useState(user?.preferences || {
    bedPreference: 'King',
    dietaryPreference: 'Vegetarian',
    floorPreference: 'Ground Floor Cottage',
    purposeOfVisit: 'Leisure',
    specialNotes: ''
  });

  useEffect(() => {
    if (isOpen && user?.mobileNumber) {
      fetchUserBookings();
    }
  }, [isOpen, user]);

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/user/${encodeURIComponent(user.mobileNumber)}`);
      const data = await res.json();
      if (data.bookings) {
        setUserBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: user.mobileNumber,
          preferences
        })
      });
      const data = await res.json();
      if (data.success) {
        onUpdatePreferences(preferences);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save pref error:', err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to request cancellation for this booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        fetchUserBookings();
      }
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-amber-300 rounded-3xl max-w-2xl w-full text-slate-900 shadow-2xl relative overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-stone-50 p-6 border-b border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-bold shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">{user?.name}</h3>
              <p className="text-stone-600 text-xs font-medium">{user?.mobileNumber} • Guest Account</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-amber-800 p-1.5 rounded-full hover:bg-amber-100/60 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-amber-200/80 bg-amber-50/50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-amber-700 text-amber-900 bg-white font-extrabold'
                : 'border-transparent text-stone-600 hover:text-amber-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-700" /> My Bookings ({userBookings.length})
          </button>
          
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-3 text-center flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'preferences'
                ? 'border-amber-700 text-amber-900 bg-white font-extrabold'
                : 'border-transparent text-stone-600 hover:text-amber-800'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-700" /> Guest Stay Preferences
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          
          {activeTab === 'bookings' && (
            <div>
              {loading ? (
                <p className="text-center text-stone-500 text-xs py-8">Loading your bookings history...</p>
              ) : userBookings.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Calendar className="w-12 h-12 text-amber-400/80 mx-auto" />
                  <p className="font-serif text-lg font-bold text-slate-900">No Reservations Found</p>
                  <p className="text-stone-600 text-xs max-w-sm mx-auto font-medium">
                    You don't have any bookings associated with {user?.mobileNumber} yet. Reserve your poolside cottage today!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map(b => (
                    <div key={b.id} className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80 space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider">
                            Voucher #{b.bookingNumber}
                          </span>
                          <h4 className="font-serif font-bold text-slate-900 text-sm">{b.roomTypeName}</h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-sm ${
                          b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-stone-700 font-medium">
                        <div>
                          <p className="text-stone-500 text-[10px] font-semibold">Check-In:</p>
                          <p className="font-bold text-amber-900">{b.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 text-[10px] font-semibold">Check-Out:</p>
                          <p className="font-bold text-amber-900">{b.checkOut} ({b.nights} Nights)</p>
                        </div>
                        <div>
                          <p className="text-stone-500 text-[10px] font-semibold">Total Paid:</p>
                          <p className="font-extrabold text-amber-900">₹{b.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 text-[10px] font-semibold">Payment Method:</p>
                          <p className="font-bold text-slate-900">{b.paymentMethod}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-200/80 flex justify-between items-center">
                        <button
                          onClick={() => window.print()}
                          className="text-amber-800 hover:underline text-[11px] font-extrabold flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-700" /> Print Voucher Pass
                        </button>

                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="text-rose-600 hover:underline text-[11px] font-bold"
                          >
                            Cancel Stay
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
              
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your preferences have been updated in your profile!</span>
                </div>
              )}

              <div>
                <label className="block text-amber-900 font-bold mb-1">Bed Preference</label>
                <select
                  value={preferences.bedPreference}
                  onChange={(e) => setPreferences({ ...preferences, bedPreference: e.target.value })}
                  className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                >
                  <option value="King">King Size Bed</option>
                  <option value="Twin">Twin Beds</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">Dietary Preference</label>
                <select
                  value={preferences.dietaryPreference}
                  onChange={(e) => setPreferences({ ...preferences, dietaryPreference: e.target.value })}
                  className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                >
                  <option value="Vegetarian">Pure Vegetarian</option>
                  <option value="Jain">Jain (No Onion / Garlic)</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">Cottage Floor Preference</label>
                <select
                  value={preferences.floorPreference}
                  onChange={(e) => setPreferences({ ...preferences, floorPreference: e.target.value })}
                  className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                >
                  <option value="Ground Floor Cottage">Ground Floor Garden Access</option>
                  <option value="Upper Floor Balcony">Upper Floor Balcony View</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">Purpose of Visit</label>
                <select
                  value={preferences.purposeOfVisit}
                  onChange={(e) => setPreferences({ ...preferences, purposeOfVisit: e.target.value })}
                  className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                >
                  <option value="Leisure">Family Leisure Vacation</option>
                  <option value="Romantic Getaway">Honeymoon / Romantic Trip</option>
                  <option value="Roadtrip">Biker / Highway Road Trip</option>
                  <option value="Wedding/Event">Wedding Guest / Group Stay</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">Additional Notes for Housekeeping</label>
                <textarea
                  rows={2}
                  value={preferences.specialNotes || ''}
                  onChange={(e) => setPreferences({ ...preferences, specialNotes: e.target.value })}
                  placeholder="e.g. Please keep extra pillows and non-feather blankets."
                  className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all"
              >
                Save Preferences
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
