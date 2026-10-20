"use client";

import { createContext, useContext, useState } from "react";

type Reservation = {
  submitted: boolean;
  setSubmitted: (submitted: boolean) => void;
};

const ReservationContext = createContext<Reservation | null>(null);

// Shares the RSVP form's submitted state with the sticky CTA, which hides once a reservation is made.
export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <ReservationContext.Provider value={{ submitted, setSubmitted }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservation must be used within ReservationProvider");
  return ctx;
}
