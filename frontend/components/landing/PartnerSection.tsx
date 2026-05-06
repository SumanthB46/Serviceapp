"use client";

import React from "react";
import Link from "next/link";
import { Button } from "antd";
import {
  CheckCircle2, Sparkles, Scissors, Wind, Zap, Wrench, Settings,
  Paintbrush, GraduationCap, CreditCard, Heart, Hammer, Bug,
  Truck, Shirt, Layers, Dumbbell,
} from "lucide-react";
import { motion } from "framer-motion";

const partnerCategories = [
  { label: "Tutoring", icon: GraduationCap },
  { label: "Cleaning", icon: Sparkles },
  { label: "Salon", icon: Scissors },
  { label: "Bulk Ordering", icon: Layers },
  { label: "Loans / EMI", icon: CreditCard },
  { label: "AC Repair", icon: Wind },
  { label: "Electrical", icon: Zap },
  { label: "Plumbing", icon: Wrench },
  { label: "Painting", icon: Paintbrush },
  { label: "Carpentry", icon: Hammer },
  { label: "Pest Control", icon: Bug },
  { label: "Appliance Repair", icon: Settings },
  { label: "Beauty & Spa", icon: Heart },
  { label: "Fitness", icon: Dumbbell },
  { label: "Packers & Movers", icon: Truck },
  { label: "Laundry", icon: Shirt },
];

const ROWS = [
  [0, 1, 2],
  [3, 4, 5, 6],
  [7, 8, 9, 10, 11],
  [12, 13, 14, 15],
];

const Card = ({ catIdx, rowIdx, colIdx }: { catIdx: number; rowIdx: number; colIdx: number }) => {
  const { label, icon: Icon } = partnerCategories[catIdx];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.32,
        delay: rowIdx * 0.08 + colIdx * 0.04,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.1, y: -5 }}
      className="flex w-[70px] flex-col items-center justify-center gap-4 rounded-2xl bg-[#EEF2FF] p-2.5 text-[#1D2B83] shadow-soft border border-[#C7D2FE]/60 cursor-pointer hover:shadow-md hover:bg-[#E0E7FF] transition-all duration-200"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C7D2FE]">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="text-center text-[7.5px] font-bold uppercase leading-tight tracking-wide">
        {label}
      </span>
    </motion.div>
  );
};

const PartnerSection = () => {
  return (
    <section className="bg-[#FCF8FF] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          
          {/* Left Side: Content */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1D2B83]">
              Opportunity Awaits
            </span>
            <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Join as a Partner
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Are you an expert in your field? Whether you're a skilled
              technician, a passionate tutor, or a salon professional,
              our platform helps you grow your business and reach thousands
              of homeowners.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                "Flexible working hours",
                "Reliable weekly payments",
                "Marketing & support",
                "High-quality leads",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#1D2B83]" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/join-as-partner" className="inline-block mt-10">
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes floating-points {
                  0% { transform: translateY(0); }
                  85% { opacity: 0; }
                  100% { transform: translateY(-40px); opacity: 0; }
                }
              `}} />
              
              <button className="group relative flex items-center justify-center overflow-hidden transition-all duration-300 border-none outline-none px-8 h-14 rounded-xl cursor-pointer active:scale-95 shadow-lg shadow-blue-500/20 bg-[radial-gradient(65.28%_65.28%_at_50%_100%,rgba(186,230,255,0.6)_0%,rgba(186,230,255,0)_100%)] bg-[#1D2B83]">
                {/* Floating Particles */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute bottom-[-5px] w-0.5 h-0.5 bg-white rounded-full opacity-0"
                      style={{
                        left: `${[15, 35, 50, 65, 80, 90][i]}%`,
                        animation: `floating-points ${[2.2, 2.5, 1.9, 2.3, 2.0, 2.4][i]}s infinite ease-in-out`,
                        animationDelay: `${[0.2, 0.5, 0, 0.3, 0.1, 0.4][i]}s`,
                        opacity: [0.8, 0.6, 1, 0.7, 0.9, 0.5][i]
                      }}
                    />
                  ))}
                </div>

                {/* Inner Content */}
                <div className="relative z-10 flex items-center gap-3 text-white font-bold tracking-wider transition-colors duration-300">
                  <span className="text-sm uppercase">Become a Partner</span>
                  <svg className="w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </button>
            </Link>
          </div>

          {/* Right Side: Diamond Grid */}
          <div className="flex flex-col items-center gap-2.5">
            {ROWS.map((rowIndices, rowIdx) => (
              <div key={rowIdx} className="flex gap-2.5 justify-center">
                {rowIndices.map((catIdx, colIdx) => (
                  <Card key={catIdx} catIdx={catIdx} rowIdx={rowIdx} colIdx={colIdx} />
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
