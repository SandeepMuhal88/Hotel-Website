# Dune & Palm — Desert Oasis Resort Website

Ye ek **Resort-type Hotel** ka one-page marketing + booking-enquiry website hai. Resort ka naam **"Dune & Palm"** rakha hai — Rajasthan ke Thar desert mein ek chhota, spring-fed oasis resort, jisme 40 courtyard suites hain. Neeche pura plan hai ki site kaise design ki gayi, kaise kaam karti hai, aur isse aage kaise le jaya ja sakta hai.

---

## 1. Ye "Resort type" hotel kyu hai (not a city hotel)

Resort aur city/business hotel ke website ki zaroorat alag hoti hai:

| City Hotel website | Resort website (ye project) |
|---|---|
| Room booking pe focus, fast decision | **Experience** pe focus — guest "kyun aaye" wo pehle samjhaya |
| Business traveller, short stay | Leisure traveller, longer stay, planning mein time |
| Minimal storytelling | Story, dining, activities ka bada section chahiye |
| Location = airport/city center se distance | Location = escape/seclusion ka selling point |

Isliye site ka structure booking form se pehle **Story → Stays → Experiences → Dining** rakha gaya — jaise real resort websites (Aman, Rambagh, Suján) karte hain: pehle guest ko "feel" do, phir booking maango.

---

## 2. Site ka structure (page-by-page nahi, section-by-section — kyunki ye one-page site hai)

```
index.html
├── Nav (fixed, transparent → dark on scroll)
├── Hero            → resort ka thesis: "An oasis built for stillness"
├── Marquee strip    → resort ke USPs scroll karte hue
├── Story            → resort history + 3 key stats
├── Stays            → 4 room/suite types with price
├── Experiences       → daily timeline (05:45 sunrise ride → 22:00 stargazing)
├── Dining            → single-seating concept + tonight's menu
├── Booking form       → date, guests, room type, email
└── Footer            → contact, address, policy links
```

Har section apne aap me ek "job" karta hai — koi bhi section decorative nahi hai, sab kuch guest ko booking form tak le jaane ke liye design hua hai.

---

## 3. Design decisions (tokens)

- **Colour palette** — desert twilight se liya gaya: midnight indigo (`#141B2E`), warm ivory (`#F6F1E4`), marigold gold accent (`#DDA23F`), oasis teal (`#1F6F68`). Generic "cream + terracotta" AI-look se bachne ke liye teal aur indigo ko primary accents banaya.
- **Typography** — `Fraunces` (display serif, warm/royal feel) headings ke liye, `Work Sans` body text ke liye, `IBM Plex Mono` labels/prices/timestamps ke liye (data jaisa feel deta hai — booking-relevant info).
- **Signature element** — animated SVG dune-line divider (hero ke neeche aur section dividers mein) jo slowly drift karti hai — resort ke naam aur location dono ko reflect karta hai.
- **Motion** — scroll-reveal (IntersectionObserver) sections ke liye, hover-lift room cards pe, marquee strip infinite scroll. `prefers-reduced-motion` respect kiya gaya hai.

---

## 4. Ye kaise kaam karta hai (technical)

Pure **front-end** project hai — koi backend abhi nahi hai. Teen files:

```
hotel-resort/
├── index.html      → structure & content
├── css/style.css   → design system (CSS variables + components)
└── js/script.js    → interactivity
```

### `js/script.js` kya karta hai:
1. **Nav scroll state** — scroll karne pe nav transparent se solid dark background me badalta hai.
2. **Mobile menu** — hamburger click pe slide-in nav (mobile breakpoint pe).
3. **Scroll reveal** — `IntersectionObserver` se sections fade+slide-in hote hain jab viewport me aate hain.
4. **Booking form** — abhi ye sirf **front-end validation** karta hai (check-out date check-in ke baad honi chahiye) aur success message dikhata hai. **Ye real booking backend se connected nahi hai** — koi email nahi jaata, koi database me save nahi hota. Ye ek placeholder hai jaha future me real API call jaayegi.

### Booking form ko real banane ke liye (next step):
`js/script.js` ke andar `form.addEventListener('submit', ...)` ke andar `fetch()` call add karni hogi, jo kisi backend endpoint (e.g. `/api/bookings`) pe POST request bhejegi:

```js
const res = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ checkin, checkout, guests, room, email })
});
```

Backend options:
- **No-code**: Formspree / Getform / Netlify Forms — form ka data seedha email pe aa jayega, koi server code likhne ki zaroorat nahi.
- **Custom backend**: Node.js + Express (ya Python + FastAPI) jo booking DB (PostgreSQL/MongoDB) me save kare aur confirmation email bheje (SendGrid/Resend).
- **Payment/availability engine**: agar real payments chahiye to Razorpay/Stripe integrate karna hoga, aur ek room-availability calendar (kaunsi date pe kaunsa room already booked hai) chahiye hoga — isके liye database zaroor lagega.

---

## 5. Deployment plan

Kyunki ye static HTML/CSS/JS hai, isko free/cheap host kiya ja sakta hai:

1. **Netlify / Vercel / GitHub Pages** — repo push karo, auto-deploy ho jayega. Netlify Forms use karo to booking form bhi bina backend ke kaam karega.
2. Custom domain (`duneandpalm.com` jaisa) connect karna.
3. Images abhi CSS gradients se replace kiye gaye hain (placeholder) — real resort photos add karne ke liye `.room-card__media` classes me `background-image` daalni hogi.

---

## 6. Future improvements (roadmap)

- [ ] Real photography (hero, rooms, dining) — abhi gradient placeholders hain
- [ ] Real booking backend + availability calendar
- [ ] Gallery / Instagram feed section
- [ ] Multi-language (Hindi + English toggle)
- [ ] Google Maps embed on footer/location
- [ ] Guest reviews section
- [ ] Blog/journal for SEO (desert travel tips, seasonal content)

---

## 7. Files in this project

| File | Purpose |
|---|---|
| `index.html` | Full page markup — all sections |
| `css/style.css` | Design tokens + component styles + responsive rules |
| `js/script.js` | Nav behaviour, scroll reveal, form handling |
| `README.md` | Ye file — plan aur documentation |

Site fully responsive hai (mobile → desktop), keyboard-focus visible hai accessibility ke liye, aur `prefers-reduced-motion` ko respect karta hai.
