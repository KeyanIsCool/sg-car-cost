"use client";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 20 });
  const rounded = useTransform(spring, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  useEffect(() => {
    if (inView) mv.set(value);
    else mv.set(value * 0.001); // show a near-final seed so initial paint isn't blank
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export const Motion = motion;
