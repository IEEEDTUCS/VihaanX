'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GalleryAtmosphere from '../Gallery/GalleryAtmosphere';

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (i * 37) % 100,
  y: (i * 61) % 100,
  size: 1 + ((i * 17) % 3),
  duration: 15 + ((i * 11) % 16),
  delay: (i * 7) % 5,
  opacity: 0.1 + ((i * 13) % 4) * 0.08,
}));

function BackgroundAtmosphere({ backgroundY }) {
  return (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(rgba(56,189,248,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.12) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: particle.id % 2 ? '#38bdf8' : '#ff3b6c',
            }}
            animate={{
              y: [0, -30, 8, 0],
              x: [0, 12, -8, 0],
              opacity: [particle.opacity, particle.opacity * 2, particle.opacity, particle.opacity],
            }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <motion.div
        className="absolute top-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-[#ff3b6c]/[0.05] blur-[120px] pointer-events-none"
        style={{ y: backgroundY }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-[#38bdf8]/[0.05] blur-[120px] pointer-events-none"
        style={{ y: backgroundY }}
      />
    </>
  );
}

function AboutPeripheralGraphics() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-visible lg:block" aria-hidden="true">
      <motion.div
        className="absolute left-[4%] top-[10%] h-24 w-24 rounded-full border border-cyan-300/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_#38bdf8]" />
        <span className="absolute inset-3 rounded-full border border-dashed border-cyan-300/20" />
      </motion.div>
      <motion.div
        className="absolute left-[8%] bottom-[14%] h-16 w-16 rounded-full bg-gradient-to-br from-pink-400/30 via-purple-500/20 to-transparent shadow-[0_0_35px_rgba(255,59,108,0.22)]"
        animate={{ y: [0, -8, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="absolute -inset-3 rounded-full border border-pink-300/20" />
        <span className="absolute -inset-6 rounded-full border border-dashed border-pink-300/15 rotate-45" />
      </motion.div>
      <motion.div
        className="absolute right-[5%] top-[16%] h-28 w-28 rounded-full border border-pink-300/15"
        animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="absolute inset-3 rounded-full border border-pink-300/20" />
        <span className="absolute inset-7 rounded-full border border-pink-300/30" />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300 shadow-[0_0_12px_#ff3b6c]" />
      </motion.div>
      <div className="absolute right-[9%] bottom-[16%] h-24 w-28 opacity-50">
        <span className="absolute left-2 top-5 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
        <span className="absolute left-14 top-1 h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
        <span className="absolute right-1 top-14 h-1.5 w-1.5 rounded-full bg-pink-300 shadow-[0_0_8px_#ff3b6c]" />
        <span className="absolute left-3 top-6 h-px w-14 rotate-[-18deg] bg-gradient-to-r from-white/60 to-cyan-300/10" />
        <span className="absolute left-14 top-3 h-px w-12 rotate-[58deg] bg-gradient-to-r from-cyan-300/60 to-pink-300/10" />
      </div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex min-h-[28rem] w-full items-center overflow-hidden bg-gradient-to-b from-[#070b19] via-[#091129] to-[#070b19] px-4 py-24 sm:px-8 sm:py-28"
    >
      <BackgroundAtmosphere backgroundY={backgroundY} />
      <GalleryAtmosphere minimal />

      <div className="relative z-10 mx-auto w-full max-w-7xl text-center">
        <motion.h2
          className="mb-10 font-tech text-4xl font-black tracking-wider text-white sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          ABOUT VIHAAN <span className="bg-gradient-to-r from-[#ff3b6c] to-[#ff6b8a] bg-clip-text text-transparent">X</span>
        </motion.h2>
        <div className="relative mx-auto mt-2 max-w-7xl">
        <AboutPeripheralGraphics />
        <motion.article
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1433]/85 via-[#0e1940]/70 to-[#0c1433]/85 p-8 text-left shadow-2xl backdrop-blur-2xl sm:p-10 lg:p-12"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <motion.div
            className="pointer-events-none absolute -right-24 -bottom-28 h-72 w-72 rounded-full bg-[#ff3b6c]/10 blur-3xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#38bdf8]/10 blur-3xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <span className="absolute right-6 top-6 h-3 w-3 border-r border-t border-cyan-300/70" />
          <span className="absolute bottom-6 left-6 h-3 w-3 border-b border-l border-pink-300/70" />

          <motion.div
            className="relative z-10 max-w-3xl space-y-5 text-lg font-light leading-relaxed text-white/75 sm:text-xl"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p>
              VIHAAN X is the 10th edition of North India&apos;s largest student-run hackathon,
              organised by the IEEE Student Branch at Delhi Technological University. It brings
              together students from across the country for a high-energy, collaborative build
              experience where they can explore their own problem statements, create meaningful
              technology and turn ideas into solutions for real-world challenges.
            </p>
            <p>
              Participants choose a track and define a problem worth solving, then work together
              to turn their ideas into functional prototypes. VIHAAN X is a space to learn,
              experiment and meet people who can help a promising idea move from concept to impact.
            </p>
          </motion.div>

        </motion.article>
        </div>
      </div>
    </section>
  );
}
