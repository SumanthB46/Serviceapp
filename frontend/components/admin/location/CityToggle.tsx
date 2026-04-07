"use client";

import React from 'react';
import { MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CityToggleProps {
  city: string;
  isActive: boolean;
  onChange: (city: string, value: boolean) => void;
}

const CityToggle: React.FC<CityToggleProps> = ({ city, isActive, onChange }) => {
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={() => onChange(city, !isActive)}
      className={`relative p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 overflow-hidden group ${
        isActive 
          ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/20 text-white' 
          : 'bg-white border-gray-100 hover:border-blue-200 text-gray-500 hover:text-gray-900 group shadow-sm'
      }`}
    >
      {/* Background Pulse Effect for Active */}
      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-white"
        />
      )}

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
           <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isActive ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-blue-50'}`}>
              <MapPin size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'} />
           </div>
           <span className="text-sm font-black tracking-tight">{city}</span>
        </div>
        
        <div className={`w-10 h-6 rounded-full relative transition-colors duration-500 ${isActive ? 'bg-white/40' : 'bg-gray-100'}`}>
           <motion.div 
              animate={{ x: isActive ? 16 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-1 w-4 h-4 rounded-full shadow-sm ${isActive ? 'bg-white' : 'bg-gray-400'}`}
           />
        </div>
      </div>
    </motion.div>
  );
};

export default CityToggle;
