"use client";

export default function LeftHUD() {
  return (
    <aside
      className="hidden xl:flex flex-col gap-6 absolute left-6 sm:left-10 top-28 z-20 pointer-events-none select-none max-w-[12rem]"
      aria-hidden="true"
    >
      {/* 1. A DECADE OF DREAMERS */}
      <div className="flex flex-col gap-1">
        <span className="h-px w-5 bg-white/20 mb-1" />
        <p className="font-tech text-[0.68rem] font-bold tracking-[0.24em] text-white/90 leading-tight">
          A DECADE
        </p>
        <p className="font-tech text-[0.68rem] font-bold tracking-[0.24em] text-white/90 leading-tight">
          OF DREAMERS
        </p>
      </div>

      {/* 2. PEOPLE IDEAS IMPACT */}
      <div className="flex flex-col gap-1">
        <span className="h-px w-5 bg-[#ff3b6c] mb-1 shadow-[0_0_8px_#ff3b6c]" />
        <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-white/70">
          PEOPLE
        </p>
        <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-white/70">
          IDEAS
        </p>
        <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-white/70">
          IMPACT
        </p>
      </div>

      {/* 3. INNOVATE BUILD BELONG */}
      <div className="flex flex-col gap-1">
        <span className="h-px w-5 bg-[#ff3b6c]/60 mb-1" />
        <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-white/60">
          INNOVATE
        </p>
        <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-white/60">
          BUILD
        </p>
        <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-white/60">
          BELONG
        </p>
      </div>

      {/* Telemetry Dots */}
      <div className="flex flex-col gap-2 pt-1 pl-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span className="h-1 w-1 rounded-full bg-white/20" />
        <span className="h-1 w-1 rounded-full bg-white/10" />
      </div>
    </aside>
  );
}
