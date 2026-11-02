'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { galleryPhotos } from '../../data/gallery.js';
import GalleryAtmosphere from '../Gallery/GalleryAtmosphere';
import ViewfinderCarousel from '../Gallery/ViewfinderCarousel';

function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" d="M5 5l14 14M19 5 5 19" /></svg>;
}

function ArrowIcon({ reverse = false }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${reverse ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" /></svg>;
}


function PhotoLightbox({ items, index, onClose, onNavigate }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);
  const active = items[index];
  return <dialog ref={dialog} aria-label="Gallery photo viewer" onCancel={onClose}
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); onNavigate(e.key === 'ArrowRight' ? 1 : -1); } }}
    className="m-auto w-[94vw] max-w-6xl rounded-2xl border border-white/20 bg-[#070b19] p-5 text-white backdrop:bg-black/90">
    <div className="mb-4 flex items-center justify-between"><span>{index + 1} / {items.length}</span><button type="button" onClick={onClose} aria-label="Close photo viewer" className="grid h-11 w-11 place-items-center rounded-full border border-white/30"><CloseIcon /></button></div>
    <div className="flex items-center gap-3"><button type="button" onClick={() => onNavigate(-1)} aria-label="Previous photo" className="grid h-11 w-11 shrink-0 place-items-center"><ArrowIcon reverse /></button><img src={active.src} alt={active.alt} className="max-h-[70dvh] min-w-0 flex-1 object-contain" /><button type="button" onClick={() => onNavigate(1)} aria-label="Next photo" className="grid h-11 w-11 shrink-0 place-items-center"><ArrowIcon /></button></div>
    <p className="mt-4 text-center text-white/70">{[active.caption, active.year].filter(Boolean).join(' · ')}</p>
  </dialog>;
}

export default function GallerySection() {
  const [openedIndex, setOpenedIndex] = useState(null);
  const root = useRef(null);
  const viewable = galleryPhotos.filter(photo => photo.src && photo.alt);
  const close = useCallback(() => setOpenedIndex(null), []);
  const count = viewable.length;
  const navigate = useCallback((delta) => setOpenedIndex(current => current === null || !count ? null : (current + delta + count) % count), [count]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    const nodes = root.current.querySelectorAll('.archive-reveal');
    nodes.forEach(node => { node.classList.add('reveal-ready'); observer.observe(node); });
    return () => observer.disconnect();
  }, []);
  return <section id="gallery" ref={root} aria-labelledby="gallery-title" className="gallery-experience relative isolate scroll-mt-20 overflow-hidden px-4 py-24 sm:px-8 sm:py-28">
    <GalleryAtmosphere />
    <div className="gallery-content relative z-10 mx-auto w-full max-w-6xl">
      <div>
        <header className="archive-heading archive-reveal text-center">
          <p className="font-tech">// ARCHIVES</p>
          <h3 id="gallery-title" className="font-tech">GALLERY</h3>
          <span>Moments from past editions.</span>
        </header>
        <ViewfinderCarousel items={galleryPhotos} onOpen={(index) => {
          const photoIndex = viewable.indexOf(galleryPhotos[index]);
          if (photoIndex >= 0) setOpenedIndex(photoIndex);
        }} />
      </div>

      {openedIndex !== null && count > 0 && createPortal(<PhotoLightbox items={viewable} index={openedIndex} onClose={close} onNavigate={navigate} />, document.body)}
    </div>
  </section>;
}
