'use client';

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */

import { useEffect, useRef, useState } from 'react';
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from 'three';
import ThreeGlobe from 'three-globe';
import { useThree, Canvas, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import countries from '@/data/globe.json';

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const cameraZ = 300;

export function Globe({ globeConfig, data, onReady }) {
  const globeRef = useRef(null);
  const groupRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: '#ffffff',
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: 'rgba(255,255,255,0.7)',
    globeColor: '#1d072e',
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current.add(globeRef.current);
      setIsInitialized(true);
      onReady?.();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;
    const mat = globeRef.current.globeMaterial();
    mat.color = new Color(globeConfig.globeColor);
    mat.emissive = new Color(globeConfig.emissive);
    mat.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    mat.shininess = globeConfig.shininess || 0.9;
  }, [isInitialized, globeConfig.globeColor, globeConfig.emissive, globeConfig.emissiveIntensity, globeConfig.shininess]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    const points = [];
    for (let i = 0; i < data.length; i++) {
      const arc = data[i];
      points.push({ size: defaultProps.pointSize, order: arc.order, color: arc.color, lat: arc.startLat, lng: arc.startLng });
      points.push({ size: defaultProps.pointSize, order: arc.order, color: arc.color, lat: arc.endLat,   lng: arc.endLng   });
    }
    const filteredPoints = points.filter((v, i, a) =>
      a.findIndex(v2 => ['lat','lng'].every(k => v2[k] === v[k])) === i
    );

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat(d => d.startLat * 1)
      .arcStartLng(d => d.startLng * 1)
      .arcEndLat(d => d.endLat * 1)
      .arcEndLng(d => d.endLng * 1)
      .arcColor(e => e.color)
      .arcAltitude(e => e.arcAlt * 1)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap(e => e.order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor(e => e.color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings);
  }, [isInitialized, data]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;
    const interval = setInterval(() => {
      if (!globeRef.current) return;
      const newNums = genRandomNumbers(0, data.length, Math.floor((data.length * 4) / 5));
      globeRef.current.ringsData(
        data.filter((_, i) => newNums.includes(i)).map(d => ({ lat: d.startLat, lng: d.startLng, color: d.color }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [isInitialized, data]);

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);
  return null;
}

export function World(props) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas
      scene={scene}
      camera={new PerspectiveCamera(50, 1, 180, 1800)}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight} position={new Vector3(-400, 100, 400)} />
      <directionalLight color={globeConfig.directionalTopLight}  position={new Vector3(-200, 500, 200)} />
      <pointLight color={globeConfig.pointLight} position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex) {
  const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthand, (_, r, g, b) => r+r+g+g+b+b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1],16), g: parseInt(result[2],16), b: parseInt(result[3],16) } : null;
}

export function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}
