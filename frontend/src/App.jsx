'use client';

import { useState } from 'react';
import Loader from './components/Loader/Loader';
import SpaceBackground from './components/SpaceBackground/SpaceBackground';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Globe from './components/Globe/Globe';
import GlobeWrapper from './components/Globe/GlobeWrapper';
import PreviousEditions from './components/PreviousEditions/PreviousEditions';

import ScrollEffects from './components/ScrollEffects/ScrollEffects';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      <SpaceBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero isLoaded={!isLoading} onPreviousEditions={() => setShowModal(true)} />
          <GlobeWrapper />
        </main>
      </div>
      {showModal && <PreviousEditions onClose={() => setShowModal(false)} />}
      {!isLoading && <ScrollEffects />}
      {/* Scroll spacer — gives scroll distance for parallax to work */}
      <div style={{ height: '60vh' }} aria-hidden="true" />
    </div>
  );
}
