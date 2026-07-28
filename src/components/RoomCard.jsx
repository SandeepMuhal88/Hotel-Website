import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Bed, Square, Eye, Check, Star, Flame, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function RoomCard({
  room,
  onSelectRoom,
  selectedCheckIn,
  selectedCheckOut,
  calculateNights = 1
}) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const totalPrice = room.price * calculateNights;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-amber-200/90 hover:border-amber-400 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-amber-950/5 transition-all flex flex-col h-full group"
    >
      {/* Image Carousel Header */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-100">
        <img
          src={room.images[currentImgIdx]}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        {/* Image Nav Arrows */}
        {room.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-stone-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-600 hover:text-white shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-stone-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-600 hover:text-white shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Image Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
              {room.images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    currentImgIdx === i ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="bg-amber-700 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md backdrop-blur-sm">
            {room.category}
          </span>

          {room.availableUnits <= 2 ? (
            <span className="bg-rose-100 border border-rose-300 text-rose-800 font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-md backdrop-blur-sm flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3 text-rose-600" /> Only {room.availableUnits} Left!
            </span>
          ) : (
            <span className="bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-md backdrop-blur-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> {room.availableUnits} Cottages Ready
            </span>
          )}
        </div>

        {/* Popular Tag */}
        {room.isPopular && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-amber-200" /> Guest Favorite
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Header & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
              {room.name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-xs text-amber-900 font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{room.rating}</span>
              <span className="text-stone-500 font-normal">({room.reviewsCount})</span>
            </div>
          </div>

          <p className="text-stone-600 text-xs mt-2 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs text-stone-700 font-medium">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>{room.capacity.adults} Adults, {room.capacity.children} Child</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-amber-700" />
              <span>{room.bedType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-amber-700" />
              <span>{room.squareFeet} Sq. Ft.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-700" />
              <span className="truncate">{room.view}</span>
            </div>
          </div>

          {/* Key Feature Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {room.amenities.slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-amber-50/80 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 font-semibold flex items-center gap-1"
              >
                <Check className="w-2.5 h-2.5 text-emerald-600" /> {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Booking Footer */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-serif text-slate-900">
                ₹{room.price.toLocaleString('en-IN')}
              </span>
              {room.originalPrice && (
                <span className="text-xs text-stone-400 line-through font-medium">
                  ₹{room.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] text-stone-500">/ night</span>
            </div>

            {calculateNights > 1 && (
              <p className="text-[10px] text-emerald-700 font-bold">
                Total for {calculateNights} Nights: ₹{totalPrice.toLocaleString('en-IN')} + GST
              </p>
            )}
            <p className="text-[10px] text-amber-800 font-medium">Includes Free Organic Breakfast</p>
          </div>

          <button
            onClick={() => onSelectRoom(room)}
            className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-800/20 transition-all text-xs uppercase tracking-wider flex items-center gap-1 shrink-0"
          >
            <span>Reserve</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}
