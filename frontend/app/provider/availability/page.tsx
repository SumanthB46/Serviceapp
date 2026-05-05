"use client";

import React, { useState } from "react";
import ProviderLayout from "@/components/provider/ProviderLayout";
import AddBlockedDateModal from "@/components/provider/modals/AddBlockedDateModal";
import { 
  Clock, 
  Calendar, 
  Save, 
  Plus, 
  Trash2, 
  Lock, 
  Settings2,
  ChevronRight,
  Info
} from "lucide-react";

export default function AvailabilityPage() {
  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "18:00"
  });
  const [offDays, setOffDays] = useState(["Sunday"]);
  const [isBlockedDateModalOpen, setIsBlockedDateModalOpen] = useState(false);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (day: string) => {
    setOffDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  return (
    <ProviderLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Availability & Slots</h1>
          <p className="text-slate-500 font-medium">Configure your working hours, slot intervals, and weekly offs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Working Hours & Days */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Working Hours</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starts At</label>
                  <input 
                    type="time" 
                    value={workingHours.start}
                    onChange={(e) => setWorkingHours({...workingHours, start: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ends At</label>
                  <input 
                    type="time" 
                    value={workingHours.end}
                    onChange={(e) => setWorkingHours({...workingHours, end: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Select Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {days.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        !offDays.includes(day) 
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Block Specific Dates</h2>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-6">Add dates when you are unavailable (e.g. festivals, holidays).</p>
              
              <div className="space-y-3">
                {[
                  { date: "May 15, 2024", reason: "Family Function" },
                  { date: "June 2-4, 2024", reason: "Vacation" }
                ].map((blocked, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="block text-sm font-bold text-slate-900">{blocked.date}</span>
                      <span className="block text-xs font-medium text-slate-400">{blocked.reason}</span>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setIsBlockedDateModalOpen(true)}
                  className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Add Blocked Date
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Slot Configuration */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Settings2 className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Slot Configuration</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-blue-500 mt-1" />
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                      Correct slot timing helps customers book your services efficiently without overlaps.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Slot Duration</label>
                  <select defaultValue="60 Minutes (1 Hour)" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold focus:ring-2 focus:ring-primary outline-none">
                    <option>30 Minutes</option>
                    <option>60 Minutes (1 Hour)</option>
                    <option>90 Minutes</option>
                    <option>120 Minutes (2 Hours)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Buffer Time Between Slots</label>
                  <select defaultValue="30 Minutes" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold focus:ring-2 focus:ring-primary outline-none">
                    <option>No Buffer</option>
                    <option>15 Minutes</option>
                    <option>30 Minutes</option>
                    <option>45 Minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
              <h3 className="text-lg font-bold mb-4">Summary Preview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-slate-400 text-sm font-medium">Daily Availability</span>
                  <span className="font-bold text-sm">9h 00m</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-slate-400 text-sm font-medium">Slots per Day</span>
                  <span className="font-bold text-sm">6 Slots</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400 text-sm font-medium">Weekly Total</span>
                  <span className="font-bold text-sm">36 Slots</span>
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddBlockedDateModal isOpen={isBlockedDateModalOpen} onClose={() => setIsBlockedDateModalOpen(false)} />
    </ProviderLayout>
  );
}
