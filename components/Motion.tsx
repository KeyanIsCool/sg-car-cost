"use client";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * CSS-driven reveal — content is visible from SSR; a brief fade-up kicks in
 * on mount so no-JS fallback and first paint both look right.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div
      className={className}
      style={{
        opacity: 1,
        transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: `opacity 500ms ease ${delay}s, transform 500ms cubic-bezier(.21,.47,.32,.98) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const mv = useMotionValue(value); // start at final value for SSR correctness
  const spring = useSpring(mv, { stiffness: 70, damping: 20 });
  const rounded = useTransform(spring, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (inView && !started) {
      mv.set(0);
      // run next frame so the spring animates from 0 → value
      requestAnimationFrame(() => mv.set(value));
      setStarted(true);
    }
  }, [inView, started, value, mv]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export const Motion = motion;
