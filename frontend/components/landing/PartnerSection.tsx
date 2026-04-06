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

            <Link href="/join-as-partner">
              <Button
                type="primary"
                size="large"
                className="mt-10 h-14 rounded-xl px-10 text-base font-bold bg-[#1D2B83]"
              >
                BECOME A PARTNER
              </Button>
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
