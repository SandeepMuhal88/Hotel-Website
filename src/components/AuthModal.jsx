import React, { useState } from 'react';
import { X, Smartphone, ArrowRight, Sparkles } from 'lucide-react';
import { sendOtp, verifyOtp } from '../services/localApi.js';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('mobile');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [name, setName] = useState('Vikramaditya Singh');
  const [email, setEmail] = useState('vikram@example.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await sendOtp(mobileNumber);
      if (data.success) {
        setSimulatedOtp(data.simulatedOtp || '123456');
        setOtp(data.simulatedOtp || '123456');
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await verifyOtp(mobileNumber, otp, name, email);
      if (data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Verification error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-amber-300 rounded-3xl max-w-md w-full p-6 sm:p-8 text-slate-900 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-amber-800 p-1.5 rounded-full hover:bg-amber-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Smartphone className="w-6 h-6 text-amber-800" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-slate-900">
            {step === 'mobile' && 'Mobile OTP Login'}
            {step === 'otp' && 'Verify 6-Digit OTP'}
          </h3>
          <p className="text-stone-600 text-xs mt-1 font-medium">
            Instant guest authentication for booking management & preferences
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs font-semibold">
            {error}
          </div>
        )}

        {step === 'mobile' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">Mobile Number (+91 India)</label>
              <div className="flex rounded-xl overflow-hidden border border-stone-200 bg-amber-50/40 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20">
                <span className="bg-amber-100/80 text-amber-900 px-3.5 py-2.5 text-xs font-bold flex items-center border-r border-amber-200">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-transparent px-3 py-2.5 text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">Full Guest Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikramaditya Singh"
                className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. vikram@example.com"
                className="w-full bg-amber-50/40 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending OTP...' : 'Send OTP Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-center space-y-1">
              <p className="text-xs text-stone-700 font-medium">OTP Sent to <span className="font-bold text-amber-900">{mobileNumber}</span></p>
              <p className="text-[11px] text-emerald-800 font-bold flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Test Auto-fill Code: <span className="underline font-extrabold">{simulatedOtp}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-bold bg-amber-50/30 border border-amber-300 rounded-xl px-3 py-2.5 text-amber-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOtp('123456')}
                className="w-1/2 py-2.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold hover:bg-stone-200 border border-stone-200"
              >
                Use Test OTP (123456)
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-amber-700 hover:bg-amber-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
          </form>
        )}

        <p className="text-[10px] text-stone-500 font-medium text-center mt-6">
          🔒 Secure SSL encrypted mobile verification. We respect your privacy.
        </p>

      </div>
    </div>
  );
}
