'use client';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import AboutSection from './components/Sections/AboutSection';
import GallerySection from './components/Sections/GallerySection';
import TracksSection from './components/Sections/TracksSection';
import PrizesSection from './components/Sections/PrizesSection';
import SponsorsSection from './components/Sections/SponsorsSection';
import TeamSection from './components/Sections/TeamSection';
import RegisterSection from './components/Sections/RegisterSection';
import Footer from './components/Sections/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#070b19] overflow-x-hidden selection:bg-[#ff3b6c] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <GallerySection />
        <TracksSection />
        <PrizesSection />
        <SponsorsSection />
        <TeamSection />
        <RegisterSection />
      </main>
      <Footer />
    </div>
  );
}
