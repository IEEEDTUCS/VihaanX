'use client';
import { useState } from 'react';

export default function ArchiveMedia({ src, alt = 'Archive photograph', label = 'Photo coming soon' }) {
  const [failed, setFailed] = useState(null);
  if (src && failed !== src) return <img src={src} alt={alt} loading="lazy" decoding="async" draggable="false" onError={() => setFailed(src)} />;
  return <span className="archive-placeholder">
    <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="7" y="7" width="50" height="50" rx="4" /><circle cx="22" cy="22" r="6" /><path d="m8 48 15-15 10 10 10-13 14 17" /></svg>
    <span>{label}</span>
  </span>;
}
