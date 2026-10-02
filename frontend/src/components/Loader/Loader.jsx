'use client';

import { useEffect, useState } from 'react';

export default function Loader({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setFadeOut(true), 2800); return () => clearTimeout(timer); }, []);
  useEffect(() => { if (!fadeOut) return undefined; const timer = setTimeout(onComplete, 900); return () => clearTimeout(timer); }, [fadeOut, onComplete]);
  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-12 bg-[#0a0a0f] transition-[opacity,visibility] duration-900 ${fadeOut ? 'invisible opacity-0' : ''}`} aria-hidden="true">
      <div className="flex flex-col items-center gap-1">
          <img src="/logos/vihaan_full.png" alt="Vihaan X" className="w-xl h-auto animate-loader-fade" />
        {/*<div className="flex gap-[.1em] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-[.12em] text-[#f0f0f0]">*/}
        {/*  {'VIHAAN'.split('').map((letter, index) => <span key={`${letter}-${index}`} className="opacity-0 translate-y-3 animate-loader-letter" style={{ animationDelay: `${(index + 1) / 10}s` }}>{letter}</span>)}*/}
        {/*</div>*/}
        {/*<span className="animate-loader-x-in animate-loader-x-glow font-display text-[clamp(3.5rem,9vw,7rem)] font-bold leading-[.8] text-violet-600">X</span>*/}
        <span className="mt-3 animate-loader-fade text-[.65rem] tracking-[.3em] text-gray-300 opacity-0">THE 10TH EDITION</span>
      </div>
      <div className="w-[min(220px,60vw)]">
        <div className="h-px overflow-hidden rounded bg-[#505068] opacity-0 animate-loader-fade"><div className="h-full w-0 rounded bg-violet-500 animate-loader-progress" /></div>
      </div>
    </div>
  );
}
