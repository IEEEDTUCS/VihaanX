/**
 * VihaanPlanet — interactive 3D ringed planet (VihaanX palette)
 *
 * Install:  npm i three
 * Use:      <VihaanPlanet style={{ position: "absolute", right: 0, top: 0, width: "60%", height: "100%" }} />
 *
 * - Planet spins slowly; 3 ring bands spin at different speeds / directions.
 * - Move cursor / finger over the rings: particles scatter + ripple away.
 * - Click / tap: shockwave through the rings.
 * - Drag: spin the whole planet with inertia (vertical page scroll still works on touch).
 * - Transparent canvas: drop it on top of your own space background.
 * - Pauses off-screen, respects prefers-reduced-motion, cleans up on unmount.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

// ---- Dusty rose/salmon gas giant — exact mockup match ----
const PALETTE = {
  planetBands: ["#1a0a0d", "#4a1520", "#8b3040", "#c06070", "#d4907a", "#e8b09a"],
  ringColors:  ["#f4c4a0", "#e8906a", "#d06050", "#ff8878"],
  atmosphere:  "#d07060",
  rim:         "#ff9070",
};

// Ring bands: [innerR, outerR, particles, speed (rad/s), size]
const BANDS = [
  [1.55, 1.95, 5000,  0.28,  1.6],   // inner  — fast forward
  [2.0,  2.55, 7000, -0.14,  1.9],   // middle — slow reverse
  [2.65, 3.25, 7000,  0.07,  2.2],   // outer  — medium forward
];

function makePlanetTexture() {
  // Procedural coral/crimson gas-giant surface: streaky cloud bands + storm spots,
  // so the planet's spin is clearly visible (plain horizontal bands hide rotation).
  const w = 1024, h = 512;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d");
  const img = g.createImageData(w, h);
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise = (x, y, px) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi % px, yi), b = hash((xi + 1) % px, yi), c2 = hash(xi % px, yi + 1), d = hash((xi + 1) % px, yi + 1);
    return a + (b - a) * u + (c2 - a) * v + (a - b - c2 + d) * u * v;
  };
  const fbm = (u, v) => {
    let s = 0, amp = 0.55, tot = 0;
    for (let o = 0; o < 5; o++) {
      const fx = 4 * 2 ** o;
      s += noise(u * fx, v * 14 * 2 ** o, fx) * amp; tot += amp; amp *= 0.5;
    }
    return s / tot;
  };
  const ramp = ["#1a0a0d", "#4a1520", "#8b3040", "#c06070", "#d4907a"].map((x) => new THREE.Color(x));
  const purple = new THREE.Color(PALETTE.planetBands[5]);
  const col = new THREE.Color();
  for (let y = 0; y < h; y++) {
    const v = y / h;
    const polar = Math.pow(Math.abs(v - 0.5) * 2, 3);
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const n = fbm(u, v);
      let t = 0.5 + 0.5 * Math.sin(v * 34 + (n - 0.5) * 9);
      t = 0.2 + t * 0.5 + (n - 0.5) * 0.7;
      // storm spots
      for (const [su, sv, sr] of [[0.3, 0.6, 0.07], [0.72, 0.38, 0.045]]) {
        let du = Math.abs(u - su); du = Math.min(du, 1 - du);
        const d = Math.hypot(du * 2.2, v - sv) / sr;
        if (d < 1) t += (1 - d) * 0.35 * (0.6 + 0.4 * Math.sin(Math.atan2(v - sv, du) * 3 + d * 8));
      }
      t = Math.min(0.999, Math.max(0, t * (1 - polar * 0.45)));
      const f = t * (ramp.length - 1), i = Math.floor(f);
      col.copy(ramp[i]).lerp(ramp[i + 1], f - i).lerp(purple, polar * 0.55);
      const k = (y * w + x) * 4;
      img.data[k] = col.r * 255; img.data[k + 1] = col.g * 255; img.data[k + 2] = col.b * 255; img.data[k + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

const discVert = /* glsl */ `
  varying vec2 vP;
  void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const discFrag = /* glsl */ `
  varying vec2 vP; uniform float uPhase; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
  void main(){
    float r = length(vP);
    float ang = atan(vP.y, vP.x) + uPhase;
    float g = 0.5 + 0.5 * sin(r * 140.0) * (0.5 + 0.5 * sin(r * 23.0));       // fine grooves
    float band = 0.5 + 0.5 * sin(r * 9.0 + sin(r * 31.0) * 1.5);
    float gap = smoothstep(2.54, 2.56, r) * (1.0 - smoothstep(2.64, 2.66, r)); // dark gap between rings
    float streak = 0.75 + 0.25 * sin(ang * 6.0 + sin(r * 5.0) * 3.0);          // rotates with uPhase
    float edge = smoothstep(1.5, 1.62, r) * (1.0 - smoothstep(3.1, 3.3, r));
    vec3 col = mix(uA, uB, band); col = mix(col, uC, g * 0.35);
    gl_FragColor = vec4(col * 1.2, edge * (0.18 + 0.3 * g) * (1.0 - gap * 0.95) * streak);
  }`;

const ringVert = /* glsl */ `
  attribute float aR; attribute float aA; attribute float aY; attribute float aSize; attribute vec3 aColor;
  uniform float uPhase; uniform vec3 uMouse; uniform float uPush; uniform float uTime; uniform float uPR; uniform float uBase;
  varying vec3 vColor; varying float vGlow;
  void main(){
    float a = aA + uPhase * inversesqrt(aR);          // inner particles orbit faster
    vec3 p = vec3(cos(a) * aR, aY, sin(a) * aR);
    vec2 d = p.xz - uMouse.xz;
    float dist = length(d);
    float f = smoothstep(0.9, 0.0, dist) * uPush;
    p.xz += normalize(d + 1e-4) * f * 0.55;
    p.y  += sin(dist * 14.0 - uTime * 6.0) * f * 0.14;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uBase * uPR * (1.0 + f * 1.4) * (6.5 / -mv.z);
    vColor = aColor; vGlow = f;
  }`;
const ringFrag = /* glsl */ `
  varying vec3 vColor; varying float vGlow;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor * (1.0 + vGlow * 1.5), a * (0.55 + vGlow * 0.45));
  }`;

const atmoVert = /* glsl */ `
  varying vec3 vN;
  void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const atmoFrag = /* glsl */ `
  varying vec3 vN; uniform vec3 uColor;
  void main(){ float i = pow(max(0.0, 0.72 - dot(vN, vec3(0.,0.,1.))), 4.5); gl_FragColor = vec4(uColor, 1.0) * i * 0.6; }`;

