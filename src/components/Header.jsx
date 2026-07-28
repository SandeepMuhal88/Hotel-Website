import React, { useState, useEffect, useRef } from 'react';
import {
  Phone, MapPin, User, LogOut, Shield, Calendar,
  Sparkles, Menu, X, CheckCircle2, ChevronDown, Crown
} from 'lucide-react';
import Logo from './Logo.jsx';

/* ─── Royal colour tokens ────────────────────────────────── */
const ROYAL = {
  topBar:  'linear-gradient(90deg,#0a0f1e 0%,#13203a 50%,#0a0f1e 100%)',
  navBg:   'rgba(7,14,35,0.82)',          // deep navy glass
  navBorder:'rgba(180,130,40,0.22)',
  gold:    '#c9a84c',
  goldHover:'#f0d080',
  dropShadow: '0 8px 40px rgba(0,0,0,0.55)',
};

/* ─── Smooth underline nav link ───────────────────────────── */
function NavLink({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="nav-link"
      style={{
        position: 'relative',
        color: '#c8b87a',
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        paddingBottom: '4px',
        transition: 'color 0.25s',
      }}
    >
      {children}
      <span className="nav-underline" />
    </a>
  );
}

export default function Header({
  user,
  onOpenAuth,
  onOpenUserDashboard,
  onOpenAdmin,
  onOpenBookingModal,
  onLogout,
  isAdminOpen,
}) {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const dropdownRef                        = useRef(null);

  /* Scroll-based shadow enhancement */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { href: '#cottages',   label: 'Cottages' },
    { href: '#facilities', label: 'Amenities' },
    { href: '#dining',     label: 'Dining' },
    { href: '#gallery',    label: 'Gallery' },
    { href: '#attractions',label: 'Pushkar' },
    { href: '#contact',    label: 'Contact' },
  ];

  return (
    <>
      {/* ── Scoped Styles ─────────────────────────────────── */}
      <style>{`
        /* Royal Header nav animations */
        .nav-link:hover { color: #f0d080 !important; }
        .nav-underline {
          position: absolute; left: 0; bottom: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg,#c9a84c,#f0d080);
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link:hover .nav-underline { width: 100%; }

        /* Mobile drawer slide animation */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-drawer { animation: slideDown 0.28s ease forwards; }

        /* Gold shimmer on Book button */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .book-btn {
          background: linear-gradient(
            120deg, #a8722a 0%, #d4a843 30%, #f5d47e 50%, #d4a843 70%, #a8722a 100%
          );
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
          color: #0a0f1e;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.7rem;
          padding: 9px 18px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 3px 18px rgba(180,130,40,0.45);
          display: flex; align-items: center; gap: 6px;
        }
        .book-btn:hover {
          box-shadow: 0 6px 28px rgba(200,160,60,0.65);
          transform: translateY(-1px);
        }
        .book-btn:active { transform: scale(0.97); }

        /* Admin badge */
        .admin-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid rgba(180,130,40,0.4);
          transition: all 0.2s;
          letter-spacing: 0.04em;
        }
        .admin-badge.active {
          background: linear-gradient(120deg,#c9a84c,#f0d080);
          color: #0a0f1e;
          border-color: #c9a84c;
        }
        .admin-badge.inactive {
          background: rgba(255,255,255,0.06);
          color: #c8b87a;
        }
        .admin-badge.inactive:hover { background: rgba(180,130,40,0.18); }

        /* User dropdown */
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .user-dropdown { animation: dropIn 0.2s ease forwards; }

        /* Scrollbar for mobile drawer */
        .royal-drawer::-webkit-scrollbar { width: 4px; }
        .royal-drawer::-webkit-scrollbar-thumb { background: rgba(180,130,40,0.3); border-radius: 4px; }
      `}</style>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          transition: 'box-shadow 0.3s',
          boxShadow: scrolled ? ROYAL.dropShadow : '0 2px 16px rgba(0,0,0,0.4)',
        }}
      >

        {/* ── Top Announcement Bar ───────────────────────── */}
        <div style={{
          background: ROYAL.topBar,
          borderBottom: '1px solid rgba(180,130,40,0.25)',
          padding: '6px 16px',
          fontSize: '0.72rem',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>

            {/* Left: location + offer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#c8b87a' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin style={{ width: 13, height: 13, color: '#c9a84c', flexShrink: 0 }} />
                <span>Ganahera, Pushkar — 3.2 km to Sacred Lake</span>
              </span>
              <span style={{ color: 'rgba(180,130,40,0.4)', display: 'none' }} className="md-dot">•</span>
              <span style={{ display: 'none', alignItems: 'center', gap: 5, color: '#a8c89a' }} className="md-offer">
                <Sparkles style={{ width: 13, height: 13, color: '#88d498', flexShrink: 0 }} />
                Free Organic Breakfast &amp; Pool Included
              </span>
            </div>

            {/* Right: phone + admin */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <a
                href="tel:+910637276121"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  color: '#c8b87a', textDecoration: 'none', fontWeight: 700,
                  fontSize: '0.72rem', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f0d080'}
                onMouseLeave={e => e.currentTarget.style.color = '#c8b87a'}
              >
                <Phone style={{ width: 12, height: 12, color: '#6ed98c', flexShrink: 0 }} />
                +91 06372 76121
              </a>

              <button
                onClick={onOpenAdmin}
                className={`admin-badge ${isAdminOpen ? 'active' : 'inactive'}`}
              >
                <Shield style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />
                {isAdminOpen ? 'Exit Admin' : 'Admin'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Navigation Bar ────────────────────────── */}
        <div style={{
          background: ROYAL.navBg,
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          borderBottom: `1px solid ${ROYAL.navBorder}`,
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

            {/* Brand Logo */}
            <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <Logo size="md" variant="dark" />
            </a>

            {/* ── Desktop Nav ─────────────────────────────── */}
            <nav style={{ display: 'none', alignItems: 'center', gap: 28 }} className="desktop-nav">
              {navLinks.map(({ href, label }) => (
                <NavLink key={href} href={href}>{label}</NavLink>
              ))}
            </nav>

            {/* ── Desktop Action Buttons ───────────────────── */}
            <div style={{ display: 'none', alignItems: 'center', gap: 10 }} className="desktop-actions">

              {/* User auth button / dropdown */}
              {user ? (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'rgba(180,130,40,0.12)',
                      border: '1px solid rgba(180,130,40,0.35)',
                      borderRadius: 10, padding: '7px 12px',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,130,40,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(180,130,40,0.12)'}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#c9a84c,#8b5e1a)',
                      color: '#fff', fontWeight: 800, fontSize: '0.75rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                      <p style={{ color: '#f0d080', fontSize: '0.72rem', fontWeight: 700, margin: 0 }}>
                        {user.name.split(' ')[0]}
                      </p>
                      <p style={{ color: '#9a8a5a', fontSize: '0.62rem', margin: 0 }}>
                        {user.mobileNumber}
                      </p>
                    </div>
                    <ChevronDown
                      style={{
                        width: 13, height: 13, color: '#c8b87a',
                        transition: 'transform 0.2s',
                        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                      }}
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="user-dropdown"
                      style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        width: 220,
                        background: 'linear-gradient(135deg,#0d1a30,#0a1220)',
                        border: '1px solid rgba(180,130,40,0.3)',
                        borderRadius: 14, overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                        zIndex: 60,
                      }}
                    >
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(180,130,40,0.15)' }}>
                        <p style={{ color: '#f0d080', fontWeight: 700, fontSize: '0.8rem', margin: '0 0 2px' }}>
                          {user.name}
                        </p>
                        <p style={{ color: '#7a6840', fontSize: '0.68rem', margin: '0 0 6px' }}>
                          {user.mobileNumber}
                        </p>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: 'rgba(80,200,120,0.12)', color: '#6be08a',
                          border: '1px solid rgba(80,200,120,0.3)',
                          borderRadius: 20, padding: '2px 8px', fontSize: '0.6rem', fontWeight: 700,
                        }}>
                          <CheckCircle2 style={{ width: 9, height: 9 }} /> Verified
                        </span>
                      </div>

                      <button
                        onClick={() => { setDropdownOpen(false); onOpenUserDashboard(); }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '10px 16px',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#c8b87a', fontSize: '0.75rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 8,
                          transition: 'background 0.18s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,130,40,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Calendar style={{ width: 13, height: 13, color: '#c9a84c' }} />
                        My Bookings &amp; Preferences
                      </button>

                      <button
                        onClick={() => { setDropdownOpen(false); onLogout(); }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '10px 16px',
                          background: 'none', border: 'none', borderTop: '1px solid rgba(180,130,40,0.12)',
                          cursor: 'pointer', color: '#f87171', fontSize: '0.75rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 8,
                          transition: 'background 0.18s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,50,50,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <LogOut style={{ width: 13, height: 13 }} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(180,130,40,0.1)',
                    border: '1px solid rgba(180,130,40,0.35)',
                    borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
                    color: '#c8b87a', fontSize: '0.72rem', fontWeight: 700,
                    letterSpacing: '0.04em', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(180,130,40,0.2)'; e.currentTarget.style.color='#f0d080'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(180,130,40,0.1)'; e.currentTarget.style.color='#c8b87a'; }}
                >
                  <User style={{ width: 13, height: 13 }} />
                  Login / Signup
                </button>
              )}

              {/* Book Cottage CTA */}
              <button className="book-btn" onClick={onOpenBookingModal}>
                <Crown style={{ width: 13, height: 13 }} />
                Book Cottage
              </button>
            </div>

            {/* ── Mobile Controls ──────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="mobile-controls">
              <button className="book-btn" onClick={onOpenBookingModal} style={{ fontSize: '0.65rem', padding: '7px 12px' }}>
                Book
              </button>
              <button
                onClick={() => setMobileOpen(v => !v)}
                style={{
                  background: 'rgba(180,130,40,0.12)',
                  border: '1px solid rgba(180,130,40,0.35)',
                  borderRadius: 9, padding: '8px', cursor: 'pointer',
                  color: '#c8b87a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                aria-label="Toggle menu"
              >
                {mobileOpen
                  ? <X style={{ width: 20, height: 20, color: '#f0d080' }} />
                  : <Menu style={{ width: 20, height: 20 }} />
                }
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile Drawer ─────────────────────────────── */}
        {mobileOpen && (
          <div
            className="mobile-drawer royal-drawer"
            style={{
              background: 'linear-gradient(160deg,#07091a 0%,#0d1630 60%,#07091a 100%)',
              borderBottom: '1px solid rgba(180,130,40,0.25)',
              padding: '20px 20px 28px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            {/* Decorative gold line */}
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', marginBottom: 20 }} />

            {/* Nav links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: '#c8b87a', textDecoration: 'none',
                    fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontSize: '0.78rem',
                    padding: '10px 14px', borderRadius: 8,
                    transition: 'all 0.2s',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(180,130,40,0.1)';
                    e.currentTarget.style.color = '#f0d080';
                    e.currentTarget.style.borderColor = 'rgba(180,130,40,0.25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#c8b87a';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(180,130,40,0.15)', margin: '16px 0' }} />

            {/* Auth & Book */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {user ? (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); onOpenUserDashboard(); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '11px 14px', borderRadius: 10,
                      background: 'rgba(180,130,40,0.1)',
                      border: '1px solid rgba(180,130,40,0.3)',
                      color: '#f0d080', fontWeight: 700, fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    <span>My Bookings ({user.name.split(' ')[0]})</span>
                    <Calendar style={{ width: 15, height: 15, color: '#c9a84c' }} />
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); onLogout(); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '10px 14px', borderRadius: 10,
                      background: 'rgba(220,50,50,0.08)',
                      border: '1px solid rgba(220,50,50,0.25)',
                      color: '#f87171', fontWeight: 700, fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    <LogOut style={{ width: 14, height: 14 }} /> Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); onOpenAuth(); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '11px 14px', borderRadius: 10,
                    background: 'rgba(180,130,40,0.1)',
                    border: '1px solid rgba(180,130,40,0.3)',
                    color: '#c8b87a', fontWeight: 700, fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  <User style={{ width: 15, height: 15 }} />
                  Mobile Login / OTP Verify
                </button>
              )}

              <button
                className="book-btn"
                onClick={() => { setMobileOpen(false); onOpenBookingModal(); }}
                style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              >
                <Crown style={{ width: 14, height: 14 }} />
                Check Availability &amp; Book
              </button>
            </div>

            {/* Bottom gold line */}
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', marginTop: 20 }} />
          </div>
        )}

        {/* ── Responsive Layout CSS ────────────────────────── */}
        <style>{`
          /* sm: show top bar offer text */
          @media (min-width: 768px) {
            .md-dot   { display: inline-block !important; }
            .md-offer { display: flex !important; }
          }
          /* lg: show desktop nav + actions, hide mobile controls */
          @media (min-width: 1024px) {
            .desktop-nav     { display: flex !important; }
            .desktop-actions { display: flex !important; }
            .mobile-controls { display: none !important; }
          }
        `}</style>
      </header>
    </>
  );
}
