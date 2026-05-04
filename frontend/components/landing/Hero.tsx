"use client";

import React, { useState } from "react";
import { Button, Carousel } from "antd";
import { Search, Check, MapPin, Navigation } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const heroImages = [
  "/images/hero/p1.jpeg",
  "/images/hero/p2.jpeg",
  "/images/hero/p3.jpeg",
];

const Hero = () => {
  const { scrollY } = useScroll();
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [detecting, setDetecting] = useState(false);

  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const imageY = useTransform(scrollY, [0, 500], [0, 50]);
  const bgY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative overflow-hidden bg-[#FCF8FF] pt-8 pb-24 md:pt-12 md:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ y: textY }}
            transition={{ duration: 0.6 }}
            className="mt-7 md:mt-11 lg:mt-15"
          >

            <h1 className="text-4xl font-extrabold tracking-tight text-[#171717] md:text-5xl lg:text-6xl leading-[1.1]">
              Book Trusted <br />
              Home Services <br />
              <span className="text-[#1D2B83]">in Minutes</span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-500 font-medium">
              Fast, reliable technicians at your doorstep
            </p>

            {/* Search Bar */}
            <div className="mt-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search AC repair, electrician…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button className="bg-[#1D2B83] hover:bg-[#16226b] active:scale-95 text-white text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap">
                  Search
                </button>
              </div>
            </div>

            {/* Trending */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[12px] font-bold tracking-widest text-slate-400">
              <span className="uppercase">Trending:</span>
              <div className="flex gap-4 text-[#1D2B83]">
                <button className="hover:opacity-80" onClick={() => setSearchQuery("Deep Cleaning")}>Deep Cleaning</button>
                <button className="hover:opacity-80" onClick={() => setSearchQuery("AC Service")}>AC Service</button>
                <button className="hover:opacity-80" onClick={() => setSearchQuery("Massage")}>Massage</button>
              </div>
            </div>

            <div className="mt-10">
              <motion.div
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                initial="initial"
                variants={{
                  initial: { scale: 1 },
                  hover: { scale: 1.05 }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-fit"
              >
                <Link
                  href="/services"
                  className="relative overflow-hidden bg-[#1D2B83] text-white text-[12px] font-bold uppercase tracking-[0.2em] px-12 py-5 rounded-[40px] shadow-2xl flex items-center gap-3 isolate w-fit border-2 border-[#1D2B83] transition-all duration-400 hover:border-[#1D2B83] hover:bg-[#1D2B83]"
                >
                  {/* Radial Highlight Effect from Boton Elegante */}
                  <motion.div
                    variants={{
                      initial: { scale: 0 },
                      hover: { scale: 4 }
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 pointer-events-none -z-10"
                    style={{
                      background: "radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 70%)",
                    }}
                  />

                  <span className="relative z-10">Book Now</span>

                  <motion.div
                    variants={{
                      initial: { x: 0 },
                      hover: { x: 6 }
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="relative z-10"
                  >
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Image & Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ y: imageY }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-8 md:mt-12 lg:mt-16"
          >
            <div className="relative w-full h-[500px] md:h-[600px]">              {/* Image Container with rounding and overflow for the carousel */}
              <div className="h-full w-full overflow-hidden rounded-[3rem] bg-slate-50 shadow-2xl">
                <Carousel autoplay effect="fade" speed={1000} autoplaySpeed={3000} dots={false}>
                  {heroImages.map((src, index) => (
                    <div key={index} className="h-[500px] md:h-[600px]">
                      <img
                        src={src}
                        alt={`Technician ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* Trust Badge matching the reference image - now OUTSIDE the overflow hidden container */}
              <div className="absolute -bottom-8 -left-8 z-20">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex items-center gap-6 rounded-[2rem] bg-white p-7 shadow-2xl shadow-slate-300 border border-slate-50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1D2B83] text-white">
                    <Check className="h-8 w-8" strokeWidth={4} />
                  </div>
                  <div className="pr-2">
                    <h4 className="text-xl font-extrabold text-[#171717] leading-tight">5,000+ Experts</h4>
                    <p className="mt-1 text-sm font-medium text-slate-500 whitespace-nowrap">Verified & Background Checked</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decorative background blur */}
            <motion.div
              style={{ y: bgY }}
              className="absolute -z-10 -top-10 -right-10 h-64 w-64 rounded-full bg-blue-50 blur-3xl opacity-50"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
