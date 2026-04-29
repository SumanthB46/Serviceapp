"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, ArrowRight, ShieldCheck, Building2, ChevronRight, Briefcase, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PromoBanners() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Auto-scroll every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-12 pb-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="relative w-full h-[650px] md:h-[500px]">
          <AnimatePresence mode="wait">
            {activeIndex === 0 ? (
              <motion.div
                key="loan-banner"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full overflow-hidden rounded-[3rem] bg-[#1D2B83] p-10 md:p-16 text-white shadow-2xl"
              >
                {/* Decorative Background Elements */}
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl animate-pulse" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-400/10 blur-2xl" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10 h-full">
                  <div className="flex flex-col gap-6 max-w-xl">
                    <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                      <ShieldCheck className="h-4 w-4 text-indigo-200" />
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-indigo-100">
                        Reliable & Secure
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                      Need help paying?
                      <span className="text-indigo-200"> Get instant loan </span>
                      for your service.
                    </h2>

                    <p className="text-indigo-100 text-sm md:text-lg opacity-80 leading-relaxed font-medium">
                      Split your large service payments into small, easy monthly installments. No hidden charges, just pure convenience.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Link href="/services/loans" className="relative overflow-hidden bg-white text-[#1D2B83] hover:text-white text-sm font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 flex items-center gap-3 group isolate">
                        <div className="absolute inset-0 bg-indigo-500 scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 -z-10" />
                        Borrow Now
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                      </Link>
                    </div>
                  </div>

                  <div className="relative hidden md:flex justify-center items-center h-full">
                    <div className="h-72 w-72 md:h-[350px] md:w-[350px] rounded-[3rem] bg-indigo-500/20 backdrop-blur-3xl p-8 relative isolate overflow-hidden group">
                      <img src="/images/banner/loan.png" alt="Loan Highlight" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 mix-blend-overlay" />
                    </div>
                    <div className="absolute -bottom-1 -left-2 bg-white rounded-3xl p-4 shadow-2xl text-slate-900 border border-slate-50 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <span className="font-extrabold text-xs">0%</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Interest Rate</span>
                        <span className="block text-xs font-extrabold leading-none">Starting EMI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="bulk-banner"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ background: "linear-gradient(135deg, #0f172a, #1e3a8a)" }}
                className="absolute inset-0 w-full overflow-hidden rounded-[3rem] p-10 md:p-16 text-white shadow-2xl border border-white/10"
              >
                <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10 h-full">
                  <div className="flex flex-col gap-6 max-w-xl flex-1">
                    <div className="inline-flex w-fit items-center gap-3 bg-white/10 text-indigo-200 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <Building2 className="h-5 w-5" />
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-indigo-100">
                        Apartments & Societies
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                      Get bulk materials & services at
                      <span className="text-indigo-400"> best price</span>
                    </h2>

                    <p className="text-indigo-100 text-sm md:text-lg max-w-lg leading-relaxed font-medium opacity-80">
                      Tailored solutions for large-scale maintenance, deep cleaning, and security services with dedicated account managers and bulk pricing.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4">
                      <Link href="/services/bulk-booking" className="relative overflow-hidden bg-white text-[#1D2B83] hover:text-white text-sm font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 flex items-center gap-3 group isolate">
                        <div className="absolute inset-0 bg-indigo-500 scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 -z-10" />
                        Request Quote
                        <span className="ml-3 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center transition-transform group-hover:translate-x-1">
                          <ChevronRight className="h-3 w-3 text-slate-900" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-1 w-full justify-center items-center relative h-full">
                    <div className="h-72 w-72 md:h-[350px] md:w-[350px] rounded-[3rem] overflow-hidden shadow-2xl relative isolate border-4 border-white/10 group">
                      <img src="/images/banner/truck.png" alt="Apartment Complex" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 mix-blend-overlay" />
                    </div>
                    <div className="absolute -top-4 -right-4 md:right-4 bg-white p-5 rounded-3xl shadow-3xl border border-slate-100 max-w-[200px]">
                      <p className="text-[8px] font-bold text-slate-400 uppercase mb-2 tracking-widest leading-none">Partner Group</p>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">Elite Residency Solutions</h4>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={() => setActiveIndex(0)}
            className={`transition-all duration-300 rounded-full ${activeIndex === 0 ? "w-10 h-2 bg-[#1D2B83]" : "w-2 h-2 bg-slate-300 hover:bg-slate-400"}`}
            aria-label="Go to slide 1"
          />
          <button
            onClick={() => setActiveIndex(1)}
            className={`transition-all duration-300 rounded-full ${activeIndex === 1 ? "w-10 h-2 bg-[#1D2B83]" : "w-2 h-2 bg-slate-300 hover:bg-slate-400"}`}
            aria-label="Go to slide 2"
          />
        </div>
      </div>
    </section>
  );
}
