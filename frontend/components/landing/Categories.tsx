"use client";

import React, { useState } from "react";
import { 
  Wind, Zap, Pipette as Pipe, Sparkles, Settings, Hammer 
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { id: "ac-repair", name: "AC REPAIR", icon: Wind, label: "FAST REPAIR" },
  { id: "electrical", name: "ELECTRICIAN", icon: Zap, label: "EXPERT ELECTRIC" },
  { id: "plumbing", name: "PLUMBING", icon: Pipe, label: "PIPE & WATER" },
  { id: "cleaning", name: "CLEANING", icon: Sparkles, label: "DEEP CLEANING" },
  { id: "electronics", name: "ELECTRONICS REPAIR", icon: Settings, label: "GADGET FIX" },
  { id: "installation", name: "INSTALLATION", icon: Hammer, label: "PRO SETUP" },
];

const Categories = () => {
  const [selected, setSelected] = useState("ac-repair");

  return (
    <section className="bg-[#F5F2FB] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
            What do you need help with?
          </h2>
          <div className="h-1.5 w-20 bg-[#1D2B83] rounded-full" />
        </div>

        {/* Categories Grid (No Scroll, No Arrows) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selected === cat.id;

            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(cat.id)}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all duration-300 ${
                  isSelected
                    ? "border-[#1D2B83] bg-[#1D2B83] text-white shadow-lg shadow-[#1D2B83]/20"
                    : "border-white bg-white text-slate-600 shadow-sm hover:border-blue-100 hover:bg-[#F0F7FF] hover:shadow-md"
                }`}
              >
                <div
                  className={`rounded-xl p-3 transition-colors duration-300 ${
                    isSelected ? "bg-white/20" : "bg-slate-50"
                  }`}
                >
                  <Icon className={`h-7 w-7 ${isSelected ? "text-white" : "text-[#1D2B83]"}`} />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-[8px] font-bold uppercase tracking-[0.15em] ${isSelected ? "text-white/70" : "text-slate-400"}`}>
                    {cat.label}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-center leading-tight">
                    {cat.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
