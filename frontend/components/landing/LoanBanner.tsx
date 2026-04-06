"use client";

import React from "react";
import { CreditCard, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const LoanBanner = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[3rem] bg-[#1D2B83] p-10 md:p-16 text-white"
        >
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-400/10 blur-2xl" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Column: Text Content */}
            <div className="flex flex-col gap-6 max-w-xl">
              <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-indigo-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100">
                  Reliable & Secure
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Need help paying? <br />
                <span className="text-indigo-200">Get instant loan</span> <br />
                for your service.
              </h2>

              <p className="text-indigo-100 text-base md:text-lg opacity-80 leading-relaxed font-medium">
                Split your large service payments into small, easy monthly installments. No hidden charges, just pure convenience.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-6">
                <Link
                  href="/services/loans"
                  className="bg-white text-[#1D2B83] text-sm font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 group"
                >
                  Borrow Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-10 w-10 border-2 border-[#1D2B83] rounded-full bg-slate-200" />
                    ))}
                  </div>
                  <span className="text-sm font-bold opacity-80 whitespace-nowrap">5k+ Trusted Users</span>
                </div>
              </div>
            </div>

            {/* Right Column: Image and Decorative Badge */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-full aspect-square md:aspect-auto md:h-[400px] flex items-center justify-center">
                {/* Image Placeholder with Styling */}
                <div className="h-72 w-72 md:h-[350px] md:w-[350px] rounded-[3rem] bg-indigo-500/20 backdrop-blur-3xl p-8 relative isolate overflow-hidden group">


                  {/* Real Image Tag (Can be used if image path exists) */}
                  <img
                    src="/images/banner/loan.png"
                    alt="Loan Highlight"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 mix-blend-overlay"
                  />
                </div>

                {/* Overlapping Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-2 -left-2 bg-white rounded-3xl p-6 shadow-2xl text-slate-900 border border-slate-50 flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <span className="font-extrabold text-lg">0%</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Interest Rate</span>
                    <span className="block text-lg font-extrabold leading-none">Starting EMI</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoanBanner;
