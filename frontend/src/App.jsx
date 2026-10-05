'use client';

import { useState } from 'react';
import Loader from './components/Loader/Loader';
import SpaceBackground from './components/SpaceBackground/SpaceBackground';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import GlobeWrapper from './components/Globe/GlobeWrapper';
import PreviousEditions from './components/PreviousEditions/PreviousEditions';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

      <SpaceBackground />

      {/* Globe — rendered immediately so it loads during the loader,
          but visually hidden until loader completes */}
      <div style={{
        opacity:    isLoading ? 0 : 1,
        transition: 'opacity 0.8s ease',
        pointerEvents: isLoading ? 'none' : 'auto',
      }}>
        <GlobeWrapper />
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
