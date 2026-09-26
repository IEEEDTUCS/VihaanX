import { useState } from 'react';
import Loader from './components/Loader/Loader';
import SpaceBackground from './components/SpaceBackground/SpaceBackground';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import StatsBar from './components/StatsBar/StatsBar';
import PreviousEditions from './components/PreviousEditions/PreviousEditions';
import './App.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app">
      {/* Loader */}
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

      {/* 3-D background: stars + Jupiter */}
      <SpaceBackground />

      {/* HTML overlay */}
      <div className="content-overlay">
        <Navbar />
        <main>
          <Hero
            isLoaded={!isLoading}
            onPreviousEditions={() => setShowModal(true)}
          />
          <StatsBar />
        </main>
      </div>

      {/* Previous Editions modal */}
      {showModal && <PreviousEditions onClose={() => setShowModal(false)} />}
    </div>
  );
}
