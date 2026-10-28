'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { galleryPhotos, pastEditions } from '../../data/gallery.js';
import ArchiveMedia from '../Gallery/ArchiveMedia';
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

function EditionCard({ edition, index }) {
  const pointer = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
    card.style.setProperty('--tilt-x', `${((0.5 - (event.clientY - rect.top) / rect.height) * 5).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${((((event.clientX - rect.left) / rect.width) - 0.5) * 6).toFixed(2)}deg`);
  };
  const resetTilt = (event) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };
  return <article className="edition-card archive-reveal" style={{ '--reveal-delay': `${index * 100}ms` }} onPointerMove={pointer} onPointerLeave={resetTilt}>
    <span className="edition-halo" aria-hidden="true" />
    <div className="edition-thumbnail"><ArchiveMedia src={edition.src} alt={edition.alt || `VIHAAN ${edition.edition} archive`} label="Edition image coming soon" /></div>
    <h4 className="font-tech">VIHAAN {edition.edition}</h4>
    <p>{edition.year || 'Year to be added'}</p>
    <p>{edition.theme || 'Theme to be added'}</p>
    {edition.href && <a className="edition-link" href={edition.href} target="_blank" rel="noopener noreferrer">Visit VIHAAN {edition.edition}<span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>}
  </article>;
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

      <div className="archive-divider" aria-hidden="true" />

      <section id="past-editions" aria-labelledby="editions-title" className="scroll-mt-24">
        <h3 id="editions-title" className="archive-editions-title archive-reveal font-tech text-center">PAST EDITIONS</h3>
        <div className="edition-grid">{pastEditions.map((edition, index) => <EditionCard key={edition.edition} edition={edition} index={index} />)}</div>
      </section>

      {openedIndex !== null && count > 0 && createPortal(<PhotoLightbox items={viewable} index={openedIndex} onClose={close} onNavigate={navigate} />, document.body)}
    </div>
  </section>;
}
