'use client';

import { useState, useRef, useCallback } from 'react';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Tracks from './components/Tracks/Tracks';
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

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero
            isLoaded={!isLoading}
            onPreviousEditions={() => setShowModal(true)}
            onGlobeReady={handleGlobeReady}
          />
          <Tracks />
        </main>
      </div>

      {showModal && <PreviousEditions onClose={() => setShowModal(false)} />}
    </div>
  );
}
