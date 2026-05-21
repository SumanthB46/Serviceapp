"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function PartnerRegistrationSection({ formRef }: { formRef: React.RefObject<HTMLDivElement | null> }) {
    return (
        <section ref={formRef} className="py-24 px-4 bg-white relative overflow-hidden" id="register">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-40 pointer-events-none -ml-48 -mb-48" />

            <div className="mx-auto max-w-4xl text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block mb-6"
                >
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#1D2B83] bg-blue-50 px-4 py-1.5 rounded-full shadow-sm">
                        Ready to Start?
                    </span>
                </motion.div>

                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
                >
                    Join the Fixvo <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D2B83] to-blue-600">Partner Network</span>
                </motion.h2>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    Take your business to the next level. Sign up today to connect with thousands of customers looking for your services.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-50 border border-slate-100 p-8 sm:p-12 rounded-[2.5rem] shadow-xl shadow-blue-900/5 max-w-3xl mx-auto relative overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Fast & Simple Onboarding</h3>
                            <ul className="space-y-4">
                                {[
                                    "Create your partner profile",
                                    "Verify your identity via OTP",
                                    "Set up your service portfolio",
                                    "Start receiving bookings!"
                                ].map((step, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-600">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="font-medium text-sm">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-[#1D2B83]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-slate-900 text-center">Ready to jump in?</h4>
                            <p className="text-xs text-slate-500 text-center mb-2">Registration takes less than 2 minutes.</p>
                            
                            <Link href="/signup/verify?role=provider" className="w-full">
                                <button className="w-full group relative flex items-center justify-center overflow-hidden transition-all duration-300 border-none outline-none px-6 py-4 rounded-xl cursor-pointer active:scale-95 shadow-lg shadow-blue-500/20 bg-[#1D2B83] text-white">
                                    <span className="text-xs font-black uppercase tracking-[0.15em] z-10 flex items-center gap-2">
                                        Register Now
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
