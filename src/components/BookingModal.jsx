import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, QrCode, CreditCard, Building2, Printer, AlertCircle } from 'lucide-react';
import { ADD_ONS, RESORT_INFO } from '../data/resortData.js';

export default function BookingModal({
  isOpen,
  onClose,
  selectedRoom,
  allRooms,
  user,
  onLoginRequest,
  onBookingConfirmed
}) {
  const [step, setStep] = useState(1);

  // Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(dayAfter.toISOString().split('T')[0]);
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [activeRoom, setActiveRoom] = useState(selectedRoom || allRooms[0] || null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);
  
  // Guest Details
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestPhone, setGuestPhone] = useState(user?.mobileNumber || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code');
  const [upiId, setUpiId] = useState('guest@okicici');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (selectedRoom) {
      setActiveRoom(selectedRoom);
    } else if (allRooms.length > 0 && !activeRoom) {
      setActiveRoom(allRooms[0]);
    }
  }, [selectedRoom, allRooms]);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestPhone) setGuestPhone(user.mobileNumber);
      if (!guestEmail) setGuestEmail(user.email || '');
    }
  }, [user]);

  if (!isOpen || !activeRoom) return null;

  // Calculate Nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    return Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
  };

  const nights = calculateNights();
  const roomSubtotal = activeRoom.price * nights;

  // Addons total
  const selectedAddOnsList = ADD_ONS.filter(a => selectedAddOnIds.includes(a.id));
  const addOnsTotal = selectedAddOnsList.reduce((sum, a) => sum + (a.perNight ? a.price * nights : a.price), 0);

  const subtotalBeforeTax = roomSubtotal + addOnsTotal;
  const taxesAndFees = Math.round(subtotalBeforeTax * 0.12); // 12% GST
  const grandTotal = subtotalBeforeTax + taxesAndFees;

  const toggleAddOn = (id) => {
    if (selectedAddOnIds.includes(id)) {
      setSelectedAddOnIds(selectedAddOnIds.filter(item => item !== id));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, id]);
    }
  };

  const handleConfirmAndPay = async () => {
    if (!guestName || !guestPhone) {
      setErrorMsg('Please enter guest name and phone number.');
      setStep(3);
      return;
    }

    setIsProcessingPayment(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          roomTypeId: activeRoom.id,
          checkIn,
          checkOut,
          guests,
          guestName,
          guestPhone,
          guestEmail,
          specialRequests,
          selectedAddOns: selectedAddOnsList.map(a => ({ id: a.id, quantity: 1 })),
          paymentMethod
        })
      });

      const data = await res.json();

      if (data.success && data.booking) {
        setCreatedBooking(data.booking);
        onBookingConfirmed(data.booking);
        setStep(5);
      } else {
        setErrorMsg(data.error || 'Failed to complete booking.');
      }
    } catch (err) {
      setErrorMsg('Payment gateway connection error. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-amber-300 rounded-3xl max-w-3xl w-full text-slate-900 shadow-2xl relative my-auto overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-stone-50 p-4 sm:p-6 border-b border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center font-bold text-white font-serif shadow-md border border-amber-400">
              LC
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Resort Reservation Engine
              </h3>
              <p className="text-[11px] text-stone-600 font-medium">
                Step {step} of 5 • {step === 5 ? 'Confirmed Voucher' : 'Instant Confirmation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-amber-800 p-1.5 rounded-full hover:bg-amber-100/60 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="bg-amber-50/60 px-6 py-2.5 border-b border-amber-200/80 flex justify-between text-[11px] font-bold text-stone-500">
          <span className={step >= 1 ? 'text-amber-900 font-extrabold' : ''}>1. Dates</span>
          <span>•</span>
          <span className={step >= 2 ? 'text-amber-900 font-extrabold' : ''}>2. Room & Addons</span>
          <span>•</span>
          <span className={step >= 3 ? 'text-amber-900 font-extrabold' : ''}>3. Guest Details</span>
          <span>•</span>
          <span className={step >= 4 ? 'text-amber-900 font-extrabold' : ''}>4. Payment</span>
          <span>•</span>
          <span className={step === 5 ? 'text-emerald-700 font-extrabold' : ''}>5. Voucher</span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Dates & Guests */}
          {step === 1 && (
            <div className="space-y-5">
              <h4 className="font-serif text-lg font-bold text-slate-900">Select Travel Dates & Guests</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50/40 p-4 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-bold text-amber-900 mb-1">Check-In Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="bg-amber-50/40 p-4 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-bold text-amber-900 mb-1">Check-Out Date ({nights} Nights)</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-amber-50/40 p-4 rounded-2xl border border-stone-200">
                <label className="block text-xs font-bold text-amber-900 mb-2">Number of Guests</label>
                <div className="flex items-center space-x-6 text-xs font-bold text-slate-800">
                  <div className="flex items-center space-x-2">
                    <span>Adults:</span>
                    <button
                      type="button"
                      onClick={() => setGuests({ ...guests, adults: Math.max(1, guests.adults - 1) })}
                      className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-extrabold hover:bg-amber-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-extrabold text-amber-900 text-sm">{guests.adults}</span>
                    <button
                      type="button"
                      onClick={() => setGuests({ ...guests, adults: Math.min(6, guests.adults + 1) })}
                      className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-extrabold hover:bg-amber-200 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span>Children:</span>
                    <button
                      type="button"
                      onClick={() => setGuests({ ...guests, children: Math.max(0, guests.children - 1) })}
                      className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-extrabold hover:bg-amber-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-extrabold text-amber-900 text-sm">{guests.children}</span>
                    <button
                      type="button"
                      onClick={() => setGuests({ ...guests, children: Math.min(4, guests.children + 1) })}
                      className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-extrabold hover:bg-amber-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Select Cottage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Cottage & Add-Ons */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-slate-900">Choose Cottage Category</h4>
                <span className="text-xs text-amber-800 font-bold">{nights} Nights • {guests.adults} Adults</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {allRooms.map(room => (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoom(room)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      activeRoom.id === room.id
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500/30 shadow-md'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="font-serif font-bold text-slate-900 text-sm">{room.name}</h5>
                      <span className="text-amber-800 font-extrabold text-sm">₹{room.price}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 line-clamp-1">{room.description}</p>
                    <p className="text-[11px] text-emerald-700 mt-2 font-bold">✓ Free Organic Breakfast & Pool Access</p>
                  </div>
                ))}
              </div>

              {/* Add-Ons */}
              <div className="pt-2">
                <h5 className="font-serif text-sm font-bold text-slate-900 mb-3">Enhance Your Stay (Optional Add-Ons)</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ADD_ONS.map(addon => {
                    const isSelected = selectedAddOnIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-amber-100/90 border-amber-600 text-amber-950 font-semibold shadow-sm'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-amber-300'
                        }`}
                      >
                        <div>
                          <p className="font-bold">{addon.name}</p>
                          <p className="text-[10px] text-stone-500 line-clamp-1">{addon.description}</p>
                        </div>
                        <span className="font-extrabold text-amber-800 shrink-0 ml-2">
                          +₹{addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-stone-200">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold hover:bg-stone-200 border border-stone-200 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                >
                  <span>Guest Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Guest Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-slate-900">Guest Information</h4>

              {!user && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-900 font-medium">
                  <span>Already registered? Log in with Mobile OTP for quick fill.</span>
                  <button
                    type="button"
                    onClick={onLoginRequest}
                    className="bg-amber-700 text-white font-bold px-3 py-1 rounded-lg text-[11px] shadow-sm hover:bg-amber-800"
                  >
                    Mobile Login
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">Full Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Vikramaditya Singh"
                    className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">Email Address (For Instant Voucher)</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="e.g. vikram@example.com"
                  className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">Special Requests (Anniversary, Quiet Cottage, Ground Floor)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Arriving around 1:00 PM, prefer a ground floor cottage near the garden lawn."
                  className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-stone-200">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold hover:bg-stone-200 border border-stone-200 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Gateway */}
          {step === 4 && (
            <div className="space-y-6">
              <h4 className="font-serif text-lg font-bold text-slate-900">Payment & Reservation Summary</h4>

              {/* Price Breakdown Card */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
                <div className="flex justify-between text-stone-800 font-medium">
                  <span>{activeRoom.name} ({nights} Nights x ₹{activeRoom.price})</span>
                  <span className="font-bold">₹{roomSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {selectedAddOnsList.map(a => (
                  <div key={a.id} className="flex justify-between text-stone-600">
                    <span>+ {a.name}</span>
                    <span className="font-semibold">₹{a.perNight ? a.price * nights : a.price}</span>
                  </div>
                ))}

                <div className="flex justify-between text-stone-600">
                  <span>Estimated Taxes & GST (12%)</span>
                  <span className="font-semibold">₹{taxesAndFees.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-amber-200 flex justify-between font-serif text-base font-bold text-amber-900">
                  <span>Total Payable Amount</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                  {[
                    { id: 'UPI / QR Code', label: 'UPI / QR Code', icon: QrCode },
                    { id: 'Credit / Debit Card', label: 'Card Payment', icon: CreditCard },
                    { id: 'Net Banking', label: 'Net Banking', icon: Building2 },
                    { id: 'Pay at Hotel', label: 'Pay at Hotel', icon: CheckCircle2 }
                  ].map(pm => {
                    const IconComp = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                          paymentMethod === pm.id
                            ? 'bg-amber-700 text-white border-amber-800 font-extrabold shadow-md'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* UPI QR Display */}
              {paymentMethod === 'UPI / QR Code' && (
                <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200 text-center space-y-3">
                  <p className="text-xs text-amber-900 font-bold">Scan UPI QR Code to Pay ₹{grandTotal.toLocaleString('en-IN')}</p>
                  <div className="w-36 h-36 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-md border border-amber-200">
                    <div className="w-full h-full bg-slate-900 text-amber-300 p-2 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-amber-400">
                      <QrCode className="w-16 h-16 text-amber-400" />
                      <span className="text-[8px] text-stone-300 font-mono mt-1">UPI: lascabanas@upi</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI VPA ID (e.g. guest@okaxis)"
                    className="max-w-xs mx-auto bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-center text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                  />
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-stone-200">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold hover:bg-stone-200 border border-stone-200 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleConfirmAndPay}
                  disabled={isProcessingPayment}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-700/20"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{isProcessingPayment ? 'Confirming Stay...' : `Confirm & Pay ₹${grandTotal.toLocaleString('en-IN')}`}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmed Voucher Pass */}
          {step === 5 && createdBooking && (
            <div className="space-y-6 text-center">
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-300">
                  Booking Confirmed!
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mt-2">
                  Welcome to Las Cabanas Resort
                </h3>
                <p className="text-stone-600 text-xs mt-1 font-medium">
                  Confirmation Voucher ID: <span className="font-bold text-amber-900">{createdBooking.bookingNumber}</span>
                </p>
              </div>

              {/* Voucher Ticket Box */}
              <div id="printable-voucher" className="bg-amber-50/50 p-6 rounded-2xl border border-amber-300 text-left text-xs space-y-3 font-sans shadow-sm">
                <div className="flex justify-between items-center border-b border-amber-200/80 pb-3">
                  <div>
                    <p className="font-serif font-bold text-slate-900 text-sm">Las Cabanas Resort, Pushkar</p>
                    <p className="text-stone-600 text-[11px] font-medium">{RESORT_INFO.fullAddress}</p>
                  </div>
                  <span className="bg-amber-700 text-white font-extrabold px-3 py-1 rounded-lg text-[11px] shadow-sm">
                    {createdBooking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-stone-800 pt-1">
                  <div>
                    <p className="text-stone-500 text-[10px] font-semibold">Guest Name:</p>
                    <p className="font-bold text-slate-900">{createdBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-stone-500 text-[10px] font-semibold">Mobile Phone:</p>
                    <p className="font-bold text-slate-900">{createdBooking.guestPhone}</p>
                  </div>
                  <div>
                    <p className="text-stone-500 text-[10px] font-semibold">Check-In Date:</p>
                    <p className="font-bold text-amber-900">{createdBooking.checkIn} (12:00 PM)</p>
                  </div>
                  <div>
                    <p className="text-stone-500 text-[10px] font-semibold">Check-Out Date:</p>
                    <p className="font-bold text-amber-900">{createdBooking.checkOut} (11:00 AM)</p>
                  </div>
                  <div>
                    <p className="text-stone-500 text-[10px] font-semibold">Room Type:</p>
                    <p className="font-bold text-slate-900">{createdBooking.roomTypeName}</p>
                  </div>
                  <div>
                    <p className="text-stone-500 text-[10px] font-semibold">Payment Method:</p>
                    <p className="font-bold text-emerald-700">{createdBooking.paymentMethod} (Paid ₹{createdBooking.totalAmount})</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200/80 text-[10px] text-stone-600 font-medium">
                  <p>✓ Includes Free Daily Organic Breakfast & Pool Access</p>
                  <p>📞 Front Desk Contact: +91 063672 76121</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handlePrintVoucher}
                  className="bg-white hover:bg-amber-50 text-amber-900 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-amber-300 shadow-sm"
                >
                  <Printer className="w-4 h-4 text-amber-700" />
                  <span>Print Receipt Voucher</span>
                </button>
                <button
                  onClick={onClose}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
