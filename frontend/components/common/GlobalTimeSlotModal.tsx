"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Info, Calendar } from "lucide-react";

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
];

interface GlobalTimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: "today" | "tomorrow";
  setSelectedDate: (date: "today" | "tomorrow") => void;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string) => void;
  onConfirm: () => void;
}

export const GlobalTimeSlotModal: React.FC<GlobalTimeSlotModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  onConfirm
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[9999]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none z-[10000] p-0 sm:p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white pointer-events-auto w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] border border-slate-100"
            >
              {/* Header Decorative Gradient Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shrink-0" />

              {/* Modal Header */}
              <div className="px-8 pt-6 pb-4 flex items-start justify-between border-b border-slate-50 shrink-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1D2B83] bg-blue-50 px-2.5 py-1 rounded-md">
                    Schedule Visit
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight pt-1">
                    Select a Time Slot
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold">
                    Choose when you want the professional to arrive
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-50 active:bg-slate-100 rounded-full transition-colors group"
                >
                  <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 no-scrollbar">
                {/* Date Selector */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1D2B83]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Select Date
                    </h4>
                  </div>
                  <div className="flex p-1 bg-slate-100/80 rounded-2xl">
                    <button
                      onClick={() => setSelectedDate("today")}
                      className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        selectedDate === "today"
                          ? "bg-white text-[#1D2B83] shadow-md shadow-slate-200/50"
                          : "text-slate-400 hover:text-slate-500"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setSelectedDate("tomorrow")}
                      className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        selectedDate === "tomorrow"
                          ? "bg-white text-[#1D2B83] shadow-md shadow-slate-200/50"
                          : "text-slate-400 hover:text-slate-500"
                      }`}
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1D2B83]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Available Time Slots
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3.5 rounded-2xl text-[11px] font-black tracking-tight transition-all border-2 ${
                          selectedSlot === slot
                            ? "bg-[#1D2B83] border-[#1D2B83] text-white shadow-lg shadow-indigo-900/20"
                            : "bg-slate-50/50 border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Arrival Info */}
                <div className="flex items-start gap-3.5 p-4.5 bg-blue-50/40 rounded-2.5xl border border-blue-100/50">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-blue-800/90 leading-normal">
                    Professional will arrive within 30 minutes of the selected time slot. Free rescheduling & cancellation up to 2 hours before the service.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-slate-50/60 border-t border-slate-50 shrink-0 flex flex-col gap-3">
                <button
                  onClick={onConfirm}
                  disabled={!selectedSlot}
                  className={`w-full py-4.5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-lg ${
                    selectedSlot
                      ? "bg-[#1D2B83] text-white shadow-indigo-900/10 hover:shadow-indigo-900/20 hover:scale-[1.01] active:scale-[0.99]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {selectedSlot ? `Confirm Slot • ${selectedSlot}` : "Choose a time slot to proceed"}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors tracking-widest uppercase text-center"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
