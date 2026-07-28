import React, { useState } from 'react';
import RoomCard from './RoomCard.jsx';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function CottagesSection({ rooms, onSelectRoom, calculateNights = 1 }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Accommodations' },
    { id: 'Cottage', label: 'Poolside Cottages' },
    { id: 'Luxury Villa', label: 'Royal Canopy Villas' },
    { id: 'Family Suite', label: 'Family Garden Suites' },
    { id: 'Presidential Suite', label: 'Sunset Cabana Suites' }
  ];

  const filteredRooms = selectedFilter === 'all'
    ? rooms
    : rooms.filter(r => r.category === selectedFilter);

  return (
    <section id="cottages" className="py-20 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-50 text-slate-900 relative overflow-hidden">
      
      {/* Subtle Background Accent Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-stone-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Private Cottages & Luxury Cabanas
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Handcrafted Cottages for Every Guest
          </h2>
          
          <p className="mt-4 text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
            Designed with natural teakwood, local Rajasthani architecture, split AC comfort, and step-out access to our central garden lawn and swimming pool.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                selectedFilter === cat.id
                  ? 'bg-amber-700 text-white border-amber-800 shadow-md shadow-amber-800/20'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onSelectRoom={onSelectRoom}
              calculateNights={calculateNights}
            />
          ))}
        </div>

        {/* Assurance Box */}
        <div className="mt-14 bg-white border border-amber-200 rounded-2xl p-6 flex flex-wrap items-center justify-around gap-4 text-xs text-stone-700 shadow-sm">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Guaranteed Best Rates Direct on Website</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Free Cancellation Up To 24 Hours Before Check-In</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>24/7 Front Desk Assistance & Free Parking</span>
          </div>
        </div>

      </div>
    </section>
  );
}
