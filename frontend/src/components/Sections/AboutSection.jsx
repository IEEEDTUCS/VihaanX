'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER – numbers roll up when scrolled into view
   ═══════════════════════════════════════════════════════════ */
function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const numericValue = parseInt(value.replace(/[^\d]/g, ''), 10) || 0;

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numericValue, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════
   FLOATING PARTICLES – ambient dots moving on the background
   ═══════════════════════════════════════════════════════════ */
/* Pre-computed particle positions (deterministic, no Math.random in render) */
const PARTICLES = Array.from({ length: 30 }, (_, i) => {
  // Simple seeded pseudo-random using index
  const seed = (i * 2654435761) >>> 0;
  const r = (n) => ((seed * (n + 1) * 16807) % 2147483647) / 2147483647;
  return {
    id: i,
    x: r(1) * 100,
    y: r(2) * 100,
    size: r(3) * 3 + 1,
    duration: r(4) * 20 + 15,
    delay: r(5) * 5,
    opacity: r(6) * 0.4 + 0.1,
  };
});

function FloatingParticles() {
  const particles = PARTICLES;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? '#ff3b6c' : p.id % 3 === 1 ? '#38bdf8' : '#a855f7',
          }}
          animate={{
            y: [0, -40, 10, -20, 0],
            x: [0, 15, -10, 20, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED GRID BACKGROUND
   ═══════════════════════════════════════════════════════════ */
function AnimatedGrid() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 2 }}
      style={{
        backgroundImage:
          'linear-gradient(rgba(56,189,248,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.12) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   CHEVRON ICON
   ═══════════════════════════════════════════════════════════ */
const ChevronIcon = ({ open }) => (
  <svg
    className={`w-4 h-4 text-white/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   MOTION VARIANTS
   ═══════════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const staggerContainerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */
const stats = [
  { label: 'EDITION', value: '10', suffix: 'TH', isOrdinal: true, detail: 'A Decade of Innovation' },
  { label: 'HACKING SPRINT', value: '24', suffix: ' HRS', isOrdinal: false, detail: 'Non-stop Building' },
  { label: 'PARTICIPANTS', value: '2500', suffix: '+', isOrdinal: false, detail: 'Pan-India Reach' },
  { label: 'PRIZE POOL', value: '5', suffix: 'L+', isOrdinal: false, detail: 'Cash & Tech Bounties', prefix: '₹' },
];

const softwareDomains = [
  { name: 'HealthTech' },
  { name: 'FinTech' },
  { name: 'Education' },
  { name: 'Web3 & Blockchain' },
  { name: 'E-Sports' },
  { name: "Women's Safety" },
  { name: 'Security' },
  { name: 'Sustainability' },
  { name: 'Open Innovation' },
];

const hardwareDomains = [
  { name: 'IoT (Internet of Things)' },
  { name: 'AgriTech' },
  { name: 'Smart City & Civic Tech' },
  { name: 'Sustainability' },
  { name: 'Open Innovation' },
];

const highlights = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: 'Team of Up to 4',
    desc: 'Collaborate in squads of up to four, blending diverse skills for maximum impact.',
    color: '#ff3b6c',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Expert Mentorship',
    desc: 'Hands-on guidance from seasoned industry professionals and domain experts.',
    color: '#38bdf8',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-7.54 0" />
      </svg>
    ),
    title: 'Exciting Cash Prizes',
    desc: 'Compete for a massive prize pool with cash awards, tech bounties, and exclusive swag.',
    color: '#fbbf24',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: 'Project Showcase',
    desc: 'Present your hack to a panel of judges, sponsors, and the broader tech community.',
    color: '#a855f7',
  },
];

/* ═══════════════════════════════════════════════════════════
   COLLAPSIBLE TRACK PANEL
   ═══════════════════════════════════════════════════════════ */
function TrackPanel({ title, color, borderColor, bgColor, domains, defaultOpen = false, index }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      variants={index === 0 ? fadeLeft : fadeRight}
      className={`rounded-2xl border ${borderColor} ${bgColor} backdrop-blur-xl transition-all duration-300 overflow-hidden hover:shadow-lg`}
      style={{ '--glow': color }}
      whileHover={{ boxShadow: `0 0 30px ${color}22` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 cursor-pointer focus:outline-none group"
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h4 className="font-tech text-base sm:text-lg font-bold tracking-wider text-white group-hover:text-white/90 transition-colors">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.62rem] font-mono text-white/40 tracking-wider hidden sm:inline">
            {domains.length} DOMAINS
          </span>
          <ChevronIcon open={open} />
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: open ? 'auto' : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6">
          <div className="border-t border-white/5 pt-4" />
          <motion.div
            className="flex flex-wrap gap-2.5"
            variants={staggerContainerFast}
            initial="hidden"
            animate={open ? 'visible' : 'hidden'}
          >
            {domains.map((d) => (
              <motion.span
                key={d.name}
                variants={scaleIn}
                transition={{ duration: 0.35 }}
                whileHover={{ scale: 1.05, borderColor: color }}
                className={`inline-flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl border ${borderColor} bg-white/[0.03] text-white/85 hover:bg-white/[0.08] transition-all cursor-default`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                />
                <span>{d.name}</span>
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GLOWING DIVIDER
   ═══════════════════════════════════════════════════════════ */
function GlowDivider() {
  return (
    <motion.div
      className="w-full h-px my-6 relative"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #ff3b6c 30%, #38bdf8 70%, transparent 100%)',
          boxShadow: '0 0 12px rgba(255,59,108,0.3), 0 0 12px rgba(56,189,248,0.3)',
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN ABOUT SECTION
   ═══════════════════════════════════════════════════════════ */
export default function AboutSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full flex flex-col justify-center px-4 sm:px-8 py-28 bg-gradient-to-b from-[#070b19] via-[#091129] to-[#070b19] overflow-hidden"
    >
      {/* ── Animated Background Layers ── */}
      <AnimatedGrid />
      <FloatingParticles />

      {/* Parallax ambient glow orbs */}
      <motion.div
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-[#ff3b6c]/[0.05] blur-[120px] pointer-events-none"
        style={{ y: backgroundY }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-[#38bdf8]/[0.05] blur-[120px] pointer-events-none"
        style={{ y: backgroundY }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#a855f7]/[0.03] blur-[150px] pointer-events-none"
        style={{ y: backgroundY }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">

        {/* ═════════════════════════════════════
            HEADER TAG
            ═════════════════════════════════════ */}
        <motion.div
          className="flex items-center gap-3 mb-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeLeft}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="h-px bg-[#ff3b6c]"
            initial={{ width: 0 }}
            whileInView={{ width: 32 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ boxShadow: '0 0 8px #ff3b6c' }}
          />
          <span className="text-xs tracking-[0.3em] text-[#ff3b6c] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
            {'// MISSION BRIEFING'.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.03 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </motion.div>

        {/* ═════════════════════════════════════
            SECTION HEADING
            ═════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-wider text-white leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {'ABOUT '.split('').map((char, i) => (
                <motion.span
                  key={`a-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.05, type: 'spring', stiffness: 200 }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              {'VIHAAN '.split('').map((char, i) => (
                <motion.span
                  key={`v-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 + i * 0.05, type: 'spring', stiffness: 200 }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.85, type: 'spring', stiffness: 150, damping: 12 }}
                className="inline-block bg-gradient-to-r from-[#ff3b6c] to-[#ff6b8a] bg-clip-text text-transparent"
              >
                X
              </motion.span>
            </h2>
            <motion.p
              className="mt-3 text-sm sm:text-base text-white/55 max-w-xl font-light leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              The 10th edition of North India&apos;s largest student-run hackathon,
              organised by the IEEE Student Branch at Delhi Technological University.
            </motion.p>
          </motion.div>

          <motion.div
            className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-500/20 px-4 py-2 rounded-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <motion.span
              className="h-2 w-2 rounded-full bg-cyan-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span>COSMIC TELEMETRY ACTIVE</span>
          </motion.div>
        </div>

        {/* ═════════════════════════════════════
            STATS GRID – Animated Counters
            ═════════════════════════════════════ */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              whileHover={{
                y: -8,
                borderColor: 'rgba(255,59,108,0.5)',
                boxShadow: '0 0 30px rgba(255,59,108,0.3)',
              }}
              className="group relative rounded-2xl border border-white/10 bg-[#0c1433]/50 p-6 backdrop-blur-xl transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Corner accent */}
              <motion.div
                className="absolute top-0 right-0 w-16 h-16 overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="absolute transform rotate-45 bg-[#ff3b6c]/20 w-20 h-1.5 -top-3 -right-6" />
              </motion.div>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff3b6c]/0 to-[#ff3b6c]/0 group-hover:from-[#ff3b6c]/5 group-hover:to-transparent transition-all duration-500 rounded-2xl" />

              <p className="text-[0.62rem] font-bold tracking-[0.24em] text-white/50 mb-2 relative z-10" style={{ fontFamily: 'var(--font-display)' }}>
                {s.label}
              </p>
              <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-[#ff3b6c] transition-colors relative z-10" style={{ fontFamily: 'var(--font-display)' }}>
                {s.prefix || ''}
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-white/60 mt-1 font-light relative z-10">
                {s.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <GlowDivider />

        {/* ═════════════════════════════════════
            NARRATIVE / ABOUT DESCRIPTION
            ═════════════════════════════════════ */}
        <motion.div
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1433]/80 via-[#0e1940]/60 to-[#0c1433]/80 p-8 sm:p-10 lg:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={scaleIn}
          transition={{ duration: 0.8 }}
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          {/* Decorative blurred orbs */}
          <motion.div
            className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-[#ff3b6c]/10 blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -left-16 -top-16 w-56 h-56 rounded-full bg-[#38bdf8]/8 blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />

          <motion.h3
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            A Decade of Pioneering Curiosity
          </motion.h3>

          <div className="space-y-4 text-sm sm:text-base text-white/70 leading-relaxed font-light relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Vihaan X, the landmark 10th edition, provides a platform for students from
              colleges and universities across the country to collaborate, innovate, and
              develop technology-driven solutions to real-world problems. For a decade,
              Vihaan has empowered aspiring engineers with mentorship, cloud infrastructure,
              and a vibrant community to turn bold ideas into high-impact projects.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Participants work in teams of up to four members to develop functional
              projects within an intensive <span className="font-semibold text-white">24-hour hackathon</span>,
              with opportunities for mentorship from industry experts, project
              presentations, and exciting cash prizes. Vihaan X encourages creativity,
              technical excellence, teamwork, and practical problem-solving — offering
              students an opportunity to showcase their skills and transform innovative
              ideas into impactful solutions.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-wrap gap-3 mt-7"
            variants={staggerContainerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { tag: '#StudentDriven', border: 'border-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-300' },
              { tag: '#TechInnovation', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-300' },
              { tag: '#IEEEDTU', border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-300' },
              { tag: '#VihaanX', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
              { tag: '#24HourHack', border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-300' },
            ].map((t) => (
              <motion.span
                key={t.tag}
                variants={scaleIn}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className={`text-xs font-mono px-3 py-1.5 rounded-full border ${t.border} ${t.bg} ${t.text} cursor-default`}
              >
                {t.tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* ═════════════════════════════════════
            DUAL-TRACK ARCHITECTURE
            ═════════════════════════════════════ */}
        <div className="mb-16">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeLeft}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="h-px bg-[#38bdf8]"
              initial={{ width: 0 }}
              whileInView={{ width: 24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ boxShadow: '0 0 6px #38bdf8' }}
            />
            <span className="text-xs tracking-[0.3em] text-[#38bdf8] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              // DUAL-TRACK ARCHITECTURE
            </span>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <TrackPanel
              title="SOFTWARE TRACK"
              color="#ff3b6c"
              borderColor="border-pink-500/20"
              bgColor="bg-[#0c1433]/50"
              domains={softwareDomains}
              defaultOpen={true}
              index={0}
            />
            <TrackPanel
              title="HARDWARE TRACK"
              color="#38bdf8"
              borderColor="border-cyan-500/20"
              bgColor="bg-[#0c1433]/50"
              domains={hardwareDomains}
              defaultOpen={true}
              index={1}
            />
          </motion.div>
        </div>

        <GlowDivider />

        {/* ═════════════════════════════════════
            WHAT AWAITS YOU – Highlight Cards
            ═════════════════════════════════════ */}
        <div className="mt-6">
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeLeft}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="h-px bg-[#ff3b6c]"
              initial={{ width: 0 }}
              whileInView={{ width: 24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ boxShadow: '0 0 6px #ff3b6c' }}
            />
            <span className="text-xs tracking-[0.3em] text-[#ff3b6c] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              // WHAT AWAITS YOU
            </span>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {highlights.map((h) => (
              <motion.div
                key={h.title}
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                whileHover={{
                  y: -10,
                  boxShadow: `0 0 35px ${h.color}20`,
                  borderColor: `${h.color}40`,
                }}
                className="group relative rounded-2xl border border-white/10 bg-[#0c1433]/50 p-6 backdrop-blur-xl transition-all duration-300 cursor-default overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${h.color}08 0%, transparent 70%)`,
                  }}
                />

                <motion.div
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-4 relative z-10 transition-colors duration-300"
                  style={{ color: h.color }}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {h.icon}
                </motion.div>

                <h4
                  className="text-sm font-bold tracking-wider text-white mb-2 group-hover:text-white transition-colors relative z-10"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {h.title}
                </h4>
                <p className="text-xs text-white/55 leading-relaxed font-light relative z-10">
                  {h.desc}
                </p>

                {/* Bottom accent line on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: h.color }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
