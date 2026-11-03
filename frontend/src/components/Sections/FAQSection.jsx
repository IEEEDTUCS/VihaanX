'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'ALL PROTOCOLS' },
  { id: 'general', label: 'GENERAL & TRACKS' },
  { id: 'teams', label: 'TEAMS & ELIGIBILITY' },
  { id: 'timeline', label: 'TIMELINE & QUIZ' },
  { id: 'logistics', label: 'LOGISTICS & HARDWARE' },
];

const FAQ_DATA = [
  {
    id: 1,
    category: 'general',
    tag: 'OVERVIEW',
    question: 'What is Vihaan X, and what are the major tracks?',
    answer:
      "Vihaan X is the landmark 10th edition of North India's largest student-run hackathon, organised by IEEE DTU. It is an intensive 24-hour sprint divided into two major tracks: Software Track and Hardware Track.",
    highlight: 'Software & Hardware Tracks',
  },
  {
    id: 2,
    category: 'teams',
    tag: 'ELIGIBILITY',
    question: 'Who is eligible to participate in Vihaan X?',
    answer:
      'Any enrolled college student can participate — irrespective of year, branch, or university. School students are unfortunately not eligible.',
    highlight: 'All college years & branches eligible',
  },
  {
    id: 3,
    category: 'general',
    tag: 'REGISTRATION',
    question: 'Is registration free, and where do we sign up?',
    answer:
      'Yes! Registration is 100% free of charge. You can register your squad on the official Vihaan X page on Unstop. Be sure to submit before the portal cutoff.',
    highlight: '100% Free on Unstop',
  },
  {
    id: 4,
    category: 'teams',
    tag: 'FORMATION',
    question: 'What is the team size limit, and are solo hackers allowed?',
    answer:
      'Teams can comprise between 1 to 4 members. Solo hackers are completely welcome to apply and compete.',
    highlight: '1 to 4 Hackers / Solo Friendly',
  },
  {
    id: 5,
    category: 'general',
    tag: 'TRACK SELECTION',
    question: 'Can we apply for both Hardware and Software tracks?',
    answer:
      'Yes, you can register for both tracks during the initial round. However, because both tracks run concurrently at DTU, shortlisted teams must select and commit to one track for the offline finals.',
    highlight: 'Register both → Commit to one',
  },
  {
    id: 6,
    category: 'timeline',
    tag: 'SCHEDULE',
    question: 'What are the critical dates and timeline?',
    answer:
      'Round 1 (Online Screening Quiz): 9 Nov 2026, 8:00 PM – 9:00 PM IST on Unstop. Round 2 (24-Hour Offline Hackathon Finals): 14 Nov 2026, 1:00 PM – 15 Nov 2026, 5:00 PM IST at the DTU Main Campus, New Delhi.',
    highlight: 'Quiz: 9 Nov | Offline Finals: 14-15 Nov at DTU',
  },
  {
    id: 7,
    category: 'timeline',
    tag: 'SCREENING',
    question: 'How does the screening quiz work, and what is the syllabus?',
    answer:
      'Only the team leader needs to attempt the online quiz on Unstop. It covers core programming, basic computer science principles, logical reasoning, and aptitude. Anti-cheat measures (screen tracking & tab-switching detection) are strictly enforced.',
    highlight: 'Team Leader only • CS Basics & Aptitude',
  },
  {
    id: 8,
    category: 'general',
    tag: 'PROBLEM STATEMENT',
    question: 'Will fixed problem statements be assigned to teams?',
    answer:
      'No fixed problem statements are assigned — it is "your problem, your solution". Teams are free to target any challenge within their track domains (HealthTech, FinTech, Web3, IoT, AgriTech, etc.) or choose Open Innovation.',
    highlight: 'Open Innovation / Open Domain',
  },
  {
    id: 9,
    category: 'logistics',
    tag: 'GUIDELINES',
    question: 'Can we use pre-built projects, AI tools, or open-source libraries?',
    answer:
      'AI tools, open-source libraries, APIs, and modern frameworks are fully permitted. However, pre-built project code or pre-assembled hardware circuits are strictly forbidden — everything must be built from scratch during the 24 hours. Violations result in disqualification.',
    highlight: 'AI & APIs allowed • No pre-built code/circuits',
  },
  {
    id: 10,
    category: 'logistics',
    tag: 'VENUE & HOSPITALITY',
    question: 'What amenities, food, and hardware facilities are provided at DTU?',
    answer:
      'Both complimentary meals and accommodation are provided at DTU for the full 24-hour hackathon. Power outlets and high-speed Wi-Fi will be available (please bring your own extension cord). Hardware teams must bring their own components, sensor modules, and soldering/multimeter tools.',
    highlight: 'Food & Accommodation Provided • Bring Hardware Kits',
  },
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory =
      activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleScrollToEventLeads = (e) => {
    e.preventDefault();
    const leadsSection = document.getElementById('footer-event-leads');
    if (leadsSection) {
      leadsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Trigger high-tech spotlight pulse on cards
      const cards = leadsSection.querySelectorAll('.footer-lead-card');
      cards.forEach((card) => {
        card.classList.remove('ring-2', 'ring-[#a855f7]', 'shadow-[0_0_25px_rgba(168,85,247,0.8)]', 'bg-[#a855f7]/20');
        void card.offsetWidth; // Force reflow
        card.classList.add('ring-2', 'ring-[#a855f7]', 'shadow-[0_0_25px_rgba(168,85,247,0.8)]', 'bg-[#a855f7]/20');
        setTimeout(() => {
          card.classList.remove('ring-2', 'ring-[#a855f7]', 'shadow-[0_0_25px_rgba(168,85,247,0.8)]', 'bg-[#a855f7]/20');
        }, 3200);
      });
    }
  };

  return (
    <section
      id="faqs"
      className="relative min-h-screen w-full flex flex-col justify-center px-4 sm:px-8 py-28 bg-[#070b19] overflow-hidden select-none"
    >
      {/* ── Ambient Background Lighting ── */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#ff3b6c]/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#38bdf8]/[0.04] blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 59, 108, 0.2) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.2) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          backgroundPosition: '0 0, 24px 24px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* ── Section Tag ── */}
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
          <span
            className="text-xs tracking-[0.3em] text-[#38bdf8] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            // TRANSMISSION INTELLIGENCE
          </span>
        </div>

        {/* ── Heading & Live Stats ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2
              className="text-3xl sm:text-5xl font-black tracking-wider text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              FREQUENTLY ASKED{' '}
              <span className="bg-gradient-to-r from-[#38bdf8] via-cyan-300 to-[#ff3b6c] bg-clip-text text-transparent">
                QUESTIONS
              </span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/60 max-w-xl font-light leading-relaxed">
              Everything you need to know about mission rules, hardware protocols,
              screening stages, and logistics for Vihaan X.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-4 py-2 rounded-full self-start md:self-auto shrink-0">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>KNOWLEDGE REPOSITORY ONLINE</span>
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search protocols, rules, dates, tracks..."
              className="w-full pl-11 pr-4 py-3 bg-[#0c1433]/50 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(56,189,248,0.2)] backdrop-blur-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-mono text-white/40 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Have Doubts Button -> Scrolls to Event Leads and highlights them */}
          <button
            onClick={handleScrollToEventLeads}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-[#a855f7]/40 bg-[#a855f7]/15 hover:bg-[#a855f7]/25 hover:border-[#a855f7] text-white px-5 py-3 text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] shrink-0 cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-[#a855f7] group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372a1.125 1.125 0 00-.852-1.094l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.38 12.035 12.035 0 01-7.24-7.24 1.125 1.125 0 01.38-1.21l1.293-.97a1.125 1.125 0 00.417-1.173L6.916 3.102A1.125 1.125 0 005.822 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            <span>HAVE DOUBTS? CONTACT EVENT LEADS</span>
            <svg
              className="w-3.5 h-3.5 text-[#a855f7] group-hover:translate-y-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
              />
            </svg>
          </button>
        </div>

        {/* ── Category Chips ── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-[0.68rem] font-mono tracking-widest px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#38bdf8]/15 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-semibold'
                    : 'bg-white/[0.02] border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Interactive FAQ List ── */}
        <div className="flex flex-col gap-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0c1433]/40 p-10 text-center backdrop-blur-xl">
              <p
                className="text-sm font-tech text-white/50 tracking-wider mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                NO PROTOCOLS FOUND MATCHING YOUR QUERY
              </p>
              <p className="text-xs text-white/40">
                Try searching for keywords like "quiz", "hardware", "food", or "solo".
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = expandedId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-xl ${
                    isOpen
                      ? 'border-cyan-400/50 bg-[#0c1433]/80 shadow-[0_0_30px_rgba(56,189,248,0.15)]'
                      : 'border-white/10 bg-[#0c1433]/40 hover:border-white/25 hover:bg-[#0c1433]/60'
                  }`}
                >
                  {/* Left accent vertical status bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                      isOpen
                        ? 'bg-gradient-to-b from-[#38bdf8] to-[#ff3b6c] shadow-[0_0_10px_#38bdf8]'
                        : 'bg-transparent group-hover:bg-white/20'
                    }`}
                  />

                  {/* Header Trigger */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 pl-6 sm:pl-7 text-left cursor-pointer focus:outline-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pr-4">
                      <span className="text-[0.62rem] font-mono tracking-widest text-[#ff3b6c] border border-[#ff3b6c]/30 bg-[#ff3b6c]/10 px-2.5 py-0.5 rounded-full w-fit">
                        {faq.tag}
                      </span>
                      <h3
                        className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 text-white/70 group-hover:text-cyan-300 group-hover:border-cyan-400/50 transition-all">
                      <motion.svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </motion.svg>
                    </div>
                  </button>

                  {/* Answer Accordion */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 sm:px-7 pb-6 pt-1 border-t border-white/5">
                          <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed mb-4">
                            {faq.answer}
                          </p>

                          {/* Quick Takeaway Pill */}
                          <div className="inline-flex items-center gap-2 text-[0.68rem] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 rounded-xl">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                            <span className="font-semibold">KEY PROTOCOL:</span>
                            <span>{faq.highlight}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
