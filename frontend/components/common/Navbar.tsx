"use client";

import React, { useState, useEffect } from "react";
import { Button } from "antd";
import Link from "next/link";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
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

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b border-slate-200 bg-[#FCF8FF]/80 backdrop-blur-md transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold text-[#1D2B83]">
            ArchitecturalService
          </Link>
        </div>
        <div className="hidden md:block"></div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button type="text" className="font-semibold text-slate-600 hover:text-[#1D2B83]">
              LOGIN
            </Button>
          </Link>
          <Button type="primary" className="bg-[#1D2B83] font-bold">
            SIGN UP
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
