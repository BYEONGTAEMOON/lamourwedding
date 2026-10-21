"use client";

import { useState } from "react";
import { FAQS } from "../_content";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col border-t border-ink">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-1 py-6 text-left text-[17px] font-semibold text-ink"
            >
              <span>{f.q}</span>
              <span className="flex-none text-[22px] font-light text-primary">{isOpen ? "−" : "+"}</span>
            </button>
            {/* Closed answers stay in the HTML (hidden) so search engines can read every one. */}
            <div
              id={`faq-${i}`}
              hidden={!isOpen}
              className="px-1 pb-[26px] text-[15px] leading-[1.8] text-body text-pretty"
            >
              {f.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
