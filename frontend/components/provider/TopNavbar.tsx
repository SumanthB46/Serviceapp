"use client";

import React, { useState } from "react";
import { Menu, Bell, Search, User, ChevronDown, UserCircle, Settings, LogOut } from "lucide-react";
import Link from "next/link";

interface TopNavbarProps {
  onOpenSidebar: () => void;
}

export default function TopNavbar({ onOpenSidebar }: TopNavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8">
      <div className="h-full flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSidebar}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-96">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search bookings, services..." 
              className="bg-transparent border-none outline-none text-sm text-slate-600 w-full"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Notifications */}
          <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="relative">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="hidden lg:block text-right">
                <span className="block text-sm font-bold text-slate-900">Aryan Sharma</span>
                <span className="block text-xs font-medium text-emerald-600">Active • Online</span>
              </div>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 transition-all border border-slate-100"
              >
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan" 
                    alt="Profile"
                    className="h-full w-full object-cover" 
                  />
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 hidden sm:block transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl z-20 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Account</p>
                  </div>
                  
                  <Link 
                    href="/provider/profile" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                  >
                    <UserCircle className="h-5 w-5 text-slate-400" />
                    Edit Profile
                  </Link>
                  
                  <Link 
                    href="/provider/settings" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                  >
                    <Settings className="h-5 w-5 text-slate-400" />
                    Account Settings
                  </Link>

                  <div className="border-t border-slate-50 mt-2 pt-2">
                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all">
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
