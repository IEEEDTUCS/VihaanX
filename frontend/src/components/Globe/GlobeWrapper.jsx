'use client';

import dynamic from 'next/dynamic';

// Dynamically import World — no SSR (Three.js needs browser)
const World = dynamic(() => import('./GlobeComponent').then(m => ({ default: m.World })), { ssr: false });

// Theme matching Vihaan X — dark violet/purple globe with pink-red arcs
const globeConfig = {
  pointSize:           1,
  globeColor:          '#0d0520',   // deep dark purple
  showAtmosphere:      true,
  atmosphereColor:     '#7c3aed',   // violet atmosphere
  atmosphereAltitude:  0.12,
  emissive:            '#0d0520',
  emissiveIntensity:   0.15,
  shininess:           0.8,
  polygonColor:        'rgba(180,100,255,0.5)',  // soft violet continents
  ambientLight:        '#7c3aed',
  directionalLeftLight:'#ffffff',
  directionalTopLight: '#ffffff',
  pointLight:          '#ffffff',
  arcTime:             1500,
  arcLength:           0.85,
  rings:               1,
  maxRings:            3,
  initialPosition:     { lat: 22, lng: 80 },   // show India/Asia region
  autoRotate:          true,
  autoRotateSpeed:     0.5,
};

// Arc data — connections themed to hackathon (tech hubs worldwide)
const arcs = [
  { order: 1,  startLat: 28.6,   startLng: 77.2,   endLat: 37.7,   endLng: -122.4,  arcAlt: 0.3,  color: '#c084fc' },
  { order: 1,  startLat: 28.6,   startLng: 77.2,   endLat: 51.5,   endLng: -0.1,    arcAlt: 0.25, color: '#a855f7' },
  { order: 2,  startLat: 28.6,   startLng: 77.2,   endLat: 35.6,   endLng: 139.7,   arcAlt: 0.2,  color: '#ec4899' },
  { order: 2,  startLat: 19.0,   startLng: 72.8,   endLat: 40.7,   endLng: -74.0,   arcAlt: 0.35, color: '#f43f5e' },
  { order: 3,  startLat: 1.3,    startLng: 103.8,  endLat: 48.8,   endLng: 2.3,     arcAlt: 0.28, color: '#c084fc' },
  { order: 3,  startLat: 31.2,   startLng: 121.5,  endLat: 37.7,   endLng: -122.4,  arcAlt: 0.22, color: '#a855f7' },
  { order: 4,  startLat: 55.7,   startLng: 37.6,   endLat: 40.7,   endLng: -74.0,   arcAlt: 0.3,  color: '#ec4899' },
  { order: 4,  startLat: -23.5,  startLng: -46.6,  endLat: 51.5,   endLng: -0.1,    arcAlt: 0.38, color: '#f43f5e' },
  { order: 5,  startLat: 37.5,   startLng: 127.0,  endLat: 28.6,   endLng: 77.2,    arcAlt: 0.18, color: '#c084fc' },
  { order: 5,  startLat: 25.2,   startLng: 55.3,   endLat: 48.8,   endLng: 2.3,     arcAlt: 0.2,  color: '#a855f7' },
  { order: 6,  startLat: -33.8,  startLng: 151.2,  endLat: 35.6,   endLng: 139.7,   arcAlt: 0.15, color: '#ec4899' },
  { order: 6,  startLat: 34.0,   startLng: -118.2, endLat: 28.6,   endLng: 77.2,    arcAlt: 0.32, color: '#f43f5e' },
];

export default function GlobeWrapper({ onReady }) {
  return (
    <div
      className="parallax-globe pointer-events-none absolute hidden lg:block"
      style={{
        bottom:    '-22vw',
        left:      '-22vw',
        width:     '68vw',
        height:    '68vw',
        maxWidth:  '920px',
        maxHeight: '920px',
        zIndex:    2,
        aspectRatio: '1 / 1',
      }}
    >
      <World globeConfig={globeConfig} data={arcs} onReady={onReady} />
    </div>
  );
}
