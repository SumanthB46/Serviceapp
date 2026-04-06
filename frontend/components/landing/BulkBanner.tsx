"use client";

import React from "react";
import { Building2, ChevronRight, Briefcase, FileText } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const BulkBanner = () => {
  return (
    <section className="bg-white py-12 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ background: "linear-gradient(135deg, #0f172a, #1e3a8a)", backdropFilter: "blur(12px)" }}
          className="relative overflow-hidden rounded-[3rem] p-10 md:p-16 text-white shadow-2xl border border-white/10"
        >
          {/* 3D Decorative Effects matches LoanBanner */}
          <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

            {/* Left Side: Content matches LoanBanner spacing */}
            <div className="flex flex-col gap-6 max-w-xl flex-1">
              <div className="inline-flex items-center gap-3 bg-white/10 text-indigo-200 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Building2 className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100">
                  Apartments & Societies
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Get bulk materials <br />
                & services at <br />
                <span className="text-indigo-400">best price</span>
              </h2>

              <p className="text-indigo-100 text-base md:text-lg max-w-lg leading-relaxed font-medium opacity-80">
                Tailored solutions for large-scale maintenance, deep cleaning, and security services with dedicated account managers and bulk pricing.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                <Link
                  href="/services/bulk-booking"
                  className="group relative inline-flex items-center justify-center bg-white text-slate-900 text-[13px] font-bold uppercase tracking-[0.15em] px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Request Quote
                  <span className="ml-3 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ChevronRight className="h-3 w-3 text-slate-900" />
                  </span>
                </Link>

                <div className="flex items-center gap-2 text-indigo-200 font-medium">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm opacity-80">Get quote in 24 hrs</span>
                </div>
              </div>

              {/* Micro Badges with dark theme */}
              <div className="grid grid-cols-2 gap-4 max-w-md pt-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-200">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-indigo-100 uppercase tracking-tight">Dedicated Manager</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <span className="text-[10px] font-extrabold">GST</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-100 uppercase tracking-tight">GST Invoices</span>
                </div>
              </div>
            </div>

            {/* Right Side: Image/Visual Element */}
            <div className="flex-1 w-full flex justify-center items-center relative">
              <div className="relative w-full aspect-square md:aspect-auto md:h-[400px] flex items-center justify-center">
                {/* Main Visual Image Background */}
                <div className="h-72 w-72 md:h-[350px] md:w-[350px] rounded-[3rem] overflow-hidden shadow-2xl relative isolate border-4 border-white/10 group">
                  <img
                    src="/images/banner/truck.png"
                    alt="Apartment Complex"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-transparent" />
                </div>

                {/* Floating Element - Society Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 md:right-4 bg-white p-6 rounded-3xl shadow-3xl border border-slate-100 max-w-[200px]"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest leading-none">Partner Group</p>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">Elite Residency Solutions</h4>
                  <div className="mt-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    ))}
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

export default BulkBanner;
