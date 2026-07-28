export const RESORT_INFO = {
  name: "Las Cabanas Resort",
  location: "Pushkar, Rajasthan",
  fullAddress: "Ganahera, Motisar Road / Kharekhari Road area, Pushkar, Rajasthan - 305022",
  phone: "+91 063672 76121",
  email: "reservations@lascabanaspushkar.com",
  checkInTime: "12:00 PM / 2:00 PM",
  checkOutTime: "11:00 AM",
  frontDeskHours: "24 Hours (Bookings & Support: 6:00 AM – 11:30 PM)",
  distanceFromCityCenter: "3.2 km (~5 min drive)",
  petPolicy: "Pet-Friendly 🐶 (Pets welcome in garden cottages)",
  basePrice: 2805,
};

export const INITIAL_ROOMS = [
  {
    id: "deluxe-poolside-cottage",
    name: "Deluxe Poolside Cottage",
    category: "Cottage",
    price: 2805,
    originalPrice: 3500,
    description: "Charming independent cottage facing our shimmering swimming pool and lush landscaped garden lawn. Features private veranda, warm wooden tile flooring, split air-conditioning, and modern bathroom with rain shower.",
    capacity: { adults: 2, children: 1 },
    bedType: "King Bed",
    squareFeet: 350,
    view: "Pool & Garden Lawn",
    totalUnits: 6,
    availableUnits: 4,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Poolside Private Veranda",
      "Split Air Conditioner",
      "Geyser & Hot Shower",
      "Organic Breakfast Included",
      "Free High-Speed Wi-Fi"
    ],
    amenities: ["Pool View", "Air Conditioning", "Free Wi-Fi", "Free Breakfast", "Private Veranda", "24h Room Service", "Daily Housekeeping", "Geyser Hot Water"],
    isPopular: true,
    rating: 4.8,
    reviewsCount: 142
  },
  {
    id: "royal-heritage-canopy-villa",
    name: "Royal Heritage Villa (Four-Poster Bed)",
    category: "Luxury Villa",
    price: 3850,
    originalPrice: 4800,
    description: "Opulent heritage villa equipped with a classic teakwood four-poster canopy bed, dark wood furniture, floor-to-ceiling glass patio doors, and stone architectural accents. Perfect for romantic getaways.",
    capacity: { adults: 2, children: 1 },
    bedType: "Royal Four-Poster Canopy Bed",
    squareFeet: 480,
    view: "Aravalli Hills & Private Courtyard",
    totalUnits: 4,
    availableUnits: 2,
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Teak Four-Poster Canopy Bed",
      "Private Balcony / Sitting Area",
      "Premium Bath Amenities & Plush Towels",
      "Electric Tea/Coffee Maker",
      "Smart Flat Screen TV"
    ],
    amenities: ["Four-Poster Bed", "Balcony", "Air Conditioning", "Free Wi-Fi", "Free Breakfast", "Mini Refreshment Bar", "Tea/Coffee Maker", "Luggage Rack"],
    isPopular: true,
    rating: 4.9,
    reviewsCount: 98
  },
  {
    id: "garden-family-suite",
    name: "Garden Family Suite Cottage",
    category: "Family Suite",
    price: 4990,
    originalPrice: 6200,
    description: "Spacious multi-bedroom cottage connected to our central green lawn, ideal for families and road-trip groups. Comes with kitchenette facilities in select units, dual air conditioning, and outdoor lawn seating.",
    capacity: { adults: 4, children: 2 },
    bedType: "2 King Beds",
    squareFeet: 620,
    view: "Lush Green Central Lawn",
    totalUnits: 3,
    availableUnits: 3,
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Two Interconnected King Bedrooms",
      "Kitchenette Facility Available",
      "Direct Step-Out Garden Seating",
      "Pet-Friendly Layout",
      "Free On-Site Private Parking"
    ],
    amenities: ["Kitchenette", "Garden View", "Pet Friendly", "2 King Beds", "Air Conditioning", "Free Wi-Fi", "Free Breakfast", "Lawn Dining Access"],
    rating: 4.7,
    reviewsCount: 76
  },
  {
    id: "luxury-sunset-cabana-suite",
    name: "Luxury Sunset Cabana & Plunge Tub",
    category: "Presidential Suite",
    price: 5600,
    originalPrice: 7000,
    description: "Our signature top-tier cabana offering breathtaking golden hour sunset views over the Aravalli range. Includes a private open-air soak tub on the terrace, welcome fruit basket, and personalized butler service.",
    capacity: { adults: 2, children: 0 },
    bedType: "King Plush Pillowtop",
    squareFeet: 550,
    view: "Aravalli Sunset & Mountain Horizon",
    totalUnits: 2,
    availableUnits: 1,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
    ],
    features: [
      "Private Open-Air Terrace Soak Tub",
      "Complimentary Fruit Basket & Welcome Drinks",
      "Express Priority Check-In",
      "Romantic Candlelight Dinner Setup Discount",
      "Sunset View Lounge Chairs"
    ],
    amenities: ["Private Soak Tub", "Sunset View", "Welcome Basket", "Air Conditioning", "Free Wi-Fi", "Free Breakfast", "Romantic Decor Option"],
    isPopular: true,
    rating: 5.0,
    reviewsCount: 54
  }
];

