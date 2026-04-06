"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Clock, DollarSign } from "lucide-react";

export function PartnerHero({ onRegisterClick }: { onRegisterClick: () => void }) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1D2B83] via-[#2a3a9e] to-[#3b4fc0] py-16 px-4">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-white/5 blur-2xl" />
            </div>

            <div className="relative mx-auto max-w-5xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/80 mb-6">
                        Opportunity Awaits
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
                >
                    Earn More.{" "}
                    <span className="text-[#93C5FD]">Work on Your Schedule.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className="mt-6 text-xl text-white/75 max-w-2xl mx-auto"
                >
                    Join as a Service Partner and unlock a world of daily bookings, weekly payouts, and
                    complete flexibility.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.35 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onRegisterClick}
                    className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-[#1D2B83] shadow-lg hover:shadow-xl transition-shadow"
                >
                    Register Now <ArrowRight className="h-4 w-4" />
                </motion.button>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.5 }}
                    className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto"
                >
                    {[
                        { icon: Users, stat: "10,000+", label: "Active Partners" },
                        { icon: Clock, stat: "Flexible", label: "Working Hours" },
                        { icon: DollarSign, stat: "Weekly", label: "Payouts" },
                    ].map(({ icon: Icon, stat, label }, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-extrabold text-white">{stat}</span>
                            <span className="text-xs text-white/60 font-medium">{label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
