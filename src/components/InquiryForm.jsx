import React, { useState } from 'react';
import { Mail, Phone, User, Send, CheckCircle2, Sparkles, Building } from 'lucide-react';
import { RESORT_INFO } from '../data/resortData.js';
import { submitInquiry } from '../services/localApi.js';

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    type: 'General',
    guestsCount: 2,
    preferredDates: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const data = await submitInquiry(formData);

      if (data.success) {
        setSuccessMsg('Your inquiry has been submitted! Our reservation team will call you shortly.');
        setFormData({
          name: '',
          mobile: '',
          email: '',
          type: 'General',
          guestsCount: 2,
          preferredDates: '',
          message: ''
        });
      } else {
        setErrorMsg(data.error || 'Failed to submit inquiry. Please try calling us directly.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again or call +91 063672 76121.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Event & Group Stay Enquiries
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Planning a Destination Wedding or Group Getaway?
            </h2>

            <p className="text-stone-600 text-sm font-normal leading-relaxed">
              Las Cabanas Resort offers complete resort buyouts, central garden lawn hosting for up to 200 guests, poolside cocktail setups, and custom Rajasthani thali dining.
            </p>

            <div className="space-y-4 pt-2 text-xs font-medium text-stone-800">
              <div className="bg-white p-4 rounded-2xl border border-amber-200/80 flex items-center space-x-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                  <Phone className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold">Front Desk & Reservation Line</p>
                  <a href={`tel:${RESORT_INFO.phone}`} className="text-amber-800 hover:underline font-extrabold text-sm">
                    {RESORT_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200/80 flex items-center space-x-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                  <Building className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold">Resort Location</p>
                  <p className="text-stone-600 font-medium">{RESORT_INFO.fullAddress}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200/80 flex items-center space-x-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                  <Mail className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold">Email Desk</p>
                  <p className="text-stone-600 font-medium">{RESORT_INFO.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-6">
              Send Us a Message or Request Callback
            </h3>

            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-amber-900 font-bold mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-amber-50/50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-amber-900 font-bold mb-1">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full bg-amber-50/50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-amber-900 font-bold mb-1">Inquiry Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-amber-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="General">General Questions</option>
                    <option value="Wedding & Events">Destination Wedding / Pre-wedding</option>
                    <option value="Group Booking">Group / Corporate Outing</option>
                    <option value="Local Shuttle & Safari">Desert Safari & Station Pickup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-amber-900 font-bold mb-1">Expected Guests</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.guestsCount}
                    onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                    className="w-full bg-amber-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-amber-900 font-bold mb-1">Preferred Travel Dates</label>
                <input
                  type="text"
                  placeholder="e.g. August 15 - August 18, 2026"
                  value={formData.preferredDates}
                  onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                  className="w-full bg-amber-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-900 font-bold mb-1">Message / Special Requirements *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your requirements, room preferences, or catering queries..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-amber-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-800/20 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{submitting ? 'Submitting...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
