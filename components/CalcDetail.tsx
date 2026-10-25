"use client";
import { ReactNode, useState } from "react";

export function CalcDetail({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-ink-100 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-medium">How is {title} calculated?</span>
        <span aria-hidden className="text-ink-400">{open ? "–" : "+"}</span>
      </button>
      {open && <div className="border-t border-ink-100 px-4 py-3 text-sm text-ink-600">{children}</div>}
    </div>
  );
}
