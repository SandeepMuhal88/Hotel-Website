import React from 'react';
import { Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';
import Logo from './Logo.jsx';
import { RESORT_INFO } from '../data/resortData.js';

export default function Footer({ onOpenAdmin, onOpenBooking }) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-amber-500/30 text-xs">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <Logo size="md" variant="dark" />
            </div>

            <p className="text-stone-300 leading-relaxed font-normal text-xs max-w-sm">
              Discover tranquil garden cottages, a shimmering outdoor swimming pool, organic breakfast, and pure Rajasthani hospitality. Located in Ganahera, just 3.2 km from Pushkar Lake.
            </p>

            <div className="pt-2 flex items-center space-x-4">
              <button
                onClick={onOpenBooking}
                className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                Book Cottage Direct
              </button>
              <button
                onClick={onOpenAdmin}
                className="text-amber-300 hover:text-amber-200 text-xs font-semibold underline"
              >
                Staff Admin Portal
              </button>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-amber-300">Navigation</h4>
            <ul className="space-y-2 text-stone-300">
              <li><a href="#cottages" className="hover:text-amber-300 transition-colors">Deluxe Poolside Cottages</a></li>
              <li><a href="#cottages" className="hover:text-amber-300 transition-colors">Royal Four-Poster Canopy Villas</a></li>
              <li><a href="#facilities" className="hover:text-amber-300 transition-colors">Swimming Pool & Amenities</a></li>
              <li><a href="#dining" className="hover:text-amber-300 transition-colors">On-Site Garden Dining</a></li>
              <li><a href="#gallery" className="hover:text-amber-300 transition-colors">Resort Photo Gallery</a></li>
              <li><a href="#attractions" className="hover:text-amber-300 transition-colors">Pushkar Sightseeing Guide</a></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-bold text-amber-300">Contact & Address</h4>
            <p className="flex items-start gap-2 text-stone-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{RESORT_INFO.fullAddress}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href={`tel:${RESORT_INFO.phone}`} className="text-amber-300 font-extrabold hover:underline">
                {RESORT_INFO.phone}
              </a>
            </p>
            <p className="flex items-center gap-2 text-stone-300">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{RESORT_INFO.email}</span>
            </p>
            <p className="text-[11px] text-stone-400 pt-1">
              Check-In: {RESORT_INFO.checkInTime} • Check-Out: {RESORT_INFO.checkOutTime}
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} Las Cabanas Resort, Pushkar. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Mobile OTP Authentication
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
