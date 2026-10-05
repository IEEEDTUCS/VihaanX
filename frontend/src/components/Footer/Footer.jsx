'use client';

import './Footer.css';

const EXPLORE = [
  { label: 'About',    href: '#about' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Tracks',   href: '#tracks' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'Team',     href: '#team' },
  { label: 'FAQs',     href: '#faqs' },
];

const EVENT_LEADS = [
  {
    name: 'Bhavya Goel',
    phone: '+91 79829 69225',
  },
  {
    name: 'Hardik Aggarwal',
    phone: '+91 93191 73701',
  },
  {
    name: 'Karan Gupta',
    phone: '+91 99115 74669',
  },
  {
    name: 'Manit Vig',
    phone: '+91 95605 66938',
  },
  {
    name: 'Vansh Soni',
    phone: '+91 96805 40055',
  },
];
const CONNECT = [
  { label: 'Instagram', href: 'https://www.instagram.com/vihaan_dtu/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ieee-dtu/' },
  { label: 'Facebook', href: 'https://www.facebook.com/ieeedtu' },
  { label: 'Email', href: 'mailto:contact@ieeedtu.in' },
];
const LEGAL = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms',   href: '#' },
  { label: 'Credits', href: '#' },
];

/* ── Icons (stroke icons, 20px) ── */
const Svg = ({ children, size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {children}
  </svg>
);

const InstagramIcon = () => (
  <Svg><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" /></Svg>
);
const LinkedinIcon = () => (
  <Svg strokeWidth="0" fill="currentColor">
    <path d="M4.5 9.2h3.3V20H4.5V9.2Zm1.65-5.2a1.92 1.92 0 1 1 0 3.84 1.92 1.92 0 0 1 0-3.84ZM9.9 9.2h3.17v1.48h.05c.44-.84 1.52-1.72 3.13-1.72 3.35 0 3.97 2.2 3.97 5.07V20h-3.3v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.32-1.96 2.69V20H9.9V9.2Z" />
  </Svg>
);
const FacebookIcon = () => (
  <Svg strokeWidth="0" fill="currentColor">
    <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.7.3-1 1-1Z" />
  </Svg>
);
const MailIcon = ({ size }) => (
  <Svg size={size}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6.5L20.5 7" /></Svg>
);
const PinIcon = () => (
  <Svg size={18}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></Svg>
);

const SOCIALS = [
  { label: 'Instagram', href: CONNECT[0].href, Icon: InstagramIcon },
  { label: 'LinkedIn',  href: CONNECT[1].href, Icon: LinkedinIcon },
  { label: 'Facebook',   href: CONNECT[2].href, Icon: FacebookIcon },
  { label: 'Email',     href: CONNECT[3].href, Icon: MailIcon },
];

/* IEEE-style diamond mark used in the bottom bar */
const DiamondMark = () => (
  <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M20 2 38 20 20 38 2 20Z" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M20 9.5 30.5 20 20 30.5 9.5 20Z" fill="#fff" fillOpacity=".92" />
    <path d="M20 9.5v21M9.5 20h21" stroke="#050309" strokeWidth="1.6" />
    <path d="M14.2 14.2 25.8 25.8M25.8 14.2 14.2 25.8" stroke="#050309" strokeWidth="1" />
  </svg>
);

/* Static starfield positions (deterministic → no hydration mismatch) */
const STARS = [
  [6, 14, 1.2, .5], [11, 52, 1, .35], [17, 30, 1.4, .6], [24, 8, 1, .4], [31, 44, 1, .3],
  [38, 20, 1.2, .45], [44, 6, 1, .35], [58, 10, 1, .4], [63, 36, 1.2, .5], [71, 18, 1, .35],
  [77, 48, 1.3, .55], [83, 12, 1, .4], [88, 38, 1.6, .8], [93, 26, 1, .35], [96, 8, 1.2, .5],
  [3, 38, 1, .3], [52, 40, 1, .3], [67, 5, 1.3, .6], [28, 36, 1.5, .7], [14, 4, 1, .3],
];

export default function Footer() {
  return (
    <footer id="footer" className="vx-footer" role="contentinfo">
      {/* ───────── Scene ───────── */}
      <div className="vx-scene" aria-hidden="true">
        <div className="vx-scene" aria-hidden="true">
          <div className="vx-background" />
          <div className="vx-background-overlay" />
        </div>
      </div>

      {/* top hairline */}
      <span className="vx-hairline" aria-hidden="true" />

      {/* ───────── Hero strip ───────── */}
      <div className="vx-hero">
        <p className="vx-see">SEE YOU AT</p>
        <div className="vx-wordmark" aria-label="VihaanX">
          <img
            src="/logos/vihaan_full.png"
            alt="VIHAANX"
            className="vx-wordmark-image"
          />
        </div>
        <p className="vx-tagline">IDEAS BEYOND LIMITS</p>
        <p className="vx-edition">
          <span>THE 10TH EDITION</span><i>•</i><span>IEEE DTU</span><i>•</i><span>24-HOUR HACKATHON</span>
        </p>
        <a href="/register" className="vx-cta">
          <span>REGISTER NOW</span>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path d="M0 5h12M8.5 1 12.5 5l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* ───────── Link grid ───────── */}
      <div className="vx-grid-wrap">
        <div className="vx-grid">
          <div className="vx-col vx-brand">
            <h3 className="vx-brand-title">
              <span>VIHAANX</span><span className="vx-brand-line" />
            </h3>
            <p className="vx-brand-text">
              A 24-hour hackathon by IEEE DTU<br className="hidden sm:block" />{' '}
              for dreamers, builders and doers.
            </p>
            <ul className="vx-socials">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} aria-label={label} className="vx-social"
                     {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="vx-col vx-divided">
            <h4 className="vx-col-title">EXPLORE</h4>
            <ul className="vx-event-leads">
              {EXPLORE.map(({ label, href }) => (
                <li key={label}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </div>

          <div className="vx-col vx-divided vx-leads">
  <h4 className="vx-col-title">EVENT LEADS</h4>

            <ul className="vx-event-leads">
              {EVENT_LEADS.map(({ name, phone }) => (
                <li key={name} className="vx-event-lead">
                  <span className="vx-lead-name">{name}</span>
                  <span className="vx-lead-phone">{phone}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="vx-col vx-divided vx-reach">
            <h4 className="vx-col-title">REACH US</h4>
            <div className="vx-reach-row">
              <PinIcon />
              <a href="https://www.google.com/maps/search/?api=1&query=Delhi+Technological+University"><address>Delhi Technological University<br />Delhi, India</address></a>
            </div>
            <div className="vx-reach-row">
              <MailIcon size={18} />
              <a href="mailto:contact.ieeedtu.in">contact.ieeedtu.in</a>
            </div>
          </div>
        </div>

        {/* ───────── Bottom bar ───────── */}
        <div className="vx-bottom">
          <p className="vx-copy">
            © 2026 VIHAANX <i>•</i> IEEE DTU
          </p>

          <a
            href="https://ieeedtu.in"
            className="vx-ieee"
            aria-label="IEEE DTU"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logos/whiteieee.png"
              alt="Delhi Technological University IEEE Student Branch"
              className="vx-dtu-logo"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
