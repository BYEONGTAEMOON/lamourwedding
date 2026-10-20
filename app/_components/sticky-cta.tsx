"use client";

import { useEffect, useState } from "react";
import { useReservation } from "./reservation-context";

export function StickyCta({ seatsLeft }: { seatsLeft: number }) {
  const { submitted } = useReservation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!scrolled || submitted) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-30 flex w-[min(560px,calc(100%-32px))] -translate-x-1/2 items-center justify-between gap-3 rounded-full bg-ink py-2 pr-2 pl-6 text-white shadow-[0_20px_40px_-16px_rgba(0,0,0,.5)]">
      <span className="text-sm">
        이번 주 잔여 <b className="text-champagne">{seatsLeft}석</b> · 혜택 최대 35만 원
      </span>
      <a
        href="#rsvp"
        className="flex-none rounded-full bg-champagne px-5 py-3 text-sm font-bold text-ink hover:text-ink"
      >
        사전예약
      </a>
    </div>
  );
}
