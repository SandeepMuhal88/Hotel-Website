import React, { useState } from 'react';
import { Calendar as CalendarIcon, Users, ArrowRight, Search, ShieldCheck } from 'lucide-react';

export default function BookingSearchBar({ onSearch, className = '' }) {
  // Default check-in tomorrow, check-out in 2 days
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(dayAfter.toISOString().split('T')[0]);
  const [guests, setGuests] = useState(2);
  const [category, setCategory] = useState('all');

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
    return diff;
  };

  const nights = calculateNights();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSearch(checkIn, checkOut, guests, category);
  };

  return (
    <div className={`bg-white/95 border border-amber-200 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md text-stone-900 ${className}`}>
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Check-In Date */}
        <div className="md:col-span-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-amber-800 mb-1 flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5 text-amber-700" /> Check-In Date
          </label>
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-stone-900 text-sm font-bold focus:outline-none cursor-pointer"
            required
          />
        </div>

        {/* Check-Out Date */}
        <div className="md:col-span-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all relative">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-amber-800 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5 text-amber-700" /> Check-Out Date</span>
            <span className="text-amber-900 font-bold lowercase bg-amber-200/80 px-1.5 py-0.2 rounded border border-amber-300 text-[10px]">
              {nights} {nights === 1 ? 'Night' : 'Nights'}
            </span>
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-stone-900 text-sm font-bold focus:outline-none cursor-pointer"
            required
          />
        </div>

        {/* Guests Selector */}
        <div className="md:col-span-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-amber-800 mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-700" /> Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-stone-900 text-sm font-bold focus:outline-none cursor-pointer"
          >
            <option value={1}>1 Guest (Solo Traveler)</option>
            <option value={2}>2 Guests (Couple / Pair)</option>
            <option value={3}>3 Guests (Family)</option>
            <option value={4}>4 Guests (Group Suite)</option>
            <option value={6}>6+ Guests (Multiple Cottages)</option>
          </select>
        </div>

        {/* Search Submit CTA */}
        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-extrabold py-4 px-4 rounded-2xl shadow-lg shadow-amber-800/20 hover:shadow-amber-700/30 transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 group"
          >
            <Search className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Check Availability</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </form>

      <div className="mt-3 pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between text-[11px] text-stone-600 gap-2">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Instant Mobile Confirmation • No Hidden Booking Fees</span>
        </span>
        <span className="text-amber-800 font-bold bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
          🔥 Price Starting at ₹2,805 / night with Free Breakfast
        </span>
      </div>
    </div>
  );
}