export const ADD_ONS = [
  {
    id: "desert-safari",
    name: "Pushkar Desert Camel & Jeep Safari",
    description: "Sunset camel ride into the dunes with traditional folk music & tea.",
    price: 1500,
    icon: "Compass"
  },
  {
    id: "poolside-dinner",
    name: "Romantic Poolside Candlelight Dinner",
    description: "4-course chef menu setup under the star-lit sky by the swimming pool.",
    price: 2200,
    icon: "UtensilsCrossed"
  },
  {
    id: "railway-pickup",
    name: "Ajmer Junction / Bus Stand Pickup & Drop",
    description: "Private AC sedan transfer between Ajmer Junction Railway Station and resort.",
    price: 900,
    icon: "Car"
  },
  {
    id: "extra-mattress",
    name: "Extra Guest Mattress & Bedding",
    description: "Rollaway comfortable mattress with fresh linens and pillow.",
    price: 750,
    perNight: true,
    icon: "Bed"
  }
];

export const RESORT_REVIEWS = [
  {
    id: "rev-1",
    guestName: "Rohan & Priya Sharma",
    guestCity: "Jaipur",
    rating: 5,
    date: "July 2026",
    comment: "Las Cabanas is an absolute hidden gem in Pushkar! The swimming pool is sparkling clean, the cottages feel so private and peaceful, and the breakfast of hot poha and sandwiches on the lawn was lovely.",
    roomType: "Deluxe Poolside Cottage",
    verified: true
  },
  {
    id: "rev-2",
    guestName: "Amanpreet Singh",
    guestCity: "Delhi NCR",
    rating: 5,
    date: "June 2026",
    comment: "Rode down with my biker club! Ample secure parking for our motorcycles, super friendly staff, and the royal canopy bed room was very comfortable. Highly recommended for road trips.",
    roomType: "Royal Heritage Villa",
    verified: true
  },
  {
    id: "rev-3",
    guestName: "Meera & Dr. Kulkarni",
    guestCity: "Mumbai",
    rating: 5,
    date: "May 2026",
    comment: "Brought our Golden Retriever along because they are pet friendly! He loved running around the lush green gardens. Just 5 minutes from Pushkar Lake. Perfect retreat.",
    roomType: "Garden Family Suite Cottage",
    verified: true
  }
];

export const NEARBY_LANDMARKS = [
  { name: "Old Rangji Temple", distance: "3.9 km", driveTime: "6 mins", icon: "Landmark", desc: "Historic South-Indian style architectural temple in Pushkar town." },
  { name: "Pushkar Sacred Lake & Ghats", distance: "4.3 km", driveTime: "7 mins", icon: "Waves", desc: "Holy lake surrounded by 52 bathing ghats and vibrant markets." },
  { name: "Brahma Temple", distance: "3.5 km", driveTime: "5 mins", icon: "Sparkles", desc: "One of the very few existing temples dedicated to Lord Brahma in the world." },
  { name: "Savitri Devi Temple Ropeway", distance: "4.0 km", driveTime: "8 mins", icon: "Mountain", desc: "Scenic hill-top temple accessible via cable car with panoramic views of Pushkar." },
  { name: "Pushkar Rose Gardens & Motisar Sand Dunes", distance: "2.8 km", driveTime: "4 mins", icon: "Sun", desc: "Fragrant damask rose fields and golden desert sand dunes." }
];

export const DINING_HIGHLIGHTS = [
  { category: "Breakfast Specialties", item: "Rajasthani Poha & Fresh Club Sandwiches", price: "Free with Booking" },
  { category: "Main Course", item: "Authentic Dal Baati Churma & Gatte Ki Sabzi", price: "₹380" },
  { category: "Poolside Snacks", item: "Crispy Paneer Pakoda, Sev & Hot Masala Chai", price: "₹190" },
  { category: "International", item: "Wood-fired Thin Crust Margherita Pizza", price: "₹340" },
  { category: "Beverages", item: "Fresh Mint Lassi & Chilled Cold Coffee", price: "₹120" }
];
