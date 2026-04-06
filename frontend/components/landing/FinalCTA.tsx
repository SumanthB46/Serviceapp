"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const FinalCTA = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Horizontal Banner matches the requested design */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1D2B83] p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">

          {/* Left Column: Content */}
          <div className="flex-1 space-y-8 text-center md:text-left z-10">
            <div className="space-y-4">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-blue-200/80">
                Get Started Now
              </span>
              <h2 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                Book your service <br className="hidden lg:block" /> today
              </h2>
              <p className="text-sm md:text-base text-blue-100/60 font-medium tracking-wide">
                Fast • Reliable • Affordable
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/5 backdrop-blur-sm">
                  <span className="text-[10px] font-bold text-blue-200">15k+ Services Completed</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/5 backdrop-blur-sm">
                  <span className="text-[10px] font-bold text-blue-200">0% EMI Available</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/5 backdrop-blur-sm">
                  <span className="text-[10px] font-bold text-blue-200">24/7 Expert Support</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col md:flex-row items-center gap-6">
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#1D2B83] text-xs font-black uppercase tracking-[0.2em] px-12 py-5 rounded-2xl shadow-xl transition-all duration-300"
                >
                  Get Started
                </motion.button>
              </Link>

              <div className="flex flex-col items-center md:items-start">
                <span className="text-xs font-bold text-white/90">No prepayment required</span>
                <span className="text-[10px] font-medium text-blue-200/50 uppercase tracking-widest">Pay after service</span>
              </div>
            </div>
          </div>

          {/* Right Column: Image in Rounded Box - Larger Width to fill space */}
          <div className="flex-1 flex justify-center md:justify-end z-10">
            <div className="relative w-full max-w-[550px] aspect-square md:aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/5">
              <img
                src="/images/banner/book.jpeg"
                alt="Our Professionals"
                className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-110"
              />
              {/* Subtle overlay to blend if needed, but the requested design shows full image */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B83]/10 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Background Decorative Element (matching the high-end look) */}
          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        </div>

      </div>
    </section>
  );
};

export default FinalCTA;
