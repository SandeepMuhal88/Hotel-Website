import React from 'react';
import { motion } from 'motion/react';
import { Waves, Utensils, Wifi, Dog, Car, Clock, Shirt, Compass, Sparkles } from 'lucide-react';
import { DINING_HIGHLIGHTS } from '../data/resortData.js';

export default function ResortFacilities() {
  const facilities = [
    {
      icon: Waves,
      color: "text-cyan-700 bg-cyan-50 border-cyan-200",
      title: "Shimmering Outdoor Swimming Pool",
      description: "Crystal clear water pool surrounded by sun loungers and palm trees. Includes a shallow splash section safe for children."
    },
    {
      icon: Utensils,
      color: "text-amber-700 bg-amber-50 border-amber-200",
      title: "Garden Dining & Organic Breakfast",
      description: "Complimentary breakfast featuring hot poha, fresh club sandwiches, lassi, and authentic Rajasthani Dal Baati Churma."
    },
    {
      icon: Dog,
      color: "text-amber-800 bg-amber-50 border-amber-200",
      title: "Pet-Friendly Resort Lawns 🐶",
      description: "Your furry companions are welcome! Expansive green grass lawns where pets can stretch and play safely."
    },
    {
      icon: Wifi,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      title: "Free High-Speed Optical Wi-Fi",
      description: "Seamless wireless coverage across all cottages, pool area, and restaurant for remote work or streaming."
    },
    {
      icon: Car,
      color: "text-blue-700 bg-blue-50 border-blue-200",
      title: "Private Parking & Biker Friendly",
      description: "Spacious secure gated parking for private cars, SUVs, and road-trip motorcycles."
    },
    {
      icon: Compass,
      color: "text-purple-700 bg-purple-50 border-purple-200",
      title: "Desert Safari & Local Shuttle",
      description: "On-site desk for booking sunset camel safaris, jeep dune bashing, and Ajmer Junction transfers."
    },
    {
      icon: Clock,
      color: "text-rose-700 bg-rose-50 border-rose-200",
      title: "24-Hour Front Desk & Security",
      description: "Round-the-clock reception team, night security guards, and immediate room service support."
    },
    {
      icon: Shirt,
      color: "text-teal-700 bg-teal-50 border-teal-200",
      title: "Full-Service Express Laundry",
      description: "Same-day wash, dry, and iron services for hassle-free extended road trips."
    }
  ];

  return (
    <section id="facilities" className="py-20 bg-white text-slate-900 relative overflow-hidden border-t border-b border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" /> World-Class Resort Facilities
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Designed for Pure Comfort & Relaxed Luxury
          </h2>
          
          <p className="mt-4 text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
            Whether taking a dip in our pool, savoring morning chai on the garden lawn, or exploring Pushkar's sacred ghats, we handle every detail.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac, idx) => {
            const IconComponent = fac.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-amber-50/40 border border-amber-200/80 hover:border-amber-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${fac.color} group-hover:scale-110 transition-transform shadow-sm`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-800 transition-colors">
                    {fac.title}
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed font-normal">
                    {fac.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dining Showcase Callout Section */}
        <div id="dining" className="mt-16 bg-gradient-to-br from-amber-50 via-white to-stone-50 border border-amber-300/80 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-amber-900 text-xs font-extrabold uppercase tracking-widest bg-amber-200/80 px-3 py-1 rounded-lg border border-amber-300">
                On-Site Culinary Delights
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Fresh Lawn Breakfast & Rajasthani Cuisine
              </h3>
              <p className="text-stone-700 text-sm font-normal leading-relaxed">
                Enjoy hot breakfast under the warm morning sun on our lawn tables. Our kitchen prepares authentic Rajasthani vegetarian specialties, wood-fired pizzas, and fresh fruit shakes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {DINING_HIGHLIGHTS.map((dh, i) => (
                  <div key={i} className="bg-white p-3.5 rounded-xl border border-amber-200 flex justify-between items-center text-xs shadow-sm">
                    <div>
                      <p className="font-bold text-slate-900">{dh.item}</p>
                      <p className="text-[10px] text-stone-500 font-medium">{dh.category}</p>
                    </div>
                    <span className="text-amber-900 font-extrabold bg-amber-100 px-2.5 py-1 rounded-md text-[11px] shrink-0 border border-amber-300">
                      {dh.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl border border-amber-300/80">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
                alt="Dining Hall & Garden Tables"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <p className="text-amber-200 font-serif font-bold text-lg">Al Fresco Dining Under The Palms</p>
                  <p className="text-stone-200 text-xs">Serving 7:00 AM – 10:30 PM daily</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
