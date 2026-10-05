"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const DEFAULT_STATIC_TIME = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const UNIT_LABELS = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

// Our Vihaan X theme overrides — dark glass units with violet/pink accents
const variantClasses = {
  modern: "border-white/[0.08] bg-black/30 shadow-2xl shadow-violet-500/10 backdrop-blur-xl",
  digital: "border-cyan-400/20 bg-zinc-950 text-white shadow-2xl shadow-cyan-500/10",
  minimal: "border-transparent bg-transparent shadow-none",
  classic: "border-white/10 bg-black/40 shadow-sm backdrop-blur-md",
};

const unitVariantClasses = {
  modern: "border-white/[0.08] bg-white/[0.04] shadow-sm transition hover:border-violet-400/30 hover:bg-white/[0.08]",
  digital: "border-cyan-400/20 bg-cyan-400/[0.055] font-mono shadow-[0_0_28px_-18px_rgba(34,211,238,0.9)] transition hover:border-cyan-300/40",
  minimal: "border-transparent bg-transparent transition hover:bg-white/[0.06]",
  classic: "border-white/10 bg-black/30 shadow-sm transition hover:border-violet-400/20 backdrop-blur-md",
};

const sizeClasses = {
  sm: { container: "gap-2 p-2", unit: "min-w-[4.25rem] rounded-xl px-3 py-3", number: "text-2xl", label: "text-[10px]" },
  md: { container: "gap-2.5 p-2.5 sm:gap-3 sm:p-3", unit: "min-w-[4.8rem] rounded-2xl px-3.5 py-4 sm:min-w-[5.6rem] sm:px-4", number: "text-3xl sm:text-4xl", label: "text-[10px] sm:text-[11px]" },
  lg: { container: "gap-3 p-3 sm:gap-4 sm:p-4", unit: "min-w-[5.2rem] rounded-2xl px-4 py-4 sm:min-w-[6.5rem] sm:px-5 sm:py-5", number: "text-4xl sm:text-5xl", label: "text-[11px] sm:text-xs" },
};

function toDateTime(value) {
  if (!value) return null;
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function getTimeLeft(targetDate) {
  const target = toDateTime(targetDate);
  if (!target) return DEFAULT_STATIC_TIME;
  const total = Math.max(0, target - Date.now());
  const s = Math.floor(total / 1000);
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function isFinished(t) { return t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0; }
function format(v)     { return String(Math.max(0, v || 0)).padStart(2, "0"); }

function CountdownNumber({ value, className, mounted }) {
  const reduceMotion = useReducedMotion() === true;

  if (!mounted) {
    return (
      <span className={cn("relative inline-grid min-w-[2ch] place-items-center tabular-nums", className)} suppressHydrationWarning>
        <span>{value}</span>
      </span>
    );
  }

  return (
    <span className={cn("relative inline-grid min-w-[2ch] place-items-center tabular-nums", className)} suppressHydrationWarning>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={reduceMotion ? false : { y: 12, opacity: 0, filter: "blur(4px)" }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: reduceMotion ? 0.05 : 0.25, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CountdownUnit({ unit, value, variant, size, unitClassName, numberClassName, labelClassName, accentClassName, index, mounted }) {
  const sizePreset = sizeClasses[size];
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden border text-center transition-all duration-300",
        unitVariantClasses[variant],
        sizePreset.unit,
        unitClassName,
      )}
      suppressHydrationWarning
    >
      {/* Violet accent line at top for modern variant */}
      {variant === "modern" && (
        <span className={cn(
          "pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent",
          accentClassName,
        )} />
      )}
      <CountdownNumber
        value={format(value)}
        mounted={mounted}
        className={cn(
          "font-bold leading-none tracking-tight text-white",
          variant === "digital" && "font-mono text-cyan-100 drop-shadow-[0_0_18px_rgba(34,211,238,0.45)]",
          variant === "minimal" && "font-semibold",
          sizePreset.number,
          numberClassName,
        )}
      />
      <span className={cn(
        "mt-2 font-semibold uppercase tracking-[0.18em] text-white/40",
        variant === "digital" && "text-cyan-200/55",
        sizePreset.label,
        labelClassName,
      )}>
        {UNIT_LABELS[unit]}
      </span>
    </div>
  );
}

export function AnimatedCountdown({
  targetDate,
  variant = "modern",
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  unitOrder = ["days", "hours", "minutes", "seconds"],
  backgroundColor,
  accentColor,
  className,
  containerClassName,
  unitClassName,
  accentClassName,
  labelClassName,
  numberClassName,
  separator = ":",
  showSeparators = variant === "digital",
  completionMessage = "We're live!",
  onComplete,
  staticMode,
  initialStaticTime,
  compact = false,
  size = compact ? "sm" : "md",
  ariaLabel = "Countdown timer",
}) {
  const [mounted, setMounted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(DEFAULT_STATIC_TIME);
  const completedRef = React.useRef(false);

  const isStatic = staticMode ?? !targetDate;
  const staticTime = React.useMemo(() => ({ ...DEFAULT_STATIC_TIME, ...initialStaticTime }), [initialStaticTime]);

  const enabled = { days: showDays, hours: showHours, minutes: showMinutes, seconds: showSeconds };
  const visibleUnits = React.useMemo(
    () => unitOrder.filter(u => enabled[u]),
    [showDays, showHours, showMinutes, showSeconds, unitOrder]
  );

  const sizePreset = sizeClasses[size];
  const displayTimeLeft = !mounted ? (initialStaticTime || DEFAULT_STATIC_TIME) : (isStatic ? staticTime : timeLeft);
  const completed = mounted && !isStatic && isFinished(displayTimeLeft);

  React.useEffect(() => {
    setMounted(true);
    if (isStatic) return;
    setTimeLeft(getTimeLeft(targetDate));
    const id = window.setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => window.clearInterval(id);
  }, [isStatic, targetDate]);

  React.useEffect(() => {
    if (!completed || completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  }, [completed, onComplete]);

  const style = {
    ...(backgroundColor ? { backgroundColor } : null),
    ...(accentColor ? { "--countdown-accent": accentColor } : null),
  };

  return (
    <div
      aria-label={ariaLabel}
      suppressHydrationWarning
      className={cn(
        "inline-flex max-w-full flex-col items-center rounded-[1.75rem] border",
        variantClasses[variant],
        sizePreset.container,
        compact && "rounded-2xl",
        containerClassName,
        className,
      )}
      style={style}
    >
      <div className={cn(
        "grid max-w-full grid-cols-2 items-stretch gap-2 sm:flex sm:flex-wrap sm:justify-center",
        showSeparators && "sm:gap-0",
      )}>
        {visibleUnits.map((unit, index) => (
          <React.Fragment key={unit}>
            <CountdownUnit
              unit={unit}
              value={displayTimeLeft[unit]}
              variant={variant}
              size={size}
              unitClassName={unitClassName}
              numberClassName={numberClassName}
              labelClassName={labelClassName}
              accentClassName={accentClassName}
              index={index}
              mounted={mounted}
            />
            {showSeparators && index < visibleUnits.length - 1 && (
              <span className={cn(
                "hidden items-center px-2 text-2xl font-semibold text-white/30 sm:flex",
                variant === "digital" && "font-mono text-cyan-200/45",
              )} aria-hidden>
                {separator}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {mounted && completed && completionMessage && (
        <p className="mt-3 text-sm font-medium text-violet-400">
          {completionMessage}
        </p>
      )}
    </div>
  );
}

export default AnimatedCountdown;
