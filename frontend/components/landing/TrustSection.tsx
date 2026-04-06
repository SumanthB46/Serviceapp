"use client";

import React from "react";
import { ShieldCheck, Clock, CircleDollarSign, Lock } from "lucide-react";
import { motion } from "framer-motion";

const trustFeatures = [
  {
    title: "Verified Technicians",
    description: "Every professional is background-checked and skill-verified to ensure quality.",
    icon: ShieldCheck,
  },
  {
    title: "On-Time Service",
    description: "We value your time. Our technicians arrive exactly as scheduled for every task.",
    icon: Clock,
  },
  {
    title: "Transparent Pricing",
    description: "Know exactly what you'll pay before you book. No hidden fees or surprise charges.",
    icon: CircleDollarSign,
  },
  {
    title: "Safe & Secure",
    description: "Your safety and security are our top priorities throughout the service journey.",
    icon: Lock,
  },
];

const TrustSection = () => {
  return (
    <section className="bg-[#F5F2FB] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-[#171717]">
            Why Choose Us
          </h2>
        </div>

        {/* 4 Cards Grid - Left Aligned to match reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-start text-left"
              >
                {/* Rounded Square Icon Box */}
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E0E7FF] text-[#1D2B83]">
                  <Icon className="h-7 w-7" strokeWidth={2.5} />
                </div>
                
                {/* Content */}
                <h3 className="mb-4 text-xl font-bold text-slate-900 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-[260px]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
