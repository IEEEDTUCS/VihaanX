'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { galleryPhotos } from '../../data/gallery.js';
import GalleryAtmosphere from '../Gallery/GalleryAtmosphere';
import ViewfinderCarousel from '../Gallery/ViewfinderCarousel';

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path strokeLinecap="round" d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

function ArrowIcon({ reverse = false }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`h-5 w-5 ${reverse ? 'rotate-180' : ''}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
    </svg>
  );
}

function PhotoLightbox({ items, index, onClose, onNavigate }) {
  const dialog = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  const active = items[index];
  if (!active) return null;

  return (
    <dialog
      ref={dialog}
      aria-label="Gallery photo viewer"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          onNavigate(e.key === 'ArrowRight' ? 1 : -1);
        }
      }}
      className="m-auto w-[94vw] max-w-6xl rounded-2xl border border-white/20 bg-[#070b19] p-5 text-white backdrop:bg-black/90"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-sm tracking-wider text-white/70">
          {index + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          aria-label="Previous photo"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
        >
          <ArrowIcon reverse />
        </button>

        <div className="relative flex-1 flex items-center justify-center min-h-[300px] max-h-[70dvh] overflow-hidden rounded-xl bg-black/40">
          <img
            src={active.src}
            alt={active.alt}
            className="max-h-[70dvh] w-auto max-w-full object-contain select-none"
          />
        </div>

        <button
          type="button"
          onClick={() => onNavigate(1)}
          aria-label="Next photo"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
        >
          <ArrowIcon />
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="font-tech text-base sm:text-lg text-white font-bold tracking-wide">
          {active.caption}
        </p>
        {active.year && (
          <span className="inline-block mt-1 text-xs font-mono tracking-widest text-[#ff3b6c] px-2.5 py-0.5 rounded-full border border-[#ff3b6c]/30 bg-[#ff3b6c]/10">
            VIHAAN · {active.year}
          </span>
        )}
      </div>
    </dialog>
  );
}


export default function GallerySection() {
  const [openedIndex, setOpenedIndex] = useState(null);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const root = useRef(null);
  const viewable = galleryPhotos.filter((photo) => photo.src && photo.alt);
  const close = useCallback(() => setOpenedIndex(null), []);
  const count = viewable.length;

  const navigate = useCallback(
    (delta) =>
      setOpenedIndex((current) =>
        current === null || !count ? null : (current + delta + count) % count
      ),
    [count]
  );

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const nodes = root.current?.querySelectorAll('.archive-reveal');
    nodes?.forEach((node) => {
      node.classList.add('reveal-ready');
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, [viewMode]);

  return (
    <section
      id="gallery"
      ref={root}
      aria-labelledby="gallery-title"
      className="gallery-experience relative isolate scroll-mt-20 overflow-hidden px-4 py-24 sm:px-8 sm:py-28"
    >
      <GalleryAtmosphere />
      <div className="gallery-content relative z-10 mx-auto w-full max-w-6xl">
        <div>
          <header className="archive-heading archive-reveal text-center">
            <p className="font-tech">// ARCHIVES</p>
            <h3 id="gallery-title" className="font-tech">GALLERY</h3>
            <span>Moments from past editions.</span>

            {/* View Mode Switcher */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono tracking-widest transition-all duration-300 ${
                  viewMode === 'carousel'
                    ? 'bg-[#ff3b6c] text-white shadow-[0_0_20px_rgba(255,59,108,0.6)] font-bold'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <span>3D VIEW</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono tracking-widest transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-[#ff3b6c] text-white shadow-[0_0_20px_rgba(255,59,108,0.6)] font-bold'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <span>ALL PHOTOS ({count})</span>
              </button>
            </div>
          </header>

          {viewMode === 'carousel' ? (
            <div className="mt-2">
              <ViewfinderCarousel
                items={galleryPhotos}
                onOpen={(index) => {
                  const photoIndex = viewable.indexOf(galleryPhotos[index]);
                  if (photoIndex >= 0) setOpenedIndex(photoIndex);
                }}
              />

              {/* Quick Thumbnail Strip below carousel */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="font-mono text-xs text-white/50 tracking-widest">
                    QUICK INDEX // CLICK ANY PHOTO TO EXPAND
                  </span>
                  <span className="font-mono text-xs text-[#ff3b6c]">
                    {count} ARCHIVES
                  </span>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/20">
                  {galleryPhotos.map((photo, idx) => (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setOpenedIndex(idx)}
                      className="group relative h-16 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/5 hover:border-[#ff3b6c] hover:shadow-[0_0_15px_rgba(255,59,108,0.4)] transition-all"
                      aria-label={`Open ${photo.caption}`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-black/70 px-1 py-0.5 rounded text-white/90">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Responsive Grid View */
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryPhotos.map((photo, index) => (
                <div
                  key={photo.src}
                  onClick={() => setOpenedIndex(index)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#091129]/60 backdrop-blur-md transition-all duration-300 hover:border-[#ff3b6c]/60 hover:shadow-[0_0_30px_rgba(255,59,108,0.25)] hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-black/40">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-tech text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {photo.caption}
                      </p>
                      <span className="font-mono text-[10px] text-white/50 tracking-wider">
                        VIHAAN // {photo.year}
                      </span>
                    </div>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 group-hover:border-[#ff3b6c] group-hover:bg-[#ff3b6c] group-hover:text-white transition-all">
                      <svg width={14} height={14} style={{ width: 14, height: 14 }} className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>



        {openedIndex !== null && count > 0 && (
          createPortal(
            <PhotoLightbox
              items={viewable}
              index={openedIndex}
              onClose={close}
              onNavigate={navigate}
            />,
            document.body
          )
        )}
      </div>
    </section>
  );
}
