'use client';

import { useEffect } from 'react';

const EDITIONS = [
  { name: 'Vihaan 9.0', tagline: 'The 9th Edition', url: 'https://9.vihaan.ieeedtu.in' },
  { name: 'Vihaan 8.0', tagline: 'The 8th Edition', url: 'https://8.vihaan.ieeedtu.in' },
  { name: 'Vihaan 7.0', tagline: 'The 7th Edition', url: 'https://7.vihaan.ieeedtu.in' },
];

export default function PreviousEditions({ onClose }) {
  /* close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-[10px]" onClick={onClose} role="dialog" aria-modal="true" aria-label="Previous Editions">
      <div className="relative w-[min(420px,92vw)] animate-modal-in rounded-[1.1rem] border border-white/[.06] bg-[#13131f] p-8 sm:p-10" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-4 top-3 p-1 text-2xl leading-none text-[#505068] transition hover:scale-110 hover:text-[#f0f0f0]" onClick={onClose} aria-label="Close dialog">&times;</button>

        <h2 className="mb-1 font-display text-[1.4rem] font-semibold">Previous Editions</h2>
        <p className="mb-6 text-[.72rem] tracking-[.06em] text-[#505068]">Explore our legacy.</p>

        <ul className="flex flex-col gap-2.5">
          {EDITIONS.map((ed) => (
            <li key={ed.url}>
              <a href={ed.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border border-white/[.06] bg-white/[.015] px-4 py-3.5 transition hover:translate-x-1.5 hover:border-violet-600 hover:bg-white/[.05]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[.85rem] font-semibold tracking-[.04em]">{ed.name}</span>
                  <span className="text-[.62rem] tracking-[.08em] text-[#505068]">{ed.tagline}</span>
                </div>
                <span className="text-lg text-violet-600">&rarr;</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
