"use client";

import React from "react";
import { Clock } from "lucide-react";

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
];

interface TimeSlotSelectionProps {
  selectedDate: "today" | "tomorrow";
  setSelectedDate: (date: "today" | "tomorrow") => void;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
}

export default function TimeSlotSelection({
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot
}: TimeSlotSelectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3">
      {/* Compact header row */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#1D2B83]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Select Time Slot
          </span>
          {!selectedSlot && (
            <span className="text-[9px] font-bold text-rose-400 bg-rose-50 px-1.5 py-0.5 rounded-md ml-1">
              Required
            </span>
          )}
          {selectedSlot && (
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md ml-1">
              ✓ {selectedSlot}
            </span>
          )}
        </div>

        {/* Compact Date Switcher */}
        <div className="flex p-0.5 bg-slate-100 rounded-lg">
          <button
            onClick={() => setSelectedDate("today")}
            className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition-all ${
              selectedDate === "today"
                ? "bg-white text-[#1D2B83] shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDate("tomorrow")}
            className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition-all ${
              selectedDate === "tomorrow"
                ? "bg-white text-[#1D2B83] shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Tomorrow
          </button>
        </div>
      </div>

      {/* Compact slot grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(selectedSlot === slot ? null : slot)}
            className={`py-2 rounded-xl text-[9px] font-black transition-all border ${
              selectedSlot === slot
                ? "bg-[#1D2B83] border-[#1D2B83] text-white shadow-sm shadow-blue-900/10"
                : "bg-slate-50 border-slate-100 text-slate-400 hover:border-[#1D2B83]/30 hover:text-[#1D2B83]"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </section>
  );
}
