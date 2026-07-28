import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin, Sparkles, Wifi, Coffee, Waves, Dog, ShieldCheck } from 'lucide-react';
import BookingSearchBar from './BookingSearchBar.jsx';
import { RESORT_INFO } from '../data/resortData.js';

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=80",
    title: "Tranquil Swimming Pool & Garden Cottages",
    subtitle: "Rejuvenate by our shimmering pool surrounded by Pushkar's serene landscape"
  },
  {
    url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1920&q=80",
    title: "Royal Four-Poster Canopy Villas",
    subtitle: "Classic teakwood craftsmanship with private garden patios"
  },
  {
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
    title: "Golden Hour Aravalli Sunsets",
    subtitle: "Just 3.2 km from Pushkar Lake with breathtaking mountain horizon views"
  }
];

export default function Hero({ onSearchAvailability, onExploreCottages }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between bg-stone-950 text-amber-50 overflow-hidden pt-6 pb-12">
      
      {/* Background Image Carousel with Motion Parallax */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGES[currentSlide].url}')` }}
          />
        </AnimatePresence>
      </div>

      {/* Soft Light-Royal Gradient Overlays over Carousel */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-slate-950/50" />

      {/* Main Hero Banner Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8 w-full flex-1 flex flex-col justify-center">
        
        <div className="max-w-3xl">
          
          {/* Rating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-300/80 text-xs font-bold text-slate-900 mb-4 shadow-lg"
          >
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="font-extrabold text-slate-900">4.9 / 5.0</span>
            <span className="text-stone-300">•</span>
            <span className="text-amber-800 font-semibold">Pushkar's Premier Garden Resort</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-md"
          >
            Las Cabanas Resort <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500">
              Ganahera, Pushkar
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 text-base sm:text-xl text-amber-50 font-medium leading-relaxed max-w-2xl drop-shadow"
          >
            An oasis of lush gardens, private air-conditioned cottages, sparkling swimming pool, and authentic Rajasthani warmth. Just 3.2 km from Pushkar Sacred Lake.
          </motion.p>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-900"
          >
            <span className="bg-white/90 border border-amber-300/80 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
              <Waves className="w-3.5 h-3.5 text-cyan-600" /> Swimming Pool
            </span>
            <span className="bg-white/90 border border-amber-300/80 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
              <Coffee className="w-3.5 h-3.5 text-amber-600" /> Free Breakfast
            </span>
            <span className="bg-white/90 border border-amber-300/80 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" /> Free High-Speed Wi-Fi
            </span>
            <span className="bg-white/90 border border-amber-300/80 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
              <Dog className="w-3.5 h-3.5 text-amber-700" /> Pet Friendly 🐶
            </span>
          </motion.div>

        </div>

      </div>

      {/* Floating Interactive Booking Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <BookingSearchBar onSearch={onSearchAvailability} />
      </motion.div>

      {/* Slide Indicators */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 flex items-center justify-between text-xs text-stone-400">
        <div className="flex space-x-2">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-stone-700 hover:bg-stone-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <p className="hidden sm:block text-[11px] text-stone-400 font-medium">
          📞 Booking Hotline: <a href={`tel:${RESORT_INFO.phone}`} className="text-amber-300 font-bold hover:underline">{RESORT_INFO.phone}</a>
        </p>
      </div>

    </div>
  );
}
