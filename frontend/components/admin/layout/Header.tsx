"use client";

import React from 'react';
import { Menu, Search, Bell, Sparkles, Command } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="h-14 bg-white sticky top-0 z-40 flex items-center justify-between px-8 border-b border-gray-100/50">
      <div className="flex items-center gap-4">
        <button
          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="flex items-center gap-5">
        {/* Simple Notifications */}
        <button className="relative p-1.5 text-gray-400 hover:text-blue-600 transition-all">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-5 w-[1px] bg-gray-100 hidden sm:block"></div>

        {/* Clean Profile Area - Thinner styling */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative">
             <img
               src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100"
               alt="Admin Profile"
               className="w-8 h-8 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-all duration-300"
             />
             <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="text-left hidden sm:block">
            <h4 className="text-[12px] font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
              Sudheer Kumar
            </h4>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
