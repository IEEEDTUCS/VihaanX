'use client';

const TIERS = [
  {
    label: 'TITLE PARTNERS',
    items: [
      { name: 'Google', image: '/logos/google.png' },
      { name: 'Microsoft', image: '/logos/microsoft.png' },
      { name: 'Meta', image: '/logos/meta.png' },
    ],
  },
  {
    label: 'ASSOCIATE PARTNERS',
    items: [
      { name: 'Adobe', image: '/logos/adobe.png' },
      { name: 'Samsung', image: '/logos/samsung.png' },
      { name: 'Lenovo', image: '/logos/lenovo.png' },
    ],
  },
  {
    label: 'SUPPORTING PARTNERS',
    items: [
      { name: 'GitHub', image: '/logos/github.png' },
      { name: 'Qualcomm', image: '/logos/qualcomm.png' },
      { name: 'HDFC Bank', image: '/logos/hdfc.png' },
    ],
  },
];

export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="relative min-h-[640px] w-full overflow-hidden bg-black text-white"
    >
      {/* =========================================================
          BACKGROUND IMAGE
      ========================================================= */}

      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-black"
      >
        <img
          src="/sponsors-bg.png"
          alt=""
          className="h-full w-full object-fill"
        />
      </div>

      {/* VERY SUBTLE OVERLAY */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-black/[0.06]"
      />


      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="relative z-10 min-h-[640px] w-full">

        {/* =======================================================
            LEFT CONTENT
        ======================================================= */}

        <div className="absolute left-[6%] top-[130px] w-[37%] max-w-[570px]">

          {/* SECTION NUMBER */}
          <div className="flex items-center gap-5">
            <span className="sponsor-mono border-b border-pink-300/60 pb-[5px] text-[16px] leading-none tracking-[0.22em] text-pink-100/90 md:text-[18px]">
              06
            </span>

            <span className="h-px w-[70px] bg-gradient-to-r from-pink-200/60 to-transparent md:w-[82px]" />
          </div>

          {/* PARTNERS */}
          <p className="sponsor-mono -translate-y-[5px] mt-[22px] text-[9px] uppercase tracking-[0.38em] text-white/75 md:text-[11px]">
            Partners
          </p>

          {/* HEADING */}
          <h1 className="sponsor-heading -translate-y-[5px] mt-[24px] text-[46px] leading-[0.88] text-white sm:text-[52px] md:text-[58px] lg:text-[62px] xl:text-[66px]">
            POWERING
            <br />
            <span className="relative top-[20px]">
              THE <span className="text-[#f47ca3]">BUILD</span>
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="sponsor-mono -translate-y-[5px] mt-[26px] max-w-[430px] text-[8px] leading-[1.9] tracking-[0.06em] text-white/75 sm:text-[9px] md:text-[10px]">
            Built with the support of organisations
            <br />
            shaping what comes next.
          </p>
        </div>

        {/* =======================================================
            RIGHT SPONSORS
        ======================================================= */}

        <div className="absolute right-[12%] top-[18%] w-[40%] max-w-[820px]">

          {TIERS.map((tier, tierIndex) => (
            <div
              key={tier.label}
              className={tierIndex !== 0 ? 'mt-[18px] md:mt-[21px]' : ''}
            >

              {/* SPONSOR ROW */}
              <div className="grid grid-cols-3 border-t border-white/[0.18]">
              {tier.items.map((item, index) => (
                <div
                  key={item.name}
                  className="relative flex h-[62px] items-center justify-center px-2 sm:h-[68px] md:h-[72px]"
                >
                  {index !== 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 h-[34px] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/30 to-transparent md:h-[40px]"
                    />
                  )}

                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={item.image}
                      alt=""
                      className="h-[30px] w-auto max-w-[45px] object-contain brightness-0 invert"
                    />

                    <span className="sponsor-name">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
              </div>

              {/* TIER LABEL */}
              <div className="flex items-center">

                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />

                <span className="sponsor-mono mx-[12px] whitespace-nowrap text-[5px] uppercase tracking-[0.38em] text-white/55 sm:mx-[16px] sm:text-[6px] md:text-[7px]">
                  {tier.label}
                </span>

                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />

              </div>
            </div>
          ))}

          {/* =====================================================
              BECOME A PARTNER
          ===================================================== */}

          <div className="mt-[35px] flex justify-end md:mt-[42px]">

            <a
              href="#"
              className="sponsor-mono group flex items-center gap-[12px] text-[6px] uppercase tracking-[0.34em] text-white/75 transition-colors duration-300 hover:text-white sm:gap-[15px] sm:text-[7px] md:gap-[17px] md:text-[8px]"
            >

              <span>
                Become a partner
              </span>

              <span className="hidden h-px w-[45px] bg-pink-300/55 transition-all duration-300 group-hover:w-[70px] sm:block md:w-[65px]" />

              <span className="grid h-[40px] w-[40px] place-items-center rounded-full border border-pink-200/60 transition-all duration-300 group-hover:border-pink-200 group-hover:bg-pink-300/10 sm:h-[44px] sm:w-[44px] md:h-[50px] md:w-[50px]">

                <svg
                  width="18"
                  height="13"
                  viewBox="0 0 22 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                >
                  <path d="M0 7h20" />
                  <path d="M14 1l6 6-6 6" />
                </svg>

              </span>

            </a>
          </div>
        </div>
      </div>

      {/* =========================================================
          STYLES
      ========================================================= */}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400&family=Space+Mono:wght@400&display=swap');

        .sponsor-mono {
          font-family: 'Michroma', sans-serif;
        }

        .sponsor-heading { 
          font-family: 'Bodoni Moda', Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.055em;
          line-height: 0.82;
          text-shadow: 
            0 3px 10px rgba(0, 0, 0, 0.9), 
            0 0 18px rgba(0, 0, 0, 0.5); 
        }

        .sponsor-name {
          color: white;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 18px;
          font-weight: 500;
          white-space: nowrap;
          text-shadow:
            0 2px 7px rgba(0, 0, 0, 0.95),
            0 0 12px rgba(0, 0, 0, 0.7);
        }

        @media (min-width: 768px) {
          .sponsor-name {
            font-size: 21px;
          }
        }

        .sponsor-name:hover {
          color: #ffffff;
          transform: translateY(-2px);
          text-shadow:
            0 3px 10px rgba(0, 0, 0, 1),
            0 0 16px rgba(242, 118, 164, 0.2);
        }

        @media (min-width: 768px) {
          .sponsor-name {
            font-size: 21px;
          }
        }

        @media (min-width: 1280px) {
          .sponsor-name {
            font-size: 23px;
          }
        }

        @media (max-width: 767px) {
          .sponsor-heading {
            letter-spacing: -0.045em;
          }
        }
      `}</style>
    </section>
  );
}