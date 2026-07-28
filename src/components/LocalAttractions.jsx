import React from 'react';
import { NEARBY_LANDMARKS } from '../data/resortData.js';
import { MapPin, Navigation, Compass } from 'lucide-react';

export default function LocalAttractions() {
  return (
    <section id="attractions" className="py-20 bg-white text-slate-900 border-t border-b border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 uppercase tracking-widest mb-3 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-amber-700" /> Pushkar Sightseeing & Guide
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Explore Sacred Pushkar From Las Cabanas
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 font-normal">
            Conveniently situated on Motisar Road, Ganahera — far enough from market congestion for peaceful nights, yet just 5 minutes from holy lakes and temples.
          </p>
        </div>

        {/* Landmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEARBY_LANDMARKS.map((item, idx) => (
            <div
              key={idx}
              className="bg-amber-50/30 border border-amber-200/80 hover:border-amber-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" /> {item.distance}
                  </span>
                  <span className="text-xs text-stone-600 font-semibold">
                    ⏱️ {item.driveTime} drive
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors mb-2">
                  {item.name}
                </h3>

                <p className="text-stone-600 text-xs leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-amber-800">
                <span className="flex items-center gap-1 font-semibold">
                  <Navigation className="w-3.5 h-3.5 text-amber-700" /> Direct Route From Resort
                </span>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(item.name + ' Pushkar')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline font-extrabold text-amber-800"
                >
                  View Map →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Location Banner */}
        <div className="mt-12 bg-gradient-to-r from-amber-900 via-stone-900 to-slate-950 text-white border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-serif text-xl font-bold text-amber-200">
              Need Railway Station or Airport Pick Up?
            </p>
            <p className="text-amber-100/80 text-xs font-normal">
              We arrange private AC sedan cab pick-ups directly from Ajmer Junction Railway Station (28 km) or Jaipur Airport (145 km).
            </p>
          </div>

          <a
            href="tel:+9106367276121"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider shrink-0"
          >
            Call Transport Desk: +91 063672 76121
          </a>
        </div>

      </div>
    </section>
  );
}
