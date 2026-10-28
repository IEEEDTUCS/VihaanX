"use client";

const svg = (children) => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const TRACK_ICONS = {
  health: svg(
    <>
      <path d="M20.8 8.6a5 5 0 0 0-8.8-3.2A5 5 0 0 0 3.2 8.6c0 5.4 8.8 10.4 8.8 10.4s8.8-5 8.8-10.4z" />
      <path d="M3.5 12h4l2-3 3 6 2-3h6" />
    </>,
  ),
  fin: svg(
    <>
      <path d="M3 20h18" />
      <path d="M5 16l5-5 4 3 6-7" />
      <path d="M15 7h5v5" />
    </>,
  ),
  edu: svg(
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11v5c3 2.5 9 2.5 12 0v-5" />
      <path d="M22 9v6" />
    </>,
  ),
  web3: svg(
    <>
      <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" />
      <path d="M12 11l8-4.5M12 11v9M12 11L4 6.5" />
    </>,
  ),
  esports: svg(
    <>
      <rect x="2" y="7" width="20" height="11" rx="5" />
      <path d="M7 11v3M5.5 12.5h3" />
      <circle cx="16" cy="11.5" r="1" />
      <circle cx="18" cy="13.5" r="1" />
    </>,
  ),
  safety: svg(
    <>
      <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />
      <circle cx="12" cy="9.5" r="2" />
      <path d="M8.5 16c.8-2 2-3 3.5-3s2.7 1 3.5 3" />
    </>,
  ),
  security: svg(
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <path d="M12 15v2" />
    </>,
  ),
  sustain: svg(
    <>
      <path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" />
      <path d="M5 19l8-8" />
    </>,
  ),
  open: svg(
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
    </>,
  ),
  iot: svg(
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>,
  ),
  agri: svg(
    <>
      <path d="M12 21v-9" />
      <path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z" />
      <path d="M12 14c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5z" />
      <path d="M7 21h10" />
    </>,
  ),
  city: svg(
    <>
      <path d="M3 21h18" />
      <path d="M5 21V9l5-3v15" />
      <path d="M10 21V4h6v17" />
      <path d="M16 21v-8h3v8" />
      <path d="M12.5 8h1M12.5 11h1M12.5 14h1" />
    </>,
  ),
};

export default TRACK_ICONS;

export const ArrowRight = ({ size = 14 }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const Chevron = ({ dir = "left" }) => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
  </svg>
);