export default function VihaanPlanet({
  className,
  style,
  planetSpeed = 0.14, // rad/s
  ringSpeed = 1,       // multiplier for all rings
  interactive = true,
  tilt = 0.38,
}) {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block", touchAction: "pan-y" });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    // lights: warm key, magenta fill, violet rim
    scene.add(new THREE.AmbientLight(0x2a1015, 0.6));
    const key = new THREE.DirectionalLight(0xffb090, 2.8); key.position.set(-4, 2.5, 5); scene.add(key);
    const fill = new THREE.PointLight(0xff7060, 20, 30); fill.position.set(5, -2, -2); scene.add(fill);
    const rim = new THREE.PointLight(new THREE.Color(PALETTE.rim), 18, 30); rim.position.set(-5, 3, -4); scene.add(rim);

    const system = new THREE.Group();   // everything (drag + parallax)
    const tiltG = new THREE.Group();    // axial tilt
    tiltG.rotation.set(tilt, 0, -tilt * 0.55);
    system.add(tiltG);
    scene.add(system);

    // planet
    const tex = makePlanetTexture();
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 64),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.82, metalness: 0.02, emissive: 0x2a0810, emissiveIntensity: 0.12 })
    );
    tiltG.add(planet);
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.14, 64, 48),
      new THREE.ShaderMaterial({
        vertexShader: atmoVert, fragmentShader: atmoFrag,
        uniforms: { uColor: { value: new THREE.Color(PALETTE.atmosphere) } },
        side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
      })
    );
    tiltG.add(atmo);

    // rings (particles, each band has its own phase + speed)
    const ringGroup = new THREE.Group();
    tiltG.add(ringGroup);
    const disc = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 3.3, 256, 1),
      new THREE.ShaderMaterial({
        vertexShader: discVert, fragmentShader: discFrag, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uPhase: { value: 0 }, uA: { value: new THREE.Color("#e8906a") }, uB: { value: new THREE.Color("#f4c4a0") }, uC: { value: new THREE.Color("#d06050") } },
      })
    );
    disc.rotation.x = -Math.PI / 2;
    ringGroup.add(disc);
    const ringCols = PALETTE.ringColors.map((c) => new THREE.Color(c));
    const shared = { uMouse: { value: new THREE.Vector3(99, 0, 99) }, uPush: { value: 0 }, uTime: { value: 0 }, uPR: { value: pr } };
    const bands = BANDS.map(([r0, r1, n, speed, size], bi) => {
      const aR = new Float32Array(n), aA = new Float32Array(n), aY = new Float32Array(n), aSize = new Float32Array(n), aColor = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        aR[i] = r0 + Math.sqrt(Math.random()) * (r1 - r0);
        aA[i] = Math.random() * Math.PI * 2;
        aY[i] = (Math.random() - 0.5) * 0.035;
        aSize[i] = 0.5 + Math.random() * 1.0;
        const col = ringCols[(bi + (Math.random() < 0.3 ? 1 : 0) + Math.floor(Math.random() * 2)) % ringCols.length].clone();
        col.multiplyScalar(0.55 + Math.random() * 0.45);
        aColor.set([col.r, col.g, col.b], i * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      geo.setAttribute("aR", new THREE.BufferAttribute(aR, 1));
      geo.setAttribute("aA", new THREE.BufferAttribute(aA, 1));
      geo.setAttribute("aY", new THREE.BufferAttribute(aY, 1));
      geo.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
      geo.setAttribute("aColor", new THREE.BufferAttribute(aColor, 3));
      const mat = new THREE.ShaderMaterial({
        vertexShader: ringVert, fragmentShader: ringFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { ...shared, uPhase: { value: Math.random() * 6 }, uBase: { value: size } },
      });
      const pts = new THREE.Points(geo, mat);
      pts.frustumCulled = false;
      ringGroup.add(pts);
      return { mat, speed };
    });

    // sizing
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 0.9 ? 12.5 : 9.5; // pull back on portrait/mobile
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();

    // interaction
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), inv = new THREE.Matrix4();
    const hit = new THREE.Vector3(), localRay = new THREE.Ray();
    const ptr = { x: 0, y: 0, inside: false, down: false, lx: 0, ly: 0 };
    const drag = { vx: 0, vy: 0, ry: 0, rx: 0 };
    let pushTarget = 0, pulse = 0;

    const setPtr = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ptr.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onMove = (e) => {
      setPtr(e); ptr.inside = true;
      if (ptr.down) {
        drag.vy = (e.clientX - ptr.lx) * 0.006;
        drag.vx = (e.clientY - ptr.ly) * 0.004;
        ptr.lx = e.clientX; ptr.ly = e.clientY;
      }
    };
    const onDown = (e) => { setPtr(e); ptr.down = true; ptr.inside = true; ptr.lx = e.clientX; ptr.ly = e.clientY; pulse = 1; };
    const onUp = () => { ptr.down = false; };
    const onLeave = () => { ptr.inside = false; ptr.down = false; };
    const cv = renderer.domElement;
    if (interactive) {
      cv.addEventListener("pointermove", onMove);
      cv.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      cv.addEventListener("pointerleave", onLeave);
    }

    // loop (paused offscreen)
    let visible = true, raf = 0, last = performance.now();
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(el);

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const t = now / 1000;
      const m = reduce ? 0.15 : 1;

      planet.rotation.y += planetSpeed * dt * m;
      atmo.rotation.y = planet.rotation.y;

      // ring phases — hovering speeds rings up slightly
      const boost = 1 + pushTarget * 1.2;
      bands.forEach((b) => { b.mat.uniforms.uPhase.value += b.speed * ringSpeed * boost * dt * m; });

      disc.material.uniforms.uPhase.value += 0.11 * ringSpeed * dt * m;

      // drag inertia + parallax tilt toward cursor
      if (!ptr.down) { drag.vy *= 0.94; drag.vx *= 0.94; }
      drag.ry += drag.vy; drag.rx = THREE.MathUtils.clamp(drag.rx + drag.vx, -0.6, 0.6);
      drag.rx *= 0.985;
      const px = ptr.inside ? ptr.x : 0, py = ptr.inside ? ptr.y : 0;
      system.rotation.y += (drag.ry + px * 0.18 - system.rotation.y) * 0.06;
      system.rotation.x += (drag.rx - py * 0.12 - system.rotation.x) * 0.06;
      system.position.y = Math.sin(t * 0.6) * 0.05; // gentle float

      // cursor → ring-plane intersection (in ring-local space)
      let over = false;
      if (interactive && ptr.inside) {
        ndc.set(ptr.x, ptr.y);
        ray.setFromCamera(ndc, camera);
        ringGroup.updateWorldMatrix(true, false);
        inv.copy(ringGroup.matrixWorld).invert();
        localRay.copy(ray.ray).applyMatrix4(inv);
        if (localRay.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit)) {
          const rr = Math.hypot(hit.x, hit.z);
          if (rr > 1.2 && rr < 3.8) { shared.uMouse.value.copy(hit); over = true; }
        }
      }
      pushTarget = over ? 1 : 0;
      pulse *= 0.93;
      const u = shared.uPush;
      u.value += (pushTarget * (1 + pulse * 2.2) - u.value) * 0.12;
      shared.uTime.value = t;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", onUp);
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose?.();
      });
      tex.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [planetSpeed, ringSpeed, interactive, tilt]);

  return (
    <div
      ref={host}
      className={className}
      style={{ width: "100%", height: "100%", minHeight: 320, position: "relative", ...style }}
      aria-label="Interactive 3D ringed planet"
      role="img"
    />
  );
}
