export function AdSlot({ type }: { type: "leaderboard" | "in-content" | "sidebar" | "rectangle" }) {
  const sizes: Record<string, string> = {
    leaderboard: "h-24",
    "in-content": "h-28",
    sidebar: "h-80",
    rectangle: "h-60",
  };
  return (
    <div
      role="complementary"
      aria-label="Advertisement area"
      className={`flex items-center justify-center rounded-xl border border-dashed border-ink-200 bg-ink-50 text-xs text-ink-400 ${sizes[type]}`}
    >
      Ad slot · {type}
    </div>
  );
}
