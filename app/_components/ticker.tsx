"use client";

import { useEffect, useState } from "react";

export function Ticker({ items }: { items: string[] }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div className="flex h-9 items-center justify-center gap-2.5 overflow-hidden bg-petal text-[13px] text-petal-ink">
      <span className="size-1.5 flex-none rounded-full bg-white" />
      <span key={tick} className="inline-block animate-ticker-in" aria-live="polite">
        {items[tick % items.length]}
      </span>
    </div>
  );
}
