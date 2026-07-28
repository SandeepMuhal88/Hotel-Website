import React, { useState } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhotoGallery() {
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryItems = [
    {
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      category: "pool",
      title: "Crystal Clear Swimming Pool",
      desc: "Relaxing poolside loungers with Aravalli view"
    },
    {
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      category: "cottages",
      title: "Royal Four-Poster Canopy Bed",
      desc: "Teakwood bed with organic cotton linens"
    },
    {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      category: "pool",
      title: "Resort Pool & Palm Garden",
      desc: "Spacious pool area for morning dips"
    },
    {
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      category: "dining",
      title: "Al Fresco Garden Breakfast",
      desc: "Serving hot poha, tea & fruit sandwiches"
    },
    {
      url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      category: "cottages",
      title: "Modern Bathroom & Geyser Shower",
      desc: "Clean wooden tile accents with 24h hot shower"
    },
    {
      url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
      category: "cottages",
      title: "Deluxe Poolside Cottage Exterior",
      desc: "Independent cottage steps from the garden"
    },
    {
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      category: "sunset",
      title: "Golden Hour Pushkar Sunset",
      desc: "Warm evening glow over the resort lawn"
    },
    {
      url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      category: "dining",
      title: "Teakwood Dining Hall",
      desc: "Indoor dining seating for group meals"
    }
  ];

  const filteredItems = activeTab === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <section id="gallery" className="py-20 bg-stone-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Visual Journey
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Real Moments at Las Cabanas
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 font-normal">
            Take a glance at our sparkling pool, royal canopy bed villas, verdant garden lawn, and al fresco dining.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 text-xs font-bold">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'pool', label: 'Swimming Pool' },
            { id: 'cottages', label: 'Cottages & Interiors' },
            { id: 'dining', label: 'Dining & Lawn' },
            { id: 'sunset', label: 'Sunset Vibe' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all border ${
                activeTab === tab.id
                  ? 'bg-amber-700 text-white border-amber-800 shadow-md'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              onClick={() => setLightboxIndex(index)}
              className="group relative h-64 rounded-2xl overflow-hidden bg-white border border-amber-200/80 cursor-pointer shadow-sm hover:shadow-xl hover:border-amber-400 transition-all"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-amber-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <p className="font-serif font-bold text-amber-200 text-sm group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                  <p className="text-stone-300 text-[11px] font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors z-50 shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-stone-900 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors z-50 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLightboxIndex((prev) => (prev + 1) % filteredItems.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-stone-900 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors z-50 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] text-center space-y-3">
            <img
              src={filteredItems[lightboxIndex].url}
              alt={filteredItems[lightboxIndex].title}
              className="max-h-[70vh] max-w-full object-contain mx-auto rounded-2xl shadow-2xl border border-amber-300"
            />
            <p className="font-serif text-xl font-bold text-amber-200">
              {filteredItems[lightboxIndex].title}
            </p>
            <p className="text-stone-300 text-xs font-medium">
              {filteredItems[lightboxIndex].desc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
