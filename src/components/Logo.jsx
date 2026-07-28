import React from 'react';

export default function Logo({ size = 'md', variant = 'dark', showText = true, className = '' }) {
  // Dimensions
  const sizes = {
    sm: { icon: 'w-8 h-8', textTitle: 'text-xs', textSub: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 'w-11 h-11', textTitle: 'text-sm sm:text-base', textSub: 'text-[9px] sm:text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 'w-16 h-16', textTitle: 'text-xl sm:text-2xl', textSub: 'text-[11px]', gap: 'gap-3.5' },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* SVG Royal Shield Emblem matching official logo */}
      <div className={`relative shrink-0 ${currentSize.icon}`}>
        <svg
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#d97706" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* CROWN TOP */}
          <path
            d="M 60 45 L 80 25 L 100 40 L 120 25 L 140 45 L 132 55 L 68 55 Z"
            fill="url(#goldGrad)"
            filter="url(#goldGlow)"
          />
          {/* Crown Center Jewels */}
          <polygon points="100,10 104,18 100,24 96,18" fill="url(#goldGrad)" />
          <circle cx="80" cy="18" r="3" fill="url(#goldGrad)" />
          <circle cx="120" cy="18" r="3" fill="url(#goldGrad)" />
          {/* Crown Base Bar */}
          <rect x="66" y="52" width="68" height="6" rx="1.5" fill="url(#goldGrad)" />

          {/* OUTER SHIELD FRAME */}
          <path
            d="M 30 62 H 170 C 170 140 150 185 100 215 C 50 185 30 140 30 62 Z"
            fill="url(#shieldBg)"
            stroke="url(#goldGrad)"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {/* INNER SHIELD BORDER */}
          <path
            d="M 40 72 H 160 C 160 135 142 175 100 202 C 58 175 40 135 40 72 Z"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeDasharray="none"
          />

          {/* LION SILHOUETTE (Left side of shield) */}
          <g fill="url(#goldGrad)">
            {/* Lion head & mane */}
            <path d="M 85 92 C 80 85 68 88 64 96 C 60 102 62 110 68 114 C 70 118 68 126 62 130 C 58 133 54 135 55 142 C 57 148 64 150 68 145 C 72 152 78 156 86 150 C 88 144 82 138 85 132 C 90 130 96 122 92 112 C 90 106 92 98 85 92 Z" />
            {/* Lion snout & jaws */}
            <path d="M 85 95 Q 92 92 96 98 Q 98 102 92 105 Z" />
            {/* Raised Forepaws */}
            <path d="M 88 115 Q 102 112 106 102 Q 108 100 105 97 Q 100 102 90 110 Z" />
            <path d="M 85 125 Q 98 126 102 120 Q 104 118 100 116 Q 95 120 86 122 Z" />
            {/* Lion hind legs & paws */}
            <path d="M 68 145 Q 60 152 64 162 Q 68 165 74 162 Q 78 155 76 148 Z" />
            <path d="M 84 148 Q 80 156 84 162 Q 88 164 92 162 Q 92 154 86 148 Z" />
            {/* Lion tail curving back */}
            <path d="M 58 132 C 48 130 45 115 50 105 C 52 101 55 102 54 106 C 50 114 52 124 60 126 Z" />
          </g>

          {/* PALM TREE SILHOUETTE (Right side of shield) */}
          <g fill="url(#goldGrad)">
            {/* Trunk */}
            <path d="M 132 162 C 130 135 132 115 134 95 L 138 95 C 136 115 134 135 136 162 Z" />
            {/* Palm Fronds / Leaves */}
            <path d="M 135 95 Q 115 85 105 92 Q 120 96 135 97 Z" />
            <path d="M 135 95 Q 118 75 110 78 Q 124 85 135 95 Z" />
            <path d="M 135 95 Q 135 70 135 68 Q 138 78 136 95 Z" />
            <path d="M 135 95 Q 152 75 160 78 Q 146 85 135 95 Z" />
            <path d="M 135 95 Q 155 85 165 92 Q 150 96 135 97 Z" />
          </g>

          {/* BASE GROUND LINE */}
          <rect x="52" y="162" width="96" height="4" rx="2" fill="url(#goldGrad)" />

          {/* BOTTOM CHEVRON STRIPES */}
          <path
            d="M 60 172 L 100 195 L 140 172"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 70 184 L 100 200 L 130 184"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* TYPOGRAPHY */}
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <span
            className={`font-serif font-extrabold tracking-[0.18em] leading-none ${currentSize.textTitle} ${
              variant === 'light' ? 'text-slate-900' : 'text-amber-100'
            }`}
            style={{
              backgroundImage: variant === 'light' ? 'none' : 'linear-gradient(to right, #fbbf24, #d97706, #f59e0b)',
              WebkitBackgroundClip: variant === 'light' ? 'none' : 'text',
              WebkitTextFillColor: variant === 'light' ? 'inherit' : 'transparent',
            }}
          >
            LAS CABANAS
          </span>
          <span
            className={`font-sans font-extrabold tracking-[0.35em] uppercase leading-tight mt-0.5 ${currentSize.textSub} ${
              variant === 'light' ? 'text-amber-900' : 'text-amber-400'
            }`}
          >
            RESORT • PUSHKAR
          </span>
        </div>
      )}
    </div>
  );
}
