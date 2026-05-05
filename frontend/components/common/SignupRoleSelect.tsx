"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, type: "spring", bounce: 0.35 },
  }),
};

const SignupRoleSelect = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F3F4F8] flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D2B83] tracking-tight">
          Join Us
        </h1>
        <p className="mt-3 text-slate-500 text-base font-medium">
          Choose your path to get started.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Customer Card */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
        >
          <div className="w-full h-52 overflow-hidden">
            <img
              src="/images/signup/Customer.png"
              alt="Book a Service"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div className="p-7 flex flex-col flex-1">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.18em] text-[#1D2B83] bg-blue-50 px-3 py-1 rounded-full w-fit mb-4">
              Consumer
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3 leading-tight">
              Book a Service
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">
              Discover and book elite home services in minutes. Experience the ultimate level of care and precision.
            </p>
            <button
              onClick={() => router.push("/register?role=customer")}
              className="mt-8 w-full bg-[#1D2B83] hover:bg-[#16226b] active:scale-95 text-white font-bold text-sm uppercase tracking-[0.15em] py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-100"
            >
              Continue
            </button>
          </div>
        </motion.div>

        {/* Provider Card */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
        >
          <div className="w-full h-52 overflow-hidden">
            <img
              src="/images/signup/SP.png"
              alt="Become a Service Provider"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div className="p-7 flex flex-col flex-1">
            <span className="inline-block text-[9px] font-black uppercase tracking-[0.18em] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-4">
              Partner
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3 leading-tight">
              Become a Service Provider
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">
              Grow your business by providing premium services to our community. Gain access to elite clients and tools.
            </p>
            <button
              onClick={() => router.push("/register?role=provider")}
              className="mt-8 w-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-sm uppercase tracking-[0.15em] py-4 rounded-2xl transition-all duration-300"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 text-sm text-slate-500"
      >
        Already have an account?{" "}
        <Link href="/login" className="text-[#1D2B83] font-bold hover:underline">
          Log In
        </Link>
      </motion.p>
    </div>
  );
};

export default SignupRoleSelect;
