"use client";

import React, { useState, useEffect } from "react";
import { Button } from "antd";
import Link from "next/link";
import { MapPin, ChevronDown } from "lucide-react";
import LocationModal from "./LocationModal";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [location, setLocation] = useState("Select Location");

  useEffect(() => {
    // Load saved location on mount
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) setLocation(savedLocation);

    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLocationSelect = (newLocation: string) => {
    setLocation(newLocation);
    localStorage.setItem("userLocation", newLocation);
    setIsLocationModalOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full border-b border-slate-200 bg-[#FCF8FF]/80 backdrop-blur-md transition-all duration-500 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-bold text-[#1D2B83]">
              ArchitecturalService
            </Link>

            {/* Location Selector */}
            <button 
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-3 group transition-all"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-[#1D2B83] group-hover:bg-[#1D2B83] group-hover:text-white transition-all shadow-sm">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col items-start leading-none">
                {/* <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5">
                  Update Location
                </span> */}
                <div className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">
                    {location}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#1D2B83] group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          <div className="hidden md:block"></div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button type="text" className="font-semibold text-slate-600 hover:text-[#1D2B83]">
                LOGIN
              </Button>
            </Link>
            <Button type="primary" className="bg-[#1D2B83] font-bold h-9">
              SIGN UP
            </Button>
          </div>
        </div>
      </nav>

      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={handleLocationSelect}
      />
    </>
  );
};

export default Navbar;
