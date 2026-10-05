'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export default function Globe() {
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const phiRef   = useRef(1.2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Must set canvas pixel dimensions explicitly
    const SIZE = 800;
    canvas.width  = SIZE;
    canvas.height = SIZE;

    globeRef.current = createGlobe(canvas, {
      devicePixelRatio: 2,
      width:  SIZE,
      height: SIZE,
      phi:    1.2,
      theta:  0.28,
      dark:   1,
      diffuse: 1.6,
      mapSamples:    16000,
      mapBrightness: 7,
      baseColor:   [0.05, 0.03, 0.12],
      markerColor: [0.95, 0.3,  0.5 ],
      glowColor:   [0.18, 0.06, 0.28],
      markers: [
        { location: [28.6,  77.2  ], size: 0.05 },
        { location: [19.0,  72.8  ], size: 0.05 },
        { location: [40.7,  -74.0 ], size: 0.06 },
        { location: [51.5,  -0.1  ], size: 0.05 },
        { location: [48.8,  2.3   ], size: 0.05 },
        { location: [35.6,  139.7 ], size: 0.06 },
        { location: [31.2,  121.5 ], size: 0.05 },
        { location: [37.5,  127.0 ], size: 0.05 },
        { location: [-23.5, -46.6 ], size: 0.05 },
        { location: [55.7,  37.6  ], size: 0.05 },
        { location: [1.3,   103.8 ], size: 0.04 },
        { location: [25.2,  55.3  ], size: 0.04 },
        { location: [-33.8, 151.2 ], size: 0.04 },
        { location: [34.0,  -118.2], size: 0.05 },
        { location: [43.6,  -79.4 ], size: 0.04 },
        { location: [52.5,  13.4  ], size: 0.04 },
      ],
      onRender(state) {
        phiRef.current += 0.003;
        state.phi = phiRef.current;
      },
    });

    canvas.style.opacity = '1';

    return () => {
      globeRef.current?.destroy();
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute hidden md:block"
      style={{
        bottom:    '-22vw',
        left:      '-20vw',
        width:     '58vw',
        height:    '58vw',
        maxWidth:  '820px',
        maxHeight: '820px',
        zIndex:    2,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width:      '100%',
          height:     '100%',
          opacity:    0,
          transition: 'opacity 1.2s ease',
        }}
      />
    </div>
  );
}
