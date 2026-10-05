'use client';

import { useState, useRef, useCallback } from 'react';
import Loader from './components/Loader/Loader';
import SpaceBackground from './components/SpaceBackground/SpaceBackground';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import GlobeWrapper from './components/Globe/GlobeWrapper';
import PreviousEditions from './components/PreviousEditions/PreviousEditions';

export default function App() {
  const [isLoading,   setIsLoading]   = useState(true);
  const [showModal,   setShowModal]   = useState(false);

  // Both gates must pass before loader dismisses
  const loaderDoneRef = useRef(false);
  const globeReadyRef = useRef(false);

  const tryDismiss = useCallback(() => {
    if (loaderDoneRef.current && globeReadyRef.current) {
      setIsLoading(false);
    }
  }, []);

  const handleLoaderComplete = useCallback(() => {
    loaderDoneRef.current = true;
    tryDismiss();
  }, [tryDismiss]);

  const handleGlobeReady = useCallback(() => {
    globeReadyRef.current = true;
    tryDismiss();
  }, [tryDismiss]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {isLoading && <Loader onComplete={handleLoaderComplete} />}

      <SpaceBackground />

      {/* Globe rendered immediately — loads in background during loader */}
      <div style={{
        opacity:       isLoading ? 0 : 1,
        transition:    'opacity 0.6s ease',
        pointerEvents: isLoading ? 'none' : 'auto',
      }}>
        <GlobeWrapper onReady={handleGlobeReady} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero isLoaded={!isLoading} onPreviousEditions={() => setShowModal(true)} />
        </main>
      </div>

      {showModal && <PreviousEditions onClose={() => setShowModal(false)} />}
    </div>
  );
}
